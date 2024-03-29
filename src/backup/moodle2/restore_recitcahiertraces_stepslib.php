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

/**
 * Structure step to restore one recitcahiertraces activity
 */
class restore_recitcahiertraces_activity_structure_step extends restore_activity_structure_step {
    protected function define_structure() {

        $userinfo = $this->get_setting_value('userinfo');
        
        $paths = array();
        $paths[] = new restore_path_element('recitcahiertraces', '/activity/recitcahiertraces');
        $paths[] = new restore_path_element('recitct_groups', '/activity/recitcahiertraces/recitct_groups');
        $paths[] = new restore_path_element('recitct_notes', '/activity/recitcahiertraces/recitct_groups/recitct_notes');
        if ($userinfo){
            $paths[] = new restore_path_element('recitct_user_notes', '/activity/recitcahiertraces/recitct_groups/recitct_notes/recitct_user_notes');
        }

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

    protected function process_recitct_groups($data) {
        global $DB, $USER;

        $data = (object)$data;
        $oldid = $data->id;
        
        $ctid = $this->getCtIdBackwardsCompatibility($data);
        
        $data->ct_id = $this->get_mappingid('recitcahiertraces', $ctid);
        $newitemid = $DB->insert_record('recitct_groups', $data); // insert the recitct_notes record
        $this->set_mapping('recitct_groups', $oldid, $newitemid, true); 
    }

    protected function getCtIdBackwardsCompatibility($data){
        $ctid = 0;
        if (isset($data->ctid)){ 
            $ctid = $data->ctid; 
            unset($data->ct_id);
        } 

        if (isset($data->ct_id)){
            $ctid = $data->ct_id;
        } 

        return $ctid;
    }

    protected function process_recitct_notes($data) {
        global $DB, $USER;

        $data = (object)$data;
        $oldid = $data->id;
        
        $data->gid = $this->get_mappingid('recitct_groups', $data->gid);

        $newitemid = $DB->insert_record('recitct_notes', $data); // insert the recitct_notes record
        $this->set_mapping('recitct_notes', $oldid, $newitemid, true);        
    }
    
    protected function process_recitct_user_notes($data) {
        global $DB;
 
        $data = (object)$data;
        $data->nid = $this->get_mappingid('recitct_notes', $data->nid);
        $data->userid = $this->get_mappingid('user', $data->userid);
        $data->cmid = -1;

 
        // insert the recitcc_user_notes record
        $newitemid = $DB->insert_record('recitct_user_notes', $data);
    }

    protected function after_execute() {
        // Add recitcahiertraces related files, no need to match by itemname (just internally handled context)
        $this->add_related_files('mod_recitcahiertraces', 'intro', null);
        $this->add_related_files('mod_recitcahiertraces', 'usernote', null);
        //$this->add_related_files('mod_recitcahiertraces', 'feedback', null);
    }
}

