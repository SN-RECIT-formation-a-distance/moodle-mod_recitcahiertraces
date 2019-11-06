//////////////////////////////////////////////////
// Note: the "export *" will only export the classes marqued with "export" in their definition
//////////////////////////////////////////////////

import "./css/components.scss";

export * from './ComboBox';
export * from './DataGrid';
//export * from './DateTimeInterval'; //require moment
//export * from './DateTime';
export * from './Dialog';
//export * from './DlgInput';
export * from './DropdownList';
export * from './Feedback';
//export * from './InputEmail';
export * from './InputNumber';
export * from './ListCtrl';
export {Loading} from './Loading';
export * from './NavPanel';
export * from './NumberInterval';
export * from './RadioGroup';
//export * from './RichEditor';
export * from './Switch';
//export * from './ToggleButtons';
export * from './Tile';
//export * from './TreeCtrl';

export default class Components{
    static version = 1.0;

    static assets = {
        arrowBottom: require("./assets/arrowBottom16.png"),
        arrowRight: require("./assets/arrowRight16.png"),
        loading: require("./assets/loading.gif")
    };
}