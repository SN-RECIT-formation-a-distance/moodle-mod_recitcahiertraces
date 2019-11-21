<?php


defined('MOODLE_INTERNAL') || die;

function xmldb_recitcahiercanada_upgrade($oldversion) {
    global $CFG, $DB;
    $dbman = $DB->get_manager();

    /// Add a new column newcol to the mdl_myqtype_options
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

    return true;
}
