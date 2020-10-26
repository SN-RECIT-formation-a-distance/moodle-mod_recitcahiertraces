import React, { Component } from 'react';
import { Button, Col, Tab, DropdownButton, Dropdown, Modal, Collapse, Card, Row, Nav} from 'react-bootstrap';
import {faPencilAlt, faBars, faEye} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {FeedbackCtrl, DataGrid} from '../libs/components/Components';
import {UtilsMoodle, JsNx} from '../libs/utils/Utils';
import {$glVars} from '../common/common';

class PersonalNoteForm extends Component{
    static defaultProps = {        
        userId: 0,
        cmId: 0,
        ccCmId: 0,
        noteTitle: "",
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

    componentDidUpdate(){
        if(this.editorRef.current !== null){
            this.editorDec.show();        
            if(!this.editorRef.current.hasChildNodes()){
                this.editorRef.current.appendChild(this.editorDec.dom);   
            }
        }
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

/**
 * Ce modal est nécessaire, car le Bootstrap Modal ne marche pas avec les menus déroulants de Atto
 */
class ModalTmp extends Component{
    static defaultProps = {        
        header: null,
        body: null,
        footer: null,
        onClose: null
    };

    render(){
        let main = 
            <div style={{position: "fixed", top: 0, backgroundColor: "rgba(0,0,0,0.5)", left: 0, bottom: 0, right: 0, zIndex: 1040, overflowX: 'hidden', overflowY: 'auto'}}>
                <div style={{width: "75%", margin: "1.75rem auto", backgroundColor: "#FFF"}}>
                    <div className="modal-header">
                        <h4 className="text-truncate">{this.props.header}</h4>
                        <button type="button" className="close" onClick={this.props.onClose}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button>
                    </div>
                    <div className="modal-body">{this.props.body}</div>
                    <div className="modal-footer">{this.props.footer}</div>
                </div>
            </div>;

        return main;
    }
}

class ModalPersonalNote extends Component{
    static defaultProps = {        
        userId: 0,
        cmId: 0,
        ccCmId: 0,
        noteTitle: "",
        onClose: null,
    };

    constructor(props){
        super(props);

        this.onSave = this.onSave.bind(this);
        this.setOnSave = this.setOnSave.bind(this);
        this.onClose = this.onClose.bind(this);

        this.state = {onSave: null};
    }

    render(){
        let personalNote = <PersonalNoteForm userId={this.props.userId} cmId={this.props.cmId} setOnSave={this.setOnSave}
                                                    noteTitle={this.props.noteTitle} ccCmId={this.props.ccCmId}/>;
        let footer = 
            <div className="btn-tollbar" style={{width: "100%", display: "flex", justifyContent: "space-between"}}>
                <div className="btn-group">
                    <Button  variant="secondary" onClick={this.onClose}>{"Annuler"}</Button>
                    <Button  variant="success"  onClick={this.onSave}>{"Enregistrer"}</Button>
                </div>
            </div>;
                
        let main = <ModalTmp header={`Note: ${this.props.noteTitle}`} body={personalNote} footer={footer} onClose={this.props.onClose} />;

        return (main);
    }

    setOnSave(onSave){
        this.setState({onSave: onSave})
    }

    onSave(){
        let that = this;

        if(this.state.onSave){
            this.state.onSave((result) => {
                if(result.success){
                    that.onClose();
                }
            });
        }
    }

    onClose(){
        this.props.onClose();
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
        this.getDataResult = this.getDataResult.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onClose = this.onClose.bind(this);

        this.state = {dataProvider: [], activeTab: 0, personalNote: null, cmId: $glVars.urlParams.id};
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
        if(this.props.userId === 0){
            this.setState({dataProvider: []});
            return;
        }
        
        $glVars.webApi.getPersonalNotes(this.state.cmId, this.props.userId, this.getDataResult);
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

                <hr/>

                <Tab.Container id="tabActivities" activeKey={this.state.activeTab} onSelect={this.onSelectTab}>
                    <Row>
                        <Col sm={12}>
                            <Nav variant="pills" className="flex-row">
                                {this.state.dataProvider.map(function(items, index){
                                    return <Nav.Item key={index} ><Nav.Link eventKey={index}>{JsNx.at(items, 0).activityName}</Nav.Link></Nav.Item>;
                                })}
                            </Nav>
                        </Col>
                    </Row>
                    <br/>
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
                                                <DataGrid.Header.Cell style={{width: 300}}>{"Note"}</DataGrid.Header.Cell>
                                                <DataGrid.Header.Cell style={{width: 300}}>{"Rétroaction"}</DataGrid.Header.Cell>
                                                <DataGrid.Header.Cell  style={{width: 120}}></DataGrid.Header.Cell>
                                            </DataGrid.Header.Row>
                                        </DataGrid.Header>
                                        <DataGrid.Body>
                                            {items.map((item, index2) => {
                                                    let row = 
                                                        <DataGrid.Body.Row key={index2} onDbClick={() => that.onEdit(item)}>
                                                            <DataGrid.Body.Cell>{index2 + 1}</DataGrid.Body.Cell>
                                                            <DataGrid.Body.Cell><FontAwesomeIcon icon={faEye}/>{` ${item.noteTitle}`}</DataGrid.Body.Cell>
                                                            <DataGrid.Body.Cell>{that.formatText(item.note.text)}</DataGrid.Body.Cell>
                                                            <DataGrid.Body.Cell>{that.formatText(item.feedback)}</DataGrid.Body.Cell>
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
                            <ModalPersonalNote userId={this.props.userId} cmId={this.state.personalNote.cmId} onClose={this.onClose}
                                    noteTitle={this.state.personalNote.noteTitle} ccCmId={this.state.personalNote.ccCmId} />}
            </div>;

        return (main);
    }

    formatText(text){
        let tmp = document.createElement("div");
        tmp.innerHTML = text;
        
        text = tmp.textContent || tmp.innerText || ""; // Retrieve the text property of the element (cross-browser support)

        return (text.length > 50 ? `${text.substr(0, 50)}...` : text);
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