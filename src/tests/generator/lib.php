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



defined('MOODLE_INTERNAL') || die();


class mod_recitcahiertraces_generator extends testing_module_generator {

    public function create_instance($record = null, array $options = null) {
        global $CFG;
        require_once($CFG->dirroot . '/lib/resourcelib.php');

        $record = (object)(array)$record;

        if (!isset($record->content)) {
            $record->content = 'Test cahiertraces';
        }
        if (!isset($record->contentformat)) {
            $record->contentformat = FORMAT_MOODLE;
        }
        if (!isset($record->display)) {
            $record->display = RESOURCELIB_DISPLAY_AUTO;
        }
        if (!isset($record->printheading)) {
            $record->printheading = 1;
        }
        if (!isset($record->printintro)) {
            $record->printintro = 0;
        }
        if (!isset($record->printlastmodified)) {
            $record->printlastmodified = 1;
        }

        return parent::create_instance($record, (array)$options);
    }
}
