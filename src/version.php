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

$plugin->version   = 2022020901;        // The current module version (Date: YYYYMMDDXX)
$plugin->requires  = 2020061500.00; // Moodle 3.9.0
$plugin->component = 'mod_recitcahiertraces';        // Full name of the plugin (used for diagnostics)
$plugin->cron      = 0;
$plugin->dependencies = [    
    'local_recitcommon' => 2022020900
];
$plugin->release = 'v2.0.1'; 
$plugin->maturity = MATURITY_ALPHA; // MATURITY_ALPHA, MATURITY_BETA, MATURITY_RC or MATURITY_STABLE
