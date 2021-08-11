
import React, { Component } from 'react';
import {ButtonGroup, Button, Form, Col, Tabs, Tab, DropdownButton, Dropdown} from 'react-bootstrap';
import {faPencilAlt, faPlusCircle, faWrench, faTrashAlt, faCopy, faBars, faPrint, faGripVertical, faFileImport} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {ComboBox, FeedbackCtrl, DataGrid, InputNumber, ToggleButtons, Modal} from '../libs/components/Components';
import {JsNx, UtilsMoodle} from '../libs/utils/Utils';
import {$glVars} from '../common/common';

export class BtnModeEdition extends Component{
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

class NoteForm extends Component
{
    static defaultProps = {        
        nid: 0,
        ccgroup: null,
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
                groupList: []
            }
        };

        this.formRef = React.createRef();
        this.editorTemplateNoteRef = React.createRef();
        this.editorSuggestedNoteRef = React.createRef();
        this.editorTeacherTipRef = React.createRef();
        this.editorTemplateNote = new recit.components.EditorDecorator('recit_cahiertraces_editor_container_1');
        this.editorSuggestedNote = new recit.components.EditorDecorator('recit_cahiertraces_editor_container_2');
        this.editorTeacherTip = new recit.components.EditorDecorator('recit_cahiertraces_editor_container_3');
    }

    componentDidMount(){
        this.getData();             
    }  

    componentWillUnmount(){
        this.editorTemplateNote.close();
        this.editorSuggestedNote.close();
        this.editorTeacherTip.close();

        this.editorTemplateNote.dom.style.display = 'none';
        this.editorSuggestedNote.dom.style.display = 'none';
        this.editorTeacherTip.dom.style.display = 'none';

        document.body.appendChild(this.editorTemplateNote.dom);
        document.body.appendChild(this.editorSuggestedNote.dom);
        document.body.appendChild(this.editorTeacherTip.dom);
    }

    render(){
        if(this.state.data === null){return null;}

        let data = this.state.data;
        let styleTab = {padding: 10};
    
        let body = 
            <Form noValidate validated={this.state.formValidated} ref={this.formRef}>
                <Tabs defaultActiveKey={this.state.activeTab} id="tab" onSelect={this.onSelectTag}>
                    <Tab eventKey={0} title="Note" style={styleTab}>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>{"Groupe de notes:"}</Form.Label>
                                <ComboBox placeholder={"Sélectionnez votre option"} required={true}  name="gId" value={data.gId} options={this.state.dropdownLists.groupList} onChange={this.onDataChange} />
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
                                <div ref={this.editorTemplateNoteRef}></div>
                            </Form.Group>
                        </Form.Row>
                    </Tab>
                    <Tab eventKey={2} title="Réponse suggérée"  style={styleTab}>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <div ref={this.editorSuggestedNoteRef}></div>
                            </Form.Group>
                        </Form.Row>
                    </Tab>
                    <Tab eventKey={3} title="Pistes pour valider ta réponse"  style={styleTab}> 
                        <Form.Row>
                            <Form.Group as={Col}>
                                <div ref={this.editorTeacherTipRef}></div>
                            </Form.Group>
                        </Form.Row>
                    </Tab>
                </Tabs>
            </Form>;

        let footer = 
            <div className="btn-tollbar" style={{width: "100%", display: "flex", justifyContent: "flex-end"}}>
                <div className="btn-group">
                    <Button  variant="secondary" onClick={this.onClose}>{"Annuler"}</Button>
                    <Button  variant="success"  onClick={this.onSubmit}>{"Enregistrer"}</Button>
                </div>
            </div>;

        let main = <Modal title={`Note: ${data.noteTitle}`} body={body} footer={footer} onClose={this.props.onClose} />;

        return (main);
    }
    
    onSelectTab(eventKey){
        this.setState({activeTab: eventKey});
    }

    updateEditor(instance, ref, value){
        if(ref.current !== null){
            instance.show();        
            instance.setValue(value);       
            if(!ref.current.hasChildNodes()){
                ref.current.appendChild(instance.dom);   
            }
        }
    }

    componentDidUpdate(){
        this.updateEditor(this.editorTemplateNote, this.editorTemplateNoteRef, this.state.data.templateNote);
        this.updateEditor(this.editorSuggestedNote, this.editorSuggestedNoteRef, this.state.data.suggestedNote);
        this.updateEditor(this.editorTeacherTip, this.editorTeacherTipRef, this.state.data.teacherTip);
    }

    onClose(){
        this.props.onClose();
    }

    onDataChange(event){
        let data = this.state.data;
        data[event.target.name] = event.target.value;

        // if the group has changed then it restart the slot
        if(event.target.name === "gId"){
            data.slot = 0;
        }
        else if(event.target.name === "notifyTeacher"){
            data[event.target.name] = data[event.target.name].pop();
        }

        this.setState({data: data})
    }

    getData(){
        if(this.props.ccgroup === null){return;}
        $glVars.webApi.getGroupNoteFormKit($glVars.urlParams.id, this.props.nid, this.getDataResult);        
    }

    getDataResult(result){         
        if(result.success){
            this.setState(this.prepareNewState(result.data.data, {tagList: result.data.tagList, groupList: result.data.groupList}));
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
            result.dropdownLists.groupList = [];

            for(let item of dropdownLists.tagList){
                result.dropdownLists.tagList.push({value: item.tagId, label: item.tagName, data: item});
            }

            for(let item of dropdownLists.groupList){
                result.dropdownLists.groupList.push({value: item.id, text: item.name});
            }
        }
        
        if(result.data.nid === 0){
            result.data.gId = this.props.ccgroup.id;
        }

        return result;
    }

    onSubmit(){

        if (this.formRef.current.checkValidity() === false) {
            this.setState({formValidated: false});            
        }
        else{
            this.setState({formValidated: true}, this.onSave);
        }
    };

    onSave(){
        let data = JsNx.clone(this.state.data);
        data.templateNote = this.editorTemplateNote.getValue().text;
        data.suggestedNote = this.editorSuggestedNote.getValue().text;
        data.teacherTip = this.editorTeacherTip.getValue().text;
        if(data.nid === 0){
            data.ctid = this.props.ccgroup.ctid;
        }
        $glVars.webApi.saveNote(data, this.onSaveResult);
    }

    onSaveResult(result){
        if(result.success){
            this.onClose();

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
        this.onAddGroup = this.onAddGroup.bind(this);
        this.onAddGroupModalClose = this.onAddGroupModalClose.bind(this);
        this.onRemoveGroup = this.onRemoveGroup.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onSelectgroup = this.onSelectgroup.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onCloseImport = this.onCloseImport.bind(this);
        this.onImport = this.onImport.bind(this);
        this.onDragRow = this.onDragRow.bind(this);
        this.onDropRow = this.onDropRow.bind(this);
        this.onCopy = this.onCopy.bind(this);

        this.state = {ccgroup: null, nid: -1, groupList: [], groupNoteList: [], draggingItem: null, copyIC: "", addGroup: -1, groupName: '', importForm: false};

        this.intCodeRef = React.createRef();
    }

    componentDidMount(){
        $glVars.webApi.addObserver("EditionMode", this.getData2, ['saveNote', 'removeNote']);
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
            
            let groupList = [];
            for(let item of result.data){
                groupList.push({value: item.nid, text: item.name, data: item});
            }

            that.setState({groupList: groupList});
        }

        $glVars.webApi.getGroupList($glVars.urlParams.id, callback);
    }

    getData2(){
        let that = this;

        let callback = function(result){
            if(!result.success){
                $glVars.feedback.showError($glVars.i18n.tags.appName, result.msg);
                return;
            }
            
            that.setState({groupNoteList: result.data});
        }
        
        if(this.state.ccgroup !== null){ 
            $glVars.webApi.getGroupNotes(this.state.ccgroup.id, this.state.ccgroup.ctid, callback);
        }
        else{
            this.setState({groupNoteList: []});
        }
    }

    render(){
        let selectedgId = (this.state.ccgroup !== null ? this.state.ccgroup.name : 0);

        let main =
            <div>
                <Form>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>{"Sélectionnez le groupe de notes:"}</Form.Label>
                            <ComboBox placeholder={"Sélectionnez votre option"} value={selectedgId.toString()} options={this.state.groupList} onChange={this.onSelectgroup} />
                        </Form.Group>
                    </Form.Row>
                </Form>
                <ButtonGroup>
                    <Button variant="primary" disabled={this.state.ccgroup === null} onClick={this.onAdd}><FontAwesomeIcon icon={faPlusCircle}/>{" Ajouter une nouvelle note"}</Button>
                    <Button variant="primary" onClick={() => this.onAddGroup(0)}><FontAwesomeIcon icon={faPlusCircle}/>{" Ajouter un nouveau groupe de notes"}</Button>
                    <Button variant="danger" disabled={this.state.ccgroup === null} onClick={this.onRemoveGroup}><FontAwesomeIcon icon={faTrashAlt}/>{" Supprimer ce groupe de notes"}</Button>
                    <Button variant="primary" disabled={this.state.ccgroup === null} onClick={() => this.onAddGroup(this.state.ccgroup.id)}><FontAwesomeIcon icon={faTrashAlt}/>{" Modifier ce groupe de notes"}</Button>
                    <Button variant="primary" onClick={this.onImport}><FontAwesomeIcon icon={faFileImport}/>{" Importer cahier canada"}</Button>
                </ButtonGroup>
                <a className="btn btn-link" href={this.getSuggestedNotesPrintLink()} target="_blank"><FontAwesomeIcon icon={faPrint}/>{" Imprimer les réponses suggérées"}</a>
                <hr/><br/>
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
                        {this.state.groupNoteList.map((item, index) => {                            
                                let row = 
                                    <DataGrid.Body.RowDraggable key={index} data={item} onDbClick={() => this.onEdit(item.nid)} onDrag={this.onDragRow} onDrop={this.onDropRow}>
                                        <DataGrid.Body.Cell><FontAwesomeIcon icon={faGripVertical} title="Déplacer l'item"/></DataGrid.Body.Cell>
                                        <DataGrid.Body.Cell>{item.slot}</DataGrid.Body.Cell>
                                        <DataGrid.Body.Cell>{item.noteTitle}</DataGrid.Body.Cell>
                                        <DataGrid.Body.Cell>{item.intCode}</DataGrid.Body.Cell>
                                        <DataGrid.Body.Cell style={{textAlign: 'center'}}>
                                            <ButtonGroup size="sm">
                                                <Button onClick={() => this.onEdit(item.nid)} title="Modifier" variant="primary"><FontAwesomeIcon icon={faPencilAlt}/></Button>
                                                <Button onClick={() => this.onRemove(item)} title="Supprimer" variant="primary"><FontAwesomeIcon icon={faTrashAlt}/></Button>
                                                <Button onClick={() => this.onCopy(item.intCode)} title="Code d'intégration" variant="primary"><FontAwesomeIcon icon={faCopy}/></Button>
                                            </ButtonGroup>
                                        </DataGrid.Body.Cell>
                                    </DataGrid.Body.RowDraggable>
                                return (row);
                            }
                        )}
                    </DataGrid.Body>
                </DataGrid>
                                
                {this.state.nid >= 0 && <NoteForm nid={this.state.nid} ccgroup={this.state.ccgroup} onClose={this.onClose}/>}
                
                {this.state.addGroup >= 0 && <AddGroupForm onClose={this.onAddGroupModalClose} gId={this.state.addGroup} name={this.state.groupNamed}/>}

                {this.state.importForm && <ImportForm onClose={this.onCloseImport}/>}

                {this.state.copyIC.length > 0 && <ModalGenerateIntCode onClose={this.onClose} onCopy={this.onClose} intCode={this.state.copyIC} />}
            </div> 

        return (main);
    }

    onImport(){
        this.setState({importForm: true});
    }

    onCloseImport(){
        this.setState({importForm: false, ccgroup: null, groupNoteList: []});
        this.getData();
    }

    onRemoveGroup(){
        let that = this;
        let callback = function(result){
            if(result.success){
                that.setState({ccgroup: null, groupNoteList: []});
                that.getData();
            }
            else{
                $glVars.feedback.showError($glVars.i18n.tags.appName, result.msg);
            }
        }
        if(window.confirm($glVars.i18n.tags.msgConfirmDeletion+"\nCela supprimera tous les notes lié à ce groupe")){
            $glVars.webApi.removeGroup($glVars.urlParams.id, this.state.ccgroup.id, callback);
        }
    }

    onAddGroup(gId){
        if (gId > 0){
            this.setState({groupName: this.state.ccgroup.name});
        }else{
            this.setState({groupName: ''});
        }
        this.setState({addGroup: gId});
    }

    onAddGroupModalClose(name, gId){
        if (name){
            let that = this;
            let callback = function(result){
                if(result.success){
                    that.setState({ccgroup: null, groupNoteList: []});
                    that.getData();
                }
                else{
                    $glVars.feedback.showError($glVars.i18n.tags.appName, result.msg);
                }
            }
            if (gId && gId > 0){
                $glVars.webApi.renameGroup($glVars.urlParams.id, gId, name, callback);
            }else{
                $glVars.webApi.addGroup($glVars.urlParams.id, name, callback);
            }
        }
        this.setState({addGroup: -1});
    }

    getSuggestedNotesPrintLink(){
        let selectedgId = (this.state.ccgroup !== null ? this.state.ccgroup.id : 0);
        return UtilsMoodle.wwwRoot()+`/mod/recitcahiertraces/classes/ReportSuggestedNotes.php?gId=${selectedgId}&cmId=${$glVars.urlParams.id}`;
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
        $glVars.webApi.switchNoteSlot(this.state.draggingItem.nid, item.nid, callback);
    }

    onAdd(){
        this.setState({nid: 0});
    }

    onEdit(nid){
        this.setState({nid: nid});
    }
    
    onRemove(item){
        let callback = function(result){
            if(result.success){
                $glVars.feedback.showInfo($glVars.i18n.tags.appName, $glVars.i18n.tags.msgSuccess, 3);
            }
            else{
                $glVars.feedback.showError($glVars.i18n.tags.appName, result.msg);
            }
        }

        if(window.confirm($glVars.i18n.tags.msgConfirmDeletion)){
            $glVars.webApi.removeNote(item.nid, $glVars.urlParams.id, callback);
        }
    }    

    onSelectgroup(event){
        this.setState({ccgroup: event.target.data}, this.getData2);
    }

    onCopy(intCode){
        this.setState({copyIC: intCode});
    }

    onClose(){
        this.setState({nid: -1, copyIC: ""});
    }
}

class ModalGenerateIntCode extends Component{
    static defaultProps = {        
        intCode: "",
        onClose: null,
        onCopy: null
    };

    constructor(props){
        super(props);

        this.onCopy = this.onCopy.bind(this);
        this.onDataChange = this.onDataChange.bind(this);

        this.state = {data: {nbLines: 15, color: '#000000', btnSaveVariant: '', btnResetVariant: ''}};

        this.intCodeRef = React.createRef();
    }

    render(){        
        let body = 
            <Form >
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>{"Nombre de lignes"}</Form.Label>
                        <InputNumber  value={this.state.data.nbLines} name="nbLines" min={1} onChange={this.onDataChange}/>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>{"Couleur"}</Form.Label>
                        <Form.Control type="color" value={this.state.data.color} name="color" onChange={this.onDataChange} style={{width: "80px"}}/>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>{"Bouton 'Enregistrer'"}</Form.Label>
                        <Form.Control type="text" value={this.state.data.btnSaveVariant} name="btnSaveVariant" onChange={this.onDataChange}/>
                        <Form.Text className="text-muted">{"Défaut: vide. Ex: btn-danger"}</Form.Text>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>{"Bouton 'Réinitialiser'"}</Form.Label>
                        <Form.Control type="text" value={this.state.data.btnResetVariant} name="btnResetVariant" onChange={this.onDataChange}/>
                        <Form.Text className="text-muted">{"Défaut: vide. Ex: btn-danger"}</Form.Text>
                    </Form.Group>
                </Form.Row>
                <Form.Control type="hidden" ref={this.intCodeRef}/>
            </Form>;

        let footer = 
            <div className="btn-tollbar" style={{width: "100%", display: "flex", justifyContent: "flex-end"}}>
                <div className="btn-group">
                    <Button  variant="secondary" onClick={this.props.onClose}>{"Annuler"}</Button>
                    <Button  variant="success"  onClick={this.onCopy}>{"Copier"}</Button>
                </div>
            </div>;

        let main = <Modal title={`Créer le code d'intégration`} body={body} footer={footer} onClose={this.props.onClose} width={"400px"}/>;

        return main;
    }

    onDataChange(event){
        let data = this.state.data;
        data[event.target.name] = event.target.value;
        this.setState({data: data});
    }

    getIntegrationCode(){
        return `{"intCode":"${this.props.intCode}", "nbLines": "${Math.max(1,this.state.data.nbLines)}", "color": "${this.state.data.color}", "btnSaveVariant": "${this.state.data.btnSaveVariant}", "btnResetVariant": "${this.state.data.btnResetVariant}"}`;
    }

    onCopy(){
        this.intCodeRef.current.value = this.getIntegrationCode();
        this.intCodeRef.current.type = "text";
        this.intCodeRef.current.select();
		document.execCommand('copy');
        this.intCodeRef.current.type = "hidden";
        this.props.onCopy();
        $glVars.feedback.showInfo($glVars.i18n.tags.appName, $glVars.i18n.tags.msgCopy, 3);
    }
}

class AddGroupForm extends Component{
    static defaultProps = {        
        onClose: null,
        gId: 0,
        name: false,
    };

    constructor(props){
        super(props);

        this.onSave = this.onSave.bind(this);
        this.onDataChange = this.onDataChange.bind(this);

        this.state = {data: {name: ''}};
        if (this.props.name){
            this.state.data.name = this.props.name;
        }
    }

    render(){        
        let body = 
            <Form >
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>{"Nom du groupe"}</Form.Label>
                        <Form.Control type="text" value={this.state.data.name} name="name" onChange={this.onDataChange}/>
                    </Form.Group>
                </Form.Row>
            </Form>;

        let footer = 
            <div className="btn-tollbar" style={{width: "100%", display: "flex", justifyContent: "flex-end"}}>
                <div className="btn-group">
                    <Button variant="secondary" onClick={() => this.props.onClose()}>{"Annuler"}</Button>
                    <Button variant="success" onClick={this.onSave}>{"Enregistrer"}</Button>
                </div>
            </div>;

        let main = <Modal title={`Groupe de notes`} body={body} footer={footer} onClose={() => this.props.onClose()} width={"400px"}/>;

        return main;
    }

    onDataChange(event){
        let data = this.state.data;
        data[event.target.name] = event.target.value;
        this.setState({data: data});
    }

    onSave(){
        this.props.onClose(this.state.data.name, this.props.gId);
    }
}


class ImportForm extends Component{
    static defaultProps = {        
        onClose: null,
    };

    constructor(props){
        super(props);

        this.onSave = this.onSave.bind(this);
        this.onDataChange = this.onDataChange.bind(this);

        this.state = {data: {name: ''}, ccList: [], importing: false};
        this.getList();
    }

    getList(){
        let that = this;
        let callback = function(result){
            if(!result.success){
                FeedbackCtrl.instance.showError($glVars.i18n.appName, result.msg);
                return;
            }
            
            let ccList = [];
            for(let item of result.data){
                ccList.push({value: item.id, text: item.name, data: item});
            }

            that.setState({ccList: ccList});
        }

        $glVars.webApi.getCCList($glVars.urlParams.id, callback);
    }

    render(){        
        let body = 
            <Form >
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>{"Nom du cahier"}</Form.Label>
                        <ComboBox placeholder={"Sélectionnez votre option"} value={this.state.data.name} name="name" options={this.state.ccList} onChange={this.onDataChange} />
                    </Form.Group>
                </Form.Row>
            </Form>;
        if (this.state.importing){
            body = <h3>Importation en cours...</h3>;
        }

        let footer = 
            <div className="btn-tollbar" style={{width: "100%", display: "flex", justifyContent: "flex-end"}}>
                <div className="btn-group">
                    <Button  variant="secondary" onClick={this.props.onClose}>{"Annuler"}</Button>
                    <Button  variant="success" disabled={this.state.importing} onClick={this.onSave}>{"Importer"}</Button>
                </div>
            </div>;

        let main = <Modal title={`Importer un cahier canada`} body={body} footer={footer} onClose={this.props.onClose} width={"400px"}/>;

        return main;
    }

    onDataChange(event){
        let data = this.state.data;
        data[event.target.name] = event.target.value;
        this.setState({data: data});
    }

    onSave(){
        let that = this;
        this.setState({importing: true});
        let callback = function(result){
            if(!result.success){
                FeedbackCtrl.instance.showError($glVars.i18n.appName, result.msg);
            }
            that.setState({importing: false});
            that.props.onClose(that.state.data.name);
        }

        $glVars.webApi.importCC($glVars.urlParams.id, this.state.data.name, callback);
    }
}