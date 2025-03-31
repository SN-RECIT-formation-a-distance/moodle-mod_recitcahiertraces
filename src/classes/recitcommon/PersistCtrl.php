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

require_once __DIR__ . '/Utils.php';

abstract class APersistCtrl
{
   /**
     * mysqli_native_moodle_database 
     */
    protected $mysqlConn;    
    protected $signedUser;
    protected $prefix = "";
   
    protected function __construct($mysqlConn, $signedUser){
        global $CFG;

        $this->mysqlConn = $mysqlConn;
        $this->signedUser = $signedUser;
        $this->prefix = $CFG->prefix;
    }


    public function getRecordsSQL($sql, $params = array()){
        global $DB;
        $result = $DB->get_records_sql($sql, $params);
        
        foreach($result as $item){
            foreach((array)$item as $k => $v){
                if (strpos($k, '_') != false){
                    $key = preg_replace_callback("/_[a-z]?/", function($matches) {return strtoupper(ltrim($matches[0], "_"));}, $k);
                    $item->$key = $v;
                    unset($item->$k);
                }
            }
        }
        return array_values($result);
    }

	public function checkSession(){
        return (isset($this->signedUser) && $this->signedUser->id > 0);
    }
}

abstract class MoodlePersistCtrl extends APersistCtrl{
    public function getCmNameFromCmId($cmId, $courseId, $modData = false){
        if (!$modData) $modData = get_fast_modinfo($courseId);
        
        foreach ($modData->cms as $cm) {
            if ($cmId == $cm->id){
                return $cm->name;
            }
        }
    }

    public function getCourseTeachers($courseId, $groupIds = array()){
        $coursecontext = \context_course::instance($courseId);
        $users = get_users_by_capability($coursecontext, 'mod/recitcahiertraces:viewadmin', '', '', '', '', null, null, false);

        foreach($users as $item){
            $item->groupIds = groups_get_user_groups($courseId, $item->id);
            $item->groupIds = array_values(array_pop($item->groupIds));
            unset($item->password);
        }

        return $users;
    }


    public function getEnrolledUserList($cmId = 0, $userId = 0, $courseId = 0, $ownGroup = false){
        $cmStmt = " true ";
        $cmStmt2 = " true ";
        $vars = array();
        if($cmId > 0){
            $cmStmt = "(t1.courseid = (select course from {course_modules} where id = :cmid))";
            $vars['cmid'] = $cmId;
            $cmStmt2 = "(t1.courseid = (select course from {course_modules} where id = :cmid2))";
            $vars['cmid2'] = $cmId;
        }

        $userStmt =  " true ";
        $userStmt2 =  " true ";
        /*if($userId > 0){
            $userStmt = " (t3.id = :user)";
            $vars['user'] = $userId;
            $userStmt2 = " (t3.id = :user2)";
            $vars['user2'] = $userId;
        }*/

        $courseStmt = " true ";
        $courseStmt2 = " true ";
        if($courseId > 0){
            $courseStmt = "(t1.courseid = :courseid)";
            $vars['courseid'] = $courseId;
            $courseStmt2 = "(t1.courseid = :courseid2)";
            $vars['courseid2'] = $courseId;
        }
        
        $groupStmt = " true ";
        $groupStmt2 = " true ";
        if($ownGroup){
            $groupStmt = "t4.groupid in (select groupid from {groups_members} where userid = :user3)";
            $groupStmt2 = " false ";
            $vars['user3'] = $userId;
        }

        // This query fetch all students with their groups. The groups belong to the course according to the parameter.
        // In case a student has no group, the left join in the first query add them to the result with groupId = 0.
        // In case there are no groups in the course, the second query adds (by union set) the students without group.

        $vars['str'] = get_string("nogroup", 'mod_recitcahiertraces');
        $vars['str2'] = get_string("nogroup", 'mod_recitcahiertraces');
        $query = "(select ".$this->mysqlConn->sql_concat('t3.id', "' '", 't5.id')." uniqueId, t1.id, t1.enrol, t1.courseid course_id, t3.id user_id,".$this->mysqlConn->sql_concat("t3.firstname", "' '", "t3.lastname")." user_name, coalesce(t5.id,-1) group_id, 
            coalesce(t5.name, :str) group_name 
            from {enrol} t1
        inner join {user_enrolments} t2 on t1.id = t2.enrolid
        inner join {user} t3 on t2.userid = t3.id and t3.suspended = 0 and t3.deleted = 0
        left join {groups_members} t4 on t3.id = t4.userid
        left join {groups} t5 on t4.groupid = t5.id and $groupStmt
        where (t1.courseid = t5.courseid) and $cmStmt and $userStmt and $courseStmt
        order by group_name asc, user_name asc)
        union
        (select ".$this->mysqlConn->sql_concat('t2.id', "' '", 't3.id')." uniqueId, t1.id, t1.enrol, t1.courseid course_id, t3.id user_id, ".$this->mysqlConn->sql_concat("t3.firstname", "' '", "t3.lastname")." user_name, -1 group_id, :str2 group_name 
        from {enrol} t1
        inner join {user_enrolments} t2 on t1.id = t2.enrolid
        inner join {user} t3 on t2.userid = t3.id and t3.suspended = 0 and t3.deleted = 0
        where $cmStmt2 and $userStmt2 and $courseStmt2 and $groupStmt2
        order by user_name asc)";
        
        $tmp = $this->getRecordsSQL($query, $vars);

        $result = array();
        foreach($tmp as $item){
            $result[$item->groupName][] = $item;
        }

        return $result;
    }
}
