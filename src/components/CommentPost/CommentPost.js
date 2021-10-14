import { Component } from "react";


class CommentPost extends Component {


    render() {

        const {content, commentOwnerUsername, createdAt}
        return(
            <div>
                <span>
                    {commentOwnerUsername}
                </span>

                <p>
                    {content}
                </p>
            </div>
        )
    }
}

export default CommentPost;