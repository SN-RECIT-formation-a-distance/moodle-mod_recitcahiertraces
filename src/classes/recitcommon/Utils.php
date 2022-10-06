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

    public static function getUserRoles($courseId, $userId){
        // get the course context (there are system context, module context, etc.)
        $context = \context_course::instance($courseId);

        return Utils::getUserRolesOnContext($context, $userId);
    }

    public static function getUserRolesOnContext($context, $userId){
        $userRoles1 = get_user_roles($context, $userId);

        $userRoles2 = array();
        foreach($userRoles1 as $item){
            $userRoles2[] = $item->shortname;
        }

        $ret = self::moodleRoles2RecitRoles($userRoles2);

        if(is_siteadmin($userId)){
            $ret[] = 'ad';
        }
        
        return $ret;
    }
    
    public static function moodleRoles2RecitRoles($userRoles){
        $ret = array();

        foreach($userRoles as $name){
            switch($name){
                case 'manager': $ret[] = 'mg'; break;
                case 'coursecreator': $ret[] = 'cc'; break;
                case 'editingteacher': $ret[] = 'et'; break;
                case 'teacher': $ret[] = 'tc'; break;
                case 'student': $ret[] = 'sd'; break;
                case 'guest': $ret[] = 'gu'; break;
                case 'frontpage': $ret[] = 'fp'; break;
            }
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
