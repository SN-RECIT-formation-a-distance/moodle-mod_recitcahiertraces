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
 * Unit tests
 */

defined('MOODLE_INTERNAL') || die();
require_once dirname(__FILE__)."/../classes/PersistCtrl.php";
use recitcahiertraces\PersistCtrl;

class mod_recitcahiertraces_lib_testcase extends advanced_testcase {

    /**
     * Prepares things before this test case is initialised
     * @return void
     */
    protected function setUp(): void {
        global $DB;
        $this->user = $this->getDataGenerator()->create_user();
        $this->ctrl = PersistCtrl::getInstance($DB, $this->user);
        $this->resetAfterTest();

        // Setup test data.
        $this->course = $this->getDataGenerator()->create_course(array('enablecompletion' => 1));
        $this->cc = $this->getDataGenerator()->create_module('recitcahiertraces', array('course' => $this->course->id),
                                                            array('completion' => 2, 'completionview' => 1));
        
        $this->data = new stdClass();
        $this->data->ct = new stdClass();
        $this->data->ct->id = $this->cc->id;
        $this->data->ct->mCmId = $this->cc->cmid;
    }

    public function test_createnotegroup() {
        $this->data->id = 0;
        $this->data->name = 'test';
        $this->ctrl->saveNoteGroup($this->data);
        $list = $this->ctrl->getGroupList($this->cc->cmid);
        $this->assertEquals($this->data->name, $list[0]->name);
    }

    public function test_getgroupnote() {
        $this->data->id = 0;
        $this->data->name = 'test';
        $this->ctrl->saveNoteGroup($this->data);
        $list = $this->ctrl->getGroupList($this->cc->cmid);
        $list = $this->ctrl->getGroupNotes($list[0]->id);
        $this->assertTrue(empty($list));
    }

    public function test_getusernotes() {
        $this->data->id = 0;
        $this->data->name = 'test';
        $this->ctrl->saveNoteGroup($this->data);
        $list = $this->ctrl->getGroupList($this->cc->cmid);
        $list = $this->ctrl->getUserNotes($this->user->id, $this->cc->cmid);
        $this->assertTrue(empty($list));
    }

    public function test_getusernote() {
        $this->data->id = 0;
        $this->data->name = 'test';
        $this->ctrl->saveNoteGroup($this->data);
        $list = $this->ctrl->getGroupList($this->cc->cmid);
        $ex = false;
        try {
            $this->ctrl->getUserNote(1, $this->user->id);
        } catch (Exception $e){
            $ex = true; //It should throw exception because no data
        }
        $this->assertTrue($ex);
    }

    public function test_getrequirednotes() {
        $this->data->id = 0;
        $this->data->name = 'test';
        $this->ctrl->saveNoteGroup($this->data);
        $list = $this->ctrl->getRequiredNotes($this->cc->cmid);
        $list = $this->ctrl->getStudentsProgression($this->cc->cmid);
        $this->assertTrue(empty($list));
    }

    public function test_removeCcInstance() {
        $this->data->id = 0;
        $this->data->name = 'test';
        $this->ctrl->saveNoteGroup($this->data);
        $del = $this->ctrl->removeCcInstance($this->cc->cmid);
        $this->assertTrue($del);
    }

    public function test_removeNoteGroup() {
        $this->data->id = 0;
        $this->data->name = 'test';
        $gr = $this->ctrl->saveNoteGroup($this->data);
        $list = $this->ctrl->removeNoteGroup($gr->id);
        $list = $this->ctrl->getGroupList($this->cc->cmid);
        $this->assertTrue(empty($list));
    }
}