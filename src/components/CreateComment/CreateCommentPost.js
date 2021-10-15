import React, { Component }from "react";
import API, { graphqlOperation } from "@aws-amplify/api";
import Auth from "@aws-amplify/auth";
import { createComment } from "../../graphql/mutations";
import { Input, TextareaAutosize, FormControl, Button, Container } from "@mui/material";



class CreateCommentPost extends Component {

    state = {
        commentOwnerId: "",
        commentOwnerUsername: "",
        content: ""
    }

    
    componentWillMount = async () => {
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
            <Container>
                <form onSubmit={this.handleAddComment}>
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
                    <Input type="submit" value="comment"/>
                    
                </form>
            </Container>
        )
    }
}

export default CreateCommentPost;