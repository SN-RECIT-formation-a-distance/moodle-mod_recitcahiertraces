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

require_once __DIR__ . '/MySQLiConn.php';
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

        $this->mysqlConn = new RecitMySQLConn($mysqlConn);
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

    /**
     * Return SQL for performing group concatenation on given field/expression
     *
     * @param string $field
     * @param string $separator
     * @param string $sort
     * @return string
     */
    public function sql_group_concat(string $field, string $separator = ',', string $sort = ''): string {
        global $CFG;
        if ($CFG->dbtype == 'pgsql'){
            $fieldsort = $sort ? "ORDER BY {$sort}" : '';
            return "STRING_AGG(CAST({$field} AS VARCHAR), '{$separator}' {$fieldsort})";
        }else{
            $fieldsort = $sort ? "ORDER BY {$sort}" : '';
            return "GROUP_CONCAT({$field} {$fieldsort} SEPARATOR '{$separator}')";
        }
    }
    
    public function sql_uniqueid(): string {
        global $CFG;
        if ($CFG->dbtype == 'pgsql'){
            return "gen_random_uuid()";
        }else{
            return "uuid()";
        }
    }
    
    public function sql_from_unixtime($field): string {
        global $CFG;
        if ($CFG->dbtype == 'pgsql'){
            return "to_char(to_timestamp($field), 'yyyy-mm-dd HH24:MI:SS')";
        }else{
            return "FROM_UNIXTIME($field)";
        }
    }
    
    public function sql_to_time($field): string {
        global $CFG;
        if ($CFG->dbtype == 'pgsql'){
            return "to_timestamp($field)";
        }else{
            return "FROM_UNIXTIME($field)";
        }
    }
    
    public function sql_datediff($field, $field2): string {
        global $CFG;
        if ($CFG->dbtype == 'pgsql'){
            return "EXTRACT(DAY FROM $field - $field2)";
        }else{
            return "DATEDIFF($field, $field2)";
        }
    }
    
    public function sql_caststring($field): string {
        global $CFG;
        if ($CFG->dbtype == 'pgsql'){
            return "CAST($field AS TEXT)";
        }else{
            return "$field";
        }
    }
    
    public function sql_castutf8($field): string {
        global $CFG;
        if ($CFG->dbtype == 'pgsql'){
            return "CAST($field AS TEXT)";
        }else{
            return "CONVERT($field USING utf8)";
        }
    }
    
    public function sql_tojson(): string {
        global $CFG;
        if ($CFG->dbtype == 'pgsql'){
            return "jsonb_build_object";
        }else{
            return "JSON_OBJECT";
        }
    }
    
    public function sql_sectotime($field): string {
        global $CFG;
        if ($CFG->dbtype == 'pgsql'){
            return "to_char( ($field ||' seconds')::interval, 'HH24:MM:SS' )";
        }else{
            return "SEC_TO_TIME($field)";
        }
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

    protected function getStmtStudentRole($userId, $courseId){
        // contextlevel = 50 = course context
        // user has role student and it is enrolled in the course
        $stmt = "(exists(select st1.id from {$this->prefix}role as st1 inner join {$this->prefix}role_assignments as st2 on st1.id = st2.roleid
        where st2.userid = $userId and st2.contextid in (select id from {$this->prefix}context where instanceid = $courseId and contextlevel = 50) and st1.shortname in ('student'))
        and exists(select st1.id from {$this->prefix}enrol as st1 inner join {$this->prefix}user_enrolments as st2 on st1.id = st2.enrolid where st1.courseid = $courseId and st2.userid = $userId limit 1))";

        return $stmt;
    }


	public function getEnrolledUserList($cmId = 0, $userId = 0, $courseId = 0){
        $cmStmt = " 1 ";
        if($cmId > 0){
            $cmStmt = "(t1.courseid = (select course from {$this->prefix}course_modules where id = $cmId))";
        }

        $userStmt =  " 1 ";
        if($userId > 0){
            $userStmt = " (t3.id = $userId)";
        }

        $courseStmt = " 1 ";
        if($courseId > 0){
            $courseStmt = "(t1.courseid = $courseId)";
        }

        // This query fetch all students with their groups. The groups belong to the course according to the parameter.
        // In case a student has no group, the left join in the first query add them to the result with groupId = 0.
        // In case there are no groups in the course, the second query adds (by union set) the students without group.

        $str = "(Pas de groupe)";
        $query = "(select t1.enrol, t1.courseid as courseId, t3.id as userId, concat(t3.firstname, ' ', t3.lastname) as userName, coalesce(t5.id,-1) as groupId, 
            coalesce(t5.name, '$str') as groupName 
            from {$this->prefix}enrol as t1
        inner join {$this->prefix}user_enrolments as t2 on t1.id = t2.enrolid
        inner join {$this->prefix}user as t3 on t2.userid = t3.id and t3.suspended = 0 and t3.deleted = 0
        left join {$this->prefix}groups_members as t4 on t3.id = t4.userid
        left join {$this->prefix}groups as t5 on t4.groupid = t5.id
        where (t1.courseid = t5.courseid) and $cmStmt and $userStmt and $courseStmt
        order by groupName asc, userName asc)
        union
        (select t1.enrol, t1.courseid as courseId, t3.id as userId, concat(t3.firstname, ' ', t3.lastname) as userName, -1 as groupId, '$str' as groupName 
        from {$this->prefix}enrol as t1
        inner join {$this->prefix}user_enrolments as t2 on t1.id = t2.enrolid
        inner join {$this->prefix}user as t3 on t2.userid = t3.id and t3.suspended = 0 and t3.deleted = 0
        where $cmStmt and $userStmt and $courseStmt
        order by userName asc)";
        $tmp = $this->mysqlConn->execSQLAndGetObjects($query);    

        $result = array();
        foreach($tmp as $item){
            $result[$item->groupName][] = $item;
        }

        return $result;
    }
}
