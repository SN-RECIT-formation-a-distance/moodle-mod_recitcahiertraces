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
import { Modal as ModalBS } from 'react-bootstrap';

/**
 * Ce modal est nécessaire, car le Bootstrap Modal ne marche pas avec les menus déroulants de Atto
 */
export class Modal extends Component{
    static defaultProps = {        
        title: "",
        body: null,
        footer: null,
        onClose: null,
        size: 'xl' //sm, lg, xl
    };

    render(){
        let main = 
            <>
                <ModalBS show={true} onHide={this.props.onClose} backdrop="static" keyboard={false}  size={this.props.size}>
                    <ModalBS.Header closeButton>
                        <ModalBS.Title>{this.props.title}</ModalBS.Title>
                    </ModalBS.Header>
                    <ModalBS.Body>{this.props.body}</ModalBS.Body>
                    <ModalBS.Footer>{this.props.footer}</ModalBS.Footer>
                </ModalBS>
        </>;

        return main;
    }
}