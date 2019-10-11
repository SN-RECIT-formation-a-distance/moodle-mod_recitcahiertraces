<?php

require_once 'MySQLConn.php';

/**
 * Singleton class
 * This class controls all the access to the data persistence
 */
class PersistCtrl
{
    /**
     * mysqli_native_moodle_database 
     */
    protected $mysqlConn;
    
    protected $signedUser;

    protected static $instance = null;
    
    public function __construct($mysqlConn, $signedUser){
        $this->mysqlConn = new RecitMySQLConn($mysqlConn);
        $this->signedUser = $signedUser;
       // $this->createViews();
       $this->createFunctions();
    }

    /**
     * @param MySQL Resource
     * @return PersistCtrl
     */
    public static function getInstance($mysqlConn = null, $signedUser = null)
    {
        if(!isset(self::$instance)) {
            self::$instance = new PersistCtrl($mysqlConn, $signedUser);
        }
        return self::$instance;
    }

    public function checkSession(){
        return (isset($this->signedUser) && $this->signedUser->id > 0);
    }

    public function createFunctions(){
        $query = 'DROP FUNCTION IF EXISTS `recit_strip_tags`';
        $this->mysqlConn->execSQL($query);

        $query = 'CREATE FUNCTION `recit_strip_tags`($str text) RETURNS text
        BEGIN
            DECLARE $start, $end INT DEFAULT 1;
            LOOP
                SET $start = LOCATE("<", $str, $start);
                IF (!$start) THEN RETURN $str; END IF;
                SET $end = LOCATE(">", $str, $start);
                IF (!$end) THEN SET $end = $start; END IF;
                SET $str = INSERT($str, $start, $end - $start + 1, "");
            END LOOP;
        END';
        $this->mysqlConn->execSQL($query);

        /*"DROP FUNCTION IF EXISTS `recit_strip_tags`;

        DELIMITER |
        CREATE FUNCTION `recit_strip_tags`($str text) RETURNS text
        BEGIN
            DECLARE $start, $end INT DEFAULT 1;
            LOOP
                SET $start = LOCATE(\"<\", $str, $start);
                IF (!$start) THEN RETURN $str; END IF;
                SET $end = LOCATE(\">\", $str, $start);
                IF (!$end) THEN SET $end = $start; END IF;
                SET $str = INSERT($str, $start, $end - $start + 1, \"\");
            END LOOP;
        END;
        
        | DELIMITER ;";*/
    }
   /* public function createViews(){
        $query = "create or replace view recit_vw_quiz_tag_result as 
        SELECT t1.id as courseId, t1.shortname as course, t2.id as activityId, t3.id as quizId, t3.name as quiz, 
        t4.lastAttempt, 
        coalesce((select fraction from mdl_question_attempt_steps as t5_1 where t5.id = t5_1.questionattemptid order by sequencenumber desc limit 1),0) as success,
        t6.id as userId, t6.firstname as firstName, t6.lastname as lastName, t6.email, 
        group_concat(distinct coalesce(t6_2.name, 'na') order by t6_2.name) as groupName,
        t7.defaultmark as defaultMark, t7.id as questionId, 
        t9.id as tagId, t9.name as tagName
        FROM mdl_course as t1 
        inner join mdl_course_modules as t2 on t1.id= t2.course
        inner join mdl_quiz as t3 on t2.instance = t3.id
        inner join (select max(attempt) as lastAttempt, max(id) as id, max(uniqueid) uniqueid, quiz, userid from mdl_quiz_attempts group by quiz, userid) as t4 on t3.id = t4.quiz
        inner join mdl_question_attempts as t5 on t4.uniqueid = t5.questionusageid 
        inner join mdl_user as t6 on t4.userid = t6.id
        left join mdl_groups_members as t6_1 on t6.id = t6_1.userid
        left join mdl_groups as t6_2 on t6_1.groupid = t6_2.id 
        inner join mdl_question as t7 on t5.questionid = t7.id
        inner join mdl_tag_instance as t8 on t7.id = t8.itemid and t8.itemtype in ('question')
        inner join mdl_tag as t9 on t8.tagid = t9.id
        where t2.module = 16 
        group by t1.id, t2.id, t3.id, t5.id, t6.id, t7.id, t8.tagid, t9.id";

        $this->mysqlConn->execSQL($query);
}*/

   /* public function getUserRoles($userId, array $contexts){
        $query = "SELECT r.shortname FROM mdl_role_assignments ra, mdl_role r, mdl_context c 
                WHERE ra.userid = $userId AND ra.roleid = r.id AND ra.contextid = c.id AND ra.contextid IN (". implode(",", $contexts).")
                ORDER BY c.contextlevel DESC, r.sortorder ASC";
        $tmp = $this->mysqlConn->execSQLAndGetObjects($query);

        $result = array();
        foreach($tmp as $role){
            switch($role->shortname){
                case 'manager': $result[] = 'mg'; break;
                case 'coursecreator': $result[] = 'cc'; break;
                case 'editingteacher': 
                    array_push($result, 'et'); 
                    break;
                case 'teacher':
                    array_push($result, 'tc'); 
                    break;
                case 'student': $result[] = 'sd'; break;
                case 'guest': $result[] = 'gu'; break;
                case 'frontpage': $result[] = 'fp'; break;
            }
        }

        return $result;
    }*/

    public function getEnrolledUserList($cmId){
        $query = "select t1.enrol, t1.courseid as courseId, t3.id as userId, concat(t3.firstname, ' ', t3.lastname) as userName, coalesce(t5.id,0) as groupId, 
            coalesce(t5.name, 'na') as groupName 
            from mdl_enrol as t1
        inner join mdl_user_enrolments as t2 on t1.id = t2.enrolid
        inner join mdl_user as t3 on t2.userid = t3.id
        left join mdl_groups_members as t4 on t3.id = t4.userid
        left join mdl_groups as t5 on t4.groupid = t5.id 
        where t1.courseid = (select course from mdl_course_modules where id = $cmId)
        order by userName";
        $tmp = $this->mysqlConn->execSQLAndGetObjects($query);    

        $result = array();
        foreach($tmp as $item){
            $result[$item->groupName][] = $item;
        }

        return $result;
    }

   /* public function createForeignKeysCahierCanada(){
        $this->mysqlConn->execSQL("ALTER TABLE `mdl_recitcahiercanada` ADD FOREIGN KEY (`course`) REFERENCES `mdl_course`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT");
        
        $this->mysqlConn->execSQL("ALTER TABLE `mdl_recitcc_cm_notes` ADD FOREIGN KEY (`ccid`) REFERENCES `mdl_recitcahiercanada`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT");
        $this->mysqlConn->execSQL("ALTER TABLE `mdl_recitcc_cm_notes` ADD FOREIGN KEY (`cmid`) REFERENCES `mdl_course_modules`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT");
        
        $this->mysqlConn->execSQL("ALTER TABLE `mdl_recitcc_user_notes` ADD FOREIGN KEY (`cccmid`) REFERENCES `mdl_recitcc_cm_notes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE");
        $this->mysqlConn->execSQL("ALTER TABLE `mdl_recitcc_user_notes` ADD FOREIGN KEY (`userid`) REFERENCES `mdl_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE");
    }   */ 

    public function getPersonalNotes($cmId, $userId){
        $query = "select t1.instance, t4.id as ccCmId, t4.ccid as ccId, t4.cmid as cmId, t4.title, t4.slot, t5.id as personalNoteId, 
                (case length(recit_strip_tags(coalesce(t5.note, ''))) when 0 then t4.templatenote else t5.note end) as note,
                coalesce(t5.userid, 0) as userId, coalesce(t5.feedback, '') as feedback, 
                t5.grade, t5.lastupdate as lastUpdate, concat(find_in_set(t4.cmId, t2.sequence), t4.slot) as orderByCustom, t3.name as ccName
                from mdl_course_modules as t1 
                inner join mdl_course_sections as t2 on t1.section = t2.id 
                inner join mdl_recitcahiercanada as t3 on t1.instance = t3.id                
                inner join mdl_recitcc_cm_notes as t4 on t3.id = t4.ccid
                left join mdl_recitcc_user_notes as t5 on t4.id = t5.cccmid and t5.userId in ($userId, 0)
                where t1.id = $cmId 
                order by orderByCustom";
                
        $result = $this->mysqlConn->execSQLAndGetObjects($query);

        $this->setSectionActivitiesName($cmId, $result);

        return $result;
    }

    public function getPersonalNote($ccCmId, $userId){
        $query = "select t1.title as noteTitle, t1.cmid as cmId, t1.ccid as ccId,
        t2.id, t2.cccmid as ccCmId, t2.userid as userId,  
        (case length(recit_strip_tags(coalesce(t2.note, ''))) when 0 then t1.templatenote else t2.note end) as note,
        t2.feedback, t2.grade, t2.lastupdate as lastUpdate
                from mdl_recitcc_cm_notes as t1 
                left join mdl_recitcc_user_notes as t2 on t1.id = t2.cccmid and t2.userid = $userId
                where t1.id = $ccCmId";
        
        return $this->mysqlConn->execSQLAndGetObject($query);
    }

    public function savePersonalNote($data, $flag){
        try{
            if($flag == "s"){
                $data->lastUpdate = time();
                $fields = array("cccmid", "userid", "note", "lastupdate");
                $values = array($data->ccCmId, $data->userId, $data->note, $data->lastUpdate);
            }
            else{
                $fields = array("cccmid", "userid", "feedback");
                $values = array($data->ccCmId, $data->userId, $data->feedback);
            }

            if($data->personalNoteId == 0){
                $query = $this->mysqlConn->prepareStmt("insertorupdate", "mdl_recitcc_user_notes", $fields, $values);
                $this->mysqlConn->execSQL($query);

                $obj = $this->mysqlConn->execSQLAndGetObject("select id from mdl_recitcc_user_notes where cccmid = $data->ccCmId and userid = $data->userId");
                $data->personalNoteId = $obj->id;
            }
            else{
                $query = $this->mysqlConn->prepareStmt("update", "mdl_recitcc_user_notes", $fields, $values, array("id"), array($data->personalNoteId));
                $this->mysqlConn->execSQL($query);
            }
               
            return $data;
        }
        catch(Exception $ex){
            throw $ex;
        }
    }

    public function getCmNotes($ccCmId = 0, $cmId = 0){
        /*$query = "select t1.id as ccCmId, t1.ccid as ccId, t1.cmid as cmId, t1.title, t1.slot, t1.templatenote as templateNote, t1.lastupdate as lastUpdate
                from mdl_recitcc_cm_notes as t1
                where t1.cmid = $cmId
                order by ccCmId asc";*/
       /* $query = "select t1.id as ccCmId, t1.ccid as ccId, t1.cmid as cmId, t1.title, t1.slot, t1.templatenote as templateNote, t1.lastupdate as lastUpdate, 
        CONCAT('[', 
            GROUP_CONCAT(  
                JSON_OBJECT(
                    'tagId', coalesce(t3.id,0),
                    'tagName', coalesce(t3.name,'')
                )
            ),']'
        ) as tagList
                        from mdl_recitcc_cm_notes as t1
                        left join mdl_tag_instance as t2 on t1.id and itemtype = 'cccmnote' and component = 'mod_cahiercanada'
                        left join mdl_tag as t3 on t2.tagid = t3.id
                        where t1.cmid = $cmId
                        group by t1.id                
                        order by ccCmId asc";*/

        $ccCmIdStmt = ($ccCmId == 0 ? "1" : " t1.id = $ccCmId");
        $cmStmt = ($cmId == 0 ? "1" : " t1.cmid = $cmId");

        $query = "select t1.id as ccCmId, t1.ccid as ccId, t1.cmid as cmId, t1.title, t1.slot, t1.templatenote as templateNote, t1.lastupdate as lastUpdate, 
                    GROUP_CONCAT(t2.id) as tagList
                    from mdl_recitcc_cm_notes as t1
                    left join mdl_tag_instance as t2 on t1.id = t2.itemid and itemtype = 'cccmnote' and component = 'mod_cahiercanada'
                    where $ccCmIdStmt and $cmStmt
                    group by t1.id                
                    order by ccCmId asc";

        $result = $this->mysqlConn->execSQLAndGetObjects($query, 'CmNote');

        foreach($result as &$item){
            $item->tagList = ($item->tagList == null ? array() : explode(",", $item->tagList));

            foreach($item->tagList as &$instanceId){
                $instanceId = intval($instanceId);
            }
        }

        return $result;
    }

    public function getCcCmNote($ccCmId){
        /*$query = "select id as ccCmId, ccid as ccId, cmid as cmId, title, slot, lastupdate as lastUpdate
                from mdl_recitcc_cm_notes
                where id = $ccCmId";*/
        
       /* $query = "select t1.id as ccCmId, t1.ccid as ccId, t1.cmid as cmId, t1.title, t1.slot, t1.lastupdate as lastUpdate,
                GROUP_CONCAT(t2.id) as tagList
                from mdl_recitcc_cm_notes as t1
                left join mdl_tag_instance as t2 on t1.id = t2.itemid and itemtype = 'cccmnote' and component = 'mod_cahiercanada'
                where t1.id = $ccCmId
                group by t1.id ";

        $result = $this->mysqlConn->execSQLAndGetObject($query, 'CmNote');*/
        $result = $this->getCmNotes($ccCmId);
        $result = array_shift($result);
        return $result;
    }

    public function removeCcCmNote($ccCmId){
        $query = "delete from mdl_recitcc_user_notes where cccmid = $ccCmId";
        $this->mysqlConn->execSQL($query);

        $query = "delete from mdl_recitcc_cm_notes where id = $ccCmId";
        $this->mysqlConn->execSQL($query);
        return true;
    }

    public function saveCcCmNote($data){
        try{
            $data->lastUpdate = time();
            
            $fields = array("ccid", "cmid", "title", "slot", "templatenote", "lastupdate");
            $values = array($data->ccId, $data->cmId, $data->title,  $data->slot, $data->templateNote, $data->lastUpdate);

            if($data->ccCmId == 0){
                $query = $this->mysqlConn->prepareStmt("insert", "mdl_recitcc_cm_notes", $fields, $values);
                $this->mysqlConn->execSQL($query);
                $data->ccCmId = $this->mysqlConn->getLastInsertId("mdl_recitcc_cm_notes", "id");
            }
            else{
                $query = $this->mysqlConn->prepareStmt("update", "mdl_recitcc_cm_notes", $fields, $values, array("id"), array($data->ccCmId));
                $this->mysqlConn->execSQL($query);
            }
               
            return $this->getCcCmNote($data->ccCmId);
        }
        catch(Exception $ex){
            throw $ex;
        }
    }

    public function moodleTagItem($itemData, $tagMetadata){
        try{
            //$this->mysqlConn->beginTransaction();

            foreach($tagMetadata->add as $tag){
                $obj = new MoodleTag();
                $obj->userId = $this->signedUser->id;
                $obj->instanceId = 0;
                $obj->tagId = $tag->tagId;
                $obj->tagName = $tag->tagName;
                $obj->component = $tag->component;
                $obj->itemType = $tag->itemType;
                $obj->itemId = $itemData->ccCmId;
                $this->addTag($obj);
                $this->addTagInstance($obj);
            }
            
            foreach($tagMetadata->update as $tag){
                $obj = new MoodleTag();
                $obj->userId = $this->signedUser->id;
                $obj->instanceId = 0;
                $obj->tagId = $tag->tagId;
                $obj->tagName = $tag->tagName;
                $obj->component = $tag->component;
                $obj->itemType = $tag->itemType;
                $obj->itemId = $itemData->ccCmId;
                $this->addTag($obj);
                $this->addTagInstance($obj);
            }

            foreach($tagMetadata->delete as $tag){
                $obj = new MoodleTag();
                $obj->userId = $this->signedUser->id;
                $obj->instanceId = 0;
                $obj->tagId = $tag->tagId;
                $obj->tagName = $tag->tagName;
                $obj->component = $tag->component;
                $obj->itemType = $tag->itemType;
                $obj->itemId = $itemData->ccCmId;
                $this->deleteTag($obj);
            }

          //  $this->mysqlConn->commitTransaction();
        }
        catch(Exception $ex){
           // $this->mysqlConn->rollbackTransaction();
            throw $ex;
        }
    }

    public function addTag(&$tag){
        $query = "SELECT !EXISTS(SELECT id from mdl_tag WHERE id = {$tag->tagId}) as notExists";
        $obj = $this->mysqlConn->execSQLAndGetObject($query);

        if($obj->notExists == 1){
            $fields = array("userid", "tagcollid", "name", "rawname", "isstandard", "descriptionformat", "flag", "timemodified");
            $values = array($tag->userId, 1, $tag->tagName,  $tag->tagName, 0, 0, 0, time());
            $query = $this->mysqlConn->prepareStmt("insert", "mdl_tag", $fields, $values);
            $this->mysqlConn->execSQL($query);
            $tag->tagId = $this->mysqlConn->getLastInsertId("mdl_tag", "id");
        }
        return $tag;
    }

    public function addTagInstance($tag){
        $query = "SELECT !EXISTS(SELECT id from mdl_tag_instance WHERE tagid = {$tag->tagId} and itemid = {$tag->itemId} 
                        and component = '{$tag->component}' and itemtype = '{$tag->itemType}') as notExists";
        $obj = $this->mysqlConn->execSQLAndGetObject($query);

        if($obj->notExists == 1){
            $fields = array("tagid", "component", "itemtype", "itemid", "contextid", "tiuserid", "ordering", "timecreated", "timemodified");
            $values = array($tag->tagId, $tag->component, $tag->itemType,  $tag->itemId, 0, 0, 0, time(), time());
            $query = $this->mysqlConn->prepareStmt("insert", "mdl_tag_instance", $fields, $values);
            $this->mysqlConn->execSQL($query);
        }
    }

    public function deleteTag($tag){
        try{
            $instanceIdStmt = "(tagId = {$tag->tagId} and itemId = {$tag->itemId} and component = '{$tag->component}' and itemType = '{$tag->itemType}')";
            $query = "delete from mdl_tag_instance WHERE $instanceIdStmt";
            $this->mysqlConn->execSQL($query);

            $query = "delete from mdl_tag WHERE id = $tag->tagId 
                    and (select count(*) from mdl_tag_instance where $instanceIdStmt) = 0";
            $this->mysqlConn->execSQL($query);
        }
        catch(Exception $ex){
            throw $ex;
        }
    }

    /**
     * This function will fetch all the sections that shared the same section with parameter $cmId
     */
    public function getSectionCmList($cmId){
        // module = 12 = label (sections names)
        $query = "select t1.id as cmId, t1.instance, t3.name as moduleName, t2.sequence, (select instance from mdl_course_modules where id = $cmId) as ccId
                from mdl_course_modules as t1 
                inner join mdl_course_sections as t2 on t1.section = t2.id 
                inner join mdl_modules as t3 on t1.module = t3.id
                where t1.section in (select section from mdl_course_modules where id = $cmId) and t1.module not in (12)";
        $activityList = $this->mysqlConn->execSQLAndGetObjects($query);

        $queryTemplate = "(select %ld as ccId, %ld as cmId, id, name from mdl_%s where id = %ld)";
        $query = array();
        foreach($activityList as $activity){
            $query[] = sprintf($queryTemplate, $activity->ccId, $activity->cmId, $activity->moduleName, $activity->instance);
        }

        $result = array();
        if(count($activityList) > 0){
            $query = sprintf("select * from (%s) as t order by FIELD(cmId, %s)", implode(" union all ", $query), $activityList[0]->sequence);
            $result = $this->mysqlConn->execSQLAndGetObjects($query);
        }
        
        return $result;        
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
    }

    /*public function getCmSequenceFromSection($ccId){
        $query = "select t1.id as ccId, t2.id as cmId, t4.sequence from mdl_recitcahiercanada as t1
        inner join mdl_course_modules as t2 on t1.course = t2.course and t1.id = t2.instance
        inner join mdl_modules as t3 on t2.module = t3.id and t3.name = 'recitcahiercanada'
        inner join mdl_course_sections as t4 on t2.section = t4.id
        where t1.id = $ccId";
        $obj = $this->mysqlConn->execSQLAndGetObject($query);
        $obj->sequence = explode(",", $obj->sequence);
        return $obj;
    }*/
    public function getCmIdFromIndexPos($ccId, $cmIndexPos){
        $query = "select t1.id as ccId, t2.id as cmId, t4.sequence from mdl_recitcahiercanada as t1
        inner join mdl_course_modules as t2 on t1.course = t2.course and t1.id = t2.instance
        inner join mdl_modules as t3 on t2.module = t3.id and t3.name = 'recitcahiercanada'
        inner join mdl_course_sections as t4 on t2.section = t4.id
        where t1.id = $ccId";
        $obj = $this->mysqlConn->execSQLAndGetObject($query);
        $obj->sequence = explode(",", $obj->sequence);
        return (isset($obj->sequence[$cmIndexPos]) ? $obj->sequence[$cmIndexPos] : 0);
    }

    public function checkCCSeqPos($cmId){
        $query = "select t1.id as cmId, t2.sequence 
                from mdl_course_modules as t1 
                inner join mdl_course_sections as t2 on t1.section = t2.id
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
        $query = "create or replace view mdl_vw_recitcc_cm_notes as 
                    SELECT t1.*, (FIND_IN_SET(t1.cmid, t3.sequence) - 1) as cmindexpos FROM `mdl_recitcc_cm_notes` as t1 
                    inner join mdl_course_modules as t2 on t1.cmid = t2.id
                    inner join mdl_course_sections as t3 on t2.section = t3.id";
        $this->mysqlConn->execSQL($query);
    }
    
    public function removeCcInstance($id){
        $query = "DELETE t1, t2, t3
        FROM mdl_recitcahiercanada as t1
        left JOIN mdl_recitcc_cm_notes as t2 ON t1.id = t2.ccid
        left JOIN mdl_recitcc_user_notes as t3 ON t2.id = t3.cccmid
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

    public function getTag($tagId){
        $query = "SELECT id, name FROM mdl_tag where id = $tagId";
        return $this->mysqlConn->execSQLAndGetObject($query);
    }

    public function getTagList($itemId, $itemType, $component){
        $itemStmt = "1";
        if($itemId > 0){
            $itemStmt = "t2.itemid = $itemId ";
        }
        
        $query = "SELECT distinct t1.id as tagId, t1.name as tagName, t2.itemtype as itemType, t2.component, 
                group_concat(t2.id) as instanceIds  
                FROM  mdl_tag as t1
                 inner join mdl_tag_instance as t2 on t1.id = t2.tagid
                 where $itemStmt and t2.itemtype = '$itemType' and t2.component = '$component'
                 group by t1.id";
        $result = $this->mysqlConn->execSQLAndGetObjects($query);

        if(empty($result)){
            $result = array();
        }

        foreach($result as &$item){
            $item->instanceIds = explode(",", $item->instanceIds);
            foreach($item->instanceIds as &$instanceId){
                $instanceId = intval($instanceId);
            }
        }

        return $result;
    }

    public function getCourseTagList($courseId){
        $query = "SELECT distinct t1.tagid as tagId, t2.name as tagName, t1.itemtype FROM mdl_tag_instance as t1
        inner join mdl_tag as t2 on t1.tagid = t2.id
        left join mdl_course as t3 on t1.itemid = t3.id and t1.itemtype = 'course' and t3.id = $courseId
        left join mdl_course_modules as t4 on t1.itemid = t4.id and t1.itemtype = 'course_modules' and t4.course = $courseId";
        //-- left join mdl_question as t5 on t1.itemid = t5.id and t1.itemtype = 'question'
        return $this->mysqlConn->execSQLAndGetObjects($query);
    }

    public function getTagRateList($tagId, $userId){
        //$query = "SELECT * FROM `recit_vw_quiz_tag_result` where tagId = $tagId and userId = $userId";
        //return $this->mysqlConn->execSQLAndGetObjects($query);
        return $this->getReportDiagTagQuestion(0, $userId, $tagId);
    }

    public function getReportDiagTagQuestion($activityId = 0, $userId = 0, $tagId = 0){
        $userStmt = "1";
        if($userId > 0){
            $userStmt = " t6.id = $userId";
        }

        $activityStmt = "1";
        if($activityId > 0){
            $activityStmt = "  t2.id = $activityId";
        }

        $tagStmt = "1";
        if($tagId > 0){
            $tagStmt = " t9.id = $tagId";
        }

        $query = "SELECT t1.id as courseId, t1.shortname as course, t2.id as activityId, t3.id as quizId, t3.name as quiz, 
        t4.lastAttempt, 
        coalesce((select fraction from mdl_question_attempt_steps as t5_1 where t5.id = t5_1.questionattemptid order by sequencenumber desc limit 1),0) as grade,
        t6.id as userId, t6.firstname as firstName, t6.lastname as lastName, t6.email, 
        group_concat(distinct coalesce(t6_2.name, 'na') order by t6_2.name) as groupName,
        t7.defaultmark as gradeWeight, t7.id as questionId, 
        t9.id as tagId, t9.name as tagName
        FROM mdl_course as t1 
        inner join mdl_course_modules as t2 on t1.id= t2.course
        inner join mdl_quiz as t3 on t2.instance = t3.id
        inner join (select max(attempt) as lastAttempt, max(id) as id, max(uniqueid) uniqueid, quiz, userid from mdl_quiz_attempts group by quiz, userid) as t4 on t3.id = t4.quiz
        inner join mdl_question_attempts as t5 on t4.uniqueid = t5.questionusageid 
        inner join mdl_user as t6 on t4.userid = t6.id
        left join mdl_groups_members as t6_1 on t6.id = t6_1.userid
        left join mdl_groups as t6_2 on t6_1.groupid = t6_2.id 
        inner join mdl_question as t7 on t5.questionid = t7.id
        inner join mdl_tag_instance as t8 on t7.id = t8.itemid and t8.itemtype in ('question')
        inner join mdl_tag as t9 on t8.tagid = t9.id
        where t2.module = 16 and $activityStmt and $userStmt and $tagStmt
        group by t1.id, t2.id, t3.id, t5.id, t6.id, t7.id, t8.tagid, t9.id";

        $tmp = $this->mysqlConn->execSQLAndGetObjects($query);
        return (empty($tmp) ? array() : $tmp);
    }
    
    public function getReportDiagTagQuiz($courseId){
        $query = "SELECT t1.course as courseId, t1.id as activityId, t1.name as activityName, t5.id as cmId, max(t2.attempt) as lastQuizAttempt, 
        t2.timestart as timeStart, t2.timefinish as timeEnd, t4.id as userId, t4.firstname as firstName, t4.lastname as lastName,
        t4.email, coalesce(any_value(t3.grade),0) / 10 as grade, 1 as gradeWeight, t7.id as tagId, t7.name as tagName,
        group_concat(distinct coalesce(t4_2.name, 'na') order by t4_2.name) as groupName
        from mdl_quiz as t1 
        inner join mdl_quiz_attempts as t2 on t1.id = t2.quiz
        inner join mdl_quiz_grades as t3 on t1.id = t3.quiz and t2.userid = t3.userid
        inner join mdl_user as t4 on t2.userid = t4.id
        left join mdl_groups_members as t4_1 on t4.id = t4_1.userid
        left join mdl_groups as t4_2 on t4_1.groupid = t4_2.id 
        inner join mdl_course_modules as t5 on t1.id = t5.instance and module = 16
        inner join mdl_tag_instance as t6 on t6.itemid = t5.id and t6.itemtype = 'course_modules'
        inner join mdl_tag as t7 on t6.tagid = t7.id
        where t1.course = $courseId
        group by t1.id, t1.name, t2.timestart, t2.timefinish, t4.id, t4.firstname, t4.lastname, t5.id, t7.id, t7.name";

        $tmp = $this->mysqlConn->execSQLAndGetObjects($query);
        return (empty($tmp) ? array() : $tmp);
    }   

    public function getReportDiagTagAssignment($courseId){
        $query = "SELECT t1.course as courseId, t1.id as activityId, t1.name as activityName,  t5.id as cmId,
        t2.timecreated as timeStart, t2.timemodified as timeEnd, 
        t4.id as userId, t4.firstname as firstName, t4.lastname as lastName, t4.email, 
        coalesce(any_value(t3.grade),0) / 100 as grade, 1 as gradeWeight, t7.id as tagId, t7.name as tagName,
        group_concat(distinct coalesce(t4_2.name, 'na') order by t4_2.name) as groupName
        from mdl_assign as t1 
        inner join mdl_assign_submission as t2 on t1.id = t2.assignment
        inner join mdl_assign_grades as t3 on t1.id = t3.assignment and t2.userid = t3.userid
        inner join mdl_user as t4 on t2.userid = t4.id
        left join mdl_groups_members as t4_1 on t4.id = t4_1.userid
        left join mdl_groups as t4_2 on t4_1.groupid = t4_2.id 
        inner join mdl_course_modules as t5 on t1.id = t5.instance and t5.module = 1
        inner join mdl_tag_instance as t6 on t6.itemid = t5.id and t6.itemtype = 'course_modules'
        inner join mdl_tag as t7 on t6.tagid = t7.id
        where t1.course = $courseId
        group by t1.id, t1.name, t2.timecreated, t2.timemodified, t4.id, t4.firstname, t4.lastname, t5.id, t7.id, t7.name";

        $tmp = $this->mysqlConn->execSQLAndGetObjects($query);
        return (empty($tmp) ? array() : $tmp);
    }  
    
    public function getReportDiagTagLesson($courseId){
        $query = "SELECT t1.course as courseId, t1.id as activityId, t1.name as activityName, t5.id as cmId, 
        t2.timeseen as timeStart, coalesce(t3.completed, unix_timestamp()) as timeEnd, 
        t4.id as userId, t4.firstname as firstName, t4.lastname as lastName,
        t4.email, coalesce(any_value(t3.grade),0) / 100 as grade, 1 as gradeWeight, 
        group_concat(distinct coalesce(t4_2.name, 'na') order by t4_2.name) as groupName,
        t7.id as tagId, t7.name as tagName
        from mdl_lesson as t1 
        inner join mdl_lesson_attempts as t2 on t1.id = t2.lessonid
        left join mdl_lesson_grades as t3 on t1.id = t3.lessonid and t2.userid = t3.userid
        inner join mdl_user as t4 on t2.userid = t4.id
        left join mdl_groups_members as t4_1 on t4.id = t4_1.userid
        left join mdl_groups as t4_2 on t4_1.groupid = t4_2.id 
        inner join mdl_course_modules as t5 on t1.id = t5.instance and t5.module = 13
        inner join mdl_tag_instance as t6 on t6.itemid = t5.id and t6.itemtype = 'course_modules'
        inner join mdl_tag as t7 on t6.tagid = t7.id
        where t1.course = $courseId
        group by t1.id, t1.name, t2.timeseen, timeEnd, t4.id, t4.firstname, t4.lastname, t5.id, t7.id, t7.name";

        $tmp = $this->mysqlConn->execSQLAndGetObjects($query);
        return (empty($tmp) ? array() : $tmp);
    }
}

class CmNote
{
    public $ccCmId = 0;
    public $ccId = 0;
    public $cmId = 0;
    public $title = "";
    public $slot = 0;
    public $lastUpdate = 0;
    public $tagList = array();
}

class MoodleTag
{
    public $tagId = 0;
    public $tagName = 0;
    public $userId = 0;
    public $instanceId = 0;
    public $component = '';
    public $itemType = '';
    public $itemId = 0;
    public $contextId = 0;   
}
/*
class CcCm
{
    public $cmId = 0;
    public $cmName = "";
    public $ccCmId = 0;
    public $personalNotes = array();
}

class PersonalNote
{
    public $id = 0;
    public $ccCmId = 0;
    public $userId = 0;
    public $note = "";
    public $feedback = "";
}


        $obj2 = new stdClass();
        $obj2->noteTitle = "Note 1";
        $obj2->slot = 0;
        $obj2->personalNoteId = 1;
        $obj2->note = "La société québécoise change et évolue durant les années d’après-guerre";
        $obj2->feedback = "";
        $obj2->grade = 0;
        $obj->personalNotes[] = $obj2;
        $this->data[] = $obj;*/