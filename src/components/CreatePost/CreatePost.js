import API, { graphqlOperation } from "@aws-amplify/api";
import Auth from "@aws-amplify/auth";
import { Button, TextareaAutosize, TextField, FormControl, Input, Container } from "@mui/material";
import { Component } from "react";
import { createPost } from "../../graphql/mutations";

class CreatePost extends Component {
  state = {
    postOwnerId: "",
    postOwnerUsername: "",
    postTitle: "",
    postBody: ""
  };

  componentDidMount = async () => {
    //* Auth
    await Auth.currentUserInfo()
      .then(user => {

        this.setState({
          postOwnerId: user.attributes.sub,
          postOwnerUsername: user.username
        })

        // console.log(`Current User: ${user.username}`);
        // user id
        // console.log(`Attribute.Sub User: ${user.attributes.sub}`);
      })
  };

  handleChangePost = (event) =>
    this.setState({
      [event.target.name]: event.target.value
    });

  handleAddPost = async (event) => {
    event.preventDefault();
    // create new input data object with all the data we need to send
    const input = {
      postOwnerId: this.state.postOwnerId,
      postOwnerUsername: this.state.postOwnerUsername,
      postTitle: this.state.postTitle,
      postBody: this.state.postBody,
      createdAt: new Date().toISOString
    };
    // calls the api with the createPost mutation and the input object
    await API.graphql(graphqlOperation(createPost, { input }));

    this.setState({ postTitle: "", postBody: "" });
  };

  render() {
    return (
     <Container maxWidth="sm">
        <form className="add-post" onSubmit={this.handleAddPost}>
        <TextField
          type="text"
          name="postTitle"
          required
          value={this.state.postTitle}
          onChange={this.handleChangePost}
        />
        <TextareaAutosize
          type="text"
          name="postBody"
          rows="3"
          cols="20"
          placeholder="New Blog Post"
          required
          value={this.state.postBody}
          onChange={this.handleChangePost}
        />
        <Input type="submit" className="btn" />

      </form>
     </Container>
    );
  }
}

export default CreatePost;
