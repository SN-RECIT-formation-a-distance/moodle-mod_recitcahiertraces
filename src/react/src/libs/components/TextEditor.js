import React, { useState } from 'react';
import ReactQuill, {Quill} from 'react-quill-new';
import QuillTableBetter from 'quill-table-better';
import { Button, ButtonGroup} from 'react-bootstrap';
import {faCode, faEye, faPencilAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CodeMirror from '@uiw/react-codemirror';
import { html, htmlLanguage } from '@codemirror/lang-html';
import { EditorView } from '@codemirror/view';
import 'react-quill-new/dist/quill.snow.css';
import 'quill-table-better/dist/quill-table-better.css'
var beautifyingHTML = require("pretty");

Quill.register({
  'modules/table-better': QuillTableBetter
}, true);


export class TextEditor extends React.Component {
    static id = 0;
    static defaultProps = {
        onClose: null,
        onSave: null,
        element: null,
        height: '275px',
        quillOnly: true,
    };


    constructor(props){
        super(props);

        this.editorRef = React.createRef();
        this.id = TextEditor.id;
        TextEditor.id = this.id + 1;

        this.initModules();
        this.state = {view: 'source'};
    }

    componentDidMount(){
        let view = this.props.value.length > 1 ? 'preview' : 'text';
        if (this.props.quillOnly){
            view = 'text';
        }
        this.setState({view: view})
    }

    render(){ 

       let src = <>
       <CodeMirror height={this.props.height} 
       value={beautifyingHTML(this.props.value, {ocd: true})}
       options={{
         mode: 'htmlmixed',
         lineNumbers: true,
         lineWrapping: true
       }}
        extensions={[html({ base: htmlLanguage }), EditorView.lineWrapping]}
        onChange={(e) => this.props.onChange(e)} />
        </>;
            
        return <>
            {!this.props.quillOnly && <ButtonGroup className="mb-2">
                <Button title='Afficher éditeur' variant={this.state.view == 'text' ? 'primary' : 'secondary'} onClick={() => this.setState({view: 'text'})}><FontAwesomeIcon icon={faPencilAlt}/> Éditeur</Button>
                <Button title='Afficher le code source' variant={this.state.view == 'source' ? 'primary' : 'secondary'} onClick={() => this.setState({view: 'source'})}><FontAwesomeIcon icon={faCode}/> Code source</Button>
                <Button title='Aperçu' variant={this.state.view == 'preview' ? 'primary' : 'secondary'} onClick={() => this.setState({view: 'preview'})}><FontAwesomeIcon icon={faEye}/> Aperçu</Button>
            </ButtonGroup>}

            {this.state.view == 'source' && src}
            
            {this.state.view == 'text' && <>
                    <ReactQuill {...this.props} modules={this.modules} ref={this.editorRef}/>
                </>}
            
            {this.state.view == 'preview' && 
                <div dangerouslySetInnerHTML={{__html: this.props.value}} style={{overflow: 'hidden', maxWidth: '100%'}}></div>}
            </>;
    }

    initModules(){
        const toolbarOptions = [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons 
          [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
          ['table-better'],
          [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
          [{ 'direction': 'rtl' }],                         // text direction
        
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        
          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          [{ 'font': [] }],
          [{ 'align': [] }],
        
          ['clean'],                                        // remove formatting button
        ];
        
        this.modules = {
            'table-better': {
              toolbarTable: true,
              menus: ['column', 'row', 'merge', 'table', 'cell', 'wrap', 'copy', 'delete'],
            },
            keyboard: {
              bindings: QuillTableBetter.keyboardBindings
            },
            toolbar: toolbarOptions,
        }
    }
}
 