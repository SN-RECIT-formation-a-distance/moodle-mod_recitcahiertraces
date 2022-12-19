
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
import { createRoot } from 'react-dom/client';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {VisualFeedback, Loading} from "./libs/components/Components";
import Utils, {UtilsMoodle} from "./libs/utils/Utils";
import {TeacherView, StudentView} from "./views/Views";
import {$glVars} from "./common/common";
export * from "./common/i18n";
 
class App extends Component {
    static defaultProps = {
        signedUser: null
    };

    constructor(props) {
        super(props);

        this.onFeedback = this.onFeedback.bind(this);

        $glVars.signedUser = this.props.signedUser;
        $glVars.urlParams = Utils.getUrlVars();
        $glVars.urlParams.id = parseInt($glVars.urlParams.id, 10) || 0;
        $glVars.urlParams.cmId = parseInt($glVars.urlParams.cmId, 10) || 0;
        $glVars.urlParams.gId = parseInt($glVars.urlParams.gId, 10) || 0;
        $glVars.urlParams.userId = parseInt($glVars.urlParams.userId, 10) || 0;
        $glVars.urlParams.tab = parseInt($glVars.urlParams.tab, 10) || 0;
        $glVars.urlParams.userLoaded = false;
        $glVars.urlParams.activityLoaded = false;

        let mode = ($glVars.signedUser.roles.includes('t') ? 't' : 's');

        this.state = {mode: mode};
    }

    componentDidMount(){
        $glVars.feedback.addObserver("App", this.onFeedback); 
    }

    componentWillUnmount(){
        $glVars.feedback.removeObserver("App");        
    }

    render() {       
        let main =
            <div>
                <Loading webApi={$glVars.webApi}><FontAwesomeIcon icon={faSpinner} spin/></Loading>
                {this.state.mode === 't' ? <TeacherView/> : <StudentView/>}
                {$glVars.feedback.msg.map((item, index) => {  
                    return (<VisualFeedback key={index} id={index} msg={item.msg} type={item.type} title={item.title} timeout={item.timeout}/>);                                    
                })}
            </div>

        return (main);
    }

    onFeedback(){
        this.forceUpdate();
    }
}

document.addEventListener('DOMContentLoaded', function(){ 
    const domContainer = document.getElementById('recit_cahiertraces');
    const root = createRoot(domContainer);
    
    let signedUser = {
        userId: domContainer.getAttribute('data-student-id'), 
        roles: domContainer.getAttribute('data-roles').split(","), 
        portfolioUrl: (domContainer.hasAttribute('data-portfolio-url') ? domContainer.getAttribute('data-portfolio-url') : null)
    };

    root.render(<App signedUser={signedUser}/>);
}, false);


