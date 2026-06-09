<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

namespace mod_recitcahiertraces\privacy;

use core_privacy\local\metadata\collection;
use core_privacy\local\request\approved_contextlist;
use core_privacy\local\request\context;
use core_privacy\local\request\contextlist;
use core_privacy\local\request\transform;
use core_privacy\local\request\writer;
use core_privacy\local\request\userlist;
use \core_privacy\local\request\approved_userlist;

defined('MOODLE_INTERNAL') || die();

/**
 * Personal data (the student's notes, the teacher's feedback on them, and any files uploaded
 * through the note editor) lives in {recitct_user_notes}, scoped to the course module (CONTEXT_MODULE)
 * context of the "Cahier de traces" instance the note belongs to — not in a user context.
 */
class provider implements
        \core_privacy\local\metadata\provider,
        \core_privacy\local\request\core_userlist_provider,
        \core_privacy\local\request\plugin\provider {

    /**
     * Returns meta data about this system.
     *
     * @param   collection $collection The initialised collection to add items to.
     * @return  collection     A listing of user data stored through this system.
     */
    public static function get_metadata(collection $collection) : collection {
        $collection->add_database_table(
            'recitct_user_notes',
            [
                'cmid' => 'privacy:metadata:recitct_user_notes:cmid',
                'feedback' => 'privacy:metadata:recitct_user_notes:feedback',
                'lastupdate' => 'privacy:metadata:recitct_user_notes:lastupdate',
                'nid' => 'privacy:metadata:recitct_user_notes:nid',
                'note' => 'privacy:metadata:recitct_user_notes:note',
                'note_itemid' => 'privacy:metadata:recitct_user_notes:note_itemid',
                'userid' => 'privacy:metadata:recitct_user_notes:userid',
            ],
            'privacy:metadata:recitct_user_notes'
        );

        $collection->add_subsystem_link('core_files', [], 'privacy:metadata:core_files');

        return $collection;
    }

    /**
     * Get the list of contexts that contain user information for the specified user.
     *
     * @param   int $userid The user to search.
     * @return  contextlist   $contextlist  The contextlist containing the list of contexts used in this plugin.
     */
    public static function get_contexts_for_userid(int $userid) : contextlist {
        $sql = "SELECT ctx.id
                  FROM {context} ctx
                  JOIN {course_modules} cm ON cm.id = ctx.instanceid AND ctx.contextlevel = :modlevel
                  JOIN {modules} m ON m.id = cm.module AND m.name = :modname
                  JOIN {recitcahiertraces} r ON r.id = cm.instance
                  JOIN {recitct_groups} g ON g.ct_id = r.id
                  JOIN {recitct_notes} n ON n.gid = g.id
                  JOIN {recitct_user_notes} un ON un.nid = n.id
                 WHERE un.userid = :userid";

        $params = [
            'modlevel' => CONTEXT_MODULE,
            'modname' => 'recitcahiertraces',
            'userid' => $userid,
        ];

        $contextlist = new contextlist();
        $contextlist->add_from_sql($sql, $params);
        return $contextlist;
    }

    /**
     * Get the list of users within a specific context.
     *
     * @param userlist $userlist The userlist containing the list of users who have data in this context/plugin combination.
     */
    public static function get_users_in_context(userlist $userlist) {
        $context = $userlist->get_context();

        if (!$context instanceof \context_module) {
            return;
        }

        $cm = get_coursemodule_from_id('recitcahiertraces', $context->instanceid);
        if (!$cm) {
            return;
        }

        $sql = "SELECT un.userid
                  FROM {recitcahiertraces} r
                  JOIN {recitct_groups} g ON g.ct_id = r.id
                  JOIN {recitct_notes} n ON n.gid = g.id
                  JOIN {recitct_user_notes} un ON un.nid = n.id
                 WHERE r.id = :ctid";

        $userlist->add_from_sql('userid', $sql, ['ctid' => $cm->instance]);
    }

    /**
     * Export all user data for the specified user, in the specified contexts.
     *
     * @param   approved_contextlist $contextlist The approved contexts to export information for.
     */
    public static function export_user_data(approved_contextlist $contextlist) {
        global $DB;

        $user = $contextlist->get_user();

        foreach ($contextlist->get_contexts() as $context) {
            if (!$context instanceof \context_module) {
                continue;
            }

            $cm = get_coursemodule_from_id('recitcahiertraces', $context->instanceid);
            if (!$cm) {
                continue;
            }

            $sql = "SELECT un.id, un.note, un.note_itemid, un.feedback, un.lastupdate, n.title
                      FROM {recitcahiertraces} r
                      JOIN {recitct_groups} g ON g.ct_id = r.id
                      JOIN {recitct_notes} n ON n.gid = g.id
                      JOIN {recitct_user_notes} un ON un.nid = n.id
                     WHERE r.id = :ctid AND un.userid = :userid
                     ORDER BY n.id";

            $records = $DB->get_records_sql($sql, ['ctid' => $cm->instance, 'userid' => $user->id]);
            if (empty($records)) {
                continue;
            }

            $subcontext = [get_string('pluginname', 'mod_recitcahiertraces')];
            $notes = [];
            foreach ($records as $record) {
                $notes[] = (object) [
                    'note_title' => $record->title,
                    'note' => $record->note,
                    'feedback' => $record->feedback,
                    'lastupdate' => transform::datetime($record->lastupdate),
                ];

                if (!empty($record->note_itemid)) {
                    writer::with_context($context)->export_area_files(
                        array_merge($subcontext, [$record->id]),
                        'mod_recitcahiertraces',
                        'usernote',
                        $record->note_itemid
                    );
                }
            }

            writer::with_context($context)->export_data($subcontext, (object) ['notes' => $notes]);
        }
    }

    /**
     * Delete all data for all users in the specified context.
     *
     * @param   context $context The specific context to delete data for.
     */
    public static function delete_data_for_all_users_in_context(\context $context) {
        if (!$context instanceof \context_module) {
            return;
        }

        $cm = get_coursemodule_from_id('recitcahiertraces', $context->instanceid);
        if (!$cm) {
            return;
        }

        self::delete_notes_and_files(
            $context,
            "nid IN (SELECT n.id FROM {recitct_notes} n JOIN {recitct_groups} g ON g.id = n.gid WHERE g.ct_id = ?)",
            [$cm->instance]
        );
    }

    /**
     * Delete multiple users within a single context.
     *
     * @param approved_userlist $userlist The approved context and user information to delete information for.
     */
    public static function delete_data_for_users(approved_userlist $userlist) {
        global $DB;

        $context = $userlist->get_context();
        if (!$context instanceof \context_module) {
            return;
        }

        $cm = get_coursemodule_from_id('recitcahiertraces', $context->instanceid);
        if (!$cm) {
            return;
        }

        $userids = $userlist->get_userids();
        if (empty($userids)) {
            return;
        }

        list($insql, $inparams) = $DB->get_in_or_equal($userids);
        $params = array_merge($inparams, [$cm->instance]);

        self::delete_notes_and_files(
            $context,
            "userid $insql AND nid IN (SELECT n.id FROM {recitct_notes} n JOIN {recitct_groups} g ON g.id = n.gid WHERE g.ct_id = ?)",
            $params
        );
    }

    /**
     * Delete all user data for the specified user, in the specified contexts.
     *
     * @param   approved_contextlist $contextlist The approved contexts and user information to delete information for.
     */
    public static function delete_data_for_user(approved_contextlist $contextlist) {
        $user = $contextlist->get_user();

        foreach ($contextlist->get_contexts() as $context) {
            if (!$context instanceof \context_module) {
                continue;
            }

            $cm = get_coursemodule_from_id('recitcahiertraces', $context->instanceid);
            if (!$cm) {
                continue;
            }

            self::delete_notes_and_files(
                $context,
                "userid = ? AND nid IN (SELECT n.id FROM {recitct_notes} n JOIN {recitct_groups} g ON g.id = n.gid WHERE g.ct_id = ?)",
                [$user->id, $cm->instance]
            );
        }
    }

    /**
     * Remove the {recitct_user_notes} rows matching $select/$params from the given module context,
     * along with any files attached to them through the note editor (mod_recitcahiertraces/usernote).
     */
    private static function delete_notes_and_files(\context $context, string $select, array $params) {
        global $DB;

        $records = $DB->get_records_select('recitct_user_notes', $select, $params, '', 'id, note_itemid');
        if (empty($records)) {
            return;
        }

        $fs = get_file_storage();
        foreach ($records as $record) {
            if (!empty($record->note_itemid)) {
                $fs->delete_area_files($context->id, 'mod_recitcahiertraces', 'usernote', $record->note_itemid);
            }
        }

        $DB->delete_records_select('recitct_user_notes', $select, $params);
    }
}
