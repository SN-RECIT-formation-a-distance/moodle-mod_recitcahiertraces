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
namespace recitcahiertraces;

require_once($CFG->libdir . '/portfolio/caller.php');
require_once($CFG->libdir . '/filelib.php');
require_once(dirname(__FILE__) . '/PersistCtrl.php');
require_once(dirname(__FILE__) . "/recitcommon/Utils.php");

use moodle_url;

class MainView
{
    protected $viewMode = null;
    protected $data = null;

    protected $page = null;
    protected $course = null;
    protected $output = null;
    protected $user = null;
    protected $db = null;
    protected $cfg = null;

 //   protected $editorOption = "1"; // 1 = atto, 2 = recit editor

    public function __construct($page, $course, $output, $user, $db, $cfg){
        $this->page = $page;
        $this->course = $course;
        $this->output = $output;
        $this->user = $user;
        $this->db = $db;
        $this->cfg = $cfg;
    }

    public function display(){
        $this->page->set_pagelayout('incourse');       
        $this->page->set_heading($this->course->fullname);
        $this->page->requires->css(new moodle_url('./react/build/index.css'), true);
        $this->page->requires->js(new moodle_url('./react/build/index.js'), true);

        echo $this->output->header();
                        
        $roles = Utils::getUserRoles($this->course->id, $this->user->id);
        $studentId = (in_array('t', $roles) ? 0 : $this->user->id);
        $portfolioUrl = $this->getPortfolioUrl();
        
        echo $this->getEditorOption("recit_cahiertraces_editor", 1);        
        echo $this->getEditorOption("recit_cahiertraces_editor", 2);
        echo $this->getEditorOption("recit_cahiertraces_editor", 3);

        echo sprintf("<div id='recit_cahiertraces' data-student-id='%ld' data-roles='%s' %s></div>", $studentId, implode(",", $roles), $portfolioUrl);
        
        echo $this->output->footer();
    }

    protected function getEditorOption($name, $index){
        $context = \context_course::instance($this->course->id);

        /*if($this->editorOption == "2"){
            return "<div id='{$name}_container_{$index}' data-format='recit_rich_editor' style='display: none;'></div>";
        }
        else{*/
            return Utils::createEditorHtml(false, "{$name}_container_{$index}", "{$name}_{$index}", "", 15, $context, 0, 0);
        //}
    }

    protected function getPortfolioUrl(){
        // not working for now because currently it only exports the portfolio of the connected user
        // it is missing to pass as a parameter the user id of the selected user
        return '';

        /*
        global $CFG;
         
        if (empty($CFG->enableportfolios)){
            return '';
        }
        
        $button = new \portfolio_add_button();
        $button->set_callback_options('recitcahiertraces_portfolio_caller', array('id' => $this->cm->id), 'mod_recitcahiertraces');
        return sprintf('data-portfolio-url="%s"', $button->to_html(PORTFOLIO_ADD_MOODLE_URL));
        */
    }
}
