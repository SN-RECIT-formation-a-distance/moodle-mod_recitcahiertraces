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
 * This file defines the quiz Diagnostic Tag Question report class.
 *
 * @package    recit_common
 * @copyright  2019 RECIT
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

 /**
 * A class created to gather useful functions
 *
 * @copyright  2019 RECIT
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
require_once("$CFG->libdir/form/editor.php");
//require_once("$CFG->libdir/form/filepicker.php");
//require_once("$CFG->libdir/formslib.php");
//require_once($CFG->dirroot.'/course/moodleform_mod.php');
//require_once($CFG->dirroot . '/course/modlib.php');
require_once("$CFG->libdir/editorlib.php");

if (!class_exists('Utils')) {
    class Utils
    {
        public static function divide($n1, $n2){
            return ($n2 > 0 ? $n1/$n2 : 0);
        }

        public static function getUrl($includeQueryStr = false){       
            $result = sprintf("%s://%s:%d%s", $_SERVER['REQUEST_SCHEME'], $_SERVER['SERVER_NAME'], $_SERVER['SERVER_PORT'], $_SERVER['SCRIPT_NAME']);
            if($includeQueryStr){
                $result = sprintf("%s?%s", $result, "?", $_SERVER['QUERY_STRING']);
            }

            return $result;
        }

        public static function printOut($data){
            echo "<pre>";
            print_r($data);
        }

        public static function createEditorHtml($show = true, $name = "recitCCEditorContainer", $id = "recitCCEditor", $content = "", $nbRows = 15, $context = null){
            $nbRows = min(max($nbRows, 1), 30);
            // maxfiles = -1 unlimited
            $editor = new MoodleQuickForm_editor($name, "", array("id" => $id, 'rows' => $nbRows), array('context' => $context, 'maxfiles' => -1, 'autosave' => false));
            $editor->setValue(array("text" => $content));
            
            $result = sprintf("<div id='%s' style='display:%s;' data-format='%s'>", $name, ($show ? "block" : "none"), get_class(editors_get_preferred_editor()));
            ob_start();
            echo $editor->toHtml();
            $result .= ob_get_contents();
            ob_end_clean();

           // $fp = new MoodleQuickForm_filepicker();
           // $result .= $fp->toHtml();

            $result .= "</div>";
            return $result;

            //echo "<div id='recitCahierCanadaEditor' data-format='atto'><div id='recitCahierCanadaEditorPlaceholder'></div></div>";
            //$editor = new atto_texteditor();
            //$editor->use_editor('recitCahierCanadaEditorPlaceholder', array('autosave' => false));
        }

       /* public static function createTagsForm($DB, $cmId, $component = 'core', $itemType = 'course_modules'){
            // Check the course module exists.
            $cm = get_coursemodule_from_id('', $cmId, 0, false, MUST_EXIST);

            // Check the course exists.
           // $course = $DB->get_record('course', array('id'=>$cm->course), '*', MUST_EXIST);

            //list($cm, $context, $module, $data, $cw) = get_moduleinfo_data($cm, $course);

            //$form = new TagsForm($data, $cw->section, $cm, $course);
            $form = new TagsForm($cm);
            return $form->render();
            //var_dump($form->get_data());
        }*/

        public static function getUserRoles($courseId, $userId){
           // global $DB, $USER;

            $ret = array();
            // get the course context (there are system context, module context, etc.)
            $context = context_course::instance($courseId);
            /*$contextIds =  $context->get_parent_context_ids();
            $contextIds[] = $context->id;
            $roles = PersistCtrl::getInstance($DB, $USER)->getUserRoles($userId, $contextIds);*/
            
            $userRoles = get_user_roles($context, $userId);

            foreach($userRoles as $item){
                switch($item->shortname){
                    case 'manager': $ret[] = 'mg'; break;
                    case 'coursecreator': $ret[] = 'cc'; break;
                    case 'editingteacher': $ret[] = 'et'; break;
                    case 'teacher': $ret[] = 'tc'; break;
                    case 'student': $ret[] = 'sd'; break;
                    case 'guest': $ret[] = 'gu'; break;
                    case 'frontpage': $ret[] = 'fp'; break;
                }
            }

            if(is_siteadmin($userId)){
                $ret[] = 'ad';
            }
            
            return $ret;
        }

        public static function isAdminRole($roles){
            $adminRoles = array('ad', 'mg', 'cc', 'et', 'tc');

            if(empty($roles)){ return false;}

            foreach($roles as $role){
                if(in_array($role, $adminRoles)){
                    return true;
                }
            }
            return false;
        }
    }
}
/*
class TagsForm extends moodleform {
    protected $cm = null;

    public function __construct($cm){
        parent::__construct();

        $this->cm = $cm;
    }

    public function definition() {
        $this->displayTags();      
//                    $this->add_action_buttons();
    }

    public function displayTags(){
        $component = 'core';
        $itemType = 'course_modules';

        if (core_tag_tag::is_enabled($component, $itemType)) {
            $this->_form->addElement('header', 'tagshdr', get_string('tags', 'tag'));
            $this->_form->addElement('tags', 'tags', get_string('tags'), array('itemtype' => $itemType, 'component' => $component));
            if ($this->cm) {
                $tags = core_tag_tag::get_item_tags_array($component, $itemType, $this->cm->id);
                $this->_form->setDefault('tags', $tags);
            }
        }
    } 
}*/