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
defined('MOODLE_INTERNAL') || die();

$plugin->version   = 2024071802;        // The current module version (Date: YYYYMMDDXX)
$plugin->requires  = 2022041912.00; // Moodle 4.0
$plugin->component = 'mod_recitcahiertraces';        // Full name of the plugin (used for diagnostics)
$plugin->release = 'v2.4.1-stable'; 
$plugin->supported = [401, 405];      
$plugin->maturity = MATURITY_STABLE; // MATURITY_ALPHA, MATURITY_BETA, MATURITY_RC or MATURITY_STABLE
