// Imports
import React, { Component } from "react";
import NavBar from "./components/NavBar";
import Grid from "react-bootstrap/lib/Grid";
import Row from "react-bootstrap/lib/Row";
import Col from "react-bootstrap/lib/Col";
import Modal from "react-bootstrap/lib/Modal";
import UserList from "./components/UserList";
import ChatBox from "./components/ChatBox";
import ErrorModal from "./components/ErrorModal";
import LoadingModal from "./components/LoadingModal";
import './styles.css';
import "./index.css";
import io from "socket.io-client";
import { fetchUsers } from "./requests";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import axios from "axios";

// get socket server url 
const SOCKET_URI = process.env.REACT_APP_SERVER_URI;

// App Component
// Used to set confg and default values, initiate socket connection and handle connection cases
class App extends Component {

  // socket object
  socket = null;

  // state init
  state = {
    signInModalShow: false,
    users: [], 
    userChatData: [], 
    user: null, 
    selectedUserIndex: null,
    showChatBox: false, 
    showChatList: true, 
    error: false,
    errorMessage: ""
  };

  // ComponentDidMount life cycle
  componentDidMount() {

    // initiate Axios 
    this.initAxios();

    // initiate Socket Connection 
    this.initSocketConnection();

    // fetch Users
    fetchUsers().then(users => this.setState({ users, signInModalShow: true }));

    // setup socket Listeners
    this.setupSocketListeners();
  }

  // Implementation - initiate socket connection 
  initSocketConnection() {

    // connect to the default socket object to the socket url
    this.socket = io.connect(SOCKET_URI);
  }

  // Implementation - initiate Axios 
  // if axios request fails, handle using error modal
  initAxios() {

    // request 
    axios.interceptors.request.use(
      config => {
        this.setState({ loading: true });
        return config;
      },
      error => {
        this.setState({ loading: false });
        this.setState({
          errorMessage: `Couldn't connect to server. try refreshing the page.`,
          error: true
        });
        return Promise.reject(error);
      }
    );

    // response
    axios.interceptors.response.use(
      response => {
        this.setState({ loading: true });
        return response;
      },
      error => {
        this.setState({ loading: false });
        this.setState({
          errorMessage: `Some error occured. try after sometime`,
          error: true
        });
        return Promise.reject(error);
      }
    );
  }

  // Implementation - show error on lcient disconnection 
  onClientDisconnected() {

    // invoke notification manager error
    NotificationManager.error(
      "Connection Lost from server please check your connection.",
      "Error!"
    );
  }

  // Implementation - On re-connection
  onReconnection() {

    // if user exists
    if (this.state.user) {

      // emit sign in state 
      this.socket.emit("sign-in", this.state.user);

      // invoke notification manager success 
      NotificationManager.success("Connection Established.", "Reconnected!");
    }
  }

  // Implementation - Set up  socket listeners for socket events
  setupSocketListeners() {

    // on message event
    this.socket.on("message", this.onMessageRecieved.bind(this));

    // on reconnect event
    this.socket.on("reconnect", this.onReconnection.bind(this));

    // on disconnect event 
    this.socket.on("disconnect", this.onClientDisconnected.bind(this));
  }

  // Implementation - on message received event
  onMessageRecieved(message) {

    // user chat data
    let userChatData = this.state.userChatData;

    // message data
    let messageData = message.message;

    // target id
    let targetId;

    // if sender and user id is same
    if (message.from === this.state.user.id) {

      // set message data position to right
      messageData.position = "right";

      // set target id to receiver
      targetId = message.to;
    } else {

      // set message data position to left
      messageData.position = "left";

      // set target id to sender
      targetId = message.from;
    }

    // get target index/position
    let targetIndex = userChatData.findIndex(u => u.id === targetId);

    // if user chat data at the target index doesn't have messages
    if (!userChatData[targetIndex].messages) {

      // set empty value to messages at the target index
      userChatData[targetIndex].messages = [];
    }

    // if target index is not equal to selected user index 
    if (targetIndex !== this.state.selectedUserIndex) {

      // if unread messages are not present 
      if (!userChatData[targetIndex].unread) {

        // set unread count to 0
        userChatData[targetIndex].unread = 0;
      }

      // increment unread count
      userChatData[targetIndex].unread++;
    }

    // push messages to target index messages
    userChatData[targetIndex].messages.push(messageData);

    // set state using user chat data
    this.setState({ userChatData });
  }

  // Implementation - on user clicked event
  onUserClicked(e) {

    // get user 
    let user = e.user;

    // emit sign in using user 
    this.socket.emit("sign-in", user);

    // get user chat data 
    let userChatData = this.state.users.filter(u => u.id !== user.id);

    // set state using user and other properties
    this.setState({ user, signInModalShow: false, loading: false, userChatData });
  }

  // Implementation - on chat clicked - handles if user clicks on chat item
  onChatClicked(e) {

    // toggle views
    this.toggleViews();

    // get users 
    let users = this.state.userChatData;

    // loop through users 
    for (let index = 0; index < users.length; index++) {

      // if user id matches
      if (users[index].id === e.user.id) {

        // set unread count to 0
        users[index].unread = 0;

        // set state 
        this.setState({ selectedUserIndex: index, userChatData: users });

        // return
        return;
      }
    }
  }

  // Implementation - create message - creates message in a format
  createMessage(text) {

    // set message object properties
    let message = {

      // to user
      to: this.state.userChatData[this.state.selectedUserIndex].id,

      // message
      message: {
        type: "text",
        text: text,
        date: +new Date(),
        className: "message"
      },

      // from user
      from: this.state.user.id
    };

    // emit message
    this.socket.emit("message", message);
  }


  // Implementation - Toggle Views 
  toggleViews() {

    // set state (alternate views for chat box and chat list)
    this.setState({
      showChatBox: !this.state.showChatBox,
      showChatList: !this.state.showChatList
    });
  }

  // render 
  render() {

    // chat box props
    let chatBoxProps = this.state.showChatBox
      ? {
          xs: 12,
          sm: 12
        }
      : {
          xsHidden: true,
          smHidden: true
        };
    
    
    // chat list properties
    let chatListProps = this.state.showChatList
      ? {
          xs: 12,
          sm: 12
        }
      : {
          xsHidden: true,
          smHidden: true
        };

    // return     
    return (
      <div>
        <NavBar signedInUser={this.state.user} />
        <Grid>
          <Row className="show-grid">
            <Col {...chatListProps} md={4}>
              <UserList
                userData={this.state.userChatData}
                onChatClicked={this.onChatClicked.bind(this)}
              />
            </Col>
            <Col {...chatBoxProps} md={8}>
              <ChatBox
                signedInUser={this.state.user}
                onSendClicked={this.createMessage.bind(this)}
                onBackPressed={this.toggleViews.bind(this)}
                targetUser={
                  this.state.userChatData[this.state.selectedUserIndex]
                }
              />
            </Col>
          </Row>
        </Grid>
        <Modal show={this.state.signInModalShow}>
          <Modal.Header className="modal-sign-in">
            <Modal.Title>Sign In as:</Modal.Title>
          </Modal.Header>

          <Modal.Body className="modal-sign-in">
            <UserList
              userData={this.state.users}
              onUserClicked={this.onUserClicked.bind(this)}
              showSignInList
            />
          </Modal.Body>
        </Modal>
        <ErrorModal
          show={this.state.error}
          errorMessage={this.state.errorMessage}
        />
        <LoadingModal show={this.state.loading} />
        <NotificationContainer />
      </div>
    );
  }
}

export default App;
