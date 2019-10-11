<?php
require('../../../../config.php');
require_once($CFG->dirroot.'/mod/recitcahiercanada/common/php/PersistCtrl.php');
//require_once($CFG->dirroot.'/mod/recitcahiercanada/db/access.php');
require_once($CFG->dirroot.'/mod/recitcahiercanada/common/php/ReportDiagTag.php');
require_once($CFG->dirroot.'/mod/recitcahiercanada/common/php/Utils.php');

register_shutdown_function(function(){ return RecitApi::onPhpError(); });

$webapi = new RecitApi($DB, $COURSE, $USER);
$webapi->getRequest($_REQUEST);
$webapi->processRequest();
$webapi->replyClient();

///////////////////////////////////////////////////////////////////////////////////
class WebApiResult
{
    public $success = false;
    public $data = null;
    public $msg = "";
    public $contentType = 'json';
    
    public function __construct($success, $data = null, $msg = "", $contentType = 'json'){
        $this->success = $success;
        $this->data = $data;
        $this->msg = $msg;
        $this->contentType = $contentType;
    }
}

abstract class WebApi
{
    protected $request = null;
    protected $lastResult = null;
    public static $lastError = null;
    public static $httpOrigin = "";
    
    public static function onPhpError(){
        if(WebApi::$lastError == null){
            WebApi::$lastError = error_get_last(); 
        }

        if(WebApi::$lastError != NULL) {
            $headers = WebApi::getDefaultHeaders();
            $headers[] = 'Status: 500 Internal Server Error';
            $headers[] = "Content-type: application/json; charset=utf-8";  
            foreach($headers as $header){ header($header); }
            ob_clean();
            flush();
            echo json_encode( new WebApiResult(false, null, WebApi::$lastError['message']));
        }
    }

    public static function getDefaultHeaders(){
        $result = array();
        $result[] = "Access-Control-Allow-Origin: ". WebApi::$httpOrigin;
        $result[] = 'Access-Control-Allow-Credentials: true';
        $result[] = 'Access-Control-Max-Age: 86400';    // cache for 1 day
        $result[] = "Access-Control-Allow-Methods: GET, POST, OPTIONS";         
        $result[] = "Access-Control-Allow-Headers: Origin, Accept, Content-Type";
        return $result;
    }

    public function getRequest(){
        if(empty($_REQUEST)){
            $this->request = json_decode(file_get_contents('php://input'), true);
            if($this->request == null){
                $this->request = array();
            }
        }
        else{
            $this->request = $_REQUEST;
        }
    }

    public function processRequest(){
        if(!isset($this->request['service'])){
            $msg =  "Service not specified";
            $success = false;

            if($_SERVER['REQUEST_METHOD'] == "OPTIONS"){
                $msg = "Replying OPTIONS request";
                $success = true;
            }

            $this->lastResult = new WebApiResult($success, null, false, $msg);
			return false;
        }
		
        if(!PersistCtrl::getInstance()->checkSession()){
            $this->lastResult = new WebApiResult(false, null, false, "User not signed in");
            return false;
        }

        return true;
    }
	
	public function replyClient(){
        WebApi::$lastError = error_get_last();
        if(WebApi::$lastError != null){ return; }

        $webApiResult = $this->lastResult;
        $headers = WebApi::getDefaultHeaders(); 
        $result = json_encode($webApiResult);

        if($webApiResult->contentType == 'json'){
            $headers[] = "Content-type: application/json; charset=utf-8";
        }
        else if($webApiResult->contentType == 'html'){
            $headers[] = "Content-type: text/html; charset=utf-8";
        }
        else if($webApiResult->contentType == 'octet-stream'){
            $headers[] = "Content-type: application/octet-stream";
            $headers[] = "Content-Description: File Transfer";
            $headers[] = 'Content-Disposition: attachment; filename='.basename($webApiResult->data->fqn);
            $headers[] = 'Content-Transfer-Encoding: binary';
            $headers[] = 'Expires: 0';
            $headers[] = 'Cache-Control: must-revalidate';
            $headers[] = 'Pragma: public';
            $headers[] = 'Content-Length: ' . filesize($webApiResult->data->fqn);
            
            $result = file_get_contents($webApiResult->data->fqn);
        }
        else{
            $headers[] = "Content-type: text; charset=utf-8";                        
        }		

        foreach($headers as $header){
            header($header);
        }
        
        ob_clean();
        flush();
        echo $result;
	}
		
    protected function prepareJson($obj){
        if(is_object($obj)){
            $tmp = get_object_vars($obj);
            foreach($tmp as $attr => $value){
                if($value instanceof DateTime){
                    $obj->$attr = $this->phpDT2JsDT($value);
                }
                else if(is_array($value)){
                    foreach($value as $item){
                        $this->prepareJson($item);
                    }
                }
                else if(is_object($value)){
                    $this->prepareJson($value);
                }
            }
        }
    }

    /**
     * Convert the PHP DateTime Object to be sent to the client (JavaScript date time string)
     */
    protected function phpDT2JsDT($value){
        //DateTime::ATOM
        //("Y-m-d\TH:i:s.000\Z"        
        //$value->setTimezone(new DateTimeZone("UTC"));
        // force the conversion to UTC date DateTime::ATOM
        return ($value == null ? "" : $value->format("Y-m-d H:i:s"));
    }

    /**
     * Convert the JavaScript date string to PHP DateTime Object
     */
    protected function jsDT2PhpDT($value){
        // force the conversion to UTC date
        return (empty($value) ? null : new DateTime($value, new DateTimeZone("UTC")));
    }

    protected function jsArray2PhpArray($request, $field){
        if(isset($request[$field])){
            if(strlen($request[$field]) > 0){
                return explode(",", $request[$field]);
            }
        }

        return array();
    }

    protected function downloadFile($filename, $fileType, $charset){
        try{
            if (!file_exists($filename)) {
                throw new Exception("FAILED: the CSV file does not exist.");
            }
            header('Content-Description: File Transfer');
            header("Content-Type: $fileType;charset=$charset");
            header('Content-Disposition: attachment; filename='.basename($filename));
            header('Content-Transfer-Encoding: binary');
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            header('Content-Length: ' . filesize($filename));
            //ob_clean();
            flush();
            readfile($filename);
        }
        catch(Exception $e){
            die($e->getMessage());
        }
    }
}

abstract class MoodleApi extends WebApi
{
    protected $signedUser = null;
    protected $course = null;
    protected $dbConn = null;

    public function __construct($DB, $COURSE, $USER){
        $this->signedUser = $USER;
        $this->course = $COURSE;
        $this->dbConn = $DB;
        PersistCtrl::getInstance($DB, $USER);
    }

    /**
     * $level [a = admin | s = student]
     */
    protected function canUserAccess($level, $cmId = 0, $userId = 0, $courseId = 0){
        $userRoles = array();

        if($courseId > 0){
            $userRoles = Utils::getUserRoles($courseId, $this->signedUser->id);
        }
        else if($cmId > 0){
            list($course, $cm) = get_course_and_cm_from_cmid($cmId);
            $userRoles = Utils::getUserRoles($course->id, $this->signedUser->id);
        }
        else{
            $userRoles = Utils::getUserRoles($this->course->id, $this->signedUser->id);
        }
        
        //$desc = print_r($userRoles, true);
        //throw new Exception($desc);

        // if the user is admin then it has access to all
        if(Utils::isAdminRole($userRoles)){
            return true;
        }
         // if the level is admin then the user must have a admin role to have access
        else if(($level == 'a') && Utils::isAdminRole($userRoles)){
            return true;
        }
        // if the user is student then it has access only if it is accessing its own stuff
        else if(($level == 's') && ($userId == $this->signedUser->id)){
            return true;
        }
        else{
            throw new Exception("Forbidden Access");
        }
    }

    protected function getEnrolledUserList($request){   
        try{
            $cmId = intval($request['cmId']);

            $this->canUserAccess('a', $cmId);

            $tmp = PersistCtrl::getInstance()->getEnrolledUserList($cmId);
            $result = array();
            foreach($tmp as $item){
                $this->prepareJson($item);
                $result[] = $item;
            }
            
            return new WebApiResult(true, $result);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }        
    }

    protected function getSectionCmList($request){   
        try{
            $cmId = intval($request['cmId']);

            $this->canUserAccess('a', $cmId);

            $result = PersistCtrl::getInstance()->getSectionCmList($cmId);
            $this->prepareJson($result);
            return new WebApiResult(true, $result);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }        
    }

    protected function getTagList($request){   
        try{
            $cmId = intval($request['cmId']);
            $itemType = $request['itemType'];
            $component = $request['component'];

            $this->canUserAccess('a', $cmId);

            $result = PersistCtrl::getInstance()->getTagList($cmId, $itemType, $component);
            $this->prepareJson($result);
            return new WebApiResult(true, $result);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }        
    }
}

abstract class CahierCanadaApi extends MoodleApi
{
    protected function getPersonalNotes($request){
        try{
            $cmId = intval($request['cmId']);
            $userId = intval($request['userId']);

            $this->canUserAccess('s', $cmId, $userId);

            $result = PersistCtrl::getInstance()->getPersonalNotes($cmId, $userId);
            $this->prepareJson($result);
            return new WebApiResult(true, $result);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }     
    }

    protected function savePersonalNote($request){        
        try{			
            $data = json_decode(json_encode($request['data']), FALSE);
            $flag = $request['flag'];

            $this->canUserAccess('s', 0, $data->userId);

            $result = PersistCtrl::getInstance()->savePersonalNote($data, $flag);                    
            $this->prepareJson($result);
            return new WebApiResult(true, $result);
		}
		catch(Exception $ex){
            return new WebApiResult(false, null, false, $ex->GetMessage());
        } 
    }

    protected function getCmNotes($request){
        try{
            $cmId = intval($request['cmId']);

            $this->canUserAccess('a', $cmId);

            $result = PersistCtrl::getInstance()->getCmNotes(0, $cmId);
            $this->prepareJson($result);
            return new WebApiResult(true, $result);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }     
    }
    
    protected function removeCcCmNote($request){
        try{
            $this->canUserAccess('a');

            $ccCmId = intval($request['ccCmId']);
            PersistCtrl::getInstance()->removeCcCmNote($ccCmId);
            return new WebApiResult(true);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }     
    }
    
    protected function saveCcCmNote($request){        
        try{            
            $data = json_decode(json_encode($request['data']), FALSE);
            $tagMetadata = json_decode(json_encode($request['tagMetadata']), FALSE);

            $this->canUserAccess('a', $data->cmId);

            $result = PersistCtrl::getInstance()->saveCcCmNote($data);
            PersistCtrl::getInstance()->moodleTagItem($result, $tagMetadata);
            $this->prepareJson($result);
            return new WebApiResult(true, $result);
		}
		catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        } 
    }

    protected function checkCCSeqPos($request){
        try{
            $cmId = intval($request['cmId']);
            $this->canUserAccess('a', $cmId);
            $result = PersistCtrl::getInstance()->checkCCSeqPos($cmId);
            return new WebApiResult(true, $result);
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }  
    }
}

class RecitApi extends CahierCanadaApi
{	       
    public function processRequest(){
        if(!parent::processRequest()){
            return;
        }

        $serviceWanted = $this->request['service'];
        
        $result = RecitApi::$serviceWanted($this->request);

        $this->lastResult = $result;
    }

    protected function getReportDiagTag($request){
        try{
            $courseId = (isset($request['courseId']) ? intval($request['courseId']) : 0);
            $cmId = (isset($request['cmId']) ? intval($request['cmId']) : 0);
            $userId = (isset($request['userId']) ? intval($request['userId']) : 0);
            $options = (isset($request['options']) ? explode(",", $request['options']) : array());
            $output = (isset($request['output']) ? $request['output'] : 'json');

            $this->canUserAccess('a', $cmId, 0, $courseId);

            $result = new ReportDiagTagContent($this->dbConn);
            $result->loadContent($courseId, $cmId, $userId, $options);

            if($output == "csv"){
                $result->courseName = $this->course->fullname;
                
                if(in_array('question', $options)){
                    $result->reportName = get_string('recitdiagtagquestion', 'quiz_recitdiagtagquestion');
                }
                else{
                    $result->reportName = get_string('pluginname', 'report_recitdiagtag');
                }

                $writer = new ReportDiagTagCSVWriter($result, 'mod_recitcahiercanada');
                $writer->writeReport();
                $this->downloadFile($writer->getFilename(), 'application/csv', 'ISO-8859-1');
            }
            else{
                $this->prepareJson($result);
                return new WebApiResult(true, $result);
            }
        }
        catch(Exception $ex){
            return new WebApiResult(false, null, $ex->GetMessage());
        }     
    }

    
}

