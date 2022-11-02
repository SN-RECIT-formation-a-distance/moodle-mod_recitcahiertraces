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
 * @package   mod_recitcahiertraces
 * @copyright 2019 RÉCIT 
 * @license   {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */
namespace recitcahiertraces;

require_once(dirname(__FILE__).'../../../../config.php');
require_once dirname(__FILE__)."/recitcommon/WebApi.php";
require_once 'PersistCtrl.php';

use recitcahiertraces\PersistCtrl;
use recitcahiertraces\WebApiResult;
use Exception;
use stdClass;

class WebApi extends MoodleApi
{
    public function __construct($DB, $COURSE, $USER){
        parent::__construct($DB, $COURSE, $USER);
        PersistCtrl::getInstance($DB, $USER);
    }

    public function getUserNotes($request){
        try{
            $cmId = clean_param($request['cmId'], PARAM_INT);
            $userId = clean_param($request['userId'], PARAM_INT);
            $flag = $request['flag'];

            $this->canUserAccess('s', $cmId, $userId);

            $result = PersistCtrl::getInstance()->getUserNotes($cmId, $userId, $flag);
            $this->prepareJson($result);
            return new WebApiResult(true, $result);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }     
    }

    public function getUserNote($request){
        try{
            $nId = clean_param($request['nId'], PARAM_INT);
            $userId = clean_param($request['userId'], PARAM_INT);
            $cmId = clean_param($request['cmId'], PARAM_INT);

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
                $msg = sprintf(get_string('newupdateinnote', 'mod_recitcahiertraces').": « <a href='%s' target='_blank'>%s</a> »", $url, $result->noteDef->title);
                PersistCtrl::getInstance()->sendInstantMessagesToTeachers($result->noteDef->group->ct->courseId, $msg);
            }
            else if(($flags->mode == "t") && ($flags->teacherFeedbackUpdated == 1)){
                $url = sprintf("%s/mod/recitcahiertraces/view.php?id=%ld&nId=%ld&gId=%ld&userId=%ld", $CFG->wwwroot, $result->noteDef->group->ct->mCmId, $result->noteDef->id, $result->noteDef->group->id, $result->userId);
                $msg = sprintf(get_string('newupdateinnote', 'mod_recitcahiertraces').": « <a href='%s' target='_blank'>%s</a> »", $url, $result->noteDef->title);
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
            $gId = clean_param($request['gId'], PARAM_INT);

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
            $cmId = clean_param($request['cmId'], PARAM_INT);

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
            $nId = clean_param($request['nId'], PARAM_INT);
            $cmId = clean_param($request['cmId'], PARAM_INT);

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
            $nId = clean_param($request['nId'], PARAM_INT);
            $cmId = clean_param($request['cmId'], PARAM_INT);

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
            $gId = clean_param($request['gId'], PARAM_INT);
            $cmId = clean_param($request['cmId'], PARAM_INT);

            $this->canUserAccess('a', $cmId);
            
            PersistCtrl::getInstance()->removeNoteGroup($gId);
            return new WebApiResult(true);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }  
    }
    
    public function reorderNoteGroups($request){
        try{
            $cmId = clean_param($request['cmId'], PARAM_INT);

            $this->canUserAccess('a', $cmId);
            
            PersistCtrl::getInstance()->reorderNoteGroups($cmId);
            return new WebApiResult(true);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }  
    }
    
    public function saveNoteGroup($request){
        try{
            $data = json_decode(json_encode($request['data']), FALSE);

            foreach($data as $item){
                $this->canUserAccess('a', $item->ct->mCmId);
            
                PersistCtrl::getInstance()->saveNoteGroup($item);
            }
            
            //$this->prepareJson($result);
            
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

    public function switchNoteSlot($request){
        try{
            $cmId = clean_param($request['cmId'], PARAM_INT);

            $this->canUserAccess('a', $cmId);

            $from = clean_param($request['from'], PARAM_INT);
            $to = clean_param($request['to'], PARAM_INT);
            PersistCtrl::getInstance()->switchNoteSlot($from, $to);
            return new WebApiResult(true);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }     
    }

    public function getRequiredNotes($request){
        try{
            $cmId = clean_param($request['cmId'], PARAM_INT);

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
            $cmId = clean_param($request['cmId'], PARAM_INT);

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
}

///////////////////////////////////////////////////////////////////////////////////
$webapi = new WebApi($DB, $COURSE, $USER);
$webapi->getRequest($_REQUEST);
$webapi->processRequest();
$webapi->replyClient();