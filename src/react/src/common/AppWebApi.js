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

import {WebApi, JsNx} from '../libs/utils/Utils';
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
        JsNx.removeItem(this.observers, "id", id);
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
    
    getUserNotes(cmId, userId, flag, onSuccess){
        let data = {cmId: cmId, userId: userId, flag: flag, service: "getUserNotes"};
        this.post(this.gateway, data, onSuccess);
    }

    getUserNote(cmId, nId, gId, userId, onSuccess){
        let data = {cmId: cmId, gId: gId, nId: nId, userId: userId, service: "getUserNote"};
        this.post(this.gateway, data, onSuccess);
    }

    saveUserNote(data, flags, onSuccess){
        let that = this;
        let onSuccessTmp = function(result){     
            onSuccess(result);
            if(result.success){
                that.notifyObservers('saveUserNote');
            }
        };

        let options = {data: data, flags: flags, service: "saveUserNote"};
        this.post(this.gateway, options, onSuccessTmp);
    }

    getGroupList(cmId, onSuccess){
        let data = {cmId: cmId, service: "getGroupList"};
        this.post(this.gateway, data, onSuccess);
    }

    getGroupNotes(gId, ctId, onSuccess){
        let data = {gId: gId, ctId: (ctId || 0), service: "getGroupNotes"};
        this.post(this.gateway, data, onSuccess);
    }

    reorderNoteGroups(cmId, onSuccess){
        let data = {cmId: cmId, service: "reorderNoteGroups"};
        this.post(this.gateway, data, onSuccess);
    }

    switchNoteSlot(from, to, cmId, onSuccess){
        if(from === to){ return;}

        let data = {from: from, to: to, cmId: cmId, service: "switchNoteSlot"};
        this.post(this.gateway, data, onSuccess);
    }
    
    getNoteFormKit(cmId, nId, onSuccess){
        let data = {cmId: cmId, nId: nId, service: "getNoteFormKit"};
        this.post(this.gateway, data, onSuccess);
    }
    
    saveNote(data, onSuccess){
        let that = this;
        let onSuccessTmp = function(result){     
            onSuccess(result);
            if(result.success){
                that.notifyObservers('saveNote');
            }
        };

        let options = {data: data, service: "saveNote"};
        this.post(this.gateway, options, onSuccessTmp);
    }

    removeNote(nId, cmId, onSuccess){
        let that = this;
        let onSuccessTmp = function(result){     
            onSuccess(result);
            if(result.success){
                that.notifyObservers('removeNote');
            }
        };

        let options = {nId: nId, cmId: cmId, service: "removeNote"};
        this.post(this.gateway, options, onSuccessTmp);
    }

    removeNoteGroup(cmId, gId, onSuccess){
        let that = this;
        let onSuccessTmp = function(result){     
            onSuccess(result);
            if(result.success){
                that.notifyObservers('removeNoteGroup');
            }
        };

        let options = {cmId: cmId, gId: gId, service: "removeNoteGroup"};
        this.post(this.gateway, options, onSuccessTmp);
    }

    saveNoteGroup(data, onSuccess){
        let that = this;
        let onSuccessTmp = function(result){     
            onSuccess(result);
            if(result.success){
                that.notifyObservers('saveNoteGroup');
            }
        };

        let options = {data: data, service: "saveNoteGroup"};
        this.post(this.gateway, options, onSuccessTmp);
    }

    cloneNoteGroup(data, onSuccess){
        let that = this;
        let onSuccessTmp = function(result){     
            onSuccess(result);
            if(result.success){
                that.notifyObservers('cloneNoteGroup');
            }
        };

        let options = {data: data, service: "cloneNoteGroup"};
        this.post(this.gateway, options, onSuccessTmp);
    }

    getRequiredNotes(cmId, onSuccess){
        let data = {cmId: cmId, service: "getRequiredNotes"};
        this.post(this.gateway, data, onSuccess);
    }

    getStudentsProgression(cmId, onSuccess){
        let data = {cmId: cmId, service: "getStudentsProgression"};
        this.post(this.gateway, data, onSuccess);
    }
};
