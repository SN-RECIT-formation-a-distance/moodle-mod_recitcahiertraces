
import React, { Component } from 'react';
import {ButtonGroup, Button, Form, Col, Tabs, Tab, ButtonToolbar, DropdownButton, Dropdown} from 'react-bootstrap';
import {faPencilAlt, faPlusCircle, faWrench, faTrashAlt, faCopy, faPrint, faGripVertical, faFileImport, faArrowsAlt} from '@fortawesome/free-solid-svg-icons';
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
        nId: 0,
        selectedGroup: null,
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
        this.facadeUpdateEditor = this.facadeUpdateEditor.bind(this);
        
        this.state = {
            data: null,  
            formValidated: false,
            dropdownLists: {
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
        this.facadeUpdateEditor();
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
                                <Form.Label>{"Collection de notes:"}</Form.Label>
                                <ComboBox placeholder={"Sélectionnez votre option"} required={true}  name="gId" value={data.gId} options={this.state.dropdownLists.groupList} onChange={this.onDataChange} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>{"Titre"}</Form.Label>
                                <Form.Control type="text" required value={data.title} name="title" onChange={this.onDataChange}/>
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

        let main = <Modal title={`Note: ${data.title}`} body={body} footer={footer} onClose={this.props.onClose} />;

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

    facadeUpdateEditor(){
        if(this.state.data === null){ return;}
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
        if(this.props.selectedGroup === null){return;}
        $glVars.webApi.getNoteFormKit($glVars.urlParams.id, this.props.nId, this.getDataResult);        
    }

    getDataResult(result){         
        if(result.success){
            this.setState(this.prepareNewState(result.data.data, {groupList: result.data.groupList}), this.facadeUpdateEditor);
        }
        else{
            $glVars.feedback.showError($glVars.i18n.tags.appname, result.msg);
        }
    }

    prepareNewState(data, dropdownLists){
        data = data || null;
        dropdownLists = dropdownLists || null;
        let result = {
            data: {
                nId: 0, 
                gId: 0, 
                cmId: $glVars.urlParams.id, 
                title: "", 
                templateNote: "", 
                suggestedNote: "", 
                teacherTip: "", 
                lastUpdate: 0, 
                intCode: "", 
                notifyTeacher: 0,
                slot: 0
            }, dropdownLists: {}};
        
        if(data !== null){
            result.data.nId = data.id;
            result.data.gId = data.group.id;
            result.data.title = data.title;
            result.data.templateNote = data.templateNote;
            result.data.suggestedNote = data.suggestedNote;
            result.data.teacherTip = data.teacherTip;
            result.data.lastUpdate = data.lastUpdate;
            result.data.intCode = data.intCode;
            result.data.notifyTeacher = data.notifyTeacher;
            result.data.slot = data.slot;
        }

        if(dropdownLists !== null){
            result.dropdownLists.groupList = [];

            for(let item of dropdownLists.groupList){
                result.dropdownLists.groupList.push({value: item.id, text: item.name, data: item});
            }
        }
        
        if(result.data.nId === 0){
            result.data.gId = this.props.selectedGroup.id;
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
        this.showGroupForm = this.showGroupForm.bind(this);
        this.removeNoteGroup = this.removeNoteGroup.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onSelectGroup = this.onSelectGroup.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onCloseImport = this.onCloseImport.bind(this);
        this.onImport = this.onImport.bind(this);
        this.onDragRow = this.onDragRow.bind(this);
        this.onDropRow = this.onDropRow.bind(this);
        this.onCopy = this.onCopy.bind(this);

        this.state = {selectedGroup: null, nId: -1, groupList: [], groupNoteList: [], draggingItem: null, copyIC: "", showGroupForm: false, importForm: false, showGroupOrderForm: false, groupListRaw: []};

        this.intCodeRef = React.createRef();
    }

    componentDidMount(){
        $glVars.webApi.addObserver("EditionMode1", this.getData, ['saveNoteGroup', 'removeNoteGroup']);
        $glVars.webApi.addObserver("EditionMode2", this.getData2, ['saveNote', 'removeNote']);
        this.getData();
    }

    componentWillUnmount(){
        $glVars.webApi.removeObserver("EditionMode1");
        $glVars.webApi.removeObserver("EditionMode2");
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
                groupList.push({value: item.id, text: item.name, data: item});
            }

            that.setState({groupList: groupList, groupListRaw: result.data});
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
        
        if(this.state.selectedGroup !== null){ 
            $glVars.webApi.getGroupNotes(this.state.selectedGroup.id, this.state.selectedGroup.ct.id, callback);
        }
        else{
            this.setState({groupNoteList: []});
        }
    }

    render(){
        let main =
            <div>
                <Form>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>{"Sélectionnez la collection de notes:"}</Form.Label>
                            <ComboBox placeholder={"Sélectionnez votre option"} value={(this.state.selectedGroup !== null ? this.state.selectedGroup.id : 0)} options={this.state.groupList} onChange={this.onSelectGroup} />
                        </Form.Group>
                    </Form.Row>
                </Form>
                <ButtonToolbar>
                    <ButtonGroup className="mr-4" >
                        <Button variant="primary" disabled={this.state.selectedGroup === null} onClick={this.onAdd} title="Ajouter une nouvelle note"><FontAwesomeIcon icon={faPlusCircle}/>{" Note"}</Button>
                    </ButtonGroup>
                    <ButtonGroup className="mr-4" >
                        <Button variant="primary" onClick={() => this.showGroupForm(true)} title="Ajouter une nouvelle collection de notes"><FontAwesomeIcon icon={faPlusCircle}/>{" Collection"}</Button>
                        <Button variant="danger" disabled={this.state.selectedGroup === null} onClick={this.removeNoteGroup} title="Supprimer cette collection de notes"><FontAwesomeIcon icon={faTrashAlt}/>{" Collection"}</Button>
                        <Button variant="primary" onClick={() => this.showGroupOrderForm(true)} title="Ordonner cette collection de notes">{"Ordre Collection"}</Button>
                        <Button variant="primary" disabled={this.state.selectedGroup === null} onClick={() => this.showGroupForm(true)} title="Modifier cette collection de notes"><FontAwesomeIcon icon={faPencilAlt}/>{" Collection"}</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <a className="btn btn-primary" href={this.getSuggestedNotesPrintLink()} target="_blank" title="Imprimer les réponses suggérées"><FontAwesomeIcon icon={faPrint}/>{" Imprimer"}</a>
                        <Button variant="primary" onClick={this.onImport} title="Importer cahier canada"><FontAwesomeIcon icon={faFileImport} />{" Importer"}</Button>
                    </ButtonGroup>
                </ButtonToolbar>
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
                                    <DataGrid.Body.RowDraggable key={index} data={item} onDbClick={() => this.onEdit(item.id)} onDrag={this.onDragRow} onDrop={this.onDropRow}>
                                        <DataGrid.Body.Cell><FontAwesomeIcon icon={faGripVertical} title="Déplacer l'item"/></DataGrid.Body.Cell>
                                        <DataGrid.Body.Cell>{item.slot}</DataGrid.Body.Cell>
                                        <DataGrid.Body.Cell>{item.title}</DataGrid.Body.Cell>
                                        <DataGrid.Body.Cell>{item.intCode}</DataGrid.Body.Cell>
                                        <DataGrid.Body.Cell style={{textAlign: 'center'}}>
                                            <ButtonGroup size="sm">
                                                <Button onClick={() => this.onEdit(item.id)} title="Modifier" variant="primary"><FontAwesomeIcon icon={faPencilAlt}/></Button>
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
                                
                {this.state.nId >= 0 && <NoteForm nId={this.state.nId} selectedGroup={this.state.selectedGroup} onClose={this.onClose}/>}
                
                {this.state.showGroupForm && <GroupForm onClose={() => this.showGroupForm(false)} data={this.state.selectedGroup}/>}
                {this.state.showGroupOrderForm && <GroupOrderForm onClose={() => this.showGroupOrderForm(false)} data={this.state.groupListRaw}/>}

                {this.state.importForm && <ImportForm onClose={this.onCloseImport}/>}

                {this.state.copyIC.length > 0 && <ModalGenerateIntCode onClose={this.onClose} onCopy={this.onClose} intCode={this.state.copyIC} />}
            </div> 

        return (main);
    }

    onImport(){
        this.setState({importForm: true});
    }

    onCloseImport(){
        this.setState({importForm: false, selectedGroup: null, groupNoteList: []});
        this.getData();
    }

    removeNoteGroup(){
        let that = this;
        let callback = function(result){
            if(result.success){
                that.setState({selectedGroup: null, groupNoteList: []});
            }
            else{
                $glVars.feedback.showError($glVars.i18n.tags.appName, result.msg);
            }
        }
        if(window.confirm(`${$glVars.i18n.tags.msgConfirmDeletion}\n\n${$glVars.i18n.tags.msgIrreversible}`)){
            $glVars.webApi.removeNoteGroup($glVars.urlParams.id, this.state.selectedGroup.id, callback);
        }
    }

    showGroupForm(show){
        this.setState({showGroupForm: show});
    }
    showGroupOrderForm(show){
        this.setState({showGroupOrderForm: show});
    }

    getSuggestedNotesPrintLink(){
        let selectedgId = (this.state.selectedGroup !== null ? this.state.selectedGroup.id : 0);
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
        $glVars.webApi.switchNoteSlot(this.state.draggingItem.id, item.id, callback);
    }

    onAdd(){
        this.setState({nId: 0});
    }

    onEdit(nId){
        this.setState({nId: nId});
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

        if(window.confirm(`${$glVars.i18n.tags.msgConfirmDeletion}\n\n${$glVars.i18n.tags.msgIrreversible}`)){
            $glVars.webApi.removeNote(item.id, $glVars.urlParams.id, callback);
        }
    }    

    onSelectGroup(event){
        this.setState({selectedGroup: event.target.data}, this.getData2);
    }

    onCopy(intCode){
        this.setState({copyIC: intCode});
    }

    onClose(){
        this.setState({nId: -1, copyIC: ""});
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

class GroupForm extends Component{
    static defaultProps = {        
        onClose: null,
        data: null
    };

    constructor(props){
        super(props);

        this.onSave = this.onSave.bind(this);
        this.onDataChange = this.onDataChange.bind(this);

        this.state = {data: props.data || {id: 0, name: "", ct: {id:0, mCmId: $glVars.urlParams.id}, slot: 0}};
    }

    render(){        
        let body = 
            <Form onSubmit={(event) => (event.preventDefault())}>
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
                    <Button variant="success" onClick={this.onSave} disabled={(this.state.data.name.length === 0)}>{"Enregistrer"}</Button>
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
        let that = this;
        let callback = function(result){
            if(result.success){
                that.setState({selectedGroup: null, groupNoteList: []}, that.props.onClose);
            }
            else{
                $glVars.feedback.showError($glVars.i18n.tags.appName, result.msg);
            }
        }

        $glVars.webApi.saveNoteGroup(this.state.data, callback);
    }
}

class GroupOrderForm extends Component{
    static defaultProps = {        
        onClose: null,
        data: null
    };

    constructor(props){
        super(props);

        this.onSave = this.onSave.bind(this);
        this.onDataChange = this.onDataChange.bind(this);
        this.onDragRow = this.onDragRow.bind(this);
        this.onDropRow = this.onDropRow.bind(this);

        this.state = {data: props.data, draggingItem: null};
    }

    render(){
        let data = this.state.data.sort((item, item2) => { return item.slot - item2.slot });
        let body = 
        <div style={{maxHeight: 500, overflowY: 'scroll'}}>
            <DataGrid>
                    <DataGrid.Header>
                        <DataGrid.Header.Row>
                            <DataGrid.Header.Cell style={{width: 40}}></DataGrid.Header.Cell>
                            <DataGrid.Header.Cell style={{width: 80}}>{"#"}</DataGrid.Header.Cell>
                            <DataGrid.Header.Cell >{"Nom"}</DataGrid.Header.Cell>
                        </DataGrid.Header.Row>
                    </DataGrid.Header>
                <DataGrid.Body>
                    {data.map((item, index) => {
                            let row =
                                <DataGrid.Body.RowDraggable data={item} onDrag={this.onDragRow} onDrop={this.onDropRow} key={index}>
                                    <DataGrid.Body.Cell><FontAwesomeIcon icon={faArrowsAlt} title="Déplacer l'item"/></DataGrid.Body.Cell>
                                    <DataGrid.Body.Cell>{index}</DataGrid.Body.Cell>
                                    <DataGrid.Body.Cell>{item.name}</DataGrid.Body.Cell>
                                </DataGrid.Body.RowDraggable>;

                            return row;
                        }
                    )}
                </DataGrid.Body>
            </DataGrid>
        </div>;

        let footer = 
            <div className="btn-tollbar" style={{width: "100%", display: "flex", justifyContent: "flex-end"}}>
            <Button variant="secondary" onClick={() => this.props.onClose()}>{"Fermer"}</Button>
            </div>;

        let main = <Modal title={`Ordonner collection de notes`} body={body} footer={footer} onClose={() => this.props.onClose()} width={"400px"}/>;

        return main;
    }

    onDragRow(item, index){
        this.setState({draggingItem: item});
    }

    onDropRow(item, index){
        let data = this.state.data;
        item = JsNx.getItem(data, 'id', item.id, null);
        let draggingItem = JsNx.getItem(data, 'id', this.state.draggingItem.id, null);
        
        if(item.id === draggingItem.id){ return; }

        let oldSlot = item.slot;
        if (oldSlot == draggingItem.slot) oldSlot = oldSlot + 1;
        item.slot = draggingItem.slot;
        draggingItem.slot = oldSlot;

        this.setState({flags: {dataChanged: true}}, () => {this.onSave(item); this.onSave(draggingItem)});
    }

    onDataChange(event){
        let data = this.state.data;
        data[event.target.name] = event.target.value;
        this.setState({data: data});
    }

    onSave(item){
        let that = this;
        let callback = function(result){
            if(result.success){
            }
            else{
                $glVars.feedback.showError($glVars.i18n.tags.appName, result.msg);
            }
        }

        $glVars.webApi.saveNoteGroup(item, callback);
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
            if(result.success){
                $glVars.feedback.showInfo($glVars.i18n.tags.appName, result.data.info);
            }
            else{
                $glVars.feedback.showError($glVars.i18n.appName, result.msg);
            }

            that.setState({importing: false});
            that.props.onClose(that.state.data.name);
        }

        $glVars.webApi.importCC($glVars.urlParams.id, this.state.data.name, callback);
    }
}