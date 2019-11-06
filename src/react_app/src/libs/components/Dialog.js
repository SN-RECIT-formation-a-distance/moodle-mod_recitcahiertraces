import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

export class Dialog extends Component {
    static defaultProps = {
        show: false,
        title: "",
        size: "small",
        onClose: null,
        bodyContent: null,
        footerContent: null,
        className: ""
    };

    
    render() {                 
        const size = (this.props.size === 'large' ? 'modal-lg' : ''); // modal-sm
        
        let dialog = <Modal show={this.props.show} onHide={(event) => this.props.onClose(event)} dialogClassName={"custom-modal " + size + " " + this.props.className}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.bodyContent}
                </Modal.Body>
                {(this.props.footerContent !== null ? 
                    <Modal.Footer>
                        {this.props.footerContent}
                    </Modal.Footer>
                    :
                    null
                )}
            </Modal>;
            
        return (dialog);
    }
};
/*
class BodyWrapper extends Component {
    render() {
        const style =  {
            left: "0px",
            top: "0px",
            right: "0px",
            bottom: "0px",
            position: "fixed",
            zIndex: "998",
            backgroundImage: "none",
            backgroundColor: "#000",
            opacity: "0.9"    
        };
        return (
            <div style={style}>{this.props.children}</div>
        )
    };
}*/