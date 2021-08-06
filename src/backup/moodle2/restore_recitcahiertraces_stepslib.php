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
        $paths[] = new restore_path_element('recitct_groups', '/activity/recitcahiertraces/recitct_groups');
        $paths[] = new restore_path_element('recitct_notes', '/activity/recitcahiertraces/recitct_groups/recitct_notes');

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
        
        $data->ctid = $this->get_mappingid('recitcahiertraces', $data->ctid);
        $newitemid = $DB->insert_record('recitct_groups', $data); // insert the recitct_notes record
        $this->set_mapping('recitct_groups', $oldid, $newitemid, true); 
    }

    protected function process_recitct_notes($data) {
        global $DB, $USER;

        $data = (object)$data;
        $oldid = $data->id;
        
        $data->gid = $this->get_mappingid('recitct_groups', $data->gid);

        $newitemid = $DB->insert_record('recitct_notes', $data); // insert the recitct_notes record
        $this->set_mapping('recitct_notes', $oldid, $newitemid, true);        
    }

    protected function after_execute() {
        // Add recitcahiertraces related files, no need to match by itemname (just internally handled context)
        $this->add_related_files('mod_recitcahiertraces', 'intro', null);
        //$this->add_related_files('mod_recitct_user_notes', 'note', null);
        //$this->add_related_files('mod_recitct_user_notes', 'feedback', null);
    }
}

