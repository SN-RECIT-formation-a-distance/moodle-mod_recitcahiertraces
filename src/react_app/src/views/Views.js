import React, { Component } from 'react';
import {ButtonGroup, Button, Form, Col, Tabs, Tab, DropdownButton, Dropdown, Modal, Collapse, Card, Row, Nav, OverlayTrigger, Popover} from 'react-bootstrap';
import {faArrowLeft, faArrowRight, faPencilAlt, faPlusCircle, faWrench, faTrashAlt, faCopy, faBars, faGripVertical, faCheckSquare, faInfo} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {ComboBox, FeedbackCtrl, DataGrid, RichEditor, InputNumber, ToggleButtons} from '../libs/components/Components';
import Utils, {UtilsMoodle, JsNx} from '../libs/utils/Utils';
import {$glVars, EditorMoodle} from '../common/common';

class BtnModeEdition extends Component{
    static defaultProps = {
        variant: "",
        text: "",
        children: null
    };

    render(){
        return <div style={{display: "flex", justifyContent: "flex-end"}}>                    
                    {this.props.children}
                    <ButtonGroup>
                        <Button variant={this.props.variant} onClick={this.props.onClick}><FontAwesomeIcon icon={faWrench}/>{" " + this.props.text}</Button>
                    </ButtonGroup>
                </div>;
    }
}

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
        const popover = (
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
          
        let main =
            <div>
                {this.state.modeEdition ? 
                    <div>
                        <BtnModeEdition variant="danger" onClick={this.onModeEditionClick} text={"Désactiver le mode d'édition"}>
                            <OverlayTrigger  placement="left" delay={{ show: 250, hide: 400 }} overlay={popover}>                                
                                <Button  variant="primary"  style={{marginRight: 3}}><FontAwesomeIcon icon={faInfo}/></Button>
                            </OverlayTrigger>
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
            let params = Utils.getUrlVars();
            $glVars.webApi.checkCCSeqPos(params.id, callback);    
        }
    }

    onModeEditionClick(event){
      this.setState({modeEdition: !this.state.modeEdition});
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

export class GroupUserSelect extends Component{
    static defaultProps = {
        onSelectUser: null
    };

    constructor(props){
        super(props);

        this.onSelectGroup = this.onSelectGroup.bind(this);
        this.onSelectUser = this.onSelectUser.bind(this);
        this.onPrevious = this.onPrevious.bind(this);
        this.onNext = this.onNext.bind(this);

        this.state = {selectedUserIndex: -1, selectedGroupId: -1, groupList:[], userList: []};
    }

    componentDidMount(){
        this.getData();
    }
    
    getData(){
        let that = this;

        let callback = function(result){
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
            
            that.setState({groupList: groupList, userList: userList});
        }

        let params = Utils.getUrlVars();
        $glVars.webApi.getEnrolledUserList(params.id, callback);
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

export class NoteForm extends Component
{
    static defaultProps = {        
        ccCmId: 0,
        ccCm: null,
        onClose: null,
    };

    constructor(props){
        super(props);

        this.onSelectTab = this.onSelectTab.bind(this);
        this.onDataChange = this.onDataChange.bind(this);
        this.getData = this.getData.bind(this);
        this.getDataResult = this.getDataResult.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onSaveResult = this.onSaveResult.bind(this);
        this.prepareNewState = this.prepareNewState.bind(this);
        this.onClose = this.onClose.bind(this);
        
        this.state = {
            data: null,  
            formValidated: false,
            dropdownLists: {
                tagList: [],
                activityList: []
            }
        };

        this.formRef = React.createRef();
        this.attoTemplateNoteRef = React.createRef();
        this.attoSuggestedNoteRef = React.createRef();
        this.attoTeacherTipRef = React.createRef();
        this.attoTemplateNote = new EditorMoodle('recitCCEditorContainer1');
        this.attoSuggestedNote = new EditorMoodle('recitCCEditorContainer2');
        this.attoTeacherTip = new EditorMoodle('recitCCEditorContainer3');
    }

    componentDidMount(){
        this.getData();             
    }  

    componentWillUnmount(){
        this.attoTemplateNote.close();
        this.attoSuggestedNote.close();
        this.attoTeacherTip.close();
    }

    render(){
        if(this.state.data === null){return null;}

        let data = this.state.data;
        let styleTab = {padding: 10};
    
        let main =
            <Modal show={true} onHide={() => this.props.onClose()} backdrop="static" size="xl" >
                <Modal.Header closeButton>
                    <Modal.Title>{`Note: ${data.noteTitle}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>                          
                    <Form noValidate validated={this.state.formValidated} ref={this.formRef}>
                        <Tabs defaultActiveKey={this.state.activeTab} id="tab" onSelect={this.onSelectTag}>
                            <Tab eventKey={0} title="Note" style={styleTab}>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>{"Activité de la section:"}</Form.Label>
                                        <ComboBox placeholder={"Sélectionnez votre option"} required={true}  name="cmId" value={data.cmId} options={this.state.dropdownLists.activityList} onChange={this.onDataChange} />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>{"Titre"}</Form.Label>
                                        <Form.Control type="text" required value={data.noteTitle} name="noteTitle" onChange={this.onDataChange}/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>{"Position"}</Form.Label>
                                        <InputNumber  value={data.slot} name="slot" min={0} onChange={this.onDataChange}/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>{"Notifier l'enseignant lors d'une mise à jour"}</Form.Label>
                                        <ToggleButtons name="notifyTeacher" defaultValue={[data.notifyTeacher]} onChange={this.onDataChange} 
                                                options={[
                                                    {value: 1, text:"Oui"},
                                                    {value: 0, text:"Non"}
                                                ]}/>
                                    </Form.Group>
                                </Form.Row>
                            </Tab>
                            <Tab eventKey={1} title="Modèle de note"  style={styleTab}>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <div ref={this.attoTemplateNoteRef}></div>
                                    </Form.Group>
                                </Form.Row>
                            </Tab>
                            <Tab eventKey={2} title="Réponse suggérée"  style={styleTab}>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <div ref={this.attoSuggestedNoteRef}></div>
                                    </Form.Group>
                                </Form.Row>
                            </Tab>
                            <Tab eventKey={3} title="Rétroaction automatique"  style={styleTab}> 
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <div ref={this.attoTeacherTipRef}></div>
                                    </Form.Group>
                                </Form.Row>
                            </Tab>
                        </Tabs>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.onClose}>{"Annuler"}</Button>
                    <Button variant="success"  onClick={this.onSubmit}>{"Enregistrer"}</Button>
                </Modal.Footer>
            </Modal>;       

        return (main);
    }
    
    onSelectTab(eventKey){
        this.setState({activeTab: eventKey});
    }

    updateAtto(instance, ref, value){
        if(ref.current !== null){
            instance.show();        
            instance.setValue(value);       
            if(!ref.current.hasChildNodes()){
                ref.current.appendChild(instance.dom);   
            }
        }
    }

    componentDidUpdate(){
        this.updateAtto(this.attoTemplateNote, this.attoTemplateNoteRef, this.state.data.templateNote);
        this.updateAtto(this.attoSuggestedNote, this.attoSuggestedNoteRef, this.state.data.suggestedNote);
        this.updateAtto(this.attoTeacherTip, this.attoTeacherTipRef, this.state.data.teacherTip);
    }

    onClose(){
        this.props.onClose();
    }

    onDataChange(event){
        let data = this.state.data;
        data[event.target.name] = event.target.value;

        // if the activity has changed then it restart the slot
        if(event.target.name === "cmId"){
            data.slot = 0;
        }
        else if(event.target.name === "notifyTeacher"){
            data[event.target.name] = data[event.target.name].pop();
        }

        this.setState({data: data})
    }

    getData(){
        if(this.props.ccCm === null){return;}
        $glVars.webApi.getCcCmNoteFormKit(this.props.ccCmId, this.props.ccCm.cmId, this.getDataResult);        
    }

    getDataResult(result){         
        if(result.success){
            this.setState(this.prepareNewState(result.data.data, {tagList: result.data.tagList, activityList: result.data.activityList}));
        }
        else{
            $glVars.feedback.showError($glVars.i18n.tags.appname, result.msg);
        }
    }

    prepareNewState(data, dropdownLists){
        data = data || null;
        dropdownLists = dropdownLists || null;
        let result = {data: null, dropdownLists: {}};
        
        if(data !== null){
            result.data = data;
        }

        if(dropdownLists !== null){
            result.dropdownLists.tagList = [];
            result.dropdownLists.activityList = [];

            for(let item of dropdownLists.tagList){
                result.dropdownLists.tagList.push({value: item.tagId, label: item.tagName, data: item});
            }

            for(let item of dropdownLists.activityList){
                result.dropdownLists.activityList.push({value: item.cmId, text: item.name});
            }
        }

        return result;
    }

    onSubmit(){
        let data = this.state.data;
        data.templateNote = this.attoTemplateNote.getValue();
        data.suggestedNote = this.attoSuggestedNote.getValue();
        data.teacherTip = this.attoTeacherTip.getValue();

        if (this.formRef.current.checkValidity() === false) {
            this.setState({formValidated: true, data:data});            
        }
        else{
            this.setState({formValidated: true, data:data}, this.onSave);
        }
    };

    onSave(){
        let data = JsNx.clone(this.state.data);
        if(data.ccCmId === 0){
            data.ccId = this.props.ccCm.ccId;
            data.cmId = this.props.ccCm.cmId;
        }
        $glVars.webApi.saveCcCmNote(data, this.onSaveResult);
    }

    onSaveResult(result){
        if(result.success){
            let that = this;
            this.setState(this.prepareNewState(result.data), () => {
                that.onClose();
            });

            $glVars.feedback.showInfo($glVars.i18n.tags.appName, $glVars.i18n.tags.msgSuccess, 3);
        }
        else{
            $glVars.feedback.showError($glVars.i18n.tags.appName, result.msg);
        }
    }
}

export class EditionMode extends Component{
    static defaultProps = {
    };

    constructor(props){
        super(props);

        this.getData = this.getData.bind(this);
        this.getData2 = this.getData2.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onCopyIC = this.onCopyIC.bind(this);
        this.onSelectCm = this.onSelectCm.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onDragRow = this.onDragRow.bind(this);
        this.onDropRow = this.onDropRow.bind(this);

        this.state = {ccCm: null, ccCmId: -1, cmList: [], cmNoteList: [], draggingItem: null };

        this.intCodeRef = React.createRef();
    }

    componentDidMount(){
        $glVars.webApi.addObserver("EditionMode", this.getData2, ['saveCcCmNote', 'removeCcCmNote']);
        this.getData();
    }

    componentWillUnmount(){
        $glVars.webApi.removeObserver("EditionMode");
    }

    getData(){
        let that = this;

        let callback = function(result){
            if(!result.success){
                FeedbackCtrl.instance.showError($glVars.i18n.appName, result.msg);
                return;
            }
            
            let cmList = [];
            for(let item of result.data){
                cmList.push({value: item.cmId, text: item.name, data: item});
            }

            that.setState({cmList: cmList});
        }

        let params = Utils.getUrlVars();
        $glVars.webApi.getSectionCmList(params.id, callback);
    }

    getData2(){
        let that = this;

        let callback = function(result){
            if(!result.success){
                $glVars.feedback.showError($glVars.i18n.tags.appName, result.msg);
                return;
            }
            
            that.setState({cmNoteList: result.data});
        }
        
        if(this.state.ccCm !== null){ 
            $glVars.webApi.getCmNotes(this.state.ccCm.cmId, callback);
        }
        else{
            this.setState({cmNoteList: []});
        }
    }

    render(){
        let selectedCmId = (this.state.ccCm !== null ? this.state.ccCm.cmId : 0);

        let main =
            <div>
                <Form>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>{"Sélectionnez l'activité de la section:"}</Form.Label>
                            <ComboBox placeholder={"Sélectionnez votre option"} value={selectedCmId.toString()} options={this.state.cmList} onChange={this.onSelectCm} />
                        </Form.Group>
                    </Form.Row>
                </Form>
                <ButtonGroup>
                    <Button variant="primary" disabled={this.state.ccCm === null} onClick={this.onAdd}><FontAwesomeIcon icon={faPlusCircle}/>{" Ajouter une nouvelle note"}</Button>                    
                </ButtonGroup>
                <br/><br/>
                <DataGrid orderBy={true}>
                    <DataGrid.Header>
                        <DataGrid.Header.Row>
                            <DataGrid.Header.Cell style={{width: 40}}></DataGrid.Header.Cell>
                            <DataGrid.Header.Cell style={{width: 80}}>{"#"}</DataGrid.Header.Cell>
                            <DataGrid.Header.Cell >{"Titre de la note"}</DataGrid.Header.Cell>
                            <DataGrid.Header.Cell style={{width: 200}}>{"Code d'intégration"}</DataGrid.Header.Cell>
                            <DataGrid.Header.Cell  style={{width: 120}}></DataGrid.Header.Cell>
                        </DataGrid.Header.Row>
                    </DataGrid.Header>
                    <DataGrid.Body>
                        {this.state.cmNoteList.map((item, index) => {                            
                                let row = 
                                    <DataGrid.Body.RowDraggable key={index} data={item} onDbClick={() => this.onEdit(item.ccCmId)} onDrag={this.onDragRow} onDrop={this.onDropRow}>
                                        <DataGrid.Body.Cell><FontAwesomeIcon icon={faGripVertical} title="Déplacer l'item"/></DataGrid.Body.Cell>
                                        <DataGrid.Body.Cell>{item.slot}</DataGrid.Body.Cell>
                                        <DataGrid.Body.Cell>{item.noteTitle}</DataGrid.Body.Cell>
                                        <DataGrid.Body.Cell>{item.intCode}</DataGrid.Body.Cell>
                                        <DataGrid.Body.Cell>
                                            <DropdownButton size="sm" title={<span><FontAwesomeIcon icon={faBars}/>{" Actions"}</span>}>
                                                <Dropdown.Item onClick={() => this.onEdit(item.ccCmId)}><FontAwesomeIcon icon={faPencilAlt}/>{" Modifier"}</Dropdown.Item>
                                                <Dropdown.Item onClick={() => this.onRemove(item.ccCmId)}><FontAwesomeIcon icon={faTrashAlt}/>{" Supprimer"}</Dropdown.Item>
                                                <Dropdown.Item onClick={() => this.onCopyIC(item.intCode)}><FontAwesomeIcon icon={faCopy}/>{" Code d'intégration"}</Dropdown.Item>
                                            </DropdownButton>
                                        </DataGrid.Body.Cell>
                                    </DataGrid.Body.RowDraggable>
                                return (row);
                            }
                        )}
                    </DataGrid.Body>
                </DataGrid>
                
                <Form.Control type="hidden" ref={this.intCodeRef}/>
                {this.state.ccCmId >= 0 && <NoteForm ccCmId={this.state.ccCmId} ccCm={this.state.ccCm} onClose={this.onClose}/>}
            </div> 

        return (main);
    }

    onDragRow(item, index){
        this.setState({draggingItem: item});
    }

    onDropRow(item, index){
        let that = this;
        let callback = function(result){
            if(result.success){
                that.getData2();
            }
            else{
                $glVars.feedback.showError($glVars.i18n.tags.appName, result.msg);
            }
        }
        $glVars.webApi.switchCcCmNoteSlot(this.state.draggingItem.ccCmId, item.ccCmId, callback);
    }

    onAdd(){
        this.setState({ccCmId: 0});
    }

    onEdit(ccCmId){
        this.setState({ccCmId: ccCmId});
    }
    
    onRemove(ccCmId){
        let callback = function(result){
            if(result.success){
                $glVars.feedback.showInfo($glVars.i18n.tags.appName, $glVars.i18n.tags.msgSuccess, 3);
            }
            else{
                $glVars.feedback.showError($glVars.i18n.tags.appName, result.msg);
            }
        }

        if(window.confirm($glVars.i18n.tags.msgConfirmDeletion)){
            $glVars.webApi.removeCcCmNote(ccCmId, callback);
        }
    }

    getIntegrationCode(intCode){
        return `{"intCode":"${intCode}", "nbLines": "15"}`;
    }

    onCopyIC(intCode){
        this.intCodeRef.current.value = this.getIntegrationCode(intCode);
        this.intCodeRef.current.type = "text";
        this.intCodeRef.current.select()
		document.execCommand('copy');
		this.intCodeRef.current.type = "hidden";
    }

    onSelectCm(event){
        this.setState({ccCm: event.target.data}, this.getData2);
    }

    onClose(){
        this.setState({ccCmId: -1});
    }
}

export class PersonalNote extends Component{
    static defaultProps = {        
        userId: 0,
        cmId: 0,
        ccCmId: 0,
        noteTitle: "",
        onClose: null,
    };

    constructor(props){
        super(props);

        this.onDataChange = this.onDataChange.bind(this);
        this.getData = this.getData.bind(this);
        this.getDataResult = this.getDataResult.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onSaveResult = this.onSaveResult.bind(this);
        this.prepareNewState = this.prepareNewState.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onCollapse = this.onCollapse.bind(this);
        
        let mode = "";// it is a student?
         if(UtilsMoodle.checkRoles($glVars.signedUser.roles, UtilsMoodle.rolesL3)){
             mode = "s";
        }
        // it is a teacher
        else if(UtilsMoodle.checkRoles($glVars.signedUser.roles, UtilsMoodle.rolesL2)){
            mode = "t";
        }
        this.state = {data: null, dropdownLists: null, mode: mode, collapse: {note: true, suggestedNote: false, feedback: true}};

        this.attoRef = React.createRef();
        this.atto = new EditorMoodle('recitCCEditorContainer1');
    }

    componentDidMount(){
        this.getData();             
    }  

    componentWillUnmount(){
        this.atto.close();
    }

    getData(){
        $glVars.webApi.getPersonalNote(this.props.ccCmId, this.props.cmId, this.props.userId, this.getDataResult);        
    }

    getDataResult(result){         
        if(result.success){
            this.setState(this.prepareNewState(result.data, null));
        }
        else{
            $glVars.feedback.showError($glVars.i18n.tags.appname, result.msg);
        }
    }

    prepareNewState(data, dropdownLists){
        data = data || null;
        dropdownLists = dropdownLists || null;
        let result = {data: null, dropdownLists: {}};
        
        if(data !== null){
            result.data = data;
        }

        return result;
    }

    render(){
        if(this.state.data === null){return null;}

        let data = this.state.data;
        let student = null;
        let teacher = null;
        let suggestedNote = null;
        let styleText = {minHeight: 50, maxHeight: 400, overflowY: "auto", border: "1px solid #ddd", backgroundColor: "#fafafa", padding: 10};

        // it is a student?
        if(this.state.mode === "s"){
            this.atto.setValue(data.note.text);       
            student = <div ref={this.attoRef}></div>;
            teacher = <div style={styleText} dangerouslySetInnerHTML={{__html: data.feedback}}></div>;
        }
        // it is a teacher
        else if(this.state.mode === "t"){
            this.atto.setValue(data.feedback);       
            teacher = <div ref={this.attoRef}></div>;
            student =  <div style={styleText} dangerouslySetInnerHTML={{__html: data.note.text}}></div>;
            suggestedNote = <div style={styleText} dangerouslySetInnerHTML={{__html: data.suggestedNote}}></div>;
        }
        else{
            console.log(this.state);
            return null;
        }
        let styleHeader = {cursor: "pointer"};
        
        let main =
            <Modal show={true} onHide={() => this.props.onClose()} backdrop="static" size="xl" >
                <Modal.Header closeButton>
                    <Modal.Title>{`Note: ${this.props.noteTitle}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>      
                    <Card>
                        <Card.Header style={styleHeader} onClick={() => this.onCollapse("note")}>
                            {"Note de l'élève"}
                        </Card.Header>
                        <Collapse in={this.state.collapse.note}>
                            <Card.Body>{student}</Card.Body>
                        </Collapse>
                    </Card>
                    <br/>
                    {suggestedNote !== null &&
                        <div>
                            <Card>
                                <Card.Header style={styleHeader} onClick={() => this.onCollapse("suggestedNote")}>
                                    {"Réponse suggérée"}
                                </Card.Header>
                                <Collapse in={this.state.collapse.suggestedNote}>
                                    <Card.Body>{suggestedNote}</Card.Body>
                                </Collapse>
                            </Card>
                            <br/>
                        </div>
                    }
                    <Card>
                        <Card.Header style={styleHeader} onClick={() => this.onCollapse("feedback")}>{"Rétroaction de l'enseignant"}</Card.Header>
                        <Collapse in={this.state.collapse.feedback}>
                            <Card.Body>{teacher}</Card.Body>
                        </Collapse>
                    </Card>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.onClose}>{"Annuler"}</Button>
                    <Button variant="success"  onClick={this.onSave}>{"Enregistrer"}</Button>
                </Modal.Footer>
            </Modal>;       

        return (main);
    }

    componentDidUpdate(){
        if(this.attoRef.current !== null){
            this.atto.show();        
            if(!this.attoRef.current.hasChildNodes()){
                this.attoRef.current.appendChild(this.atto.dom);   
            }
        }
    }
    
    onCollapse(name){
        let data = this.state.collapse;
        data[name] = !data[name];
        this.setState({collapse: data});
    }

    onClose(){
        this.props.onClose();
    }

    onDataChange(event){
        let data = this.state.data;
        data[event.target.name] = event.target.value;
        this.setState({data: data})
    }   

    onSave(){
        let data = JsNx.clone(this.state.data);
        if(this.state.mode === "s"){
            data.note.text = this.atto.getValue();
        }
        // it is a teacher
        else if(this.state.mode === "t"){
            data.feedback = this.atto.getValue();
        }        

        data.userId = this.props.userId;
        
        $glVars.webApi.savePersonalNote(data, this.state.mode, this.onSaveResult);
    }

    onSaveResult(result){
        if(result.success){
            let that = this;
            this.setState(this.prepareNewState(result.data), () => {
                that.onClose();
            });

            $glVars.feedback.showInfo($glVars.i18n.tags.appName, $glVars.i18n.tags.msgSuccess, 3);
        }
        else{
            $glVars.feedback.showError($glVars.i18n.tags.appName, result.msg);
        }
    }
}

export class Notebook extends Component{
    static defaultProps = {
        userId: 0
    };

    constructor(props){
        super(props);

        this.onSelectTab = this.onSelectTab.bind(this);
        this.getData = this.getData.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onClose = this.onClose.bind(this);

        let params = Utils.getUrlVars();
        this.state = {dataProvider: [], activeTab: 0, personalNote: null, cmId: params.id};
    }
    
    componentDidMount(){
        $glVars.webApi.addObserver("Notebook", this.getData, ['savePersonalNote']);        
        this.getData();
    }

    componentWillUnmount(){
        $glVars.webApi.removeObserver("Notebook");
    }

    componentDidUpdate(prevProps) {
        if(isNaN(prevProps.userId)){ return;}

        // Typical usage (don't forget to compare props):
        if (this.props.userId !== prevProps.userId) {
            this.getData();
        }
    }

    getData(){
        let that = this;

        let callback = function(result){
            if(!result.success){
                FeedbackCtrl.instance.showError($glVars.i18n.appName, result.msg);
                return;
            }
            
            that.setState({dataProvider: result.data});
        }

        if(this.props.userId === 0){
            this.setState({dataProvider: []});
            return;
        }

        $glVars.webApi.getPersonalNotes(this.state.cmId, this.props.userId, callback);
    }

    getPrintLink(showFeedback){
        return UtilsMoodle.wwwRoot()+`/mod/recitcahiercanada/classes/ReportStudentNotes.php?cmId=${this.state.cmId}&userId=${this.props.userId}&sf=${showFeedback || 0}`;
    }

    render(){
        if(this.state.dataProvider.length === 0){ return null;}

        let that = this;
        let main = 
            <div>  
                <div style={{textAlign: "right", marginBottom: "1rem"}}>
                    <a href={this.getPrintLink()} target="_blank">{"Imprimer des notes"}</a>{ " | "}
                    <a href={this.getPrintLink(1)} target="_blank">{"Imprimer des notes + Rétroaction"}</a>
                </div>

                <Tab.Container id="tabActivities" activeKey={this.state.activeTab} onSelect={this.onSelectTab}>
                    <Row>
                        <Col sm={12}>
                            <Nav variant="pills" className="flex-row">
                                {this.state.dataProvider.map(function(items, index){
                                    return <Nav.Item key={index} style={{flexGrow: 1}}><Nav.Link eventKey={index}>{JsNx.at(items, 0).activityName}</Nav.Link></Nav.Item>;
                                })}
                            </Nav>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <Tab.Content>
                                {this.state.dataProvider.map(function(items, index){
                                    let datagrid = 
                                    <DataGrid orderBy={true}>
                                        <DataGrid.Header>
                                            <DataGrid.Header.Row>
                                                <DataGrid.Header.Cell style={{width: 80}}>{"#"}</DataGrid.Header.Cell>
                                                <DataGrid.Header.Cell >{"Titre de la note"}</DataGrid.Header.Cell>
                                                <DataGrid.Header.Cell style={{width: 110}}>{"Élève"}</DataGrid.Header.Cell>
                                                <DataGrid.Header.Cell style={{width: 140}}>{"Enseignant"}</DataGrid.Header.Cell>
                                                <DataGrid.Header.Cell  style={{width: 120}}></DataGrid.Header.Cell>
                                            </DataGrid.Header.Row>
                                        </DataGrid.Header>
                                        <DataGrid.Body>
                                            {items.map((item, index2) => {
                                                    let row = 
                                                        <DataGrid.Body.Row key={index2} onDbClick={() => that.onEdit(item)}>
                                                            <DataGrid.Body.Cell>{index2 + 1}</DataGrid.Body.Cell>
                                                            <DataGrid.Body.Cell>{item.noteTitle}</DataGrid.Body.Cell>
                                                            <DataGrid.Body.Cell alert={(item.note.length > 0 ? 'success' : 'warning')} style={{textAlign: "center"}}>
                                                                {(item.note.length > 0 ? <FontAwesomeIcon icon={faCheckSquare}/> : null)}
                                                            </DataGrid.Body.Cell>
                                                            <DataGrid.Body.Cell alert={(item.feedback.length > 0 ? 'success' : 'warning')}  style={{textAlign: "center"}}>
                                                                {(item.feedback.length > 0 ? <FontAwesomeIcon icon={faCheckSquare}/> : null)}
                                                            </DataGrid.Body.Cell>
                                                            <DataGrid.Body.Cell>
                                                                <DropdownButton size="sm" title={<span><FontAwesomeIcon icon={faBars}/>{" Actions"}</span>}>
                                                                    <Dropdown.Item onClick={() => that.onEdit(item)}><FontAwesomeIcon icon={faPencilAlt}/>{" Modifier"}</Dropdown.Item>
                                                                </DropdownButton>
                                                            </DataGrid.Body.Cell>
                                                        </DataGrid.Body.Row>
                                                    return (row);                                    
                                                }
                                            )}
                                        </DataGrid.Body>
                                    </DataGrid>
                                    return <Tab.Pane key={index} eventKey={index}>{datagrid}</Tab.Pane>;
                                })}
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
                
                {this.state.personalNote !== null && 
                            <PersonalNote userId={this.props.userId} personalNoteId={this.state.personalNote.personalNoteId} cmId={this.state.personalNote.cmId} onClose={this.onClose}
                                    noteTitle={this.state.personalNote.noteTitle} ccCmId={this.state.personalNote.ccCmId} />}
            </div>;

        return (main);
    }

    onEdit(item){
        this.setState({personalNote: item});
    }

    onClose(){
        this.setState({personalNote: null});
    }

    onSelectTab(eventKey){
        this.setState({activeTab: eventKey});
    }
}