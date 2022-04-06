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

require_once "$CFG->dirroot/local/recitcommon/php/PersistCtrl.php";

use recitcommon;
use stdClass;
use Exception;
use context_course;

/**
 * Singleton class
 */
class PersistCtrl extends recitcommon\MoodlePersistCtrl
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

    public function getUserNotes($cmId, $userId, $flag = 's'){
        $fields = "";
        if ($flag != 's'){
            $fields = "t4.suggestednote as suggestedNote,";
        }
        $query = "select t1.id as mCmId, t2.id as gId, t2.ctid as ctId, t4.title, t4.slot, t5.id as unId, 
                coalesce(t5.note, '') as note, t2.name as groupName, t2.slot as groupSlot, t4.id as nId, t5.cmid as nCmId,
                coalesce(t5.userid, 0) as userId, coalesce(t5.feedback, '') as feedback, t4.templatenote as templateNote, $fields
                t5.lastupdate as lastUpdate, concat(find_in_set(t4.gid, t2.name), t4.slot) as orderByCustom, t3.name as ctName,
                t3.course as courseId, coalesce(t5.note_itemid,0) as noteItemId, t4.notifyteacher as notifyTeacher, if(t5.id > 0 and length(t5.note) > 0, 0, 1) as isTemplate
                from {$this->prefix}course_modules as t1 
                inner join {$this->prefix}recitcahiertraces as t3 on t1.instance = t3.id 
                inner join {$this->prefix}recitct_groups as t2 on t3.id = t2.ctid
                inner join {$this->prefix}recitct_notes as t4 on t2.id = t4.gid
                left join {$this->prefix}recitct_user_notes as t5 on t4.id = t5.nid and t5.userId = $userId
                where t1.id = $cmId
                order by groupSlot, length(orderByCustom) asc, orderByCustom asc";
                
        $tmp = $this->mysqlConn->execSQLAndGetObjects($query);

        $result = array();
        if(count($tmp) > 0){
            $context = \context_course::instance(current($tmp)->courseId);
            $modinfo = get_fast_modinfo(current($tmp)->courseId);
        
            foreach($tmp as $dbData){
                //activity name
                $dbData->cmName = '';
                if ($dbData->nCmId > 0){
                    $dbData->cmName = $this->getCmNameFromCmId($dbData->nCmId, $dbData->courseId, $modinfo);
                }

                // index by group
                $result[$dbData->gId][] = UserNote::create($dbData, $context);
            }
        }
        
        return array_values($result); // reset the array indexes
    }

    /**
     * Fetch the user note (modified to work with exporting/importing the cahier de traces on the same database or elsewhere)
     * From filter plugin method: userId and intCode and courseId
     */
    public function getUserNote($nId, $userId, $intCode = null, $courseId = 0){
        $whereStmt = "0";
        
        if(($userId > 0) && ($intCode != null) && ($courseId > 0)){
            $whereStmt = " (t1.intcode = '$intCode' and t1_1.course = $courseId) ";
        }
        else if($nId > 0){
            $whereStmt = " t1.id = $nId";
        }
        else{
            throw new Exception("Cette fonction requiert comme paramètre 'nId=$nId' ou '(userId=$userId et intCode=$intCode et courseId=$courseId)'.");
        }

        //(case length(recit_strip_tags(coalesce(t2.note, ''))) when 0 then t1.templatenote else t2.note end) as note,
        $query = "select t1.title as title, t1.gid as gId, t3.ctid as ctId, coalesce(t1.intcode, '') as intCode,
        t2.id unId, t2.userid as userId, t1.id as nId,
        if(t2.id > 0 and length(t2.note) > 0, t2.note, t1.templatenote) as note, coalesce(t2.note_itemid,0) as noteItemId, if(t2.id > 0 and length(t2.note) > 0, 0, 1) as isTemplate,
        t1.teachertip as teacherTip, t1.suggestednote as suggestedNote, coalesce(t2.feedback, '') as feedback,  t2.lastupdate as lastUpdate, t2.cmid as nCmId,
        t1_1.course as courseId, t1.notifyteacher as notifyTeacher,
        (select id from {$this->prefix}course_modules where instance = t1_1.id and module = (select id from {$this->prefix}modules where name = 'recitcahiertraces')) as mCmId
        from {$this->prefix}recitct_notes as t1 
        inner join {$this->prefix}recitct_groups as t3 on t1.gid = t3.id
        inner join {$this->prefix}recitcahiertraces as t1_1 on t3.ctid = t1_1.id
        left join {$this->prefix}recitct_user_notes as t2 on t1.id = t2.nid and t2.userid = $userId
        where $whereStmt";
        
        $dbData = $this->mysqlConn->execSQLAndGetObject($query);
        
        if(empty($dbData)){
            throw new Exception("La note n'a pas été trouvée. (nId: $nId, userId: $userId, intCode: $intCode)");
        }

        //list($course, $cm) = get_course_and_cm_from_gId($result->gId);
        $context = context_course::instance($dbData->courseId);
        $result = UserNote::create($dbData, $context);

        return $result;
    }

    public function saveUserNote($data, $flag){
        try{		
            $context = context_course::instance($data->courseId);
    
            if($flag == "s"){
                $data->note->text = file_save_draft_area_files($data->note->itemid, $context->id, 'mod_recitcahiertraces', 'usernote', $data->note->itemid, array('subdirs'=>true), $data->note->text);	

                $data->lastUpdate = time();
                $fields = array("nid", "userid", "note", "note_itemid", "lastupdate", "cmid");
                $values = array($data->nId, $data->userId, $data->note->text, $data->note->itemid, $data->lastUpdate, $data->nCmId);
            }
            else{
                $fields = array("nid", "userid", "feedback");
                $values = array($data->nId, $data->userId, $data->feedback);
            }

            if($data->unId == 0){
                $query = $this->mysqlConn->prepareStmt("insertorupdate", "{$this->prefix}recitct_user_notes", $fields, $values);
                $this->mysqlConn->execSQL($query);
            }
            else{
                $query = $this->mysqlConn->prepareStmt("update", "{$this->prefix}recitct_user_notes", $fields, $values, array("id"), array($data->unId));
                $this->mysqlConn->execSQL($query);
            }
            
            return $this->getUserNote($data->nId, $data->userId);
        }
        catch(Exception $ex){
            throw $ex;
        }
    }

    public function removeNote($nId){  
        try{  
            $this->mysqlConn->beginTransaction();

            $query = "delete from {$this->prefix}recitct_user_notes where id = $nId";
            $this->mysqlConn->execSQL($query);

            $query = "delete from {$this->prefix}recitct_notes where id = $nId";
            $this->mysqlConn->execSQL($query);
            
            $this->mysqlConn->commitTransaction();

            return true;
        }
        catch(\Exception $ex){
            $this->mysqlConn->rollbackTransaction();
            throw $ex;
        }
        return true;
    }

    public function getUserFromItemId($itemId){
        
        $query = "select userId FROM {$this->prefix}recitct_user_notes where note_itemid = $itemId";
        
        $result = $this->mysqlConn->execSQLAndGetObject($query);
        if (!$result) return 0;
        return $result->userId;
    }

    public function getGroupList($cmId){
        
        $query = "select t1.id as gId, t1.name as groupName, t1.slot as groupSlot, t1.ctid as ctId FROM {$this->prefix}course_modules as t2
        inner join {$this->prefix}recitct_groups as t1 on t2.instance = t1.ctid
        where t2.id = $cmId order by t1.slot";
        
        $tmp = $this->mysqlConn->execSQLAndGetObjects($query);

        $result = array();
        foreach($tmp as $item){
            $result[] = NoteGroup::create($item);
        }
        
        return $result;
    }  

    public function reorderNoteGroups($cmId){
        $list = $this->getGroupList($cmId);
        $sql = "";
        $slot = 1;
        foreach($list as $g){
            $sql = "UPDATE {$this->prefix}recitct_groups SET slot=$slot WHERE id={$g->id};";
            $slot++;
            $this->mysqlConn->execSQL($sql);
        }
        
        return true;
    }  

    public function saveNoteGroup($data){
        try{		   
            if($data->ct->id == 0){
                $data->ct->id = $this->getCtIdFromCmId($data->ct->mCmId);
            }

            $fields = array("name", "ctid");
            $values = array($data->name, $data->ct->id);

            if($data->id == 0){
                $query = "select MAX(t1.slot) as groupSlot FROM {$this->prefix}course_modules as t2
                inner join {$this->prefix}recitct_groups as t1 on t2.instance = t1.ctid
                where t2.id = {$data->ct->mCmId} order by t1.slot";
                
                $result = $this->mysqlConn->execSQLAndGetObject($query);
                if (!$result) $slot = 0;
                $slot = $result->groupSlot + 1;
                $fields[] = "slot";
                $values[] = $slot;
                $query = $this->mysqlConn->prepareStmt("insert", "{$this->prefix}recitct_groups", $fields, $values);
                $this->mysqlConn->execSQL($query);
                $data->id = $this->mysqlConn->getLastInsertId("{$this->prefix}recitct_groups", "id");
            }
            else{
                $fields[] = "slot";
                $values[] = $data->slot;
                $query = $this->mysqlConn->prepareStmt("update", "{$this->prefix}recitct_groups", $fields, $values, array("id"), array($data->id));
                $this->mysqlConn->execSQL($query);
            }

            return $data;
        }
        catch(Exception $ex){
            throw $ex;
        }
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
     * Fetch a groupNote (by unique ID = gid) or a set of cmNotes (ctId)
     */
    public function getGroupNotes($gId = 0, $ctId = 0){
        $gidStmt = ($gId == 0 ? "1" : " t1.gid = $gId");

        $cmStmt = "1";
        if($ctId > 0){
            $cmStmt = " (t1.ctid = $ctId)";
        }
        
        $query = "select t1.id as gId, coalesce(t1.intcode, '') as intCode, t3.ctid as ctId, t1.title, t1.slot, t1.templatenote as templateNote, t1.suggestednote as suggestedNote, 
                    t1.teachertip as teacherTip, t1.lastupdate as lastUpdate, t1.notifyteacher as notifyTeacher, t1.id as nId
                    from {$this->prefix}recitct_notes as t1
                    inner join {$this->prefix}recitct_groups as t3 on t1.gid = t3.id
                    inner join {$this->prefix}recitcahiertraces as t1_1 on t3.ctid = t1_1.id
                    where $gidStmt and $cmStmt
                    group by t1.id                
                    order by slot asc";

        $tmp = $this->mysqlConn->execSQLAndGetObjects($query);

        $result = array();
        foreach($tmp as $item){
            $result[] = NoteDef::create($item);
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
        
        $query = "select t1.id as nId, coalesce(t1.intcode, '') as intCode, t1_1.id as ctId, t1.gid as gId, t1.title as title, t1.slot, t1.templatenote as templateNote, t1.suggestednote as suggestedNote, 
                    t1.teachertip as teacherTip, t1.lastupdate as lastUpdate,  t1.notifyteacher as notifyTeacher, t3.name as groupName, t3.slot as groupSlot
                    from {$this->prefix}recitct_notes as t1
                    inner join {$this->prefix}recitct_groups as t3 on t1.gid = t3.id
                    inner join {$this->prefix}recitcahiertraces as t1_1 on t3.ctid = t1_1.id
                    where $cIdStmt and $cmStmt
                    group by t1.id
                    order by slot asc";

        $tmp = $this->mysqlConn->execSQLAndGetObjects($query);

        $result = array();
        foreach($tmp as $item){
            // index by group
            $result[$item->gId][] = NoteDef::create($item);
        }

        return array_values($result); // reset the array indexes
    }

    public function removeNoteGroup($gId){  
        $query = "DELETE t2, t3, t4
        FROM {$this->prefix}recitct_groups as t4
        left JOIN {$this->prefix}recitct_notes as t2 ON t4.id = t2.gid
        left JOIN {$this->prefix}recitct_user_notes as t3 ON t2.id = t3.nid
        WHERE t4.id = $gId";

        $result = $this->mysqlConn->execSQL($query);

        return (!$result ? false : true);
    }

    public function getNoteDef($nId){
        $query = "select t1.title as title, t1.gid as gId, t3.ctid as ctId, coalesce(t1.intcode, '') as intCode, t1.templatenote as templateNote, t1.slot,
        t1.id as nId, t1.teachertip as teacherTip, t1.suggestednote as suggestedNote, t1_1.course as courseId, t1.notifyteacher as notifyTeacher
        from {$this->prefix}recitct_notes as t1 
        inner join {$this->prefix}recitct_groups as t3 on t1.gid = t3.id
        inner join {$this->prefix}recitcahiertraces as t1_1 on t3.ctid = t1_1.id
        where t1.id = $nId";
        
        $dbData = $this->mysqlConn->execSQLAndGetObject($query);
        
        $result = NoteDef::create($dbData);
        
        return $result;
    }

    public function saveNote(NoteDef $data){
        try{
            $data->lastUpdate = time();
            
            if(empty($data->intCode)){
                $data->intCode = hash("md5", $data->title . $data->lastUpdate );
            }
            
            $fields = array("gid", "title", "templatenote", "suggestednote", "teachertip",  "intcode", 'notifyteacher');
            $values = array($data->group->id, $data->title, $data->templateNote, $data->suggestedNote, $data->teacherTip, $data->intCode, $data->notifyTeacher);

            if($data->id == 0){
                $curSlot = $this->mysqlConn->execSQLAndGetObject("select slot from {$this->prefix}recitct_notes where gId = {$data->group->id} order by slot desc limit 1");
                $fields[] = "slot";
                $values[] = (empty($curSlot) ? 1 : $curSlot->slot + 1);

                $query = $this->mysqlConn->prepareStmt("insert", "{$this->prefix}recitct_notes", $fields, $values);
                $this->mysqlConn->execSQL($query);
                $data->id = $this->mysqlConn->getLastInsertId("{$this->prefix}recitct_notes", "id");
            }
            else{
                $fields[] = "slot";
                $values[] = $data->slot;

                $query = $this->mysqlConn->prepareStmt("update", "{$this->prefix}recitct_notes", $fields, $values, array("id"), array($data->id));
                $this->mysqlConn->execSQL($query);
            }
            
            return $data;
        }
        catch(\Exception $ex){
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
                throw new \Exception("Unknown slots");
            }

            $query = sprintf("update {$this->prefix}recitct_notes set slot = %d where id = %d", $tmp[1]->slot, $from);
            $this->mysqlConn->execSQL($query);

            $query = sprintf("update {$this->prefix}recitct_notes set slot = %d where id = %d", $tmp[0]->slot, $to);
            $this->mysqlConn->execSQL($query);

            $this->mysqlConn->commitTransaction();

            return true;
        }
        catch(\Exception $ex){
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
    }
    
    public function removeCCUserdata($id){
        $query = "DELETE t3
        FROM {$this->prefix}recitcahiertraces as t1
        left join {$this->prefix}recitct_groups as t4 on t1.id = t4.ctid
        left JOIN {$this->prefix}recitct_notes as t2 ON t4.id = t2.gid
        left JOIN {$this->prefix}recitct_user_notes as t3 ON t2.id = t3.nid
        WHERE t1.id = $id";

        $result = $this->mysqlConn->execSQL($query);

        return (!$result ? false : true);
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
        
        $allCourseTeachers = $this->getCourseTeachers($courseId);

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
            $message = $this->createInstantMessage($this->signedUser, \core_user::get_user($recipient->id), $courseId, $msg);
            
            $result[] = message_send($message);
        }
        
        return $result;
    }

    public function sendInstantMessagesToStudents(array $recipients, $courseId, $msg){
        $result = array();
        foreach($recipients as $userId){
            $message = $this->createInstantMessage($this->signedUser, \core_user::get_user($userId), $courseId, $msg);
            $result[] = message_send($message);
        }
        
        return $result;
    }

    public function getRequiredNotes($cmId){
        $query = "select t4.id as nId, t2.ctid as ctId, t4.gId as gId, t4.title, t4.slot, t5.id as unId, 
        coalesce(t5.userid, 0) as userId, concat(find_in_set(t4.gId, t2.name), t4.slot) as orderByCustom, 
        t3.course as courseId, concat(t6.firstname, ' ', t6.lastname) as username, t2.name as groupName, t2.slot as groupSlot,
        coalesce(t5.note_itemid,0) as noteItemId, coalesce(t5.note, '') as note, t4.notifyteacher as notifyTeacher, t5.cmid as nCmId
        from {$this->prefix}course_modules as t1 
        inner join {$this->prefix}recitcahiertraces as t3 on t1.instance = t3.id    
        inner join {$this->prefix}recitct_groups as t2 on t3.id = t2.ctid            
        inner join {$this->prefix}recitct_notes as t4 on t2.id = t4.gid
        inner join {$this->prefix}recitct_user_notes as t5 on t4.id = t5.nid
        inner join {$this->prefix}user as t6 on t6.id = t5.userid
        where t1.id = $cmId and t4.notifyTeacher = 1 and 
        if(t5.id > 0 and length(t5.note) > 0 and length(REGEXP_REPLACE(trim(coalesce(t5.feedback, '')), '<[^>]*>+', '')) = 0, 1, 0) = 1 and
        %s
        order by length(orderByCustom) asc, orderByCustom asc
        limit 50";
        
        $query = sprintf($query, $this->getStmtStudentRole('t6.id', 't1.course'));

        $tmp = $this->mysqlConn->execSQLAndGetObjects($query);

        $result = array();
        if(count($tmp) > 0){
            $context = \context_course::instance(current($tmp)->courseId);
            $modinfo = get_fast_modinfo(current($tmp)->courseId);
        
            foreach($tmp as $dbData){
                //activity name
                $dbData->cmName = '';
                if ($dbData->nCmId > 0){
                    $dbData->cmName = $this->getCmNameFromCmId($dbData->nCmId, $dbData->courseId, $modinfo);
                }

                // index by group
                $result[] = UserNote::create($dbData, $context);
            }
        }
        
        return $result;
    }

    public function getStudentsProgression($cmId){
        $query = "select coalesce(t6.id, 0) as userId, concat(t6.firstname, ' ', t6.lastname) as username, if(t5.id > 0 and length(t5.note) > 0, 1, 0) as done,
        group_concat(DISTINCT t9.groupid) as groupIds
        from {$this->prefix}course_modules as t1 
        inner join {$this->prefix}recitcahiertraces as t3 on t1.instance = t3.id 
        inner join {$this->prefix}recitct_groups as t2 on t3.id = t2.ctid
        inner join {$this->prefix}recitct_notes as t4 on t2.id = t4.gid
        inner join {$this->prefix}enrol as t7 on t7.courseid = t1.course
        inner join {$this->prefix}user_enrolments as t8 on t7.id = t8.enrolid
        inner join {$this->prefix}user as t6 on t6.id = t8.userid
        left join {$this->prefix}recitct_user_notes as t5 on t4.id = t5.nid and t5.userid = t6.id
        left join {$this->prefix}groups_members as t9 on t9.userid = t6.id
        where t1.id = $cmId and %s
        group by t4.id, t5.id, t6.id
        order by username";

        $query = sprintf($query, $this->getStmtStudentRole('t6.id', 't1.course'));
        
        $result = $this->mysqlConn->execSQLAndGetObjects($query);
        foreach($result as $item){
            $item->groupIds = array_map('intval', explode(",", $item->groupIds));
        }

        return $result;
    }

    public function importCahierCanada($mCmId, $data){
        try{
            $this->mysqlConn->beginTransaction();
            $numImported = 0;
            $numSkipped = 0;
            $numError = 0;
            $groupCreated = 0;

            foreach ($data as $collection){
                foreach ($collection as $note){
                    if($note->garbage == 1){ 
                        $numSkipped++;
                        continue; 
                    }

                    // check if the integration code already exists
                    $query = "select t1.id, t3.course FROM {$this->prefix}recitct_notes as t1 
                    inner join {$this->prefix}recitct_groups as t2 on t1.gid = t2.id
                    inner join {$this->prefix}recitcahiertraces as t3 on t2.ctid = t3.id
                    where t1.intcode = \"{$note->intCode}\" and t3.course = (select course from mdl_course_modules where id = $mCmId)
                    order by id desc limit 1";

                    $intCode = $this->mysqlConn->execSQLAndGetObject($query);

                    if(!empty($intCode)){ 
                        $numSkipped++;
                        continue;
                    }
                    
                    $obj = new NoteDef();
    
                    $obj->group->name = $note->activityName . " (importé)";
                    $obj->group->ct->mCmId = $mCmId;
                    $obj->group->ct->id = $this->getCtIdFromCmId($mCmId);

                    // check if the collection already exists
                    $name = mysqli_real_escape_string($this->mysqlConn->getMySQLi(), $obj->group->name);
                    $query = "select t1.id as gId, t1.name as groupName, t1.slot as groupSlot, t1.ctid as ctId FROM {$this->prefix}recitct_groups as t1
                        where t1.name = \"$name\" and t1.ctid = {$obj->group->ct->id} order by name asc limit 1";
                    $result = $this->mysqlConn->execSQLAndGetObject($query);
                    $group = (empty($result) ? null : NoteGroup::create($result));
                    
                    if($group == null){
                        $obj->group = PersistCtrl::getInstance()->saveNoteGroup($obj->group);
                        $groupCreated++;
                    }
                    else{
                        $obj->group = $group;
                    }
                   
                    $obj->intCode = $note->intCode;
                    $obj->title = $note->noteTitle;
                    $obj->templateNote = $note->templateNote;
                    $obj->suggestedNote = $note->suggestedNote;
                    $obj->teacherTip = $note->teacherTip;
                    $obj->slot = $note->slot;
                    $obj->notifyTeacher = $note->notifyTeacher;
                    $note = PersistCtrl::getInstance()->saveNote($obj);
                    if ($note){
                        $numImported++;
                    }else{
                        $numError++;
                    }
                }
            }

            $this->mysqlConn->commitTransaction();
            return array('imported' => $numImported, 'skipped' => $numSkipped, 'error' => $numError, 'group' => $groupCreated);
        }
        catch(Exception $ex){
            $this->mysqlConn->rollbackTransaction();
            throw $ex;
        }
    }
}

class CahierTrace{
    public $id = 0;
    public $name = "";
    public $courseId = 0;
    public $mCmId = 0;     // course module cahier traces id ({$this->prefix}course_modules.id)

    public static function create($dbData){
        $result = new CahierTrace();
        
        if(isset($dbData->ctId)){ $result->id = $dbData->ctId; } 

        if(isset($dbData->ctName)){ $result->name = $dbData->groupName; } 

        if(isset($dbData->courseId)){ $result->courseId = $dbData->courseId; } 

        if(isset($dbData->mCmId)){ $result->mCmId = $dbData->mCmId; } 

        return $result;
    }
}

class NoteGroup{
    public $id = 0;
    public $name = "";
    public $slot = 0;
    //@CahierTrace
    public $ct = null;
    
    public function __construct(){
        $this->ct = new CahierTrace();            
    }

    public static function create($dbData){
        $result = new NoteGroup();
        $result->id = $dbData->gId;
        $result->ct = CahierTrace::create($dbData);

        if(isset($dbData->groupName)){ $result->name = $dbData->groupName; } 
        if(isset($dbData->groupSlot)){ $result->slot = $dbData->groupSlot; } 

        return $result;
    }
}

class NoteDef
{
    public $id = 0;
    // @ NoteGroup
    public $group = null; 
    public $intCode = "";
    public $title = "";
	public $slot = 0;
    public $templateNote = "";
    public $suggestedNote = "";
    public $teacherTip = "";
    public $notifyTeacher = 0;

    public function __construct(){
        $this->group = new NoteGroup();            
    }

    public static function create($dbData){
        $result = new NoteDef();
        $result->id = $dbData->nId;
        $result->group = NoteGroup::create($dbData);

        if(isset($dbData->intCode)){
            $result->intCode = $dbData->intCode;
        }

        $result->title = $dbData->title;
        if(isset($dbData->slot)){ $result->slot = $dbData->slot; } 

        if(isset($dbData->templateNote)){ $result->templateNote = $dbData->templateNote; }

        if(isset($dbData->suggestedNote)){ $result->suggestedNote = $dbData->suggestedNote; }

        if(isset($dbData->teacherTip)){ $result->teacherTip = $dbData->teacherTip; }
        
        $result->notifyTeacher = $dbData->notifyTeacher;
        return $result;
    }
}

class UserNote
{
    public $id = 0;       // user note id
    //@ NoteDef
    public $noteDef = null;
    public $nCmId = 0;      // course module id
    public $cmName = "";    // course module name
    public $userId = 0;
    public $username = "";
    public $noteContent = null;    // student note ({text: '', itemid: 0})
    public $feedback = "";  // teacher feedback 
    public $lastUpdate = 0;
    public $isTemplate = false;

    public function lastUpdateFormat(){
        return ($this->lastUpdate > 0 ? date('Y-m-d H:i:s', $this->lastUpdate) : '');
    }

    public static function create($dbData, $context = null){
        $result = new UserNote();
        $result->id = $dbData->unId;
        $result->noteDef = NoteDef::create($dbData);
        if(isset($dbData->nCmId)){ $result->nCmId = $dbData->nCmId; }
        if(isset($dbData->cmName)){ $result->cmName = $dbData->cmName; }

        $result->userId = $dbData->userId;
        
        $result->noteContent = new stdClass();
        $result->noteContent->text = "";
        $result->noteContent->itemid = 0;
        
        if(!empty($context)){
            $result->noteContent->text = file_rewrite_pluginfile_urls($dbData->note, 'pluginfile.php', $context->id, 'mod_recitcahiertraces', 'usernote', $dbData->noteItemId);
            $result->noteContent->itemid = $dbData->noteItemId;
        }

        if(isset($dbData->username)){ $result->username = $dbData->username; }
        if(isset($dbData->feedback)){ $result->feedback = $dbData->feedback; }
        if(isset($dbData->lastUpdate)){ $result->lastUpdate = $dbData->lastUpdate; }
        if(isset($dbData->isTemplate)){ $result->isTemplate = $dbData->isTemplate; }
        
        return $result;
    }
}
