// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 *
 * @package   mod_recitcahiertraces
 * @copyright 2019 RÉCIT 
 * @license   {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */

import React, { Component } from 'react';
import {ButtonGroup, Button, Form, Col, Tabs, Tab, ButtonToolbar, OverlayTrigger, Popover} from 'react-bootstrap';
import {faPencilAlt, faPlusCircle, faWrench, faTrashAlt, faCopy, faPrint, faQuestionCircle, faArrowsAlt, faSortAmountDownAlt, faArrowDown, faArrowUp, faClone} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {ComboBox, FeedbackCtrl, DataGrid, InputNumber, ToggleButtons, Modal} from '../libs/components/Components';
import {JsNx, UtilsMoodle} from '../libs/utils/Utils';
import {$glVars} from '../common/common';
import { i18n } from '../common/i18n';
import { EditorDecorator } from '../libs/components/TextEditor';

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
        this.editorTemplateNote = new EditorDecorator('recit_cahiertraces_editor_container_1');
        this.editorSuggestedNote = new EditorDecorator('recit_cahiertraces_editor_container_2');
        this.editorTeacherTip = new EditorDecorator('recit_cahiertraces_editor_container_3');
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
                                <Form.Label>{i18n.get_string('notegroup')+":"}</Form.Label>
                                <ComboBox placeholder={i18n.get_string('selectoption')} required={true}  name="gId" value={data.gId} options={this.state.dropdownLists.groupList} onChange={this.onDataChange} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>{i18n.get_string('title')}</Form.Label>
                                <Form.Control type="text" required value={data.title} maxLength="255" name="title" onChange={this.onDataChange}/>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>{i18n.get_string('position')}</Form.Label>
                                <InputNumber value={data.slot} name="slot" min={0} onChange={this.onDataChange}/>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>{i18n.get_string('notifyteacheruponupdate')}</Form.Label>
                                <ToggleButtons name="notifyTeacher" defaultValue={[data.notifyTeacher]} onChange={this.onDataChange} 
                                        options={[
                                            {value: 1, text: i18n.get_string('yes')},
                                            {value: 0, text: i18n.get_string('no')}
                                        ]}/>
                            </Form.Group>
                        </Form.Row>
                    </Tab>
                    <Tab eventKey={1} title={i18n.get_string('notetemplate')} style={styleTab}>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <div ref={this.editorTemplateNoteRef}></div>
                            </Form.Group>
                        </Form.Row>
                    </Tab>
                    <Tab eventKey={2} title={i18n.get_string('suggestedresponse')} style={styleTab}>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <div ref={this.editorSuggestedNoteRef}></div>
                            </Form.Group>
                        </Form.Row>
                    </Tab>
                    <Tab eventKey={3} title={i18n.get_string('teachertips')} style={styleTab}> 
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
                    <Button  variant="secondary" onClick={this.onClose}>{i18n.get_string('cancel')}</Button>
                    <Button  variant="success"  onClick={this.onSubmit}>{i18n.get_string('save')}</Button>
                </div>
            </div>;

        let main = <Modal title={i18n.get_string('note')+': '+data.title} body={body} footer={footer} onClose={this.props.onClose} />;

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
            $glVars.feedback.showError(i18n.get_string('pluginname'), result.msg);
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

            $glVars.feedback.showInfo(i18n.get_string('pluginname'), i18n.get_string('msgsuccess'), 3);
        }
        else{
            $glVars.feedback.showError(i18n.get_string('pluginname'), result.msg);
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
        this.onAddNote = this.onAddNote.bind(this);
        this.onEditNote = this.onEditNote.bind(this);
        this.onRemoveNote = this.onRemoveNote.bind(this);

        this.onAddCollection = this.onAddCollection.bind(this);
        this.onEditCollection = this.onEditCollection.bind(this);
        this.onCloseGroupForm = this.onCloseGroupForm.bind(this);
        this.removeNoteGroup = this.removeNoteGroup.bind(this);
        
        this.onSelectGroup = this.onSelectGroup.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onDragRow = this.onDragRow.bind(this);
        this.onDropRow = this.onDropRow.bind(this);
        this.onCopy = this.onCopy.bind(this);

        this.state = {selectedGroup: null, nId: -1, groupList: [], groupNoteList: [], draggingItem: null, copyIC: "", showGroupForm: false, showGroupOrderForm: false, groupListRaw: []};

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
                FeedbackCtrl.instance.showError(i18n.get_string('pluginname'), result.msg);
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
                $glVars.feedback.showError(i18n.get_string('pluginname'), result.msg);
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
                            <Form.Label>{i18n.get_string('selectnotegroup')+":"}</Form.Label>
                            <ComboBox placeholder={i18n.get_string('selectoption')} value={(this.state.selectedGroup !== null ? this.state.selectedGroup.id : 0)} options={this.state.groupList} onChange={this.onSelectGroup} />
                        </Form.Group>
                    </Form.Row>
                </Form>
                <ButtonToolbar style={{justifyContent: 'space-between'}}>
                    <ButtonGroup className="mr-4 mb-4" >
                        <Button variant="primary" disabled={this.state.selectedGroup === null} onClick={this.onAddNote}><FontAwesomeIcon icon={faPlusCircle}/> {i18n.get_string('addnote')}</Button>
                    </ButtonGroup>
                    <ButtonGroup className="mr-4">
                        <Button variant="primary" onClick={this.onAddCollection}><FontAwesomeIcon icon={faPlusCircle}/> {i18n.get_string('addgroup')}</Button>
                        <Button variant="warning" disabled={this.state.selectedGroup === null} onClick={this.removeNoteGroup}><FontAwesomeIcon icon={faTrashAlt}/> {i18n.get_string('deletegroup')}</Button>
                        <Button variant="primary" onClick={() => this.showGroupOrderForm(true)}><FontAwesomeIcon icon={faSortAmountDownAlt}/> {i18n.get_string('ordergroup')}</Button>
                        <Button variant="primary" disabled={this.state.selectedGroup === null} onClick={this.onEditCollection}><FontAwesomeIcon icon={faPencilAlt}/> {i18n.get_string('editgroup')}</Button>
                        <Button variant="primary" disabled={this.state.selectedGroup === null} onClick={() => this.onCloneCollection()}><FontAwesomeIcon icon={faClone}/> {i18n.get_string('clonegroup')}</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <a className="btn btn-primary" href={this.getSuggestedNotesPrintLink()} target="_blank" title={i18n.get_string('print')}><FontAwesomeIcon icon={faPrint}/> {i18n.get_string('print')}</a>
                    </ButtonGroup>
                </ButtonToolbar>
                <hr/><br/>
                <DataGrid orderBy={true}>
                    <DataGrid.Header>
                        <DataGrid.Header.Row>
                            <DataGrid.Header.Cell style={{width: 40}}></DataGrid.Header.Cell>
                            <DataGrid.Header.Cell style={{width: 80}}>{"#"}</DataGrid.Header.Cell>
                            <DataGrid.Header.Cell >{i18n.get_string('note')}</DataGrid.Header.Cell>
                            <DataGrid.Header.Cell style={{width: 200}}>{i18n.get_string('integrationcode')}</DataGrid.Header.Cell>
                            <DataGrid.Header.Cell  style={{width: 120}}></DataGrid.Header.Cell>
                        </DataGrid.Header.Row>
                    </DataGrid.Header> 
                    <DataGrid.Body>
                        {this.state.groupNoteList.map((item, index) => {                            
                                let row = 
                                    <DataGrid.Body.RowDraggable key={index} data={item} onDbClick={() => this.onEditNote(item.id)} onDrag={this.onDragRow} onDrop={this.onDropRow}>
                                        <DataGrid.Body.Cell><FontAwesomeIcon icon={faArrowsAlt} title={i18n.get_string('moveitem')}/></DataGrid.Body.Cell>
                                        <DataGrid.Body.Cell>{item.slot}</DataGrid.Body.Cell>
                                        <DataGrid.Body.Cell>{item.title}</DataGrid.Body.Cell>
                                        <DataGrid.Body.Cell>{item.intCode}</DataGrid.Body.Cell>
                                        <DataGrid.Body.Cell style={{textAlign: 'center'}}>
                                            <ButtonGroup size="sm">
                                                <Button onClick={() => this.onEditNote(item.id)} title={i18n.get_string('edit')} variant="outline-primary"><FontAwesomeIcon icon={faPencilAlt}/></Button>
                                                <Button onClick={() => this.onRemoveNote(item)} title={i18n.get_string('remove')} variant="outline-primary"><FontAwesomeIcon icon={faTrashAlt}/></Button>
                                                <Button onClick={() => this.onCopy(item.intCode)} title={i18n.get_string('integrationcode')} variant="outline-primary"><FontAwesomeIcon icon={faCopy}/></Button>
                                            </ButtonGroup>
                                        </DataGrid.Body.Cell>
                                    </DataGrid.Body.RowDraggable>
                                return (row);
                            }
                        )}
                    </DataGrid.Body>
                </DataGrid>
                                
                {this.state.nId >= 0 && <NoteForm nId={this.state.nId} selectedGroup={this.state.selectedGroup} onClose={this.onClose}/>}
                
                {this.state.showGroupForm && <GroupForm onClose={this.onCloseGroupForm} data={this.state.selectedGroup}/>}
                {this.state.showGroupOrderForm && <GroupOrderForm onClose={() => this.showGroupOrderForm(false)} ctId={$glVars.urlParams.id}/>}

                {this.state.copyIC.length > 0 && <ModalGenerateIntCode onClose={this.onClose} onCopy={this.onClose} intCode={this.state.copyIC} />}
            </div> 

        return (main);
    }

    removeNoteGroup(){
        let that = this;
        let callback = function(result){
            if(result.success){
                that.setState({selectedGroup: null, groupNoteList: []});
            }
            else{
                $glVars.feedback.showError(i18n.get_string('pluginname'), result.msg);
            }
        }
        if(window.confirm(i18n.get_string('msgconfirmdeletion'))){
            $glVars.webApi.removeNoteGroup($glVars.urlParams.id, this.state.selectedGroup.id, callback);
        }
    }

    onAddCollection(){
        this.setState({showGroupForm: true, selectedGroup: null, groupNoteList: []});
    }

    onCloneCollection(){
        let group = this.state.selectedGroup;
        let that = this;
        let callback = function(result){
            if(result.success){
                that.setState({groupNoteList: []});
                that.getData();
            }
            else{
                $glVars.feedback.showError(i18n.get_string('pluginname'), result.msg);
            }
        }

        $glVars.webApi.cloneNoteGroup([group], callback);

        this.setState({selectedGroup: null});
    }

    onEditCollection(){
        this.setState({showGroupForm: true});
    }

    onCloseGroupForm(){
        this.setState({showGroupForm: false});
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
                $glVars.feedback.showError(i18n.get_string('pluginname'), result.msg);
            }
        }
        $glVars.webApi.switchNoteSlot(this.state.draggingItem.id, item.id, $glVars.urlParams.id, callback);
    }

    onAddNote(){
        this.setState({nId: 0});
    }

    onEditNote(nId){
        this.setState({nId: nId});
    }
    
    onRemoveNote(item){
        let callback = function(result){
            if(result.success){
                $glVars.feedback.showInfo(i18n.get_string('pluginname'), i18n.get_string('msgsuccess'), 3);
            }
            else{
                $glVars.feedback.showError(i18n.get_string('pluginname'), result.msg);
            }
        }

        if(window.confirm(i18n.get_string('msgconfirmdeletion'))){
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

        this.state = {data: {nbLines: 15, color: '#000000', btnSaveVariant: 'btn btn-success', btnResetVariant: 'btn btn-secondary'}};

        this.intCodeRef = React.createRef();
    }

    render(){        
        let body = 
            <Form >
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>{i18n.get_string('nblines')}</Form.Label>
                        <InputNumber  value={this.state.data.nbLines} name="nbLines" min={1} onChange={this.onDataChange}/>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>{i18n.get_string('color')}</Form.Label>
                        <Form.Control type="color" value={this.state.data.color} name="color" onChange={this.onDataChange} style={{width: "80px"}}/>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>{i18n.get_string('savebtn')} <HelpButton helpText={<>
                <span>{i18n.get_string('infobs')}</span>
                <br/>
                <a href="https://getbootstrap.com/docs/4.6/utilities/borders/#border-radius" target="_blank">{i18n.get_string('btnshape')} <i className='p-1 fa fa-info-circle'></i> </a><br/>
                <a href="https://getbootstrap.com/docs/4.6/components/buttons/" target="_blank">{i18n.get_string('btnlook')} <i className='p-1 fa fa-info-circle'></i> </a>
                </>}/></Form.Label>
                        <Form.Control type="text" value={this.state.data.btnSaveVariant} name="btnSaveVariant" onChange={this.onDataChange}/>
                        <Form.Text className="text-muted">{i18n.get_string('savebtndesc')}</Form.Text>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>{i18n.get_string('preview')}</Form.Label><br/>
                        <a className={this.state.data.btnSaveVariant}>{i18n.get_string('save')}</a>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>{i18n.get_string('resetbtn')} <HelpButton helpText={<>
                <span>{i18n.get_string('infobs')}</span>
                <br/>
                <a href="https://getbootstrap.com/docs/4.6/utilities/borders/#border-radius" target="_blank">{i18n.get_string('btnshape')} <i className='p-1 fa fa-info-circle'></i> </a><br/>
                <a href="https://getbootstrap.com/docs/4.6/components/buttons/" target="_blank">{i18n.get_string('btnlook')} <i className='p-1 fa fa-info-circle'></i> </a>
                </>}/></Form.Label>
                        <Form.Control type="text" value={this.state.data.btnResetVariant} name="btnResetVariant" onChange={this.onDataChange}/>
                        <Form.Text className="text-muted">{i18n.get_string('resetbtndesc')}</Form.Text>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>{i18n.get_string('preview')}</Form.Label><br/>
                        <a className={this.state.data.btnResetVariant}>{i18n.get_string('reset')}</a>
                    </Form.Group>
                </Form.Row>
                <Form.Control type="hidden" ref={this.intCodeRef}/>
            </Form>;

        let footer = 
            <div className="btn-tollbar" style={{width: "100%", display: "flex", justifyContent: "flex-end"}}>
                <div className="btn-group">
                    <Button  variant="secondary" onClick={this.props.onClose}>{i18n.get_string('cancel')}</Button>
                    <Button  variant="success"  onClick={this.onCopy}>{i18n.get_string('copy')}</Button>
                </div>
            </div>;

        let main = <Modal title={i18n.get_string('createintegrationcode')} body={body} footer={footer} onClose={this.props.onClose} width={"400px"}/>;

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
        $glVars.feedback.showInfo(i18n.get_string('pluginname'), i18n.get_string('msgsuccess'), 3);
    }
}

export class HelpButton extends Component {
    static defaultProps = {
        helpText: '',
        icon: faQuestionCircle
    }

    constructor(props) {
        super(props);
    }

    render(){
        const popover = (
            <Popover id="popover-help">
              <Popover.Content>
                {this.props.helpText}
              </Popover.Content>
            </Popover>
          );

         
        let main =
            <OverlayTrigger trigger="focus" placement="right" overlay={popover}>
                 <Button variant="link" className='p-0'><FontAwesomeIcon icon={this.props.icon}/></Button>
            </OverlayTrigger>;

        return main;
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
                        <Form.Label>{i18n.get_string('groupname')}</Form.Label>
                        <Form.Control type="text" value={this.state.data.name} name="name" onChange={this.onDataChange}/>
                    </Form.Group>
                </Form.Row>
            </Form>;

        let footer = 
            <div className="btn-tollbar" style={{width: "100%", display: "flex", justifyContent: "flex-end"}}>
                <div className="btn-group">
                    <Button variant="secondary" onClick={() => this.props.onClose()}>{i18n.get_string('cancel')}</Button>
                    <Button variant="success" onClick={this.onSave} disabled={(this.state.data.name.length === 0)}>{i18n.get_string('save')}</Button>
                </div>
            </div>;

        let main = <Modal title={i18n.get_string('notegroup')} body={body} footer={footer} onClose={() => this.props.onClose()} width={"400px"}/>;

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
                $glVars.feedback.showError(i18n.get_string('pluginname'), result.msg);
            }
        }

        $glVars.webApi.saveNoteGroup([this.state.data], callback);
    }
}

class GroupOrderForm extends Component{
    static defaultProps = {        
        onClose: null,
    };

    constructor(props){
        super(props);

        this.onSave = this.onSave.bind(this);
        this.onDataChange = this.onDataChange.bind(this);

        this.state = {data: []};
        this.getData();
    }

    getData(){
        let that = this;

        let callback = function(result){
            if(!result.success){
                FeedbackCtrl.instance.showError(i18n.get_string('pluginname'), result.msg);
                return;
            }
                
            let data = result.data.sort((item, item2) => { return item.slot - item2.slot });

            that.setState({data: data});
        }

        $glVars.webApi.getGroupList($glVars.urlParams.id, callback);

    }

    render(){
        let body = 
        <div style={{maxHeight: 500, overflowY: 'scroll'}}>
            <DataGrid>
                    <DataGrid.Header>
                        <DataGrid.Header.Row>
                            <DataGrid.Header.Cell style={{width: 100}}>{i18n.get_string('order')}</DataGrid.Header.Cell>
                            <DataGrid.Header.Cell >{i18n.get_string('group')}</DataGrid.Header.Cell>
                            <DataGrid.Header.Cell style={{width: 70}}></DataGrid.Header.Cell>
                        </DataGrid.Header.Row>
                    </DataGrid.Header>
                <DataGrid.Body>
                    {this.state.data.map((item, index) => {
                            let row =
                                <DataGrid.Body.Row data={item} key={index}>
                                    <DataGrid.Body.Cell>{item.slot.toString()}</DataGrid.Body.Cell>
                                    <DataGrid.Body.Cell>{item.name}</DataGrid.Body.Cell>
                                    <DataGrid.Body.Cell style={{textAlign: 'center'}}>
                                        {index > 0 && <FontAwesomeIcon style={{cursor:'pointer',marginRight:'1rem'}} icon={faArrowUp} title={i18n.get_string('moveitem')} onClick={() => this.onMoveRow(index, -1)}/>}
                                        {index < this.state.data.length-1 && <FontAwesomeIcon style={{cursor:'pointer'}} icon={faArrowDown} title={i18n.get_string('moveitem')} onClick={() => this.onMoveRow(index, 1)}/>}
                                    </DataGrid.Body.Cell>
                                </DataGrid.Body.Row>;

                            return row;
                        }
                    )}
                </DataGrid.Body>
            </DataGrid>
        </div>;

        let footer = 
            <div className="btn-group">
                <Button variant="primary" onClick={() => this.reorderGroups()}>{i18n.get_string('close')}</Button>
            </div>;

        let main = <Modal title={i18n.get_string('ordergroup')} body={body} footer={footer} onClose={() => this.props.onClose()} width={"500px"}/>;

        return main;
    }

    reorderGroups(){
        let that = this;
        let callback = function(result){
            if(result.success){
                that.getData();
            }
            else{
                $glVars.feedback.showError(i18n.get_string('pluginname'), result.msg);
            }
        }

        $glVars.webApi.reorderNoteGroups($glVars.urlParams.id, callback);
        this.props.onClose();
    }

    onMoveRow(index, offset){
        let data = this.state.data;
        let item = data[index+offset];
        let draggingItem = data[index];
        
        if(!draggingItem || item.id === draggingItem.id){ return; }

        let oldSlot = (item.slot <= 0 ? 1 : item.slot);
        
        if (oldSlot == draggingItem.slot){
            oldSlot = (oldSlot + offset <= 0 ? 1 : oldSlot + offset);
            //alert("Veuillez appuyer sur réordonner pour avoir un résultat optimal");        
        }
        item.slot = draggingItem.slot;
        draggingItem.slot = oldSlot;

        data = data.sort((item, item2) => { return item.slot - item2.slot });
        this.setState({data:data, flags: {dataChanged: true}}, () => {this.onSave([item, draggingItem]);});
    }

    onDataChange(event){
        let data = this.state.data;
        data[event.target.name] = event.target.value;
        this.setState({data: data});
    }

    onSave(items){
        let callback = function(result){
            if(!result.success){
                $glVars.feedback.showError(i18n.get_string('pluginname'), result.msg);
            }
        }

        $glVars.webApi.saveNoteGroup(items, callback);
    }
}
