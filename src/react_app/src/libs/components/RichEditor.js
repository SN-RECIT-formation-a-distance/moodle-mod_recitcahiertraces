import React, { Component } from 'react';
import TinyMCE from 'react-tinymce';

export class RichEditor extends Component {
    static defaultProps = {
        onChange: null,    
        value: null,
        name: "",
        height: 150
    };
    
    constructor(props){
        super(props);
        
        this.onChange = this.onChange.bind(this);
    }
    
    render() {    
        let config = {
            height: this.props.height,
            plugins: [
                'advlist autolink lists link charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table contextmenu paste code'
            ],
            menu: {},
            toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | preview',
            content_style: "a {text-decoration: underline;}",
            force_br_newlines : true,
            force_p_newlines : false,
            forced_root_block : '' // Needed for 3.x
        };    

        let main = 
                <TinyMCE content={this.props.value} config={config} onChange={this.onChange}/>;
        return (main);
    }   

    onChange(event){ 
        let data = {target:{name: this.props.name, value: event.target.getContent()}}; 
        this.props.onChange(data);
    }   
}