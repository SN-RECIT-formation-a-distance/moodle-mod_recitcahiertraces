export class EditorDecorator
{
    constructor(id){
        //this.atto = new Y.M.editor_atto.Editor({elementid: id});
//        this.atto.editor.setStyle('height', 200);        

        this.init = this.init.bind(this);
        this.onFocusOut = this.onFocusOut.bind(this);

		this.id = id;
        this.dom = document.getElementById(this.id);
        this.format = this.dom.getAttribute("data-format");
        this.onFocusOutCallback = null;

        this.init();
    }

    init(){
        switch(this.format){
            case 'atto_texteditor':
                let attoContent = this.dom.getElementsByClassName("editor_atto_content")[0];
                attoContent.onblur = this.onFocusOut;
                break;
        }
        
    }

    onFocusOut(){
        if(this.onFocusOutCallback !== null){
            this.onFocusOutCallback();
        }
    }

    show(){
        this.dom.style.display = 'block';
    }

    close(){
        this.setValue("");
        this.dom.style.display = 'none';
        document.body.appendChild(this.dom);
    }

    setValue(value){
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
                this.dom.querySelector(`[data-recit-rich-editor="content"]`).innerHTML = value;
                break;
            default: 
                alert("Editor: unknown format");
        }
    }

    getValue(){
        let result  = {text: "", format: "", itemid: 0};

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
                result.text = this.dom.querySelector(`[data-recit-rich-editor="content"]`).innerHTML;
                break;
            default: 
                return "Editor: unknown format";
        }

        return result;
    }
}