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
 * @package    mod_recitcahiertraces
 * @subpackage backup-moodle2
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Define all the restore steps that will be used by the restore_recitcahiertraces_activity_task
 */

require_once($CFG->dirroot . "/mod/recitcahiertraces/classes/PersistCtrlCahierTraces.php");

/**
 * Structure step to restore one recitcahiertraces activity
 */
class restore_recitcahiertraces_activity_structure_step extends restore_activity_structure_step {
    protected function define_structure() {

        $paths = array();
        $paths[] = new restore_path_element('recitcahiertraces', '/activity/recitcahiertraces');
        $paths[] = new restore_path_element('recitct_cm_notes', '/activity/recitcahiertraces/recitct_cm_notes');
     //   $paths[] = new restore_path_element('recitct_user_notes', '/activity/recitcahiertraces/recitct_cm_notes/recitct_user_notes');

        // Return the paths wrapped into standard activity structure
        return $this->prepare_activity_structure($paths);
    }

    protected function process_recitcahiertraces($data) {
        global $DB, $USER;

        $data = (object)$data;
        $oldId = $data->id;
        $data->course = $this->get_courseid();

        // Any changes to the list of dates that needs to be rolled should be same during course restore and course reset.
        // See MDL-9367.

        // insert the recitcahiertraces record
        $newitemid = $DB->insert_record('recitcahiertraces', $data);     
        
        // immediately after inserting "activity" record, call this
        $this->apply_activity_instance($newitemid);
        $this->set_mapping('recitcahiertraces', $oldId, $newitemid, true); // Has related files.
    }

    protected function process_recitct_cm_notes($data) {
        global $DB, $USER;

        //fwrite($fp, print_r($data, true) . chr(10));

        $data = (object)$data;
        $oldid = $data->id;
        
        $data->ccid = $this->get_mappingid('recitcahiertraces', $data->ccid);
        $data->cmid = CahierTracesPersistCtrl::getInstance($DB, $USER)->getCmIdFromIndexPos($data->ccid, $data->cmindexpos);

        if($data->cmid > 0){
            $newitemid = $DB->insert_record('recitct_cm_notes', $data); // insert the recitct_cm_notes record
            $this->set_mapping('recitct_cm_notes', $oldid, $newitemid, true); 
        }
        
        /*
        // get the new courseModuleId according to their position in the section. To find out the section, it uses the previous ccId
        $oldSectionCmSeq = CahierTracesPersistCtrl::getInstance($DB, $USER)->getCmSequenceFromSection($data->ccid);
        $data->ccid = $this->get_mappingid('recitcahiertraces', $data->ccid);
        $newSectionCmSeq = CahierTracesPersistCtrl::getInstance($DB, $USER)->getCmSequenceFromSection($data->ccid);

        // both the sequences must have be identical because it is a course backup, so we can use the index to look for the new cmId
        $key = array_search((string) $data->cmid, $oldSectionCmSeq->sequence);
        
        //fwrite($fp, print_r($oldSectionCmSeq, true) . chr(10));
        //fwrite($fp, print_r($newSectionCmSeq, true) . chr(10));
        //fwrite($fp, $key . chr(10));

        if(isset($newSectionCmSeq->sequence[$key])){
            $data->cmid = $newSectionCmSeq->sequence[$key];
            $newitemid = $DB->insert_record('recitct_cm_notes', $data); // insert the recitct_cm_notes record
            $this->set_mapping('recitct_cm_notes', $oldid, $newitemid, true); 
        }*/       

        //fwrite($fp, $data->cmid . chr(10));
        //fclose($fp);
    }

   /* protected function process_recitct_user_notes($data) {
        global $DB;

        $data = (object)$data;
        $data->cccmid = $this->get_mappingid('recitct_cm_notes', $data->cccmid);

        // insert the recitct_user_notes record
        $newitemid = $DB->insert_record('recitct_user_notes', $data);
    }*/

    protected function after_execute() {
        // Add recitcahiertraces related files, no need to match by itemname (just internally handled context)
        $this->add_related_files('mod_recitcahiertraces', 'intro', null);
        //$this->add_related_files('mod_recitct_user_notes', 'note', null);
        //$this->add_related_files('mod_recitct_user_notes', 'feedback', null);
    }
}

