/**
 * @preserve
 * Recit Components
 * @namespace recit.components
  */
var recit = recit || {};
recit.components = recit.components || {};

/////////////////////////////////////////////////////////////////////////////////////////////////
// FACTORY
/////////////////////////////////////////////////////////////////////////////////////////////////

recit.components.createButton = function(text, classes, onClick, icon, iconPos){
    icon = icon || null;
    iconPos = (typeof iconPos === 'undefined' ? true : iconPos);

    let result = document.createElement("button");
    for(let c of classes){
        result.classList.add(c);
    }

    let desc = document.createElement("span");
    desc.innerHTML = text;
    result.appendChild(desc);

    if(icon !== null){
        let iconElem = document.createElement("i");
        iconElem.classList.add("fa");
        iconElem.setAttribute("aria-hidden", "true");
        iconElem.classList.add(icon);    
        desc.innerHTML = " " + desc.innerHTML;
        if(iconPos){
            desc.innerHTML = " " + desc.innerHTML;
            result.insertBefore(iconElem, desc);
        }
        else{
            desc.innerHTML =  desc.innerHTML + " ";
            result.appendChild(iconElem);
        }
        
    }
    
    result.onclick = onClick;
    result.type = 'button';

    return result;
}

recit.components.createFormControlText = function(labelText, name, value, helpText){
    let input = document.createElement("input");
    input.type = "text";
    input.classList.add("form-control");
    input.value = value;
    input.name = name;
    input.id = name;

    let result = recit.components.createFormGroup(labelText, input, helpText);

    return result;
}

recit.components.createFormGroup = function(labelText, control, helpText){
    helpText = helpText || "";

    let result = {container: null, label: null, input: null, help: null};
    result.container = document.createElement("div");
    result.container.classList.add("form-group");

    result.label = document.createElement("label");
    //result.label.setAttribute("for", name);
    result.label.innerHTML = labelText;
    result.container.appendChild(result.label);

    result.input = control;
    result.container.appendChild(result.input);

    result.help = document.createElement("small");
    result.help.classList.add("form-text");
    result.help.classList.add("text-muted");
    result.help.innerHTML = helpText;
    result.container.appendChild(result.help);

    return result;
}

/////////////////////////////////////////////////////////////////////////////////////////////////
// SELECT CTRL
/////////////////////////////////////////////////////////////////////////////////////////////////
recit.components.SelectCtrl = class
{
    constructor(id){
        id = id || null;
        this.dom = (id === null ? document.createElement("select") : document.getElementById(id));
        this.dom.classList.add('form-control');
        this.data = [];
        this.placeholder = true;
        this.placeholderDesc = "";
    }

    clear(){    
        while(this.dom.firstChild){
            this.dom.removeChild(this.dom.firstChild);
        }
    }

    disposeData(){
        this.data = [];
    }

    addItem(text, value, selected, group){
        this.data.push({"text": text, "value": value, group: group, "selected": selected});
    }
    
    refresh(){
        var option, index;
    
        // clean the container
        this.clear();
    
        // add the data
        if(this.placeholder){
            option = document.createElement("option");
            option.setAttribute("value", "");
            option.setAttribute("data-index", -1);
            option.setAttribute("disabled", "");
            option.setAttribute("selected", "");
            option.text = this.placeholderDesc;
            this.dom.add(option);
        }

        for(index = 0; index < this.data.length; index++){
            option = document.createElement("option");
            option.setAttribute("value", this.data[index].value.toString());
            option.setAttribute("data-index", index);
            option.text = this.data[index].text;
            
            if(this.data[index].selected){
                option.setAttribute("selected", "");
            }
            
            this.dom.add(option);
        }
    };
    
    selectedIndex(){
        let selectedIndex = this.dom.selectedIndex;

        if(selectedIndex == -1){ 
            return selectedIndex;
        }

        if(this.placeholder){
            selectedIndex--;
        }

        return selectedIndex;
    }

    getSelectedItem(){
        let selectedIndex = this.selectedIndex();
        if(selectedIndex < 0){ return null;}    
        return this.data[selectedIndex].value;
    }

    selectNext(){
        let selIndex = this.selectedIndex();
        if(selIndex < this.data.length - 1){
            if(this.data[selIndex]){
                this.data[selIndex].selected = false;
            }
            if(this.data[selIndex+1]){
                this.data[selIndex+1].selected = true;
                this.dom.onchange(this.data[selIndex+1].value);
            }
            
            this.refresh();            
        }
    }

    selectPrevious(){
        let selIndex = this.selectedIndex();
        if(selIndex > 0){
            if(this.data[selIndex]){
                this.data[selIndex].selected = false;
            }
            if(this.data[selIndex-1]){
                this.data[selIndex-1].selected = true;
                this.dom.onchange(this.data[selIndex-1].value);
            }
            
            this.refresh();
        }  
    }

    getNbItems(){
        return this.data.length;
    }

   /* setSelectedItem(value){
        let selectedIndex = this.selectedIndex();

        if(selectedIndex < 0){ return;}

        this.data[selectedIndex].value = value;
    }*/
};

/////////////////////////////////////////////////////////////////////////////////////////////////
// SELECT CTRL
/////////////////////////////////////////////////////////////////////////////////////////////////
recit.components.MultipleSelect = class
{
    constructor(){
        this.dom = null;
        this.refs = {choices: null, search: null, dropdownCont: null, dropdownList: null};
        this.data = [];
        
        this.onSelectItem = this.onSelectItem.bind(this);
        this.onDeleteItem = this.onDeleteItem.bind(this);
        
        this.init();
    }

    init(){
        let that = this;
        this.dom = document.createElement("div");
        this.dom.classList.add("MultipleSelect");
      //  this.observers = [];
        
        this.refs.choices = document.createElement("ul");
        this.refs.choices.classList.add("Choices");
        this.dom.appendChild(this.refs.choices);
        
        this.refs.search = document.createElement("li");
        this.refs.search.classList.add("Search");										
        this.refs.choices.appendChild(this.refs.search);
        
        let el = document.createElement("input");
        el.placeholder = "Type to search...";
        el.addEventListener("keyup", (event) => {that.refreshList();});
        el.addEventListener("focus", (event) => {that.refs.dropdownCont.setAttribute("data-status", 1);});
        el.addEventListener("blur", (event) => {
            setTimeout(function(){
                that.refs.dropdownCont.setAttribute("data-status", 0);
                el.value = "";
            }, 300
            );
        });
        this.refs.search.appendChild(el);
        
        this.refs.dropdownCont = document.createElement("div");
        this.refs.dropdownCont.classList.add("dropdownCont");					
        this.dom.appendChild(this.refs.dropdownCont);
        
        this.refs.dropdownList = document.createElement("ul");
        this.refs.dropdownList.classList.add("dropdownList");					
        this.refs.dropdownCont.appendChild(this.refs.dropdownList);
    }

   /* addObserver(callback){
        this.observers.push(callback);
    }*/

    setPlaceholder(text){
        this.refs.search.firstChild.placeholder = text;
    }

    addItem(text, value, selected, data){
        this.data.push({text: text, value: value, selected: selected, data: data});
     //   this.onDataChange();
        return this.data.length - 1;
    }

    /*onDataChange(){
        for(let callback of this.observers){
            callback();
        }
    }*/

   /* getSelectedValues(){
        let result = [];
        for(let item of this.data){
            if(item.selected){
                result.push(item.value);
            }
        }
        return result;
    }*/

    /*getSelectedItems(){
        let result = [];
        for(let item of this.data){
            result.push({text: item.text, value: item.value});
        }
        return result;
    }*/

    /*setSelectedValues(valueList){
        for(let item of this.data){
            item.selected = valueList.includes(item.value);
        }
        this.onDataChange();
    } */   
    
    refresh(){
        this.refs.search.firstChild.value = "";
        this.refreshList();
        this.refreshChoices();
    }
    
    refreshList(){			
        let that = this;
        let createItem = function(index, text, selected){
            let el = document.createElement("li");
            el.setAttribute("data-index", index);
            el.setAttribute("data-selected", (selected ? 1 : 0));
            el.innerHTML = text;
            el.addEventListener("click", () => that.onSelectItem(index));
            return el;
        }
        
        while(this.refs.dropdownList.firstChild){
            this.refs.dropdownList.removeChild(this.refs.dropdownList.firstChild);
        }
            
        let queryStr = this.refs.search.firstChild.value;
        for(let i = 0; i < this.data.length; i++){
            if(queryStr.length > 0){
                let str = this.data[i].text.toLowerCase();
                if(str.indexOf(queryStr) > -1){							
                    this.refs.dropdownList.appendChild(createItem(i, this.data[i].text, this.data[i].selected));
                }
            }
            else{
                this.refs.dropdownList.appendChild(createItem(i, this.data[i].text, this.data[i].selected));
            }
        }

        if(this.refs.dropdownList.children.length === 0){
            let el = document.createElement("li");
            el.setAttribute("data-index", -1);
            el.setAttribute("data-selected", 0);
            el.innerHTML = queryStr;
            el.addEventListener("click", () => {
                let index = that.addItem(queryStr, 0, false);
                that.onSelectItem(index)
            });
            this.refs.dropdownList.appendChild(el);
        }
    }
    
    refreshChoices(){
        while(this.refs.choices.firstChild){
            this.refs.choices.removeChild(this.refs.choices.firstChild);
        }
        
        for(let i = 0; i < this.data.length; i++){
            if(!this.data[i].selected){ continue; }
            
            let el = document.createElement("li");
            el.classList.add("Item");
            let desc = document.createElement("span");
            desc.innerHTML = this.data[i].text;
            el.appendChild(desc);
            
            let btn = document.createElement("span");
            btn.classList.add("Delete");
            btn.addEventListener("click", () => this.onDeleteItem(i));
            btn.innerHTML = " &#10006";
            el.appendChild(btn);
            this.refs.choices.appendChild(el);
        }	

        this.refs.choices.appendChild(this.refs.search);					
    }
    
    onSelectItem(index){
        //let index = parseInt(event.target.getAttribute("data-index"), 10);
        if(this.data[index].selected){return;}
        
        this.data[index].selected = true;
       // this.onDataChange();
        this.refresh();
    }
    
    onDeleteItem(index){
        this.data[index].selected = false;
        //this.onDataChange();
        this.refresh();
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////
// Moodle Tag
/////////////////////////////////////////////////////////////////////////////////////////////////
recit.components.MoodleTag = class
{
    constructor(){
        this.ctrl = new recit.components.MultipleSelect();
        this.instanceIds = [];
        this.component = "";
        this.itemType = "";
    }

    setPlaceholder(text){
        this.ctrl.setPlaceholder(text);
    }

    setDataProvider(dataProvider){
        for(let item of dataProvider){
            this.ctrl.addItem(item.tagName, item.tagId, false, item);
        }     
    }

    setValues(values){
        this.instanceIds = values;
        for(let item of this.ctrl.data){
            for(let value of this.instanceIds){
                if(item.data.instanceIds.includes(value)){
                    item.selected = true;
                }
            }
        }

        this.ctrl.refresh();
    }

    refresh(){
        this.ctrl.refresh();
    }

    getDom(){
        return this.ctrl.dom;
    }

    getMetadata(){
        let result = {add:[], update:[], delete:[]};

        for(let item of this.ctrl.data){
            if(item.selected){
                if(item.value === 0){
                    result.add.push({tagId: 0, tagName: item.text, component: this.component, itemType: this.itemType});
                }
                else{
                    result.update.push(item.data);
                }
            }
            else{
                for(let value of this.instanceIds){
                    if(item.data.instanceIds.includes(value)){
                        result.delete.push(item.data);
                    }
                }
            }
        }
        return result;
    }
}
/*
recit.components.DataList = class
{
    constructor(id){
        this.dom = document.createElement("div");
        this.dom.classList.add('form-control');
        this.refs = {input: document.createElement("input"), datalist: document.createElement("datalist")};
        this.refs.input.setAttribute('list', id+"list");
        this.refs.datalist.id = this.refs.input.getAttribute("list");
        this.dom.appendChild(this.refs.input);
        this.dom.appendChild(this.refs.datalist);

        this.data = [];
    }

    clear(){    
        this.refs.input.value = "";
        while(this.refs.datalist.firstChild){
            this.refs.datalist.removeChild(this.refs.datalist.firstChild);
        }
    }

    disposeData(){
        this.data = [];
    }

    addItem(text, value){
        this.data.push({"text": text, "value": value});
    }

    setPlaceholder(text){
        this.refs.input.placeholder = text;
    }
    
    refresh(){
        var option, index;
    
        // clean the container
        this.clear();

        for(index = 0; index < this.data.length; index++){
            option = document.createElement("option");
            option.setAttribute("value", this.data[index].value.toString());
            option.setAttribute("data-index", index);
            option.text = this.data[index].text;
            
            if(this.data[index].selected){
                option.setAttribute("selected", "");
            }
            
            this.refs.datalist.appendChild(option);
        }
    };
    
    
};*/

/////////////////////////////////////////////////////////////////////////////////////////////////
// DIALOG
/////////////////////////////////////////////////////////////////////////////////////////////////
recit.components.Dialog = class
{
    constructor(){
        this.dom = null;
        this.refs = {header: null, body: null, footer: null};

        this.init();
    }

    init(){
        // z-index = 1000 because the atto table window has z-index = 1036
        this.dom = document.createElement("div");
        this.dom.style = "position: absolute; top: 0; left: 0; z-index: 1000; display: block; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5)";

        let card = document.createElement("div");
        card.classList.add("recit-card");
        card.style = "width: fit-content; max-width: 1024px; min-width: 700px; position: relative; top: 50%; left: 50%; margin-right: -50%; transform: translate(-50%, -50%);"; 
        this.dom.appendChild(card);   

        this.refs.header = document.createElement("div");
        this.refs.header.classList.add("recit-card-header");
        card.appendChild(this.refs.header);

        this.refs.body = document.createElement("div");
        this.refs.body.classList.add('recit-card-body');
        card.appendChild(this.refs.body);

        this.refs.footer = document.createElement("div");
        this.refs.footer.classList.add('recit-card-footer');
        this.refs.footer.style = 'text-align: right;';
        card.appendChild(this.refs.footer);
    }

    setTitle(title){
        this.refs.header.innerHTML = title;
    }

    show(){
        document.body.appendChild(this.dom);
        //this.dom.style.top += document.scrollTop;
        //this.dom.style.top += window.scrollY / 2 + "px";
        this.dom.scrollIntoView();
    }

    close(){
        document.body.removeChild(this.dom);
    }

    appendOnBody(content){
        this.refs.body.appendChild(content);
    }

    appendOnFooter(content){
        this.refs.footer.appendChild(content);
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////
// BINDABLE DATA
/////////////////////////////////////////////////////////////////////////////////////////////////
recit.components.BindableData = class
{
    constructor(rawData){
        this.rawData = rawData;
        this.bindList = [];
    }

    makeBinding(dataField, element, elemField, handler){
        this.bindList.push({dataField: dataField, element: element, elemField: elemField, handler: handler || null});

        // two-way binding
        let that = this;
        if(element instanceof HTMLElement){
            element.onchange = function(event){
                that.rawData[dataField] = event.currentTarget.value;
            }
        }
        else if(element instanceof recit.components.MultipleSelect){
            element.addObserver(function(){
                that.rawData[dataField] = element.getSelectedValues();
            });
        }
    }

    getBinding(dataField){
        for(let item of this.bindList){
            if(item.dataField === dataField){
                return item;
            }
        }
        return null;
    }

    setData(rawData){
        this.rawData = rawData;

        for(let item of this.bindList){
            if(item.element instanceof HTMLElement){
                if(item.handler !== null){
                    item.element[item.elemField] = item.handler(this.rawData[item.dataField]);
                }
                else{
                    item.element[item.elemField] = this.rawData[item.dataField];
                }
            }
            else if(item.element instanceof recit.components.MultipleSelect){
                item.element.setSelectedValues(this.rawData[item.dataField]);
            }
        }
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////
// HTML TABLE
/////////////////////////////////////////////////////////////////////////////////////////////////
/**
 
 * @class HtmlTable
 */
recit.components.Table = class
{
    constructor(){
        this.dom = null;
        this.tHead = null;
        this.tBody = null;
        this.data = [];
        this.ordered = false;

        this.init();
    }

    init(){
        this.dom = document.createElement('table');
        this.dom.classList.add("table");

        this.tHead = document.createElement('thead');
        this.dom.appendChild(this.tHead);

        this.tBody = document.createElement('tbody');
        this.dom.appendChild(this.tBody);
    }

    orderBy(iCol){
        this.ordered = !this.ordered;

        for(let tbody of this.dom.tBodies){
            let len = tbody.rows.length;
            for (var i = len-1; i>=0; i--){
                for(var j = 1; j<=i; j++){
                    let str1 = tbody.rows[j-1].cells[iCol].innerHTML.toString();
                    let str2 = tbody.rows[j].cells[iCol].innerHTML.toString();
                    if(this.ordered){
                        if(str1.localeCompare(str2, 'en', {numeric: true}) < 0){
                            tbody.insertBefore(tbody.rows[j], tbody.rows[j-1]);
                        }
                    }
                    else{
                        if(str1.localeCompare(str2, 'en', {numeric: true}) > 0){
                            tbody.insertBefore(tbody.rows[j], tbody.rows[j-1]);
                        }
                    }
                }
            }
        }
    }

    addHeader(columns){
        let tr, th;
            
        while (this.tHead.firstChild !== null){ 
            this.tHead.removeChild(this.tHead.firstChild);
        }

        tr = document.createElement("tr");
        this.tHead.appendChild(tr);
    
        for(let i = 0; i < columns.length; i++){
            th = document.createElement('th');
            if(columns[i].orderBy){
                let link = document.createElement("a");
                link.innerHTML = columns[i].text; 
                link.href = "#";
                link.onclick = () => this.orderBy(i);
                th.appendChild(link);
            }
            else{
                th.innerHTML = columns[i].text; 
            }
            
            tr.appendChild(th);
        }
    }

    disposeData(){
        this.data = [];
    }

    addRow(columns){
        this.data.push(columns);
    }

    draw(setCellContent){
        setCellContent = setCellContent || null;

        var i, j, tr, td;

        if(this.data.length === 0){
            tr = document.createElement("tr");
            this.tBody.appendChild(tr);
            td = document.createElement('td');
            if(this.tHead.firstChild !== null){
                td.setAttribute("colSpan", this.tHead.firstChild.children.length);
            }
            setCellContent(td, null);
            tr.appendChild(td);   
            return;
        }
        
        for(i = 0; i < this.data.length; i++){
            tr = document.createElement("tr");
            this.tBody.appendChild(tr);
                
            for(j = 0; j < this.data[i].length; j++){
                td = document.createElement('td');               
                
                setCellContent(td, this.data[i][j]);
                tr.appendChild(td);    
            }
        }
    }

    clearRows(){   
        // delete the html rows
        while (this.dom.rows.length > 1){ 
            this.dom.deleteRow(1); 
        }
    };
}


/////////////////////////////////////////////////////////////////////////////////////////////////
// TILE 
/////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @class HtmlTile
 */
recit.components.Tile = class
{
    constructor(){
        this.dom = null;
        this.domHeader = null;
        this.domBody = null;
        this.title = "";
        this.data = [];
        this.init();
    }

    init(){
        this.dom = document.createElement('div');
        this.dom.classList.add("card");

        this.domHeader = document.createElement('div');
        this.domHeader.classList.add("card-header");
        this.dom.appendChild(this.domHeader);

        this.domBody = document.createElement('div');
        this.domBody.classList.add("card-body");
        this.domBody.style.display = "flex";
        this.domBody.style.flexWrap = "wrap"; 
        this.domBody.style.padding = "5px";
        this.dom.appendChild(this.domBody);
    }
    
    setTitle(title){
        this.title = title;
    }

    
    disposeData(){
        this.title = "";
        this.data = [];
    }
    

    addItem(data){
        this.data.push(data);
    }

    draw(setContent){        
        if(this.data.length === 0){
            let elem = document.createElement('div');
            setContent(elem, null);
            this.domBody.appendChild(elem);   
            return;
        }
        
        this.domHeader.innerHTML = this.title;

        for(let i = 0; i < this.data.length; i++){
            let elem = document.createElement("div");
            elem.style.fontWeight = "700"; 
            elem.style.fontSize = "15px";
            elem.style.flexGrow = "1";
            elem.style.padding = "8px"; 
            elem.style.borderRadius = "4px"; 
            elem.style.margin = "10px"; 
            elem.style.textAlign = "center"; 

            setContent(elem, this.data[i]);
            
            this.domBody.appendChild(elem);
        }
    }

    clear(){   
        this.domHeader.innerHTML = "";

        while (this.domBody.firstChild !== null){ 
            this.domBody.removeChild(this.domBody.firstChild);
        }
    };
}

/////////////////////////////////////////////////////////////////////////////////////////////////
// RICH EDITOR WRAPPER (Design Pattern Decorator)
/////////////////////////////////////////////////////////////////////////////////////////////////
recit.components.EditorDecorator = class
{
    constructor(id){
        //this.atto = new Y.M.editor_atto.Editor({elementid: id});
//        this.atto.editor.setStyle('height', 200);        

        this.dom = document.getElementById(id);
        this.format = this.dom.getAttribute("data-format");
    }

    show(){
        this.dom.style.display = 'block';
    }

    close(){
        this.setValue("");
    }

    setValue(value){
        switch(this.format){
            case 'atto_texteditor':
                this.dom.getElementsByClassName("editor_atto_content")[0].innerHTML = value;
                //this.atto.editor.setHTML(value);
                break;
            case 'tinymce_texteditor':
                // the tinymce does not work on the popup
                //this.dom.getElementsByTagName("textarea")[0].value = value;
                //tinymce.activeEditor.setContent(value);
                break;
            case 'textarea_texteditor':
                this.dom.getElementsByTagName("textarea")[0].value = value;
                break;
            default: 
                alert("Editor: unknown format");
        }
    }

    getValue(){
        switch(this.format){
            case 'atto_texteditor':
                return this.dom.getElementsByClassName("editor_atto_content")[0].innerHTML;
               // this.atto.editor.getHTML();
            case 'tinymce_texteditor':
               // return this.dom.getElementsByTagName("textarea")[0].value;
                return tinymce.activeEditor.getContent();
            case 'textarea_texteditor':
                return this.dom.getElementsByTagName("textarea")[0].value;
            default: 
                return "Editor: unknown format";
        }
    }
}