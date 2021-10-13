import API, {graphqlOperation} from "@aws-amplify/api";
import { Component } from "react";
import { deletePost } from "../../graphql/mutations";



//* ========= Materialize UI
import Button from '@mui/material/Button';

class DeletePost extends Component {

    handleDeletePost = async postId => {
        const input = {
            id: postId
        }

        await API.graphql(graphqlOperation(deletePost, {input}))
    }

    render() {
        const post = this.props.data
        return(
            <Button variant="text" onClick={() => this.handleDeletePost(post.id)}>Delete Post</Button>
        )
    }
}

export default DeletePost;