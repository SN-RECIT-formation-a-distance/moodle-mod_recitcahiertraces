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
 * @copyright  2019 RÉCIT
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

 /**
 * A class created to gather useful functions
 *
 * @copyright  2019 RECIT
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
namespace recitcahiertraces;

require_once("$CFG->libdir/form/editor.php");
require_once("$CFG->libdir/editorlib.php");

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

    public static function getUserRoles($courseId, $userId){
        $roles = array();
        $ccontext = \context_course::instance($courseId);
        if (has_capability('mod/recitcahiertraces:view', $ccontext, $userId, false)) {
            $roles[] = 's';
        }
        if (has_capability('mod/recitcahiertraces:viewadmin', $ccontext, $userId, false)) {
            $roles[] = 't';
        }
        return $roles;
    }

    public static function getFavicon(){
        global $CFG;
        if ($CFG->version >= 2022041900){//Moodle 4.0
            return "../pix/monologo.jpg";
        }else{
            return "../pix/icon.png";
        }
    }

    public static function printOut($data){
        echo "<pre>";
        print_r($data);
    }

    public static function createEditorHtml($show = true, $name = "recitCCEditorContainer", $id = "recitCCEditor", $content = "", $nbRows = 15, $context = null, $itemId = 0, $maxFiles = EDITOR_UNLIMITED_FILES){			
        $nbRows = min(max($nbRows, 1), 30);
        
        if(empty($context)){
            $context = \context_system::instance();
        }
        
        // maxfiles = -1 unlimited
        $editoroptions = array('trusttext'=>true, 'subdirs' => true, 'maxfiles' => $maxFiles, 'context' => $context, 'autosave' => false);
        $editor = new \MoodleQuickForm_editor($name, "", array("id" => $id, 'rows' => $nbRows), $editoroptions);			            
        $editor->setValue(array("text" => $content, 'itemid' => $itemId)); //, "format" => FORMAT_HTML
        $result = sprintf("<div id='%s' style='display:%s;' data-format='%s'>", $name, ($show ? "block" : "none"), get_class(editors_get_preferred_editor()));
        ob_start();
        echo $editor->toHtml();
        $result .= ob_get_contents();
        ob_end_clean();

        // $fp = new MoodleQuickForm_filepicker();
        // $result .= $fp->toHtml();

        $result .= "</div>";
        return $result;
    }
}
