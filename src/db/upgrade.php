<?php


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
