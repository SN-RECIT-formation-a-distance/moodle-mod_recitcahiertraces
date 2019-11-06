<?php

require('../../config.php');
require_once($CFG->dirroot . "/mod/recitcahiercanada/common/php/Utils.php");

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
        $this->page->set_title($this->course->shortname.': '.$this->cm->name);
        $this->page->set_heading($this->course->fullname);
        $this->page->requires->css(new moodle_url('./react_app/dist/index.css'), true);

       /* $i18n = array("sectionActivities", 'turnOnEditingMode', 'turnOffEditingMode', 'selectGroup', 'selectUser', 'selectOption', 'previous', 'next',
        'activity', 'noteTitle', 'templateNote', 'studentNote', 
        'teacherFeedback', 'edit', 'save', 'remove', 'cancel', 'copy', 'selectSectionActivity', 'integrationCode', 'addNewNote', 'msgActionCompleted', 
        'msgConfirmDeletion', 'msgDeletionExtraInfo', 'noData', 'printNotes', 'msgCCSeqPos', 'tags', 'typeToSearch'); 

        $this->page->requires->strings_for_js($i18n, "recitcahiercanada");*/
        //$PAGE->set_activity_record($cm);
        
        echo $this->output->header();
        echo $this->output->heading(format_string($this->cm->name), 2);
                        
        $roles = Utils::getUserRoles($this->course->id, $this->user->id);
        $studentId = (in_array('ad', $roles) ? 0 : $this->user->id);

        echo sprintf("<div id='recit_cahiertraces' data-student-id='%ld' data-roles='%s'></div>", $studentId, implode(",", $roles));
        echo Utils::createEditorHtml(false);
        
      /*  echo '<script src="react_app/build/lib/react/react.development.js"></script>';
        echo '<script src="react_app/build/lib/react/react-dom.development.js"></script>';
        echo '<script src="react_app/build/lib/react/react-bootstrap.min.js"></script>';
        echo '<script src="react_app/build/cahiertraces_app.js"></script>';*/
        
        echo '<script src="./react_app/dist/index.js"></script>';
        //echo Utils::createTagsForm($this->db, $this->cm->id);
        
        
        echo $this->output->footer();
    }
}
