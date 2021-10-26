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
 * @package   mod_recitcahiertraces
 * @copyright 2019 RÉCIT FAD
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die;

require_once($CFG->dirroot . "/local/recitcommon/php/Utils.php");
require_once(__DIR__ . "/classes/PersistCtrl.php");

use recitcommon\Utils;
use recitcahiertraces\PersistCtrl;

/**
 * List of features supported in recitcahiertraces module
 * @param string $feature FEATURE_xx constant for requested feature
 * @return mixed True if module supports feature, false if not, null if doesn't know
 */
function recitcahiertraces_supports($feature) {
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
 * Add recitcahiertraces instance.
 * @param object $data
 * @param object $mform
 * @return int new recitcahiertraces instance id
 */
function recitcahiertraces_add_instance($data, $mform) {
    global $CFG, $DB;

    $data->timemodified = time();
    $data->id = $DB->insert_record('recitcahiertraces', $data);
    return $data->id;
}

/**
 * Update recitcahiertraces instance.
 * @param object $data
 * @param object $mform
 * @return bool true
 */
function recitcahiertraces_update_instance($data, $mform) {
    global $CFG, $DB;

    $data->timemodified = time();
    $data->id           = $data->instance;

    $DB->update_record('recitcahiertraces', $data);

    return true;
}

/**
 * Delete recitcahiertraces instance.
 * @param int $id
 * @return bool true
 */
function recitcahiertraces_delete_instance($id) {
    global $DB, $USER;

   /* if (!$recitcahiertraces = $DB->get_record('recitcahiertraces', array('id'=>$id))) {
        return false;
    }

    $cm = get_coursemodule_from_instance('recitcahiertraces', $id);

    $DB->delete_records('recitcahiertraces', array('id'=>$recitcahiertraces->id));*/

    return PersistCtrl::getInstance($DB, $USER)->removeCcInstance($id);
}

function recitcahiertraces_reset_userdata($data) {
    global $DB, $USER;
    if (!empty($data->reset_userdata)) {
        $recitcahiertraces = $DB->get_records('recitcahiertraces', array('course'=>$data->courseid));
        foreach ($recitcahiertraces as $v){
            $id = $v->id;
            PersistCtrl::getInstance($DB, $USER)->removeCCUserdata($id);
        }
    }
    return array(
        array('component' => get_string('modulenameplural', 'recitcahiertraces'),
        'item' => get_string('modulenameplural', 'recitcahiertraces'),
        'error' => false)
    );
}

function recitcahiertraces_reset_course_form_defaults($course) {
    return array('reset_userdata' => 1);
}

function recitcahiertraces_reset_course_form_definition(&$mform) {
    $mform->addElement('header', 'recitcahiertracesheader', get_string('modulenameplural', 'recitcahiertraces'));

    $mform->addElement('checkbox', 'reset_userdata', get_string('reset'));

}

/**
 * file serving callback
 *
 * @package  mod_recitcahiertraces
 * @category files
 * @param stdClass $course course object
 * @param stdClass $cm course module object
 * @param stdClass $context context object
 * @param string $filearea file area
 * @param array $args extra arguments
 * @param bool $forcedownload whether or not force download
 * @param array $options additional options affecting the file serving
 * @return bool false if the file was not found, just send the file otherwise and do not return anything
 */
function mod_recitcahiertraces_pluginfile($course, $cm, $context, $filearea, $args, $forcedownload, array $options=array()) {
    global $CFG, $USER, $DB;

    /*if ($context->contextlevel != CONTEXT_MODULE) {
        return false;
    }*/
    require_login();
    
    //require_once($CFG->dirroot . "/mod/wiki/locallib.php");

    if ($filearea == 'usernote') {
        $itemId = (int) array_shift($args);
        $ownerId = PersistCtrl::getInstance($DB, $USER)->getUserFromItemId($itemId);
        
        $roles = Utils::getUserRoles($course->id, $USER->id);
        if((Utils::isAdminRole($roles) == false) && ($USER->id != $ownerId)){
            return false;
        }
        
        //if (!$subwiki = wiki_get_subwiki($swid)) {
        //    return false;
        //}

        //require_capability('mod/wiki:viewpage', $context);

        $relativepath = implode('/', $args);

        $fullpath = "/$context->id/mod_recitcahiertraces/usernote/$itemId/$relativepath";

        $fs = get_file_storage();
		$file = $fs->get_file_by_hash(sha1($fullpath));		
        
        if($file == false){
            return false;
        }
        
        if ($file->is_directory()){		
            return false;
        }

        send_stored_file($file, null, 0, $options);
    }
}