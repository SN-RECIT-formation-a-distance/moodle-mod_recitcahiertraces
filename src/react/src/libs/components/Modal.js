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

import React, { Component } from 'react';

/**
 * Ce modal est nécessaire, car le Bootstrap Modal ne marche pas avec les menus déroulants de Atto
 */
export class Modal extends Component{
    static defaultProps = {        
        title: "",
        body: null,
        footer: null,
        onClose: null,
        width: '75%'
    };

    render(){
        let main = 
            <div style={{position: "fixed", top: 0, backgroundColor: "rgba(0,0,0,0.5)", left: 0, bottom: 0, right: 0, zIndex: 1040, overflowX: 'hidden', overflowY: 'auto'}}>
                <div style={{width: this.props.width, margin: "1.75rem auto", backgroundColor: "#FFF", maxWidth: 1450}}>
                    <div className="modal-header">
                        <h4 className="text-truncate">{this.props.title}</h4>
                        <button type="button" className="close" onClick={this.props.onClose}><span aria-hidden="true">×</span><span className="sr-only">Fermer</span></button>
                    </div>
                    <div className="modal-body">{this.props.body}</div>
                    <div className="modal-footer">{this.props.footer}</div>
                </div>
            </div>;

        return main;
    }
}