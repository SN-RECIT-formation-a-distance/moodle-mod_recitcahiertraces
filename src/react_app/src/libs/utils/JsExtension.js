////////////////////////////////////
// Native JavaScript Extensions
// The use of prefix nx (Native eXtension) is to avoid functions name conflicts in case of a possible Java Script expansion 
////////////////////////////////////

/*eslint no-extend-native: ["error", { "exceptions": ["String", "Number", "Date", "Array", "Object"] }]*/
////////////////////////////////////
// String
////////////////////////////////////
String.prototype.nxPrintf = function () {
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};

String.prototype.nxNumberFormat = function(decimals, decPoint) {
    let n = Number.parseFloat(this);
    return n.nxFormat(decimals);
};

String.prototype.nxLpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
};

String.prototype.nxGetRegExp = function(){
    let strEscape = this.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    return new RegExp(strEscape, 'i');
}

////////////////////////////////////
// Number
////////////////////////////////////
Number.prototype.nxIsNumber = function(){
    return !isNaN(parseFloat(this)) && isFinite(this);
};

Number.prototype.nxFormat = function(decimals){
    return this.toFixed(decimals);      
};

////////////////////////////////////
// Date
////////////////////////////////////
/**
 * The JavaScript Date use always the client timezone. So this function format the date converting to the UTC timezone.
 */
Date.prototype.nxFormat = function(option){
    option = option || "default";

    let result = "";

    switch(option){
        case "utc":
            result += this.getUTCFullYear();
            result += "-" + (this.getUTCMonth() + 1).toString().nxLpad(0,2);
            result += "-" + this.getUTCDate().toString().nxLpad(0,2);
            result += " " + this.getUTCHours().toString().nxLpad(0,2);  
            result += ":" + this.getUTCMinutes().toString().nxLpad(0,2);    
            //result += ":" + this.getUTCSeconds().toString().nxLpad(0,2);    
            break;
        default:
            result += this.getFullYear();
            result += "-" + (this.getMonth() + 1).toString().nxLpad(0,2);
            result += "-" + this.getDate().toString().nxLpad(0,2);
            result += " " + this.getHours().toString().nxLpad(0,2);  
            result += ":" + this.getMinutes().toString().nxLpad(0,2);    
            //result += ":" + this.getSeconds().toString().nxLpad(0,2);
    }
    
    return result;
};

Date.nxFormat = function(value){
    return (value === null ? "" : new Date(value).nxFormat());
}

////////////////////////////////////
// Array
////////////////////////////////////
/**
 * Check if the array is empty
 * @returns {boolean}
 */
Array.prototype.nxEmpty = function(){
    return (this.length === 0);
};

/**
 * Check if the index exists in the array.
 * @param {number} index
 * @returns {boolean}
 */
Array.prototype.nxExists = function(index){
    if(typeof this[index] === "undefined"){
        return false;
    }
    else{
        return true;
    }
};

/**
 * Return the array item at the indicated index. If it not exists, then return the default value.
 * @param {number} index
 * @param {*} default value
 * @returns {*}
 */
Array.prototype.nxAt = function(index, defaultValue){
    if(this.nxExists(index)){
        return this[index];
    }
    else{
        return defaultValue;
    }
};

/**
 * Return the first array item. If it not exists, then return the default value.
 * @param {*} default value
 * @returns {*}
 */
Array.prototype.nxLast = function(defaultValue){
    return this.nxAt(0, defaultValue);
};

/**
 * Return the last array item. If it not exists, then return the default value.
 * @param {*} default value
 * @returns {*}
 */
Array.prototype.nxLast = function(defaultValue){
    return this.nxAt(this.length - 1, defaultValue);
};

/**
 * Return the array item (an object) according to the property and value indicated. If it not exists, then return the default value.
 * @param {string} property
 * @param {*} property value
 * @param {*} default value
 * @returns {*}
 */
Array.prototype.nxGetItem = function(prop, value, defaultValue){ 
    for(let item of this){
        if(item.nxGet(prop, null) === value){return item; }
    }  

    return defaultValue;
};

/**
 * Return an array with the result of the property and value indicated. 
 * @param {string} property
 * @param {*} property value
 * @returns {array}
 */
Array.prototype.nxGetItems = function(prop, value){
    let result = [];
    for(let item of this){
        if(item.nxGet(prop, null) === value){ result.push(item); }
    }
    return result;
};

/**
 * Return the array item (an object) index according to the property and value indicated. 
 * @param {string} property
 * @param {*} property value
 * @returns {number}
 */
Array.prototype.nxGetItemIndex = function(prop, value){
    for(let i = 0; i < this.length; i++){
        let item = this[i];
        
        if(item.nxGet(prop, null) === value){ return i }
    }
    return -1;
};

/**
 * Find the array item (an object) and copy the values according to the parameter data. 
 * @param {string} prop - property
 * @param {*} value
 * @param {object} data
 */
Array.prototype.nxSetItem = function(prop, value, data){
    let item = this.nxGetItem(prop, value, null);
    
    if(item !== null){
        data.nxCopy(item);
    }
};

/**
 * Joins the elements of an array into a string, according to the specified property, and returns the string.
 * @param {string} property
 * @param {string} [separator] - The "," is the default value
 * @returns {string}
 */
Array.prototype.nxJoin = function(prop, separator){
    prop = prop || null;
    separator = separator || ",";
    
    let result = "";
    
    for(let i = 0; i < this.length; i++){
        let obj = this[i];

        if((obj === null) || (typeof obj === "undefined")){ continue; }

        if((i > 0) && (i <= this.length - 1) && (result.length > 0)){
            result += separator;    
        }

        if(typeof obj === "object"){
            if(!obj.hasOwnProperty(prop) || obj[prop] === null){ continue; }
            result += obj.nxGet(prop);
        }
        else{
            result += obj;
        }
    }
    return result;
};

/**
 * Remove an element from the array. If the element does not exists then do nothing.
 * @param {number} index
  * @returns {object}
 */
Array.prototype.nxRemove = function(index){
    let result = [];
    
    if(this.nxExists(index)){
        result = this.splice(index,1);
    }
    
    return (result.length > 0 ? result[0] : null);
};

/**
 * Remove an element from the array according to the property and value indicated.
 * @param {string} property
 * @param {*} property value
 * @returns {object}
 */
Array.prototype.nxRemoveItem = function(prop, value){
    let index = this.nxGetItemIndex(prop, value, -1);
    return this.nxRemove(index);
};

/**
 * Remove all elements from the array according to the value indicated.
 * @param {*} property value
 * @returns {void}
 */
Array.prototype.nxRemoveValue = function(value){
    for(let i = 0; i < this.length; i++){
        if(this[i] === value){
            this.splice(i,1);
        }
    }
};

Array.prototype.nxCopy = function(level){
    level = level || 0;
    
    switch(level){
        case 1:
            return JSON.parse(JSON.stringify(this)); //  Array of literal-structures (array, object) ex: [[], {}];
        case 2:
            //return jQuery.extend(this); // Array of prototype-objects (function). The jQuery technique can be used to deep-copy all array-types. ex: [function () {}, function () {}];
            let result = [];
            for(let item of this){
                result.push((item !== null ? item.nxClone() : null));
            }
            return result;
        default:
            return this.slice(); // Array of literal-values (boolean, number, string) ex:  [true, 1, "true"]
    }
};

/**
 * Sort an array of objects
 * @param {string} property to compare
 * @returns {*}
 */
Array.prototype.nxSort = function(prop){
    let compare = function(item1, item2){
        if(item1.nxGet(prop) > item2.nxGet(prop)){
            return 1;
        }
        else{
            return -1;
        }
    };
    
    this.sort(compare);
};

/**
 * Add the item to the array only if it does not exists
 * @param {*} item
 * @returns {boolean}
 */
Array.prototype.nxSinglePush = function(item){
    if(!this.includes(item)){
        this.push(item);
        return true;
    }
    else{
        return false;
    }
};

////////////////////////////////////
// Object
////////////////////////////////////
Object.defineProperty(Object.prototype, 'nxGet', {configurable:true, writable: true});

/**
* Get the property value. If it not exists, then return the default value.
* @param {string} prop
* @param {*} defaultValue
* @returns {*}
*/
Object.prototype.nxGet = function(prop, defaultValue){  
    let props = prop.split('.');
    let result = (typeof defaultValue === "undefined" ? null : defaultValue);

    if(typeof this[prop] === "function"){
        result = this[prop]();
    }
    else if((props.length === 1) && (this.hasOwnProperty(props[0]))){
        result = this[props[0]];
    }
    else if((props.length === 2) && (this[props[0]].hasOwnProperty(props[1]))){
        result = this[props[0]][props[1]];
    }
   
    return result;
    
};


Object.defineProperty(Object.prototype, 'nxClone', {configurable:true, writable: true});

/*
 * @description Deep clone the object and return a new one
 * @returns {Object}
 */
Object.prototype.nxClone = function(){
    if(this instanceof Date){
        return new Date(this.valueOf());
    }

    let result = Object.create(this.__proto__);
    
    for(let prop in this){
        if(Array.isArray(this[prop])){
            switch(typeof this[prop].nxAt(0,null)){
                case "object":
                    result[prop] = this[prop].nxCopy(2);
                    break;
                default:
                    result[prop] = this[prop].nxCopy();
            }
        }
        else if((typeof this[prop] === "object") && (this[prop] !== null)){
            result[prop] = this[prop].nxClone();
        }
        else{
            result[prop] = this[prop];
        }
    }
    return result;   
};


Object.defineProperty(Object.prototype, 'nxCopy', {configurable:true, writable: true});

/**
 * @description Copies only the similar attributes
 * @param {object} to
 * @returns {void}
 */
Object.prototype.nxCopy = function(to){
    to = to || null;

    if (to === null)
        return;

    for (var key in this) {

        if (!to.hasOwnProperty(key)) {
            continue;
        }

        if (this[key] instanceof Array) {
            // if it is an array of objects then we do a deep copy
            if(this[key].nxExists(0) && this[key][0] instanceof Object){
                to[key] = this[key].nxCopy(2);
            }
            else{
                to[key] = this[key].nxCopy();
            }
        }
        else if (this[key] instanceof Object) {
            to[key] = this[key].nxClone();//JSON.parse(JSON.stringify(this[key]));
        }
        else {
            to[key] = this[key];
        }
    }
};


Object.defineProperty(Object.prototype, 'nxEmpty', {configurable:true, writable: true});

/**
 * @description Check if the object is empty
 * @returns {boolean}
 */
Object.prototype.nxEmpty = function(){
    return (Object.keys(this).length === 0 && this.constructor === Object);
};

//Object.defineProperty(Object.prototype, 'nxGetParentNode', {configurable:true, writable: true});
