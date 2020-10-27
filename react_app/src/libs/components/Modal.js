import React, { Component } from 'react';

/**
 * Ce modal est nécessaire, car le Bootstrap Modal ne marche pas avec les menus déroulants de Atto
 */
export class Modal extends Component{
    static defaultProps = {        
        title: "",
        body: null,
        footer: null,
        onClose: null
    };

    render(){
        let main = 
            <div style={{position: "fixed", top: 0, backgroundColor: "rgba(0,0,0,0.5)", left: 0, bottom: 0, right: 0, zIndex: 1040, overflowX: 'hidden', overflowY: 'auto'}}>
                <div style={{width: "75%", margin: "1.75rem auto", backgroundColor: "#FFF"}}>
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