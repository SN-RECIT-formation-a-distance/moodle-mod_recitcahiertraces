import React, { Component } from 'react';
import { ButtonGroup, Form, Button, Col, Tab, DropdownButton, Dropdown, Row, Nav, Tabs, Badge} from 'react-bootstrap';
import {faArrowLeft, faArrowRight, faPencilAlt, faBars, faEye, faPrint, faCompass, faCommentDots, faTasks, faCheckSquare, faSquare, faFileExport} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {FeedbackCtrl, DataGrid, ComboBox} from '../libs/components/Components';
import {UtilsMoodle, JsNx, UtilsDateTime} from '../libs/utils/Utils';
import {ModalPersonalNote} from './PersonalNote';
import {$glVars} from '../common/common';

class ViewPrintingNotes extends Component{
    static defaultProps = {
        enrolledUserList: [],
        style: null
    };

    constructor(props){
        super(props);

        this.onSelectUser = this.onSelectUser.bind(this);

        this.state = {userId: 0};
    }

    render(){
        let main =
            <div style={this.props.style}>
                <GroupUserSelect dataProvider={this.props.enrolledUserList} onSelectUser={this.onSelectUser}/>

                <hr/>
                {this.state.userId > 0 &&
                   <ActionBar gId={$glVars.urlParams.id} userId={this.state.userId}/>              
                }            
                          
            </div>;

        return main;
    }

    onSelectUser(userId, username){
        this.setState({userId: userId});
    }
}

class ViewNavGroupAndStudents extends Component{
    static defaultProps = {
        enrolledUserList: [],
        style: null
    };

    constructor(props){
        super(props);

        this.onSelectUser = this.onSelectUser.bind(this);
        this.onNextStudent = this.onNextStudent.bind(this);
        this.onPreviousStudent = this.onPreviousStudent.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onClose = this.onClose.bind(this);

        this.groupUserSelect = React.createRef();

        this.state = {
            data: {
                userId: 0,
                username: "",
                gId: 0,
                noteTitle: "",
                nId: 0
            }
        };
    }    

    render(){
        let main =
            <div style={this.props.style}>
                <GroupUserSelect ref={this.groupUserSelect} dataProvider={this.props.enrolledUserList} onSelectUser={this.onSelectUser}/>

                {this.state.data.userId > 0 &&
                    <div>
                        <hr/>
                        <NavActivities userId={this.state.data.userId} onEdit={this.onEdit} isTeacher={true}/>                                
                        {this.state.data.nId > 0 && 
                            <ModalPersonalNote modalTitle={`Élève: ${this.state.data.username}`} data={this.state.data} onClose={this.onClose} onNextStudent={this.onNextStudent} 
                                onPreviousStudent={this.onPreviousStudent} navStatus={this.getNavStatus()}/>
                        }  
                    </div>                    
                }            
                          
            </div>;

        return main;
    }

    onEdit(item){
        if(item === null){ return; }

        let data = this.state.data;
        data.gId = item.noteDef.group.id;
        data.nId = item.noteDef.id;
        data.noteTitle = item.noteDef.title;

        this.setState({data: data});
    }

    onClose(){
        let data = this.state.data;
        data.gId = 0;
        data.nId = 0;
        data.noteTitle = "";
        this.setState({data: data});
    }

    onSelectUser(userId, username){
        let data = this.state.data;
        
        data.userId = userId;
        data.username = username;

        this.setState({data: data});
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

class ViewRequiredNotes extends Component{
    static defaultProps = {
        show: false,
        style: null,
        onDataChange: null
    };

    constructor(props){
        super(props);

        this.getData = this.getData.bind(this);
        this.getDataResult = this.getDataResult.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onNextStudent = this.onNextStudent.bind(this);
        this.onPreviousStudent = this.onPreviousStudent.bind(this);

        this.state = {
            dataProvider: [],
            data: {
                userId: 0,
                username: "",
                gId: 0,
                noteTitle: "",
                nId: 0,
                unId: 0
            }
        };
    }

    componentDidMount(){
        $glVars.webApi.addObserver("ViewRequiredNotes", this.getData, ['saveUserNote']);        
        this.getData();
    }

    componentWillUnmount(){
        $glVars.webApi.removeObserver("ViewRequiredNotes");
    }

    componentDidUpdate(prevProps){
        if((this.props.show) && (!prevProps.show)){
            this.getData();
        }
    }

    getData(){
        if(this.props.show){
            $glVars.webApi.getRequiredNotes($glVars.urlParams.id, this.getDataResult);
        }
    }

    getDataResult(result){
        if(!result.success){
            FeedbackCtrl.instance.showError($glVars.i18n.appName, result.msg);
            return;
        }

        this.props.onDataChange({nbItems: result.data.length});

        this.setState({dataProvider: result.data});
    }

    render(){
        let that = this;

        let main = 
            <div style={this.props.style}>
                <DataGrid orderBy={true}>
                    <DataGrid.Header>
                        <DataGrid.Header.Row>
                            <DataGrid.Header.Cell style={{width: 80}}>{"#"}</DataGrid.Header.Cell>
                            <DataGrid.Header.Cell >{"Activité"}</DataGrid.Header.Cell>
                            <DataGrid.Header.Cell >{"Élève"}</DataGrid.Header.Cell>
                            <DataGrid.Header.Cell >{"Titre de la note"}</DataGrid.Header.Cell>
                            <DataGrid.Header.Cell  style={{width: 80}}></DataGrid.Header.Cell>
                        </DataGrid.Header.Row>
                    </DataGrid.Header>
                    <DataGrid.Body>
                        {this.state.dataProvider.map((item, index) => {
                                let row = 
                                    <DataGrid.Body.Row key={index} onDbClick={() => that.onEdit(item)}>
                                        <DataGrid.Body.Cell>{index + 1}</DataGrid.Body.Cell>
                                        <DataGrid.Body.Cell>{item.cmName}</DataGrid.Body.Cell>
                                        <DataGrid.Body.Cell>{item.username}</DataGrid.Body.Cell>
                                        <DataGrid.Body.Cell>{item.noteDef.title}</DataGrid.Body.Cell>
                                        <DataGrid.Body.Cell style={{textAlign: 'center'}}>
                                            <ButtonGroup size="sm">
                                                <Button onClick={() => that.onEdit(item)} title="Modifier" variant="primary"><FontAwesomeIcon icon={faPencilAlt}/></Button>
                                            </ButtonGroup>
                                        </DataGrid.Body.Cell>
                                    </DataGrid.Body.Row>
                                return (row);                                    
                            }
                        )}
                    </DataGrid.Body>
                </DataGrid>

                {this.state.data.nId > 0 && 
                        <ModalPersonalNote modalTitle={`Élève: ${this.state.data.username}`} data={this.state.data} onClose={this.onClose} onNextStudent={this.onNextStudent} 
                                onPreviousStudent={this.onPreviousStudent} navStatus={this.getNavStatus()}/>
                }
            </div>;

        return main;
    }
    
    onEdit(item){
        if(item === null){ 
            this.onClose();
            return; 
        }

        let data = this.state.data;
        data.gId = item.noteDef.group.id;
        data.nId = item.noteDef.id;
        data.noteTitle = item.noteDef.title;
        data.userId = item.userId;
        data.username = item.username;
        data.unId = item.id;

        this.setState({data: data});
    }

    onClose(){
        let data = this.state.data;
        
        data.gId = 0;
        data.nId = 0;
        data.noteTitle = "";
        data.userId = 0;
        data.username = "";
        data.unId = 0;
        
        this.setState({data: data});
    }

    onNextStudent(){
        let index = JsNx.getItemIndex(this.state.dataProvider, 'id', this.state.data.unId) + 1;

        let item = JsNx.at(this.state.dataProvider, index, null);

        this.onEdit(item);
    }

    onPreviousStudent(){
        let index = JsNx.getItemIndex(this.state.dataProvider, 'id', this.state.data.unId) - 1;

        let item = JsNx.at(this.state.dataProvider, index, null);

        this.onEdit(item);
    }

    getNavStatus(){
        let index = JsNx.getItemIndex(this.state.dataProvider, 'id', this.state.data.unId);
        let result = {previous: !(index <= 0), next: !(this.state.dataProvider.length <= (index + 1))};
        return result;
    }
}

class ViewProgression extends Component{
    static defaultProps = {
        show: false,
        style: null,
        onDetail: null,
        enrolledUserList: []
    };

    constructor(props){
        super(props);

        this.getData = this.getData.bind(this);
        this.getDataResult = this.getDataResult.bind(this);
        this.onSelectGroup = this.onSelectGroup.bind(this);
        //this.onDetail = this.onDetail.bind(this);
        //this.onBack = this.onBack.bind(this);

        this.state = {dataProvider: [], groupId: 0}; //, userId: 0
    }

    componentDidMount(){
        this.getData();
    }

    componentWillUnmount(){
    }

    componentDidUpdate(prevProps){
        if((this.props.show) && (!prevProps.show)){
            this.getData();
        }
    }

    getData(){
        if(this.props.show){
            $glVars.webApi.getStudentsProgression($glVars.urlParams.id, this.getDataResult);
        }
    }

    getDataResult(result){
        if(!result.success){
            FeedbackCtrl.instance.showError($glVars.i18n.appName, result.msg);
            return;
        }

        this.setState({dataProvider: result.data});
    }

    render(){
        let main = 
            <div style={this.props.style}>
                <GroupUserSelect ref={this.groupUserSelect} dataProvider={this.props.enrolledUserList} onSelectGroup={this.onSelectGroup}/>
                <hr/>
                {this.getSummary()}
            </div>;
//{this.state.userId > 0 ? this.getDetails() : this.getSummary()}
        return main;
    }

    getSummary(){
        let data = {};
        
        for(let item of this.state.dataProvider){
            if((this.state.groupId > 0) && (!item.groupIds.includes(this.state.groupId))){continue;}

            if(!data.hasOwnProperty(`user${item.userId}`)){
                data[`user${item.userId}`] = {username: item.username, userId: item.userId, nbDone: 0, nbTotal: 0};
            }

            data[`user${item.userId}`].nbDone += item.done;
            data[`user${item.userId}`].nbTotal += 1;
        }

        let rows = [];
        for(let attr in data){
            let pct = (data[attr].nbDone / data[attr].nbTotal * 100);
            let row = 
                <DataGrid.Body.Row key={rows.length}>
                    <DataGrid.Body.Cell>{rows.length + 1}</DataGrid.Body.Cell>
                    <DataGrid.Body.Cell>{data[attr].username}</DataGrid.Body.Cell>
                    <DataGrid.Body.Cell sortValue={pct}>
                        <Button onClick={() => this.onDetail(data[attr].userId)} variant="link">{`${pct.toFixed(0)}%`}</Button>
                    </DataGrid.Body.Cell>
                </DataGrid.Body.Row>;

            rows.push(row);
        }

        let result = 
        <DataGrid orderBy={true}>
            <DataGrid.Header>
                <DataGrid.Header.Row>
                    <DataGrid.Header.Cell style={{width: 80}}>{"#"}</DataGrid.Header.Cell>
                    <DataGrid.Header.Cell>{"Élève"}</DataGrid.Header.Cell>
                    <DataGrid.Header.Cell  style={{width: 120}}>{"Progrès"}</DataGrid.Header.Cell>
                </DataGrid.Header.Row>
            </DataGrid.Header>
            <DataGrid.Body>
               {rows}
            </DataGrid.Body>
        </DataGrid>;

        return result;
    }

    onDetail(userId){
        //this.setState({userId: userId});
        this.props.onDetail(userId);
    }

    onSelectGroup(groupId){
        this.setState({groupId: groupId});
    }
}

class NavActivities extends Component{
    static defaultProps = {
        userId: 0,
        isTeacher: false,
        onEdit: null
    };

    constructor(props){
        super(props);
        
        this.getData = this.getData.bind(this);
        this.getDataResult = this.getDataResult.bind(this);
        this.onSelectTab = this.onSelectTab.bind(this);

        this.state = {
            activeTab: 0, 
            dataProvider: []
        };
    }

    componentDidMount(){
        $glVars.webApi.addObserver("NavActivities", this.getData, ['saveUserNote']);        
        this.getData();
    }

    componentWillUnmount(){
        $glVars.webApi.removeObserver("NavActivities");
    }

    componentDidUpdate(prevProps){
        if(prevProps.userId !== this.props.userId){
            this.getData();
        }
    }

    getData(){
        if(this.props.userId === 0){
            this.setState({dataProvider: []});
            return;
        }
        
        $glVars.webApi.getUserNotes($glVars.urlParams.id, this.props.userId, 0, this.getDataResult);
    }

    getDataResult(result){
        if(!result.success){
            FeedbackCtrl.instance.showError($glVars.i18n.appName, result.msg);
            return;
        }

        // If the user is trying to load automatically some note by URL
        if(!$glVars.urlParams.groupLoaded){
            let item = null;
            for(let group of result.data){
                for(let userNote of group){
                    if((userNote.noteDef.id === $glVars.urlParams.nId) && (userNote.noteDef.group.id === $glVars.urlParams.gId)){
                        item = note;
                    }
                }
            }

            $glVars.urlParams.groupLoaded = true;

            this.setState({dataProvider: result.data}, () => this.props.onEdit(item));
        }
        else{
            this.setState({dataProvider: result.data});
        }
    }

    render(){
        let that = this;

        let navItems = 
            <Nav variant="pills" className="flex-column">
                {this.state.dataProvider.map(function(items, index){
                    let groupName = JsNx.at(items, 0).noteDef.group.name;

                    let pctProgress = that.getPctProgress(items);

                    return  <Nav.Item key={index} className="m-1 bg-light">
                                <Nav.Link eventKey={index}>
                                    <div  style={{display: "flex", width: '315px', justifyContent: "space-evenly"}} title={`${groupName} (${pctProgress.toFixed(0)}%)`}>
                                        <span className="text-truncate" >{`${groupName} `}</span>
                                        <Badge pill  variant="light">{` ${pctProgress.toFixed(0)}%`}</Badge>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>;
                })}
            </Nav>;

        let studentView = 
            <Row>
                <Col sm={12} md={12} lg={12} xl={3}>{navItems}</Col>
                <Col sm={12} md={12} lg={12} xl={9}>
                    <Tab.Content>
                        {this.state.dataProvider.map(function(items, index){
                            let result=
                                <Tab.Pane key={index} eventKey={index}>
                                    <div className="groupContent card border-0 m-0 p-0 position-relative bg-transparent">
                                        {items.map((item, index2) => {
                                                    let retro = null;
                                                    let time = "";
                                                    if (item.lastUpdate > 0){
                                                        time = UtilsDateTime.formatTime(item.lastUpdate) + " - ";
                                                    }
                                                    if (item.cmName.length == 0){
                                                        item.cmName = "Cette note n'a pas été complétée.";
                                                    }
                                                    if (item.feedback.length > 0){
                                                        retro = 
                                                        <div className="balon1 p-2 m-0 position-relative" data-is="Rétroaction" key={"key"+index2}>
                                                            <div className="float-right" dangerouslySetInnerHTML={{ __html: item.feedback }}></div>
                                                        </div>
                                                    }
                                                    let row = 
                                                            <div className="balon2 p-2 m-0 position-relative" data-is={time+"Activité: "+that.formatText(item.cmName)} key={index2}>
                                                                <div className="float-left">                                                                    
                                                                    <p style={{fontWeight:'bold'}}>
                                                                        {item.noteDef.title}
                                                                        <Button onClick={() => that.props.onEdit(item)} title="Modifier" variant="link"><FontAwesomeIcon icon={faPencilAlt}/></Button>
                                                                    </p>
                                                                    <p dangerouslySetInnerHTML={{ __html: item.noteContent.text }}></p>
                                                                </div>
                                                            </div>
                                                    return [row, retro];                                    
                                                }
                                            )}
                                    </div>
                                </Tab.Pane>;
                                // {(item.noteDef.notifyTeacher === 1 ? <Button disabled={true} title="Rétroaction requise" size="sm" variant="warning"><FontAwesomeIcon icon={faCommentDots}/></Button> : null)}
                            return result;
                        })}
                    </Tab.Content>
                </Col>
            </Row>;

        let teacherView = 
            <div>
                <Row>{navItems}</Row>
                <Row>
                    <Tab.Content style={{width: "100%"}}>
                        {this.state.dataProvider.map(function(items, index){
                            let result=
                                <Tab.Pane key={index} eventKey={index}>
                                   <DataGrid orderBy={true}>
                                        <DataGrid.Header>
                                            <DataGrid.Header.Row>
                                                <DataGrid.Header.Cell style={{width: 80}}>{"#"}</DataGrid.Header.Cell>
                                                <DataGrid.Header.Cell >{"Titre de la note"}</DataGrid.Header.Cell>
                                                <DataGrid.Header.Cell style={{width: 300}}>{"Note"}</DataGrid.Header.Cell>
                                                <DataGrid.Header.Cell style={{width: 300}}>{"Rétroaction"}</DataGrid.Header.Cell>
                                                <DataGrid.Header.Cell style={{width: 300}}>{"Activité"}</DataGrid.Header.Cell>
                                                <DataGrid.Header.Cell style={{width: 80}}></DataGrid.Header.Cell>
                                                <DataGrid.Header.Cell  style={{width: 80}}></DataGrid.Header.Cell>
                                            </DataGrid.Header.Row>
                                        </DataGrid.Header>
                                        <DataGrid.Body>
                                            {items.map((item, index2) => {
                                                    let row = 
                                                        <DataGrid.Body.Row key={index2} onDbClick={() => that.props.onEdit(item)}>
                                                            <DataGrid.Body.Cell>{index2 + 1}</DataGrid.Body.Cell>
                                                            <DataGrid.Body.Cell>{` ${item.noteDef.title}`}</DataGrid.Body.Cell>
                                                            <DataGrid.Body.Cell>{that.formatText(item.noteContent.text)}</DataGrid.Body.Cell>
                                                            <DataGrid.Body.Cell>{that.formatText(item.feedback)}</DataGrid.Body.Cell>
                                                            <DataGrid.Body.Cell>{that.formatText(item.cmName)}</DataGrid.Body.Cell>
                                                            <DataGrid.Body.Cell style={{textAlign: "center"}}>{(item.noteDef.notifyTeacher === 1 ? 
                                                                <Button disabled={true} title="Rétroaction requise" size="sm" variant="warning"><FontAwesomeIcon icon={faCommentDots}/></Button> : null)}
                                                            </DataGrid.Body.Cell>
                                                            <DataGrid.Body.Cell style={{textAlign: 'center'}}>
                                                                <ButtonGroup size="sm">
                                                                    <Button onClick={() => that.props.onEdit(item)} title="Modifier" variant="primary"><FontAwesomeIcon icon={faPencilAlt}/></Button>
                                                                </ButtonGroup>
                                                            </DataGrid.Body.Cell>
                                                        </DataGrid.Body.Row>
                                                    return (row);                                    
                                                }
                                            )}
                                        </DataGrid.Body>
                                    </DataGrid>
                                </Tab.Pane>;
                            return result;
                        })}
                    </Tab.Content>
                </Row>
            </div>;

        let main = 
            <Tab.Container id="tabActivities" activeKey={this.state.activeTab} onSelect={this.onSelectTab}>
                {this.props.isTeacher ? teacherView : studentView}
            </Tab.Container>;

        return main;
    }

    getPctProgress(items){
        let result = 0;

        let done = 0;
        for(let item of items){
            if(item.isTemplate === 0){
                done++;
            }
        }

        result = done / items.length * 100;

        return result;
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

export class TeacherNotebook extends Component{
    constructor(props){
        super(props);

        this.getData = this.getData.bind(this);
        this.getDataResult = this.getDataResult.bind(this);
        this.onDataChange = this.onDataChange.bind(this);
        this.onSetTab = this.onSetTab.bind(this);
        this.onProgressionDetail = this.onProgressionDetail.bind(this);

        this.state = {tab: $glVars.urlParams.tab.toString(), nbFeedback: "?", enrolledUserList: []};
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
        
        this.setState({enrolledUserList: result.data});
    }

    render(){
        let main = 
            <div>
                <Tabs activeKey={this.state.tab} id="tabTeacherNotebook" onSelect={this.onSetTab}>
                    <Tab eventKey={"0"} title={<span><FontAwesomeIcon icon={faCompass}/>{" Consulter les notes"}</span>}>
                        <ViewNavGroupAndStudents style={{padding: "1rem"}} enrolledUserList={this.state.enrolledUserList}></ViewNavGroupAndStudents>
                    </Tab>
                    <Tab eventKey={"1"} title={<span><FontAwesomeIcon icon={faCommentDots}/>{" Rétroaction manquante "}<Badge variant="light">{this.state.nbFeedback}</Badge></span>}>
                        <ViewRequiredNotes show={(this.state.tab === "1")} style={{padding: "1rem"}} onDataChange={this.onDataChange}/>
                    </Tab>
                    <Tab eventKey={"2"} title={<span><FontAwesomeIcon icon={faTasks}/>{" Progression"}</span>}>
                        <ViewProgression show={(this.state.tab === "2")} style={{padding: "1rem"}} onDetail={this.onProgressionDetail} enrolledUserList={this.state.enrolledUserList}/>
                    </Tab>
                    <Tab eventKey={"3"} title={<span><FontAwesomeIcon icon={faPrint}/>{" Imprimer"}</span>}>
                        <ViewPrintingNotes style={{padding: "1rem"}} enrolledUserList={this.state.enrolledUserList}/>
                    </Tab>
                </Tabs>
            </div>;

        return (main);
    } 

    onSetTab(tab){
        this.setState({tab: tab});
    }

    onDataChange(item){
        this.setState({nbFeedback: item.nbItems});
    }

    onProgressionDetail(userId){
        $glVars.urlParams.userLoaded = false;
        $glVars.urlParams.userId = userId;
        this.onSetTab("0");
    }
}

export class StudentNotebook extends Component{
    static defaultProps = {
        userId: 0
    };
    
    constructor(props){
        super(props);

        this.onEdit = this.onEdit.bind(this);
        this.onClose = this.onClose.bind(this);

        this.state = {
            data: {
                userId: props.userId,
                username: "",
                gId: 0,
                noteTitle: "",
                nId: 0
            }
        };
    }

    render(){
        let main = 
            <div>  
                {this.state.data.userId > 0 &&
                    <div>
                        <ActionBar userId={this.state.data.userId}/>
                        <hr/>
                        <NavActivities userId={this.state.data.userId} onEdit={this.onEdit}/>
                        {this.state.data.nId > 0 && 
                                <ModalPersonalNote modalTitle={`Cahier de traces - Note personnelle`} data={this.state.data} onClose={this.onClose} />}
                    </div>
                }
            </div>;

        return (main);
    }

    onEdit(item){
        console.log(item);
        if(item === null){ return; }

        let data = this.state.data;
        data.gId = item.noteDef.group.id;
        data.nId = item.noteDef.id;
        data.noteTitle = item.noteDef.title;

        this.setState({data: data});
    }

    onClose(){
        let data = this.state.data;
        
        data.gId = 0;
        data.nId = 0;
        data.noteTitle = "";
        
        this.setState({data: data});
    }
}

class ActionBar extends Component{
    static defaultProps = {
        userId: 0
    };

    render(){
        let main = 
            <div style={{marginBottom: "1rem"}}>
                <a href={this.getPrintLink(1)} target="_blank"><FontAwesomeIcon icon={faPrint}/>{" Imprimer des notes"}</a>
                {$glVars.signedUser.portfolioUrl && <a href={$glVars.signedUser.portfolioUrl} target="_blank" style={{marginLeft:'15px'}}><FontAwesomeIcon icon={faFileExport}/>{" Exporter des notes vers portfolio"}</a>}
            </div>;

        return main;
    }

    getPrintLink(showFeedback){
        return UtilsMoodle.wwwRoot()+`/mod/recitcahiertraces/classes/ReportStudentNotes.php?cmId=${$glVars.urlParams.id}&userId=${this.props.userId}&sf=${showFeedback || 0}`;
    }

}

class GroupUserSelect extends Component{
    static defaultProps = {
        dataProvider: [],
        onSelectUser: null,
        onSelectGroup: null
    };

    constructor(props){
        super(props);

        this.onSelectGroup = this.onSelectGroup.bind(this);
        this.onSelectUser = this.onSelectUser.bind(this);
        this.onPrevious = this.onPrevious.bind(this);
        this.onNext = this.onNext.bind(this);

        this.state = {selectedUserIndex: -1, selectedGroupId: -1, groupList:[], userList: [], userListFiltered: []};
    }

    componentDidMount(){
        this.prepareData(this.props.dataProvider);
    }

    componentDidUpdate(prevProps){
        if((prevProps.dataProvider.length !== this.props.dataProvider.length) || (!$glVars.urlParams.userLoaded)){
            this.prepareData(this.props.dataProvider);
        }
    }

    prepareData(dataProvider){        
        let groupList = [];
        let userList = [];
        for(let group of dataProvider){

             // groupId = 0 means no group
            if(group[0].groupId > 0){ 
                groupList.push({text: group[0].groupName, value: group[0].groupId, data: group});
            }
            
            for(let user of group){
                if(JsNx.getItem(userList, "value", user.userId, null) === null){
                    userList.push({text: user.userName, value: user.userId, data: user});
                }
            }
        }

        groupList.sort((a, b) => { return ('' + a.text).localeCompare(b.text);})
        userList.sort((a, b) => { return ('' + a.text).localeCompare(b.text);})
        
        if((!$glVars.urlParams.userLoaded) && ($glVars.urlParams.userId > 0)){

            let item = JsNx.getItem(userList, 'value', $glVars.urlParams.userId, null);
            
            if(item !== null){
                this.setState(
                    {groupList: groupList, userList: userList, userListFiltered: userList, selectedUserIndex: JsNx.getItemIndex(userList, 'value', $glVars.urlParams.userId)}, 
                    (item === null ? null : () => this.props.onSelectUser(parseInt(item.value, 10), item.text))
                );

                $glVars.urlParams.userLoaded = true;
            }
        }
        else{
            this.setState({groupList: groupList, userList: userList, userListFiltered: userList});
            $glVars.urlParams.userLoaded = true;
        }
    }

    render(){
        let value = "";
        //if(userList.nxExists(this.state.selectedUserIndex)){
            
        if(JsNx.exists(this.state.userListFiltered, this.state.selectedUserIndex)){
            value = this.state.userListFiltered[this.state.selectedUserIndex].value;
        }

        let main = 
            <div>
                <Row>
                    <Col sm={6}>
                        <Form.Group as={Col}>
                            <Form.Label>Sélectionnez le groupe:</Form.Label>
                            <ComboBox placeholder={"Sélectionnez votre option"} options={this.state.groupList} onChange={this.onSelectGroup} value={this.state.selectedGroupId}/>
                        </Form.Group>
                    </Col>
                    {this.props.onSelectUser !== null && 
                        <Col sm={6}>
                            <Row>
                                <Col sm={12}>
                                    <Form.Group  as={Col}>
                                        <Form.Label>Sélectionnez l'utilisateur:</Form.Label>
                                        <ComboBox placeholder={"Sélectionnez votre option"} options={this.state.userListFiltered} onChange={this.onSelectUser} value={value} style={{float: "left", width: "90%"}}/>
                                        <ButtonGroup style={{display: "flex"}}>
                                            <Button variant="link" onClick={this.onPrevious} disabled={(this.state.selectedUserIndex <= -1)}><FontAwesomeIcon icon={faArrowLeft}/></Button>
                                            <Button variant="link" onClick={this.onNext} disabled={(this.state.userListFiltered.length <= (this.state.selectedUserIndex + 1))}><FontAwesomeIcon icon={faArrowRight}/></Button>
                                        </ButtonGroup>
                                    </Form.Group>
                                    
                                </Col>
                            </Row>
                        </Col>       
                    }        
                </Row>
            </div>;

/*<ButtonGroup style={{display: "flex", justifyContent: "center"}}>
                                    <Button variant="secondary" onClick={this.onPrevious} disabled={(this.state.selectedUserIndex <= -1)}><FontAwesomeIcon icon={faArrowLeft}/>{" " + $glVars.i18n.tags.previousStudent}</Button>
                                    <Button variant="secondary" onClick={this.onNext} disabled={(this.state.userListFiltered.length <= (this.state.selectedUserIndex + 1))}>{$glVars.i18n.tags.nextStudent + " "}<FontAwesomeIcon icon={faArrowRight}/></Button>
                                </ButtonGroup>*/
        return (main);
    }

    onSelectGroup(event){
        let userListFiltered = this.state.userList;
        let selectedGroupId = parseInt(event.target.value || 0, 10);

        if(selectedGroupId > 0){            
            userListFiltered = this.state.userList.filter(function(item){
                return (item.data.groupId === selectedGroupId);
            })
        }

        this.setState({selectedGroupId: selectedGroupId, selectedUserIndex: -1, userListFiltered: userListFiltered}, () => {;
            if(this.props.onSelectGroup){
                this.props.onSelectGroup(selectedGroupId);
            }
        });
    }

    onSelectUser(event){
        let index = event.target.index;
        let item = {text: "", value: 0};

        if(this.state.userListFiltered[index]){
            item.text = this.state.userListFiltered[index].text;
            item.value = parseInt(this.state.userListFiltered[index].value, 10);
        }
        
        this.setState({selectedUserIndex: index}, () => {
            if(this.props.onSelectUser){
                this.props.onSelectUser(item.value, item.text);
            }
        });
    }

    onPrevious(){
        let newIndex = this.state.selectedUserIndex - 1;
        let item = {text: "", value: 0};

        if(this.state.userListFiltered[newIndex]){
            item.text = this.state.userListFiltered[newIndex].text;
            item.value = parseInt(this.state.userListFiltered[newIndex].value, 10);
        }

        this.setState({selectedUserIndex: newIndex}, () => {
            if(this.props.onSelectUser){
                this.props.onSelectUser(item.value, item.text);
            }
        });
    }

    onNext(){
        let newIndex = this.state.selectedUserIndex + 1;
        
        let item = {text: "", value: 0};

        if(this.state.userListFiltered[newIndex]){
            item.text = this.state.userListFiltered[newIndex].text;
            item.value = parseInt(this.state.userListFiltered[newIndex].value, 10);
        }

        this.setState({selectedUserIndex: newIndex}, () => {
            if(this.props.onSelectUser){
                this.props.onSelectUser(item.value, item.text);
            }
        }); 
    }

    getNavStatus(){
        return {previous: !(this.state.selectedUserIndex <= -1), next: !(this.state.userListFiltered.length <= (this.state.selectedUserIndex + 1))};
    }
}