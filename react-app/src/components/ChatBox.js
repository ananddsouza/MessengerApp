import React, { Component } from "react";
import FormControl from "react-bootstrap/lib/FormControl";
import InputGroup from "react-bootstrap/lib/InputGroup";
import Button from "react-bootstrap/lib/Button";
import FormGroup from "react-bootstrap/lib/FormGroup";
import Col from "react-bootstrap/lib/Col";
import Jumbotron from "react-bootstrap/lib/Jumbotron";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import {
  MessageList,
  Navbar as NavbarComponent,
  Avatar
} from "react-chat-elements";

// Chat Box component  - displays messages from chat history
export default class ChatBox extends Component {

  // initial state
  state = {
    messageText: ""
  };

  // Implementation - on send clicked event - sends only if message is not falsy
  onSendClicked() {

    // if message text doesn't exist
    if (!this.state.messageText) {

      // return immediately
      return;
    }

    // set message text 
    this.props.onSendClicked(this.state.messageText);

    // reset message tet and set state 
    this.setState({ messageText: "" });
  }

  // Implementation - on message input change
  onMessageInputChange(e) {

    // set state from target field value
    this.setState({ messageText: e.target.value });
  }


  // Implementation - on message key press 
  onMessageKeyPress(e) {

    // on press of "Enter"
    if (e.key === "Enter") {

      // invoke send clicked
      this.onSendClicked();
    }
  }

  // render 
  render() {
    return (
      <div>
        {this.props.targetUser ? (
          <div>
            <NavbarComponent
              left={
                <div>
                  <Col mdHidden lgHidden>
                    <p className="navBarText">
                      <Glyphicon
                        onClick={this.props.onBackPressed}
                        glyph="chevron-left"
                      />
                    </p>
                  </Col>
                  <Avatar
                    src={require(`../static/images/avatar/${
                      this.props.targetUser.id
                    }.png`)}
                    alt={"logo"}
                    size="large"
                    type="circle flexible"
                  />
                  <p className="navBarText">{this.props.targetUser.name}</p>
                </div>
              }
            />
            <MessageList
              className="message-list"
              lockable={true}
              toBottomHeight={"100%"}
              dataSource={this.props.targetUser.messages}
            />
            <FormGroup>
              <InputGroup>
                <FormControl
                  type="text"
                  value={this.state.messageText}
                  onChange={this.onMessageInputChange.bind(this)}
                  onKeyPress={this.onMessageKeyPress.bind(this)}
                  placeholder="Type a message here (Limit 2000 characters)..."
                  ref="messageTextBox"
                  className="messageTextBox"
                  maxLength="2000"
                  autoFocus
                />
                <InputGroup.Button>
                  <Button
                    disabled={!this.state.messageText}
                    className="sendButton"
                    onClick={this.onSendClicked.bind(this)}
                  >
                    Send
                  </Button>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>
          </div>
        ) : (
          <div>
            <Jumbotron className="jumbotron">
              <h2>Hello, {(this.props.signedInUser || {}).name}!</h2>
              <p>Select a friend to start a chat.</p>
            </Jumbotron>
          </div>
        )}
      </div>
    );
  }
}
