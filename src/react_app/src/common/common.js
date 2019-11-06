//import Moment from 'moment'
import {I18n} from "../libs/utils/Utils";
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

export class EditorMoodle{
  constructor(id){
      this.dom = document.getElementById(id || 'recitCCEditorContainer');
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

export const $glVars = {
    signedUser: {userId: 0, roles: []},
    feedback: new FeedbackCtrl(),
    i18n: new I18n(),
    webApi: new AppWebApi(),
    editorMoodle: new EditorMoodle()
  //cookies: new AppCookies()
}