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

import packageJson from "../../package.json";
import { i18n } from "./i18n";

export class Options
{
    static appVersion(){ return packageJson.version; }

    static appTitle(){
        return i18n.get_string('pluginname') + " | " + this.appVersion();
    }

    static versionHistory = [
        {version: "0.1.0", description: "", timestamp: '2019-11-04'},
    ]

    static getGateway(){
        return `${M.cfg.wwwroot}/mod/recitcahiertraces/classes/WebApi.php`;
    }
    
}