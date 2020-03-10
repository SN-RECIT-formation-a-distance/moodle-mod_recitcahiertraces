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

    // Add a new column notifyTeacher
    if ($oldversion < 2020022904) {
        // Define field jsoncontent to be added to filter_wiris_formulas.
        $table = new xmldb_table('recitcc_cm_notes');

        /**
         * Creates one new xmldb_field
         * @param string $name of field
         * @param int $type XMLDB_TYPE_INTEGER, XMLDB_TYPE_NUMBER, XMLDB_TYPE_CHAR, XMLDB_TYPE_TEXT, XMLDB_TYPE_BINARY
         * @param string $precision length for integers and chars, two-comma separated numbers for numbers
         * @param bool $unsigned XMLDB_UNSIGNED or null (or false)
         * @param bool $notnull XMLDB_NOTNULL or null (or false)
         * @param bool $sequence XMLDB_SEQUENCE or null (or false)
         * @param mixed $default meaningful default o null (or false)
         * @param xmldb_object $previous
         */
        $field = new xmldb_field('notifyteacher', XMLDB_TYPE_INTEGER, 4, XMLDB_UNSIGNED, XMLDB_NOTNULL, null, 0, 'teachertip');

        // Conditionally launch add field jsoncontent.
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        upgrade_plugin_savepoint(true, 2020022904, 'mod', 'recitcahiercanada');
    }

    return true;
}
