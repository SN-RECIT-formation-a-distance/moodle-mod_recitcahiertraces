import {WebApi} from '../libs/utils/Utils';
import { Options } from './Options';

export class AppWebApi extends WebApi
{    
    constructor(){
        super(Options.getGateway());
                
        this.http.useCORS = true;
        this.sid = 0;
        this.observers = [];
        this.http.timeout = 30000; // 30 secs
    }

    addObserver(id, update, observables){
        this.observers.push({id:id, update:update, observables: observables});
    }

    removeObserver(id){
        this.observers.nxRemoveItem("id", id);
    }

    notifyObservers(observable){
        for(let o of this.observers){
            if(o.observables.includes(observable)){
                o.update();
            }
        }
    }
    
    getEnrolledUserList(cmId, onSuccess){
        let data = {cmId: cmId, service: "getEnrolledUserList"};
        this.post(this.gateway, data, onSuccess);
    }
    
    getPersonalNotes(cmId, userId, onSuccess){
        let data = {cmId: cmId, userId: userId, service: "getPersonalNotes"};
        this.post(this.gateway, data, onSuccess);
    }

    getPersonalNote(ccCmId, cmId, userId, onSuccess){
        let data = {cmId: cmId, ccCmId: ccCmId, userId: userId, service: "getPersonalNote"};
        this.post(this.gateway, data, onSuccess);
    }

    savePersonalNote(data, flag, onSuccess){
        let that = this;
        let onSuccessTmp = function(result){     
            onSuccess(result);
            if(result.success){
                that.notifyObservers('savePersonalNote');
            }
        };

        let options = {data: data, flag: flag, service: "savePersonalNote"};
        this.post(this.gateway, options, onSuccessTmp);
    }

    getSectionCmList(cmId, onSuccess){
        let data = {cmId: cmId, service: "getSectionCmList"};
        this.post(this.gateway, data, onSuccess);
    }

    getCmNotes(cmId, onSuccess){
        let data = {cmId: cmId, service: "getCmNotes"};
        this.post(this.gateway, data, onSuccess);
    }

    switchCcCmNoteSlot(from, to, onSuccess){
        if(from === to){ return;}

        let data = {from: from, to: to, service: "switchCcCmNoteSlot"};
        this.post(this.gateway, data, onSuccess);
    }
    
    getCcCmNoteFormKit(ccCmId, cmId, onSuccess){
        let data = {ccCmId: ccCmId, cmId: cmId, service: "getCcCmNoteFormKit"};
        this.post(this.gateway, data, onSuccess);
    }
    
    saveCcCmNote(data, onSuccess){
        let that = this;
        let onSuccessTmp = function(result){     
            onSuccess(result);
            if(result.success){
                that.notifyObservers('saveCcCmNote');
            }
        };

        let options = {data: data, service: "saveCcCmNote"};
        this.post(this.gateway, options, onSuccessTmp);
    }

    removeCcCmNote(ccCmId, onSuccess){
        let that = this;
        let onSuccessTmp = function(result){     
            onSuccess(result);
            if(result.success){
                that.notifyObservers('removeCcCmNote');
            }
        };

        let options = {ccCmId: ccCmId, service: "removeCcCmNote"};
        this.post(this.gateway, options, onSuccessTmp);
    }

    checkCCSeqPos(cmId, onSuccess){
        let options = {cmId: cmId, service: "checkCCSeqPos"};
        this.post(this.gateway, options, onSuccess);
    }
 /*   setPaypalPayment(paymentId, status, onSuccess){
        let that = this;
        let onSuccessTmp = function(result){     
            onSuccess(result);
            if(result.success){
                that.notifyObservers('setPaypalPayment');
            }
        };

        let data = {sid: this.sid, service: "setPaypalPayment", status: status, paymentId: paymentId};
        this.post(this.gateway, data, onSuccessTmp);
    }*/
};
