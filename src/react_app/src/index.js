import React, { Component } from 'react';
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {faSync} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {VisualFeedback, Loading} from "./libs/components/Components";
import {UtilsMoodle} from "./libs/utils/Utils";
import {TeacherView, StudentView} from "./views/Views";
import {$glVars, AttoEditor} from "./common/common";
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

        let mode = (UtilsMoodle.checkRoles($glVars.signedUser.roles, UtilsMoodle.rolesL2) ? 't' : 's');

        this.state = {mode: mode};
    }

    componentDidMount(){
        $glVars.feedback.addObserver("App", this.onFeedback); 
        //$glVars.editorMoodle = new EditorMoodle(); // be sure that the Atto Editor is already loaded
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
                <Loading webApi={$glVars.webApi}><FontAwesomeIcon icon={faSync} spin/></Loading>
            </div>

        return (main);
    }

    onFeedback(){
        this.forceUpdate();
    }
}
/*
let atto1 = new AttoEditor();


let atto2 = new AttoEditor();

window.setTimeout(function(){
    atto1.setValue("gus");
    atto2.setValue("kaw");
}, 1000);*/


document.addEventListener('DOMContentLoaded', function(){ 
    const domContainer = document.getElementById('recit_cahiertraces');
    let signedUser = {userId: domContainer.getAttribute('data-student-id'), roles: domContainer.getAttribute('data-roles').split(",")};
    ReactDOM.render(<App signedUser={signedUser}/>, domContainer);
	document.body.style.backgroundColor = 'transparent';
}, false);


