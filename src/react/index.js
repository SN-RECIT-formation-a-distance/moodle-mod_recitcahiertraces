require("./index.css");
var $ltMAx$reactjsxruntime = require("react/jsx-runtime");
var $ltMAx$react = require("react");
var $ltMAx$reactdomclient = require("react-dom/client");
var $ltMAx$fortawesomefreesolidsvgicons = require("@fortawesome/free-solid-svg-icons");
var $ltMAx$fortawesomereactfontawesome = require("@fortawesome/react-fontawesome");
var $ltMAx$reactbootstrap = require("react-bootstrap");


function $parcel$exportWildcard(dest, source) {
  Object.keys(source).forEach(function(key) {
    if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function get() {
        return source[key];
      }
    });
  });

  return dest;
}

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
/**
 *
 * @package   mod_recitcahiertraces
 * @copyright 2019 RÉCIT 
 * @license   {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */ 




//////////////////////////////////////////////////
// Note: the "export *" will only export the classes marqued with "export" in their definition
//////////////////////////////////////////////////




class $35da119215127171$export$72b9695b8216309a extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        onChange: null,
        value: "",
        name: "",
        disabled: false,
        multiple: false,
        required: false,
        size: 1,
        placeholder: "",
        options: [],
        style: null,
        selectedIndex: -1
    };
    constructor(props){
        super(props);
        this.onChange = this.onChange.bind(this);
    }
    render() {
        //  spread attributes <div {...this.props}>    
        let spreadAttr = {
            required: this.props.required,
            multiple: this.props.multiple,
            disabled: this.props.disabled,
            size: this.props.size
        };
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Form).Control, {
            as: "select",
            ...spreadAttr,
            onChange: this.onChange,
            value: this.props.value,
            style: this.props.style,
            children: [
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("option", {
                    value: "",
                    children: this.props.placeholder
                }),
                this.props.options.map(function(item, index) {
                    return /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("option", {
                        value: item.value,
                        children: item.text
                    }, index);
                })
            ]
        });
        return main;
    }
    onChange(event) {
        let value = event.target.value || "";
        let selectedIndex = event.target.selectedIndex - 1; // -1 because of the placeholder (first option)
        let text = "";
        let data = null;
        if (selectedIndex >= 0 && selectedIndex < this.props.options.length) {
            data = this.props.options[selectedIndex].data;
            text = this.props.options[selectedIndex].text;
        }
        this.props.onChange({
            target: {
                name: this.props.name,
                value: value,
                text: text,
                data: data,
                index: selectedIndex
            }
        });
    }
}







var $b3fbe7ab0c1d37e9$exports = {};

$parcel$export($b3fbe7ab0c1d37e9$exports, "i18n", () => $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168);
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
/**
 *
 * @package   mod_recitcahiertraces
 * @copyright 2019 RÉCIT 
 * @license   {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */ class $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168 {
    static get_string(str) {
        //if (!document.lang) document.lang = ""
        let res = M.util.get_string(str, 'mod_recitcahiertraces');
        //if (res.startsWith('[[')) document.lang += "'"+str+"',"+'\n'
        //if (res.startsWith('[[')) document.lang += "$string['"+str+"'] = '';"+'\n'
        return res;
    }
}


class $2d4e58d7a4dff333$export$c8dd51eb24f71762 extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        children: null,
        style: null,
        caption: "",
        orderBy: false
    };
    constructor(props){
        super(props);
        this.onOrderBy = this.onOrderBy.bind(this);
        this.state = {
            orderBy: {
                iCol: -1,
                direction: -1,
                apply: this.onOrderBy
            }
        }; // direction [1=ASC|-1=DESC]
    }
    renderChildren() {
        return (0, ($parcel$interopDefault($ltMAx$react))).Children.map(this.props.children, (child, index)=>{
            if (child.type.name === "Header") return /*#__PURE__*/ (0, ($parcel$interopDefault($ltMAx$react))).cloneElement(child, {
                orderBy: this.getOrderBy()
            });
            else return /*#__PURE__*/ (0, ($parcel$interopDefault($ltMAx$react))).cloneElement(child, {
                orderBy: this.state.orderBy
            });
        });
    }
    render() {
        let table = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Table), {
            striped: true,
            bordered: true,
            hover: true,
            className: "DataGrid",
            style: this.props.style,
            children: [
                this.props.caption.length > 0 && /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("caption", {
                    children: this.props.caption
                }),
                this.renderChildren()
            ]
        });
        return table;
    }
    getOrderBy() {
        return this.props.orderBy ? this.state.orderBy : null;
    }
    onOrderBy(iCol, direction) {
        let orderBy = this.state.orderBy;
        // if it reorder the same column then it inverse the order
        orderBy.direction = direction; // (iCol === orderBy.iCol ? orderBy.direction * -1 : 1)
        orderBy.iCol = iCol;
        this.setState({
            orderBy: orderBy
        });
    }
}
class $2d4e58d7a4dff333$var$Header extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        children: null,
        orderBy: null
    };
    renderChildren() {
        return (0, ($parcel$interopDefault($ltMAx$react))).Children.map(this.props.children, (child, index)=>{
            return /*#__PURE__*/ (0, ($parcel$interopDefault($ltMAx$react))).cloneElement(child, {
                orderBy: this.props.orderBy
            });
        });
    }
    render() {
        return /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("thead", {
            children: this.renderChildren()
        });
    }
}
class $2d4e58d7a4dff333$var$Body extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        children: null,
        selectedIndex: -1,
        orderBy: null
    };
    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            nbRows: (0, ($parcel$interopDefault($ltMAx$react))).Children.count(nextProps.children)
        };
    }
    constructor(props, context){
        super(props, context);
        this.renderChildren = this.renderChildren.bind(this);
        this.compare = this.compare.bind(this);
        this.state = {
            nbRows: (0, ($parcel$interopDefault($ltMAx$react))).Children.count(this.props.children)
        };
    }
    renderChildren() {
        return (0, ($parcel$interopDefault($ltMAx$react))).Children.map(this.props.children, (child, index)=>{
            return /*#__PURE__*/ (0, ($parcel$interopDefault($ltMAx$react))).cloneElement(child, {
                index: index,
                selected: this.props.selectedIndex === index
            });
        });
    }
    render() {
        if (this.state.nbRows === 0) return /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("caption", {
            style: {
                captionSide: "bottom"
            },
            children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('nodata')
        });
        else {
            //return (<tbody>{this.renderChildren()}</tbody>);
            let dataProvider = (0, ($parcel$interopDefault($ltMAx$react))).Children.toArray(this.renderChildren());
            if (this.props.orderBy !== null && this.props.orderBy.iCol >= 0) dataProvider.sort(this.compare);
            return /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("tbody", {
                children: dataProvider
            });
        }
    }
    compare(row1, row2) {
        let cell1 = row1.props.children[this.props.orderBy.iCol];
        let cell2 = row2.props.children[this.props.orderBy.iCol];
        let str1 = "";
        if (cell1.props.sortValue !== null && cell1.props.sortValue.toString().length > 0) str1 = cell1.props.sortValue.toString();
        else if (cell1.props.children !== null) str1 = cell1.props.children.toString();
        let str2 = "";
        if (cell2.props.sortValue !== null && cell2.props.sortValue.toString().length > 0) str2 = cell2.props.sortValue.toString();
        else if (cell2.props.children !== null) str2 = cell2.props.children.toString();
        let result = str1.localeCompare(str2, "en", {
            numeric: true
        }) * this.props.orderBy.direction;
        return result;
    }
}
class $2d4e58d7a4dff333$var$HRow extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        children: null,
        orderBy: null
    };
    renderChildren() {
        return (0, ($parcel$interopDefault($ltMAx$react))).Children.map(this.props.children, (child, index)=>{
            if (child === null) return null;
            return /*#__PURE__*/ (0, ($parcel$interopDefault($ltMAx$react))).cloneElement(child, {
                iCol: index,
                orderBy: this.props.orderBy
            });
        });
    }
    render() {
        return /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("tr", {
            children: this.renderChildren()
        });
    }
}
class $2d4e58d7a4dff333$var$BRow extends (0, $ltMAx$react.Component) {
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
        return (0, ($parcel$interopDefault($ltMAx$react))).Children.map(this.props.children, (child, index)=>{
            if (child === null) return null;
            return /*#__PURE__*/ (0, ($parcel$interopDefault($ltMAx$react))).cloneElement(child, {
                iRow: this.props.index,
                iCol: index
            });
        });
    }
    render() {
        return /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("tr", {
            "data-alert": this.props.alert,
            style: this.props.style,
            onClick: ()=>this.onClick(),
            onDoubleClick: (event)=>this.onDbClick(event),
            "data-selected": this.props.selected ? 1 : 0,
            children: this.renderChildren()
        });
    }
    onClick() {
        if (this.props.onClick !== null) this.props.onClick(this.props.index);
    }
    onDbClick(event) {
        if (this.props.onDbClick !== null) this.props.onDbClick(this.props.index);
    }
}
class $2d4e58d7a4dff333$var$BRowDraggable extends $2d4e58d7a4dff333$var$BRow {
    static defaultProps = {
        children: null,
        index: -1,
        selected: false,
        onClick: null,
        onDbClick: null,
        style: null,
        alert: "",
        onDrag: null,
        onDrop: null,
        data: null
    };
    constructor(props){
        super(props);
        this.onDrop = this.onDrop.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.state = {
            hovering: 0,
            dragging: 0
        };
    }
    render() {
        let style = this.props.style || {};
        style.borderBottom = this.state.hovering === 1 ? "2px dotted #dc3545" : "none";
        style.cursor = this.state.dragging === 1 ? "grabbing" : "grab";
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("tr", {
            "data-alert": this.props.alert,
            onClick: ()=>this.onClick(),
            onDoubleClick: (event)=>this.onDbClick(event),
            "data-selected": this.props.selected ? 1 : 0,
            style: style,
            onDragOver: this.onDragOver,
            onDrop: this.onDrop,
            onDragEnter: this.onDragEnter,
            onDragLeave: this.onDragLeave,
            "data-hovering": this.state.hovering,
            draggable: "true",
            onDragStart: (event)=>this.onDragStart(event),
            onDragEnd: (event)=>this.onDragEnd(event),
            "data-dragging": this.state.dragging,
            children: this.renderChildren()
        });
        return main;
    }
    onDragStart(event) {
        this.setState({
            dragging: 1
        });
        this.props.onDrag(this.props.data, this.props.index);
    }
    onDragEnd(event) {
        this.setState({
            dragging: 0
        });
        this.props.onDrag(null, -1);
    }
    onDragEnter(event) {
        event.stopPropagation();
        this.setState({
            hovering: 1
        });
    }
    onDragLeave(event) {
        event.stopPropagation();
        this.setState({
            hovering: 0
        });
    }
    onDrop(event) {
        // it needs to stop propagation otherwise it will dispatch in cascade
        event.stopPropagation();
        this.setState({
            hovering: 0
        });
        this.props.onDrop(this.props.data, this.props.index);
    }
    onDragOver(event) {
        event.preventDefault(); // Necessary to allows us to drop.
    }
}
class $2d4e58d7a4dff333$var$ACell extends (0, $ltMAx$react.Component) {
    getColSpan() {
        return this.props.colSpan > 0 ? this.props.colSpan : "";
    }
    getRowSpan() {
        return this.props.rowSpan > 0 ? this.props.rowSpan : "";
    }
}
class $2d4e58d7a4dff333$var$HCell extends $2d4e58d7a4dff333$var$ACell {
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
        let style = Object.assign({}, this.props.style);
        style.position = "relative";
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("th", {
            colSpan: this.getColSpan(),
            rowSpan: this.getRowSpan(),
            style: style,
            children: [
                (this.props.children || "").toString(),
                this.getBtnOrderBy()
            ]
        });
        return main;
    }
    getBtnOrderBy() {
        let result = null;
        if (this.props.children === null) return result;
        if (this.props.orderBy === null) return result;
        let glyph = null;
        let direction = this.props.orderBy.direction * -1;
        if (this.props.orderBy.iCol !== this.props.iCol) {
            glyph = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faSort)
            }); //<Glyphicon glyph="sort"/>;
            direction = 1;
        } else if (this.props.orderBy.direction > 0) glyph = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
            icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faSortAmountUpAlt)
        }) //<Glyphicon glyph="sort-by-attributes"/>;
        ;
        else glyph = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
            icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faSortAmountDownAlt)
        }); //<Glyphicon glyph="sort-by-attributes-alt"/>;
        return /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Button), {
            size: "sm",
            variant: "link",
            onClick: ()=>this.onSort(direction),
            children: glyph
        });
    }
    onSort(direction) {
        this.props.orderBy.apply(this.props.iCol, direction);
    }
}
class $2d4e58d7a4dff333$var$BCell extends $2d4e58d7a4dff333$var$ACell {
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
                return /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("td", {
                    style: this.props.style,
                    "data-alert": this.props.alert,
                    dangerouslySetInnerHTML: {
                        __html: this.props.children
                    }
                });
            default:
                cellContent = this.getStringCell();
        }
        return /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("td", {
            "data-alert": this.props.alert,
            colSpan: this.getColSpan(),
            rowSpan: this.getRowSpan(),
            style: this.props.style,
            children: cellContent
        });
    }
    getBooleanCell() {
        //return (Boolean(Number(this.props.children)) ?  <Glyphicon glyph="ok" /> : <Glyphicon glyph="unchecked" />);
        return Boolean(Number(this.props.children)) ? /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
            icon: [
                'fad',
                'stroopwafel'
            ],
            size: "4x",
            style: {
                '--fa-primary-color': 'red'
            }
        }) : /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
            icon: [
                'fad',
                'stroopwafel'
            ],
            size: "4x",
            style: {
                '--fa-primary-color': 'red'
            }
        });
    }
    getStringCell() {
        return this.props.children || "";
    }
}
$2d4e58d7a4dff333$export$c8dd51eb24f71762.Header = $2d4e58d7a4dff333$var$Header;
$2d4e58d7a4dff333$export$c8dd51eb24f71762.Header.Row = $2d4e58d7a4dff333$var$HRow;
$2d4e58d7a4dff333$export$c8dd51eb24f71762.Header.Cell = $2d4e58d7a4dff333$var$HCell;
$2d4e58d7a4dff333$export$c8dd51eb24f71762.Body = $2d4e58d7a4dff333$var$Body;
$2d4e58d7a4dff333$export$c8dd51eb24f71762.Body.Row = $2d4e58d7a4dff333$var$BRow;
$2d4e58d7a4dff333$export$c8dd51eb24f71762.Body.RowDraggable = $2d4e58d7a4dff333$var$BRowDraggable;
$2d4e58d7a4dff333$export$c8dd51eb24f71762.Body.Cell = $2d4e58d7a4dff333$var$BCell;







class $b88808f85b3c6d03$export$55afab09d8db8987 {
    static instance = null;
    constructor(){
        if (this.constructor.instance) return this.constructor.instance;
        this.constructor.instance = this;
        this.observers = [];
        this.msg = [];
    }
    addObserver(id, update) {
        let found = false;
        for (let item of this.observers)if (item.id === id) found = true;
        if (!found) this.observers.push({
            id: id,
            update: update
        });
    }
    removeObserver(id) {
        for(let i = 0; i < this.observers.length; i++)if (this.observers[i].id === id) this.observers.splice(i, 1);
    }
    notifyObservers() {
        for (let o of this.observers)o.update();
    }
    showInfo(title, msg, timeout) {
        this.msg.push({
            title: title,
            msg: msg,
            type: "info",
            timeout: timeout
        });
        this.notifyObservers();
    }
    showError(title, msg, timeout) {
        this.msg.push({
            title: title,
            msg: msg,
            type: "error",
            timeout: timeout
        });
        this.notifyObservers();
    }
    showWarning(title, msg, timeout) {
        this.msg.push({
            title: title,
            msg: msg,
            type: "warning",
            timeout: timeout
        });
        this.notifyObservers();
    }
    removeItem(index) {
        if (this.msg.splice(index, 1) !== null) this.notifyObservers();
    }
}
class $b88808f85b3c6d03$export$18a6a9ff9177664f extends (0, $ltMAx$react.Component) {
    constructor(props){
        super(props);
        this.onDismiss = this.onDismiss.bind(this);
    }
    static defaultProps = {
        id: 0,
        title: "",
        msg: "",
        type: "",
        timeout: 0 // in secs
    };
    render() {
        let bsStyle = "";
        let icon = "";
        switch(this.props.type){
            case 'error':
                bsStyle = "danger";
                icon = (0, $ltMAx$fortawesomefreesolidsvgicons.faExclamationTriangle);
                break;
            case 'warning':
                bsStyle = "warning";
                icon = (0, $ltMAx$fortawesomefreesolidsvgicons.faExclamationTriangle);
                break;
            case 'info':
                bsStyle = "info";
                icon = (0, $ltMAx$fortawesomefreesolidsvgicons.faInfoCircle);
                break;
            default:
                bsStyle = "danger";
                icon = (0, $ltMAx$fortawesomefreesolidsvgicons.faExclamationTriangle);
        }
        if (this.props.timeout) setTimeout(this.onDismiss, this.props.timeout * 1000);
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
            className: "VisualFeedback",
            "data-feedback-type": this.props.type,
            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Alert), {
                variant: bsStyle,
                onClose: this.onDismiss,
                dismissible: true,
                children: [
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Alert).Heading, {
                        children: this.props.title
                    }),
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("p", {
                        children: [
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                icon: icon
                            }),
                            ' ',
                            this.props.msg
                        ]
                    })
                ]
            })
        });
        return main;
    }
    onDismiss() {
        $b88808f85b3c6d03$export$55afab09d8db8987.instance.removeItem(this.props.id);
    }
}





class $f543a3a06df0c00b$export$cf9581d419a141cf extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        name: "",
        value: 0,
        min: null,
        max: null,
        nbDecimals: 0,
        placeholder: "",
        onChange: null,
        onKeyDown: null,
        autoFocus: false,
        autoSelect: false,
        disabled: false
    };
    static getDerivedStateFromProps(nextProps, prevState) {
        // if the data has changed then the component waits until the commit event in order to modify the value coming from props values
        if (prevState.dataChanged) return null;
        let nextValue = nextProps.value.toString();
        if (nextValue !== prevState.value) return {
            value: nextValue,
            dataChanged: false
        };
        return null;
    }
    constructor(props){
        super(props);
        this.onCommit = this.onCommit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onFocusOut = this.onFocusOut.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.state = {
            value: props.value.toString(),
            dataChanged: false
        };
        this.inputRef = /*#__PURE__*/ (0, ($parcel$interopDefault($ltMAx$react))).createRef();
    }
    componentDidMount() {
        if (this.props.autoSelect) this.inputRef.current.select();
    }
    render() {
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.FormControl), {
            ref: this.inputRef,
            autoFocus: this.props.autoFocus,
            className: "InputNumber",
            name: this.props.name,
            type: "text",
            value: this.state.value,
            placeholder: this.props.placeholder,
            onChange: this.onChange,
            onBlur: this.onFocusOut,
            onKeyDown: this.onKeyDown,
            disabled: this.props.disabled
        });
        return main;
    }
    onChange(event) {
        this.setState({
            value: event.target.value.toString(),
            dataChanged: true
        });
    }
    onCommit(callback) {
        callback = callback || null;
        // if(!this.state.dataChanged){ return;}
        let value = this.state.value.replace(",", ".");
        if (this.props.nbDecimals === 0) value = Number.parseInt(value, 10);
        else value = Number.parseFloat(value).toFixed(this.props.nbDecimals);
        if (Number.isNaN(value)) value = 0;
        if (this.props.min !== null && value < this.props.min) value = this.props.min;
        if (this.props.max !== null && value > this.props.max) value = this.props.max;
        let eventData = {
            target: {
                name: this.props.name,
                value: value
            }
        };
        this.setState({
            dataChanged: false
        }, ()=>{
            this.props.onChange(eventData);
            if (callback !== null) callback();
        });
    }
    onFocusOut(event) {
        this.onCommit();
    }
    onKeyDown(event) {
        let that = this;
        // React cannot access the event in an asynchronous way
        // If you want to access the event properties in an asynchronous way, you should call event.persist() on the event
        event.persist();
        let callback = function() {
            if (that.props.onKeyDown !== null) that.props.onKeyDown(event);
        };
        switch(event.key){
            case "Enter":
                this.onCommit(callback);
                break;
            default:
        }
    }
}




class $ea3a684d233172db$export$669f6ea7d267feaf extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        webApi: null,
        children: null
    };
    constructor(props){
        super(props);
        this.domRef = /*#__PURE__*/ (0, ($parcel$interopDefault($ltMAx$react))).createRef();
    }
    renderChildren() {
        return (0, ($parcel$interopDefault($ltMAx$react))).Children.map(this.props.children, (child, index)=>{
            if (child === null) return null;
            return /*#__PURE__*/ (0, ($parcel$interopDefault($ltMAx$react))).cloneElement(child, {
                className: "Img"
            });
        });
    }
    componentDidMount() {
        if (this.props.webApi === null) return;
        this.props.webApi.domVisualFeedback = this.domRef.current;
    }
    render() {
        return /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
            ref: this.domRef,
            className: "Loading",
            children: this.renderChildren()
        });
    }
}





class $c3fb18ada7a6f903$export$34301fadafd0cd9d extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        name: "",
        defaultValue: [],
        onChange: null,
        type: "checkbox",
        options: [],
        bsSize: "",
        style: null,
        disabled: false
    };
    constructor(props){
        super(props);
        this.onChange = this.onChange.bind(this);
    }
    render() {
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.ButtonToolbar), {
            style: this.props.style,
            "data-read-only": this.props.disabled ? 1 : 0,
            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.ToggleButtonGroup), {
                size: this.props.bsSize,
                type: this.props.type,
                name: this.props.name,
                defaultValue: this.props.defaultValue,
                onChange: this.onChange,
                children: this.props.options.map((item, index)=>{
                    let element = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.ToggleButton), {
                        variant: this.props.defaultValue.includes(item.value) ? "primary" : "secondary",
                        value: item.value,
                        disabled: this.props.disabled,
                        children: item.text
                    }, index);
                    return element;
                })
            })
        });
        return main;
    }
    onChange(eventKey) {
        this.props.onChange({
            target: {
                value: eventKey,
                name: this.props.name
            }
        });
    }
}


// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
/**
 *
 * @package   mod_recitcahiertraces
 * @copyright 2019 RÉCIT 
 * @license   {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */ 

class $11f4b0362cb6d337$export$2b77a92f1a5ad772 extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        title: "",
        body: null,
        footer: null,
        onClose: null,
        width: '75%'
    };
    render() {
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
            style: {
                position: "fixed",
                top: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                left: 0,
                bottom: 0,
                right: 0,
                zIndex: 1040,
                overflowX: 'hidden',
                overflowY: 'auto'
            },
            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
                style: {
                    width: this.props.width,
                    margin: "1.75rem auto",
                    backgroundColor: "#FFF",
                    maxWidth: 1450
                },
                children: [
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
                        className: "modal-header",
                        children: [
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("h4", {
                                className: "text-truncate",
                                children: this.props.title
                            }),
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("button", {
                                type: "button",
                                className: "close",
                                onClick: this.props.onClose,
                                children: [
                                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("span", {
                                        "aria-hidden": "true",
                                        children: "\xd7"
                                    }),
                                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("span", {
                                        className: "sr-only",
                                        children: "Fermer"
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
                        className: "modal-body",
                        children: this.props.body
                    }),
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
                        className: "modal-footer",
                        children: this.props.footer
                    })
                ]
            })
        });
        return main;
    }
}


class $07b35a47dfc28036$export$2e2bcd8739ae039 {
    static version = 1.0;
    static assets = {};
}


// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
/**
 *
 * @package   mod_recitcahiertraces
 * @copyright 2019 RÉCIT 
 * @license   {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */ // This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
/**
 *
 * @package   mod_recitcahiertraces
 * @copyright 2019 RÉCIT 
 * @license   {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */ class $49ffae516e3deb2a$export$7587955500404ec3 {
    static contentType = {
        postData: "application/x-www-form-urlencoded; charset=UTF-8",
        json: 'application/json; charset=utf-8',
        file: 'multipart/form-data'
    };
    static responseType = {
        text: 'text',
        json: 'json',
        octetStream: 'octet-stream'
    };
    constructor(){
        this.useCORS = false;
        this.timeout = 0; // in ms
        this.inProgress = false;
        this.onLoad = this.onLoad.bind(this);
        this.onError = this.onError.bind(this);
        this.onLoadEnd = this.onLoadEnd.bind(this);
        this.onTimeOut = this.onTimeOut.bind(this);
        this.xhr = new XMLHttpRequest();
        this.xhr.onload = this.onLoad;
        this.xhr.onerror = this.onError;
        this.xhr.onloadend = this.onLoadEnd;
        this.xhr.ontimeout = this.onTimeOut;
        this.clientOnLoad = null;
        this.clientOnError = null;
        this.clientOnLoadEnd = null;
        this.contentType = null;
        this.responseDataType = null;
    }
    send(method, url, data, onSuccess, onError, onComplete, contentType, responseDataType) {
        // force to await in order to execute one call at time (multiples calls causes the slowness on PHP)
        if (this.inProgress) {
            setTimeout(()=>this.send(method, url, data, onSuccess, onError, onComplete, contentType, responseDataType), 500);
            return;
        }
        this.clientOnLoad = onSuccess || null;
        this.clientOnError = onError || null;
        this.clientOnLoadEnd = onComplete || null;
        this.contentType = contentType || $49ffae516e3deb2a$export$7587955500404ec3.contentType.postData;
        this.responseDataType = responseDataType || $49ffae516e3deb2a$export$7587955500404ec3.responseType.text;
        this.xhr.open(method, url, true);
        this.xhr.setRequestHeader('Content-Type', contentType); // header sent to the server, specifying a particular format (the content of message body)
        this.xhr.setRequestHeader('Accept', responseDataType); // what kind of response to expect.
        if (this.useCORS) {
            if ("withCredentials" in this.xhr) this.xhr.withCredentials = true;
            else throw new Error('CORS not supported');
        }
        // In Internet Explorer, the timeout property can only be used after the open () method has been invoked and before the send () method is called.
        if (this.timeout > 0) this.xhr.timeout = this.timeout;
        this.inProgress = true;
        this.xhr.send(data);
    }
    onLoad(event) {
        if (event.target.readyState === 4) {
            if (event.target.status === 200) {
                let result = null;
                try {
                    switch(this.responseDataType){
                        case $49ffae516e3deb2a$export$7587955500404ec3.responseType.json:
                            result = JSON.parse(event.target.response);
                            break;
                        default:
                            result = event.target.response; // text
                    }
                } catch (error) {
                    console.log(error, this);
                }
                if (this.clientOnLoad !== null) this.clientOnLoad.call(this, result);
            } else console.error(event.target.statusText);
        }
    }
    onError(event) {
        if (this.clientOnError !== null) this.clientOnError.call(this, event.target, event.target.statusText);
        else console.log("Error:" + event.target);
    }
    onLoadEnd(event) {
        if (this.clientOnLoadEnd !== null) this.clientOnLoadEnd.call(event.target);
        this.inProgress = false;
    }
    onTimeOut(event) {
        alert("The request was canceled for timeout. Please try again.");
        console.log(event);
    }
}
class $49ffae516e3deb2a$export$3732886055f32dad {
    constructor(gateway){
        this.gateway = gateway;
        this.http = new $49ffae516e3deb2a$export$7587955500404ec3();
        this.domVisualFeedback = null;
        this.post = this.post.bind(this);
        this.onError = this.onError.bind(this);
        this.onComplete = this.onComplete.bind(this);
    }
    onError = function(jqXHR, textStatus) {
        alert("Error on server communication (" + textStatus + ").\n\nSee console for more details");
        console.log(jqXHR);
    };
    post(url, data, callbackSuccess, callbackError, showFeedback) {
        showFeedback = typeof showFeedback === 'undefined' ? true : showFeedback;
        if (showFeedback) this.showLoadingFeedback();
        callbackError = callbackError || this.onError;
        data.sesskey = M.cfg.sesskey;
        data = JSON.stringify(data);
        this.http.send("post", url, data, callbackSuccess, callbackError, this.onComplete, $49ffae516e3deb2a$export$7587955500404ec3.contentType.json, $49ffae516e3deb2a$export$7587955500404ec3.responseType.json);
    }
    onComplete() {
        this.hideLoadingFeedback();
    }
    showLoadingFeedback() {
        if (this.domVisualFeedback === null) return;
        this.domVisualFeedback.style.display = "block";
    }
    hideLoadingFeedback() {
        if (this.domVisualFeedback === null) return;
        this.domVisualFeedback.style.display = "none";
    }
}


// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
/**
 *
 * @package   mod_recitcahiertraces
 * @copyright 2019 RÉCIT 
 * @license   {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */ class $c599a773cf44aef2$export$3a9db9793503eddb {
    /**
    * @static
    * @param {type} id
    * @param {type} value
    * @param {type} minutesExpire
    * @returns {void}
    */ static set(id, value, minutesExpire) {
        let d = new Date();
        d.setTime(d.getTime() + minutesExpire * 60000);
        let expires = "expires=" + d.toUTCString();
        document.cookie = id + "=" + value + "; " + expires;
    }
    static get = function(id, defaultValue) {
        let result = defaultValue;
        let name = id + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++){
            let c = ca[i];
            while(c.charAt(0) === ' ')c = c.substring(1);
            if (c.indexOf(name) === 0) result = c.substring(name.length, c.length);
        }
        switch(typeof defaultValue){
            case 'boolean':
                result = result === 'true';
                break;
            case 'number':
                result = parseFloat(result);
                break;
            case 'object':
                result = defaultValue instanceof Date ? new Date(result) : result;
                break;
            default:
                result = result.toString();
        }
        return result;
    };
}


class $92c24a6ef437e0f2$export$97af3c8c635dda5e {
    /**
     * Return the array item at the indicated index. If it not exists, then return the default value.
     * @param {number} index
     * @param {*} default value
     * @returns {*}
     */ static at(arr, index, defaultValue) {
        if ($92c24a6ef437e0f2$export$97af3c8c635dda5e.exists(arr, index)) return arr[index];
        else return defaultValue;
    }
    /**
     * Check if the index exists in the array.
     * @param {number} index
     * @returns {boolean}
     */ static exists(arr, index) {
        if (typeof arr[index] === "undefined") return false;
        else return true;
    }
    /**
     * Return the array item (an object) according to the property and value indicated. If it not exists, then return the default value.
     * @param {string} property
     * @param {*} property value
     * @param {*} default value
     * @returns {*}
     */ static getItem(arr, prop, value, defaultValue) {
        for (let item of arr){
            if ($92c24a6ef437e0f2$export$97af3c8c635dda5e.get(item, prop, null) === value) return item;
        }
        return defaultValue;
    }
    /**
     * Remove an element from the array. If the element does not exists then do nothing.
     * @param {number} index
     * @returns {object}
     */ static remove(arr, index) {
        let result = [];
        if ($92c24a6ef437e0f2$export$97af3c8c635dda5e.exists(arr, index)) result = arr.splice(index, 1);
        return result.length > 0 ? result[0] : null;
    }
    /**
     * Remove an element from the array according to the property and value indicated.
     * @param {string} property
     * @param {*} property value
     * @returns {object}
     */ static removeItem = function(arr, prop, value) {
        let index = $92c24a6ef437e0f2$export$97af3c8c635dda5e.getItemIndex(arr, prop, value, -1);
        return $92c24a6ef437e0f2$export$97af3c8c635dda5e.remove(arr, index);
    };
    /**
     * Return the array item (an object) index according to the property and value indicated. 
     * @param {string} property
     * @param {*} property value
     * @returns {number}
     */ static getItemIndex = function(arr, prop, value) {
        for(let i = 0; i < arr.length; i++){
            let item = arr[i];
            if ($92c24a6ef437e0f2$export$97af3c8c635dda5e.get(item, prop, null) === value) return i;
        }
        return -1;
    };
    /**
    * Get the property value. If it not exists, then return the default value.
    * @param {string} prop
    * @param {*} defaultValue
    * @returns {*}
    */ static get = function(obj, prop, defaultValue) {
        let props = prop.split('.');
        let result = typeof defaultValue === "undefined" ? null : defaultValue;
        if (typeof obj[prop] === "function") result = obj[prop]();
        else if (props.length === 1 && obj.hasOwnProperty(props[0])) result = obj[props[0]];
        else if (props.length === 2 && obj[props[0]].hasOwnProperty(props[1])) result = obj[props[0]][props[1]];
        return result;
    };
    /*
    * @description Deep clone the object and return a new one
    * @returns {Object}
    */ static clone = function(obj) {
        if (obj instanceof Date) return new Date(obj.valueOf());
        let result = Object.create(obj.__proto__);
        for(let prop in obj){
            if (Array.isArray(obj[prop])) switch(typeof $92c24a6ef437e0f2$export$97af3c8c635dda5e.at(obj[prop], 0, null)){
                case "object":
                    result[prop] = $92c24a6ef437e0f2$export$97af3c8c635dda5e.copy(obj[prop], 2);
                    break;
                default:
                    result[prop] = $92c24a6ef437e0f2$export$97af3c8c635dda5e.copy(obj[prop]);
            }
            else if (typeof obj[prop] === "object" && obj[prop] !== null) result[prop] = $92c24a6ef437e0f2$export$97af3c8c635dda5e.clone(obj[prop]);
            else result[prop] = obj[prop];
        }
        return result;
    };
    static copy = function(arr, level) {
        level = level || 0;
        switch(level){
            case 1:
                return JSON.parse(JSON.stringify(arr)); //  Array of literal-structures (array, object) ex: [[], {}];
            case 2:
                //return jQuery.extend(this); // Array of prototype-objects (function). The jQuery technique can be used to deep-copy all array-types. ex: [function () {}, function () {}];
                let result = [];
                for (let item of arr)result.push(item !== null ? $92c24a6ef437e0f2$export$97af3c8c635dda5e.clone(item) : null);
                return result;
            default:
                return arr.slice(); // Array of literal-values (boolean, number, string) ex:  [true, 1, "true"]
        }
    };
}
class $92c24a6ef437e0f2$export$2e2bcd8739ae039 {
    static version = 1.0;
    // this is necessary in order to handle with timezone
    static dateParse(strDate) {
    // return Moment(strDate).toDate();
    }
    static formatMoney(value) {
        return "$ " + parseFloat(value).toFixed(2);
    }
    static getUrlVars() {
        var vars, uri;
        vars = {};
        uri = decodeURI(window.location.href);
        var parts = uri.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
            vars[key] = value;
        });
        return vars;
    }
}
class $92c24a6ef437e0f2$export$a92d6367f4c5e085 {
    static rolesL1 = [
        'ad',
        'mg',
        'cc',
        'et'
    ];
    static rolesL2 = [
        'ad',
        'mg',
        'cc',
        'et',
        'tc'
    ];
    static rolesL3 = [
        'sd',
        'gu',
        'fp'
    ];
    static checkRoles(roles, r1) {
        let r2 = roles;
        let a = new Set(r1);
        let b = new Set(r2);
        let intersection = new Set([
            ...a
        ].filter((x)=>b.has(x)));
        return intersection.size > 0;
    }
    static wwwRoot() {
        return M.cfg.wwwroot;
    }
}
class $92c24a6ef437e0f2$export$47709379081c8ece {
    static checkEmail(email) {
        email = email || "";
        if (email.length === 0) return true;
        //var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        let filter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        let emails = email.split(",");
        for (let e of emails){
            if (!filter.test(e.trim())) return false;
        }
        return true;
    }
}
class $92c24a6ef437e0f2$export$9e4ad27aafee2a55 {
    static nbMinSinceSundayToDate(nbMinSinceSunday) {
        nbMinSinceSunday = parseInt(nbMinSinceSunday, 10);
        if (nbMinSinceSunday === 0) return null;
        let hour = Math.trunc(nbMinSinceSunday % 1440 / 60);
        let minutes = nbMinSinceSunday % 60;
        return new Date(0, 0, 0, hour, minutes, 0);
    }
    static dateToNbMinSinceSunday(weekDay, date) {
        if (date instanceof Date) return date.getHours() * 60 + date.getMinutes() + weekDay * 1440; // 1440 = minutes in a day
        else return 0;
    }
    static formatTime(timestamp) {
        var time = new Date(timestamp * 1000);
        return time.toLocaleDateString();
    }
    /**
    * Transform the shift minutes to the time string
    * @param {type} time 
    * @param {type} separator
    * @returns {ScheduleShift.minutesToTime.result}
    */ static minutesToTime(time, separator) {
        separator = separator || ":";
        let hour, min, result, offsetDays;
        if (time >= 0 && time <= 23) {
            hour = time;
            min = 0;
        } else {
            hour = Math.trunc(time / 60); // extract the hour
            offsetDays = Math.trunc(hour / 24);
            min = time - hour * 60; // extract the minutes
            hour -= offsetDays * 24;
        }
        result = hour.toString().nxLpad("0", 2) + separator + min.toString().nxLpad("0", 2);
        return result;
    }
    /**
     * Transform the time in string to minutes
     * @param {string} - hh:mm
     * @return {number} - The number of minutes 
     */ static timeToMin = function(time) {
        var hour, minutes;
        if (time.length !== 5) return 0;
        hour = parseInt(time.substring(0, 2), 10);
        minutes = parseInt(time.substring(3, 5), 10);
        return hour * 60 + minutes;
    };
}
class $92c24a6ef437e0f2$export$5b186754e4ca8c8a {
    /**
     * Apply a user supplied function to every node of the tree and return its result
     * @param {Array} - tree
     * @param {string} - proNodes The property name of the children nodes 
     * @param {function} - callback The callback function
     * @returns void
     */ static treeWalk(tree, propNodes, callback) {
        let i, node;
        for(i = 0; i < tree.length; i++){
            node = tree[i];
            if (node.hasOwnProperty(propNodes) && node[propNodes].length > 0) {
                callback(node);
                $92c24a6ef437e0f2$export$5b186754e4ca8c8a.treeWalk(node[propNodes], propNodes, callback);
            } else callback(node);
        }
    }
    /**
     * Get the parent node 
     * @param {Array} - tree
     * @param {string} - proNodes - The property name of the children nodes 
     * @param {function} - callback - The callback function. It needs to return true or false
     * @param * - default value
     * @returns * - the parent node or the default value
     */ static getParentNode(rootNode, propNodes, callback, defaultValue) {
        let i, node;
        let result = defaultValue;
        // there is no parent node
        if (callback(rootNode)) return result;
        let nodes = rootNode.nxGet(propNodes);
        for(i = 0; i < nodes.length; i++){
            node = nodes[i];
            if (node.nxGet(propNodes).length > 0) {
                if (callback(node)) return rootNode;
                result = $92c24a6ef437e0f2$export$5b186754e4ca8c8a.getParentNode(node, propNodes, callback, defaultValue);
            } else if (callback(node)) return rootNode;
        }
        return result;
    }
    /**
     * Get a node from the tree
     * @param {Array} - tree
     * @param {string} - proNodes - The property name of the children nodes 
     * @param {function} - callback - The callback function. It needs to return true or false
     * @param * - default value
     * @returns * - the node or the default value
     */ static getNode(tree, propNodes, callback, defaultValue) {
        let i, node, result;
        for(i = 0; i < tree.length; i++){
            node = tree[i];
            if (callback(node)) return node;
            if (node.hasOwnProperty(propNodes) && node[propNodes].length > 0) {
                result = $92c24a6ef437e0f2$export$5b186754e4ca8c8a.getNode(node[propNodes], propNodes, callback, defaultValue);
                if (result !== null) return result;
            } else if (typeof node[propNodes] === "function" && node[propNodes]().length > 0) {
                result = $92c24a6ef437e0f2$export$5b186754e4ca8c8a.getNode(node[propNodes], propNodes, callback, defaultValue);
                if (result !== null) return result;
            }
        }
        return defaultValue;
    }
    /**
     * Remove a node from the tree
     * @param {Array} - tree
     * @param {string} - proNodes - The property name of the children nodes 
     * @param {function} - callback - The callback function. It needs to return true or false
     * @returns {boolean} - True if the node was found. False otherwise.
     */ static removeNode(tree, propNodes, callback) {
        let i, node;
        for(i = 0; i < tree.length; i++){
            node = tree[i];
            if (callback(node)) {
                tree.splice(i, 1);
                return true;
            }
            if (node.hasOwnProperty(propNodes) && node[propNodes].length > 0) {
                if ($92c24a6ef437e0f2$export$5b186754e4ca8c8a.removeNode(node[propNodes], propNodes, callback)) return true;
            } else if (typeof node[propNodes] === "function" && node[propNodes]().length > 0) {
                if ($92c24a6ef437e0f2$export$5b186754e4ca8c8a.removeNode(node[propNodes](), propNodes, callback)) return true;
            }
        }
        return false;
    }
}


// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
/**
 *
 * @package   mod_recitcahiertraces
 * @copyright 2019 RÉCIT 
 * @license   {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */ 

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
/**
 *
 * @package   mod_recitcahiertraces
 * @copyright 2019 RÉCIT 
 * @license   {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */ 
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
/**
 *
 * @package   mod_recitcahiertraces
 * @copyright 2019 RÉCIT 
 * @license   {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */ 
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
/**
 *
 * @package   mod_recitcahiertraces
 * @copyright 2019 RÉCIT 
 * @license   {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */ var $1572597be94ce13f$exports = {};
$1572597be94ce13f$exports = JSON.parse('{"name":"recit_cahiertraces","version":"v3.0.4-stable","description":"R\xc9CIT Cahier de traces","main":"index.js","scripts":{"test":"echo \\"Error: no test specified\\" && exit 1","start":"parcel ./src/index.js --dist-dir ./build","build":"parcel build ./src/index.js --dist-dir ./build"},"keywords":[],"author":"","license":"ISC","dependencies":{"@fortawesome/fontawesome-svg-core":"1.2.35","@fortawesome/free-solid-svg-icons":"5.15.3","@fortawesome/react-fontawesome":"0.2.0","bootstrap":"4.6","date-fns":"2.22.1","react":"18.2.0","react-bootstrap":"1.6.6","react-dom":"18.2.0","react-select":"5.4.0"},"devDependencies":{"babel-core":"6.26.3","babel-plugin-transform-class-properties":"6.24.1","babel-preset-env":"1.7.0","babel-preset-react":"6.24.1","parcel-bundler":"1.12.5","sass":"1.34.1"}}');



class $b63c2eee244b2a4e$export$c019608e5b5bb4cb {
    static appVersion() {
        return (0, (/*@__PURE__*/$parcel$interopDefault($1572597be94ce13f$exports))).version;
    }
    static appTitle() {
        return (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname') + " | " + this.appVersion();
    }
    static versionHistory = [
        {
            version: "0.1.0",
            description: "",
            timestamp: '2019-11-04'
        }
    ];
    static getGateway() {
        return `${M.cfg.wwwroot}/mod/recitcahiertraces/classes/WebApi.php`;
    }
}


class $9846819a6609dc66$export$3f60fcef2ed18780 extends (0, $49ffae516e3deb2a$export$3732886055f32dad) {
    constructor(){
        super((0, $b63c2eee244b2a4e$export$c019608e5b5bb4cb).getGateway());
        this.http.useCORS = true;
        this.sid = 0;
        this.observers = [];
        this.http.timeout = 30000; // 30 secs
    }
    addObserver(id, update, observables) {
        this.observers.push({
            id: id,
            update: update,
            observables: observables
        });
    }
    removeObserver(id) {
        (0, $92c24a6ef437e0f2$export$97af3c8c635dda5e).removeItem(this.observers, "id", id);
    }
    notifyObservers(observable) {
        for (let o of this.observers)if (o.observables.includes(observable)) o.update();
    }
    getEnrolledUserList(cmId, onSuccess) {
        let data = {
            cmId: cmId,
            service: "getEnrolledUserList"
        };
        this.post(this.gateway, data, onSuccess);
    }
    getUserNotes(cmId, userId, flag, onSuccess) {
        let data = {
            cmId: cmId,
            userId: userId,
            flag: flag,
            service: "getUserNotes"
        };
        this.post(this.gateway, data, onSuccess);
    }
    getUserNote(cmId, nId, gId, userId, onSuccess) {
        let data = {
            cmId: cmId,
            gId: gId,
            nId: nId,
            userId: userId,
            service: "getUserNote"
        };
        this.post(this.gateway, data, onSuccess);
    }
    saveUserNote(data, flags, onSuccess) {
        let that = this;
        let onSuccessTmp = function(result) {
            onSuccess(result);
            if (result.success) that.notifyObservers('saveUserNote');
        };
        let options = {
            data: data,
            flags: flags,
            service: "saveUserNote"
        };
        this.post(this.gateway, options, onSuccessTmp);
    }
    getGroupList(cmId, onSuccess) {
        let data = {
            cmId: cmId,
            service: "getGroupList"
        };
        this.post(this.gateway, data, onSuccess);
    }
    getGroupNotes(gId, ctId, onSuccess) {
        let data = {
            gId: gId,
            ctId: ctId || 0,
            service: "getGroupNotes"
        };
        this.post(this.gateway, data, onSuccess);
    }
    reorderNoteGroups(cmId, onSuccess) {
        let data = {
            cmId: cmId,
            service: "reorderNoteGroups"
        };
        this.post(this.gateway, data, onSuccess);
    }
    switchNoteSlot(from, to, cmId, onSuccess) {
        if (from === to) return;
        let data = {
            from: from,
            to: to,
            cmId: cmId,
            service: "switchNoteSlot"
        };
        this.post(this.gateway, data, onSuccess);
    }
    getNoteFormKit(cmId, nId, onSuccess) {
        let data = {
            cmId: cmId,
            nId: nId,
            service: "getNoteFormKit"
        };
        this.post(this.gateway, data, onSuccess);
    }
    saveNote(data, onSuccess) {
        let that = this;
        let onSuccessTmp = function(result) {
            onSuccess(result);
            if (result.success) that.notifyObservers('saveNote');
        };
        let options = {
            data: data,
            service: "saveNote"
        };
        this.post(this.gateway, options, onSuccessTmp);
    }
    removeNote(nId, cmId, onSuccess) {
        let that = this;
        let onSuccessTmp = function(result) {
            onSuccess(result);
            if (result.success) that.notifyObservers('removeNote');
        };
        let options = {
            nId: nId,
            cmId: cmId,
            service: "removeNote"
        };
        this.post(this.gateway, options, onSuccessTmp);
    }
    removeNoteGroup(cmId, gId, onSuccess) {
        let that = this;
        let onSuccessTmp = function(result) {
            onSuccess(result);
            if (result.success) that.notifyObservers('removeNoteGroup');
        };
        let options = {
            cmId: cmId,
            gId: gId,
            service: "removeNoteGroup"
        };
        this.post(this.gateway, options, onSuccessTmp);
    }
    saveNoteGroup(data, onSuccess) {
        let that = this;
        let onSuccessTmp = function(result) {
            onSuccess(result);
            if (result.success) that.notifyObservers('saveNoteGroup');
        };
        let options = {
            data: data,
            service: "saveNoteGroup"
        };
        this.post(this.gateway, options, onSuccessTmp);
    }
    cloneNoteGroup(data, onSuccess) {
        let that = this;
        let onSuccessTmp = function(result) {
            onSuccess(result);
            if (result.success) that.notifyObservers('cloneNoteGroup');
        };
        let options = {
            data: data,
            service: "cloneNoteGroup"
        };
        this.post(this.gateway, options, onSuccessTmp);
    }
    getRequiredNotes(cmId, onSuccess) {
        let data = {
            cmId: cmId,
            service: "getRequiredNotes"
        };
        this.post(this.gateway, data, onSuccess);
    }
    getStudentsProgression(cmId, onSuccess) {
        let data = {
            cmId: cmId,
            service: "getStudentsProgression"
        };
        this.post(this.gateway, data, onSuccess);
    }
}



const $e1e72af90e3ceaef$export$e809d3ea5a46d11f = {
    signedUser: {
        userId: 0,
        roles: []
    },
    feedback: new (0, $b88808f85b3c6d03$export$55afab09d8db8987)(),
    webApi: new (0, $9846819a6609dc66$export$3f60fcef2ed18780)(),
    urlParams: {}
};



// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
/**
 *
 * @package   mod_recitcahiertraces
 * @copyright 2019 RÉCIT 
 * @license   {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */ 








class $8c7038e4fc3dc391$export$e46c992cf44cfc16 {
    constructor(id){
        this.init = this.init.bind(this);
        this.onFocusOut = this.onFocusOut.bind(this);
        this.id = id;
        this.dom = document.getElementById(this.id);
        this.format = this.dom.getAttribute("data-format");
        this.onFocusOutCallback = null;
        this.init();
    }
    checkDom() {
        return this.dom !== null;
    }
    init() {
        if (!this.checkDom()) return;
        switch(this.format){
            case 'editor_tiny\\editor':
                break;
            case 'atto_texteditor':
                break;
            case 'recit_rich_editor':
                window.RecitRichEditorCreateInstance(this.dom, null, 'word');
                break;
            case 'recit_texteditor':
                break;
        }
    }
    onFocusOut() {
        if (!this.checkDom()) return;
        if (this.onFocusOutCallback !== null) this.onFocusOutCallback();
    }
    show() {
        if (!this.checkDom()) return;
        switch(this.format){
            case 'atto_texteditor':
                let attoContent = this.dom.querySelector(".editor_atto_content");
                if (attoContent.onblur === null) attoContent.onblur = this.onFocusOut;
                break;
            case 'editor_tiny\\editor':
        }
        this.dom.style.display = 'block';
    }
    close() {
        this.setValue("");
    }
    setValue(value) {
        if (!this.checkDom()) return;
        switch(this.format){
            case 'atto_texteditor':
                this.dom.getElementsByClassName("editor_atto_content")[0].innerHTML = value;
                this.dom.querySelector(`[name="${this.id}[text]"]`).value = value;
                break;
            case 'editor_tiny\\editor':
                this.dom.getElementsByTagName("textarea")[0].value = value;
                this.dom.querySelector('iframe').contentDocument.body.innerHTML = value;
                break;
            case 'textarea_texteditor':
                this.dom.getElementsByTagName("textarea")[0].value = value;
                break;
            case 'recit_rich_editor':
            case 'recit_texteditor':
                this.dom.querySelector(`[data-recit-rich-editor="content"]`).innerHTML = value;
                break;
            default:
                alert("Editor: unknown format");
        }
    }
    getValue() {
        let result = {
            text: "",
            format: "",
            itemid: 0
        };
        if (!this.checkDom()) return result;
        switch(this.format){
            case 'atto_texteditor':
                for(let attr in result){
                    let name = `${this.id}[${attr}]`;
                    let el = this.dom.querySelector(`[name="${name}"]`);
                    if (el !== null) result[attr] = el.value;
                }
                break;
            case 'textarea_texteditor':
                result.text = this.dom.getElementsByTagName("textarea")[0].value;
                break;
            case 'recit_rich_editor':
            case 'recit_texteditor':
                result.text = this.dom.querySelector(`[data-recit-rich-editor="content"]`).innerHTML;
                break;
            case 'editor_tiny\\editor':
                result.text = this.dom.querySelector('iframe').contentDocument.body.innerHTML;
                break;
            default:
                alert("Editor: unknown format");
        }
        return result;
    }
}


class $1f80b4d9d79eca51$export$fcd31d1255cc6e1c extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        variant: "",
        text: "",
        children: null
    };
    render() {
        return /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
            style: {
                display: "flex",
                justifyContent: "flex-end"
            },
            children: [
                this.props.children,
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.ButtonGroup), {
                    children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Button), {
                        variant: this.props.variant,
                        onClick: this.props.onClick,
                        children: [
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faWrench)
                            }),
                            " " + this.props.text
                        ]
                    })
                })
            ]
        });
    }
}
class $1f80b4d9d79eca51$var$NoteForm extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        nId: 0,
        selectedGroup: null,
        onClose: null
    };
    constructor(props){
        super(props);
        this.onSelectTab = this.onSelectTab.bind(this);
        this.onDataChange = this.onDataChange.bind(this);
        this.getData = this.getData.bind(this);
        this.getDataResult = this.getDataResult.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onSaveResult = this.onSaveResult.bind(this);
        this.prepareNewState = this.prepareNewState.bind(this);
        this.onClose = this.onClose.bind(this);
        this.facadeUpdateEditor = this.facadeUpdateEditor.bind(this);
        this.state = {
            data: null,
            formValidated: false,
            dropdownLists: {
                groupList: []
            }
        };
        this.formRef = /*#__PURE__*/ (0, ($parcel$interopDefault($ltMAx$react))).createRef();
        this.editorTemplateNoteRef = /*#__PURE__*/ (0, ($parcel$interopDefault($ltMAx$react))).createRef();
        this.editorSuggestedNoteRef = /*#__PURE__*/ (0, ($parcel$interopDefault($ltMAx$react))).createRef();
        this.editorTeacherTipRef = /*#__PURE__*/ (0, ($parcel$interopDefault($ltMAx$react))).createRef();
        this.editorTemplateNote = new (0, $8c7038e4fc3dc391$export$e46c992cf44cfc16)('recit_cahiertraces_editor_container_1');
        this.editorSuggestedNote = new (0, $8c7038e4fc3dc391$export$e46c992cf44cfc16)('recit_cahiertraces_editor_container_2');
        this.editorTeacherTip = new (0, $8c7038e4fc3dc391$export$e46c992cf44cfc16)('recit_cahiertraces_editor_container_3');
    }
    componentDidMount() {
        this.facadeUpdateEditor();
        this.getData();
    }
    componentWillUnmount() {
        this.editorTemplateNote.close();
        this.editorSuggestedNote.close();
        this.editorTeacherTip.close();
        this.editorTemplateNote.dom.style.display = 'none';
        this.editorSuggestedNote.dom.style.display = 'none';
        this.editorTeacherTip.dom.style.display = 'none';
        document.body.appendChild(this.editorTemplateNote.dom);
        document.body.appendChild(this.editorSuggestedNote.dom);
        document.body.appendChild(this.editorTeacherTip.dom);
    }
    render() {
        if (this.state.data === null) return null;
        let data = this.state.data;
        let styleTab = {
            padding: 10
        };
        let body = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form), {
            noValidate: true,
            validated: this.state.formValidated,
            ref: this.formRef,
            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Tabs), {
                defaultActiveKey: this.state.activeTab,
                id: "tab",
                onSelect: this.onSelectTag,
                children: [
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Tab), {
                        eventKey: 0,
                        title: "Note",
                        style: styleTab,
                        children: [
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Row, {
                                children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Form).Group, {
                                    as: (0, $ltMAx$reactbootstrap.Col),
                                    children: [
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Label, {
                                            children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('notegroup') + ":"
                                        }),
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $35da119215127171$export$72b9695b8216309a), {
                                            placeholder: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('selectoption'),
                                            required: true,
                                            name: "gId",
                                            value: data.gId,
                                            options: this.state.dropdownLists.groupList,
                                            onChange: this.onDataChange
                                        })
                                    ]
                                })
                            }),
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Row, {
                                children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Form).Group, {
                                    as: (0, $ltMAx$reactbootstrap.Col),
                                    children: [
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Label, {
                                            children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('title')
                                        }),
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Control, {
                                            type: "text",
                                            required: true,
                                            value: data.title,
                                            maxLength: "255",
                                            name: "title",
                                            onChange: this.onDataChange
                                        })
                                    ]
                                })
                            }),
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Row, {
                                children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Form).Group, {
                                    as: (0, $ltMAx$reactbootstrap.Col),
                                    children: [
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Label, {
                                            children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('position')
                                        }),
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $f543a3a06df0c00b$export$cf9581d419a141cf), {
                                            value: data.slot,
                                            name: "slot",
                                            min: 0,
                                            onChange: this.onDataChange
                                        })
                                    ]
                                })
                            }),
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Row, {
                                children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Form).Group, {
                                    as: (0, $ltMAx$reactbootstrap.Col),
                                    children: [
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Label, {
                                            children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('notifyteacheruponupdate')
                                        }),
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $c3fb18ada7a6f903$export$34301fadafd0cd9d), {
                                            name: "notifyTeacher",
                                            defaultValue: [
                                                data.notifyTeacher
                                            ],
                                            onChange: this.onDataChange,
                                            options: [
                                                {
                                                    value: 1,
                                                    text: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('yes')
                                                },
                                                {
                                                    value: 0,
                                                    text: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('no')
                                                }
                                            ]
                                        })
                                    ]
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Tab), {
                        eventKey: 1,
                        title: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('notetemplate'),
                        style: styleTab,
                        children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Row, {
                            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Group, {
                                as: (0, $ltMAx$reactbootstrap.Col),
                                children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
                                    ref: this.editorTemplateNoteRef
                                })
                            })
                        })
                    }),
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Tab), {
                        eventKey: 2,
                        title: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('suggestedresponse'),
                        style: styleTab,
                        children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Row, {
                            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Group, {
                                as: (0, $ltMAx$reactbootstrap.Col),
                                children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
                                    ref: this.editorSuggestedNoteRef
                                })
                            })
                        })
                    }),
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Tab), {
                        eventKey: 3,
                        title: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('teachertips'),
                        style: styleTab,
                        children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Row, {
                            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Group, {
                                as: (0, $ltMAx$reactbootstrap.Col),
                                children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
                                    ref: this.editorTeacherTipRef
                                })
                            })
                        })
                    })
                ]
            })
        });
        let footer = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
            className: "btn-tollbar",
            style: {
                width: "100%",
                display: "flex",
                justifyContent: "flex-end"
            },
            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
                className: "btn-group",
                children: [
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Button), {
                        variant: "secondary",
                        onClick: this.onClose,
                        children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('cancel')
                    }),
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Button), {
                        variant: "success",
                        onClick: this.onSubmit,
                        children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('save')
                    })
                ]
            })
        });
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $11f4b0362cb6d337$export$2b77a92f1a5ad772), {
            title: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('note') + ': ' + data.title,
            body: body,
            footer: footer,
            onClose: this.props.onClose
        });
        return main;
    }
    onSelectTab(eventKey) {
        this.setState({
            activeTab: eventKey
        });
    }
    updateEditor(instance, ref, value) {
        if (ref.current !== null) {
            instance.show();
            instance.setValue(value);
            if (!ref.current.hasChildNodes()) ref.current.appendChild(instance.dom);
        }
    }
    facadeUpdateEditor() {
        if (this.state.data === null) return;
        this.updateEditor(this.editorTemplateNote, this.editorTemplateNoteRef, this.state.data.templateNote);
        this.updateEditor(this.editorSuggestedNote, this.editorSuggestedNoteRef, this.state.data.suggestedNote);
        this.updateEditor(this.editorTeacherTip, this.editorTeacherTipRef, this.state.data.teacherTip);
    }
    onClose() {
        this.props.onClose();
    }
    onDataChange(event) {
        let data = this.state.data;
        data[event.target.name] = event.target.value;
        // if the group has changed then it restart the slot
        if (event.target.name === "gId") data.slot = 0;
        else if (event.target.name === "notifyTeacher") data[event.target.name] = data[event.target.name].pop();
        this.setState({
            data: data
        });
    }
    getData() {
        if (this.props.selectedGroup === null) return;
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.getNoteFormKit((0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.id, this.props.nId, this.getDataResult);
    }
    getDataResult(result) {
        if (result.success) this.setState(this.prepareNewState(result.data.data, {
            groupList: result.data.groupList
        }), this.facadeUpdateEditor);
        else (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).feedback.showError((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname'), result.msg);
    }
    prepareNewState(data, dropdownLists) {
        data = data || null;
        dropdownLists = dropdownLists || null;
        let result = {
            data: {
                nId: 0,
                gId: 0,
                cmId: (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.id,
                title: "",
                templateNote: "",
                suggestedNote: "",
                teacherTip: "",
                lastUpdate: 0,
                intCode: "",
                notifyTeacher: 0,
                slot: 0
            },
            dropdownLists: {}
        };
        if (data !== null) {
            result.data.nId = data.id;
            result.data.gId = data.group.id;
            result.data.title = data.title;
            result.data.templateNote = data.templateNote;
            result.data.suggestedNote = data.suggestedNote;
            result.data.teacherTip = data.teacherTip;
            result.data.lastUpdate = data.lastUpdate;
            result.data.intCode = data.intCode;
            result.data.notifyTeacher = data.notifyTeacher;
            result.data.slot = data.slot;
        }
        if (dropdownLists !== null) {
            result.dropdownLists.groupList = [];
            for (let item of dropdownLists.groupList)result.dropdownLists.groupList.push({
                value: item.id,
                text: item.name,
                data: item
            });
        }
        if (result.data.nId === 0) result.data.gId = this.props.selectedGroup.id;
        return result;
    }
    onSubmit() {
        if (this.formRef.current.checkValidity() === false) this.setState({
            formValidated: false
        });
        else this.setState({
            formValidated: true
        }, this.onSave);
    }
    onSave() {
        let data = (0, $92c24a6ef437e0f2$export$97af3c8c635dda5e).clone(this.state.data);
        data.templateNote = this.editorTemplateNote.getValue().text;
        data.suggestedNote = this.editorSuggestedNote.getValue().text;
        data.teacherTip = this.editorTeacherTip.getValue().text;
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.saveNote(data, this.onSaveResult);
    }
    onSaveResult(result) {
        if (result.success) {
            this.onClose();
            (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).feedback.showInfo((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname'), (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('msgsuccess'), 3);
        } else (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).feedback.showError((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname'), result.msg);
    }
}
class $1f80b4d9d79eca51$export$1fd269a6d53467a3 extends (0, $ltMAx$react.Component) {
    static defaultProps = {};
    constructor(props){
        super(props);
        this.getData = this.getData.bind(this);
        this.getData2 = this.getData2.bind(this);
        this.onAddNote = this.onAddNote.bind(this);
        this.onEditNote = this.onEditNote.bind(this);
        this.onRemoveNote = this.onRemoveNote.bind(this);
        this.onAddCollection = this.onAddCollection.bind(this);
        this.onEditCollection = this.onEditCollection.bind(this);
        this.onCloseGroupForm = this.onCloseGroupForm.bind(this);
        this.removeNoteGroup = this.removeNoteGroup.bind(this);
        this.onSelectGroup = this.onSelectGroup.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onDragRow = this.onDragRow.bind(this);
        this.onDropRow = this.onDropRow.bind(this);
        this.onCopy = this.onCopy.bind(this);
        this.state = {
            selectedGroup: null,
            nId: -1,
            groupList: [],
            groupNoteList: [],
            draggingItem: null,
            copyIC: "",
            showGroupForm: false,
            showGroupOrderForm: false,
            groupListRaw: []
        };
        this.intCodeRef = /*#__PURE__*/ (0, ($parcel$interopDefault($ltMAx$react))).createRef();
    }
    componentDidMount() {
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.addObserver("EditionMode1", this.getData, [
            'saveNoteGroup',
            'removeNoteGroup'
        ]);
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.addObserver("EditionMode2", this.getData2, [
            'saveNote',
            'removeNote'
        ]);
        this.getData();
    }
    componentWillUnmount() {
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.removeObserver("EditionMode1");
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.removeObserver("EditionMode2");
    }
    getData() {
        let that = this;
        let callback = function(result) {
            if (!result.success) {
                (0, $b88808f85b3c6d03$export$55afab09d8db8987).instance.showError((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname'), result.msg);
                return;
            }
            let groupList = [];
            for (let item of result.data)groupList.push({
                value: item.id,
                text: item.name,
                data: item
            });
            that.setState({
                groupList: groupList,
                groupListRaw: result.data
            });
        };
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.getGroupList((0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.id, callback);
    }
    getData2() {
        let that = this;
        let callback = function(result) {
            if (!result.success) {
                (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).feedback.showError((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname'), result.msg);
                return;
            }
            that.setState({
                groupNoteList: result.data
            });
        };
        if (this.state.selectedGroup !== null) (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.getGroupNotes(this.state.selectedGroup.id, this.state.selectedGroup.ct.id, callback);
        else this.setState({
            groupNoteList: []
        });
    }
    render() {
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
            children: [
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form), {
                    children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Row, {
                        children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Form).Group, {
                            as: (0, $ltMAx$reactbootstrap.Col),
                            children: [
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Label, {
                                    children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('selectnotegroup') + ":"
                                }),
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $35da119215127171$export$72b9695b8216309a), {
                                    placeholder: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('selectoption'),
                                    value: this.state.selectedGroup !== null ? this.state.selectedGroup.id : 0,
                                    options: this.state.groupList,
                                    onChange: this.onSelectGroup
                                })
                            ]
                        })
                    })
                }),
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.ButtonToolbar), {
                    style: {
                        justifyContent: 'space-between'
                    },
                    children: [
                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.ButtonGroup), {
                            className: "mr-4 mb-4",
                            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Button), {
                                variant: "primary",
                                disabled: this.state.selectedGroup === null,
                                onClick: this.onAddNote,
                                children: [
                                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                        icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faPlusCircle)
                                    }),
                                    " ",
                                    (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('addnote')
                                ]
                            })
                        }),
                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.ButtonGroup), {
                            className: "mr-4",
                            children: [
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Button), {
                                    variant: "primary",
                                    onClick: this.onAddCollection,
                                    children: [
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                            icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faPlusCircle)
                                        }),
                                        " ",
                                        (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('addgroup')
                                    ]
                                }),
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Button), {
                                    variant: "warning",
                                    disabled: this.state.selectedGroup === null,
                                    onClick: this.removeNoteGroup,
                                    children: [
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                            icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faTrashAlt)
                                        }),
                                        " ",
                                        (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('deletegroup')
                                    ]
                                }),
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Button), {
                                    variant: "primary",
                                    onClick: ()=>this.showGroupOrderForm(true),
                                    children: [
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                            icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faSortAmountDownAlt)
                                        }),
                                        " ",
                                        (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('ordergroup')
                                    ]
                                }),
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Button), {
                                    variant: "primary",
                                    disabled: this.state.selectedGroup === null,
                                    onClick: this.onEditCollection,
                                    children: [
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                            icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faPencilAlt)
                                        }),
                                        " ",
                                        (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('editgroup')
                                    ]
                                }),
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Button), {
                                    variant: "primary",
                                    disabled: this.state.selectedGroup === null,
                                    onClick: ()=>this.onCloneCollection(),
                                    children: [
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                            icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faClone)
                                        }),
                                        " ",
                                        (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('clonegroup')
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.ButtonGroup), {
                            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("a", {
                                className: "btn btn-primary",
                                href: this.getSuggestedNotesPrintLink(),
                                target: "_blank",
                                title: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('print'),
                                children: [
                                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                        icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faPrint)
                                    }),
                                    " ",
                                    (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('print')
                                ]
                            })
                        })
                    ]
                }),
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("hr", {}),
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("br", {}),
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762), {
                    orderBy: true,
                    children: [
                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header, {
                            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header.Row, {
                                children: [
                                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header.Cell, {
                                        style: {
                                            width: 40
                                        }
                                    }),
                                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header.Cell, {
                                        style: {
                                            width: 80
                                        },
                                        children: "#"
                                    }),
                                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header.Cell, {
                                        children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('note')
                                    }),
                                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header.Cell, {
                                        style: {
                                            width: 200
                                        },
                                        children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('integrationcode')
                                    }),
                                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header.Cell, {
                                        style: {
                                            width: 120
                                        }
                                    })
                                ]
                            })
                        }),
                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body, {
                            children: this.state.groupNoteList.map((item, index)=>{
                                let row = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body.RowDraggable, {
                                    data: item,
                                    onDbClick: ()=>this.onEditNote(item.id),
                                    onDrag: this.onDragRow,
                                    onDrop: this.onDropRow,
                                    children: [
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body.Cell, {
                                            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                                icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faArrowsAlt),
                                                title: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('moveitem')
                                            })
                                        }),
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body.Cell, {
                                            children: item.slot
                                        }),
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body.Cell, {
                                            children: item.title
                                        }),
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body.Cell, {
                                            children: item.intCode
                                        }),
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body.Cell, {
                                            style: {
                                                textAlign: 'center'
                                            },
                                            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.ButtonGroup), {
                                                size: "sm",
                                                children: [
                                                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Button), {
                                                        onClick: ()=>this.onEditNote(item.id),
                                                        title: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('edit'),
                                                        variant: "outline-primary",
                                                        children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                                            icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faPencilAlt)
                                                        })
                                                    }),
                                                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Button), {
                                                        onClick: ()=>this.onRemoveNote(item),
                                                        title: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('remove'),
                                                        variant: "outline-primary",
                                                        children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                                            icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faTrashAlt)
                                                        })
                                                    }),
                                                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Button), {
                                                        onClick: ()=>this.onCopy(item.intCode),
                                                        title: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('integrationcode'),
                                                        variant: "outline-primary",
                                                        children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                                            icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faCopy)
                                                        })
                                                    })
                                                ]
                                            })
                                        })
                                    ]
                                }, index);
                                return row;
                            })
                        })
                    ]
                }),
                this.state.nId >= 0 && /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)($1f80b4d9d79eca51$var$NoteForm, {
                    nId: this.state.nId,
                    selectedGroup: this.state.selectedGroup,
                    onClose: this.onClose
                }),
                this.state.showGroupForm && /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)($1f80b4d9d79eca51$var$GroupForm, {
                    onClose: this.onCloseGroupForm,
                    data: this.state.selectedGroup
                }),
                this.state.showGroupOrderForm && /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)($1f80b4d9d79eca51$var$GroupOrderForm, {
                    onClose: ()=>this.showGroupOrderForm(false),
                    ctId: (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.id
                }),
                this.state.copyIC.length > 0 && /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)($1f80b4d9d79eca51$var$ModalGenerateIntCode, {
                    onClose: this.onClose,
                    onCopy: this.onClose,
                    intCode: this.state.copyIC
                })
            ]
        });
        return main;
    }
    removeNoteGroup() {
        let that = this;
        let callback = function(result) {
            if (result.success) that.setState({
                selectedGroup: null,
                groupNoteList: []
            });
            else (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).feedback.showError((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname'), result.msg);
        };
        if (window.confirm((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('msgconfirmdeletion'))) (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.removeNoteGroup((0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.id, this.state.selectedGroup.id, callback);
    }
    onAddCollection() {
        this.setState({
            showGroupForm: true,
            selectedGroup: null,
            groupNoteList: []
        });
    }
    onCloneCollection() {
        let group = this.state.selectedGroup;
        let that = this;
        let callback = function(result) {
            if (result.success) {
                that.setState({
                    groupNoteList: []
                });
                that.getData();
            } else (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).feedback.showError((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname'), result.msg);
        };
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.cloneNoteGroup([
            group
        ], callback);
        this.setState({
            selectedGroup: null
        });
    }
    onEditCollection() {
        this.setState({
            showGroupForm: true
        });
    }
    onCloseGroupForm() {
        this.setState({
            showGroupForm: false
        });
    }
    showGroupOrderForm(show) {
        this.setState({
            showGroupOrderForm: show
        });
    }
    getSuggestedNotesPrintLink() {
        let selectedgId = this.state.selectedGroup !== null ? this.state.selectedGroup.id : 0;
        return (0, $92c24a6ef437e0f2$export$a92d6367f4c5e085).wwwRoot() + `/mod/recitcahiertraces/classes/ReportSuggestedNotes.php?gId=${selectedgId}&cmId=${(0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.id}`;
    }
    onDragRow(item, index) {
        this.setState({
            draggingItem: item
        });
    }
    onDropRow(item, index) {
        let that = this;
        let callback = function(result) {
            if (result.success) that.getData2();
            else (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).feedback.showError((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname'), result.msg);
        };
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.switchNoteSlot(this.state.draggingItem.id, item.id, (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.id, callback);
    }
    onAddNote() {
        this.setState({
            nId: 0
        });
    }
    onEditNote(nId) {
        this.setState({
            nId: nId
        });
    }
    onRemoveNote(item) {
        let callback = function(result) {
            if (result.success) (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).feedback.showInfo((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname'), (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('msgsuccess'), 3);
            else (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).feedback.showError((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname'), result.msg);
        };
        if (window.confirm((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('msgconfirmdeletion'))) (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.removeNote(item.id, (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.id, callback);
    }
    onSelectGroup(event) {
        this.setState({
            selectedGroup: event.target.data
        }, this.getData2);
    }
    onCopy(intCode) {
        this.setState({
            copyIC: intCode
        });
    }
    onClose() {
        this.setState({
            nId: -1,
            copyIC: ""
        });
    }
}
class $1f80b4d9d79eca51$var$ModalGenerateIntCode extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        intCode: "",
        onClose: null,
        onCopy: null
    };
    constructor(props){
        super(props);
        this.onCopy = this.onCopy.bind(this);
        this.onDataChange = this.onDataChange.bind(this);
        this.state = {
            data: {
                nbLines: 15,
                color: '#000000',
                btnSaveVariant: 'btn btn-success',
                btnResetVariant: 'btn btn-secondary'
            }
        };
        this.intCodeRef = /*#__PURE__*/ (0, ($parcel$interopDefault($ltMAx$react))).createRef();
    }
    render() {
        let body = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Form), {
            children: [
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Row, {
                    children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Form).Group, {
                        as: (0, $ltMAx$reactbootstrap.Col),
                        children: [
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Label, {
                                children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('nblines')
                            }),
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $f543a3a06df0c00b$export$cf9581d419a141cf), {
                                value: this.state.data.nbLines,
                                name: "nbLines",
                                min: 1,
                                onChange: this.onDataChange
                            })
                        ]
                    })
                }),
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Row, {
                    children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Form).Group, {
                        as: (0, $ltMAx$reactbootstrap.Col),
                        children: [
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Label, {
                                children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('color')
                            }),
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Control, {
                                type: "color",
                                value: this.state.data.color,
                                name: "color",
                                onChange: this.onDataChange,
                                style: {
                                    width: "80px"
                                }
                            })
                        ]
                    })
                }),
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Row, {
                    children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Form).Group, {
                        as: (0, $ltMAx$reactbootstrap.Col),
                        children: [
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Form).Label, {
                                children: [
                                    (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('savebtn'),
                                    " ",
                                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)($1f80b4d9d79eca51$export$78bddedbcf2939ac, {
                                        helpText: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactjsxruntime.Fragment), {
                                            children: [
                                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("span", {
                                                    children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('infobs')
                                                }),
                                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("br", {}),
                                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("a", {
                                                    href: "https://getbootstrap.com/docs/4.6/utilities/borders/#border-radius",
                                                    target: "_blank",
                                                    children: [
                                                        (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('btnshape'),
                                                        " ",
                                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("i", {
                                                            className: "p-1 fa fa-info-circle"
                                                        }),
                                                        " "
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("br", {}),
                                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("a", {
                                                    href: "https://getbootstrap.com/docs/4.6/components/buttons/",
                                                    target: "_blank",
                                                    children: [
                                                        (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('btnlook'),
                                                        " ",
                                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("i", {
                                                            className: "p-1 fa fa-info-circle"
                                                        }),
                                                        " "
                                                    ]
                                                })
                                            ]
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Control, {
                                type: "text",
                                value: this.state.data.btnSaveVariant,
                                name: "btnSaveVariant",
                                onChange: this.onDataChange
                            }),
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Text, {
                                className: "text-muted",
                                children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('savebtndesc')
                            })
                        ]
                    })
                }),
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Row, {
                    children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Form).Group, {
                        as: (0, $ltMAx$reactbootstrap.Col),
                        children: [
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Label, {
                                children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('preview')
                            }),
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("br", {}),
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("a", {
                                className: this.state.data.btnSaveVariant,
                                children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('save')
                            })
                        ]
                    })
                }),
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Row, {
                    children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Form).Group, {
                        as: (0, $ltMAx$reactbootstrap.Col),
                        children: [
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Form).Label, {
                                children: [
                                    (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('resetbtn'),
                                    " ",
                                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)($1f80b4d9d79eca51$export$78bddedbcf2939ac, {
                                        helpText: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactjsxruntime.Fragment), {
                                            children: [
                                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("span", {
                                                    children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('infobs')
                                                }),
                                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("br", {}),
                                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("a", {
                                                    href: "https://getbootstrap.com/docs/4.6/utilities/borders/#border-radius",
                                                    target: "_blank",
                                                    children: [
                                                        (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('btnshape'),
                                                        " ",
                                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("i", {
                                                            className: "p-1 fa fa-info-circle"
                                                        }),
                                                        " "
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("br", {}),
                                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("a", {
                                                    href: "https://getbootstrap.com/docs/4.6/components/buttons/",
                                                    target: "_blank",
                                                    children: [
                                                        (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('btnlook'),
                                                        " ",
                                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("i", {
                                                            className: "p-1 fa fa-info-circle"
                                                        }),
                                                        " "
                                                    ]
                                                })
                                            ]
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Control, {
                                type: "text",
                                value: this.state.data.btnResetVariant,
                                name: "btnResetVariant",
                                onChange: this.onDataChange
                            }),
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Text, {
                                className: "text-muted",
                                children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('resetbtndesc')
                            })
                        ]
                    })
                }),
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Row, {
                    children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Form).Group, {
                        as: (0, $ltMAx$reactbootstrap.Col),
                        children: [
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Label, {
                                children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('preview')
                            }),
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("br", {}),
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("a", {
                                className: this.state.data.btnResetVariant,
                                children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('reset')
                            })
                        ]
                    })
                }),
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Control, {
                    type: "hidden",
                    ref: this.intCodeRef
                })
            ]
        });
        let footer = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
            className: "btn-tollbar",
            style: {
                width: "100%",
                display: "flex",
                justifyContent: "flex-end"
            },
            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
                className: "btn-group",
                children: [
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Button), {
                        variant: "secondary",
                        onClick: this.props.onClose,
                        children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('cancel')
                    }),
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Button), {
                        variant: "success",
                        onClick: this.onCopy,
                        children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('copy')
                    })
                ]
            })
        });
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $11f4b0362cb6d337$export$2b77a92f1a5ad772), {
            title: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('createintegrationcode'),
            body: body,
            footer: footer,
            onClose: this.props.onClose,
            width: "400px"
        });
        return main;
    }
    onDataChange(event) {
        let data = this.state.data;
        data[event.target.name] = event.target.value;
        this.setState({
            data: data
        });
    }
    getIntegrationCode() {
        return `{"intCode":"${this.props.intCode}", "nbLines": "${Math.max(1, this.state.data.nbLines)}", "color": "${this.state.data.color}", "btnSaveVariant": "${this.state.data.btnSaveVariant}", "btnResetVariant": "${this.state.data.btnResetVariant}"}`;
    }
    onCopy() {
        this.intCodeRef.current.value = this.getIntegrationCode();
        this.intCodeRef.current.type = "text";
        this.intCodeRef.current.select();
        document.execCommand('copy');
        this.intCodeRef.current.type = "hidden";
        this.props.onCopy();
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).feedback.showInfo((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname'), (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('msgsuccess'), 3);
    }
}
class $1f80b4d9d79eca51$export$78bddedbcf2939ac extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        helpText: '',
        icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faQuestionCircle)
    };
    constructor(props){
        super(props);
    }
    render() {
        const popover = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Popover), {
            id: "popover-help",
            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Popover).Content, {
                children: this.props.helpText
            })
        });
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.OverlayTrigger), {
            trigger: "focus",
            placement: "right",
            overlay: popover,
            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Button), {
                variant: "link",
                className: "p-0",
                children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                    icon: this.props.icon
                })
            })
        });
        return main;
    }
}
class $1f80b4d9d79eca51$var$GroupForm extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        onClose: null,
        data: null
    };
    constructor(props){
        super(props);
        this.onSave = this.onSave.bind(this);
        this.onDataChange = this.onDataChange.bind(this);
        this.state = {
            data: props.data || {
                id: 0,
                name: "",
                ct: {
                    id: 0,
                    mCmId: (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.id
                },
                slot: 0
            }
        };
    }
    render() {
        let body = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form), {
            onSubmit: (event)=>event.preventDefault(),
            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Row, {
                children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Form).Group, {
                    as: (0, $ltMAx$reactbootstrap.Col),
                    children: [
                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Label, {
                            children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('groupname')
                        }),
                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Form).Control, {
                            type: "text",
                            value: this.state.data.name,
                            name: "name",
                            onChange: this.onDataChange
                        })
                    ]
                })
            })
        });
        let footer = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
            className: "btn-tollbar",
            style: {
                width: "100%",
                display: "flex",
                justifyContent: "flex-end"
            },
            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
                className: "btn-group",
                children: [
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Button), {
                        variant: "secondary",
                        onClick: ()=>this.props.onClose(),
                        children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('cancel')
                    }),
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Button), {
                        variant: "success",
                        onClick: this.onSave,
                        disabled: this.state.data.name.length === 0,
                        children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('save')
                    })
                ]
            })
        });
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $11f4b0362cb6d337$export$2b77a92f1a5ad772), {
            title: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('notegroup'),
            body: body,
            footer: footer,
            onClose: ()=>this.props.onClose(),
            width: "400px"
        });
        return main;
    }
    onDataChange(event) {
        let data = this.state.data;
        data[event.target.name] = event.target.value;
        this.setState({
            data: data
        });
    }
    onSave() {
        let that = this;
        let callback = function(result) {
            if (result.success) that.setState({
                selectedGroup: null,
                groupNoteList: []
            }, that.props.onClose);
            else (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).feedback.showError((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname'), result.msg);
        };
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.saveNoteGroup([
            this.state.data
        ], callback);
    }
}
class $1f80b4d9d79eca51$var$GroupOrderForm extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        onClose: null
    };
    constructor(props){
        super(props);
        this.onSave = this.onSave.bind(this);
        this.onDataChange = this.onDataChange.bind(this);
        this.state = {
            data: []
        };
        this.getData();
    }
    getData() {
        let that = this;
        let callback = function(result) {
            if (!result.success) {
                (0, $b88808f85b3c6d03$export$55afab09d8db8987).instance.showError((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname'), result.msg);
                return;
            }
            let data = result.data.sort((item, item2)=>{
                return item.slot - item2.slot;
            });
            that.setState({
                data: data
            });
        };
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.getGroupList((0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.id, callback);
    }
    render() {
        let body = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
            style: {
                maxHeight: 500,
                overflowY: 'scroll'
            },
            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762), {
                children: [
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header, {
                        children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header.Row, {
                            children: [
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header.Cell, {
                                    style: {
                                        width: 100
                                    },
                                    children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('order')
                                }),
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header.Cell, {
                                    children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('group')
                                }),
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header.Cell, {
                                    style: {
                                        width: 70
                                    }
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body, {
                        children: this.state.data.map((item, index)=>{
                            let row = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body.Row, {
                                data: item,
                                children: [
                                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body.Cell, {
                                        children: item.slot.toString()
                                    }),
                                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body.Cell, {
                                        children: item.name
                                    }),
                                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body.Cell, {
                                        style: {
                                            textAlign: 'center'
                                        },
                                        children: [
                                            index > 0 && /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                                style: {
                                                    cursor: 'pointer',
                                                    marginRight: '1rem'
                                                },
                                                icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faArrowUp),
                                                title: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('moveitem'),
                                                onClick: ()=>this.onMoveRow(index, -1)
                                            }),
                                            index < this.state.data.length - 1 && /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                                style: {
                                                    cursor: 'pointer'
                                                },
                                                icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faArrowDown),
                                                title: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('moveitem'),
                                                onClick: ()=>this.onMoveRow(index, 1)
                                            })
                                        ]
                                    })
                                ]
                            }, index);
                            return row;
                        })
                    })
                ]
            })
        });
        let footer = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
            className: "btn-group",
            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Button), {
                variant: "primary",
                onClick: ()=>this.reorderGroups(),
                children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('close')
            })
        });
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $11f4b0362cb6d337$export$2b77a92f1a5ad772), {
            title: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('ordergroup'),
            body: body,
            footer: footer,
            onClose: ()=>this.props.onClose(),
            width: "500px"
        });
        return main;
    }
    reorderGroups() {
        let that = this;
        let callback = function(result) {
            if (result.success) that.getData();
            else (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).feedback.showError((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname'), result.msg);
        };
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.reorderNoteGroups((0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.id, callback);
        this.props.onClose();
    }
    onMoveRow(index, offset) {
        let data = this.state.data;
        let item = data[index + offset];
        let draggingItem = data[index];
        if (!draggingItem || item.id === draggingItem.id) return;
        let oldSlot = item.slot <= 0 ? 1 : item.slot;
        if (oldSlot == draggingItem.slot) oldSlot = oldSlot + offset <= 0 ? 1 : oldSlot + offset;
        item.slot = draggingItem.slot;
        draggingItem.slot = oldSlot;
        data = data.sort((item, item2)=>{
            return item.slot - item2.slot;
        });
        this.setState({
            data: data,
            flags: {
                dataChanged: true
            }
        }, ()=>{
            this.onSave([
                item,
                draggingItem
            ]);
        });
    }
    onDataChange(event) {
        let data = this.state.data;
        data[event.target.name] = event.target.value;
        this.setState({
            data: data
        });
    }
    onSave(items) {
        let callback = function(result) {
            if (!result.success) (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).feedback.showError((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname'), result.msg);
        };
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.saveNoteGroup(items, callback);
    }
}


// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
/**
 *
 * @package   mod_recitcahiertraces
 * @copyright 2019 RÉCIT 
 * @license   {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */ 






// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
/**
 *
 * @package   mod_recitcahiertraces
 * @copyright 2019 RÉCIT 
 * @license   {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */ 









class $88d8326bda7e1866$var$PersonalNoteForm extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        userId: 0,
        gId: 0,
        nId: 0,
        setOnSave: null
    };
    constructor(props){
        super(props);
        this.onDataChange = this.onDataChange.bind(this);
        this.getData = this.getData.bind(this);
        this.getDataResult = this.getDataResult.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onSaveResult = this.onSaveResult.bind(this);
        this.prepareNewState = this.prepareNewState.bind(this);
        this.onCollapse = this.onCollapse.bind(this);
        let mode = ""; // is it a student?
        // it is a teacher
        if ((0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).signedUser.roles.includes('t')) mode = "t";
        else if ((0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).signedUser.roles.includes('s')) mode = "s";
        this.state = {
            data: null,
            remoteData: null,
            dropdownLists: null,
            mode: mode,
            collapse: {
                note: true,
                suggestedNote: false,
                feedback: true
            }
        };
        this.editorRef = /*#__PURE__*/ (0, ($parcel$interopDefault($ltMAx$react))).createRef();
        this.editorDec = new (0, $8c7038e4fc3dc391$export$e46c992cf44cfc16)(`recit_cahiertraces_editor_container_1`);
        this.props.setOnSave(this.onSave);
    }
    componentDidMount() {
        this.getData();
    }
    componentWillUnmount() {
        this.editorDec.close();
        this.editorDec.dom.style.display = 'none';
        document.body.appendChild(this.editorDec.dom);
    }
    componentDidUpdate(prevProps) {
        if (this.editorRef.current !== null) {
            this.editorDec.show();
            if (!this.editorRef.current.hasChildNodes()) this.editorRef.current.appendChild(this.editorDec.dom);
        }
        if (prevProps.userId !== this.props.userId || prevProps.nId !== this.props.nId) this.getData();
    }
    getData() {
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.getUserNote((0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.id, this.props.nId, this.props.gId, this.props.userId, this.getDataResult);
    }
    getDataResult(result) {
        if (result.success) this.setState(this.prepareNewState(result.data, null));
        else (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).feedback.showError((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname'), result.msg);
    }
    prepareNewState(data, dropdownLists) {
        data = data || null;
        dropdownLists = dropdownLists || null;
        let result = {
            data: null,
            remoteData: data,
            dropdownLists: {}
        };
        if (data !== null) {
            result.data = {};
            result.data.userId = data.userId;
            result.data.courseId = data.noteDef.group.ct.courseId;
            result.data.lastUpdate = data.lastUpdate;
            result.data.nId = data.noteDef.id;
            result.data.nCmId = data.nCmId;
            result.data.feedback = data.feedback;
            result.data.unId = data.id;
            result.data.note = data.noteContent;
        }
        return result;
    }
    render() {
        if (this.state.remoteData === null) return null;
        let data = this.state.data;
        let student = null;
        let teacher = null;
        let suggestedNote = null;
        let styleText = {
            minHeight: 50,
            maxHeight: 400,
            overflowY: "auto",
            border: "1px solid #ddd",
            backgroundColor: "#fafafa",
            padding: 10
        };
        // it is a student?
        if (this.state.mode === "s") {
            this.editorDec.setValue(data.note.text);
            student = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
                ref: this.editorRef
            });
            teacher = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
                style: styleText,
                dangerouslySetInnerHTML: {
                    __html: data.feedback
                }
            });
        } else if (this.state.mode === "t") {
            this.editorDec.setValue(data.feedback);
            teacher = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
                ref: this.editorRef
            });
            student = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
                style: styleText,
                dangerouslySetInnerHTML: {
                    __html: data.note.text
                }
            });
            suggestedNote = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
                style: styleText,
                dangerouslySetInnerHTML: {
                    __html: this.state.remoteData.noteDef.suggestedNote
                }
            });
        } else return null;
        let styleHeader = {
            cursor: "pointer"
        };
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
            children: [
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("h5", {
                    className: "text-truncate",
                    children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('note') + ': ' + this.state.remoteData.noteDef.title
                }),
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Card), {
                    children: [
                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Card).Header, {
                            style: styleHeader,
                            onClick: ()=>this.onCollapse("note"),
                            children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('studentnote')
                        }),
                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Collapse), {
                            in: this.state.collapse.note,
                            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Card).Body, {
                                children: student
                            })
                        })
                    ]
                }),
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("br", {}),
                suggestedNote !== null && /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
                    children: [
                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Card), {
                            children: [
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Card).Header, {
                                    style: styleHeader,
                                    onClick: ()=>this.onCollapse("suggestedNote"),
                                    children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('suggestedresponse')
                                }),
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Collapse), {
                                    in: this.state.collapse.suggestedNote,
                                    children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Card).Body, {
                                        children: suggestedNote
                                    })
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("br", {})
                    ]
                }),
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Card), {
                    children: [
                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Card).Header, {
                            style: styleHeader,
                            onClick: ()=>this.onCollapse("feedback"),
                            children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('teacherfeedback')
                        }),
                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Collapse), {
                            in: this.state.collapse.feedback,
                            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Card).Body, {
                                children: teacher
                            })
                        })
                    ]
                })
            ]
        });
        return main;
    }
    onCollapse(name) {
        let data = this.state.collapse;
        data[name] = !data[name];
        let tmp = this.onEditorDataChange();
        this.setState({
            collapse: data,
            data: tmp.data
        });
    }
    onDataChange(event) {
        let data = this.state.data;
        data[event.target.name] = event.target.value;
        this.setState({
            data: data
        });
    }
    onEditorDataChange() {
        let data = (0, $92c24a6ef437e0f2$export$97af3c8c635dda5e).clone(this.state.data);
        let flags = {
            mode: this.state.mode,
            teacherFeedbackUpdated: 0
        };
        if (this.state.mode === "s") data.note.text = this.editorDec.getValue().text;
        else if (this.state.mode === "t") {
            let tmp = this.editorDec.getValue().text;
            flags.teacherFeedbackUpdated = tmp !== data.feedback ? 1 : 0;
            data.feedback = tmp;
        }
        data.userId = this.props.userId;
        return {
            data: data,
            flags: flags
        };
    }
    onSave(callback) {
        let tmp = this.onEditorDataChange();
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.saveUserNote(tmp.data, tmp.flags, (result)=>this.onSaveResult(result, callback));
    }
    onSaveResult(result, callback) {
        if (result.success) {
            this.setState(this.prepareNewState(result.data), ()=>{
                callback(result);
            });
            (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).feedback.showInfo((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname'), (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('msgsuccess'), 3);
        } else (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).feedback.showError((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname'), result.msg);
    }
}
class $88d8326bda7e1866$export$31c82edd1e70f70f extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        data: {},
        onClose: null,
        onPreviousStudent: null,
        onNextStudent: null,
        navStatus: {
            previous: false,
            next: false
        },
        modalTitle: ""
    };
    constructor(props){
        super(props);
        this.onSave = this.onSave.bind(this);
        this.setOnSave = this.setOnSave.bind(this);
        this.onClose = this.onClose.bind(this);
        this.state = {
            onSave: null
        };
    }
    render() {
        let personalNote = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)($88d8326bda7e1866$var$PersonalNoteForm, {
            userId: this.props.data.userId,
            gId: this.props.data.gId,
            setOnSave: this.setOnSave,
            nId: this.props.data.nId
        });
        let footer = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
            className: "btn-tollbar",
            style: {
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap"
            },
            children: [
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
                    className: "btn-group",
                    style: {
                        flexWrap: "wrap"
                    },
                    children: [
                        this.props.onNextStudent && /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Button), {
                            variant: "outline-primary",
                            onClick: this.props.onPreviousStudent,
                            disabled: !this.props.navStatus.previous,
                            children: [
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                    icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faArrowLeft)
                                }),
                                " " + (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('previousstudent')
                            ]
                        }),
                        this.props.onPreviousStudent && /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Button), {
                            variant: "outline-primary",
                            onClick: this.props.onNextStudent,
                            disabled: !this.props.navStatus.next,
                            children: [
                                (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('nextstudent') + " ",
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                    icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faArrowRight)
                                })
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
                    className: "btn-group",
                    style: {
                        flexWrap: "wrap"
                    },
                    children: [
                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Button), {
                            variant: "secondary",
                            onClick: this.onClose,
                            children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('cancel')
                        }),
                        this.props.onNextStudent && /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Button), {
                            variant: "success",
                            onClick: ()=>this.onSave(false),
                            children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('save')
                        }),
                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Button), {
                            variant: "success",
                            onClick: ()=>this.onSave(true),
                            children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('saveandclose')
                        })
                    ]
                })
            ]
        });
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $11f4b0362cb6d337$export$2b77a92f1a5ad772), {
            title: this.props.modalTitle,
            body: personalNote,
            footer: footer,
            onClose: this.props.onClose
        });
        return main;
    }
    setOnSave(onSave) {
        this.setState({
            onSave: onSave
        });
    }
    onSave(shouldClose) {
        let that = this;
        if (this.state.onSave) this.state.onSave((result)=>{
            if (result.success) {
                if (shouldClose) that.onClose();
            }
        });
    }
    onClose() {
        this.props.onClose();
    }
}




class $655fb2e9ba9cf7a8$var$ViewPrintingNotes extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        enrolledUserList: [],
        style: null
    };
    constructor(props){
        super(props);
        this.onSelectUser = this.onSelectUser.bind(this);
        this.state = {
            user: {
                id: 0,
                name: ''
            }
        };
    }
    render() {
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
            style: this.props.style,
            children: [
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)($655fb2e9ba9cf7a8$var$GroupUserSelect, {
                    dataProvider: this.props.enrolledUserList,
                    onSelectUser: this.onSelectUser
                }),
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("hr", {}),
                this.state.user.id > 0 && /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)($655fb2e9ba9cf7a8$var$ActionBar, {
                    gId: (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.id,
                    user: this.state.user
                })
            ]
        });
        return main;
    }
    onSelectUser(userId, username) {
        this.setState({
            user: {
                id: userId,
                name: username
            }
        });
    }
}
class $655fb2e9ba9cf7a8$var$ViewNavGroupAndStudents extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        enrolledUserList: [],
        style: null
    };
    constructor(props){
        super(props);
        this.onSelectUser = this.onSelectUser.bind(this);
        this.onNextStudent = this.onNextStudent.bind(this);
        this.onPreviousStudent = this.onPreviousStudent.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onClose = this.onClose.bind(this);
        this.groupUserSelect = /*#__PURE__*/ (0, ($parcel$interopDefault($ltMAx$react))).createRef();
        this.state = {
            data: {
                userId: 0,
                username: "",
                gId: 0,
                noteTitle: "",
                nId: 0
            }
        };
    }
    render() {
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
            style: this.props.style,
            children: [
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)($655fb2e9ba9cf7a8$var$GroupUserSelect, {
                    ref: this.groupUserSelect,
                    dataProvider: this.props.enrolledUserList,
                    onSelectUser: this.onSelectUser
                }),
                this.state.data.userId > 0 && /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
                    children: [
                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("hr", {}),
                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)($655fb2e9ba9cf7a8$var$NavActivities, {
                            userId: this.state.data.userId,
                            onEdit: this.onEdit,
                            isTeacher: true
                        }),
                        this.state.data.nId > 0 && /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $88d8326bda7e1866$export$31c82edd1e70f70f), {
                            modalTitle: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('student') + ': ' + this.state.data.username,
                            data: this.state.data,
                            onClose: this.onClose,
                            onNextStudent: this.onNextStudent,
                            onPreviousStudent: this.onPreviousStudent,
                            navStatus: this.getNavStatus()
                        })
                    ]
                })
            ]
        });
        return main;
    }
    onEdit(item) {
        if (item === null) return;
        let data = this.state.data;
        data.gId = item.noteDef.group.id;
        data.nId = item.noteDef.id;
        data.noteTitle = item.noteDef.title;
        this.setState({
            data: data
        });
    }
    onClose() {
        let data = this.state.data;
        data.gId = 0;
        data.nId = 0;
        data.noteTitle = "";
        this.setState({
            data: data
        });
    }
    onSelectUser(userId, username) {
        let data = this.state.data;
        data.userId = userId;
        data.username = username;
        this.setState({
            data: data
        });
    }
    onNextStudent() {
        this.groupUserSelect.current.onNext();
    }
    onPreviousStudent() {
        this.groupUserSelect.current.onPrevious();
    }
    getNavStatus() {
        if (this.groupUserSelect.current) return this.groupUserSelect.current.getNavStatus();
    }
}
class $655fb2e9ba9cf7a8$var$ViewRequiredNotes extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        show: false,
        style: null,
        onDataChange: null
    };
    constructor(props){
        super(props);
        this.getData = this.getData.bind(this);
        this.getDataResult = this.getDataResult.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onNextStudent = this.onNextStudent.bind(this);
        this.onPreviousStudent = this.onPreviousStudent.bind(this);
        this.state = {
            dataProvider: [],
            data: {
                userId: 0,
                username: "",
                gId: 0,
                noteTitle: "",
                nId: 0,
                unId: 0
            }
        };
    }
    componentDidMount() {
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.addObserver("ViewRequiredNotes", this.getData, [
            'saveUserNote'
        ]);
        this.getData();
    }
    componentWillUnmount() {
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.removeObserver("ViewRequiredNotes");
    }
    componentDidUpdate(prevProps) {
        if (this.props.show && !prevProps.show) this.getData();
    }
    getData() {
        if (this.props.show) (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.getRequiredNotes((0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.id, this.getDataResult);
    }
    getDataResult(result) {
        if (!result.success) {
            (0, $b88808f85b3c6d03$export$55afab09d8db8987).instance.showError((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname'), result.msg);
            return;
        }
        this.props.onDataChange({
            nbItems: result.data.length
        });
        this.setState({
            dataProvider: result.data
        });
    }
    render() {
        let that = this;
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
            style: this.props.style,
            children: [
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762), {
                    orderBy: true,
                    children: [
                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header, {
                            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header.Row, {
                                children: [
                                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header.Cell, {
                                        style: {
                                            width: 80
                                        },
                                        children: "#"
                                    }),
                                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header.Cell, {
                                        children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('activity')
                                    }),
                                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header.Cell, {
                                        children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('student')
                                    }),
                                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header.Cell, {
                                        children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('notetitle')
                                    }),
                                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header.Cell, {
                                        style: {
                                            width: 80
                                        }
                                    })
                                ]
                            })
                        }),
                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body, {
                            children: this.state.dataProvider.map((item, index)=>{
                                let row = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body.Row, {
                                    onDbClick: ()=>that.onEdit(item),
                                    children: [
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body.Cell, {
                                            children: index + 1
                                        }),
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body.Cell, {
                                            children: item.cmName
                                        }),
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body.Cell, {
                                            children: item.username
                                        }),
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body.Cell, {
                                            children: item.noteDef.title
                                        }),
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body.Cell, {
                                            style: {
                                                textAlign: 'center'
                                            },
                                            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.ButtonGroup), {
                                                size: "sm",
                                                children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Button), {
                                                    onClick: ()=>that.onEdit(item),
                                                    title: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('edit'),
                                                    variant: "primary",
                                                    children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                                        icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faPencilAlt)
                                                    })
                                                })
                                            })
                                        })
                                    ]
                                }, index);
                                return row;
                            })
                        })
                    ]
                }),
                this.state.data.nId > 0 && /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $88d8326bda7e1866$export$31c82edd1e70f70f), {
                    modalTitle: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('student') + ': ' + this.state.data.username,
                    data: this.state.data,
                    onClose: this.onClose,
                    onNextStudent: this.onNextStudent,
                    onPreviousStudent: this.onPreviousStudent,
                    navStatus: this.getNavStatus()
                })
            ]
        });
        return main;
    }
    onEdit(item) {
        if (item === null) {
            this.onClose();
            return;
        }
        let data = this.state.data;
        data.gId = item.noteDef.group.id;
        data.nId = item.noteDef.id;
        data.noteTitle = item.noteDef.title;
        data.userId = item.userId;
        data.username = item.username;
        data.unId = item.id;
        this.setState({
            data: data
        });
    }
    onClose() {
        let data = this.state.data;
        data.gId = 0;
        data.nId = 0;
        data.noteTitle = "";
        data.userId = 0;
        data.username = "";
        data.unId = 0;
        this.setState({
            data: data
        });
    }
    onNextStudent() {
        let index = (0, $92c24a6ef437e0f2$export$97af3c8c635dda5e).getItemIndex(this.state.dataProvider, 'id', this.state.data.unId) + 1;
        let item = (0, $92c24a6ef437e0f2$export$97af3c8c635dda5e).at(this.state.dataProvider, index, null);
        this.onEdit(item);
    }
    onPreviousStudent() {
        let index = (0, $92c24a6ef437e0f2$export$97af3c8c635dda5e).getItemIndex(this.state.dataProvider, 'id', this.state.data.unId) - 1;
        let item = (0, $92c24a6ef437e0f2$export$97af3c8c635dda5e).at(this.state.dataProvider, index, null);
        this.onEdit(item);
    }
    getNavStatus() {
        let index = (0, $92c24a6ef437e0f2$export$97af3c8c635dda5e).getItemIndex(this.state.dataProvider, 'id', this.state.data.unId);
        let result = {
            previous: !(index <= 0),
            next: !(this.state.dataProvider.length <= index + 1)
        };
        return result;
    }
}
class $655fb2e9ba9cf7a8$var$ViewProgression extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        show: false,
        style: null,
        onDetail: null,
        enrolledUserList: []
    };
    constructor(props){
        super(props);
        this.getData = this.getData.bind(this);
        this.getDataResult = this.getDataResult.bind(this);
        this.onSelectGroup = this.onSelectGroup.bind(this);
        //this.onDetail = this.onDetail.bind(this);
        //this.onBack = this.onBack.bind(this);
        this.state = {
            dataProvider: [],
            groupId: 0
        }; //, userId: 0
    }
    componentDidMount() {
        this.getData();
    }
    componentWillUnmount() {}
    componentDidUpdate(prevProps) {
        if (this.props.show && !prevProps.show) this.getData();
    }
    getData() {
        if (this.props.show) (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.getStudentsProgression((0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.id, this.getDataResult);
    }
    getDataResult(result) {
        if (!result.success) {
            (0, $b88808f85b3c6d03$export$55afab09d8db8987).instance.showError((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname'), result.msg);
            return;
        }
        this.setState({
            dataProvider: result.data
        });
    }
    render() {
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
            style: this.props.style,
            children: [
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)($655fb2e9ba9cf7a8$var$GroupUserSelect, {
                    ref: this.groupUserSelect,
                    dataProvider: this.props.enrolledUserList,
                    onSelectGroup: this.onSelectGroup
                }),
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("hr", {}),
                this.getSummary()
            ]
        });
        //{this.state.userId > 0 ? this.getDetails() : this.getSummary()}
        return main;
    }
    getSummary() {
        let data = {};
        for (let item of this.state.dataProvider){
            if (!item.groupIds.includes(this.state.groupId)) continue;
            if (!data.hasOwnProperty(`user${item.userId}`)) data[`user${item.userId}`] = {
                username: item.username,
                userId: item.userId,
                nbDone: 0,
                nbTotal: 0
            };
            data[`user${item.userId}`].nbDone += parseInt(item.done);
            data[`user${item.userId}`].nbTotal += 1;
        }
        let rows = [];
        for(let attr in data){
            let pct = data[attr].nbDone / data[attr].nbTotal * 100;
            let row = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body.Row, {
                children: [
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body.Cell, {
                        children: rows.length + 1
                    }),
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body.Cell, {
                        children: data[attr].username
                    }),
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body.Cell, {
                        sortValue: pct,
                        children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Button), {
                            onClick: ()=>this.onDetail(parseInt(data[attr].userId)),
                            variant: "link",
                            children: `${pct.toFixed(0)}%`
                        })
                    })
                ]
            }, rows.length);
            rows.push(row);
        }
        let result = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762), {
            orderBy: true,
            children: [
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header, {
                    children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header.Row, {
                        children: [
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header.Cell, {
                                style: {
                                    width: 80
                                },
                                children: "#"
                            }),
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header.Cell, {
                                children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('student')
                            }),
                            /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Header.Cell, {
                                style: {
                                    width: 120
                                },
                                children: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('progress')
                            })
                        ]
                    })
                }),
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $2d4e58d7a4dff333$export$c8dd51eb24f71762).Body, {
                    children: rows
                })
            ]
        });
        return result;
    }
    onDetail(userId) {
        //this.setState({userId: userId});
        this.props.onDetail(userId);
    }
    onSelectGroup(groupId) {
        this.setState({
            groupId: groupId
        });
    }
}
class $655fb2e9ba9cf7a8$var$NavActivities extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        userId: 0,
        isTeacher: false,
        onEdit: null
    };
    constructor(props){
        super(props);
        this.getData = this.getData.bind(this);
        this.getDataResult = this.getDataResult.bind(this);
        this.onSelectTab = this.onSelectTab.bind(this);
        this.state = {
            activeTab: 0,
            dataProvider: []
        };
    }
    componentDidMount() {
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.addObserver("NavActivities", this.getData, [
            'saveUserNote'
        ]);
        this.getData();
    }
    componentWillUnmount() {
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.removeObserver("NavActivities");
    }
    componentDidUpdate(prevProps) {
        if (prevProps.userId !== this.props.userId) this.getData();
    }
    getData() {
        if (this.props.userId === 0) {
            this.setState({
                dataProvider: []
            });
            return;
        }
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.getUserNotes((0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.id, this.props.userId, this.props.isTeacher ? 't' : 's', this.getDataResult);
    }
    getDataResult(result) {
        if (!result.success) {
            (0, $b88808f85b3c6d03$export$55afab09d8db8987).instance.showError((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname'), result.msg);
            return;
        }
        for (let items of result.data)for(let i = 0; i < items.length; i++){
            if (items[i].nCmId === 0) items[i].cmName = (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('notenotcompleted');
            if (items[i].nCmId == -1) items[i].cmName = (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('notenotrestored');
        }
        // If the user is trying to load automatically some note by URL
        if (!(0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.groupLoaded) {
            let item = null;
            for (let group of result.data){
                for (let userNote of group)if (userNote.noteDef.id === (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.nId && userNote.noteDef.group.id === (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.gId) item = note;
            }
            (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.groupLoaded = true;
            this.setState({
                dataProvider: result.data
            }, ()=>this.props.onEdit(item));
        } else this.setState({
            dataProvider: result.data
        });
    }
    render() {
        let that = this;
        let isStudent = this.props.isTeacher ? false : true;
        let navItems = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactjsxruntime.Fragment), {
            children: this.state.dataProvider.map(function(items, index) {
                let groupName = (0, $92c24a6ef437e0f2$export$97af3c8c635dda5e).at(items, 0).noteDef.group.name;
                let pctProgress = that.getPctProgress(items);
                return /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Nav).Item, {
                    className: "m-1 bg-light",
                    children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Nav).Link, {
                        eventKey: index,
                        children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
                            style: {
                                display: "flex",
                                width: '315px',
                                justifyContent: "space-evenly"
                            },
                            title: `${groupName} (${pctProgress.toFixed(0)}%)`,
                            children: [
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("span", {
                                    className: "text-truncate",
                                    children: `${groupName} `
                                }),
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Badge), {
                                    pill: true,
                                    variant: "light",
                                    children: ` ${pctProgress.toFixed(0)}%`
                                })
                            ]
                        })
                    })
                }, index);
            })
        });
        let view = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactjsxruntime.Fragment), {
            children: [
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Row), {
                    children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Nav), {
                        variant: "pills",
                        children: navItems
                    })
                }),
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Row), {
                    children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Tab).Content, {
                        className: "w-100",
                        children: this.state.dataProvider.map(function(items, index) {
                            let result = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Tab).Pane, {
                                eventKey: index,
                                children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
                                    className: "groupContent card border-0 m-0 p-0 position-relative bg-transparent",
                                    children: items.map((item, index2)=>{
                                        let retro = null;
                                        let time = "";
                                        if (item.lastUpdate > 0) time = (0, $92c24a6ef437e0f2$export$9e4ad27aafee2a55).formatTime(item.lastUpdate) + " - ";
                                        if (isStudent && item.feedback.length > 0) retro = that.createFeedbackView(index2, item);
                                        else if (that.props.isTeacher) retro = that.createFeedbackView(index2, item);
                                        let row = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
                                            className: "balon2 p-2 m-0 position-relative",
                                            "data-is": time + (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('activity') + ": " + that.formatText(item.cmName),
                                            children: [
                                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
                                                    className: "float-left w-100 balon2-content",
                                                    children: [
                                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("p", {
                                                            style: {
                                                                fontWeight: 'bold'
                                                            },
                                                            children: [
                                                                that.props.isTeacher && item.noteDef.notifyTeacher === 1 ? /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("span", {
                                                                    title: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('feedbackrequired'),
                                                                    className: "btn-link",
                                                                    children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                                                        icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faCommentDots)
                                                                    })
                                                                }) : null,
                                                                ` ${index2 + 1}. `,
                                                                `${item.noteDef.title}`
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("p", {
                                                            dangerouslySetInnerHTML: {
                                                                __html: item.noteContent.text
                                                            }
                                                        })
                                                    ]
                                                }),
                                                isStudent && /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Button), {
                                                    disabled: item.nCmId === 0,
                                                    onClick: ()=>that.props.onEdit(item),
                                                    title: "Modifier",
                                                    variant: "link",
                                                    children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                                        icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faPencilAlt)
                                                    })
                                                })
                                            ]
                                        }, index2);
                                        return [
                                            row,
                                            retro
                                        ];
                                    })
                                })
                            }, index);
                            // {(item.noteDef.notifyTeacher === 1 ? <Button disabled={true} title="Rétroaction requise" size="sm" variant="warning"><FontAwesomeIcon icon={faCommentDots}/></Button> : null)}
                            return result;
                        })
                    })
                })
            ]
        });
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Tab).Container, {
            id: "tabActivities",
            activeKey: this.state.activeTab,
            onSelect: this.onSelectTab,
            children: view
        });
        return main;
    }
    createFeedbackView(index, item) {
        let text = item.feedback.length === 0 ? '<span style="opacity: .6">' + (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('givefeedback') + '</span>' : item.feedbackFiltered;
        let result = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
            className: "balon1 p-2 m-0 position-relative d-flex",
            "data-is": (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('teacherfeedback'),
            style: {
                justifyContent: 'flex-end',
                alignItems: 'flex-start'
            },
            children: [
                this.props.isTeacher && /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Button), {
                    className: "",
                    onClick: ()=>this.props.onEdit(item),
                    title: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('edit'),
                    variant: "link",
                    children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                        icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faPencilAlt)
                    })
                }),
                this.props.isTeacher && item.noteDef.suggestedNote.length > 0 && /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Button), {
                    className: "",
                    onClick: ()=>this.onSendSuggestedNote(item),
                    title: "Envoyer la r\xe9ponse sugg\xe9r\xe9e",
                    variant: "link",
                    children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                        icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faCopy)
                    })
                }),
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
                    className: "balon1-content",
                    style: {
                        minWidth: "30%",
                        minHeight: "3rem"
                    },
                    dangerouslySetInnerHTML: {
                        __html: text
                    }
                })
            ]
        }, "key" + index);
        return result;
    }
    onSendSuggestedNote(item) {
        let data = {};
        data.userId = this.props.userId;
        data.courseId = item.noteDef.group.ct.courseId;
        data.nId = item.noteDef.id;
        data.unId = item.id;
        if (item.feedback.length > 0) data.feedback = item.feedback + "<br>" + item.noteDef.suggestedNote;
        else data.feedback = item.noteDef.suggestedNote;
        let flags = {
            mode: 't',
            teacherFeedbackUpdated: 1
        };
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.saveUserNote(data, flags, (result)=>{});
    }
    getPctProgress(items) {
        let result = 0;
        let done = 0;
        for (let item of items)if (parseInt(item.isTemplate) == 0) done++;
        result = done / items.length * 100;
        return result;
    }
    formatText(text, length) {
        length = length || 150;
        let tmp = document.createElement("div");
        tmp.innerHTML = text;
        text = tmp.textContent || tmp.innerText || ""; // Retrieve the text property of the element (cross-browser support)
        return text.length > length ? `${text.substr(0, length)}...` : text;
    }
    onSelectTab(eventKey) {
        this.setState({
            activeTab: eventKey
        });
    }
}
class $655fb2e9ba9cf7a8$export$89cba99550dbea5a extends (0, $ltMAx$react.Component) {
    constructor(props){
        super(props);
        this.getData = this.getData.bind(this);
        this.getDataResult = this.getDataResult.bind(this);
        this.onDataChange = this.onDataChange.bind(this);
        this.onSetTab = this.onSetTab.bind(this);
        this.onProgressionDetail = this.onProgressionDetail.bind(this);
        this.state = {
            tab: (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.tab.toString(),
            nbFeedback: "?",
            enrolledUserList: []
        };
    }
    componentDidMount() {
        this.getData();
    }
    getData() {
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi.getEnrolledUserList((0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.id, this.getDataResult);
    }
    getDataResult(result) {
        if (!result.success) {
            (0, $b88808f85b3c6d03$export$55afab09d8db8987).instance.showError((0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname'), result.msg);
            return;
        }
        this.setState({
            enrolledUserList: result.data
        });
    }
    render() {
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Tabs), {
                activeKey: this.state.tab,
                id: "tabTeacherNotebook",
                onSelect: this.onSetTab,
                children: [
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Tab), {
                        eventKey: "0",
                        title: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("span", {
                            children: [
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                    icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faCompass)
                                }),
                                " ",
                                (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('viewnotes')
                            ]
                        }),
                        children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)($655fb2e9ba9cf7a8$var$ViewNavGroupAndStudents, {
                            style: {
                                padding: "1rem"
                            },
                            enrolledUserList: this.state.enrolledUserList
                        })
                    }),
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Tab), {
                        eventKey: "1",
                        title: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("span", {
                            children: [
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                    icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faCommentDots)
                                }),
                                " ",
                                (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('feedbackmissing'),
                                " ",
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Badge), {
                                    variant: "light",
                                    children: this.state.nbFeedback
                                })
                            ]
                        }),
                        children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)($655fb2e9ba9cf7a8$var$ViewRequiredNotes, {
                            show: this.state.tab === "1",
                            style: {
                                padding: "1rem"
                            },
                            onDataChange: this.onDataChange
                        })
                    }),
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Tab), {
                        eventKey: "2",
                        title: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("span", {
                            children: [
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                    icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faTasks)
                                }),
                                " ",
                                (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('progress')
                            ]
                        }),
                        children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)($655fb2e9ba9cf7a8$var$ViewProgression, {
                            show: this.state.tab === "2",
                            style: {
                                padding: "1rem"
                            },
                            onDetail: this.onProgressionDetail,
                            enrolledUserList: this.state.enrolledUserList
                        })
                    }),
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Tab), {
                        eventKey: "3",
                        title: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("span", {
                            children: [
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                    icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faPrint)
                                }),
                                " ",
                                (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('printnotes')
                            ]
                        }),
                        children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)($655fb2e9ba9cf7a8$var$ViewPrintingNotes, {
                            style: {
                                padding: "1rem"
                            },
                            enrolledUserList: this.state.enrolledUserList
                        })
                    })
                ]
            })
        });
        return main;
    }
    onSetTab(tab) {
        this.setState({
            tab: tab
        });
    }
    onDataChange(item) {
        this.setState({
            nbFeedback: item.nbItems
        });
    }
    onProgressionDetail(userId) {
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.userLoaded = false;
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.userId = userId;
        this.onSetTab("0");
    }
}
class $655fb2e9ba9cf7a8$export$f37c3f41bbbd5d80 extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        userId: 0
    };
    constructor(props){
        super(props);
        this.onEdit = this.onEdit.bind(this);
        this.onClose = this.onClose.bind(this);
        this.state = {
            data: {
                userId: props.userId,
                username: "",
                gId: 0,
                noteTitle: "",
                nId: 0
            }
        };
    }
    render() {
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
            children: this.state.data.userId > 0 && /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
                children: [
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)($655fb2e9ba9cf7a8$var$ActionBar, {
                        user: {
                            id: this.state.data.userId,
                            name: ''
                        }
                    }),
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("hr", {}),
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)($655fb2e9ba9cf7a8$var$NavActivities, {
                        userId: this.state.data.userId,
                        onEdit: this.onEdit
                    }),
                    this.state.data.nId > 0 && /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $88d8326bda7e1866$export$31c82edd1e70f70f), {
                        modalTitle: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('pluginname') + ' - ' + (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('mynotes'),
                        data: this.state.data,
                        onClose: this.onClose
                    })
                ]
            })
        });
        return main;
    }
    onEdit(item) {
        if (item === null) return;
        let data = this.state.data;
        data.gId = item.noteDef.group.id;
        data.nId = item.noteDef.id;
        data.noteTitle = item.noteDef.title;
        this.setState({
            data: data
        });
    }
    onClose() {
        let data = this.state.data;
        data.gId = 0;
        data.nId = 0;
        data.noteTitle = "";
        this.setState({
            data: data
        });
    }
}
class $655fb2e9ba9cf7a8$var$ActionBar extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        user: {
            id: 0,
            name: ''
        }
    };
    render() {
        let btnText = ` ${(0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('printnotes')}`;
        btnText = this.props.user.name.length > 0 ? `${btnText} (${this.props.user.name})` : btnText;
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
            style: {
                marginBottom: "1rem"
            },
            children: [
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("a", {
                    className: "btn btn-outline-primary",
                    href: this.getPrintLink(1),
                    target: "_blank",
                    children: [
                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                            icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faPrint)
                        }),
                        btnText
                    ]
                }),
                (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).signedUser.portfolioUrl && /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("a", {
                    href: (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).signedUser.portfolioUrl,
                    className: "btn btn-outline-primary",
                    target: "_blank",
                    style: {
                        marginLeft: '15px'
                    },
                    children: [
                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                            icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faFileExport)
                        }),
                        ` ${(0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('exportnotesportfolio')}`
                    ]
                })
            ]
        });
        return main;
    }
    getPrintLink(showFeedback) {
        return (0, $92c24a6ef437e0f2$export$a92d6367f4c5e085).wwwRoot() + `/mod/recitcahiertraces/classes/ReportStudentNotes.php?cmId=${(0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.id}&userId=${this.props.user.id}&sf=${showFeedback || 0}`;
    }
}
class $655fb2e9ba9cf7a8$var$GroupUserSelect extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        dataProvider: [],
        onSelectUser: null,
        onSelectGroup: null
    };
    constructor(props){
        super(props);
        this.onSelectGroup = this.onSelectGroup.bind(this);
        this.onSelectUser = this.onSelectUser.bind(this);
        this.onPrevious = this.onPrevious.bind(this);
        this.onNext = this.onNext.bind(this);
        this.state = {
            selectedUserIndex: -1,
            selectedGroupId: -1,
            groupList: [],
            userList: [],
            userListFiltered: []
        };
    }
    componentDidMount() {
        this.prepareData(this.props.dataProvider);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.dataProvider.length !== this.props.dataProvider.length || !(0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.userLoaded) this.prepareData(this.props.dataProvider);
    }
    prepareData(dataProvider) {
        let groupList = [];
        let userList = [];
        for (let group of dataProvider){
            // groupId = 0 means no group
            if (group[0].groupId > 0) groupList.push({
                text: group[0].groupName,
                value: parseInt(group[0].groupId),
                data: group
            });
            for (let user of group)if ((0, $92c24a6ef437e0f2$export$97af3c8c635dda5e).getItem(userList, "value", parseInt(user.userId), null) === null) userList.push({
                text: user.userName,
                value: parseInt(user.userId),
                data: user
            });
        }
        groupList.sort((a, b)=>{
            return ('' + a.text).localeCompare(b.text);
        });
        userList.sort((a, b)=>{
            return ('' + a.text).localeCompare(b.text);
        });
        if (!(0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.userLoaded && (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.userId > 0) {
            let item = (0, $92c24a6ef437e0f2$export$97af3c8c635dda5e).getItem(userList, 'value', (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.userId, null);
            if (item !== null) {
                this.setState({
                    groupList: groupList,
                    userList: userList,
                    userListFiltered: userList,
                    selectedUserIndex: (0, $92c24a6ef437e0f2$export$97af3c8c635dda5e).getItemIndex(userList, 'value', (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.userId)
                }, item === null ? null : ()=>this.props.onSelectUser(parseInt(item.value, 10), item.text));
                (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.userLoaded = true;
            }
        } else {
            this.setState({
                groupList: groupList,
                userList: userList,
                userListFiltered: userList
            });
            (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.userLoaded = true;
        }
    }
    render() {
        let value = "";
        //if(userList.nxExists(this.state.selectedUserIndex)){
        if ((0, $92c24a6ef437e0f2$export$97af3c8c635dda5e).exists(this.state.userListFiltered, this.state.selectedUserIndex)) value = this.state.userListFiltered[this.state.selectedUserIndex].value;
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Row), {
                children: [
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Col), {
                        sm: 6,
                        children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Form).Group, {
                            as: (0, $ltMAx$reactbootstrap.Col),
                            children: [
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Form).Label, {
                                    children: [
                                        (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('selectgroup'),
                                        ":"
                                    ]
                                }),
                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $35da119215127171$export$72b9695b8216309a), {
                                    placeholder: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('selectoption'),
                                    options: this.state.groupList,
                                    onChange: this.onSelectGroup,
                                    value: this.state.selectedGroupId
                                })
                            ]
                        })
                    }),
                    this.props.onSelectUser !== null && /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Col), {
                        sm: 6,
                        children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Row), {
                            children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Col), {
                                sm: 12,
                                children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Form).Group, {
                                    as: (0, $ltMAx$reactbootstrap.Col),
                                    children: [
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.Form).Label, {
                                            children: [
                                                (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('selectuser'),
                                                ":"
                                            ]
                                        }),
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $35da119215127171$export$72b9695b8216309a), {
                                            placeholder: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('selectoption'),
                                            options: this.state.userListFiltered,
                                            onChange: this.onSelectUser,
                                            value: value,
                                            style: {
                                                float: "left",
                                                width: "90%"
                                            }
                                        }),
                                        /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)((0, $ltMAx$reactbootstrap.ButtonGroup), {
                                            style: {
                                                display: "flex"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Button), {
                                                    variant: "link",
                                                    onClick: this.onPrevious,
                                                    disabled: this.state.selectedUserIndex <= -1,
                                                    children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                                        icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faArrowLeft)
                                                    })
                                                }),
                                                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$reactbootstrap.Button), {
                                                    variant: "link",
                                                    onClick: this.onNext,
                                                    disabled: this.state.userListFiltered.length <= this.state.selectedUserIndex + 1,
                                                    children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                                                        icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faArrowRight)
                                                    })
                                                })
                                            ]
                                        })
                                    ]
                                })
                            })
                        })
                    })
                ]
            })
        });
        /*<ButtonGroup style={{display: "flex", justifyContent: "center"}}>
                                    <Button variant="secondary" onClick={this.onPrevious} disabled={(this.state.selectedUserIndex <= -1)}><FontAwesomeIcon icon={faArrowLeft}/>{" " + $glVars.i18n.tags.previousStudent}</Button>
                                    <Button variant="secondary" onClick={this.onNext} disabled={(this.state.userListFiltered.length <= (this.state.selectedUserIndex + 1))}>{$glVars.i18n.tags.nextStudent + " "}<FontAwesomeIcon icon={faArrowRight}/></Button>
                                </ButtonGroup>*/ return main;
    }
    onSelectGroup(event) {
        let userListFiltered = this.state.userList;
        let selectedGroupId = parseInt(event.target.value || 0, 10);
        if (selectedGroupId > 0) userListFiltered = this.state.userList.filter(function(item) {
            return parseInt(item.data.groupId) === selectedGroupId;
        });
        this.setState({
            selectedGroupId: selectedGroupId,
            selectedUserIndex: -1,
            userListFiltered: userListFiltered
        }, ()=>{
            if (this.props.onSelectGroup) this.props.onSelectGroup(selectedGroupId);
        });
    }
    onSelectUser(event) {
        let index = event.target.index;
        let item = {
            text: "",
            value: 0
        };
        if (this.state.userListFiltered[index]) {
            item.text = this.state.userListFiltered[index].text;
            item.value = parseInt(this.state.userListFiltered[index].value, 10);
        }
        this.setState({
            selectedUserIndex: index
        }, ()=>{
            if (this.props.onSelectUser) this.props.onSelectUser(item.value, item.text);
        });
    }
    onPrevious() {
        let newIndex = this.state.selectedUserIndex - 1;
        let item = {
            text: "",
            value: 0
        };
        if (this.state.userListFiltered[newIndex]) {
            item.text = this.state.userListFiltered[newIndex].text;
            item.value = parseInt(this.state.userListFiltered[newIndex].value, 10);
        }
        this.setState({
            selectedUserIndex: newIndex
        }, ()=>{
            if (this.props.onSelectUser) this.props.onSelectUser(item.value, item.text);
        });
    }
    onNext() {
        let newIndex = this.state.selectedUserIndex + 1;
        let item = {
            text: "",
            value: 0
        };
        if (this.state.userListFiltered[newIndex]) {
            item.text = this.state.userListFiltered[newIndex].text;
            item.value = parseInt(this.state.userListFiltered[newIndex].value, 10);
        }
        this.setState({
            selectedUserIndex: newIndex
        }, ()=>{
            if (this.props.onSelectUser) this.props.onSelectUser(item.value, item.text);
        });
    }
    getNavStatus() {
        return {
            previous: !(this.state.selectedUserIndex <= -1),
            next: !(this.state.userListFiltered.length <= this.state.selectedUserIndex + 1)
        };
    }
}


class $b3b3215b6ea82fda$export$9e2edf8255a603d7 extends (0, $ltMAx$react.Component) {
    constructor(props){
        super(props);
        this.onModeEditionClick = this.onModeEditionClick.bind(this);
        this.state = {
            modeEdition: false
        };
    }
    render() {
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("div", {
            children: this.state.modeEdition ? /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
                children: [
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $1f80b4d9d79eca51$export$fcd31d1255cc6e1c), {
                        variant: "danger",
                        onClick: this.onModeEditionClick,
                        text: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('turnoffeditingmode')
                    }),
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $1f80b4d9d79eca51$export$1fd269a6d53467a3), {})
                ]
            }) : /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
                children: [
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $1f80b4d9d79eca51$export$fcd31d1255cc6e1c), {
                        variant: "warning",
                        onClick: this.onModeEditionClick,
                        text: (0, $b3fbe7ab0c1d37e9$export$a7357cdd1f0b0168).get_string('turnoneditingmode')
                    }),
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)("br", {}),
                    /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $655fb2e9ba9cf7a8$export$89cba99550dbea5a), {})
                ]
            })
        });
        return main;
    }
    onModeEditionClick(event) {
        this.setState({
            modeEdition: !this.state.modeEdition
        });
    }
}
class $b3b3215b6ea82fda$export$97238541330cea6 extends (0, $ltMAx$react.Component) {
    constructor(props){
        super(props);
    }
    render() {
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $655fb2e9ba9cf7a8$export$f37c3f41bbbd5d80), {
            userId: (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).signedUser.userId
        });
        return main;
    }
}




class $4fa36e821943b400$var$App extends (0, $ltMAx$react.Component) {
    static defaultProps = {
        signedUser: null
    };
    constructor(props){
        super(props);
        this.onFeedback = this.onFeedback.bind(this);
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).signedUser = this.props.signedUser;
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams = (0, $92c24a6ef437e0f2$export$2e2bcd8739ae039).getUrlVars();
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.id = parseInt((0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.id, 10) || 0;
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.cmId = parseInt((0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.cmId, 10) || 0;
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.gId = parseInt((0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.gId, 10) || 0;
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.userId = parseInt((0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.userId, 10) || 0;
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.tab = parseInt((0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.tab, 10) || 0;
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.userLoaded = false;
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).urlParams.activityLoaded = false;
        let mode = (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).signedUser.roles.includes('t') ? 't' : 's';
        this.state = {
            mode: mode
        };
    }
    componentDidMount() {
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).feedback.addObserver("App", this.onFeedback);
        window.document.title = `${window.document.title} | ${(0, $b63c2eee244b2a4e$export$c019608e5b5bb4cb).appVersion()}`;
    }
    componentWillUnmount() {
        (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).feedback.removeObserver("App");
    }
    render() {
        let main = /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsxs)("div", {
            children: [
                /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ea3a684d233172db$export$669f6ea7d267feaf), {
                    webApi: (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).webApi,
                    children: /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $ltMAx$fortawesomereactfontawesome.FontAwesomeIcon), {
                        icon: (0, $ltMAx$fortawesomefreesolidsvgicons.faSpinner),
                        spin: true
                    })
                }),
                this.state.mode === 't' ? /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $b3b3215b6ea82fda$export$9e2edf8255a603d7), {}) : /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $b3b3215b6ea82fda$export$97238541330cea6), {}),
                (0, $e1e72af90e3ceaef$export$e809d3ea5a46d11f).feedback.msg.map((item, index)=>{
                    return /*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)((0, $b88808f85b3c6d03$export$18a6a9ff9177664f), {
                        id: index,
                        msg: item.msg,
                        type: item.type,
                        title: item.title,
                        timeout: item.timeout
                    }, index);
                })
            ]
        });
        return main;
    }
    onFeedback() {
        this.forceUpdate();
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const domContainer = document.getElementById('recit_cahiertraces');
    const root = (0, $ltMAx$reactdomclient.createRoot)(domContainer);
    let signedUser = {
        userId: domContainer.getAttribute('data-student-id'),
        roles: domContainer.getAttribute('data-roles').split(","),
        portfolioUrl: domContainer.hasAttribute('data-portfolio-url') ? domContainer.getAttribute('data-portfolio-url') : null
    };
    root.render(/*#__PURE__*/ (0, $ltMAx$reactjsxruntime.jsx)($4fa36e821943b400$var$App, {
        signedUser: signedUser
    }));
}, false);
$parcel$exportWildcard(module.exports, $b3fbe7ab0c1d37e9$exports);


//# sourceMappingURL=index.js.map
