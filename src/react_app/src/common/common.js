//import Moment from 'moment'
import {I18n} from "../libs/utils/Utils";
import {FeedbackCtrl} from "../libs/components/Feedback";
import {AppWebApi} from "./AppWebApi";

export * from "./Options";

/*export class EditorMoodle{
    constructor(id){
        this.id = id || "recitCCEditorContainer";
        this.dom = null;
        this.format = null;
        this.count = 0;

        this.init = this.init.bind(this);

        this.init();
    }

    init(){
        this.dom = document.getElementById(this.id);
        console.log("Loading Editor Moodle...");

        this.count++;

        if(this.count >= 10){ return console.log("Failure no loading Editor Moodle..."); }

        if(this.dom === null){
            window.setTimeout(this.init, 500);
            return;
        }

        this.format = this.dom.getAttribute("data-format");
    }

    show(){
        this.dom.style.display = 'block';
    }

    close(){
        this.setValue("");
        this.dom.style.display = 'none';
        document.body.appendChild(this.dom);
    }

    dispose(){
        this.dom.remove();
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
}*/

export const $glVars = {
    signedUser: {userId: 0, roles: []},
    feedback: new FeedbackCtrl(),
    i18n: new I18n(),
    webApi: new AppWebApi(),
    urlParams: {}
}