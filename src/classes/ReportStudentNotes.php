<?php
require('../../../config.php');
require_once($CFG->dirroot . "/mod/recitcahiertraces/classes/PersistCtrlCahierTraces.php");
require_once($CFG->dirroot . "/local/recitcommon/php/Utils.php");

$cmId = required_param('cmId', PARAM_INT);
$userId = required_param('userId', PARAM_INT);
$showFeedback = (intval(required_param('sf', PARAM_INT)) == 1 ? true : false);

require_login();

list ($course, $cm) = get_course_and_cm_from_cmId($cmId);

//$PAGE->set_context(context_module::instance($cm->id));

$theme = theme_config::load('recit');

$brandImage = "{$CFG->wwwroot}/mod/recitcahiertraces/pix/recit-logo.png";
$customerLogo = $theme->setting_file_url('logo', 'logo');
if(!empty($customerLogo)){
    $brandImage = $customerLogo;
}

// check the permissions
$roles = Utils::getUserRoles($course->id, $USER->id);
// check if the user has admin access
if(!Utils::isAdminRole($roles)){
    // if not admin then the user has the right to see its own notes
    if($userId != $USER->id){
        die(get_string('forbiddenAccess', 'mod_recitcahiertraces'));
    }
}


$personalNotes = CahierTracesPersistCtrl::getInstance($DB, $USER)->getPersonalNotes($cmId, $userId);
$student = current(current(CahierTracesPersistCtrl::getInstance()->getEnrolledUserList($cmId, $userId)));

$cahierCanada = current(current($personalNotes));
$pageTitle = sprintf("%s: %s | %s: %s", get_string('pluginname', 'mod_recitcahiertraces'), $cahierCanada->ccName, get_string('printedOn', 'mod_recitcahiertraces'), date('Y-m-d H:i:s'));
?>

<!DOCTYPE html>
<html>
<head>
    <title><?php echo $pageTitle; ?></title>    
    <link rel="stylesheet" type="text/css" href="<?php echo $CFG->wwwroot . "/theme/styles.php/{$CFG->theme}/{$CFG->themerev}_1/all"?>">
    <link rel="stylesheet" type="text/css" href="<?php echo $CFG->wwwroot . "/local/recitcommon/css/report.css"; ?>">
    <link rel="icon" href="../pix/icon.png?v=2"  />
</head>

<body>
    <div class='Portrait cahier-traces-print-notes'>
        <header class='Header'>
            <div style='flex-grow: 1'>
                <div class='Title'><?php echo get_string('pluginname', 'mod_recitcahiertraces'); ?></div>
                <div class='Subtitle'><?php echo sprintf("%s | %s | %s", $cahierCanada->ccName, $student->userName, $student->groupName) ; ?></div>
            </div>
            <div class='Logo'><img src='<?php echo $brandImage; ?>' alt='brand logo'/></div>
        </header>
    <?php 
        foreach($personalNotes as $notes){
            
            $note = current($notes);
            echo '<div class="activity-container">';

            echo sprintf("<h4 class='activity-name'>%s: %s</h4>", get_string('activity', 'mod_recitcahiertraces'), $note->activityName);

            foreach($notes as $note){
                // overflow = hidden for the notes that overflow the page dimensions
                echo "<div class='note-container'>";
                echo sprintf("<h5 class='text-muted note-title'>%s: %s</h5>",  get_string('note', 'mod_recitcahiertraces'), $note->noteTitle);
                
                echo sprintf("<div class='alert alert-secondary student-note'>%s</div>", $note->note->text);

                echo '<blockquote class="blockquote mb-0">';
                echo sprintf('<span class="blockquote-footer">%s: %s</span>',  get_string('timestamp', 'mod_recitcahiertraces'), $note->lastUpdateFormat());
                echo '</blockquote>';
                
                if(($showFeedback) && (strlen($note->feedback) > 0)){
                    echo sprintf('<div class="alert alert-primary teacher-feedback" role="alert"><strong>%s:</strong><br/>%s</div>', get_string('teacherFeedback', 'mod_recitcahiertraces'), $note->feedback);
                }
                
                echo "</div>";
            }
            echo "<hr/>";

            echo "</div>";
        }
    ?>

        <footer>
            <?php echo $pageTitle; ?>
        </footer>
    </div>
</body>

</html>