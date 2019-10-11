<?php
require('../../../config.php');
require_once($CFG->dirroot . "/mod/recitcahiercanada/common/php/PersistCtrl.php");
require_once($CFG->dirroot . "/mod/recitcahiercanada/common/php/Utils.php");

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


$tmp = PersistCtrl::getInstance($DB, $USER)->getPersonalNotes($cmId, $userId);

$personalNotes = array();
foreach($tmp as $item){
    $item->lastUpdate = ($item->lastUpdate > 0 ? date('Y-m-d H:i:s', $item->lastUpdate) : '');
    $personalNotes[$item->cmId][] = $item;
}

$cahierCanada = current(current($personalNotes));
$pageTitle = sprintf("%s: %s | %s: %s", get_string('pluginname', 'mod_recitcahiercanada'), $cahierCanada->ccName, get_string('printedOn', 'mod_recitcahiercanada'), date('Y-m-d H:i:s'));
?>

<!DOCTYPE html>
<html>
<head>
    <title><?php echo $pageTitle; ?></title>
    <link rel="stylesheet" type="text/css" href="../common/css/report.css">
    <link rel="icon" href="../pix/icon.png?v=2"  />
</head>

<body>
    <div class='Portrait'>
        <header class='Header'>
            <div class='Logo'><img src='../pix/recit-logo.png' alt='RECIT logo'/></div>
            <div style='flex-grow: 1'>
                <div class='Title'><?php echo get_string('pluginname', 'mod_recitcahiercanada'); ?></div>
                <div class='Subtitle'><?php echo $cahierCanada->ccName; ?></div>
            </div>
        </header>
    <?php 
        foreach($personalNotes as $notes){
            
            $note = current($notes);
            echo sprintf("<h1 style='text-align: center; margin-bottom: 20px;'>%s: %s</h1>", get_string('activity', 'mod_recitcahiercanada'), $note->activityName);
            foreach($notes as $note){
                echo "<table class='Table1'>";
                echo sprintf("<caption>%s</caption>", $note->title);
                echo "<thead>";
                echo "<tr>";
                echo sprintf("<th>%s</th>", get_string('studentNote', 'mod_recitcahiercanada'));
                if($showFeedback){
                    echo sprintf("<th>%s</th>", get_string('teacherFeedback', 'mod_recitcahiercanada'));
                }                
                
                echo sprintf("<th>%s</th>", get_string('timestamp', 'mod_recitcahiercanada'));
                echo "</tr>";
                echo "</thead>";
                echo "<tbody>";
                echo "<tr>";
                echo "<td>{$note->note}</td>";
                if($showFeedback){
                    echo "<td>{$note->feedback}</td>";
                }
                echo "<td>{$note->lastUpdate}</td>";
                echo "</tr>";
            }
            echo "</tbody>";
            echo "</table>";
        }
    ?>

        <footer>
            <?php echo $pageTitle; ?>
        </footer>
    </div>
</body>

</html>