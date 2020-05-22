<?php
require('../../../config.php');
require_once($CFG->dirroot . "/local/recitcommon/php/PersistCtrlCahierTraces.php");
require_once($CFG->dirroot . "/local/recitcommon/php/Utils.php");

$cmId = required_param('cmId', PARAM_INT);
$userId = required_param('userId', PARAM_INT);
$showFeedback = (intval(required_param('sf', PARAM_INT)) == 1 ? true : false);

require_login();

// check the permissions
$roles = Utils::getUserRoles($COURSE->id, $USER->id);
// check if the user has admin access
if(!Utils::isAdminRole($roles)){
    // if not admin then the user has the right to see its own notes
    if($userId != $USER->id){
        die(get_string('forbiddenAccess', 'mod_recitcahiercanada'));
    }
}


$personalNotes = CahierTracesPersistCtrl::getInstance($DB, $USER)->getPersonalNotes($cmId, $userId);
$student = current(current(CahierTracesPersistCtrl::getInstance()->getEnrolledUserList($cmId, $userId)));

$cahierCanada = current(current($personalNotes));
$pageTitle = sprintf("%s: %s | %s: %s", get_string('pluginname', 'mod_recitcahiercanada'), $cahierCanada->ccName, get_string('printedOn', 'mod_recitcahiercanada'), date('Y-m-d H:i:s'));
?>

<!DOCTYPE html>
<html>
<head>
    <title><?php echo $pageTitle; ?></title>    
    <link rel="stylesheet" type="text/css" href="../react_app/node_modules/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="<?php echo $CFG->wwwroot . "/local/recitcommon/css/report.css"; ?>">
    <link rel="icon" href="../pix/icon.png?v=2"  />
</head>

<body>
    <div class='Portrait'>
        <header class='Header'>
            <div class='Logo'><img src='../pix/recit-logo.png' alt='RECIT logo'/></div>
            <div style='flex-grow: 1'>
                <div class='Title'><?php echo get_string('pluginname', 'mod_recitcahiercanada'); ?></div>
                <div class='Subtitle'><?php echo sprintf("%s | %s | %s", $cahierCanada->ccName, $student->userName, $student->groupName) ; ?></div>
            </div>
        </header>
    <?php 
        foreach($personalNotes as $notes){
            
            $note = current($notes);
            echo '<div class="card" style="margin-bottom: 20px">';
            echo sprintf("<div class='card-header'>%s: %s</div>", get_string('activity', 'mod_recitcahiercanada'), $note->activityName);
            foreach($notes as $note){
                // overflow = hidden for the notes that overflow the page dimensions
                echo "<div class='card-body' style='overflow: hidden;'>";
                echo sprintf("<h5 class='card-title'>%s</h5>", $note->noteTitle);
                echo '<blockquote class="blockquote mb-0">';
                echo sprintf('<footer class="blockquote-footer">%s: %s</footer>',  get_string('timestamp', 'mod_recitcahiercanada'), $note->lastUpdateFormat());
                echo '</blockquote>';
                
                echo "{$note->note->text}";
                
                if(($showFeedback) && (strlen($note->feedback) > 0)){
                    echo sprintf('<div class="alert alert-primary" role="alert" style="margin-top: 15px;"><strong>%s:</strong><br/>%s</div>', get_string('teacherFeedback', 'mod_recitcahiercanada'), $note->feedback);
                }
                
                echo "</div>";
            }
            echo "</div>";
        }
    ?>

        <footer>
            <?php echo $pageTitle; ?>
        </footer>
    </div>
</body>

</html>