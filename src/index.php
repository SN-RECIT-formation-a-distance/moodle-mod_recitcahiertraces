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
 * @copyright 2019 RÉCIT FAD
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


require('../../config.php');

$id = required_param('id', PARAM_INT); // course id

$course = $DB->get_record('course', array('id'=>$id), '*', MUST_EXIST);

require_login($course);

$strpluginname = get_string("modulenameplural", "recitcahiertraces");
$PAGE->set_url('/mod/recitcahiertraces/index.php', ['id' => $id]);
$PAGE->set_pagelayout('incourse');
$PAGE->set_title($course->shortname . ' - ' . $strpluginname);
$PAGE->set_heading($course->fullname);

echo $OUTPUT->header();

// Get all the appropriate data.
if (!$modList = get_all_instances_in_course("recitcahiertraces", $course, $USER->id)) {
    notice(get_string('thereareno', 'moodle', $strpluginname), "../../course/view.php?id=$course->id");
    die;
}

echo "<h3>".get_string("modulenameplural", "recitcahiertraces")."</h3>";
echo "<table class='table table-striped'>";
echo "<thead>";
echo "<tr>";
echo "<th>".get_string('section')."</th>";
echo "<th>".get_string('name')."</th>";
echo "</tr>";
echo "</thead>";
echo "<tbody>";

$sectionid = 0;
$sectionname = "";

foreach($modList as $mod){
    if($sectionid != $mod->section){
        $sectionname = get_section_name($course, $mod->section);
        $sectionid = $mod->section;
    }

    echo "<tr>";
    echo "<td>$sectionname</td>";
    echo "<td><a target='_blank' href='{$CFG->wwwroot}/mod/recitcahiertraces/view.php?id={$mod->coursemodule}'>{$mod->name}</a></td>";
    echo "</tr>";
}

echo "</tbody>";
echo "</table>";

echo $OUTPUT->footer();

