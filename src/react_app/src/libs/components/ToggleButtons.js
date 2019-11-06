import React, { Component } from 'react';
import { ButtonToolbar, ToggleButtonGroup, ToggleButton as BsToggleButton, Glyphicon  } from 'react-bootstrap';

export class ToggleButtons extends Component {
    static defaultProps = {
        name: "",
        defaultValue: [],
        onChange: null,
        type: "checkbox", // checkbox | radio
        options: [], // {value: "", text:"", glyph: ""}
        bsSize: "", // "" | small
        style: null
    };
      
    constructor(props){
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    render() {       
        let main = 
            <ButtonToolbar style={this.props.style}>                        
                <ToggleButtonGroup bsSize={this.props.bsSize} type={this.props.type} name={this.props.name} defaultValue={this.props.defaultValue} onChange={this.onChange}>                                
                    {this.props.options.map((item, index) => {   
                        item.glyph = item.glyph || null;
                        
                        let element = 
                            <BsToggleButton key={index} bsStyle={(this.props.defaultValue.includes(item.value) ? "primary" : "default")} value={item.value}>
                                {item.glyph && <Glyphicon glyph={item.glyph}/>}
                                {" " + item.text}
                            </BsToggleButton>;
                        return (element);
                    })}                                    
                </ToggleButtonGroup>
            </ButtonToolbar>;
        return (main);
    }   
    
    onChange(eventKey){ 
        this.props.onChange({target: {value: eventKey, name: this.props.name}});
    }   
}
