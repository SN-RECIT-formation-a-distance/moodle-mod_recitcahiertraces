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

recit.utils.getQueryVariable = function(name){
       let query = window.location.search.substring(1);
       let vars = query.split("&");
       for (let i=0;i<vars.length;i++) {
		   let pair = vars[i].split("=");
		   if(pair[0] == name){return pair[1];}
       }
       return(false);
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