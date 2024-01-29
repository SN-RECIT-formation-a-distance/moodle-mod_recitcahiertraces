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

$gId = required_param('gId', PARAM_INT);
$cId = required_param('cmId', PARAM_INT);

require_login();

list ($course, $cm) = get_course_and_cm_from_cmId($cId);
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
        die(get_string('forbiddenaccess', 'mod_recitcahiertraces'));
    }
}

$ctId = PersistCtrl::getInstance($DB, $USER)->getCtIdFromCmId($cId);
$pNotes = PersistCtrl::getInstance($DB, $USER)->getCmSuggestedNotes($course->id, $gId, $ctId);

$pageTitle = sprintf("%s: %s | %s: %s", get_string('pluginname', 'mod_recitcahiertraces'), get_string('suggestednote', 'mod_recitcahiertraces'), get_string('printedon', 'mod_recitcahiertraces'), date('Y-m-d H:i:s'));
?>

<!DOCTYPE html>
<html>
<head>
    <title><?php echo $pageTitle; ?></title>    
    <link rel="stylesheet" type="text/css" href="<?php echo $CFG->wwwroot . "/theme/styles.php/{$CFG->theme}/{$CFG->themerev}_1/all"?>">
    <link rel="stylesheet" type="text/css" href="<?php echo $CFG->wwwroot . "/mod/recitcahiertraces/css/report.css"; ?>">
    <link rel="icon" href="<?php echo Utils::getFavicon(); ?>"  />
</head>

<body>
    <div class='Portrait cahier-traces-print-notes'>
        <header class='Header'>
            <div style='flex-grow: 1'>
                <div class='Title'><?php echo get_string('pluginname', 'mod_recitcahiertraces'); ?></div>
                <div class='Subtitle'><?php echo get_string('suggestednote', 'mod_recitcahiertraces'); ?></div>
            </div>
            <div class='Logo'><img src='<?php echo $brandImage; ?>' alt='brand logo'/></div>
        </header>
    <?php 
        foreach($pNotes as $group){
            
            $note = current($group);
            
            echo '<div class="activity-container">';

            echo sprintf("<h4 class='activity-name'>%s: %s</h4>", get_string('group', 'mod_recitcahiertraces'), $note->group->name);
        
            foreach($group as $note){
                // overflow = hidden for the notes that overflow the page dimensions
                echo "<div class='note-container'>";
                echo sprintf("<div class='text-muted'><strong>%s:</strong> %s</div>", get_string('notetitle', 'mod_recitcahiertraces'), $note->title);
                
                echo sprintf("<div class='alert alert-secondary student-note'>%s</div>", $note->suggestedNote);
                
                echo "</div>";
            }
            echo "<hr/>";

            echo "</div>";
        }

        if(empty($pNotes)){
            echo "<h5>".get_string('nodata', 'mod_recitcahiertraces')."</h5>";
        }
    ?>

        <footer>
            <?php echo $pageTitle; ?>
        </footer>
    </div>
</body>

</html>