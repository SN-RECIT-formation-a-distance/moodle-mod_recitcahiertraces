<?php
require('../../../config.php');
require_once($CFG->dirroot . "/mod/recitcahiercanada/classes/PersistCtrl.php");
require_once($CFG->dirroot . "/local/recitcommon/php/Utils.php");

use recitcommon\Utils;
use recitcahiercanada\PersistCtrl;

$cmId = required_param('cmId', PARAM_INT);
$cId = required_param('cId', PARAM_INT);

require_login();

//$PAGE->set_context(context_module::instance($cm->id));

$theme = theme_config::load('recit');

list ($course, $cm) = get_course_and_cm_from_cmid($cId, 'recitcahiercanada');

$brandImage = "{$CFG->wwwroot}/mod/recitcahiercanada/pix/recit-logo.png";
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
        die(get_string('forbiddenAccess', 'mod_recitcahiercanada'));
    }
}


$pNotes = PersistCtrl::getInstance($DB, $USER)->getCmSuggestedNotes($course->id, $cmId);

$pageTitle = sprintf("%s: %s | %s: %s", get_string('pluginname', 'mod_recitcahiercanada'), get_string('suggestednote', 'mod_recitcahiercanada'), get_string('printedOn', 'mod_recitcahiercanada'), date('Y-m-d H:i:s'));
?>

<!DOCTYPE html>
<html>
<head>
    <title><?php echo $pageTitle; ?></title>    
    <link rel="stylesheet" type="text/css" href="<?php echo $CFG->wwwroot . "/theme/recit/style/bootstrap.css"?>">
    <link rel="stylesheet" type="text/css" href="<?php echo $CFG->wwwroot . "/local/recitcommon/css/report.css"; ?>">
    <link rel="icon" href="../pix/icon.png?v=2"  />
</head>

<body>
    <div class='Portrait cahier-traces-print-notes'>
        <header class='Header'>
            <div style='flex-grow: 1'>
                <div class='Title'><?php echo get_string('pluginname', 'mod_recitcahiercanada'); ?></div>
                <div class='Subtitle'><?php echo get_string('suggestednote', 'mod_recitcahiercanada'); ?></div>
            </div>
            <div class='Logo'><img src='<?php echo $brandImage; ?>' alt='brand logo'/></div>
        </header>
    <?php 
        foreach($pNotes as $notes){
            
            $note = current($notes);
            echo '<div class="activity-container">';

            echo sprintf("<h4 class='activity-name'>%s: %s</h4>", get_string('activity', 'mod_recitcahiercanada'), $note->activityName);
        
            foreach($notes as $note){
                // overflow = hidden for the notes that overflow the page dimensions
                echo "<div class='note-container'>";
                echo sprintf("<h5 class='text-muted note-title'>%s: %s</h5>", get_string('note', 'mod_recitcahiercanada'), $note->noteTitle);
                
                echo sprintf("<div class='alert alert-secondary student-note'>%s</div>", $note->suggestedNote);
                
                echo "</div>";
            }
            echo "<hr/>";

            echo "</div>";
        }

        if(empty($pNotes)){
            echo "<h5>Aucune information disponible.</h5>";
        }
    ?>

        <footer>
            <?php echo $pageTitle; ?>
        </footer>
    </div>
</body>

</html>