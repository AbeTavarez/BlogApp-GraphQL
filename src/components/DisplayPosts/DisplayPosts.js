import React, {Component} from "react";
import './DisplayPosts.css';
import DeletePost from "../DeletePost/DeletePost";


// import method 
import { listPosts } from "../../graphql/queries";
//imports the api
import {API, graphqlOperation} from 'aws-amplify';
import EditPost from "../EditPost/EditPost";
import { onCreatePost, onDeletePost } from "../../graphql/subscriptions";
import { deletePost } from "../../graphql/mutations";

class DisplayPosts extends Component {

    state = {
        posts: []
    }

    componentDidMount = async () => {
        this.getPosts();

        //* ============ CreatePostListener
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
        //* =========== DeletePostListener
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
    };

    componentWillUnmount(){
        this.createPostListener.unsubscribe()
        this.deletePostListener.unsubscribe()
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
                <div className="posts rowStyle" key={post.id}>
                    <h1>{post.postTitle}</h1>
                    <span className="wrote-by">
                        {"Wrote by: "} {post.postOwnerUsername}
                        {" on "}
                        {" "}
                        <time className="time">{new Date(post.createdAt).toDateString()}</time>
                    </span>
                    <p>{post.postBody}</p>

                    <br/>
                    <span>
                        <DeletePost data={post}/>
                        <EditPost />
                    </span>
                </div>
            )
        })
    }
}

export default DisplayPosts;