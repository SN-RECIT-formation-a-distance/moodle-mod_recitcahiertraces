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

import React, { Component } from 'react';
import {$glVars} from '../common/common';
import { i18n } from '../common/i18n';
import {BtnModeEdition, EditionMode} from './EditingMode';
import {TeacherNotebook, StudentNotebook} from './Notebook';

export class TeacherView extends Component {
    constructor(props) {
        super(props);

        this.onModeEditionClick = this.onModeEditionClick.bind(this);

        this.state = {modeEdition: false};
    }

    render() {       

        let main =
            <div>
                {this.state.modeEdition ? 
                    <div>
                        <BtnModeEdition variant="danger" onClick={this.onModeEditionClick} text={i18n.get_string('turnOffEditingMode')}>
                            
                        </BtnModeEdition>
                        <EditionMode/> 
                    </div>
                : 
                    <div>
                        <BtnModeEdition variant="warning" onClick={this.onModeEditionClick} text={i18n.get_string('turnOnEditingMode')}></BtnModeEdition>
                        <br/>
                        <TeacherNotebook />
                    </div>
                }
            </div>

        return (main);
    }

    onModeEditionClick(event){
      this.setState({modeEdition: !this.state.modeEdition});
    }
}

export class StudentView extends Component {
    constructor(props) {
        super(props);
    }

    render() {    
        let main = <StudentNotebook userId={$glVars.signedUser.userId}/>;

        return (main);
    }
}
