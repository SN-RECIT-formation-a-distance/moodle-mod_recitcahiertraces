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
 * Define all the backup steps that will be used by the backup_recitcahiercanada_activity_task
 *
 * @package    mod_recitcahiercanada
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die;
require_once($CFG->dirroot . "/mod/recitcahiercanada/classes/PersistCtrlCahierTraces.php");

 /**
 * Define the complete recitcahiercanada structure for backup, with file and id annotations
 */
class backup_recitcahiercanada_activity_structure_step extends backup_activity_structure_step {

    protected function define_structure() {
        global $DB, $USER;

        // To know if we are including userinfo.
        //$userinfo = $this->get_setting_value('userinfo');

        CahierTracesPersistCtrl::getInstance($DB, $USER)->createBackupViews();

        // Define each element separated
        $recitcahiercanada = new backup_nested_element('recitcahiercanada', array('id'), array(
            'course', 'name', 'intro', 'introformat', 'display', 'timemodified'));


        $recitcc_cm_notes = new backup_nested_element('recitcc_cm_notes', array('id'), array(
            'intcode', 'ccid', 'cmid', 'title', 'slot', 'templatenote', 'suggestednote', 'teachertip', 'notifyteacher', 'lastupdate', 'cmindexpos'));

       // $mdl_recitcc_user_notes = new backup_nested_element('recitcc_user_notes', array('id'), array('cccmid', 'userid', 'note', 'feedback', 'grade', 'lastupdate'));

        // Build the tree
        $recitcahiercanada->add_child($recitcc_cm_notes);
       // $recitcc_cm_notes->add_child($mdl_recitcc_user_notes);

        // Define sources
        $recitcahiercanada->set_source_table('recitcahiercanada', array('id' => backup::VAR_ACTIVITYID));
        $recitcc_cm_notes->set_source_table('vw_recitcc_cm_notes', array('ccid' => backup::VAR_PARENTID));
       // $mdl_recitcc_user_notes->set_source_table('recitcc_user_notes', array('cccmid' => backup::VAR_PARENTID));

        // Define id annotations
        //$recitcahiercanada->annotate_ids('question', 'questionid');
        
        // Define file annotations
        $recitcahiercanada->annotate_files('mod_recitcahiercanada', 'intro', null); 
        $recitcc_cm_notes->annotate_files('vw_recitcc_cm_notes', 'templatenote', null); 
       // $mdl_recitcc_user_notes->annotate_files('mdl_recitcc_user_notes', 'note', null); // This file area hasn't itemid
       // $mdl_recitcc_user_notes->annotate_files('mdl_recitcc_user_notes', 'feedback', null); // This file area hasn't itemid       

        // Return the root element (recitcahiercanada), wrapped into standard activity structure
        return $this->prepare_activity_structure($recitcahiercanada);

    }
}
