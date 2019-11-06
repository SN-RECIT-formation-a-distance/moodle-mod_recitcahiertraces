import React, { Component } from 'react';
import {ButtonGroup, Button, Form, Col, Tabs, Tab, DropdownButton, Dropdown, Modal} from 'react-bootstrap';
import {faArrowLeft, faArrowRight, faPencilAlt, faPlusCircle, faWrench, faTrashAlt, faCopy, faBars, faGripVertical, faSquare, faCheckSquare} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {ComboBox, FeedbackCtrl, DataGrid} from '../libs/components/Components';
import Utils,{ UtilsMoodle} from '../libs/utils/Utils';
import {$glVars} from '../common/common';

class BtnModeEdition extends Component{
    static defaultProps = {
        variant: "",
        text: ""
    };

    render(){
        return <ButtonGroup style={{textAlign: "right", display: "block"}}><Button variant={this.props.variant} onClick={this.props.onClick}><FontAwesomeIcon icon={faWrench}/>{" " + this.props.text}</Button></ButtonGroup>;
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
        let main =
            <div>
                {this.state.modeEdition ? 
                    <div>
                        <BtnModeEdition variant="danger" onClick={this.onModeEditionClick} text={"Désactiver le mode d'édition"}></BtnModeEdition>
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
            let params = recit.utils.getUrlVars();
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
                    userList.push({text: user.userName, value: user.userId, data: user});
                }
            }

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
        if(userList.nxExists(this.state.selectedUserIndex)){
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
        this.setState({selectedUserIndex: event.target.index}, () => this.props.onSelectUser(parseInt(event.target.value, 10)));
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
                tagList: []
            }
        };

        this.editorRef = React.createRef();
        this.formRef = React.createRef();
    }

    componentDidMount(){
        this.getData();             
    }  

    componentWillUnmount(){
        $glVars.editorMoodle.close();
    }

    render(){
        if(this.state.data === null){return null;}

        let data = this.state.data;
    
        let main =
            <Modal show={true} onHide={() => this.props.onClose()} backdrop="static" size="xl" >
                <Modal.Header closeButton>
                    <Modal.Title>{`Note: ${data.noteTitle}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>      
                    <Form noValidate validated={this.state.formValidated} ref={this.formRef}>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>{"Titre"}</Form.Label>
                                <Form.Control type="text" required value={data.noteTitle} name="noteTitle" onChange={this.onDataChange}/>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>{"Modèle de note"}</Form.Label>
                                <div ref={this.editorRef}></div>
                            </Form.Group>
                        </Form.Row>
                        
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.onClose}>{"Annuler"}</Button>
                    <Button variant="success"  onClick={this.onSubmit}>{"Enregistrer"}</Button>
                </Modal.Footer>
            </Modal>;       
/*<Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>{"Tags"}</Form.Label>
                                <Form.Control type="text" value={data.tags} name="tags" onChange={this.onDataChange}/>
                            </Form.Group>
                        </Form.Row>*/
        return (main);
    }
    
    componentDidUpdate(){
        if(this.editorRef.current !== null){
            $glVars.editorMoodle.show();        
            $glVars.editorMoodle.setValue(this.state.data.templateNote);       
            if(!this.editorRef.current.hasChildNodes()){
                this.editorRef.current.appendChild($glVars.editorMoodle.dom);   
            }
        }
    }

    onClose(){
        this.props.onClose();
    }

    onDataChange(event){
        let data = this.state.data;
        data[event.target.name] = event.target.value;
        this.setState({data: data})
    }

    getData(){
        if(this.props.ccCm === null){return;}
        $glVars.webApi.getCcCmNoteFormKit(this.props.ccCmId, this.props.ccCm.cmId, this.getDataResult);        
    }

    getDataResult(result){         
        if(result.success){
            this.setState(this.prepareNewState(result.data.data, {tagList: result.data.tagList}));
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

            for(let item of dropdownLists.tagList){
                result.dropdownLists.tagList.push({value: item.tagId, label: item.tagName, data: item});
            }
        }

        return result;
    }

    onSubmit(){
        let data = this.state.data;
        data.templateNote = $glVars.editorMoodle.getValue();

        if (this.formRef.current.checkValidity() === false) {
            this.setState({formValidated: true, data:data});            
        }
        else{
            this.setState({formValidated: true, data:data}, this.onSave);
        }
    };

    onSave(){
        let data = this.state.data.nxClone();
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

        this.state = {ccCm: null, ccCmId: -1, cmList: [], cmNoteList: [] };

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
                <DataGrid orderBy={false}>
                    <DataGrid.Header>
                        <DataGrid.Header.Row>
                            <DataGrid.Header.Cell style={{width: 80}}>{"#"}</DataGrid.Header.Cell>
                            <DataGrid.Header.Cell >{"Titre de la note"}</DataGrid.Header.Cell>
                            <DataGrid.Header.Cell  style={{width: 80}}></DataGrid.Header.Cell>
                        </DataGrid.Header.Row>
                    </DataGrid.Header>
                    <DataGrid.Body>
                        {this.state.cmNoteList.map((item, index) => {                            
                                let row = 
                                    <DataGrid.Body.Row key={index} onDbClick={() => this.onEdit(item.ccCmId)}>
                                        
                                        <DataGrid.Body.Cell>{index + 1}</DataGrid.Body.Cell>
                                        <DataGrid.Body.Cell>{item.noteTitle}</DataGrid.Body.Cell>
                                        <DataGrid.Body.Cell>
                                            <DropdownButton size="sm" title={<span><FontAwesomeIcon icon={faBars}/>{" Actions"}</span>}>
                                                <Dropdown.Item onClick={() => this.onEdit(item.ccCmId)}><FontAwesomeIcon icon={faPencilAlt}/>{" Modifier"}</Dropdown.Item>
                                                <Dropdown.Item onClick={() => this.onRemove(item.ccCmId)}><FontAwesomeIcon icon={faTrashAlt}/>{" Supprimer"}</Dropdown.Item>
                                                <Dropdown.Item onClick={() => this.onCopyIC(item.ccCmId)}><FontAwesomeIcon icon={faCopy}/>{" Code d'intégration"}</Dropdown.Item>
                                            </DropdownButton>
                                        </DataGrid.Body.Cell>
                                    </DataGrid.Body.Row>
                                return (row);                                    
                            }
                        )}
                    </DataGrid.Body>
                </DataGrid>
                <Form.Control type="hidden" ref={this.intCodeRef}/>
                {this.state.ccCmId >= 0 && <NoteForm ccCmId={this.state.ccCmId} ccCm={this.state.ccCm} onClose={this.onClose}/>}
            </div> 
            //<DataGrid.Body.Cell><FontAwesomeIcon icon={faGripVertical} title="Déplacer l'item"/></DataGrid.Body.Cell>
        return (main);
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

    onCopyIC(ccCmId){
        let intCode = `{"cccmid":"${ccCmId}", "nbLines": "15"}`;
        this.intCodeRef.current.value = intCode;
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
        
        let mode = "";// it is a student?
         if(UtilsMoodle.checkRoles($glVars.signedUser.roles, UtilsMoodle.rolesL3)){
             mode = "s";
        }
        // it is a teacher
        else if(UtilsMoodle.checkRoles($glVars.signedUser.roles, UtilsMoodle.rolesL2)){
            mode = "t";
        }
        this.state = {data: null, dropdownLists: null, mode: mode};

        this.editorRef = React.createRef();
    }

    componentDidMount(){
        this.getData();             
    }  

    componentWillUnmount(){
        $glVars.editorMoodle.close();
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
        let styleText = {height: 300, overflowY: "auto", border: "1px solid #333", backgroundColor: "#fafafa", padding: 10};

        // it is a student?
        if(this.state.mode === "s"){
            $glVars.editorMoodle.setValue(data.note);       
            student = <div ref={this.editorRef}></div>;
            teacher =  <div style={styleText} dangerouslySetInnerHTML={{__html: data.feedback}}></div>;
        }
        // it is a teacher
        else if(this.state.mode === "t"){
            $glVars.editorMoodle.setValue(data.feedback);       
            teacher = <div ref={this.editorRef}></div>;
            student =  <div style={styleText} dangerouslySetInnerHTML={{__html: data.note}}></div>;
        }
        else{
            console.log(this.state);
            return null;
        }

        let styleRow = {maxHeight: 500, overflowY: "auto"};
        let main =
            <Modal show={true} onHide={() => this.props.onClose()} backdrop="static" size="xl" >
                <Modal.Header closeButton>
                    <Modal.Title>{`Note: ${this.props.noteTitle}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>      
                    <Form>
                        <Form.Row style={styleRow}>
                            <Form.Group as={Col}>
                                <Form.Label>{"Note de l'élève"}</Form.Label>
                                {student}
                            </Form.Group>
                        </Form.Row>
                        <Form.Row style={styleRow}>
                            <Form.Group as={Col}>
                                <Form.Label>{"Rétroaction de l'enseignant"}</Form.Label>
                                {teacher}
                            </Form.Group>
                        </Form.Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.onClose}>{"Annuler"}</Button>
                    <Button variant="success"  onClick={this.onSave}>{"Enregistrer"}</Button>
                </Modal.Footer>
            </Modal>;       

        return (main);
    }

    componentDidUpdate(){
        if(this.editorRef.current !== null){
            $glVars.editorMoodle.show();        
            if(!this.editorRef.current.hasChildNodes()){
                this.editorRef.current.appendChild($glVars.editorMoodle.dom);   
            }
        }
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
        let data = this.state.data.nxClone();
        if(this.state.mode === "s"){
            data.note = $glVars.editorMoodle.getValue();
        }
        // it is a teacher
        else if(this.state.mode === "t"){
            data.feedback = $glVars.editorMoodle.getValue();
        }        
        
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

        this.state = {dataProvider: [], activeTab: 0, personalNote: null};
    }
    
    componentDidMount(){
        $glVars.webApi.addObserver("Notebook", this.getData, ['savePersonalNote']);
        this.getData();
    }

    componentWillUnmount(){
        $glVars.webApi.removeObserver("Notebook");
    }

    componentDidUpdate(prevProps) {
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

        let params = Utils.getUrlVars();
        $glVars.webApi.getPersonalNotes(params.id, this.props.userId, callback);
    }

    render(){
        let that = this;

        let main = 
            <div>  
                <Tabs id="tabActivities" activeKey={this.state.activeTab} onSelect={this.onSelectTab}>
                    {this.state.dataProvider.map(function(items, index){
                        let result = 
                            <Tab key={index} eventKey={index} title={items.nxAt(0).activityName}>
                                <DataGrid orderBy={false}>
                                    <DataGrid.Header>
                                        <DataGrid.Header.Row>
                                            <DataGrid.Header.Cell style={{width: 80}}>{"#"}</DataGrid.Header.Cell>
                                            <DataGrid.Header.Cell >{"Titre de la note"}</DataGrid.Header.Cell>
                                            <DataGrid.Header.Cell style={{width: 80}}>{"Élève"}</DataGrid.Header.Cell>
                                            <DataGrid.Header.Cell style={{width: 80}}>{"Enseignant"}</DataGrid.Header.Cell>
                                            <DataGrid.Header.Cell  style={{width: 80}}></DataGrid.Header.Cell>
                                        </DataGrid.Header.Row>
                                    </DataGrid.Header>
                                    <DataGrid.Body>
                                        {items.map((item, index) => {
                                                let row = 
                                                    <DataGrid.Body.Row key={index} onDbClick={() => that.onEdit(item)}>
                                                        <DataGrid.Body.Cell>{index + 1}</DataGrid.Body.Cell>
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
                            </Tab>;
                        return result;
                    })}
                </Tabs>
                
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