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

require_once dirname(__FILE__)."/recitcommon/PersistCtrl.php";

use recitcommon;
use stdClass;
use Exception;
use context_course;

/**
 * Singleton class
 */
class PersistCtrl extends MoodlePersistCtrl
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

    protected function isStudent($userId, $courseId){
        $ccontext = \context_course::instance($courseId);
        if (has_capability("mod/recitcahiertraces:view", $ccontext, $userId, false)) {
            return true;
        }

        return false;
    }

    protected function filterStudents(array &$dataProvider, $courseId){
        $cacheStudents = array(); // Keep a cache so we dont check capabilities for the same user multiple times.

        foreach($dataProvider as $i => $item){
            if (!isset($cacheStudents[$item->userId])){
                if ($this->isStudent($item->userId, $courseId)){
                    $cacheStudents[$item->userId] = true;
                }
                else{
                    $cacheStudents[$item->userId] = false;
                    unset($dataProvider[$i]);
                }
            }
            else if($cacheStudents[$item->userId] == false){
                unset($dataProvider[$i]);
            }
        }

        $dataProvider = array_values($dataProvider); // reindex array
    }

    public function getUserNotes($cmId, $userId, $flag = 's'){
        $fields = "";
        if ($flag != 's'){
            $fields = "t4.suggestednote suggested_Note,";
        }
        $query = "select ". $this->sql_uniqueid() ." uniqueid, t1.id m_Cm_Id, t2.id g_Id, t2.ct_id ct_Id, t4.title, t4.slot, t5.id un_Id, 
                coalesce(t5.note, '') note, t2.name group_Name, t2.slot group_Slot, t4.id n_Id, t5.cmid n_Cm_Id,
                coalesce(t5.userid, 0) user_Id, coalesce(t5.feedback, '') feedback, t4.templatenote template_Note, $fields
                t5.lastupdate last_Update, ".$this->mysqlConn->sql_concat('t2.name', 't4.slot')." order_By_Custom, t3.name ct_Name,
                t3.course course_Id, coalesce(t5.note_itemid,'0') note_Item_Id, t4.notifyteacher notify_Teacher, (case when t5.id > 0 and length(t5.note) > 0 then 0 else 1 end) is_Template
                from {course_modules} t1 
                inner join {recitcahiertraces} t3 on t1.instance = t3.id 
                inner join {recitct_groups} t2 on t3.id = t2.ct_id
                inner join {recitct_notes} t4 on t2.id = t4.gid
                left join {recitct_user_notes} t5 on t4.id = t5.nid and t5.userId = ?
                where t1.id = ?
                order by group_Slot, t4.slot asc";
                
        $tmp = $this->getRecordsSQL($query, [$userId, $cmId]);

        $result = array();
        if(count($tmp) > 0){
            $context = $this->getCtContext(current($tmp)->mCmId);
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
        $whereStmt = "true";
        $args = array();
        
        if(($userId > 0) && ($intCode != null) && ($courseId > 0)){
            $whereStmt = " (t1.intcode = :intcode and t1_1.course = :courseid) ";
            $args['intcode'] = $intCode;
            $args['courseid'] = $courseId;
        }
        else if($nId > 0){
            $whereStmt = " t1.id = :nid";
            $args['nid'] = $nId;
        }
        else{
            throw new Exception(get_string('invalidargument', 'mod_recitcahiertraces'));
        }

        $query = "select ". $this->sql_uniqueid() ." uniqueid, t1.title title, t1.gid g_Id, t3.ct_id ct_Id, coalesce(t1.intcode, '') int_Code,
        t2.id un_Id, t2.userid user_Id, t1.id n_Id,
        (case when t2.id > 0 and length(t2.note) > 0 then t2.note else t1.templatenote end) note, coalesce(t2.note_itemid,'0') note_Item_Id, (case when t2.id > 0 and length(t2.note) > 0 then 0 else 1 end) is_Template,
        t1.teachertip teacher_Tip, t1.suggestednote suggested_Note, coalesce(t2.feedback, '') feedback,  t2.lastupdate last_Update, t2.cmid n_Cm_Id,
        t1_1.course course_Id, t1.notifyteacher notify_Teacher,
        (select id from {course_modules} where instance = t1_1.id and module = (select id from {modules} where name = 'recitcahiertraces')) m_Cm_Id
        from {recitct_notes} t1 
        inner join {recitct_groups} t3 on t1.gid = t3.id
        inner join {recitcahiertraces} t1_1 on t3.ct_id = t1_1.id
        left join {recitct_user_notes} t2 on t1.id = t2.nid and t2.userid = :userid
        where $whereStmt";
        
        $args['userid'] = $userId;
        $dbData = $this->getRecordsSQL($query, $args);
        
        if(empty($dbData)){
            throw new Exception(get_string('nodata', 'mod_recitcahiertraces'));
        }
        $dbData = current($dbData);

        $context = $this->getCtContext($dbData->mCmId);
        $result = UserNote::create($dbData, $context);

        return $result;
    }

    public function saveUserNote($data, $flag){
        try{
            $cmId = $this->getCmIdFromNoteId($data->nId);
            $context = $this->getCtContext($cmId);
    
            if($flag == "s"){
                $data->note->text = file_save_draft_area_files($data->note->itemid, $context->id, 'mod_recitcahiertraces', 'usernote', $data->note->itemid, array('subdirs'=>true), $data->note->text);	
                $data->note->text = file_rewrite_pluginfile_urls($data->note->text, 'pluginfile.php', $context->id, 'mod_recitcahiertraces', 'usernote', $data->note->itemid, ['reverse' => true]);

                $data->lastUpdate = time();
                $values = array('nid' => $data->nId, 'userid' => $data->userId, 'note' => $data->note->text, 'note_itemid' => $data->note->itemid, 'lastupdate' => $data->lastUpdate, 'cmid' => $data->nCmId);
            }
            else{
                $values = array('nid' => $data->nId, 'userid' => $data->userId, 'feedback' => $data->feedback);
            }

            if($data->unId == 0){
                $this->mysqlConn->insert_record("recitct_user_notes", (object)$values);
            }
            else{
                $values['id'] = $data->unId;
                $this->mysqlConn->update_record("recitct_user_notes", (object)$values);
            }
            
            return $this->getUserNote($data->nId, $data->userId);
        }
        catch(Exception $ex){
            throw $ex;
        }
    }

    public function removeNote($nId){  
        try{
            $query = "delete from {recitct_user_notes} where id = ?";
            $this->mysqlConn->execute($query, [$nId]);

            $query = "delete from {recitct_notes} where id = ?";
            $this->mysqlConn->execute($query, [$nId]);

            return true;
        }
        catch(\Exception $ex){
            throw $ex;
        }
        return true;
    }

    public function getUserFromItemId($itemId){
        $result = $this->getRecordsSQL("select userId FROM {recitct_user_notes} where note_itemid = ?", [$itemId]);

        if (count($result) == 0) return 0;
        return current($result)->userId;
    }

    public function getGroupList($cmId){
        
        $query = "select t1.id g_Id, t1.name group_Name, t1.slot group_Slot, t1.ct_id ct_Id, t2.id m_Cm_Id FROM {course_modules} t2
        inner join {recitct_groups} t1 on t2.instance = t1.ct_id
        where t2.id = ? order by t1.slot";
        
        $tmp = $this->getRecordsSQL($query, [$cmId]);

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
            $slot++;
            $this->mysqlConn->execute("UPDATE {recitct_groups} SET slot=? WHERE id=?", [$slot, $g->id]);
        }
        
        return true;
    }  

    public function saveNoteGroup($data){
        try{		   
            if($data->ct->id == 0){
                $data->ct->id = $this->getCtIdFromCmId($data->ct->mCmId);
            }

            $values = array('name' => $data->name, 'ct_id' => $data->ct->id);

            if($data->id == 0){
                $query = "select MAX(t1.slot) group_Slot FROM {course_modules} t2
                inner join {recitct_groups} t1 on t2.instance = t1.ct_id
                where t2.id = ?";
                
                $result = $this->getRecordsSQL($query, [$data->ct->mCmId]);
                $slot = 0;
                if (count($result) > 0){
                    $slot = current($result)->groupSlot + 1;
                } 

                $values['slot'] = $slot;
                $id = $this->mysqlConn->insert_record("recitct_groups", (object)$values);
                $data->id = $id;
            }
            else{
                $values['slot'] = $data->slot;
                $values['id'] = $data->id;
                $this->mysqlConn->update_record("recitct_groups", (object)$values);
            }

            return $data;
        }
        catch(Exception $ex){
            throw $ex;
        }
    }

    public function getCtIdFromCmId($cmId){
        $query = "select instance from {course_modules} t2
        inner join {recitcahiertraces} t1_1 on t2.instance = t1_1.id
        where t2.module = (select id from {modules} where name = 'recitcahiertraces') and t2.id = ?";
        
        $result = $this->getRecordsSQL($query, [$cmId]);
        if (count($result) == 0) return 0;
        return current($result)->instance;
    }

    public function getCmIdFromNoteId($nId){
        $query = "select t2.id from {course_modules} t2
        inner join {recitcahiertraces} t1_1 on t2.instance = t1_1.id
        inner join {recitct_groups} t3 on t1_1.id = t3.ct_id
        inner join {recitct_notes} t4 on t4.gid = t3.id
        where t2.module = (select id from {modules} where name = 'recitcahiertraces') and t4.id = ?";
        
        $result = $this->getRecordsSQL($query, [$nId]);
        if (count($result) == 0) return 0;
        return current($result)->id;
    }

    public function getCtContext($mCmId){
        return \context_module::instance($mCmId);
    }

    /**
     * Fetch a groupNote (by unique ID = gid) or a set of cmNotes (ctId)
     */
    public function getGroupNotes($gId = 0, $ctId = 0){
        $gidStmt = ($gId == 0 ? "true" : " t1.gid = $gId");

        $cmStmt = "true";
        if($ctId > 0){
            $cmStmt = " (t1.ct_id = $ctId)";
        }
        
        $query = "select t1.id g_Id, coalesce(t1.intcode, '') int_Code, t3.ct_id ct_Id, t1.title, t1.slot, t1.templatenote template_Note, t1.suggestednote suggested_Note, 
                    t1.teachertip teacher_Tip, t1.lastupdate last_Update, t1.notifyteacher notify_Teacher, t1.id n_Id
                    from {recitct_notes} t1
                    inner join {recitct_groups} t3 on t1.gid = t3.id
                    inner join {recitcahiertraces} t1_1 on t3.ct_id = t1_1.id
                    where $gidStmt and $cmStmt
                    group by t1.id, t3.ct_id 
                    order by slot asc";

        $tmp = $this->getRecordsSQL($query);

        $result = array();
        foreach($tmp as $item){
            $result[] = NoteDef::create($item);
        }

        return $result;
    }

    /**
     * Fetch a cmNote (by unique ID = gid) or a set of cmNotes
     */
    public function getCmSuggestedNotes($cId = 0, $gId = 0, $ctId = 0){
        $cIdStmt = ($cId == 0 ? "true" : " t1_1.course = $cId");

        $cmStmt = "true";
        if($gId > 0){
            $cmStmt = " (t1.gid = $gId)";
        }
        if($ctId > 0){
            $cmStmt = " (t3.ct_id = $ctId)";
        }
        
        $query = "select t1.id n_Id, coalesce(t1.intcode, '') int_Code, t1_1.id ct_Id, t1.gid g_Id, t1.title title, t1.slot, t1.templatenote template_Note, t1.suggestednote suggested_Note, 
                    t1.teachertip teacher_Tip, t1.lastupdate last_Update, t1.notifyteacher notify_Teacher, t3.name group_Name, t3.slot group_Slot
                    from {recitct_notes} t1
                    inner join {recitct_groups} t3 on t1.gid = t3.id
                    inner join {recitcahiertraces} t1_1 on t3.ct_id = t1_1.id
                    where $cIdStmt and $cmStmt
                    group by t1.id, t1_1.id, t3.name, t3.slot, t3.id
                    order by t3.id, slot asc";

        $tmp = $this->getRecordsSQL($query);

        $result = array();
        foreach($tmp as $item){
            // index by group
            $result[$item->gId][] = NoteDef::create($item);
        }

        return array_values($result); // reset the array indexes
    }

    public function removeNoteGroup($gId){  
        $query = "DELETE t2, t3, t4
        FROM {recitct_groups} t4
        left JOIN {recitct_notes} t2 ON t4.id = t2.gid
        left JOIN {recitct_user_notes} t3 ON t2.id = t3.nid
        WHERE t4.id = ?";

        $result = $this->mysqlConn->execute($query, [$gId]);

        return (!$result ? false : true);
    }

    public function getNoteDef($nId){
        $query = "select t1.title title, t1.gid g_Id, t3.ct_id ct_Id, coalesce(t1.intcode, '') int_Code, t1.templatenote template_Note, t1.slot,
        t1.id n_Id, t1.teachertip teacher_Tip, t1.suggestednote suggested_Note, t1_1.course course_Id, t1.notifyteacher notify_Teacher
        from {recitct_notes} t1 
        inner join {recitct_groups} t3 on t1.gid = t3.id
        inner join {recitcahiertraces} t1_1 on t3.ct_id = t1_1.id
        where t1.id = ?";
        
        $dbData = $this->getRecordsSQL($query, [$nId]);
        
        $result = NoteDef::create(current($dbData));
        
        return $result;
    }

    public function saveNote(NoteDef $data){
        try{
            $data->lastUpdate = time();
            
            if(empty($data->intCode)){
                $data->intCode = hash("md5", $data->title . $data->lastUpdate );
            }
            
            $values = array('gid' => $data->group->id, 'title' => $data->title, 'templatenote' => $data->templateNote, 'suggestednote' => $data->suggestedNote, 'teachertip' => $data->teacherTip, 'intcode' => $data->intCode, 'notifyteacher' => $data->notifyTeacher);

            if($data->id == 0){
                $curSlot = $this->getRecordsSQL("select slot from {recitct_notes} where gId = ? order by slot desc limit 1", [$data->group->id]);
                $values['slot'] = (empty($curSlot) ? 1 : current($curSlot)->slot + 1);

                $id = $this->mysqlConn->insert_record("recitct_notes", (object)$values);
                $data->id = $id;
            }
            else{
                $values['slot'] = $data->slot;
                $values['id'] = $data->id;

                $this->mysqlConn->update_record("recitct_notes", (object)$values);
            }
            
            return $data;
        }
        catch(\Exception $ex){
            throw $ex;
        }
    }

    public function switchNoteSlot($from, $to){
        try{
            $tmp = $this->getRecordsSQL("select slot from {recitct_notes} where id in ($from, $to) order by FIELD(id, $from, $to)");

            // $tmp[0] = from
            // $tmp[1] = to
            if(!isset($tmp[0]) || !isset($tmp[1])){
                throw new \Exception("Unknown slots");
            }

            $this->mysqlConn->execute("update {recitct_notes} set slot = ? where id = ?", [$tmp[1]->slot, $from]);

            $this->mysqlConn->execute("update {recitct_notes} set slot = ? where id = ?", [$tmp[0]->slot, $to]);


            return true;
        }
        catch(\Exception $ex){
            throw $ex;
        }
    }
    
    public function removeCcInstance($id){
        $query = "DELETE t1, t2, t3, t4
        FROM {recitcahiertraces} t1
        left join {recitct_groups} t4 on t1.id = t4.ct_id
        left JOIN {recitct_notes} t2 ON t4.id = t2.gid
        left JOIN {recitct_user_notes} t3 ON t2.id = t3.nid
        WHERE t1.id = ?";

        $result = $this->mysqlConn->execute($query, [$id]);

        return (!$result ? false : true);
    }
    
    public function removeCCUserdata($id){
        $query = "DELETE t3
        FROM {recitcahiertraces} t1
        left join {recitct_groups} t4 on t1.id = t4.ct_id
        left JOIN {recitct_notes} t2 ON t4.id = t2.gid
        left JOIN {recitct_user_notes} t3 ON t2.id = t3.nid
        WHERE t1.id = ?";

        $result = $this->mysqlConn->execute($query, [$id]);

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
            * Si le groupe n'a pde prof, on notifie tous les prof du cours
            * Si l'élève n'a pde groupe, on notifie tous les prof du cours
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
        $query = "select t4.id nId, t2.ct_id ct_Id, t4.gId g_Id, t4.title, t4.slot, t5.id un_Id, 
        coalesce(t5.userid, 0) user_Id, ".$this->mysqlConn->sql_concat('find_in_set(t4.gId, t2.name)', 't4.slot')." order_By_Custom, 
        t3.course course_Id, ".$this->mysqlConn->sql_concat('t6.firstname', "' '", 't6.lastname')." username, t2.name group_Name, t2.slot group_Slot,
        coalesce(t5.note_itemid,0) note_Item_Id, coalesce(t5.note, '') note, t4.notifyteacher notify_Teacher, t5.cmid n_Cm_Id, t1.id m_Cm_Id
        from {course_modules} t1 
        inner join {recitcahiertraces} t3 on t1.instance = t3.id    
        inner join {recitct_groups} t2 on t3.id = t2.ct_id            
        inner join {recitct_notes} t4 on t2.id = t4.gid
        inner join {recitct_user_notes} t5 on t4.id = t5.nid
        inner join {user} t6 on t6.id = t5.userid
        where t1.id = ? and t4.notifyTeacher = 1 and 
        if(t5.id > 0 and length(t5.note) > 0 and length(REGEXP_REPLACE(trim(coalesce(t5.feedback, '')), '<[^>]*>+', '')) = 0, 1, 0) = 1 
        order by length(order_By_Custom) asc, order_By_Custom asc
        limit 50";

        $tmp = $this->getRecordsSQL($query, [$cmId]);

        $result = array();
        if(count($tmp) > 0){
            $context = $this->getCtContext(current($tmp)->mCmId);
            $modinfo = get_fast_modinfo(current($tmp)->courseId);
            $this->filterStudents($tmp, current($tmp)->courseId);
        
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
        $query = "select coalesce(t6.id, 0) user_id, concat(t6.firstname, ' ', t6.lastname) username, if(t5.id > 0 and length(t5.note) > 0, 1, 0) done,
        group_concat(DISTINCT t9.groupid) group_ids
        from {course_modules} t1 
        inner join {recitcahiertraces} t3 on t1.instance = t3.id 
        inner join {recitct_groups} t2 on t3.id = t2.ct_id
        inner join {recitct_notes} t4 on t2.id = t4.gid
        inner join {enrol} t7 on t7.courseid = t1.course
        inner join {user_enrolments} t8 on t7.id = t8.enrolid
        inner join {user} t6 on t6.id = t8.userid
        left join {recitct_user_notes} t5 on t4.id = t5.nid and t5.userid = t6.id
        left join {groups_members} t9 on t9.userid = t6.id
        where t1.id = ?
        group by t4.id, t5.id, t6.id
        order by username";
        
        $result = $this->getRecordsSQL($query, [$cmId]);
        foreach($result as $item){
            $item->groupIds = array_map('intval', explode(",", $item->groupIds));
        }

        return $result;
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
    public $nCmId = 0;      // course module id in which the note hbeen integrated
    public $cmName = "";    // course module name
    public $userId = 0;
    public $username = "";
    public $noteContent = null;    // student note ({text: '', itemid: 0})
    public $feedback = "";  // teacher feedback 
    public $feedbackFiltered = "";  // teacher feedback 
    public $lastUpdate = 0;
    public $isTemplate = false;

    public function lastUpdateFormat(){
        return ($this->lastUpdate > 0 ? date('Y-m-d H:i:s', $this->lastUpdate) : '');
    }

    public static function create($dbData, $context = null){
        $result = new UserNote();
        $result->id = $dbData->unId;
        $result->noteDef = NoteDef::create($dbData);
        if(isset($dbData->cmName)){
            $result->cmName = $dbData->cmName;
        }
        if(isset($dbData->nCmId)){ 
            $result->nCmId = $dbData->nCmId;
        }

        $result->userId = $dbData->userId;
        
        $result->noteContent = new stdClass();
        $result->noteContent->text = "";
        $result->noteContent->itemid = 0;
        
        if(!empty($context)){
            $result->noteContent->text = file_rewrite_pluginfile_urls($dbData->note, 'pluginfile.php', $context->id, 'mod_recitcahiertraces', 'usernote', $dbData->noteItemId);
            $result->noteContent->itemid = $dbData->noteItemId;
        }

        if(isset($dbData->username)){ $result->username = $dbData->username; }
        if(isset($dbData->feedback)){ 
            $result->feedback = $dbData->feedback;
            $result->feedbackFiltered = format_text($dbData->feedback, FORMAT_MOODLE, array('filter' => true, 'context' => $context));
        }
        if(isset($dbData->lastUpdate)){ $result->lastUpdate = $dbData->lastUpdate; }
        if(isset($dbData->isTemplate)){ $result->isTemplate = $dbData->isTemplate; }
        
        return $result;
    }
}
