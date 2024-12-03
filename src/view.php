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
namespace recitcahiertraces;

require_once('../../config.php');
require_once(dirname(__FILE__) . "/classes/MainView.php");
require_once(dirname(__FILE__) . "/lib.php");
require_once($CFG->libdir . '/portfoliolib.php');


$id = required_param('id', PARAM_INT);
list ($course, $cm) = get_course_and_cm_from_cmId($id, 'recitcahiertraces');

//require_course_login($course, true, $cm);
require_login();

$USER->preference['htmleditor'] = 'atto';//Force atto
recitcahiertraces_strings_for_js();

$PAGE->set_cm($cm);
$PAGE->set_url('/mod/recitcahiertraces/view.php', array('id' => $cm->id));
$PAGE->set_title($course->shortname.': '.$cm->name);

$view = new MainView($PAGE, $course, $OUTPUT, $USER, $DB, $CFG);
$view->display();
