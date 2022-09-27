import React, { Component } from 'react';
import { Button, Collapse, Card} from 'react-bootstrap';
import {faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal} from '../libs/components/Components';
import {UtilsMoodle, JsNx} from '../libs/utils/Utils';
import {$glVars} from '../common/common';

class PersonalNoteForm extends Component{
    static defaultProps = {        
        userId: 0,
        gId: 0,
        nId: 0,
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
        // it is a teacher
        if(UtilsMoodle.checkRoles($glVars.signedUser.roles, UtilsMoodle.rolesL2)){
            mode = "t";
        }
        else if(UtilsMoodle.checkRoles($glVars.signedUser.roles, UtilsMoodle.rolesL3)){
             mode = "s";
        }
        this.state = {data: null, remoteData: null, dropdownLists: null, mode: mode, collapse: {note: true, suggestedNote: false, feedback: true}};

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

        if((prevProps.userId !== this.props.userId) || (prevProps.nId !== this.props.nId)){
            this.getData();
        }
    }

    getData(){
        $glVars.webApi.getUserNote($glVars.urlParams.id, this.props.nId, this.props.gId, this.props.userId, this.getDataResult);        
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
        let result = {data: null, remoteData: data, dropdownLists: {}};
        
        if(data !== null){
            result.data = {};
            result.data.userId = data.userId;
            result.data.courseId = data.noteDef.group.ct.courseId;
            result.data.lastUpdate = data.lastUpdate;
            result.data.nId = data.noteDef.id;
            result.data.nCmId = data.nCmId;
            result.data.feedback = data.feedback;
            result.data.unId = data.id;
            result.data.note = data.noteContent;
        }

        return result;
    }

    render(){
        if(this.state.remoteData === null){return null;}

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
            suggestedNote = <div style={styleText} dangerouslySetInnerHTML={{__html: this.state.remoteData.noteDef.suggestedNote}}></div>;
        }
        else{
            return null;
        }
        let styleHeader = {cursor: "pointer"};
        
        let main =
            <div>
                <h5 className="text-truncate">{`Note: ${this.state.remoteData.noteDef.title}`}</h5>
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
        
        $glVars.webApi.saveUserNote(tmp.data, tmp.flags, (result) => this.onSaveResult(result, callback));
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

export class ModalPersonalNote extends Component{
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
        let personalNote = <PersonalNoteForm userId={this.props.data.userId} gId={this.props.data.gId} setOnSave={this.setOnSave} nId={this.props.data.nId}/>;
        let footer = 
            <div className="btn-tollbar" style={{width: "100%", display: "flex", justifyContent: "space-between", flexWrap: "wrap"}}>
                <div className="btn-group" style={{flexWrap: "wrap"}}>
                    {this.props.onNextStudent && <Button variant="outline-primary" onClick={this.props.onPreviousStudent} disabled={!this.props.navStatus.previous}><FontAwesomeIcon icon={faArrowLeft}/>{" " + $glVars.i18n.tags.previousStudent}</Button>}
                    {this.props.onPreviousStudent && <Button variant="outline-primary"  onClick={this.props.onNextStudent} disabled={!this.props.navStatus.next}>{$glVars.i18n.tags.nextStudent + " "}<FontAwesomeIcon icon={faArrowRight}/></Button>}
                </div>
                <div className="btn-group" style={{flexWrap: "wrap"}}>
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
