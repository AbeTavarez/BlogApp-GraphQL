import React, {Component} from "react";
import './DisplayPosts.css';
import DeletePost from "../DeletePost/DeletePost";


// import method 
import { listPosts } from "../../graphql/queries";
//imports the api
import {API, graphqlOperation} from 'aws-amplify';
import EditPost from "../EditPost/EditPost";

class DisplayPosts extends Component {

    state = {
        posts: []
    }

    componentDidMount = async () => {
        this.getPosts()
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
                        <DeletePost />
                        <EditPost />
                    </span>
                </div>
            )
        })
    }
}

export default DisplayPosts;