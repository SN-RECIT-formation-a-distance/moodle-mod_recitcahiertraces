import React, { Component } from 'react';
import { ButtonToolbar, ToggleButtonGroup, ToggleButton as BsToggleButton  } from 'react-bootstrap';

export class ToggleButtons extends Component {
    static defaultProps = {
        name: "",
        defaultValue: [],
        onChange: null,
        type: "checkbox", // checkbox | radio
        options: [], // {value: "", text:"", glyph: ""}
        bsSize: "", // "" | small
        style: null,
        disabled: false
    };

    constructor(props){
        super(props);

        this.onChange = this.onChange.bind(this);
        this.state = { value: props.defaultValue };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.defaultValue !== this.props.defaultValue) {
            this.setState({ value: this.props.defaultValue });
        }
    }

    render() {
        const valueArr = Array.isArray(this.state.value) ? this.state.value : [this.state.value];

        let main =
            <ButtonToolbar style={this.props.style} data-read-only={(this.props.disabled ? 1 : 0)}>
                <ToggleButtonGroup size={this.props.bsSize} type={this.props.type} name={this.props.name} value={this.state.value} onChange={this.onChange}>
                    {this.props.options.map((item, index) => {
                        let element =
                            <BsToggleButton id={`tbg-${this.props.name}-${index}`} key={index} variant={(valueArr.includes(item.value) ? "primary" : "secondary")} value={item.value} disabled={this.props.disabled}>
                                {item.text}
                            </BsToggleButton>;
                        return (element);
                    })}
                </ToggleButtonGroup>
            </ButtonToolbar>;
        return (main);
    }

    onChange(eventKey){
        this.setState({ value: eventKey });
        this.props.onChange({target: {value: eventKey, name: this.props.name}});
    }
}
