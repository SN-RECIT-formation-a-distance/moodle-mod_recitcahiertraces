var recit = recit || {};
recit.utils = recit.utils || {};

recit.utils.getUrlVars = function(){
    var vars, uri;

    vars = {};

    uri = decodeURI(window.location.href);

    var parts = uri.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    
    return vars;
};

recit.utils.onDocumentReady = function(callback){
    /*window.addEventListener("DOMContentLoaded", function(event){
        callback();
    }, false);*/

    Y.on('domready', callback);
}

recit.utils.wwwRoot = function(){
    return M.cfg.wwwroot;
};