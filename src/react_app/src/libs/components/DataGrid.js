import React, { Component } from 'react';
import { Table, Button } from 'react-bootstrap';
import {faSort, faSortAmountUpAlt, faSortAmountDownAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class DataGrid extends Component {
    static defaultProps = {
        children: null,
        style: null,
        caption: "",
        orderBy: false
    };

    constructor(props){
        super(props);

        this.onOrderBy = this.onOrderBy.bind(this);

        this.state = {orderBy: {iCol: -1, direction: -1, apply: this.onOrderBy}}; // direction [1=ASC|-1=DESC]
    }

    renderChildren() {       
        return React.Children.map(this.props.children, (child, index) => {
            if(child.type.name === "Header"){
                return React.cloneElement(child, {
                    orderBy: this.getOrderBy()
                });
            }
            else{
                return React.cloneElement(child, {orderBy: this.state.orderBy});
            }
        });
    }

    render() {       
        let table = <Table striped bordered hover className="DataGrid" style={this.props.style}>
                        {this.props.caption.length > 0 && <caption>{this.props.caption}</caption>}
                        {this.renderChildren()}
                    </Table>;
                    
        return (table);
    }

    getOrderBy(){
        return (this.props.orderBy ? this.state.orderBy : null);
    }

    onOrderBy(iCol, direction){
        let orderBy = this.state.orderBy;
        
        // if it reorder the same column then it inverse the order
        orderBy.direction = direction; // (iCol === orderBy.iCol ? orderBy.direction * -1 : 1)
        orderBy.iCol = iCol;

        this.setState({orderBy: orderBy});
    }
};

class Header extends Component {
    static defaultProps = {
        children: null,
        orderBy: null
    };
    
    renderChildren() {        
        return React.Children.map(this.props.children, (child, index) => {
            return React.cloneElement(child, {
                orderBy: this.props.orderBy
            });
        });
    }
    
    render() {       
        return (<thead>{this.renderChildren()}</thead>);
    }
};

class Body extends Component {
    static defaultProps = {
        children: null,
        selectedIndex: -1,
        orderBy: null
    };
    
    static getDerivedStateFromProps(nextProps, prevState){
        return {nbRows: React.Children.count(nextProps.children)};
    }

    constructor(props, context){
        super(props, context);
        
        this.renderChildren = this.renderChildren.bind(this);
        this.compare = this.compare.bind(this);

        this.state = {nbRows: React.Children.count(this.props.children)};
    }
        
    renderChildren() {
        return React.Children.map(this.props.children, (child, index) => {
            return React.cloneElement(child, {
              index: index,
              selected: this.props.selectedIndex === index
            });
        });
    }
    
    render() {
        if(this.state.nbRows === 0){
            return (<caption style={{captionSide: "bottom"}}>No item</caption>);
        }
        else{
            //return (<tbody>{this.renderChildren()}</tbody>);
            let dataProvider = React.Children.toArray(this.renderChildren());

            if((this.props.orderBy !== null) && (this.props.orderBy.iCol >= 0)){
                dataProvider.sort(this.compare);
            }
                        
            return (<tbody>{dataProvider}</tbody>);
        }
    }

    compare(row1, row2){
        let cell1 = row1.props.children[this.props.orderBy.iCol];
        let cell2 = row2.props.children[this.props.orderBy.iCol];

        let str1 = "";
        if((cell1.props.sortValue !== null) && (cell1.props.sortValue.length > 0)){
            str1 = cell1.props.sortValue;
        }
        else if(cell1.props.children !== null){
            str1 =  cell1.props.children.toString();
        }

        let str2 = "";
        if((cell2.props.sortValue !== null) && (cell2.props.sortValue.length > 0)){
            str2 = cell2.props.sortValue;
        }
        else if(cell2.props.children !== null){
            str2 =  cell2.props.children.toString();
        }
        
        let result = str1.localeCompare(str2, "en", {numeric: true}) * this.props.orderBy.direction;
        
        return result;
    }
};

class HRow extends Component {
    static defaultProps = {
        children: null,
        orderBy: null
    };
       
    renderChildren() {        
        return React.Children.map(this.props.children, (child, index) => {
            if(child === null){ return (null); }

            return React.cloneElement(child, {
                iCol: index,
                orderBy: this.props.orderBy
            });
        });
    }
    
    render() {       
        return (<tr>{this.renderChildren()}</tr>);
    }    
};

class BRow extends Component {
    static defaultProps = {
        children: null,
        index: -1,
        selected: false,
        onClick: null,
        onDbClick: null,        
        style: null,
        alert: ""
    };
    
    constructor(props, context){
        super(props, context);
        
        this.onClick = this.onClick.bind(this);
        this.onDbClick = this.onDbClick.bind(this);
    }
       
    renderChildren() {        
        return React.Children.map(this.props.children, (child, index) => {
            if(child === null){ return (null); }

            return React.cloneElement(child, {
                iRow: this.props.index,
                iCol: index
            });
        });
    }
    
    render() {       
        return (
            <tr data-alert={this.props.alert} style={this.props.style} onClick={() => this.onClick()}  onDoubleClick={(event) => this.onDbClick(event)} data-selected={(this.props.selected ? 1 : 0)}>
                {this.renderChildren()}
            </tr>
        );
    }
    
    onClick(){
        if(this.props.onClick !== null){
            this.props.onClick(this.props.index);
        }        
    }
    
    onDbClick(event){        
        if(this.props.onDbClick !== null){
            this.props.onDbClick(this.props.index);
        }
    }
};

class ACell extends Component {
    getColSpan(){
        return (this.props.colSpan > 0 ? this.props.colSpan : "");
    }

    getRowSpan(){
        return (this.props.rowSpan > 0 ? this.props.rowSpan : "");
    }
};

class HCell extends ACell{
    static defaultProps = {
        children: null,
        style: null,
        colSpan: 0,
        rowSpan: 0,
        iRow: -1,
        iCol: -1,
        orderBy: null
    };

    constructor(props){
        super(props);

        this.onSort = this.onSort.bind(this);
        this.getBtnOrderBy = this.getBtnOrderBy.bind(this);
    }

    render() {    
        let style = (this.props.style || {}).nxClone();
        style.position = "relative";

        let main = 
            <th colSpan={this.getColSpan()} rowSpan={this.getRowSpan()} style={style}>
                {(this.props.children || "").toString()}
                {this.getBtnOrderBy()}
            </th>

        return (main);
    }

    getBtnOrderBy(){
        let result =  null;

        if(this.props.children === null) {return result;}
        if(this.props.orderBy === null) {return result;}

        let glyph = null;
        let direction = this.props.orderBy.direction * -1;
        if(this.props.orderBy.iCol !== this.props.iCol){
            glyph = <FontAwesomeIcon icon={faSort}/>; //<Glyphicon glyph="sort"/>;
            direction = 1;
        }
        else if(this.props.orderBy.direction > 0){
            glyph = <FontAwesomeIcon icon={faSortAmountUpAlt}  />//<Glyphicon glyph="sort-by-attributes"/>;
        }
        else{
            glyph = <FontAwesomeIcon icon={faSortAmountDownAlt} />;//<Glyphicon glyph="sort-by-attributes-alt"/>;
        }

        return <Button className='BtnSort' size='sm' variant="default" onClick={() => this.onSort(direction)}>{glyph}</Button>;
    }

    onSort(direction){
        this.props.orderBy.apply(this.props.iCol, direction);
    }
}

class BCell extends ACell {
    static defaultProps = {
        children: null,
        style: null,
        dataType: "string",
        colSpan: 0,
        rowSpan: 0,
        alert: "",
        onClick: null,
        iRow: -1,
        iCol: -1,
        sortValue: ""
    };
    
    render() {    
        let cellContent = "";
        
        switch(this.props.dataType){
            case 'boolean':
                cellContent = this.getBooleanCell();
                break;
            case "html":
                return (<td style={this.props.style}  data-alert={this.props.alert} dangerouslySetInnerHTML={{__html: this.props.children}}></td>);
            default:
                cellContent = this.getStringCell();
        }

        return (<td data-alert={this.props.alert} colSpan={this.getColSpan()} rowSpan={this.getRowSpan()} style={this.props.style}>{cellContent}</td>);
    }

    getBooleanCell(){
        //return (Boolean(Number(this.props.children)) ?  <Glyphicon glyph="ok" /> : <Glyphicon glyph="unchecked" />);
        return (Boolean(Number(this.props.children)) ?   <FontAwesomeIcon icon={['fad', 'stroopwafel']} size="4x" style={{ '--fa-primary-color': 'red' }} />:  <FontAwesomeIcon icon={['fad', 'stroopwafel']} size="4x" style={{ '--fa-primary-color': 'red' }} />);
    }

    getStringCell(){
        return this.props.children || "";
    }
};

DataGrid.Header = Header;
DataGrid.Header.Row = HRow;
DataGrid.Header.Cell = HCell;
DataGrid.Body = Body;
DataGrid.Body.Row = BRow;
DataGrid.Body.Cell = BCell;
