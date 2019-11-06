import React, { Component } from 'react';
 
export class Tile extends Component {
    static defaultProps = {
        children: [],
        style: null
    };
    
    render() {
        return (
                <div className="Tile" style={this.props.style}>
                    {this.props.children}    
                </div>
      );
    }   
}

export class TileItem extends Component {
    static defaultProps = {
        text: "",
        value: "",
        icon: null,
        onClick: null
    };
    
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    render() {
        let icon = (this.props.icon !== null ?  <img src={this.props.icon} alt="icon" className="Image" /> : null);
        
        return (
                <div className="TileItem" onClick={this.onClick}>
                    {icon}
                    <span className="Description">{this.props.text}</span>
                </div>
        );
    }
    
    onClick(){
        if(this.props.onClick !== null){
            this.props.onClick(this.props.value);
        }
    }
};
