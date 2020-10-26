import React, { Component } from 'react';
import {ButtonGroup, Button, Form, Col,} from 'react-bootstrap';
import {faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {ComboBox, FeedbackCtrl} from '../libs/components/Components';
import {UtilsMoodle, JsNx} from '../libs/utils/Utils';
import {$glVars} from '../common/common';
import {BtnModeEdition, EditionMode} from './EditingMode';
import {Notebook} from './Notebook';

export class TeacherView extends Component {
    constructor(props) {
        super(props);

        this.onModeEditionClick = this.onModeEditionClick.bind(this);
        this.onSelectUser = this.onSelectUser.bind(this);

        this.state = {modeEdition: false, selectedUserId: 0};
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
                        <GroupUserSelect onSelectUser={this.onSelectUser}/>
                        <Notebook userId={this.state.selectedUserId}/>
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
      this.setState({modeEdition: !this.state.modeEdition, selectedUserId: 0});
    }

    onSelectUser(userId){
        this.setState({selectedUserId: userId});
    }
}

export class StudentView extends Component {
    constructor(props) {
        super(props);
    }

    render() {       
        let main = <Notebook userId={$glVars.signedUser.userId}/>;

        return (main);
    }
}

class GroupUserSelect extends Component{
    static defaultProps = {
        onSelectUser: null
    };

    constructor(props){
        super(props);

        this.onSelectGroup = this.onSelectGroup.bind(this);
        this.onSelectUser = this.onSelectUser.bind(this);
        this.onPrevious = this.onPrevious.bind(this);
        this.onNext = this.onNext.bind(this);
        this.getData = this.getData.bind(this);
        this.getDataResult = this.getDataResult.bind(this);

        this.state = {selectedUserIndex: -1, selectedGroupId: -1, groupList:[], userList: []};
    }

    componentDidMount(){
        this.getData();
    }
    
    getData(){
        $glVars.webApi.getEnrolledUserList($glVars.urlParams.id, this.getDataResult);
    }

    getDataResult(result){
        if(!result.success){
            FeedbackCtrl.instance.showError($glVars.i18n.appName, result.msg);
            return;
        }
        
        let groupList = [];
        let userList = [];
        for(let group of result.data){
            groupList.push({text: group[0].groupName, value: group[0].groupId, data: group});
            for(let user of group){
                if(JsNx.getItem(userList, "value", user.userId, null) === null){
                    userList.push({text: user.userName, value: user.userId, data: user});
                }
            }
        }

        groupList.sort((a, b) => { return ('' + a.text).localeCompare(b.text);})
        userList.sort((a, b) => { return ('' + a.text).localeCompare(b.text);})

        if(!$glVars.urlParams.loaded){
            this.setState(
                {groupList: groupList, userList: userList, selectedUserIndex: JsNx.getItemIndex(userList, 'value', $glVars.urlParams.userId)}, 
                () => this.props.onSelectUser($glVars.urlParams.userId)
            );
        }
        else{
            this.setState({groupList: groupList, userList: userList});
        }
    }

    render(){
        let userList = this.state.userList;
        let selectedGroupId = this.state.selectedGroupId;

        if(selectedGroupId > 0){
            userList = this.state.userList.filter(function(item){
                return (item.data.groupId.toString() === selectedGroupId.toString());
            })
        }

        let value = "";
        //if(userList.nxExists(this.state.selectedUserIndex)){
            
        if(JsNx.exists(userList, this.state.selectedUserIndex)){
            value = userList[this.state.selectedUserIndex].value;
        }

        let main = 
            <Form>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Sélectionnez le groupe:</Form.Label>
                        <ComboBox placeholder={"Sélectionnez votre option"} options={this.state.groupList} onChange={this.onSelectGroup} value={this.state.selectedGroupId}/>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group  as={Col}>
                        <Form.Label>Sélectionnez l'utilisateur:</Form.Label>
                        <ComboBox placeholder={"Sélectionnez votre option"} options={userList} onChange={this.onSelectUser} value={value}/>
                    </Form.Group>
                </Form.Row>
                <ButtonGroup style={{textAlign: "center", display: "block"}}>
                    <Button variant="primary" onClick={() => this.onPrevious(userList)} disabled={(this.state.selectedUserIndex <= -1)}><FontAwesomeIcon icon={faArrowLeft}/>{" Précédent"}</Button>
                    <Button variant="primary" onClick={() => this.onNext(userList)} disabled={(userList.length <= (this.state.selectedUserIndex + 1))}>{"Suivant "}<FontAwesomeIcon icon={faArrowRight}/></Button>
                </ButtonGroup>
            </Form>;

        return (main);
    }

    onSelectGroup(event){
        this.setState({selectedGroupId: event.target.value, selectedUserIndex: -1});
    }

    onSelectUser(event){
        let userId = parseInt(event.target.value, 10) || 0;
        this.setState({selectedUserIndex: event.target.index}, () => this.props.onSelectUser(userId));
    }

    onPrevious(userList){
        let newIndex = this.state.selectedUserIndex - 1;
        let value = (newIndex < 0 ? 0 : userList[newIndex].value);
        this.setState({selectedUserIndex: newIndex}, this.props.onSelectUser(parseInt(value, 10)));
    }

    onNext(userList){
        let newIndex = this.state.selectedUserIndex + 1;
        let value = userList[newIndex].value;
        this.setState({selectedUserIndex: newIndex}, this.props.onSelectUser(parseInt(value, 10)));
    }

}
