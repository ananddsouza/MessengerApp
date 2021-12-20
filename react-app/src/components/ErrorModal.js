import React, { Component } from "react";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import Modal from "react-bootstrap/lib/Modal";


// Error Modal  - Displays if an error occurs
export default class ErrorModal extends Component {

  // state 
  state = {};

  // render 
  render() {
    return (
      <Modal show={this.props.show}>
        <Modal.Header>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h1 className="text-center">
            <Glyphicon glyph="alert" />
          </h1>
          <h5 className="text-center">{this.props.errorMessage}</h5>
        </Modal.Body>
      </Modal>
    );
  }
}
