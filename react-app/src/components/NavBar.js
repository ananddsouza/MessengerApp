import React, { Component } from "react";
import Navbar from "react-bootstrap/lib/Navbar";

// NavBar Component - Renders top navbar and current user
export default class NavBar extends Component {

  // state 
  state = {};

  // render 
  render() {
    return (
      <Navbar className="nav-bar">
        <Navbar.Header>
          <Navbar.Brand className="nav-bar-header">Chat App</Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse className="nav-bar-header">
          <Navbar.Text className="nav-bar-header" pullRight>
            Signed in as:&nbsp;
            <span className="signed-in-user">{(this.props.signedInUser || {}).name}</span>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

