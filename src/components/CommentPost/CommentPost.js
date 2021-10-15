import { Container } from "@mui/material";
import React, { Component } from "react";
import "./CommentPost.css";


class CommentPost extends Component {


    render() {

        const { content, commentOwnerUsername, createdAt } = this.props.commentData;

        return(
            <Container className="cont">
                <div className="comment-username">{commentOwnerUsername}:</div> {" "}
                {/* <time>{new Date(createdAt).toDateString()}</time> */}
                <div>{content}</div>
            </Container>
        )
    }
}

export default CommentPost;