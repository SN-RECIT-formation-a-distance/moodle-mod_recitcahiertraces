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

require_once(__DIR__ . "/classes/recitcommon/Utils.php");
require_once(__DIR__ . "/classes/PersistCtrl.php");

use recitcahiertraces\Utils;
use recitcahiertraces\PersistCtrl;

/**
 * Initialise the js strings required for this module.
 */
function recitcahiertraces_strings_for_js() {
    global $PAGE; 

    $PAGE->requires->strings_for_js(array(
        'pluginname','turnOnEditingMode','reset','infobs','preview','turnOffEditingMode','clonegroup','selectGroup','print','previousstudent','nextstudent','selectUser','selectOption','previous','next','activity','noteTitle','templateNote','studentNote','teacherFeedback','edit','close','save','remove','cancel','copy','selectSectionActivity','integrationCode','addNewNote','msgActionCompleted','msgConfirmDeletion','msgDeletionExtraInfo','nodata','recitcahiertraces:viewadmin','recitcahiertraces:view','recitcahiertraces:addinstance','printNotes','note','suggestednote','timestamp','printedOn','forbiddenAccess','msgCCSeqPos','course','module','report','full_name','email','tags','typeToSearch','messageprovider:note_updated','group','suggestedresponse','invalidargument', 'newupdateinnote','msgsuccess','saveandclose','student','progress','notenotcompleted','notenotrestored','feedbackrequired','givefeedback','feedbackmissing','viewnotes','mynotes','notegroup','title','notifyteacheruponupdate','position','yes','no','notetemplate','teachertips','selectnotegroup','addgroup','ordergroup','order','importcc','addnote','deletegroup','editgroup','groupname','moveitem','nblines','color','savebtn','savebtndesc','resetbtn','resetbtndesc','createintegrationcode'   ), 'mod_recitcahiertraces');
}
/**
 * List of features supported in recitcahiertraces module
 * @param string $feature FEATURE_xx constant for requested feature
 * @return mixed True if module supports feature, false if not, null if doesn't know
 */
function recitcahiertraces_supports($feature) {
    global $CFG;
    if ($CFG->version >= 2022041900){//Moodle 4.0
        return recitcahiertraces_supports_moodle4($feature);
    }else{
        return recitcahiertraces_supports_moodle3($feature);
    }
}

function recitcahiertraces_supports_moodle3($feature) {
    switch($feature) {
        case FEATURE_MOD_INTRO:               return true;
        case FEATURE_COMPLETION_TRACKS_VIEWS: return true;
        case FEATURE_BACKUP_MOODLE2:          return true;
        case FEATURE_SHOW_DESCRIPTION:        return true;

        default: return null;
    }
}

function recitcahiertraces_supports_moodle4($feature) {
    switch($feature) {
        case FEATURE_MOD_INTRO:               return true;
        case FEATURE_COMPLETION_TRACKS_VIEWS: return true;
        case FEATURE_BACKUP_MOODLE2:          return true;
        case FEATURE_SHOW_DESCRIPTION:        return true;
        case FEATURE_MOD_PURPOSE: return MOD_PURPOSE_COMMUNICATION;

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
    if (!empty($data->reset_userrecitctdata)) {
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
    return array('reset_userrecitctdata' => 1);
}

function recitcahiertraces_reset_course_form_definition(&$mform) {
    $mform->addElement('header', 'recitcahiertracesheader', get_string('modulenameplural', 'recitcahiertraces'));

    $mform->addElement('checkbox', 'reset_userrecitctdata', get_string('reset'));

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
    

    if ($filearea == 'usernote') {
        $itemId = (int) array_shift($args);
        
        

        $relativepath = implode('/', $args);

        $fullpath = "/$context->id/mod_recitcahiertraces/usernote/$itemId/$relativepath";

        $fs = get_file_storage();
		$file = $fs->get_file_by_hash(sha1($fullpath));
        
        if($file == false){
            return false;
        }

        $roles = Utils::getUserRoles($course->id, $USER->id);

        /*
            // DEBUG
            ob_start();
            var_dump($file);
            $debug_dump = ob_get_clean();
            file_put_contents('/var/log/moodle-debug.log', $debug_dump); // Write the contents back to the file
        */
        
        if((Utils::isAdminRole($roles) == false) && ($USER->id != $file->get_userid())){
            return false;
        }
        
        if ($file->is_directory()){		
            return false;
        }

        send_stored_file($file, null, 0, $options);
    }
}