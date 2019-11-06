/*var recit = recit || {};
recit.mod = recit.mod || {};
recit.mod.cahiercanada = recit.mod.cahiercanada || {};

recit.mod.cahiercanada.UserGroupList = class
{
    constructor(){
        this.dom = null;
        this.refs = {groupList: null, userList: null, btnPrevious: null, btnNext: null};
        this.data = [];
        this.onSelectUser = null;

        this.onEnrolledUserListResult = this.onEnrolledUserListResult.bind(this);
        this.onGroupListSelect = this.onGroupListSelect.bind(this);
        this.onUserListSelect = this.onUserListSelect.bind(this);
        this.onNextUser = this.onNextUser.bind(this);
        this.onPreviousUser = this.onPreviousUser.bind(this);
    }

    init(){
        this.dom = document.createElement("div");

        let label = document.createElement("h4");
        label.innerHTML = recitModCahierCanada.i18n.selectGroup + ":";
        this.dom.appendChild(label);

        this.refs.groupList = new recit.components.SelectCtrl();
        this.refs.groupList.placeholderDesc = recitModCahierCanada.i18n.selectOption;
        this.refs.groupList.dom.onchange = this.onGroupListSelect;
        this.dom.appendChild(this.refs.groupList.dom);

        this.dom.appendChild(document.createElement("br"));

        label = document.createElement("h4");
        label.innerHTML = recitModCahierCanada.i18n.selectUser + ":";
        this.dom.appendChild(label);

        this.refs.userList = new recit.components.SelectCtrl();
        this.refs.userList.placeholderDesc = recitModCahierCanada.i18n.selectOption;
        this.refs.userList.dom.onchange = this.onUserListSelect;
        this.dom.appendChild(this.refs.userList.dom);

        this.dom.appendChild(document.createElement("br"));
        let btnGroup = document.createElement("div");
        btnGroup.style.display = 'flex';
        btnGroup.style.justifyContent = 'center';
        btnGroup.setAttribute("role", "group");
        btnGroup.classList.add("btn-group");

        this.refs.btnPrevious = recit.components.createButton(recitModCahierCanada.i18n.previous, ["btn", "btn-primary"], this.onPreviousUser, "fa-arrow-left");
        btnGroup.appendChild(this.refs.btnPrevious);

        this.refs.btnNext = recit.components.createButton(recitModCahierCanada.i18n.next, ["btn", "btn-primary"], this.onNextUser, "fa-arrow-right", false);        
        btnGroup.appendChild(this.refs.btnNext);
        this.dom.appendChild(btnGroup);
    }

    loadData(){
        let params = recit.utils.getUrlVars();
        recit.http.WebApi.instance().getEnrolledUserList(params.id, this.onEnrolledUserListResult);
    }

    onEnrolledUserListResult(result){
        if(!result.success){alert(result.msg);}
    
        this.data = result.data;

        this.refs.groupList.disposeData();
        for(let i = 0; i < this.data.length; i++){
            let group = this.data[i][0];
            this.refs.groupList.addItem(group.groupName, i, false);
        }

        this.refs.groupList.refresh();

        this.refs.userList.disposeData();
        this.refs.userList.refresh();
        this.refreshBtns();
    }

    onGroupListSelect(event){
        this.onSelectUser(0);

        let selectedIndex = parseInt(event.currentTarget.value, 10);
        let userList = this.data[selectedIndex];

        this.refs.userList.disposeData();
        for(let user of userList){
            this.refs.userList.addItem(user.userName, user.userId, false);
        }

        this.refs.userList.refresh();
        this.refreshBtns();
    }

    onUserListSelect(event){
        let selectedUserId = (event instanceof Event ? event.currentTarget.value : event);
        this.onSelectUser(selectedUserId);        
    }

    onNextUser(event){
        this.refs.userList.selectNext();
        this.refreshBtns();
    }

    onPreviousUser(event){
        this.refs.userList.selectPrevious();
        this.refreshBtns();
    }

    refreshBtns(){
        this.refs.btnPrevious.disabled = (this.refs.userList.selectedIndex() <= 0);
        this.refs.btnNext.disabled = (this.refs.userList.selectedIndex() >= this.refs.userList.getNbItems() - 1);
    }
}

recit.mod.cahiercanada.PersonalNotes = class
{
    constructor(studentId){
        this.dom = null;
        this.refs = {userGroupList: null, personalNotes: null};
        this.selectedUserId = studentId; 

        this.onSelectUser = this.onSelectUser.bind(this);
        this.onPersonalNotesResult = this.onPersonalNotesResult.bind(this);
        this.onEdit = this.onEdit.bind(this);
    }

    init(){
        this.dom = document.createElement("div");
        
        if(recitModCahierCanada.checkRoles(recit.mod.cahiercanada.Main.rolesL2)){
            this.refs.userGroupList = new recit.mod.cahiercanada.UserGroupList();     
            this.refs.userGroupList.onSelectUser = this.onSelectUser;   
            this.refs.userGroupList.init();
            this.dom.appendChild(this.refs.userGroupList.dom);
        }

        this.refs.personalNotes = document.createElement("div");
        this.dom.appendChild(this.refs.personalNotes);
    }

    loadData(){
        if(recitModCahierCanada.checkRoles(recit.mod.cahiercanada.Main.rolesL2)){
            this.refs.userGroupList.loadData();
        }
        else{
            this.getPersonalNotes();
        }
    }

    onSelectUser(selectedUserId){
        this.selectedUserId = selectedUserId;

        if(this.selectedUserId > 0){
            this.getPersonalNotes();
        }
        else{
            this.clearPersonalNotes();
        }
    }

    getPersonalNotes(){
        let params = recit.utils.getUrlVars();
        recit.http.WebApi.instance().getPersonalNotes(params.id, this.selectedUserId, this.onPersonalNotesResult);
    }

    clearPersonalNotes(){
        while(this.refs.personalNotes.firstChild){
            this.refs.personalNotes.removeChild(this.refs.personalNotes.firstChild);
        }
    }

    clear(){
        this.clearPersonalNotes();
    }

    onPersonalNotesResult(result){
        if(!result.success){
            alert(result.msg);
            return;
        }
        
        this.clearPersonalNotes();

        if(result.data === null){ return; }

        if(result.data.length === 0){
            this.refs.personalNotes.appendChild(document.createElement("br"));
            let element = document.createElement("div");
            element.setAttribute("data-context", 'warning');
            element.innerHTML = recitModCahierCanada.i18n.noData;
            this.refs.personalNotes.appendChild(element);   
            return;
        }

        let body = null; 
        let lastCmId = 0;

        let linkBar = document.createElement("div");
        linkBar.style.display = "flex";
        linkBar.style.justifyContent = "flex-end";
        this.refs.personalNotes.appendChild(linkBar);
        linkBar.appendChild(this.createLink(recitModCahierCanada.i18n.printNotes, 0));
        let spacer = document.createElement("span");
        spacer.style.marginRight = "10px";
        spacer.style.marginLeft = "10px";
        spacer.innerHTML = " | ";
        linkBar.appendChild(spacer);
        linkBar.appendChild(this.createLink(`${recitModCahierCanada.i18n.printNotes} + ${recitModCahierCanada.i18n.teacherFeedback}`, 1));

        for(let item of result.data){
            if(lastCmId !== item.cmId){
                lastCmId = item.cmId;

                this.refs.personalNotes.appendChild(document.createElement("br"));

                let card = document.createElement("div");
                card.classList.add("card");
                this.refs.personalNotes.appendChild(card);   

                let header = document.createElement("div");
                header.classList.add("card-header");
                header.innerHTML = recitModCahierCanada.i18n.activity + ": " + item.activityName;
                card.appendChild(header);
    
                body = document.createElement("div");
                body.classList.add('card-body');
                card.appendChild(body);                
            }

            if(body.length > 1){
                body.appendChild(document.createElement("HR"));
            }
            
            let title = document.createElement("h5");
            title.classList.add("card-title");
            title.innerHTML = recitModCahierCanada.i18n.noteTitle + ": " + item.title;
            body.appendChild(title);

            body.appendChild(this.createPersonalNoteForm(item));            
        }
    }

    createLink(text, showFeedback){
        let link = document.createElement("a");
        link.target = "_blank";
        let params = recit.utils.getUrlVars();
        link.href = recit.utils.wwwRoot()+`/mod/recitcahiercanada/classes/ReportStudentNotes.php?cmId=${params.id}&userId=${this.selectedUserId}&sf=${showFeedback}`;
        link.innerHTML = text;
        return link;
    }

    createPersonalNoteForm(data){
        let btn = null;
        let bindData = new recit.components.BindableData(data);

        let form = document.createElement("div");
        form.style = 'display: flex';

        // student form
        let subContainer = document.createElement("div");
        subContainer.style = 'flex-grow:0; flex-shrink: 0; flex-basis: 48%; margin: 10px;';   
        form.appendChild(subContainer);

        let noteTitle = document.createElement("h6");
        noteTitle.classList.add('card-subtitle');
        noteTitle.classList.add('mb-2'); 
        noteTitle.classList.add('text-muted'); 
        noteTitle.innerHTML = recitModCahierCanada.i18n.studentNote;
        subContainer.appendChild(noteTitle);

        let note = document.createElement("div");
        note.style = "width: 100%; height: fit-content; display:block; border-radius: 4px; background-color: #F9F9F9; margin-bottom: 5px; padding: 10px;";
        note.innerHTML = bindData.rawData.note;
        bindData.makeBinding('note', note, 'innerHTML');
        subContainer.appendChild(note);

        if(recitModCahierCanada.checkRoles(recit.mod.cahiercanada.Main.rolesL3)){
            btn = recit.components.createButton(recitModCahierCanada.i18n.edit, ["btn", "btn-primary", "btn-sm"], () => this.onEdit(bindData, 's'), 'fa-pencil');
            btn.style= "display: block; margin-left: auto;";
            subContainer.appendChild(btn);
        }

        // teacher form
        subContainer = subContainer.cloneNode();
        form.appendChild(subContainer);
        noteTitle = noteTitle.cloneNode();
        noteTitle.innerHTML = recitModCahierCanada.i18n.teacherFeedback;
        subContainer.appendChild(noteTitle);
        note = note.cloneNode();
        note.innerHTML = bindData.rawData.feedback;
        bindData.makeBinding('feedback', note, 'innerHTML');
        subContainer.appendChild(note);

        if(recitModCahierCanada.checkRoles(recit.mod.cahiercanada.Main.rolesL2)){
            btn = recit.components.createButton(recitModCahierCanada.i18n.edit, ["btn", "btn-primary", "btn-sm"], () => this.onEdit(bindData, 't'), "fa-pencil");
            btn.style= "display: block; margin-left: auto;";
            subContainer.appendChild(btn);
        }
        
        return form;
    }

    onEdit(bindData, mode){        
        let dlg = new recit.mod.cahiercanada.DlgInputNote(); 
        let callbackWebApi = function(result){
            if(!result.success){
                alert(result.msg);
                return;
            }

            alert(recitModCahierCanada.i18n.msgActionCompleted);
        };

        if(mode === 't'){
            dlg.setTitle(recitModCahierCanada.i18n.teacherFeedback);
            dlg.setData(bindData, 'feedback', (data, onSaveCallback) => recit.http.WebApi.instance().savePersonalNote(data, mode, (result) => {
                callbackWebApi(result);
                onSaveCallback(result.data);
            }));
        }
        else{
            dlg.setTitle(recitModCahierCanada.i18n.studentNote); 
            dlg.setData(bindData, 'note', (data, onSaveCallback) => recit.http.WebApi.instance().savePersonalNote(data, mode, (result) => {
                callbackWebApi(result);
                onSaveCallback(result.data);
            }));
        }        

        bindData.rawData.userId = this.selectedUserId;
        
        dlg.show();
    }
};

recit.mod.cahiercanada.DlgInputNote = class
{
    constructor(){
        this.dialog = null;
        this.editor = null;
        this.bindableData = null;
        this.nameField = null;
        this.onSaveCallback = null;

        this.onSave = this.onSave.bind(this);

        this.init();
    }

    init(){
        this.dialog = new recit.components.Dialog();
        this.dialog.init();      

        this.editor = recitModCahierCanada.getEditor();
        this.editor.show();
        this.dialog.appendOnBody(this.editor.dom);

        let that = this;
        this.dialog.appendOnFooter(recit.components.createButton(recitModCahierCanada.i18n.cancel, ["btn"], () => {that.dialog.close()}));
        this.dialog.appendOnFooter(recit.components.createButton(recitModCahierCanada.i18n.save, ["btn", "btn-success"], this.onSave, "fa-check"));
    }

    setTitle(title){
        this.dialog.setTitle(title);
    }

    show(){ this.dialog.show(); }

    setData(bindableData, nameField, onSaveCallback){
        this.bindableData = bindableData;
        this.nameField = nameField;
        this.onSaveCallback = onSaveCallback;
        this.editor.setValue(this.bindableData.rawData[this.nameField]);
    }

    onSave(){
        let that = this;
        let callback = function(data){
            that.bindableData.setData(data);
            that.dialog.close();
        };

        let data = this.bindableData.rawData;
        data[this.nameField] = this.editor.getValue();        
        this.onSaveCallback(data, callback);
    }
}

recit.mod.cahiercanada.EditionMode = class
{
    constructor(){
        this.dom = null;
        this.refs = {sectionCmList: null, cmNotes: null};
        this.tagData = {tagList: [], component: 'mod_cahiercanada', itemType: 'cccmnote'};

        this.onSectionCmListResult = this.onSectionCmListResult.bind(this);
        this.onSectionCmListSelect = this.onSectionCmListSelect.bind(this);
        this.onCmNotesResult = this.onCmNotesResult.bind(this);
        this.saveCmNote = this.saveCmNote.bind(this);
        this.onAddCmNote = this.onAddCmNote.bind(this);
        this.onEditTemplateNote = this.onEditTemplateNote.bind(this);
        this.loadTags = this.loadTags.bind(this);
    }

    init(){
        this.dom = document.createElement("div");
        this.refs.sectionCmList = new recit.components.SelectCtrl();
        this.refs.sectionCmList.placeholderDesc = recitModCahierCanada.i18n.selectOption;
        this.refs.sectionCmList.dom.onchange = this.onSectionCmListSelect; 

        let label = document.createElement("h4");
        label.innerHTML = recitModCahierCanada.i18n.selectSectionActivity;
        this.dom.appendChild(label);
        this.dom.appendChild(this.refs.sectionCmList.dom);

        this.refs.cmNotes = document.createElement("div");
        this.dom.appendChild(this.refs.cmNotes);
    }

    loadData(){
        let params = recit.utils.getUrlVars();
        recit.http.WebApi.instance().getSectionCmList(params.id, this.onSectionCmListResult);

        // wait to send the next ajax request
        setTimeout(this.loadTags, 500);
    }

    loadTags(){
        let that = this;
        recit.http.WebApi.instance().getTagList(0, that.tagData.itemType, that.tagData.component, function(result){
            if(result.success){
                that.tagData.tagList = result.data;
            }
        });
    }
    
    clear(){
        this.refs.sectionCmList.disposeData();
        this.refs.sectionCmList.refresh();
        this.clearCmNotes();
    }

    onSectionCmListResult(result){
        if(!result.success){
            alert(result.msg);
            return;
        }

        for(let item of result.data){
            this.refs.sectionCmList.addItem(item.name, item, "", false);
        }

        this.refs.sectionCmList.refresh();        
    }

    onSectionCmListSelect(event){
        let selectedItem = this.refs.sectionCmList.getSelectedItem();
        recit.http.WebApi.instance().getCmNotes(selectedItem.cmId, this.onCmNotesResult);
    }

    clearCmNotes(){
        while(this.refs.cmNotes.firstChild){
            this.refs.cmNotes.removeChild(this.refs.cmNotes.firstChild);
        }
    }

    onCmNotesResult(result){
        if(!result.success){
            alert(result.msg);
            return;
        }

        this.clearCmNotes();

        this.refs.cmNotes.appendChild(document.createElement("br"));

        let container = document.createElement("div");
        container.classList.add("card");
        this.refs.cmNotes.appendChild(container);

        let header = document.createElement("div");
        header.classList.add("card-header");
        header.innerHTML = this.refs.sectionCmList.getSelectedItem().name;
        container.appendChild(header);

        let body = document.createElement("div");
        body.classList.add('card-body');
        container.appendChild(body);
        
        for(let item of result.data){
            body.appendChild(this.createCmNoteForm(item));
        }
        
        body.appendChild(recit.components.createButton(recitModCahierCanada.i18n.addNewNote, ["btn", "btn-primary"], this.onAddCmNote, 'fa-plus'));
    }

    onAddCmNote(event){
        let btnAdd = event.currentTarget;
        let cmNote = this.refs.sectionCmList.getSelectedItem();
        let data = {ccCmId: 0, ccId: cmNote.ccId, cmId: cmNote.cmId, title: "", templateNote: "", slot: 0, tagList: [], lastUpdate: 0};
        btnAdd.parentElement.insertBefore(this.createCmNoteForm(data), btnAdd);
    }

    createCmNoteForm(data){
        let bindData = new recit.components.BindableData(data);

        let form = document.createElement("div");
        form.style.borderWidth = "1px";
        form.style.borderStyle = "solid";
        form.style.borderColor = "#DDD";
        form.style.borderRadius = "4px";
        form.style.padding = "10px";
        form.style.marginBottom = "20px";
        form.classList.add('form');        

        // note title
        let formGroup = recit.components.createFormControlText(recitModCahierCanada.i18n.noteTitle + ":", "noteTitle", data.title, "");
        bindData.makeBinding('title', formGroup.input, 'value');
        
        formGroup.help.appendChild(this.createIntCodeHtml(bindData, data.ccCmId));       
        form.appendChild(formGroup.container);

        // template note
        let templateNote = document.createElement("div");
        templateNote.style = "width: 100%; height: fit-content; display:block; border-radius: 4px; background-color: #F9F9F9; margin-bottom: 5px; padding: 10px;";
        templateNote.innerHTML = data.templateNote;

        formGroup = recit.components.createFormGroup(recitModCahierCanada.i18n.templateNote, templateNote);
        bindData.makeBinding('templateNote', formGroup.input, 'innerHTML');
        form.appendChild(formGroup.container);

        let btn = recit.components.createButton("Edit", ["btn", "btn-primary", "btn-sm"], () => this.onEditTemplateNote(bindData), 'fa-pencil');
        form.appendChild(btn);
        form.appendChild(document.createElement("br"));
        form.appendChild(document.createElement("br"));

        // tags
        let ctrlTagList = new recit.components.MoodleTag();
        ctrlTagList.component = this.tagData.component;
        ctrlTagList.itemType = this.tagData.itemType;
        ctrlTagList.setPlaceholder(recitModCahierCanada.i18n.typeToSearch);
        ctrlTagList.setDataProvider(this.tagData.tagList);
        ctrlTagList.setValues(data.tagList);
        ctrlTagList.refresh();

        formGroup = recit.components.createFormGroup(recitModCahierCanada.i18n.tags, ctrlTagList.getDom());
        form.appendChild(formGroup.container);
        
        // boutons
        let btnGroup = document.createElement("div");
        btnGroup.style.display ="block";
        btnGroup.style.textAlign ="center";
        btnGroup.setAttribute("role", "group");
        btnGroup.classList.add("btn-group");
        btnGroup.appendChild(recit.components.createButton(recitModCahierCanada.i18n.remove, ["btn", "btn-sm"], () => this.removeCmNote(data.ccCmId, form), "fa-trash"));
        btnGroup.appendChild(recit.components.createButton(recitModCahierCanada.i18n.save, ["btn", "btn-success", "btn-sm"], () => this.saveCmNote(bindData, ctrlTagList), "fa-check"));
        form.appendChild(btnGroup);

        return form;
    }

    createIntCodeHtml(bindData, ccCmId){
        function formatIntCode(value){
            return `{"cccmid":"${value}", "nbLines": "15"}`;
        }

        let result = document.createElement("span");

        let element = document.createElement("span");
        element.innerHTML = recitModCahierCanada.i18n.integrationCode + ": ";
        result.appendChild(element);

        element = document.createElement("span");
        element.id = "intCode" + ccCmId.toString();
        element.innerHTML = formatIntCode(ccCmId);
        bindData.makeBinding('ccCmId', element, 'innerHTML', formatIntCode);
        result.appendChild(element);

        let hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        result.appendChild(hiddenInput);

        //recitModCahierCanada.i18n.copy
        result.appendChild(recit.components.createButton("", ["btn", "btn-outline-default", "btn-sm"], () => this.copyToClipboard(hiddenInput, element), "fa-copy"));
        return result;
    }

    copyToClipboard(hiddenInput, element){
        hiddenInput.value = element.innerHTML;
        hiddenInput.type = "text";
        hiddenInput.select()
		document.execCommand('copy');
		hiddenInput.type = "hidden";
    }

    onEditTemplateNote(bindData){
        let dlg = new recit.mod.cahiercanada.DlgInputNote(); 
        dlg.setTitle(recitModCahierCanada.i18n.templateNote);
        bindData.rawData.userId = this.selectedUserId;
        dlg.setData(bindData, 'templateNote', (data, onSaveCallback) => onSaveCallback(data)); 
        dlg.show();
    }

    removeCmNote(ccCmId, formElement){
        let callback = function(result){
            if(!result.success){
                alert(result.msg);
                return;
            }
    
            formElement.remove();
            alert(recitModCahierCanada.i18n.msgActionCompleted);
        };

        if(confirm(recitModCahierCanada.i18n.msgConfirmDeletion + "\n\n" + recitModCahierCanada.i18n.msgDeletionExtraInfo)){
            recit.http.WebApi.instance().removeCcCmNote(ccCmId, callback);
        }
    }

    saveCmNote(bindableData, ctrlTagList){
        let that = this;
        let callback = function(result){
            if(!result.success){
                alert(result.msg);
                return;
            }
    
            that.loadTags();
            bindableData.setData(result.data);
            alert(recitModCahierCanada.i18n.msgActionCompleted);
        };

        recit.http.WebApi.instance().saveCcCmNote(bindableData.rawData, ctrlTagList.getMetadata(), callback);
    }
}

recit.mod.cahiercanada.Main = class
{
    constructor(){
        this.dom = null;
        this.i18n = null;
        this.refs = {editor: null, personalNotes: null, editionMode: null, btnEditionMode: null};
        this.statusEditMode = false;
        this.studentId = 0;
        this.roles = [];
        
        this.init = this.init.bind(this);
        this.onBtnEditionModeClick = this.onBtnEditionModeClick.bind(this);
    }

    init(){
        this.dom = document.getElementById("recitCahierCanada");    
        this.i18n = M.str.recitcahiercanada;
        
        this.refs.editor = new recit.components.EditorDecorator('recitCCEditorContainer');

        this.studentId = this.dom.getAttribute('data-student-id');
        this.roles = this.dom.getAttribute('data-roles').split(",");

        this.refs.btnEditionMode = recit.components.createButton("", ["btn"], this.onBtnEditionModeClick, "fa-wrench");
        this.refs.btnEditionMode.style = 'display: block; margin-left: auto; margin-bottom: 3px;';

        this.refs.personalNotes = new recit.mod.cahiercanada.PersonalNotes(this.studentId);
        this.refs.personalNotes.init();

        this.refs.editionMode = new recit.mod.cahiercanada.EditionMode();
        this.refs.editionMode.init();

        this.refresh();
    }

    getEditor(){
        return this.refs.editor;
    }

    refreshBtnEditionMode(){       
        if(this.statusEditMode){
            this.refs.btnEditionMode.classList.remove("btn-warning");
            this.refs.btnEditionMode.classList.add("btn-danger");
            this.refs.btnEditionMode.childNodes[1].innerHTML = " " + this.i18n.turnOffEditingMode;
        }
        else{
            this.refs.btnEditionMode.classList.remove("btn-danger");
            this.refs.btnEditionMode.classList.add("btn-warning");
            this.refs.btnEditionMode.childNodes[1].innerHTML = " " + this.i18n.turnOnEditingMode;
        }
    }

    onBtnEditionModeClick(){
        this.statusEditMode = !this.statusEditMode;
        this.refresh();
    }

    clear(){
        while(this.dom.firstChild){
            this.dom.removeChild(this.dom.firstChild);
        }
    };

    refresh(){
        this.clear();

        if(this.checkRoles(recit.mod.cahiercanada.Main.rolesL2)){
            this.checkCCSeqPos();
            
            this.refreshBtnEditionMode();

            if(this.checkRoles(recit.mod.cahiercanada.Main.rolesL1)){
                this.dom.appendChild(this.refs.btnEditionMode);
            }
            else{
                this.statusEditMode = false;
            }
            
            if(this.statusEditMode){
                this.refs.editionMode.loadData();
                this.dom.appendChild(this.refs.editionMode.dom);
                this.refs.personalNotes.clear();
            }
            else{
                this.refs.personalNotes.loadData();
                this.dom.appendChild(this.refs.personalNotes.dom);
                this.refs.editionMode.clear();
            }
        }
        else{
            this.refs.personalNotes.loadData();
            this.dom.appendChild(this.refs.personalNotes.dom);
        }
    }

    checkCCSeqPos(){
        let params = recit.utils.getUrlVars();
        let that = this;
        recit.http.WebApi.instance().checkCCSeqPos(params.id, (result) => {
            if((result.success) && (!result.data)){
                alert(that.i18n.msgCCSeqPos);
            }
        });
    }

    checkRoles(r1){
        let r2 = this.roles;
        let a = new Set(r1);
        let b = new Set(r2);
        let intersection = new Set([...a].filter(x => b.has(x)));
        return intersection.size > 0;
    }
}

recit.mod.cahiercanada.Main.rolesL1 = ['ad', 'mg', 'cc', 'et'];
recit.mod.cahiercanada.Main.rolesL2 = ['ad', 'mg', 'cc', 'et', 'tc'];
recit.mod.cahiercanada.Main.rolesL3 = ['sd', 'gu', 'fp'];

var recitModCahierCanada = new recit.mod.cahiercanada.Main();

/*document.body.onload = () => function(){
    console.log("a");
    recitModCahierCanada.init();
}*/

//recit.utils.onDocumentReady(recitModCahierCanada.init);
