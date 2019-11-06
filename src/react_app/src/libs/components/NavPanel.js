import React, { Component } from 'react';

export class NavPanel extends Component{
    static defaultProps = {
        children: null,
        selectedIndex: null
    }

    renderChildren() {        
        return React.Children.map(this.props.children, (child, index) => {
            return React.cloneElement(child, {
                selected: (this.props.selectedIndex === index),
                index: index
            });
        });
    }

    render(){
        return (<ul className="NavPanel">{this.renderChildren()}</ul>);
    }
}

export class NavPanelItem extends Component{
    static defaultProps = {
        selected: false,
        index: -1,
        asset: null,
        shortDesc: "",
        fullDesc: "",
        onClick: null
    }

    render(){
        let main = 
            <li className="NavPanelItem" data-selected={(this.props.selected ? 1 : 0)} onClick={() => this.props.onClick(this.props.index)}>
                <span className="ShortDesc">{this.props.shortDesc}</span>
                <span className="FullDesc">{this.props.fullDesc}</span>
            </li>;
        return (main);
    }
}