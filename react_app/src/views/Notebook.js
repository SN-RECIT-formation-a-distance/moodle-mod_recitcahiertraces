import React, { Component } from 'react';
import { ButtonGroup, Form, Button, Col, Tab, DropdownButton, Dropdown, Collapse, Card, Row, Nav} from 'react-bootstrap';
import {faArrowLeft, faArrowRight, faPencilAlt, faBars, faEye, faPrint} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {FeedbackCtrl, DataGrid, ComboBox, Modal} from '../libs/components/Components';
import {UtilsMoodle, JsNx} from '../libs/utils/Utils';
import {$glVars} from '../common/common';

class PersonalNoteForm extends Component{
    static defaultProps = {        
        userId: 0,
        cmId: 0,
        ccCmId: 0,
        setOnSave: null,
    };

    constructor(props){
        super(props);

        this.onDataChange = this.onDataChange.bind(this);
        this.getData = this.getData.bind(this);
        this.getDataResult = this.getDataResult.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onSaveResult = this.onSaveResult.bind(this);
        this.prepareNewState = this.prepareNewState.bind(this);
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

        this.editorRef = React.createRef();
        this.editorDec = new recit.components.EditorDecorator(`recit_cahiertraces_editor_container_1`);

        this.props.setOnSave(this.onSave);
    }

    componentDidMount(){
        this.getData();     
    }  

    componentWillUnmount(){
        this.editorDec.close();
        this.editorDec.dom.style.display = 'none';
        document.body.appendChild(this.editorDec.dom);
    }

    componentDidUpdate(prevProps){
        if(this.editorRef.current !== null){
            this.editorDec.show();        
            
            if(!this.editorRef.current.hasChildNodes()){
                this.editorRef.current.appendChild(this.editorDec.dom);   
            }
        }

        if(prevProps.userId !== this.props.userId){
            this.getData();
        }
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
            this.editorDec.setValue(data.note.text);       
            student = <div ref={this.editorRef}></div>;
            teacher = <div style={styleText} dangerouslySetInnerHTML={{__html: data.feedback}}></div>;
        }
        // it is a teacher
        else if(this.state.mode === "t"){
            this.editorDec.setValue(data.feedback);       
            teacher = <div ref={this.editorRef}></div>;
            student =  <div style={styleText} dangerouslySetInnerHTML={{__html: data.note.text}}></div>;
            suggestedNote = <div style={styleText} dangerouslySetInnerHTML={{__html: data.suggestedNote}}></div>;
        }
        else{
            console.log(this.state);
            return null;
        }
        let styleHeader = {cursor: "pointer"};
        
        let main =
            <div>
                <h5 className="text-truncate">{`Note: ${this.state.data.noteTitle}`}</h5>
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
            </div>;       

        return (main);
    }
   
    onCollapse(name){
        let data = this.state.collapse;
        data[name] = !data[name];

        let tmp = this.onEditorDataChange();

        this.setState({collapse: data, data: tmp.data});
    }

    onDataChange(event){
        let data = this.state.data;
        data[event.target.name] = event.target.value;
        this.setState({data: data})
    }
    
    onEditorDataChange(){
        let data = JsNx.clone(this.state.data);
        let flags = {mode: this.state.mode, teacherFeedbackUpdated: 0};

        if(this.state.mode === "s"){
            data.note.text = this.editorDec.getValue().text;
        }
        // it is a teacher
        else if(this.state.mode === "t"){
            let tmp = this.editorDec.getValue().text;
            flags.teacherFeedbackUpdated = (tmp !== data.feedback ? 1 : 0);
            data.feedback = tmp;
        }        

        data.userId = this.props.userId;

        return {data: data, flags: flags};
    }

    onSave(callback){
        let tmp = this.onEditorDataChange();
        
        $glVars.webApi.savePersonalNote(tmp.data, tmp.flags, (result) => this.onSaveResult(result, callback));
    }

    onSaveResult(result, callback){
        if(result.success){
            this.setState(this.prepareNewState(result.data), () => {
                callback(result);
            });

            $glVars.feedback.showInfo($glVars.i18n.tags.appName, $glVars.i18n.tags.msgSuccess, 3);
        }
        else{
            $glVars.feedback.showError($glVars.i18n.tags.appName, result.msg);
        }
    }
}

class ModalPersonalNote extends Component{
    static defaultProps = {        
        data: {},
        onClose: null,
        onPreviousStudent: null,
        onNextStudent: null,
        navStatus: {previous: false, next: false},
        modalTitle: ""
    };

    constructor(props){
        super(props);

        this.onSave = this.onSave.bind(this);
        this.setOnSave = this.setOnSave.bind(this);
        this.onClose = this.onClose.bind(this);

        this.state = {onSave: null};
    }

    render(){
        let personalNote = <PersonalNoteForm userId={this.props.data.userId} cmId={this.props.data.cmId} setOnSave={this.setOnSave} ccCmId={this.props.data.ccCmId}/>;
        let footer = 
            <div className="btn-tollbar" style={{width: "100%", display: "flex", justifyContent: "space-between"}}>
                <div className="btn-group">
                    {this.props.onNextStudent && <Button variant="primary" onClick={this.props.onPreviousStudent} disabled={!this.props.navStatus.previous}><FontAwesomeIcon icon={faArrowLeft}/>{" " + $glVars.i18n.tags.previousStudent}</Button>}
                    {this.props.onPreviousStudent && <Button variant="primary"  onClick={this.props.onNextStudent} disabled={!this.props.navStatus.next}>{$glVars.i18n.tags.nextStudent + " "}<FontAwesomeIcon icon={faArrowRight}/></Button>}
                </div>
                <div className="btn-group">
                    <Button  variant="secondary" onClick={this.onClose}>{"Annuler"}</Button>
                    {this.props.onNextStudent && <Button  variant="success"  onClick={() => this.onSave(false)}>{"Enregistrer"}</Button>}
                    <Button  variant="success"  onClick={() => this.onSave(true)}>{"Enregistrer et fermer"}</Button>
                </div>
            </div>;
                
        let main = <Modal title={this.props.modalTitle} body={personalNote} footer={footer} onClose={this.props.onClose} />;

        return (main);
    }

    setOnSave(onSave){
        this.setState({onSave: onSave})
    }

    onSave(shouldClose){
        let that = this;

        if(this.state.onSave){
            this.state.onSave((result) => {
                if(result.success){
                    if(shouldClose){
                        that.onClose();
                    }
                }
            });
        }
    }

    onClose(){
        this.props.onClose();
    }
}

class NavActivities extends Component{
    static defaultProps = {
        dataProvider: [],
        onEdit: null
    };

    constructor(props){
        super(props);

        this.onSelectTab = this.onSelectTab.bind(this);

        this.state = {
            activeTab: 0, 
        };
    }

    render(){
        let that = this;

        let main = 
            <Tab.Container id="tabActivities" activeKey={this.state.activeTab} onSelect={this.onSelectTab}>
                <Row>
                    <Col sm={12}>
                        <Nav variant="pills" className="flex-row">
                            {this.props.dataProvider.map(function(items, index){
                                let activityName = JsNx.at(items, 0).activityName;
                                return  <Nav.Item key={index} >
                                            <Nav.Link eventKey={index} className="text-truncate" style={{width: '290px', textAlign: "center"}} title={activityName}>
                                                {activityName}
                                            </Nav.Link>
                                        </Nav.Item>;
                            })}
                        </Nav>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col sm={12}>
                        <Tab.Content>
                            {this.props.dataProvider.map(function(items, index){
                                let datagrid = 
                                <DataGrid orderBy={true}>
                                    <DataGrid.Header>
                                        <DataGrid.Header.Row>
                                            <DataGrid.Header.Cell style={{width: 80}}>{"#"}</DataGrid.Header.Cell>
                                            <DataGrid.Header.Cell >{"Titre de la note"}</DataGrid.Header.Cell>
                                            <DataGrid.Header.Cell style={{width: 300}}>{"Note"}</DataGrid.Header.Cell>
                                            <DataGrid.Header.Cell style={{width: 300}}>{"Rétroaction"}</DataGrid.Header.Cell>
                                            <DataGrid.Header.Cell  style={{width: 120}}></DataGrid.Header.Cell>
                                        </DataGrid.Header.Row>
                                    </DataGrid.Header>
                                    <DataGrid.Body>
                                        {items.map((item, index2) => {
                                                let row = 
                                                    <DataGrid.Body.Row key={index2} onDbClick={() => that.props.onEdit(item)}>
                                                        <DataGrid.Body.Cell>{index2 + 1}</DataGrid.Body.Cell>
                                                        <DataGrid.Body.Cell><FontAwesomeIcon icon={faEye}/>{` ${item.noteTitle}`}</DataGrid.Body.Cell>
                                                        <DataGrid.Body.Cell>{that.formatText(item.note.text)}</DataGrid.Body.Cell>
                                                        <DataGrid.Body.Cell>{that.formatText(item.feedback)}</DataGrid.Body.Cell>
                                                        <DataGrid.Body.Cell>
                                                            <DropdownButton size="sm" title={<span><FontAwesomeIcon icon={faBars}/>{" Actions"}</span>}>
                                                                <Dropdown.Item onClick={() => that.props.onEdit(item)}><FontAwesomeIcon icon={faPencilAlt}/>{" Modifier"}</Dropdown.Item>
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
            </Tab.Container>;

        return main;
    }
    
    formatText(text){
        let tmp = document.createElement("div");
        tmp.innerHTML = text;
        
        text = tmp.textContent || tmp.innerText || ""; // Retrieve the text property of the element (cross-browser support)

        return (text.length > 50 ? `${text.substr(0, 50)}...` : text);
    }
    
    onSelectTab(eventKey){
        this.setState({activeTab: eventKey});
    }
}

class Notebook extends Component{
    static defaultProps = {
    };

    constructor(props){
        super(props);

        this.getData = this.getData.bind(this);
        this.getDataResult = this.getDataResult.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onClose = this.onClose.bind(this);

        this.state = {
            dataProvider: [], 
            data: {
                userId: 0,
                username: "",
                cmId: 0,
                noteTitle: "",
                ccCmId: 0
            }
        };
    }
    
    componentDidMount(){
        $glVars.webApi.addObserver("Notebook", this.getData, ['savePersonalNote']);        
        this.getData();
    }

    componentWillUnmount(){
        $glVars.webApi.removeObserver("Notebook");
    }

    getData(){
        if(this.state.data.userId === 0){
            this.setState({dataProvider: []});
            return;
        }
        
        $glVars.webApi.getPersonalNotes($glVars.urlParams.id, this.state.data.userId, this.getDataResult);
    }

    getDataResult(result){
        if(!result.success){
            FeedbackCtrl.instance.showError($glVars.i18n.appName, result.msg);
            return;
        }

        // If the user is trying to load automatically some note by URL
        if(!$glVars.urlParams.loaded){
            let item = null;
            for(let activity of result.data){
                for(let note of activity){
                    if((note.ccCmId === $glVars.urlParams.ccCmId) && (note.cmId === $glVars.urlParams.cmId)){
                        item = note;
                    }
                }
            }

            $glVars.urlParams.loaded = true;

            this.setState({dataProvider: result.data}, () => this.onEdit(item));
        }
        else{
            this.setState({dataProvider: result.data});
        }
    }
    
    render(){
        return (null);
    }

    onEdit(item){
        if(item === null){ return; }

        let data = this.state.data;
        data.cmId = item.cmId;
        data.ccCmId = item.ccCmId;
        data.noteTitle = item.noteTitle;
        this.setState({data: data});
    }

    onClose(){
        let data = this.state.data;
        data.cmId = 0;
        data.ccCmId = 0;
        data.noteTitle = "";
        this.setState({data: data});
    }
}

export class TeacherNotebook extends Notebook{
    constructor(props){
        super(props);

        this.onSelectUser = this.onSelectUser.bind(this);
        this.onNextStudent = this.onNextStudent.bind(this);
        this.onPreviousStudent = this.onPreviousStudent.bind(this);

        this.groupUserSelect = React.createRef();
    }
    
    render(){
        let main = 
            <div>  
                <GroupUserSelect ref={this.groupUserSelect} onSelectUser={this.onSelectUser}/>

                {this.state.data.userId > 0 &&
                    <div>
                        <hr/>
                        <ActionBar cmId={$glVars.urlParams.id} userId={this.state.data.userId}/>
                        <hr/>
                        <NavActivities dataProvider={this.state.dataProvider} onEdit={this.onEdit}/>
                    
                        {this.state.data.ccCmId > 0 && 
                                <ModalPersonalNote modalTitle={`Élève: ${this.state.data.username}`} data={this.state.data} onClose={this.onClose} onNextStudent={this.onNextStudent} 
                                        onPreviousStudent={this.onPreviousStudent} navStatus={this.getNavStatus()}/>}
                    </div>
                }
            </div>;

        return (main);
    }

    onSelectUser(userId, username){
        console.log(userId, username)
        let data = this.state.data;
        data.userId = userId;
        data.username = username;
        this.setState({data: data}, this.getData);
    }

    onNextStudent(){
        this.groupUserSelect.current.onNext();
    }

    onPreviousStudent(){
        this.groupUserSelect.current.onPrevious();
    }

    getNavStatus(){
        if(this.groupUserSelect.current){
            return this.groupUserSelect.current.getNavStatus();
        }
    }
}

export class StudentNotebook extends Notebook{
    static defaultProps = {
        userId: 0
    };

    constructor(props){
        super(props);

        this.state = {
            dataProvider: [], 
            activeTab: 0, 
            data: {
                userId: this.props.userId,
                username: "",
                cmId: 0,
                noteTitle: "",
                ccCmId: 0
            }
        };
    }
    
    render(){
        let main = 
            <div>  
                {this.state.data.userId > 0 &&
                    <div>
                        <ActionBar cmId={$glVars.urlParams.id} userId={this.state.data.userId}/>

                        <hr/>

                        <NavActivities dataProvider={this.state.dataProvider} onEdit={this.onEdit}/>
                    
                        {this.state.data.ccCmId > 0 && 
                                <ModalPersonalNote modalTitle={`Cahier de traces - Note personnelle`} data={this.state.data} onClose={this.onClose} />}
                    </div>
                }
            </div>;

        return (main);
    }
}

class ActionBar extends Component{
    static defaultProps = {
        cmId: 0,
        userId: 0
    };

    render(){
        let main = 
            <div style={{marginBottom: "1rem"}}>
                <a href={this.getPrintLink(1)} target="_blank"><FontAwesomeIcon icon={faPrint}/>{" Imprimer des notes"}</a>
            </div>;

//<a href={this.getPrintLink(1)} target="_blank">{"Imprimer des notes + Rétroaction"}</a>

        return main;
    }

    getPrintLink(showFeedback){
        return UtilsMoodle.wwwRoot()+`/mod/recitcahiercanada/classes/ReportStudentNotes.php?cmId=${this.props.cmId}&userId=${this.props.userId}&sf=${showFeedback || 0}`;
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

        this.state = {selectedUserIndex: -1, selectedGroupId: -1, groupList:[], userList: [], userListFiltered: []};
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
            let item = JsNx.getItem(userList, 'value', $glVars.urlParams.userId, null);

            this.setState(
                {groupList: groupList, userList: userList, userListFiltered: userList, selectedUserIndex: JsNx.getItemIndex(userList, 'value', $glVars.urlParams.userId)}, 
                (item === null ? null : () => this.props.onSelectUser(parseInt(item.value, 10), item.text))
            );
        }
        else{
            this.setState({groupList: groupList, userList: userList});
        }
    }

    render(){
        let value = "";
        //if(userList.nxExists(this.state.selectedUserIndex)){
            
        if(JsNx.exists(this.state.userListFiltered, this.state.selectedUserIndex)){
            value = this.state.userListFiltered[this.state.selectedUserIndex].value;
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
                        <ComboBox placeholder={"Sélectionnez votre option"} options={this.state.userListFiltered} onChange={this.onSelectUser} value={value}/>
                    </Form.Group>
                </Form.Row>
                <ButtonGroup style={{textAlign: "center", display: "block"}}>
                    <Button variant="primary" onClick={this.onPrevious} disabled={(this.state.selectedUserIndex <= -1)}><FontAwesomeIcon icon={faArrowLeft}/>{" " + $glVars.i18n.tags.previousStudent}</Button>
                    <Button variant="primary" onClick={this.onNext} disabled={(this.state.userListFiltered.length <= (this.state.selectedUserIndex + 1))}>{$glVars.i18n.tags.nextStudent + " "}<FontAwesomeIcon icon={faArrowRight}/></Button>
                </ButtonGroup>
            </Form>;

        return (main);
    }

    onSelectGroup(event){
        let userListFiltered = this.state.userList;
        let selectedGroupId = this.state.selectedGroupId;

        if(selectedGroupId > 0){
            userListFiltered = this.state.userList.filter(function(item){
                return (item.data.groupId.toString() === selectedGroupId.toString());
            })
        }


        this.setState({selectedGroupId: event.target.value, selectedUserIndex: -1, userListFiltered: userListFiltered});
    }

    onSelectUser(event){
        let userId = parseInt(event.target.value, 10) || 0;
        this.setState({selectedUserIndex: event.target.index}, () => 
            this.props.onSelectUser(this.state.userListFiltered[event.target.index].value, this.state.userListFiltered[event.target.index].text)
        );
    }

    onPrevious(){
        let newIndex = this.state.selectedUserIndex - 1;
        let item = {text: "", value: 0};

        if(this.state.userListFiltered[newIndex]){
            item.text = this.state.userListFiltered[newIndex].text;
            item.value = parseInt(this.state.userListFiltered[newIndex].value, 10);
        }

        this.setState({selectedUserIndex: newIndex}, this.props.onSelectUser(item.value, item.text));
    }

    onNext(){
        let newIndex = this.state.selectedUserIndex + 1;
        
        let item = {text: "", value: 0};

        if(this.state.userListFiltered[newIndex]){
            item.text = this.state.userListFiltered[newIndex].text;
            item.value = parseInt(this.state.userListFiltered[newIndex].value, 10);
        }

        this.setState({selectedUserIndex: newIndex}, this.props.onSelectUser(item.value, item.text));
    }

    getNavStatus(){
        return {previous: !(this.state.selectedUserIndex <= -1), next: !(this.state.userListFiltered.length <= (this.state.selectedUserIndex + 1))};
    }
}