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
require_once($CFG->dirroot . "/mod/recitcahiertraces/classes/PersistCtrlCahierTraces.php");

 /**
 * Define the complete recitcahiertraces structure for backup, with file and id annotations
 */
class backup_recitcahiertraces_activity_structure_step extends backup_activity_structure_step {

    protected function define_structure() {
        global $DB, $USER;

        // Define each element separated
        $recitcahiertraces = new backup_nested_element('recitcahiertraces', array('id'), array(
            'course', 'name', 'intro', 'introformat', 'display', 'timemodified'));

        $recitct_groups = new backup_nested_element('recitct_groups', array('id'), array('ctid', 'name'));

        $recitct_notes = new backup_nested_element('recitct_notes', array('id'), array(
            'intcode', 'gid', 'title', 'slot', 'templatenote', 'suggestednote', 'teachertip', 'notifyteacher', 'lastupdate'));


        // Build the tree
       $recitct_groups->add_child($recitct_notes);
       $recitcahiertraces->add_child($recitct_groups);

        // Define sources
        $recitcahiertraces->set_source_table('recitcahiertraces', array('id' => backup::VAR_ACTIVITYID));
        $recitct_groups->set_source_table('recitct_groups', array('ctid' => backup::VAR_PARENTID));
        $recitct_notes->set_source_table('recitct_notes', array('gid' => backup::VAR_PARENTID));

        // Define id annotations
        //$recitcahiertraces->annotate_ids('question', 'questionid');
        
        // Define file annotations
        $recitcahiertraces->annotate_files('mod_recitcahiertraces', 'intro', null); 
        $recitct_notes->annotate_files('recitct_notes', 'templatenote', null);
       // $mdl_recitct_user_notes->annotate_files('mdl_recitct_user_notes', 'note', null); // This file area hasn't itemid
       // $mdl_recitct_user_notes->annotate_files('mdl_recitct_user_notes', 'feedback', null); // This file area hasn't itemid       

        // Return the root element (recitcahiertraces), wrapped into standard activity structure
        return $this->prepare_activity_structure($recitcahiertraces);

    }
}
