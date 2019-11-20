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
 *
 * @package   mod_recitcahiercanada
 * @copyright 2019 RÉCIT FAD
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die;

require_once($CFG->dirroot . "/local/recitcommon/php/PersistCtrl.php");

/**
 * List of features supported in recitcahiercanada module
 * @param string $feature FEATURE_xx constant for requested feature
 * @return mixed True if module supports feature, false if not, null if doesn't know
 */
function recitcahiercanada_supports($feature) {
    switch($feature) {
        //case FEATURE_MOD_ARCHETYPE:           return MOD_ARCHETYPE_RESOURCE;
        //case FEATURE_GROUPS:                  return false;
        //case FEATURE_GROUPINGS:               return false;
        case FEATURE_MOD_INTRO:               return true;
        case FEATURE_COMPLETION_TRACKS_VIEWS: return true;
        //case FEATURE_GRADE_HAS_GRADE:         return false;
        //case FEATURE_GRADE_OUTCOMES:          return false;
        case FEATURE_BACKUP_MOODLE2:          return true;
        case FEATURE_SHOW_DESCRIPTION:        return true;

        default: return null;
    }
}

/**
 * Add RecitCahierCanada instance.
 * @param object $data
 * @param object $mform
 * @return int new RecitCahierCanada instance id
 */
function recitcahiercanada_add_instance($data, $mform) {
    global $CFG, $DB;

    $data->timemodified = time();
    $data->id = $DB->insert_record('recitcahiercanada', $data);
    return $data->id;
}

/**
 * Update RecitCahierCanada instance.
 * @param object $data
 * @param object $mform
 * @return bool true
 */
function recitcahiercanada_update_instance($data, $mform) {
    global $CFG, $DB;

    $data->timemodified = time();
    $data->id           = $data->instance;

    $DB->update_record('recitcahiercanada', $data);

    return true;
}

/**
 * Delete RecitCahierCanada instance.
 * @param int $id
 * @return bool true
 */
function recitcahiercanada_delete_instance($id) {
    global $DB, $USER;

   /* if (!$recitcahiercanada = $DB->get_record('recitcahiercanada', array('id'=>$id))) {
        return false;
    }

    $cm = get_coursemodule_from_instance('recitcahiercanada', $id);

    $DB->delete_records('recitcahiercanada', array('id'=>$recitcahiercanada->id));*/

    return PersistCtrl::getInstance($DB, $USER)->removeCcInstance($id);
}

