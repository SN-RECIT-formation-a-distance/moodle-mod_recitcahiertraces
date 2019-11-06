import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {  Navbar, FormGroup, FormControl, Glyphicon, InputGroup } from 'react-bootstrap';

export class ControlBar extends Component {
    static defaultProps = {
        breadCrumb: null,
        enableSearch: false,
        onSearchHandler: null,
        toolBar: null,
        className: ""
    };
    
    constructor(props){
        super(props);
        
        this.onHomeClick = this.onHomeClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSearchKeyUp = this.onSearchKeyUp.bind(this);
        this.onSearchClick = this.onSearchClick.bind(this);
        
        this.state = {queryStr: ""};
    }
    
    render() {
        let search = null;
        if(this.props.enableSearch){
            search =  <Navbar.Form pullLeft>
                        <FormGroup>
                            <InputGroup>
                                <FormControl type="text" value={this.state.queryStr} placeholder="Search" onKeyUp={this.onSearchKeyUp} onChange={this.onChange} />
                                <InputGroup.Addon onClick={() => this.onSearchClick()}>
                                    <Glyphicon glyph="search" />
                                </InputGroup.Addon>
                            </InputGroup>
                        </FormGroup>
                    </Navbar.Form>;
        }

        let navbar = 
                <Navbar collapseOnSelect fluid className={"ControlBar " + this.props.className}>
                    <Navbar.Collapse>
                        <Navbar.Header>
                            {this.props.breadCrumb !== null && <Breadcrumb dataProvider={this.props.breadCrumb}/>}
                        </Navbar.Header>
                        {search}
                        {this.props.toolBar}  
                    </Navbar.Collapse>
                </Navbar>;
            
        return (navbar);
    }
    
    onHomeClick(event){
        event.preventDefault();
        this.props.onHomeClick();
    }
    
    onChange(event){
        this.setState({queryStr: event.target.value});
    }
    
    onSearchClick(){
        if(this.state.queryStr.length > 0){
            this.props.onSearchHandler.call(this, this.state.queryStr);
        }
    }
    
    onSearchKeyUp(event){
        // waiting the enter key
        if (event.keyCode !== 13) {
            return;
        }

        // if the string is empty we get out
        if (event.target.value.length === 0) {
            return;
        }

        this.props.onSearchHandler.call(this, this.state.queryStr);
    }
}

class Breadcrumb extends Component{
    static defaultProps = {
        dataProvider: [], // [{pathname: '', desc: ''}]
        separator: "/"
    };

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.dataProvider !== null){
            let newData = [];
            for(let i = 0; i < nextProps.dataProvider.length; i++){
                newData.push(nextProps.dataProvider[i]);
                newData.push(null); // add the separator
            }
            
            newData.pop(); // remove the last separator

            return({dataProvider: newData});
        }
        return null;
    }

    constructor(props){
        super(props);
        
        this.state = {dataProvider: []};
    }

    render() {
        let main = 
            <ul className={"Breadcrumb"}>        
                {this.state.dataProvider.map((route, index) => {   
                    let component = null;                                        
                    let className = "Item";

                    // first breadcrumb item
                    if(index === 0){
                        component = <Link to={route.pathname}><Glyphicon glyph="home" /></Link>;
                    }                    
                    // separator
                    else if(route === null){
                        component = (index === 1 ? "" : this.props.separator);
                        className = "Separator";
                    }
                    // last breadcrumb item
                    else if(index === this.state.dataProvider.length - 1){
                        component= route.desc; 
                    }
                    // others breadcrumb items
                    else{
                        component = <Link to={route.pathname}>{route.desc}</Link>;
                    }

                    let main = <li key={index} className={className}>{component}</li>;

                    return (main);
                })}
            </ul>;
            
        return (main);
    }
}