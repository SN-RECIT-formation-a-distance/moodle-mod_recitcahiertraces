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
 
require_once($CFG->libdir . '/portfolio/caller.php');
require_once($CFG->libdir . '/filelib.php');
require_once('classes/PersistCtrlCahierTraces.php');
/**
 *
 * @copyright  2019 RÉCIT
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

class recitcahiertraces_portfolio_caller extends portfolio_module_caller_base {

    protected $notes;
    /** @var int Timestamp */
    protected $start;
    /** @var int Timestamp */
    protected $end;
    /**
     * @return array
     */
    public static function expected_callbackargs() {
        return array(
            'id'    => true,
            'start' => false,
            'end'   => false,
        );
    }
    /**
     * @global object
     */
    public function load_data() {
        global $DB, $USER;

        if (!$this->cm = get_coursemodule_from_id('recitcahiertraces', $this->id)) {
            throw new portfolio_caller_exception('invalidid', 'recitcahiertraces');
        }
        
        $this->notes = CahierTracesPersistCtrl::getInstance($DB, $USER)->getPersonalNotes($this->id, $USER->id);
    }
    /**
     * @return array
     */
    public static function base_supported_formats() {
        return array(PORTFOLIO_FORMAT_PLAINHTML);
    }

    /**
     * @return bool
     */
    public function check_permissions() {
        $context = context_module::instance($this->cm->id);
        return true;
    }
    
    public function expected_time() {
        return portfolio_expected_time_db(count($this->notes));
    }
    /**
     * @return string
     */
    public function get_sha1() {
        $str = '';
        foreach($this->notes as $notes){
            $notea = current($notes);
            foreach($notes as $note){
                $str .= $notea->groupName . ',' . $note->noteTitle . ',' . $note->note->text . ',' . $note->lastUpdateFormat();
            }
        }
        return sha1($str);
    }

    public function prepare_package() {
        $content = '';
        foreach($this->notes as $notes){
            
            $notea = current($notes);
            $content .= '<div class="activity-container">';

            $content .= sprintf("<h4 class='activity-name'>%s: %s</h4>", get_string('activity', 'mod_recitcahiertraces'), $notea->activityName);

            foreach($notes as $note){
                // overflow = hidden for the notes that overflow the page dimensions
                $content .= "<div class='note-container'>";
                $content .= sprintf("<h5 class='text-muted note-title'>%s: %s</h5>",  get_string('note', 'mod_recitcahiertraces'), $note->noteTitle);
                
                $content .= sprintf("<div class='alert alert-secondary student-note'>%s</div>", $note->note->text);

                $content .= '<blockquote class="blockquote mb-0">';
                $content .= sprintf('<span class="blockquote-footer">%s: %s</span>',  get_string('timestamp', 'mod_recitcahiertraces'), $note->lastUpdateFormat());
                $content .= '</blockquote>';
                
                if(strlen($note->feedback) > 0){
                    $content .= sprintf('<div class="alert alert-primary teacher-feedback" role="alert"><strong>%s:</strong><br/>%s</div>', get_string('teacherFeedback', 'mod_recitcahiertraces'), $note->feedback);
                }
                
                $content .= "</div>";
            }
            $content .= "<hr/>";

            $content .= "</div>";
        }
        $content = preg_replace('/\<img[^>]*\>/', '', $content);

        $this->exporter->write_new_file($content, clean_filename($this->cm->name . '-cahiertraces.html'), false);
    }

    /**
     * @return string
     */
    public static function display_name() {
        return get_string('modulename', 'mod_recitcahiertraces');
    }

    /**
     * @global object
     * @return string
     */
    public function get_return_url() {
        global $CFG, $USER;

        return $CFG->wwwroot . "/mod/recitcahiertraces/classes/ReportStudentNotes.php?gId={$this->cm->id}&userId={$USER->id}&sf=1";
    }
}