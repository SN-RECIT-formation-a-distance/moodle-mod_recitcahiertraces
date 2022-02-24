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
namespace recitcahiertraces;

require_once(dirname(__FILE__).'../../../../config.php');
require_once "$CFG->dirroot/local/recitcommon/php/WebApi.php";
require_once($CFG->dirroot . "/mod/recitcahiercanada/classes/PersistCtrl.php");
require_once 'PersistCtrl.php';

use recitcahiertraces\PersistCtrl;
use recitcommon;
use recitcommon\WebApiResult;
use Exception;
use stdClass;

class WebApi extends recitcommon\MoodleApi
{
    public function __construct($DB, $COURSE, $USER){
        parent::__construct($DB, $COURSE, $USER);
        PersistCtrl::getInstance($DB, $USER);
    }

    public function getUserNotes($request){
        try{
            $cmId = intval($request['cmId']);
            $userId = intval($request['userId']);

            $this->canUserAccess('s', $cmId, $userId);

            $result = PersistCtrl::getInstance()->getUserNotes($cmId, $userId);
            $this->prepareJson($result);
            return new WebApiResult(true, $result);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }     
    }

    public function getUserNote($request){
        try{
            $nId = intval($request['nId']);
            $userId = intval($request['userId']);
            $cmId = intval($request['cmId']);

            $this->canUserAccess('s', $cmId, $userId);
            
            $result = PersistCtrl::getInstance()->getUserNote($nId, $userId);

            $this->prepareJson($result);
            return new WebApiResult(true, $result);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }     
    }
    
    public function saveUserNote($request){       
        global $CFG;

        try{			
            $data = json_decode(json_encode($request['data']), FALSE);
            
            $flags = json_decode(json_encode($request['flags']), FALSE);

            $this->canUserAccess('s', 0, $data->userId, $data->courseId);

            $result = PersistCtrl::getInstance()->saveUserNote($data, $flags->mode);
            $this->prepareJson($result);

            if(($flags->mode == "s") && ($result->noteDef->notifyTeacher == 1)){
                $url = sprintf("%s/mod/recitcahiertraces/view.php?id=%ld&nId=%ld&gId=%ld&userId=%ld", $CFG->wwwroot, $result->noteDef->group->ct->mCmId, $result->noteDef->id, $result->noteDef->group->id, $result->userId);
                $msg = sprintf("Nouvelle mise à jour dans la note: « <a href='%s' target='_blank'>%s</a> »", $url, $result->noteDef->title);
                PersistCtrl::getInstance()->sendInstantMessagesToTeachers($result->noteDef->group->ct->courseId, $msg);
            }
            else if(($flags->mode == "t") && ($flags->teacherFeedbackUpdated == 1)){
                $url = sprintf("%s/mod/recitcahiertraces/view.php?id=%ld&nId=%ld&gId=%ld&userId=%ld", $CFG->wwwroot, $result->noteDef->group->ct->mCmId, $result->noteDef->id, $result->noteDef->group->id, $result->userId);
                $msg = sprintf("Nouvelle mise à jour dans la note: « <a href='%s' target='_blank'>%s</a> »", $url, $result->noteDef->title);
                PersistCtrl::getInstance()->sendInstantMessagesToStudents(array($result->userId), $result->noteDef->group->ct->courseId, $msg);
            }
            
            return new WebApiResult(true, $result);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        } 
    }

    public function getGroupNotes($request){
        try{
            $gId = intval($request['gId']);

            $result = PersistCtrl::getInstance()->getGroupNotes($gId);
            $this->prepareJson($result);
            return new WebApiResult(true, $result);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }     
    }

    public function getGroupList($request){
        try{
            $cmId = intval($request['cmId']);

            $result = PersistCtrl::getInstance()->getGroupList($cmId);
            $this->prepareJson($result);
            return new WebApiResult(true, $result);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }     
    }

    public function getNoteFormKit($request){
        try{
            $nId = intval($request['nId']);
            $cmId = intval($request['cmId']);

            $this->canUserAccess('a', $cmId);

            $result = new stdClass();

            if($nId == 0){
                $result->data = new NoteDef();
            }
            else{
                $result->data = PersistCtrl::getInstance()->getNoteDef($nId);
            }

            $result->groupList = PersistCtrl::getInstance()->getGroupList($cmId);

            $this->prepareJson($result);
            return new WebApiResult(true, $result);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }     
    }
    
    public function removeNote($request){
        try{
            $nId = intval($request['nId']);
            $cmId = intval($request['cmId']);

            $this->canUserAccess('a', $cmId);
            
            PersistCtrl::getInstance()->removeNote($nId);
            return new WebApiResult(true);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }     
    }
    
    public function removeNoteGroup($request){
        try{
            $gId = intval($request['gId']);
            $cmId = intval($request['cmId']);

            $this->canUserAccess('a', $cmId);
            
            PersistCtrl::getInstance()->removeNoteGroup($gId);
            return new WebApiResult(true);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }     
    }
    
    public function saveNoteGroup($request){
        try{
            $data = json_decode(json_encode($request['data']), FALSE);

            $this->canUserAccess('a', $data->ct->mCmId);
            
            $result = PersistCtrl::getInstance()->saveNoteGroup($data);
            $this->prepareJson($result);
            
            return new WebApiResult(true);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }     
    }

    public function saveNote($request){        
        try{            
            $data = json_decode(json_encode($request['data']), FALSE);
            //$tagMetadata = json_decode(json_encode($request['tagMetadata']), FALSE);

            $this->canUserAccess('a', $data->cmId);

            $data = NoteDef::create($data);
            PersistCtrl::getInstance()->saveNote($data);
            //PersistCtrl::getInstance()->moodleTagItem($result, $tagMetadata);
            //$this->prepareJson($result);
            return new WebApiResult(true);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        } 
    }
    
    public function getCCList($request){        
        try{            
            $cmId = intval($request['cmId']);

            $this->canUserAccess('a', $cmId);
            
            list ($course, $cm) = get_course_and_cm_from_cmId($cmId);
            $result = array();
            $modinfo = get_fast_modinfo($course->id);

            foreach ($modinfo->cms as $cm){
                if ($cm->modname == 'recitcahiercanada'){
                    $result[] = array('id' => $cm->id, 'name' => $cm->name);
                }
            }
            
            $this->prepareJson($result);
            return new WebApiResult(true, $result);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        } 
    }
    
    public function importCC($request){
        global $DB, $USER;
        try{            
            $mCmId = intval($request['cmId']);
            $importcmId = intval($request['importcmid']);

            $this->canUserAccess('a', $mCmId);
            $this->canUserAccess('a', $importcmId);
            
            $data = \recitcahiercanada\PersistCtrl::getInstance($DB, $USER)->getCmSuggestedNotes($importcmId);

            $info = PersistCtrl::getInstance()->importCahierCanada($mCmId, $data);
            $result = array('info' => $info['imported'] . " notes ont été importé, " . $info['group'] . " groupes de notes ont été créé, " . $info['skipped'] . " notes ont été ignoré, " . $info['error'] . " notes ont échoué l'importation", 'data' => $info);
            $this->prepareJson($result);
            
            return new WebApiResult(true, $result);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        } 
    }

    public function switchNoteSlot($request){
        try{
            $this->canUserAccess('a');

            $from = intval($request['from']);
            $to = intval($request['to']);
            PersistCtrl::getInstance()->switchNoteSlot($from, $to);
            return new WebApiResult(true);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }     
    }

    public function getRequiredNotes($request){
        try{
            $cmId = intval($request['cmId']);

            $this->canUserAccess('a', $cmId);

            $result = new stdClass();

            $result->data = PersistCtrl::getInstance()->getRequiredNotes($cmId);
            $this->prepareJson($result);
            return new WebApiResult(true, $result->data);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }     
    }

    public function getStudentsProgression($request){
        try{
            $cmId = intval($request['cmId']);

            $this->canUserAccess('a', $cmId);

            $result = new stdClass();

            $result->data = PersistCtrl::getInstance()->getStudentsProgression($cmId);
            $this->prepareJson($result);
            return new WebApiResult(true, $result->data);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }     
    }

    /*public function sendInstantMessagesToTeachers($request){   
        try{
            $this->canUserAccess('a');

            $result = PersistCtrl::getInstance()->sendInstantMessagesToTeachers(7, 'test api');

            return new WebApiResult(true, $result);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }        
    }*/
}

///////////////////////////////////////////////////////////////////////////////////
$webapi = new WebApi($DB, $COURSE, $USER);
$webapi->getRequest($_REQUEST);
$webapi->processRequest();
$webapi->replyClient();