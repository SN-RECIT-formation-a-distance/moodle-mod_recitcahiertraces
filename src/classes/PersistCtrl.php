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
namespace recitcahiercanada;

require_once "$CFG->dirroot/local/recitcommon/php/PersistCtrl.php";

use recitcommon;
use Exception;
use stdClass;
use context_course;
use core_user;

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

    public function getPersonalNotes($cmId, $userId, $garbage = false){
        $query = "select t1.instance, t4.id as ccCmId, t4.ccid as ccId, t4.cmid as cmId, t4.title as noteTitle, t4.slot, t5.id as personalNoteId, 
                coalesce(t5.note, '') as note,
                coalesce(t5.userid, 0) as userId, coalesce(t5.feedback, '') as feedback, 
                t5.grade, t5.lastupdate as lastUpdate, concat(find_in_set(t4.cmId, t2.sequence), t4.slot) as orderByCustom, t3.name as ccName, t4.templatenote as templateNote,
                t3.course as courseId, coalesce(t5.note_itemid,0) as noteItemId, t4.notifyteacher as notifyTeacher, if(t5.id > 0 and length(t5.note) > 0, 0, 1) as isTemplate
                from {$this->prefix}course_modules as t1 
                inner join {$this->prefix}course_sections as t2 on t1.section = t2.id 
                inner join {$this->prefix}recitcahiercanada as t3 on t1.instance = t3.id                
                inner join {$this->prefix}recitcc_cm_notes as t4 on t3.id = t4.ccid
                left join {$this->prefix}recitcc_user_notes as t5 on t4.id = t5.cccmid and t5.userId = $userId
                where t1.id = $cmId and exists(select id from {$this->prefix}course_modules cm where id = t4.cmid and deletioninprogress = 0) -- avoid to fetch deleted activities
                order by length(orderByCustom) asc, orderByCustom asc";
                
        $tmp = $this->mysqlConn->execSQLAndGetObjects($query, 'recitcahiercanada\PersonalNote');

        if(count($tmp) > 0){
            $context = context_course::instance(current($tmp)->courseId);
        
            foreach($tmp as $item){
                $obj = new stdClass();
                $obj->text = file_rewrite_pluginfile_urls($item->note, 'pluginfile.php', $context->id, 'mod_recitcahiercanada', 'personalnote', $item->noteItemId);
                $obj->itemid = $item->noteItemId;
                $item->note = $obj;
                unset($item->noteItemId);	
            }        
        }
                
        $this->setSectionActivitiesName($cmId, $tmp);

        // index by activity
        $result = array();
        foreach($tmp as $item){
            if (!$garbage || isset($item->garbage)){
                $result[$item->cmId][] = $item;
            }
        }

        return array_values($result); // reset the array indexes
    }

    public function getUserFromItemId($itemId){
        
        //(case length(recit_strip_tags(coalesce(t2.note, ''))) when 0 then t1.templatenote else t2.note end) as note,
        $query = "select userId FROM {$this->prefix}recitcc_user_notes where note_itemid = $itemId";
        
        $result = $this->mysqlConn->execSQLAndGetObject($query);
        if (!$result) return 0;
        return $result->userId;
    }

    /**
     * Fetch the personal note (modified to work with exporting/importing the cahier de traces on the same database or elsewhere)
     * Other method: ccCmId and userId
     * From filter plugin method: userId and intCode and cmId
     */
    public function getPersonalNote($ccCmId, $userId, $intCode = null, $cmId = 0){
        $ccCmId = intval($ccCmId);		
        $whereStmt = "0";
        
        if($intCode != null){
            $whereStmt = " (t1.intcode = '$intCode' and t1.cmid = $cmId) ";
        }
        else if($ccCmId > 0){
            $whereStmt = " t1.id = $ccCmId";
        }
        
        //(case length(recit_strip_tags(coalesce(t2.note, ''))) when 0 then t1.templatenote else t2.note end) as note,
        $query = "select t1.title as noteTitle, t1.cmid as cmId, t1.ccid as ccId, coalesce(t1.intcode, '') as intCode,
        t1.id as ccCmId, t2.id, t2.userid as userId,  
        if(t2.id > 0 and length(t2.note) > 0, t2.note, t1.templatenote) as note, coalesce(t2.note_itemid,0) as noteItemId, if(t2.id > 0 and length(t2.note) > 0, 0, 1) as isTemplate,
        t1.teachertip as teacherTip, t1.suggestednote as suggestedNote, coalesce(t2.feedback, '') as feedback, t2.grade, t2.lastupdate as lastUpdate,
        t1_1.course as courseId, t1.notifyteacher as notifyTeacher,
        (select id from {$this->prefix}course_modules where instance = t1_1.id and module = (select id from {$this->prefix}modules where name = 'recitcahiercanada')) as mcmId
        from {$this->prefix}recitcc_cm_notes as t1 
        inner join {$this->prefix}recitcahiercanada as t1_1 on t1.ccid = t1_1.id
        left join {$this->prefix}recitcc_user_notes as t2 on t1.id = t2.cccmid and t2.userid = $userId
        where $whereStmt";
        
        $result = $this->mysqlConn->execSQLAndGetObject($query, 'recitcahiercanada\PersonalNote');
        
        if(empty($result)){
            throw new Exception("La note n'a pas été trouvée. (ccCmId: $ccCmId, userId: $userId, intCode: $intCode, cmId: $cmId)");
        }

        //list($course, $cm) = get_course_and_cm_from_cmid($result->cmId);
        $context = context_course::instance($result->courseId);
        
        //$result->note = file_rewrite_pluginfile_urls($result->note, 'pluginfile.php', $context->id, 'mod_recitcahiercanada', 'personalnote', $result->ccCmId);
        $obj = new stdClass();
        $obj->text = file_rewrite_pluginfile_urls($result->note, 'pluginfile.php', $context->id, 'mod_recitcahiercanada', 'personalnote', $result->noteItemId);
        $obj->itemid = $result->noteItemId;
        $result->note = $obj;
        unset($result->noteItemId);
        
        return $result;
    }

    public function savePersonalNote($data, $flag){
        try{		
            $context = context_course::instance($data->courseId);
    
            if($flag == "s"){
                $data->note->text = file_save_draft_area_files($data->note->itemid, $context->id, 'mod_recitcahiercanada', 'personalnote', $data->note->itemid, array('subdirs'=>true), $data->note->text);	

                $data->lastUpdate = time();
                $fields = array("cccmid", "userid", "note", "note_itemid", "lastupdate");
                $values = array($data->ccCmId, $data->userId, $data->note->text, $data->note->itemid,  $data->lastUpdate);
            }
            else{
                $fields = array("cccmid", "userid", "feedback");
                $values = array($data->ccCmId, $data->userId, $data->feedback);
            }

            if($data->personalNoteId == 0){
                $query = $this->mysqlConn->prepareStmt("insertorupdate", "{$this->prefix}recitcc_user_notes", $fields, $values);
                $this->mysqlConn->execSQL($query);

                //$obj = $this->mysqlConn->execSQLAndGetObject("select id from {$this->prefix}recitcc_user_notes where cccmid = $data->ccCmId and userid = $data->userId");
                //$data->personalNoteId = $obj->id;
            }
            else{
                $query = $this->mysqlConn->prepareStmt("update", "{$this->prefix}recitcc_user_notes", $fields, $values, array("id"), array($data->personalNoteId));
                $this->mysqlConn->execSQL($query);
            }
            
            return $this->getPersonalNote($data->ccCmId, $data->userId);
        }
        catch(Exception $ex){
            throw $ex;
        }
    }

    /**
     * Fetch a cmNote (by unique ID = ccCmId) or a set of cmNotes (cmId+ccId = cmId and CahierCanada ID)
     */
    public function getCmNotes($ccCmId = 0, $cmId = 0, $ccId = 0){
        $ccCmIdStmt = ($ccCmId == 0 ? "1" : " t1.id = $ccCmId");

        $cmStmt = "1";
        if($cmId > 0){
            $cmStmt = " (t1.cmid = $cmId and t1.ccid = $ccId)";
        }
        
        $query = "select t1.id as ccCmId, coalesce(t1.intcode, '') as intCode, t1.ccid as ccId, t1.cmid as cmId, t1.title as noteTitle, t1.slot, t1.templatenote as templateNote, t1.suggestednote as suggestedNote, 
                    t1.teachertip as teacherTip, t1.lastupdate as lastUpdate,  t1.notifyteacher as notifyTeacher,
                    GROUP_CONCAT(t2.id) as tagList
                    from {$this->prefix}recitcc_cm_notes as t1
                    left join {$this->prefix}tag_instance as t2 on t1.id = t2.itemid and itemtype = 'cccmnote' and component = 'mod_cahiercanada'
                    where $ccCmIdStmt and $cmStmt
                    group by t1.id                
                    order by slot asc";

        $result = $this->mysqlConn->execSQLAndGetObjects($query, 'recitcahiercanada\CmNote');

        foreach($result as &$item){
            $item->tagList = ($item->tagList == null ? array() : explode(",", $item->tagList));

            foreach($item->tagList as &$instanceId){
                $instanceId = intval($instanceId);
            }
        }

        return $result;
    }

    /**
     * Fetch a cmNote (by unique ID = ccCmId) or a set of cmNotes (cmId+ccId = cmId and CahierCanada ID)
     */
    public function getCmSuggestedNotes($cId = 0, $cmId = 0){
        $cIdStmt = ($cId == 0 ? "1" : " t1_1.course = $cId");

        $cmStmt = "1";
        if($cmId > 0){
            $cmStmt = " (t1.cmid = $cmId)";
        }
        
        $query = "select t1.id as ccCmId, coalesce(t1.intcode, '') as intCode, t1.ccid as ccId, t1.cmid as cmId, t1.title as noteTitle, t1.slot, t1.templatenote as templateNote, t1.suggestednote as suggestedNote, 
                    t1.teachertip as teacherTip, t1.lastupdate as lastUpdate,  t1.notifyteacher as notifyTeacher
                    from {$this->prefix}recitcc_cm_notes as t1
                    inner join {$this->prefix}recitcahiercanada as t1_1 on t1.ccid = t1_1.id
                    where $cIdStmt and $cmStmt
                    group by t1.id
                    order by slot asc";

        $tmp = $this->mysqlConn->execSQLAndGetObjects($query, 'recitcahiercanada\CmNote');

        if(empty($tmp)){
            return $tmp;
        }

        $this->setSectionActivitiesName(current($tmp)->cmId, $tmp);

        // index by activity
        $result = array();
        foreach($tmp as $item){
            $result[$item->cmId][] = $item;
        }

        return array_values($result); // reset the array indexes
    }

    public function getCcCmNote($ccCmId){
        $result = $this->getCmNotes($ccCmId);
        $result = array_shift($result);
        return $result;
    }

    public function removeCcCmNote($ccCmId){  
        try{  
            $this->mysqlConn->beginTransaction();

            $query = "delete from {$this->prefix}recitcc_user_notes where cccmid = $ccCmId";
            $this->mysqlConn->execSQL($query);

            $query = "delete from {$this->prefix}recitcc_cm_notes where id = $ccCmId";
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

    public function saveCcCmNote($data){
        try{
            $data->lastUpdate = time();
            
            if(empty($data->intCode)){
                $data->intCode = hash("md5", $data->noteTitle . $data->lastUpdate );
            }
            
            $fields = array("ccid", "cmid", "title", "templatenote", "suggestednote", "teachertip", "lastupdate", "intcode", 'notifyteacher');
            $values = array($data->ccId, $data->cmId, $data->noteTitle, $data->templateNote, $data->suggestedNote, $data->teacherTip, $data->lastUpdate, $data->intCode, $data->notifyTeacher);

            if($data->ccCmId == 0){
                $curSlot = $this->mysqlConn->execSQLAndGetObject("select slot from {$this->prefix}recitcc_cm_notes where cmid = $data->cmId order by slot desc limit 1");
                $fields[] = "slot";
                $values[] = (empty($curSlot) ? 1 : $curSlot->slot + 1);

                $query = $this->mysqlConn->prepareStmt("insert", "{$this->prefix}recitcc_cm_notes", $fields, $values);
                $this->mysqlConn->execSQL($query);
                $data->ccCmId = $this->mysqlConn->getLastInsertId("{$this->prefix}recitcc_cm_notes", "id");
            }
            else{
                $fields[] = "slot";
                $values[] = $data->slot;

                $query = $this->mysqlConn->prepareStmt("update", "{$this->prefix}recitcc_cm_notes", $fields, $values, array("id"), array($data->ccCmId));
                $this->mysqlConn->execSQL($query);
            }
            
            return $this->getCcCmNote($data->ccCmId);
        }
        catch(Exception $ex){
            throw $ex;
        }
    }



    public function switchCcCmNoteSlot($from, $to){
        try{
            $this->mysqlConn->beginTransaction();
            $tmp = $this->mysqlConn->execSQLAndGetObjects("select slot from {$this->prefix}recitcc_cm_notes where id in ($from, $to) order by FIELD(id, $from, $to)");

            // $tmp[0] = from
            // $tmp[1] = to
            if(!isset($tmp[0]) || !isset($tmp[1])){
                throw new Exception("Unknown slots");
            }

            $query = sprintf("update {$this->prefix}recitcc_cm_notes set slot = %d where id = %d", $tmp[1]->slot, $from);
            $this->mysqlConn->execSQL($query);

            $query = sprintf("update {$this->prefix}recitcc_cm_notes set slot = %d where id = %d", $tmp[0]->slot, $to);
            $this->mysqlConn->execSQL($query);

            $this->mysqlConn->commitTransaction();

            return true;
        }
        catch(Exception $ex){
            $this->mysqlConn->rollbackTransaction();
            throw $ex;
        }
    }

    public function setSectionActivitiesName($cmId, $ccCmList){
        $secActList = $this->getSectionCmList($cmId);

        foreach($ccCmList as $item){
            foreach($secActList as $activity){
                if($item->cmId == $activity->cmId){
                    $item->activityName = $activity->name;
                    break;
                }
            }
        }

        foreach($ccCmList as $item){
            if(empty($item->activityName)){
                $item->activityName = "Erreur : L'activité #$item->cmId appartient à une autre section";
                $item->garbage = 1;
            }
        }
    }

    /*public function getCmSequenceFromSection($ccId){
        $query = "select t1.id as ccId, t2.id as cmId, t4.sequence from {$this->prefix}recitcahiercanada as t1
        inner join {$this->prefix}course_modules as t2 on t1.course = t2.course and t1.id = t2.instance
        inner join {$this->prefix}modules as t3 on t2.module = t3.id and t3.name = 'recitcahiercanada'
        inner join {$this->prefix}course_sections as t4 on t2.section = t4.id
        where t1.id = $ccId";
        $obj = $this->mysqlConn->execSQLAndGetObject($query);
        $obj->sequence = explode(",", $obj->sequence);
        return $obj;
    }*/
    
    public function getCmIdFromIndexPos($ccId, $cmIndexPos){
        $query = "select t1.id as ccId, t2.id as cmId, t4.sequence from {$this->prefix}recitcahiercanada as t1
        inner join {$this->prefix}course_modules as t2 on t1.course = t2.course and t1.id = t2.instance
        inner join {$this->prefix}modules as t3 on t2.module = t3.id and t3.name = 'recitcahiercanada'
        inner join {$this->prefix}course_sections as t4 on t2.section = t4.id
        where t1.id = $ccId";
        $obj = $this->mysqlConn->execSQLAndGetObject($query);
        $obj->sequence = explode(",", $obj->sequence);
        return (isset($obj->sequence[$cmIndexPos]) ? $obj->sequence[$cmIndexPos] : 0);
    }

    public function checkCCSeqPos($cmId){
        $query = "select t1.id as cmId, t2.sequence 
                from {$this->prefix}course_modules as t1 
                inner join {$this->prefix}course_sections as t2 on t1.section = t2.id
                where t1.id = $cmId";
        $obj = $this->mysqlConn->execSQLAndGetObject($query);

        if(!empty($obj)){
            $obj->sequence = explode(",", $obj->sequence);
            $lastItemId = array_pop($obj->sequence);
            return ($lastItemId == $cmId);
        }
        else{
            return true;
        }
    }

    public function createBackupViews(){
        $query = "create or replace view {$this->prefix}vw_recitcc_cm_notes as 
                    SELECT t1.*, (FIND_IN_SET(t1.cmid, t3.sequence) - 1) as cmindexpos FROM `{$this->prefix}recitcc_cm_notes` as t1 
                    inner join {$this->prefix}course_modules as t2 on t1.cmid = t2.id
                    inner join {$this->prefix}course_sections as t3 on t2.section = t3.id";
        $this->mysqlConn->execSQL($query);
    }
    
    public function removeCcInstance($id){
        $query = "DELETE t1, t2, t3
        FROM {$this->prefix}recitcahiercanada as t1
        left JOIN {$this->prefix}recitcc_cm_notes as t2 ON t1.id = t2.ccid
        left JOIN {$this->prefix}recitcc_user_notes as t3 ON t2.id = t3.cccmid
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

    public function createInstantMessage($userFrom, $userTo, $courseId, $msg, $component = 'mod_recitcahiercanada', $name = 'note_updated', $subject = 'Notification Cahier de Traces', $notification = '1'){
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
        
        $allCourseTeachers = PersistCtrl::getInstance()->getCourseTeachers($courseId);

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
        $query = "select t1.instance, t4.id as ccCmId, t4.ccid as ccId, t4.cmid as cmId, t4.title as noteTitle, t4.slot, t5.id as personalNoteId, 
        coalesce(t5.userid, 0) as userId, concat(find_in_set(t4.cmId, t2.sequence), t4.slot) as orderByCustom, 
        t3.course as courseId, concat(t6.firstname, ' ', t6.lastname) as username
        from {$this->prefix}course_modules as t1 
        inner join {$this->prefix}course_sections as t2 on t1.section = t2.id 
        inner join {$this->prefix}recitcahiercanada as t3 on t1.instance = t3.id                
        inner join {$this->prefix}recitcc_cm_notes as t4 on t3.id = t4.ccid
        inner join {$this->prefix}recitcc_user_notes as t5 on t4.id = t5.cccmid
        inner join {$this->prefix}user as t6 on t6.id = t5.userid
        where t1.id = $cmId and t4.notifyTeacher = 1 and 
        if(t5.id > 0 and length(t5.note) > 0 and length(REGEXP_REPLACE(trim(coalesce(t5.feedback, '')), '<[^>]*>+', '')) = 0, 1, 0) = 1 and
        %s
        and exists(select id from {$this->prefix}course_modules cm where id = t4.cmid and deletioninprogress = 0) -- avoid to fetch deleted activities
        order by length(orderByCustom) asc, orderByCustom asc
        limit 50";
        
        $query = sprintf($query, $this->getStmtStudentRole('t6.id', 't1.course'));

        $result = $this->mysqlConn->execSQLAndGetObjects($query);

        $this->setSectionActivitiesName($cmId, $result);

        return $result;
    }

    public function getStudentsProgression($cmId){
        $query = "select t4.id as ccCmId, t4.ccid as ccId, t4.cmid as cmId, t4.title as noteTitle, t4.slot, coalesce(t5.id,0) as personalNoteId, 
        coalesce(t6.id, 0) as userId, concat(find_in_set(t4.cmId, t2.sequence), t4.slot) as orderByCustom, 
        t3.course as courseId, concat(t6.firstname, ' ', t6.lastname) as username, if(t5.id > 0 and length(t5.note) > 0, 1, 0) as done,
        group_concat(DISTINCT t9.groupid) as groupIds
        from {$this->prefix}course_modules as t1 
        inner join {$this->prefix}course_sections as t2 on t1.section = t2.id 
        inner join {$this->prefix}recitcahiercanada as t3 on t1.instance = t3.id 
        inner join {$this->prefix}recitcc_cm_notes as t4 on t3.id = t4.ccid
        inner join {$this->prefix}enrol as t7 on t7.courseid = t1.course
        inner join {$this->prefix}user_enrolments as t8 on t7.id = t8.enrolid
        inner join {$this->prefix}user as t6 on t6.id = t8.userid
        left join {$this->prefix}recitcc_user_notes as t5 on t4.id = t5.cccmid and t5.userid = t6.id
        left join {$this->prefix}groups_members as t9 on t9.userid = t6.id
        where t1.id = $cmId and %s
        and exists(select id from {$this->prefix}course_modules cm where id = t4.cmid and deletioninprogress = 0) 
        group by t4.id, t5.id, t6.id
        order by length(orderByCustom) asc, orderByCustom asc";

        $query = sprintf($query, $this->getStmtStudentRole('t6.id', 't1.course'));
        
        $result = $this->mysqlConn->execSQLAndGetObjects($query);
        foreach($result as $item){
            $item->groupIds = array_map('intval', explode(",", $item->groupIds));
        }

        $this->setSectionActivitiesName($cmId, $result);

        return $result;
    }
}

class CmNote
{

    public $ccCmId = 0;
	public $intCode = "";
    public $ccId = 0;
    public $cmId = 0;
    public $noteTitle = "";
    public $templateNote = "";
    public $suggestedNote = "";
    public $teacherTip = "";
    public $slot = 0;
    public $lastUpdate = 0;
    public $notifyTeacher = 0;
    public $tagList = array();
}

class PersonalNote
{
    public $activityName = "";
    public $ccCmId = 0;     // cahier canada course module id ({$this->prefix}recitcc_cm_notes.id)
	public $intCode = "";   // integration code
    public $ccId = 0;       // cahier canada id
    public $cmName = "";    // course module name
    public $cmId = 0;       // course module id
    public $feedback = "";  // teacher feedback 
    public $grade = 0;      
    public $instance = 0;    
    public $lastUpdate = 0;
    public $note = null;    // student note ({text: '', itemId: 0})
    public $personalNoteId = 0;
    public $slot = 0;       // note order 
    public $teacherTip = "";
    public $suggestedNote = "";	
    public $noteTitle = "";
    public $userId = 0;
    public $courseId = 0; 
    public $mcmId = 0;     // course module cahier canada id ({$this->prefix}course_modules.id)

    public function lastUpdateFormat(){
        return ($this->lastUpdate > 0 ? date('Y-m-d H:i:s', $this->lastUpdate) : '');
    }
}