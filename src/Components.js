/**
 * @preserve
 * Recit Components
 * @namespace recit.components
  */
var recit = recit || {};
recit.components = recit.components || {};

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
        this.domHeader.innerHTML = this.title;
        
        if(this.data.length === 0){
            let elem = document.createElement('div');
            setContent(elem, null);
            this.domBody.appendChild(elem);   
            return;
        }                

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
        this.init = this.init.bind(this);
        this.onFocusOut = this.onFocusOut.bind(this);

		this.id = id;
        this.dom = document.getElementById(this.id);
        this.format = this.dom.getAttribute("data-format");
        this.onFocusOutCallback = null;

        this.init();
    }

    checkDom(){
        return (this.dom !== null);
    }

    init(){
        if(!this.checkDom()){ return; }

        switch(this.format){
            case 'atto_texteditor':
                break;
            case 'recit_rich_editor': // created manually
                window.RecitRichEditorCreateInstance(this.dom, null, 'word');
                break;
            case 'recit_texteditor':    // created by Utils.createEditor
                break;
        }
    }

    onFocusOut(){
        if(!this.checkDom()){ return; }

        if(this.onFocusOutCallback !== null){
            this.onFocusOutCallback();
        }
    }

    show(){
        if(!this.checkDom()){ return; }
        
        switch(this.format){
            case 'atto_texteditor':
                let attoContent = this.dom.querySelector(".editor_atto_content");
            
                if(attoContent.onblur === null){
                    attoContent.onblur = this.onFocusOut;
                }
                break;
        }

        this.dom.style.display = 'block';
    }

    close(){
        this.setValue("");
    }

    setValue(value){
        if(!this.checkDom()){ return; }

        switch(this.format){
            case 'atto_texteditor':
                this.dom.getElementsByClassName("editor_atto_content")[0].innerHTML = value;
                this.dom.querySelector(`[name="${this.id}[text]"]`).value = value;
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
            case 'recit_rich_editor':
            case 'recit_texteditor':
                this.dom.querySelector(`[data-recit-rich-editor="content"]`).innerHTML = value;
                break;
            default: 
                alert("Editor: unknown format");
        }
    }

    getValue(){        
        let result  = {text: "", format: "", itemid: 0};

        if(!this.checkDom()){ return result; }

        switch(this.format){
            case 'atto_texteditor':
				for(let attr in result){
					let name = `${this.id}[${attr}]`;
					let el = this.dom.querySelector(`[name="${name}"]`);
					if(el !== null){
						result[attr] = el.value;
                    }
                }
                break;
            case 'tinymce_texteditor':
                result.text = tinymce.activeEditor.getContent();
                break;
            case 'textarea_texteditor':
                result.text = this.dom.getElementsByTagName("textarea")[0].value;
                break;
            case 'recit_rich_editor':
            case 'recit_texteditor':
                result.text = this.dom.querySelector(`[data-recit-rich-editor="content"]`).innerHTML;
                break;
            default: 
                alert("Editor: unknown format");
        }

        return result;
    }
}