import React, {Component} from "react";
import './DisplayPosts.css';
import DeletePost from "../DeletePost/DeletePost";


// import method 
import { listPosts } from "../../graphql/queries";
//imports the api
import {API, graphqlOperation} from 'aws-amplify';
import EditPost from "../EditPost/EditPost";
import { onCreatePost, onDeletePost, onUpdatePost } from "../../graphql/subscriptions";
import { deletePost, updatePost } from "../../graphql/mutations";
//*==================
import { Container, Avatar } from "@mui/material";


class DisplayPosts extends Component {

    state = {
        posts: []
    }

    componentDidMount = async () => {
        this.getPosts();

        //* ============ CreatePost Listener
        // This listener will run when a new post is created 
        this.createPostListener = API.graphql(graphqlOperation(onCreatePost))
        .subscribe({
            //postData contains the current post info 
            next: postData => {
                // newPost is created from postData
                const newPost = postData.value.data.onCreatePost
                // gets the prevPosts and makes sure the newPost is not in the array
                const prevPost = this.state.posts.filter(post => post.id !== newPost.id)
                // create new array of posts (new posts first then prevPosts)
                const updatedPosts = [newPost, ...prevPost]
                this.setState({posts: updatedPosts})
            }
        })


        //* =========== DeletePost Listener
        // This listener will run when a post is deleted
        this.deletePostListener = API.graphql(graphqlOperation(onDeletePost))
            .subscribe({
                //postData contains the current post info
                next: postData => {
                    // gets the deleted post
                    const deletedPost = postData.value.data.onDeletePost
                    const updatedPosts = this.state.posts.filter(post => post.id !== deletedPost.id)
                    this.setState({posts: updatedPosts})
                }
            })


        //* ========== UpdatePost Listener
        this.updatePostListener = API.graphql(graphqlOperation(onUpdatePost))
            .subscribe({
                next: postData => {
                    const { posts } = this.state
                    const updatePost = postData.value.data.onUpdatePost
                    const index = posts.findIndex(post => post.id === updatePost.id)

                    const updatePosts = [
                        ...posts.slice(0, index),
                        updatePost,
                        ...posts.slice(index + 1)
                    ]

                    this.setState({ posts: updatePosts})
                }
            })
    };

    componentWillUnmount(){
        this.createPostListener.unsubscribe()
        this.deletePostListener.unsubscribe()
        this.updatePostListener.unsubscribe()
    }

    getPosts = async () => {
        const result = await API.graphql(graphqlOperation(listPosts))
        this.setState({posts: result.data.listPosts.items})

        //console.log(`All Posts: `, result.data.listPosts.items);
    }
    
    render() {
        const { posts } = this.state;
        return posts.map(post => {
            return (
                <Container maxWidth="sm" className="posts rowStyle" key={post.id}>
                    <div>
                    <Avatar alt="Remy Sharp" src="https://cdn.fordhamram.com/wp-content/uploads/amongus-512x375.png" />
                        <h3>{post.postOwnerUsername}</h3>
                    </div>
                    <img style={{maxHeight: 300, maxWidth: 300}} src="https://jw-webmagazine.com/wp-content/uploads/2020/03/Kimetsu-no-YaibaDemon-Slayer.jpg"/>
                    <h1>{post.postTitle}</h1>
                    <span className="wrote-by">
                        {"Wrote by: "} {post.postOwnerUsername}
                        {" on "}
                        {" "}
                        <time className="time">{new Date(post.createdAt).toDateString()}</time>
                    </span>
                   <div>
                        <h3>{post.postOwnerUsername}</h3>
                        <p>{post.postBody}</p>
                    </div>

                    <br/>
                    <span>
                        <DeletePost data={post}/>
                        <EditPost {...post}/>
                    </span>
                </Container>
            )
        })
    }
}

export default DisplayPosts;