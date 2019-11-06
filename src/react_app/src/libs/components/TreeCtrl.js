import React, { Component } from 'react';
import ProLib from '../ProLib';

export class TreeCtrl extends Component{
    static Layout = {
        Default: "",
        Menu: "menu"
    }
    
    static defaultProps = {
        selectedId: 0,
        layout: "",
        striped: false,
        onClick: null,
        onDbClick: null,
        children: null
    };
    
    constructor(props){
        super(props);

        this.lastId = 0;
        this.state = {};
    }
    
    renderChildrenRec(children) {
        return React.Children.map(children, child => {
            if (!React.isValidElement(child)) {
                return child;
            }

            let id = this.lastId++;
            
            if (child.props.children) {
                child = React.cloneElement(child, {
                    children: this.renderChildrenRec(child.props.children),
                    onClick: this.props.onClick,
                    onDbClick: this.props.onDbClick,
                    id: id,
                    selected: id === this.props.selectedId
                });
            }

            return child;
        });
    }
    
    render() {       
        let tree = <div className={"TreeCtrl"} data-layout={this.props.layout} data-striped={(this.props.striped ? 1 : 0)}>{this.renderChildrenRec(this.props.children)}</div>;
        
        this.lastId = 1;
        
        return (tree);
    }    
};


export class TreeNode extends Component {
    static defaultProps = {
        id: 0,
        data: null,
        desc: "",
        customDesc: null,
        depth: 1,
        selected: false,
        onClick: null,
        onDbClick: null,
        children: []
    };
    
    constructor(props){
        super(props);
    
        this.onClick = this.onClick.bind(this);  
        this.onDbClick = this.onDbClick.bind(this);
        this.onExpandCollapse = this.onExpandCollapse.bind(this);
        this.renderChildren = this.renderChildren.bind(this);
        
        this.state = {collapsed: false};
    }
    
     renderChildren() {        
        return React.Children.map(this.props.children, (child, index) => {
            return React.cloneElement(child, {
                depth: child.props.depth + 1
            });
        });
    }
    
    render(){
        let main = null;
        if((this.props.depth === 1) || (this.props.children.length > 0)){
            let iconCollapse = ProLib.assets.arrowBottom;
            let iconExpand = ProLib.assets.arrowRight;
            let iconExpandCollapse = (this.state.collapsed ? iconExpand : iconCollapse);
            main = <div className="Branch" data-selected={(this.props.selected ? 1 : 0)}>
                <div className='Content' onClick={this.onClick} onDoubleClick={this.onDbClick}>
                    <img src={iconExpandCollapse} alt={""} onClick={this.onExpandCollapse} className="ImgExpandCollapse"/>
                    <div className='Description'>{this.showDesc()}</div>
                </div>
                {!this.state.collapsed && this.renderChildren()}
            </div>
        }
        else{
            main = 
            <div className="Leaf" data-selected={(this.props.selected ? 1 : 0)} onClick={this.onClick} onDoubleClick={this.onDbClick}>
                <div className='Content'>
                    <div className='Description'>{this.showDesc()}</div>
                </div>
            </div>
        }
        
        return (main);
    }
    
    showDesc(){
        return (this.props.customDesc === null ? this.props.desc : this.props.customDesc(this.props.data));
    }
    
    onClick(event){
        if(this.props.onClick !== null){
            this.props.onClick(this.props.id, this.props.data);
        }
        event.stopPropagation();
    }
    
    onDbClick(event){
        if(this.props.onDbClick !== null){
            this.props.onDbClick(this.props.id, this.props.data);
        }
        event.stopPropagation();
    }
    
    onExpandCollapse(){
        this.setState({collapsed: !this.state.collapsed});
        //event.stopPropagation();
    }
};
