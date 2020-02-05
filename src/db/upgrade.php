<?php


defined('MOODLE_INTERNAL') || die;

function xmldb_recitcahiercanada_upgrade($oldversion) {
    global $CFG, $DB;
    $dbman = $DB->get_manager();

    /// Add a new columns suggestednote and teachertip
    if ($oldversion < 2019111301) {
           // Define field jsoncontent to be added to filter_wiris_formulas.
           $table = new xmldb_table('recitcc_cm_notes');
           $field = new xmldb_field('suggestednote', XMLDB_TYPE_TEXT, null, null, null, null, null, 'templatenote');
   
           // Conditionally launch add field jsoncontent.
           if (!$dbman->field_exists($table, $field)) {
               $dbman->add_field($table, $field);
           }

           $field = new xmldb_field('teachertip', XMLDB_TYPE_TEXT, null, null, null, null, null, 'suggestednote');
   
           // Conditionally launch add field jsoncontent.
           if (!$dbman->field_exists($table, $field)) {
               $dbman->add_field($table, $field);
           }

           upgrade_plugin_savepoint(true, 2019111301, 'mod', 'recitcahiercanada');
    }

     /// Add a new column intcode
     if ($oldversion < 2019120300) {
        // Define field jsoncontent to be added to filter_wiris_formulas.
        $table = new xmldb_table('recitcc_cm_notes');

        $field = new xmldb_field('intcode', XMLDB_TYPE_CHAR, 255, null, null, null, null, 'id');

        // Conditionally launch add field jsoncontent.
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        //$table->add_index('uid', XMLDB_INDEX_UNIQUE, ['uid']);

        upgrade_plugin_savepoint(true, 2019120300, 'mod', 'recitcahiercanada');
    }

    // Add a new column inputtype et uid 
    if ($oldversion < 2020020100) {
        // Define field jsoncontent to be added to filter_wiris_formulas.
        $table = new xmldb_table('recitcc_user_notes');

        $field = new xmldb_field('note_itemid', XMLDB_TYPE_CHAR, 25, null, null, null, null, 'note');

        // Conditionally launch add field jsoncontent.
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        //$table->add_index('uid', XMLDB_INDEX_UNIQUE, ['uid']);

        upgrade_plugin_savepoint(true, 2020020100, 'mod', 'recitcahiercanada');
    }

    return true;
}
