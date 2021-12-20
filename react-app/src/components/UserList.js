import React, { Component } from "react";
import { ChatList } from "react-chat-elements";
import FormControl from "react-bootstrap/lib/FormControl";
import FormGroup from "react-bootstrap/lib/FormGroup";

// User List Component - renders users list
export default class UserList extends Component {

  // state object
  state = {
    userData: [],
    searchQuery: null
  };

  // comonent did mount life cycle
  componentDidMount() {}

  // search input - used to search for users in list 
  searchInput(e) {

    // get value from search from target
    let value = e.target.value;

    // search query 
    let searchQuery = null;

    // if value exists
    if (value) {

      // assign value to search query 
      searchQuery = value;
    }

    // set state
    this.setState({ searchQuery });
  }

  // Implementation - get filtered users list - search query based 
  getFilteredUserList() {
    // if search query is empty 
    return !this.state.searchQuery
      ? this.props.userData // return all users 
      : this.props.userData.filter(user =>
          user.name.toLowerCase().includes(this.state.searchQuery.toLowerCase()) // else return matched user from list 
        );
  }

  //render 
  render() {

    // set  users from filtered users (used to render in the list)
    let users = this.getFilteredUserList();
    return (
      <div>
        <FormGroup>
          <FormControl className="search-bar"
            type="text"
            placeholder="Search for a user here..."
            onInput={this.searchInput.bind(this)}
          />
        </FormGroup>
        {users.length ? (
          <ChatList
            className={!this.props.showSignInList ? "chat-list" : "user-list"}
            dataSource={users.map((user, index) => {
              let date = null;
              let subtitle = "";
              if (
                !this.props.showSignInList &&
                user.messages &&
                user.messages.length
              ) {
                let lastMessage = user.messages[user.messages.length - 1];
                date = new Date(lastMessage.timeStamp);
                subtitle =
                  (lastMessage.position === "right" ? "You: " : user.name + ": ") +
                  lastMessage.text;
              }
              return {
                avatar: require(`../static/images/avatar/${user.id}.png`),
                alt: user.name,
                title: user.name,
                subtitle: subtitle,
                date: date,
                unread: user.unread,
                user: user
              };
            })}
            onClick={
              !this.props.showSignInList
                ? this.props.onChatClicked
                : this.props.onUserClicked
            }
          />
        ) : (
          <div className="text-center no-users">No users to show.</div>
        )}
      </div>
    );
  }
}
