import packageJson from "../../package.json";
//import {$i18n} from "./i18n.js";

export class Options
{
    static appVersion(){ return packageJson.version; }

    static appTitle(){
        return "RÉCIT Cahier de traces | " + this.appVersion();
    }

    static versionHistory = [
        {version: "0.1.0", description: "", timestamp: '2019-11-04'},
    ]

    static getGateway(){
        /*if(process.env.NODE_ENV === "development"){
            return window.location.protocol + "//" + window.location.hostname + "/convention2020/backend2/index.php";
        }
        else{
            //return window.location.origin + "/sas2-backend/";
            return "http://conventionadmin.gnosis.ca/index.php";
        }*/
        return `${M.cfg.wwwroot}/mod/recitcahiercanada/common/php/WebApi.php`;
    }
    
}