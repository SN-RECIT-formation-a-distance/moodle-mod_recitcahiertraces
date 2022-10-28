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


defined('MOODLE_INTERNAL') || die;

function xmldb_recitcahiertraces_upgrade($oldversion) {
    global $CFG, $DB;
    $dbman = $DB->get_manager();

    $newversion = 2022020901;
    if ($oldversion < $newversion) {
        $table = new xmldb_table('recitct_groups');
        $field = new xmldb_field('slot', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, 0);

        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

           upgrade_plugin_savepoint(true, $newversion, 'mod', 'recitcahiertraces');
    }

    return true;
}
