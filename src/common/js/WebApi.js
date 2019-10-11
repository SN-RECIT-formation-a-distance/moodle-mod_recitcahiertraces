var recit = recit || {};
recit.http = recit.http || {};

recit.http.contentType = {
    postData: "application/x-www-form-urlencoded; charset=UTF-8",
    json: 'application/json; charset=utf-8',
    file: 'multipart/form-data'
};

recit.http.responseType = {
    text: 'text',
    json: 'json',
    octetStream: 'octet-stream'
};

recit.http.HttpRequest = class
{
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
        this.clientOnLoadEnd = null
        this.contentType = null;
        this.responseDataType = null;
    }

    send(method, url, data, onSuccess, onError, onComplete, contentType, responseDataType){
        // force to await in order to execute one call at time (multiples calls causes the slowness on PHP)
        if(this.inProgress){
            setTimeout(() => this.send(method, url, data, onSuccess, onError, onComplete, contentType, responseDataType), 500);
            return;
        }
        
        this.clientOnLoad = onSuccess || null;
        this.clientOnError = onError || null;
        this.clientOnLoadEnd = onComplete || null;    
        this.contentType = contentType || recit.http.contentType.json;  
        this.responseDataType = responseDataType || recit.http.responseType.json;
        
        this.xhr.open(method, url, true);
        this.xhr.setRequestHeader('Content-Type', contentType); // header sent to the server, specifying a particular format (the content of message body)
        this.xhr.setRequestHeader('Accept', responseDataType); // what kind of response to expect.
        
        if(this.useCORS){
            if ("withCredentials" in this.xhr) {            
                this.xhr.withCredentials = true;
            } 
            else if (typeof XDomainRequest !== "undefined") {
                // Otherwise, check if XDomainRequest. XDomainRequest only exists in IE, and is IE's way of making CORS requests.
                this.xhr = new XDomainRequest();
                this.xhr.open(method, url);
            } 
            else {
                throw new Error('CORS not supported');
            }
        }
        
        if(this.timeout > 0){ 
            this.xhr.timeout = this.timeout; 
        }

        this.inProgress = true;
        this.xhr.send(data);
    }

    onLoad(event){
        if(this.clientOnLoad !== null){
            let result = null;

            try{               
                switch(this.responseDataType){
                    case recit.http.responseType.json: result = JSON.parse(event.target.response); break;
                    default: result = event.target.response; // text
                }
            }
            catch(error){
                console.log(error, this);
            }
            
            this.clientOnLoad.call(this, result);
        }
    }

    onError(event){
        if(this.clientOnError !== null){
            this.clientOnError.call(this, event.target, event.target.statusText);
        }
        else{
            console.log("Error:" + event.target);
        }
    }

    onLoadEnd(event){
        if(this.clientOnLoadEnd !== null){ 
            this.clientOnLoadEnd.call(event.target);
        }
        this.inProgress = false;
    }

    onTimeOut(event){
        console.log("Cancelled HTTP request: timeout")
    }
};

recit.http.WebApi = class
{
    constructor(){
        this.gateway = this.getGateway();
        this.http = new recit.http.HttpRequest();
        this.domVisualFeedback = null;

        this.post = this.post.bind(this);
        this.onError = this.onError.bind(this);
        this.onComplete = this.onComplete.bind(this);
    }

    getGateway(){
        /*let protocol = window.location.protocol;
        let hostname = window.location.hostname;
        let pathname = window.location.pathname.split("/");
        pathname.pop();
        pathname = pathname.join("/");        
        return `${protocol}//${hostname}${pathname}/common/php/WebApi.php`;*/
        return `${M.cfg.wwwroot}/mod/recitcahiercanada/common/php/WebApi.php`;
    }
    
    onError(jqXHR, textStatus) {
        alert("Error on server communication ("+ textStatus +").\n\nSee console for more details");
        console.log(jqXHR);
    };

    post(url, data, callbackSuccess, callbackError, skipFeedback){
        skipFeedback = (typeof skipFeedback === 'undefined' ? false : skipFeedback);
        
        if(skipFeedback){
            this.showLoadingFeedback();
        }
        
        callbackError = callbackError || this.onError;
        data = JSON.stringify(data);

        this.http.send("post", url, data, callbackSuccess, callbackError, this.onComplete);
    }

    onComplete(){
        this.hideLoadingFeedback();
    }

    showLoadingFeedback(){
        if(this.domVisualFeedback === null){ return; }
        this.domVisualFeedback.style.display = "block";
    }

    hideLoadingFeedback(){
        if(this.domVisualFeedback === null){ return; }
        this.domVisualFeedback.style.display = "none";
    }

    getEnrolledUserList(cmId, onSuccess){
        let options = {};
        options.service = "getEnrolledUserList";
        options.cmId = cmId;
        this.post(this.gateway, options, onSuccess);
    }

    getTagList(cmId, itemType, component, onSuccess){
        let options = {};
        options.service = "getTagList";
        options.cmId = cmId;
        options.itemType = itemType;
        options.component = component;
        this.post(this.gateway, options, onSuccess);
    }    
   
    getPersonalNotes(cmId, userId, onSuccess){
        let options = {};
        options.service = "getPersonalNotes";
        options.cmId = cmId;
        options.userId = userId;
        this.post(this.gateway, options, onSuccess);
    }

    savePersonalNote(data, flag, onSuccess){
        let options = {};
        options.service = "savePersonalNote";
        options.data = data;
        options.flag = flag;
        this.post(this.gateway, options, onSuccess);
    }

    saveStudentNote(data, onSuccess){
        this.savePersonalNote(data, 's', onSuccess);
    }

    getSectionCmList(cmId, onSuccess){
        let options = {};
        options.service = "getSectionCmList";
        options.cmId = cmId;
        this.post(this.gateway, options, onSuccess);
    }    

    getCmNotes(cmId, onSuccess){
        let options = {};
        options.service = "getCmNotes";
        options.cmId = cmId;
        this.post(this.gateway, options, onSuccess);
    }    

    removeCcCmNote(ccCmId, onSuccess){
        let options = {};
        options.ccCmId = ccCmId;
        options.service = "removeCcCmNote";
        this.post(this.gateway, options, onSuccess);
    }

    saveCcCmNote(data, tagMetadata, onSuccess){
        let options = {};
        options.data = data;
        options.tagMetadata = tagMetadata;
        options.service = "saveCcCmNote";
        this.post(this.gateway, options, onSuccess);
    }

    checkCCSeqPos(cmId, onSuccess){
        let options = {};
        options.cmId = cmId;
        options.service = "checkCCSeqPos";
        this.post(this.gateway, options, onSuccess);
    }

    getReportDiagTag(params, onSuccess){
        params.courseId = params.courseId || 0;
        params.cmId = params.cmId || 0;
        params.userId = params.userId || 0;
        params.service = "getReportDiagTag";
        this.post(this.gateway, params, onSuccess);
    }
}

recit.http.WebApi.singleton = null;

recit.http.WebApi.instance = function(){
    if(recit.http.WebApi.singleton === null){
        recit.http.WebApi.singleton = new recit.http.WebApi();
    } 
    return recit.http.WebApi.singleton;
}