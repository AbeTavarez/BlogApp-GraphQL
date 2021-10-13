import Auth from "@aws-amplify/auth";
import React, { Component }from "react";


class CreateCommentPost extends Component {

    state = {
        commentOwnerId: "",
        commentOwnerUsername: "",
        content: ""
    }

    componentWillUnmount = async => {
        await Auth.currentUserInfo()
            .then(user => {
                this.setState({
                    commentOwnerId: user.attributes.sub,
                    commentOwnerUsername: user.username
                })
            }
            )
    }

    render() {

    }
}