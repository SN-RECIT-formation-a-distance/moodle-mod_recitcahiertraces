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
 
require_once($CFG->libdir . '/portfolio/caller.php');
require_once($CFG->libdir . '/filelib.php');
require_once('classes/PersistCtrl.php');

use recitcahiertraces\PersistCtrl;


class recitcahiertraces_portfolio_caller extends portfolio_module_caller_base {

    protected $noteGroups;
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
        
        $this->noteGroups = PersistCtrl::getInstance($DB, $USER)->getUserNotes($this->id, $USER->id);
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
        $time = 0;

        foreach($this->noteGroups as $noteGroup){
            foreach($noteGroup as $note){
                $time++;
            }
        }

        return portfolio_expected_time_db($time);
    }
    /**
     * @return string
     */
    public function get_sha1() {
        $str = '';
        foreach($this->noteGroups as $noteGroup){
            foreach($noteGroup as $note){
                $str .= $note->noteDef->group->name . ',' . $note->noteDef->title . ',' . $note->noteContent->text . ',' . $note->lastUpdateFormat();
            }
        }
        return sha1($str);
    }

    public function prepare_package() {
        $content = '';
        foreach($this->noteGroups as $noteGroup){
            
            $note = current($noteGroup);
            $content .= '<div class="activity-container">';

            $content .= sprintf("<h4 class='activity-name'>%s: %s</h4>", get_string('activity', 'mod_recitcahiertraces'), $note->cmName);

            foreach($noteGroup as $note){
                // overflow = hidden for the notes that overflow the page dimensions
                $content .= "<div class='note-container'>";
                $content .= sprintf("<h5 class='text-muted note-title'>%s: %s</h5>",  get_string('note', 'mod_recitcahiertraces'), $note->noteDef->title);
                
                $content .= sprintf("<div class='alert alert-secondary student-note'>%s</div>", $note->noteContent->text);

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

        return $CFG->wwwroot . "/mod/recitcahiertraces/view.php?id={$this->cm->id}";
    }
}