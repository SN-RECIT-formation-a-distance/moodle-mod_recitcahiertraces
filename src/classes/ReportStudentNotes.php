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
require('../../../config.php');
require_once($CFG->dirroot . "/mod/recitcahiertraces/classes/PersistCtrl.php");
require_once dirname(__FILE__)."/recitcommon/Utils.php";

use recitcahiertraces\Utils;
use recitcahiertraces\PersistCtrl;

$cmId = required_param('cmId', PARAM_INT);
$userId = required_param('userId', PARAM_INT);
$showFeedback = (intval(required_param('sf', PARAM_INT)) == 1 ? true : false);

require_login();

list ($course, $cm) = get_course_and_cm_from_cmId($cmId);

$PAGE->set_context(context_module::instance($cm->id));

$theme = theme_config::load($PAGE->theme->name);

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


$userNotes = PersistCtrl::getInstance($DB, $USER)->getUserNotes($cmId, $userId);
$student = current(current(PersistCtrl::getInstance()->getEnrolledUserList($cmId, $userId)));

if(empty($userNotes)){
    echo "<h5>".get_string('noData', 'mod_recitcahiertraces')."</h5>";
    die();
}

$userNote = current(current($userNotes));

$pageTitle = sprintf("%s: %s | %s: %s", get_string('pluginname', 'mod_recitcahiertraces'), $userNote->noteDef->group->ct->name, get_string('printedOn', 'mod_recitcahiertraces'), date('Y-m-d H:i:s'));
?>

<!DOCTYPE html>
<html>
<head>
    <title><?php echo $pageTitle; ?></title>    
    <link rel="stylesheet" type="text/css" href="<?php echo $CFG->wwwroot . "/theme/styles.php/{$CFG->theme}/{$CFG->themerev}_1/all"?>">
    <link rel="stylesheet" type="text/css" href="<?php echo $CFG->wwwroot . "/mod/recitcahiertraces/css/report.css"; ?>">
    <link rel="icon" href="<?php echo Utils::getFavicon(); ?>" />
</head>

<body>
    <div class='Portrait cahier-traces-print-notes'>
        <header class='Header'>
            <div style='flex-grow: 1'>
                <div class='Title'><?php echo get_string('pluginname', 'mod_recitcahiertraces'); ?></div>
                <div class='Subtitle'><?php echo sprintf("%s | %s | %s", $userNote->noteDef->group->ct->name, $student->userName, $student->groupName) ; ?></div>
            </div>
            <div class='Logo'><img src='<?php echo $brandImage; ?>' alt='brand logo'/></div>
        </header>
    <?php 
        foreach($userNotes as $group){
            
            $note = current($group);
            echo '<div class="activity-container">';

            echo sprintf("<h4 class='activity-name'>%s: %s</h4>", get_string('group', 'mod_recitcahiertraces'), $note->noteDef->group->name);

            foreach($group as $note){
                // overflow = hidden for the notes that overflow the page dimensions
                echo "<div class='note-container'>";
                echo sprintf("<div class='text-muted'><strong>%s:</strong> %s</div>",  get_string('noteTitle', 'mod_recitcahiertraces'), $note->noteDef->title);
                
                echo sprintf("<div class='alert alert-secondary student-note'>%s</div>", $note->noteContent->text);


                echo '<blockquote class="blockquote mb-0">';
                echo sprintf('<span class="blockquote-footer">%s: %s</span>', get_string('timestamp', 'mod_recitcahiertraces'), $note->lastUpdateFormat());
                echo '</blockquote>';
                
                if(($showFeedback) && (strlen($note->feedback) > 0)){
                    echo sprintf('<div class="alert alert-primary teacher-feedback" role="alert"><strong>%s:</strong><br/>%s</div>', get_string('teacherFeedback', 'mod_recitcahiertraces'), $note->feedback);
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