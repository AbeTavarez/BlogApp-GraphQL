import API from "@aws-amplify/api";
import Auth from "@aws-amplify/auth";
import { Input, TextareaAutosize, FormControl } from "@mui/material";
import React, { Component }from "react";


class CreateCommentPost extends Component {

    state = {
        commentOwnerId: "",
        commentOwnerUsername: "",
        content: ""
    }

    
    componentWillUnmount = async => {
        // fetches user info from backend
        await Auth.currentUserInfo()
            .then(user => {
                this.setState({
                    commentOwnerId: user.attributes.sub,
                    commentOwnerUsername: user.username
                })
            }
            )
    }

    handleChangeContent = e => this.setState({ content: e.target.value })

    handleAddComment = async e => {
        e.preventDefault()

        //* prepare the data
        const input = {
            commentPostId: this.props.postId,
            commentOwnerId: this.state.commentOwnerId,
            commentOwnerUsername: this.state.commentOwnerUsername,
            content: this.state.content,
            createdAt: new Date().toISOString()
        }
        //* make the api call with the mutation and the new data
        await API.graphql(graphqlOperation(createComment, { input }))
        //* reset the content state
        this.setState({ content: ""})
    }

    render() {
        return (
            <div>
                <FormControl onSubmit={this.handleAddComment}>
                    <TextareaAutosize
                        type="text"
                        name="content"
                        maxRows="3"
                        cols="40"
                        placeholder="comment"
                        value={this.state.content}
                        onChange={this.handleChangeContent}
                    >
                    </TextareaAutosize>
                    <Input value="comment" />
                </FormControl>
            </div>
        )
    }
}

export default CreateCommentPost;