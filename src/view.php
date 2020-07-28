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

require('../../config.php');
require_once($CFG->dirroot . "/local/recitcommon/php/Utils.php");

$id = required_param('id', PARAM_INT);
list ($course, $cm) = get_course_and_cm_from_cmid($id, 'recitcahiercanada');

//require_course_login($course, true, $cm);
require_login();

//$context = context_module::instance($cm->id);
//require_capability('mod/recitcahiercanada:view', $context);
$view = new RecitCahierCanadaView($PAGE, $course, $cm, $OUTPUT, $USER, $DB);

//$modeAdmin = intval(has_capability('mod/recitcahiercanada:viewadmin', context_system::instance()));
$view->display();

class RecitCahierCanadaView
{
    protected $viewMode = null;
    protected $data = null;

    protected $page = null;
    protected $course = null;
    protected $cm = null;
    protected $output = null;
    protected $user = null;
    protected $db = null;

    protected $editorOption = "2"; // 1 = atto, 2 = recit editor

    public function __construct($page, $course, $cm, $output, $user, $db){
        $this->page = $page;
        $this->course = $course;
        $this->cm = $cm;
        $this->output = $output;
        $this->user = $user;
        $this->db = $db;
    }

    public function display(){
        $this->page->set_cm($this->cm);
        $this->page->set_url('/mod/recitcahiercanada/view.php', array('id' => $this->cm->id));
        $this->page->set_pagelayout('incourse');
        $this->page->set_title($this->course->shortname.': '.$this->cm->name);
        $this->page->set_heading($this->course->fullname);
        $this->page->requires->css(new moodle_url('./react_app/build/index.css'), true);
        $this->page->requires->js(new moodle_url('./react_app/build/index.js'), true);
        $this->page->requires->js(new moodle_url("{$CFG->wwwroot}/local/recitcommon/js/Components.js"), true);

        if($this->editorOption == "2"){
            $this->page->requires->css(new moodle_url("{$CFG->wwwroot}/local/recitcommon/js/recit_rich_editor/build/index.css"), true);
            $this->page->requires->js(new moodle_url("{$CFG->wwwroot}/local/recitcommon/js/recit_rich_editor/build/index.js"), true);
        }

        //$this->page->requires->js(new moodle_url('/lib/editor/atto/yui/build/moodle-editor_atto-editor/moodle-editor_atto-editor-min.js'), true);

        echo $this->output->header();
        echo $this->output->heading(format_string($this->cm->name), 2);
                        
        $roles = Utils::getUserRoles($this->course->id, $this->user->id);
        $studentId = (in_array('ad', $roles) ? 0 : $this->user->id);

        echo sprintf("<div id='recit_cahiertraces' data-student-id='%ld' data-roles='%s'></div>", $studentId, implode(",", $roles));
        
        
        echo $this->getEditorOption("recit_cahiertraces_editor", 1);        
        echo $this->getEditorOption("recit_cahiertraces_editor", 2);
        echo $this->getEditorOption("recit_cahiertraces_editor", 3);
        
        echo $this->output->footer();
    }

    protected function getEditorOption($name, $index){
        $context = context_course::instance($this->course->id);

        if($this->editorOption == "2"){
            return "<div id='{$name}_container_{$index}' data-format='recit_rich_editor' style='display: none;'></div>";
        }
        else{
            return Utils::createEditorHtml(false, "{$name}_container_{$index}", "{$name}_{$index}", "", 15, $context, 0, 0);
        }
    }
}
