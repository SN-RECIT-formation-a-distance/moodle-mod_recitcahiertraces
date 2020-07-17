import React, { Component } from 'react';
import ReactDOM from "react-dom";
/**************************************************************************************
 *  il ne faut pas charger le bootstrap de base car il est déjà chargé dans le thème
 * //import 'bootstrap/dist/css/bootstrap.min.css';  
 **************************************************************************************/ 
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {VisualFeedback, Loading} from "./libs/components/Components";
import Utils, {UtilsMoodle} from "./libs/utils/Utils";
import {TeacherView, StudentView} from "./views/Views";
import {$glVars} from "./common/common";
//import "./libs/utils/JsExtension";
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
        $glVars.urlParams.ccCmId = parseInt($glVars.urlParams.ccCmId, 10) || 0;
        $glVars.urlParams.cmId = parseInt($glVars.urlParams.cmId, 10) || 0;
        $glVars.urlParams.userId = parseInt($glVars.urlParams.userId, 10) || 0;

        let mode = (UtilsMoodle.checkRoles($glVars.signedUser.roles, UtilsMoodle.rolesL2) ? 't' : 's');

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
                {this.state.mode  === 't' ? <TeacherView/> : <StudentView/>}
                {$glVars.feedback.msg.map((item, index) => {  
                    return (<VisualFeedback key={index} id={index} msg={item.msg} type={item.type} title={item.title} timeout={item.timeout}/>);                                    
                })}
                <Loading webApi={$glVars.webApi}><FontAwesomeIcon icon={faSpinner} spin/></Loading>
            </div>

        return (main);
    }

    onFeedback(){
        this.forceUpdate();
    }
}

document.addEventListener('DOMContentLoaded', function(){ 
    const domContainer = document.getElementById('recit_cahiertraces');
    let signedUser = {userId: domContainer.getAttribute('data-student-id'), roles: domContainer.getAttribute('data-roles').split(",")};
    ReactDOM.render(<App signedUser={signedUser}/>, domContainer);
//	document.body.style.backgroundColor = 'transparent';
}, false);


