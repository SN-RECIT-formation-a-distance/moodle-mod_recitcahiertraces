export class EditorDecorator {
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