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

/**
 * Define all the backup steps that will be used by the backup_recitcahiertraces_activity_task
 *
 * @package    mod_recitcahiertraces
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die;

 /**
 * Define the complete recitcahiertraces structure for backup, with file and id annotations
 */
class backup_recitcahiertraces_activity_structure_step extends backup_activity_structure_step {

    protected function define_structure() {
        global $DB, $USER;

        // To know if we are including userinfo
        $userinfo = $this->get_setting_value('userinfo');

        // Define each element separated
        $recitcahiertraces = new backup_nested_element('recitcahiertraces', array('id'), array(
            'course', 'name', 'intro', 'introformat', 'display', 'timemodified'));

        $recitct_groups = new backup_nested_element('recitct_groups', array('id'), array('ctid', 'name', 'slot'));

        $recitct_notes = new backup_nested_element('recitct_notes', array('id'), array(
            'intcode', 'gid', 'title', 'slot', 'templatenote', 'suggestednote', 'teachertip', 'notifyteacher', 'lastupdate'));

       $recitct_user_notes = new backup_nested_element('recitct_user_notes', array('id'), array('nid', 'userid', 'note', 'note_itemid', 'feedback', 'grade', 'lastupdate', 'cmid'));

        // Build the tree
       $recitct_groups->add_child($recitct_notes);
       $recitct_notes->add_child($recitct_user_notes);
       $recitcahiertraces->add_child($recitct_groups);

        // Define sources
        $recitcahiertraces->set_source_table('recitcahiertraces', array('id' => backup::VAR_ACTIVITYID));
        $recitct_groups->set_source_table('recitct_groups', array('ctid' => backup::VAR_PARENTID));
        $recitct_notes->set_source_table('recitct_notes', array('gid' => backup::VAR_PARENTID));

        if ($userinfo){
            $recitct_user_notes->set_source_table('recitct_user_notes', array('nid' => backup::VAR_PARENTID));
        }

        // Define id annotations
        //$recitcahiertraces->annotate_ids('question', 'questionid');
        $recitct_user_notes->annotate_ids('user', 'userid');
        $recitct_user_notes->annotate_ids('cm', 'cmid');
        
        // Define file annotations
        $recitcahiertraces->annotate_files('mod_recitcahiertraces', 'intro', null);
        if ($userinfo){
            $recitcahiertraces->annotate_files('mod_recitcahiertraces', 'usernote', null);
        }

        // Return the root element (recitcahiertraces), wrapped into standard activity structure
        return $this->prepare_activity_structure($recitcahiertraces);

    }
}
