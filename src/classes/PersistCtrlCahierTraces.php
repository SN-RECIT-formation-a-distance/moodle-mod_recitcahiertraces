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
require_once "$CFG->dirroot/local/recitcommon/php/PersistCtrl.php";

/**
 * Singleton class
 */
    class CahierTracesPersistCtrl extends MoodlePersistCtrl
    {
        protected static $instance = null;
        
        /**
         * @param MySQL Resource
         * @return PersistCtrl
         */
        public static function getInstance($mysqlConn = null, $signedUser = null)
        {
            if(!isset(self::$instance)) {
                self::$instance = new self($mysqlConn, $signedUser);
            }
            return self::$instance;
        }
        
        protected function __construct($mysqlConn, $signedUser){
            parent::__construct($mysqlConn, $signedUser);
        }

        public function getPersonalNotes($cmId, $userId){
            $query = "select t1.instance as cmId, t2.id as gid, t2.ctid as ctid, t4.title as noteTitle, t4.slot, t5.id as personalNoteId, 
                    coalesce(t5.note, '') as note, t2.name as groupName, t4.id as nid, t5.cmid as ncmid,
                    coalesce(t5.userid, 0) as userId, coalesce(t5.feedback, '') as feedback, t4.templatenote as templateNote, 
                    t5.grade, t5.lastupdate as lastUpdate, concat(find_in_set(t4.gId, t2.name), t4.slot) as orderByCustom, t3.name as ccName,
                    t3.course as courseId, coalesce(t5.note_itemid,0) as noteItemId, t4.notifyteacher as notifyTeacher, if(t5.id > 0 and length(t5.note) > 0, 0, 1) as isTemplate
                    from {$this->prefix}course_modules as t1 
                    inner join {$this->prefix}recitcahiertraces as t3 on t1.instance = t3.id 
                    inner join {$this->prefix}recitct_groups as t2 on t3.id = t2.ctid
                    inner join {$this->prefix}recitct_notes as t4 on t2.id = t4.gid
                    left join {$this->prefix}recitct_user_notes as t5 on t4.id = t5.nid and t5.userId = $userId
                    where t1.id = $cmId
                    order by length(orderByCustom) asc, orderByCustom asc";
                    
            $tmp = $this->mysqlConn->execSQLAndGetObjects($query, 'PersonalNote');

            if(count($tmp) > 0){
                $context = context_course::instance(current($tmp)->courseId);
                $modinfo = get_fast_modinfo(current($tmp)->courseId);
            
                foreach($tmp as $item){
                    $obj = new stdClass();
                    $obj->text = file_rewrite_pluginfile_urls($item->note, 'pluginfile.php', $context->id, 'mod_recitcahiertraces', 'personalnote', $item->noteItemId);
                    $obj->itemid = $item->noteItemId;
                    $item->note = $obj;
                    unset($item->noteItemId);

                    //activity name
                    $item->activityName = '';
                    if ($item->ncmid > 0){
                        $item->activityName = $this->getCmNameFromCmId($item->ncmid, $item->courseId, $modinfo);
                    }
                }
            }
            
            // index by group
            $result = array();
            foreach($tmp as $item){
                $result[$item->gid][] = $item;
            }

            return array_values($result); // reset the array indexes
        }

        public function getUserFromItemId($itemId){
            
            $query = "select userId FROM {$this->prefix}recitct_user_notes where note_itemid = $itemId";
            
            $result = $this->mysqlConn->execSQLAndGetObject($query);
            if (!$result) return 0;
            return $result->userId;
        }

        public function getGroupList($cmId){
            
            $query = "select t1.id as id, t1.name as name, t1.ctid as ctid FROM {$this->prefix}course_modules as t2
            inner join {$this->prefix}recitct_groups as t1 on t2.instance = t1.ctid
            where t2.id = $cmId";
            
            $result = $this->mysqlConn->execSQLAndGetObjects($query);
            if (!$result) return [];
            return $result;
        }

        public function getGroupIdFromName($ctId, $gName){
            
            $query = "select * FROM {$this->prefix}recitct_groups where ctid = $ctId and name='$gName'";
            
            $result = $this->mysqlConn->execSQLAndGetObject($query);
            if (!$result) return false;
            return $result->id;
        }

        public function addGroup($ctId, $gName){
            $query = $this->mysqlConn->prepareStmt("insert", "{$this->prefix}recitct_groups", array('ctid', 'name'), array($ctId, $gName));
            $this->mysqlConn->execSQL($query);
            $gid = $this->mysqlConn->getLastInsertId("{$this->prefix}recitct_groups", "id");
            return $gid;
        }

        public function getCtIdFromCmId($cmId){
            $query = "select instance from {$this->prefix}course_modules as t2
            inner join {$this->prefix}recitcahiertraces as t1_1 on t2.instance = t1_1.id
            where t2.module = (select id from {$this->prefix}modules where name = 'recitcahiertraces') and t2.id = $cmId";
            
            $result = $this->mysqlConn->execSQLAndGetObject($query);
            if (!$result) return 0;
            return $result->instance;
        }

        /**
         * Fetch the personal note (modified to work with exporting/importing the cahier de traces on the same database or elsewhere)
         * Other method: gid and userId
         * From filter plugin method: userId and intCode
         */
        public function getPersonalNote($nid, $userId, $intCode = null){
            $nid = intval($nid);		
            $whereStmt = "0";
            
            if($intCode != null){
                $whereStmt = " (t1.intcode = '$intCode') ";
            }
            else if($nid > 0){
                $whereStmt = " t1.id = $nid";
            }
            
            //(case length(recit_strip_tags(coalesce(t2.note, ''))) when 0 then t1.templatenote else t2.note end) as note,
            $query = "select t1.title as noteTitle, t1.gId as gId, t3.ctid as ctid, coalesce(t1.intcode, '') as intCode,
            t1.id as gid, t2.id, t2.userid as userId, t1.id as nid,
            if(t2.id > 0 and length(t2.note) > 0, t2.note, t1.templatenote) as note, coalesce(t2.note_itemid,0) as noteItemId, if(t2.id > 0 and length(t2.note) > 0, 0, 1) as isTemplate,
            t1.teachertip as teacherTip, t1.suggestednote as suggestedNote, coalesce(t2.feedback, '') as feedback, t2.grade, t2.lastupdate as lastUpdate,
            t1_1.course as courseId, t1.notifyteacher as notifyTeacher,
            (select id from {$this->prefix}course_modules where instance = t1_1.id and module = (select id from {$this->prefix}modules where name = 'recitcahiertraces')) as mcmId
            from {$this->prefix}recitct_notes as t1 
            inner join {$this->prefix}recitct_groups as t3 on t1.gid = t3.id
            inner join {$this->prefix}recitcahiertraces as t1_1 on t3.ctid = t1_1.id
            left join {$this->prefix}recitct_user_notes as t2 on t1.id = t2.nid and t2.userid = $userId
            where $whereStmt";
            
            $result = $this->mysqlConn->execSQLAndGetObject($query, 'PersonalNote');
            
            if(empty($result)){
                throw new Exception("La note n'a pas été trouvée. (nid: $nid, userId: $userId, intCode: $intCode)");
            }

            //list($course, $cm) = get_course_and_cm_from_gId($result->gId);
            $context = context_course::instance($result->courseId);
            
            //$result->note = file_rewrite_pluginfile_urls($result->note, 'pluginfile.php', $context->id, 'mod_recitcahiertraces', 'personalnote', $result->gid);
            $obj = new stdClass();
            $obj->text = file_rewrite_pluginfile_urls($result->note, 'pluginfile.php', $context->id, 'mod_recitcahiertraces', 'personalnote', $result->noteItemId);
            $obj->itemid = $result->noteItemId;
            $result->note = $obj;
            unset($result->noteItemId);
            
            return $result;
        }

        public function savePersonalNote($data, $flag){
            try{		
                $context = context_course::instance($data->courseId);
        
                if($flag == "s"){
                    $data->note->text = file_save_draft_area_files($data->note->itemid, $context->id, 'mod_recitcahiertraces', 'personalnote', $data->note->itemid, array('subdirs'=>true), $data->note->text);	

                    $data->lastUpdate = time();
                    $fields = array("nid", "userid", "note", "note_itemid", "lastupdate");
                    $values = array($data->nid, $data->userId, $data->note->text, $data->note->itemid, $data->lastUpdate);
                    if (isset($data->cmId)){
                        $fields[] = "cmid";
                        $values[] = $data->cmId;
                    }
                }
                else{
                    $fields = array("nid", "userid", "feedback");
                    $values = array($data->nid, $data->userId, $data->feedback);
                }

                if($data->personalNoteId == 0){
                    $query = $this->mysqlConn->prepareStmt("insertorupdate", "{$this->prefix}recitct_user_notes", $fields, $values);
                    $this->mysqlConn->execSQL($query);

                    //$obj = $this->mysqlConn->execSQLAndGetObject("select id from {$this->prefix}recitct_user_notes where gid = $data->gid and userid = $data->userId");
                    //$data->personalNoteId = $obj->id;
                }
                else{
                    $query = $this->mysqlConn->prepareStmt("update", "{$this->prefix}recitct_user_notes", $fields, $values, array("id"), array($data->personalNoteId));
                    $this->mysqlConn->execSQL($query);
                }
                
                return $this->getPersonalNote($data->nid, $data->userId);
            }
            catch(Exception $ex){
                throw $ex;
            }
        }

        /**
         * Fetch a groupNote (by unique ID = gid) or a set of cmNotes (gId+ctid = gId and CahierCanada ID)
         */
        public function getGroupNotes($gid = 0, $ctid = 0){
            $gidStmt = ($gid == 0 ? "1" : " t1.gid = $gid");

            $cmStmt = "1";
            if($ctid > 0){
                $cmStmt = " (t1.ctid = $ctid)";
            }
            
            $query = "select t1.id as gid, coalesce(t1.intcode, '') as intCode, t3.ctid as ctid, t1.gid as gid, t1.title as noteTitle, t1.slot, t1.templatenote as templateNote, t1.suggestednote as suggestedNote, 
                        t1.teachertip as teacherTip, t1.lastupdate as lastUpdate, t1.notifyteacher as notifyTeacher, t1.id as nid,
                        GROUP_CONCAT(t2.id) as tagList
                        from {$this->prefix}recitct_notes as t1
                        left join {$this->prefix}tag_instance as t2 on t1.id = t2.itemid and itemtype = 'cccmnote' and component = 'mod_cahiercanada'
                        inner join {$this->prefix}recitct_groups as t3 on t1.gid = t3.id
                        inner join {$this->prefix}recitcahiertraces as t1_1 on t3.ctid = t1_1.id
                        where $gidStmt and $cmStmt
                        group by t1.id                
                        order by slot asc";

            $result = $this->mysqlConn->execSQLAndGetObjects($query, 'CmNote');

            foreach($result as &$item){
                $item->tagList = ($item->tagList == null ? array() : explode(",", $item->tagList));

                foreach($item->tagList as &$instanceId){
                    $instanceId = intval($instanceId);
                }
            }

            return $result;
        }

        /**
         * Fetch a cmNote (by unique ID = gid) or a set of cmNotes (gId+ctid = gId and CahierCanada ID)
         */
        public function getCmSuggestedNotes($cId = 0, $gId = 0){
            $cIdStmt = ($cId == 0 ? "1" : " t1_1.course = $cId");

            $cmStmt = "1";
            if($gId > 0){
                $cmStmt = " (t1.gid = $gId)";
            }
            
            $query = "select t1.id as nid, coalesce(t1.intcode, '') as intCode, t1_1.id as ctid, t1.gid as gid, t1.title as noteTitle, t1.slot, t1.templatenote as templateNote, t1.suggestednote as suggestedNote, 
                        t1.teachertip as teacherTip, t1.lastupdate as lastUpdate,  t1.notifyteacher as notifyTeacher
                        from {$this->prefix}recitct_notes as t1
                        inner join {$this->prefix}recitct_groups as t3 on t1.gid = t3.id
                        inner join {$this->prefix}recitcahiertraces as t1_1 on t3.ctid = t1_1.id
                        where $cIdStmt and $cmStmt
                        group by t1.id
                        order by slot asc";

            $tmp = $this->mysqlConn->execSQLAndGetObjects($query, 'CmNote');

            if(empty($tmp)){
                return $tmp;
            }

            // index by group
            $result = array();
            foreach($tmp as $item){
                $result[$item->gId][] = $item;
            }

            return array_values($result); // reset the array indexes
        }

        public function removeNote($nid){  
            try{  
                $this->mysqlConn->beginTransaction();

                $query = "delete from {$this->prefix}recitct_user_notes where id = $nid";
                $this->mysqlConn->execSQL($query);

                $query = "delete from {$this->prefix}recitct_notes where id = $nid";
                $this->mysqlConn->execSQL($query);
                
                $this->mysqlConn->commitTransaction();

                return true;
            }
            catch(Exception $ex){
                $this->mysqlConn->rollbackTransaction();
                throw $ex;
            }
            return true;
        }

        public function removeGroup($gId){  
            $query = "DELETE t2, t3, t4
            FROM {$this->prefix}recitct_groups as t4
            left JOIN {$this->prefix}recitct_notes as t2 ON t4.id = t2.gid
            left JOIN {$this->prefix}recitct_user_notes as t3 ON t2.id = t3.nid
            WHERE t4.id = $gId";

            $result = $this->mysqlConn->execSQL($query);

            return (!$result ? false : true);
        }

        public function renameGroup($gId, $name){  
            $query = "UPDATE {$this->prefix}recitct_groups set `name` = '$name' WHERE id = $gId";

            $result = $this->mysqlConn->execSQL($query);

            return (!$result ? false : true);
        }

        public function saveNote($data){
            try{
                $data->lastUpdate = time();
                
                if(empty($data->intCode)){
                    $data->intCode = hash("md5", $data->noteTitle . $data->lastUpdate );
                }
                
                $fields = array("gid", "title", "templatenote", "suggestednote", "teachertip", "lastupdate", "intcode", 'notifyteacher');
                $values = array($data->gId, $data->noteTitle, $data->templateNote, $data->suggestedNote, $data->teacherTip, $data->lastUpdate, $data->intCode, $data->notifyTeacher);

                if($data->nid == 0){
                    $curSlot = $this->mysqlConn->execSQLAndGetObject("select slot from {$this->prefix}recitct_notes where gId = $data->gId order by slot desc limit 1");
                    $fields[] = "slot";
                    $values[] = (empty($curSlot) ? 1 : $curSlot->slot + 1);

                    $query = $this->mysqlConn->prepareStmt("insert", "{$this->prefix}recitct_notes", $fields, $values);
                    $this->mysqlConn->execSQL($query);
                    $data->nid = $this->mysqlConn->getLastInsertId("{$this->prefix}recitct_notes", "id");
                }
                else{
                    $fields[] = "slot";
                    $values[] = $data->slot;

                    $query = $this->mysqlConn->prepareStmt("update", "{$this->prefix}recitct_notes", $fields, $values, array("id"), array($data->nid));
                    $this->mysqlConn->execSQL($query);
                }
                
                return $data->nid;
            }
            catch(Exception $ex){
                throw $ex;
            }
        }

        public function switchNoteSlot($from, $to){
            try{
                $this->mysqlConn->beginTransaction();
                $tmp = $this->mysqlConn->execSQLAndGetObjects("select slot from {$this->prefix}recitct_notes where id in ($from, $to) order by FIELD(id, $from, $to)");

                // $tmp[0] = from
                // $tmp[1] = to
                if(!isset($tmp[0]) || !isset($tmp[1])){
                    throw new Exception("Unknown slots");
                }

                $query = sprintf("update {$this->prefix}recitct_notes set slot = %d where id = %d", $tmp[1]->slot, $from);
                $this->mysqlConn->execSQL($query);

                $query = sprintf("update {$this->prefix}recitct_notes set slot = %d where id = %d", $tmp[0]->slot, $to);
                $this->mysqlConn->execSQL($query);

                $this->mysqlConn->commitTransaction();

                return true;
            }
            catch(Exception $ex){
                $this->mysqlConn->rollbackTransaction();
                throw $ex;
            }
        }
        
        public function removeCcInstance($id){
            $query = "DELETE t1, t2, t3, t4
            FROM {$this->prefix}recitcahiertraces as t1
            left join {$this->prefix}recitct_groups as t4 on t1.id = t4.ctid
            left JOIN {$this->prefix}recitct_notes as t2 ON t4.id = t2.gid
            left JOIN {$this->prefix}recitct_user_notes as t3 ON t2.id = t3.nid
            WHERE t1.id = $id";

            $result = $this->mysqlConn->execSQL($query);

            return (!$result ? false : true);

            /*try{
                $this->mysqlConn->beginTransaction();

                $obj = $this->mysqlConn->execSQL($query);

                $this->mysqlConn->commitTransaction();
            }
            catch(Exception $ex){
                $this->mysqlConn->rollbackTransaction();
            }*/
        }

        public function createInstantMessage($userFrom, $userTo, $courseId, $msg, $component = 'mod_recitcahiertraces', $name = 'note_updated', $subject = 'Notification Cahier de Traces', $notification = '1'){
            $message = new \core\message\message();
            $message->component = $component;
            $message->name = $name;
            $message->userfrom = $userFrom;
            $message->userto =  $userTo;
            $message->subject = $subject;
            //$message->fullmessage = 'message body';
            $message->fullmessageformat = FORMAT_MARKDOWN;
            $message->fullmessagehtml = $msg; //'<p>message body</p>';
            //$message->smallmessage = 'small message';
            $message->notification = $notification; // it is a notification not a message
            //$message->contexturl = 'http://GalaxyFarFarAway.com';
            //$message->contexturlname = 'Context name';
            $message->replyto = "noreply@example.com";
            //$content = array('*' => array('header' => ' test ', 'footer' => ' test ')); // Extra content for specific processor
            //$message->set_additional_content('email', $content);
            $message->courseid = $courseId; // This is required in recent versions, use it from 3.2 on https://tracker.moodle.org/browse/MDL-47162
            
            // Create a file instance.
            /*$usercontext = context_user::instance($user->id);
            $file = new stdClass;
            $file->contextid = $usercontext->id;
            $file->component = 'user';
            $file->filearea  = 'private';
            $file->itemid    = 0;
            $file->filepath  = '/';
            $file->filename  = '1.txt';
            $file->source    = 'test';
            
            $fs = get_file_storage();
            $file = $fs->create_file_from_string($file, 'file1 content');
            $message->attachment = $file;*/

            return $message;
        }

        public function sendInstantMessagesToTeachers($courseId, $msg){
            $groupIds = array();
            if(!empty($this->signedUser->groupmember[$courseId])){
                $groupIds = $this->signedUser->groupmember[$courseId];
            }
            
            $allCourseTeachers = CahierTracesPersistCtrl::getInstance()->getCourseTeachers($courseId);

            /*
             * Si le prof est dans un groupe il est notifié par les élèves qui font parti de son groupe.
             * Si le groupe n'a pas de prof, on notifie tous les prof du cours
             * Si l'élève n'a pas de groupe, on notifie tous les prof du cours
             */
            $recipients = array();
            foreach($allCourseTeachers as $teacher){
                $teacherBelongingToStudentGroup = array_intersect($teacher->groupIds, $groupIds);
                
                if(!empty($teacherBelongingToStudentGroup)){
                    $recipients[] = $teacher;
                }
            }

            if(empty($recipients)){
                $recipients = $allCourseTeachers;
            }

            $result = array();
            foreach($recipients as $recipient){
                $message = $this->createInstantMessage($this->signedUser, core_user::get_user($recipient->id), $courseId, $msg);
                
                $result[] = message_send($message);
            }
            
            return $result;
        }

        public function sendInstantMessagesToStudents(array $recipients, $courseId, $msg){
            $result = array();
            foreach($recipients as $userId){
                $message = $this->createInstantMessage($this->signedUser, core_user::get_user($userId), $courseId, $msg);
                $result[] = message_send($message);
            }
            
            return $result;
        }

        public function getRequiredNotes($cmId){
            $query = "select t1.instance, t4.id as gid, t2.ctid as ctid, t4.gId as gId, t4.title as noteTitle, t4.slot, t5.id as personalNoteId, 
            coalesce(t5.userid, 0) as userId, concat(find_in_set(t4.gId, t2.name), t4.slot) as orderByCustom, t4.id as nid,
            t3.course as courseId, concat(t6.firstname, ' ', t6.lastname) as username, t2.name as groupName
            from {$this->prefix}course_modules as t1 
            inner join {$this->prefix}recitcahiertraces as t3 on t1.instance = t3.id    
            inner join {$this->prefix}recitct_groups as t2 on t3.id = t2.ctid            
            inner join {$this->prefix}recitct_notes as t4 on t2.id = t4.gid
            inner join {$this->prefix}recitct_user_notes as t5 on t4.id = t5.gid
            inner join {$this->prefix}user as t6 on t6.id = t5.userid
            where t1.id = $cmId and t4.notifyTeacher = 1 and 
            if(t5.id > 0 and length(t5.note) > 0 and length(REGEXP_REPLACE(trim(coalesce(t5.feedback, '')), '<[^>]*>+', '')) = 0, 1, 0) = 1 and
            %s
            order by length(orderByCustom) asc, orderByCustom asc
            limit 50";
            
            $query = sprintf($query, $this->getStmtStudentRole('t6.id', 't1.course'));

            $result = $this->mysqlConn->execSQLAndGetObjects($query);

            return $result;
        }

        public function getStudentsProgression($cmId){
            $query = "select t4.id as gid, t2.ctid as ctid, t4.gId as gId, t4.title as noteTitle, t4.slot, coalesce(t5.id,0) as personalNoteId, 
            coalesce(t6.id, 0) as userId, concat(find_in_set(t4.gId, t2.name), t4.slot) as orderByCustom, t4.id as nid,
            t3.course as courseId, concat(t6.firstname, ' ', t6.lastname) as username, if(t5.id > 0 and length(t5.note) > 0, 1, 0) as done,
            group_concat(DISTINCT t9.groupid) as groupIds
            from {$this->prefix}course_modules as t1 
            inner join {$this->prefix}recitcahiertraces as t3 on t1.instance = t3.id 
            inner join {$this->prefix}recitct_groups as t2 on t3.id = t2.ctid
            inner join {$this->prefix}recitct_notes as t4 on t2.id = t4.gid
            inner join {$this->prefix}enrol as t7 on t7.courseid = t1.course
            inner join {$this->prefix}user_enrolments as t8 on t7.id = t8.enrolid
            inner join {$this->prefix}user as t6 on t6.id = t8.userid
            left join {$this->prefix}recitct_user_notes as t5 on t4.id = t5.gid and t5.userid = t6.id
            left join {$this->prefix}groups_members as t9 on t9.userid = t6.id
            where t1.id = $cmId and %s
            group by t4.id, t5.id, t6.id
            order by length(orderByCustom) asc, orderByCustom asc";

            $query = sprintf($query, $this->getStmtStudentRole('t6.id', 't1.course'));
            
            $result = $this->mysqlConn->execSQLAndGetObjects($query);
            foreach($result as $item){
                $item->groupIds = array_map('intval', explode(",", $item->groupIds));
            }

            return $result;
        }
    }