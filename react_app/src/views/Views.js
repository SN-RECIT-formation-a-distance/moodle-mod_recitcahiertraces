import React, { Component } from 'react';
import {UtilsMoodle} from '../libs/utils/Utils';
import {$glVars} from '../common/common';
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
                        <BtnModeEdition variant="danger" onClick={this.onModeEditionClick} text={"Désactiver le mode d'édition"}>
                            
                        </BtnModeEdition>
                        <EditionMode/> 
                    </div>
                : 
                    <div>
                        <BtnModeEdition variant="warning" onClick={this.onModeEditionClick} text={"Activer le mode d'édition"}></BtnModeEdition>
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
