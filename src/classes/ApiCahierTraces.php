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
                $nId = intval($request['nid']);
                $userId = intval($request['userId']);
                $cmId = intval($request['cmId']);

                $this->canUserAccess('s', $cmId, $userId);
                
                $result = CahierTracesPersistCtrl::getInstance()->getPersonalNote($nId, $userId);

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
                    $url = sprintf("%s/mod/recitcahiertraces/view.php?id=%ld&nid=%ld&gId=%ld&userId=%ld", $CFG->wwwroot, $result->mgId, $result->nid, $result->gId, $result->userId);
                    $msg = sprintf("Nouvelle mise à jour dans la note: « <a href='%s' target='_blank'>%s</a> »", $url, $result->noteTitle);
                    CahierTracesPersistCtrl::getInstance()->sendInstantMessagesToTeachers($result->courseId, $msg);
                }
                else if(($flags->mode == "t") && ($flags->teacherFeedbackUpdated == 1)){
                    $url = sprintf("%s/mod/recitcahiertraces/view.php?id=%ld&nid=%ld&gId=%ld&userId=%ld", $CFG->wwwroot, $result->mgId, $result->nid, $result->gId, $result->userId);
                    $msg = sprintf("Nouvelle mise à jour dans la note: « <a href='%s' target='_blank'>%s</a> »", $url, $result->noteTitle);
                    CahierTracesPersistCtrl::getInstance()->sendInstantMessagesToStudents(array($result->userId), $result->courseId, $msg);
                }
                
                return new WebApiResult(true, $result);
            }
            catch(Exception $ex){
                return new WebApiResult(false, null, $ex->GetMessage());
            } 
        }

        public function getGroupNotes($request){
            try{
                $gid = intval($request['gId']);

                $result = CahierTracesPersistCtrl::getInstance()->getGroupNotes($gid);
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

                $result = CahierTracesPersistCtrl::getInstance()->getGroupList($cmId);
                $this->prepareJson($result);
                return new WebApiResult(true, $result);
            }
            catch(Exception $ex){
                return new WebApiResult(false, null, $ex->GetMessage());
            }     
        }

        public function getGroupNoteFormKit($request){
            try{
                $nid = intval($request['nId']);
                $cmId = intval($request['cmId']);

                $this->canUserAccess('a', $cmId);

                $result = new stdClass();

                if($nid == 0){
                    $result->data = new CmNote();
                    $result->data->nid = 0;
                    $result->data->gId = 0;
                }
                else{
                    $result->data = CahierTracesPersistCtrl::getInstance()->getGroupNotes($cmId);
                }

                $result->tagList = CahierTracesPersistCtrl::getInstance()->getTagList($cmId);
                $result->groupList = CahierTracesPersistCtrl::getInstance()->getGroupList($cmId);

                $this->prepareJson($result);
                return new WebApiResult(true, $result);
            }
            catch(Exception $ex){
                return new WebApiResult(false, null, $ex->GetMessage());
            }     
        }
        
        public function removeNote($request){
            try{
                $nid = intval($request['nid']);
                $cmId = intval($request['cmId']);

                $this->canUserAccess('a', $cmId);
                
                CahierTracesPersistCtrl::getInstance()->removeNote($nid);
                return new WebApiResult(true);
            }
            catch(Exception $ex){
                return new WebApiResult(false, null, $ex->GetMessage());
            }     
        }
        
        public function removeGroup($request){
            try{
                $gId = intval($request['gId']);
                $cmId = intval($request['cmId']);

                $this->canUserAccess('a', $cmId);
                
                CahierTracesPersistCtrl::getInstance()->removeGroup($gId);
                return new WebApiResult(true);
            }
            catch(Exception $ex){
                return new WebApiResult(false, null, $ex->GetMessage());
            }     
        }
        
        public function addGroup($request){
            try{
                $name = $request['name'];
                $cmId = intval($request['cmId']);

                $this->canUserAccess('a', $cmId);
                
                $ctId = CahierTracesPersistCtrl::getInstance()->getCtIdFromCmId($cmId);
                CahierTracesPersistCtrl::getInstance()->addGroup($ctId, $name);
                return new WebApiResult(true);
            }
            catch(Exception $ex){
                return new WebApiResult(false, null, $ex->GetMessage());
            }     
        }
        
        public function renameGroup($request){
            try{
                $name = $request['name'];
                $cmId = intval($request['cmId']);
                $gId = intval($request['gId']);

                $this->canUserAccess('a', $cmId);
                
                CahierTracesPersistCtrl::getInstance()->renameGroup($gId, $name);
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

                $result = CahierTracesPersistCtrl::getInstance()->saveNote($data);
                //CahierTracesPersistCtrl::getInstance()->moodleTagItem($result, $tagMetadata);
                $this->prepareJson($result);
                return new WebApiResult(true, $result);
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
            global $DB, $USER, $CFG;
            try{            
                $cmId = intval($request['cmId']);
                $importcmId = intval($request['importcmid']);

                $this->canUserAccess('a', $cmId);
                $this->canUserAccess('a', $importcmId);

                require_once($CFG->dirroot . "/mod/recitcahiercanada/classes/PersistCtrlCahierTraces.php");
                $data = CahierCanadaPersistCtrl::getInstance($DB, $USER)->getPersonalNotes($importcmId, 0);
                $ct = CahierTracesPersistCtrl::getInstance();
                $ctId = $ct->getCtIdFromCmId($cmId);

                foreach ($data as $g){
                    foreach ($g as $n){
                        $gname = $n->activityName . " (importé)";
                        $gid = $ct->getGroupIdFromName($ctId, $gname);
                        if (!$gid) $gid = $ct->addGroup($ctId, $gname);
                        $n->gId = $gid;
                        $n->nid = 0;
                        $ct->saveNote($n);
                    }
                }
                
                return new WebApiResult(true);
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
                CahierTracesPersistCtrl::getInstance()->switchNoteSlot($from, $to);
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