<?php


require('../../config.php');

$id = required_param('id', PARAM_INT); // course id

$course = $DB->get_record('course', array('id'=>$id), '*', MUST_EXIST);

require_course_login($course, true);
$PAGE->set_pagelayout('incourse');
/*
$moduleName       = get_string('modulename', 'recitcahiercanada');
$moduleNamePlural = get_string('modulenameplural', 'recitcahiercanada');
$strName         = get_string('name');
$strModuleIntro      = get_string('moduleintro');
$strLastModified = get_string('lastmodified');

$PAGE->set_url('/mod/recitcahiercanada/index.php', array('id' => $course->id));
$PAGE->set_title($course->shortname.': '.$moduleNamePlural);
$PAGE->set_heading($course->fullname);
$PAGE->navbar->add($moduleNamePlural);
echo $OUTPUT->header();
echo $OUTPUT->heading($moduleNamePlural);

if (!$modInstanceList = get_all_instances_in_course('recitcahiercanada', $course)) {
    notice(get_string('thereareno', 'moodle', $moduleNamePlural), "$CFG->wwwroot/course/view.php?id=$course->id");
    exit;
}

$usesections = course_format_uses_sections($course->format);

$table = new html_table();
$table->attributes['class'] = 'generaltable mod_index';

if ($usesections) {
    $strsectionname = get_string('sectionname', 'format_'.$course->format);
    $table->head  = array ($strsectionname, $strName, $strModuleIntro);
    $table->align = array ('center', 'left', 'left');
} else {
    $table->head  = array ($strLastModified, $strName, $strModuleIntro);
    $table->align = array ('left', 'left', 'left');
}

$modinfo = get_fast_modinfo($course);
$currentsection = '';
foreach ($modInstanceList as $instance) {
    $cm = $modinfo->cms[$instance->coursemodule];
    if ($usesections) {
        $printsection = '';
        if ($instance->section !== $currentsection) {
            if ($instance->section) {
                $printsection = get_section_name($course, $instance->section);
            }
            if ($currentsection !== '') {
                $table->data[] = 'hr';
            }
            $currentsection = $instance->section;
        }
    } else {
        $printsection = '<span class="smallinfo">'.userdate($instance->timemodified)."</span>";
    }

    $extra = empty($cm->extra) ? '' : $cm->extra;
    $icon = '';
    if (!empty($cm->icon)) {
        $icon = $OUTPUT->pix_icon($cm->icon, get_string('modulename', $cm->modname)) . ' ';
    }

    $class = $instance->visible ? '' : 'class="dimmed"'; // hidden modules are dimmed
    $table->data[] = array (
        $printsection,
        "<a $class $extra href=\"view.php?id=$cm->id\">".$icon.format_string($url->name)."</a>",
        format_module_intro('url', $instance, $cm->id));
}

echo html_writer::table($table);

echo $OUTPUT->footer();*/
