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
require_once "$CFG->dirroot/local/recitcommon/php/WebApi.php";
require_once 'PersistCtrlCahierTraces.php';

if (!class_exists('CahierTracesApi')) {
    class CahierTracesApi extends MoodleApi
    {
        public function __construct($DB, $COURSE, $USER){
            parent::__construct($DB, $COURSE, $USER);
            CahierTracesPersistCtrl::getInstance($DB, $USER);
        }

        public function getPersonalNotes($request){
            try{
                $cmId = intval($request['cmId']);
                $userId = intval($request['userId']);

                $this->canUserAccess('s', $cmId, $userId);

                $result = CahierTracesPersistCtrl::getInstance()->getPersonalNotes($cmId, $userId);
                $this->prepareJson($result);
                return new WebApiResult(true, $result);
            }
            catch(Exception $ex){
                return new WebApiResult(false, null, $ex->GetMessage());
            }     
        }

        public function getPersonalNote($request){
            try{
                $cmId = intval($request['cmId']);
                $ccCmId = intval($request['ccCmId']);
                $userId = intval($request['userId']);

                $this->canUserAccess('s', $cmId, $userId);
                
                $result = CahierTracesPersistCtrl::getInstance()->getPersonalNote($ccCmId, $userId);

                $this->prepareJson($result);
                return new WebApiResult(true, $result);
            }
            catch(Exception $ex){
                return new WebApiResult(false, null, $ex->GetMessage());
            }     
        }
        
        public function savePersonalNote($request){       
            global $CFG;

            try{			
                $data = json_decode(json_encode($request['data']), FALSE);
                
                $flags = json_decode(json_encode($request['flags']), FALSE);

                $this->canUserAccess('s', 0, $data->userId, $data->courseId);

                $result = CahierTracesPersistCtrl::getInstance()->savePersonalNote($data, $flags->mode);
                $this->prepareJson($result);

                if(($flags->mode == "s") && ($result->notifyTeacher == 1)){
                    $url = sprintf("%s/mod/recitcahiercanada/view.php?id=%ld&ccCmId=%ld&cmId=%ld&userId=%ld", $CFG->wwwroot, $result->mcmId, $result->ccCmId, $result->cmId, $result->userId);
                    $msg = sprintf("Nouvelle mise à jour dans la note: « <a href='%s' target='_blank'>%s</a> »", $url, $result->noteTitle);
                    CahierTracesPersistCtrl::getInstance()->sendInstantMessagesToTeachers($result->courseId, $msg);
                }
                else if(($flags->mode == "t") && ($flags->teacherFeedbackUpdated == 1)){
                    $url = sprintf("%s/mod/recitcahiercanada/view.php?id=%ld&ccCmId=%ld&cmId=%ld&userId=%ld", $CFG->wwwroot, $result->mcmId, $result->ccCmId, $result->cmId, $result->userId);
                    $msg = sprintf("Nouvelle mise à jour dans la note: « <a href='%s' target='_blank'>%s</a> »", $url, $result->noteTitle);
                    CahierTracesPersistCtrl::getInstance()->sendInstantMessagesToStudents(array($result->userId), $result->courseId, $msg);
                }
                
                return new WebApiResult(true, $result);
            }
            catch(Exception $ex){
                return new WebApiResult(false, null, $ex->GetMessage());
            } 
        }

        public function getCmNotes($request){
            try{
                $cmId = intval($request['cmId']);
                $ccId = (isset($request['ccId']) ? intval($request['ccId']) : 0);

                $this->canUserAccess('a', $cmId);

                $result = CahierTracesPersistCtrl::getInstance()->getCmNotes(0, $cmId, $ccId);
                $this->prepareJson($result);
                return new WebApiResult(true, $result);
            }
            catch(Exception $ex){
                return new WebApiResult(false, null, $ex->GetMessage());
            }     
        }

        public function getCcCmNoteFormKit($request){
            try{
                $ccCmId = intval($request['ccCmId']);
                $cmId = intval($request['cmId']);

                $this->canUserAccess('a', $cmId);

                $result = new stdClass();

                if($ccCmId == 0 ){
                    $result->data = new CmNote();
                    $result->data->cmId = $cmId;
                }
                else{
                    $result->data = CahierTracesPersistCtrl::getInstance()->getCcCmNote($ccCmId);
                }

                $result->tagList = CahierTracesPersistCtrl::getInstance()->getTagList($result->data->cmId);
                $result->activityList = CahierTracesPersistCtrl::getInstance()->getSectionCmList($result->data->cmId);

                $this->prepareJson($result);
                return new WebApiResult(true, $result);
            }
            catch(Exception $ex){
                return new WebApiResult(false, null, $ex->GetMessage());
            }     
        }
        
        public function removeCcCmNote($request){
            try{
                $ccCmId = intval($request['ccCmId']);
                $cmId = intval($request['cmId']);

                $this->canUserAccess('a', $cmId);
                
                CahierTracesPersistCtrl::getInstance()->removeCcCmNote($ccCmId);
                return new WebApiResult(true);
            }
            catch(Exception $ex){
                return new WebApiResult(false, null, $ex->GetMessage());
            }     
        }
        
        public function saveCcCmNote($request){        
            try{            
                $data = json_decode(json_encode($request['data']), FALSE);
                //$tagMetadata = json_decode(json_encode($request['tagMetadata']), FALSE);

                $this->canUserAccess('a', $data->cmId);

                $result = CahierTracesPersistCtrl::getInstance()->saveCcCmNote($data);
                //CahierTracesPersistCtrl::getInstance()->moodleTagItem($result, $tagMetadata);
                $this->prepareJson($result);
                return new WebApiResult(true, $result);
            }
            catch(Exception $ex){
                return new WebApiResult(false, null, $ex->GetMessage());
            } 
        }

        public function switchCcCmNoteSlot($request){
            try{
                $this->canUserAccess('a');

                $from = intval($request['from']);
                $to = intval($request['to']);
                CahierTracesPersistCtrl::getInstance()->switchCcCmNoteSlot($from, $to);
                return new WebApiResult(true);
            }
            catch(Exception $ex){
                return new WebApiResult(false, null, $ex->GetMessage());
            }     
        }

        public function checkCCSeqPos($request){
            try{
                $cmId = intval($request['cmId']);
                $this->canUserAccess('a', $cmId);
                $result = CahierTracesPersistCtrl::getInstance()->checkCCSeqPos($cmId);
                return new WebApiResult(true, $result);
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

                $result->data = CahierTracesPersistCtrl::getInstance()->getRequiredNotes($cmId);
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

                $result->data = CahierTracesPersistCtrl::getInstance()->getStudentsProgression($cmId);
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

                $result = CahierTracesPersistCtrl::getInstance()->sendInstantMessagesToTeachers(7, 'test api');

                return new WebApiResult(true, $result);
            }
            catch(Exception $ex){
                return new WebApiResult(false, null, $ex->GetMessage());
            }        
        }*/
    }
}