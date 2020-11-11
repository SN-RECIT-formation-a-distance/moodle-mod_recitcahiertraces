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

    componentDidMount(){
        this.checkCCSeqPos();
    }

    componentWillUnmount(){
        this.checkCCSeqPos();
    }

    render() {       
       /* const popover = (
            <Popover id="popover-basic">
              <Popover.Title as="h3">Code d'intégration</Popover.Title>
              <Popover.Content>
              Voici des variables extras pour le code d'intégration:<br/><br/>
              <strong>color:</strong> code hexadécimal de la couleur du titre de la note<br/>
              <strong>btnSaveVariant:</strong> style de bouton Bootstrap<br/>
            <strong>btnResetVariant:</strong> style de bouton Bootstrap
              </Popover.Content>
            </Popover>
          );
          
            <OverlayTrigger  placement="left" delay={{ show: 250, hide: 400 }} overlay={popover}>                                
                <Button  variant="primary"  style={{marginRight: 3}}><FontAwesomeIcon icon={faInfo}/></Button>
            </OverlayTrigger>*/

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

    checkCCSeqPos(){
        if(UtilsMoodle.checkRoles($glVars.signedUser.roles, UtilsMoodle.rolesL2)){
            let callback = function(result){
                if((result.success) && (!result.data)){
                    $glVars.feedback.showError($glVars.i18n.tags.appName, $glVars.i18n.tags.msgCCSeqPos);
                }
            }
            $glVars.webApi.checkCCSeqPos($glVars.urlParams.id, callback);    
        }
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
