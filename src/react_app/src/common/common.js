//import Moment from 'moment'
import {I18n, UtilsMoodle} from "../libs/utils/Utils";
import {FeedbackCtrl} from "../libs/components/Feedback";
import {AppWebApi} from "./AppWebApi";

export * from "./Options";

/*export class AppCookies
{
    getLang(defaultValue){return Cookies.get('lang', defaultValue);}
    setLang(value){ Cookies.set('lang', value, 9999);}

    getSessionId(defaultValue){return Cookies.get('sid', defaultValue);}
    setSessionId(value){ Cookies.set('sid', value, 9999);}
}

export class Assets
{
 //  static about = require("../assets/about.png");
   // static customers = require('../assets/handshake.svg');
   static brand = require('../assets/eagle.png');
}*/
/*
export class AttoEditor{
    constructor(){
        this.dom = null;
        this.atto = null;
        this.ready = false;

        let tmp = document.createElement("div");
        tmp.setAttribute("id", "recitCTEditorContainer");
        document.body.appendChild(tmp);

        let that = this;

        YUI().use(['moodle-editor_atto-editor', 'Y.M.atto_vvvebjs'], function(Y) {
            let params = {
                'elementid': tmp.id,
                'contextid': 300,
                'autosaveEnabled': false,
                'autosaveFrequency': 0,
                'language': "fr_ca",
                'filepickeroptions': [],
                'plugins': {
                    group: {
                        group: "vvvebjs",
                        plugins: {
                            plugin: {name: "vvvebjs"}
                            }
                        }
                    }
                }
            
             /*   
                'autosaveEnabled': false,
                'autosaveFrequency': 0,
                'language': "fr_ca",
                'filepickeroptions': [],
                'plugins': [],
            }*/
                
            /*'content_css' =>  $this->page->theme->editor_css_url()->out(false),
            'contextid' => $context->id,
            'directionality' => get_string('thisdirection', 'langconfig'),
            'pageHash' => $pagehash,*/
        
            /*that.atto = new Y.M.editor_atto.Editor(params);                       

            that.dom = that.atto._wrapper._node;
            that.ready = true;
            console.log(that.atto);
        });
    }

    show(){
        if(!this.ready){return;}
        this.dom.style.display = 'block';
    }
  
    close(){
        if(!this.ready){return;}
        this.setValue("");
        this.dom.style.display = 'none';
    }
    
    setValue(value){
        if(!this.ready){return;}
        this.dom.getElementsByClassName("editor_atto_content")[0].innerHTML = value;
    }
  
    getValue(){
        if(!this.ready){return;}
        return this.dom.getElementsByClassName("editor_atto_content")[0].innerHTML;
    }
}
*/
export class EditorMoodle{
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
                console.log(this.format, value)
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

export const $glVars = {
    signedUser: {userId: 0, roles: []},
    feedback: new FeedbackCtrl(),
    i18n: new I18n(),
    webApi: new AppWebApi(),
    editorMoodle: new EditorMoodle()
  //cookies: new AppCookies()
}