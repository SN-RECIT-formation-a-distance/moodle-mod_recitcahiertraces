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
namespace recitcahiertraces;

require_once('../../config.php');
require_once(dirname(__FILE__) . "/classes/MainView.php");
require_once(dirname(__FILE__) . "/lib.php");

// For this type of page this is the course id.
$id = required_param('id', PARAM_INT);

$course = $DB->get_record('course', array('id' => $id), '*', MUST_EXIST);

require_login($course);

$USER->preference['htmleditor'] = 'atto';//Force atto
recitcahiertraces_strings_for_js();

$PAGE->set_url('/mod/recitcahiertraces/index.php', array('id' => $id));
$PAGE->set_title($course->shortname);

$view = new MainView($PAGE, $course, $OUTPUT, $USER, $DB, $CFG);
$view->display();
