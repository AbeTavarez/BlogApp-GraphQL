import React, { Component } from "react";
import "./DisplayPosts.css";
import DeletePost from "../DeletePost/DeletePost";

// import method
import { listPosts } from "../../graphql/queries";
//imports the api
import { API, graphqlOperation, Auth } from "aws-amplify";
import EditPost from "../EditPost/EditPost";
import {
  onCreateComment,
  onCreateLike,
  onCreatePost,
  onDeletePost,
  onUpdatePost,
} from "../../graphql/subscriptions";
import { createLike, deletePost, updatePost } from "../../graphql/mutations";
import CreateCommentPost from "../CreateComment/CreateCommentPost";
import UserWhoLikedPost from "../UserWhoLikedPost/UserWhoLikedPost";

import { FaThumbsUp, FaSadTear } from "react-icons/fa";

//*==================
import { Container, Avatar } from "@mui/material";
import CommentPost from "../CommentPost/CommentPost";

class DisplayPosts extends Component {
  state = {
    ownerId: "",
    ownerUsername: "",
    errorMessage: "",
    postLikedBy: [],
    isHovering: false,
    posts: [],
  };

  componentDidMount = async () => {
    this.getPosts();

    await Auth.currentUserInfo().then((user) => {
      this.setState({
        ownerId: user.attributes.sub,
        ownerUsername: user.username,
      });
    });

    //* ============ CreatePost Listener
    // This listener will run when a new post is created
    this.createPostListener = API.graphql(
      graphqlOperation(onCreatePost)
    ).subscribe({
      //postData contains the current post info
      next: (postData) => {
        // newPost is created from postData
        const newPost = postData.value.data.onCreatePost;
        // gets the prevPosts and makes sure the newPost is not in the array
        const prevPost = this.state.posts.filter(
          (post) => post.id !== newPost.id
        );
        // create new array of posts (new posts first then prevPosts)
        const updatedPosts = [newPost, ...prevPost];
        this.setState({ posts: updatedPosts });
      },
    });

    //* =========== DeletePost Listener
    // This listener will run when a post is deleted
    this.deletePostListener = API.graphql(
      graphqlOperation(onDeletePost)
    ).subscribe({
      //postData contains the current post info
      next: (postData) => {
        // gets the deleted post
        const deletedPost = postData.value.data.onDeletePost;
        const updatedPosts = this.state.posts.filter(
          (post) => post.id !== deletedPost.id
        );
        this.setState({ posts: updatedPosts });
      },
    });

    //* ========== UpdatePost Listener
    this.updatePostListener = API.graphql(
      graphqlOperation(onUpdatePost)
    ).subscribe({
      next: (postData) => {
        const { posts } = this.state;
        const updatePost = postData.value.data.onUpdatePost;
        const index = posts.findIndex((post) => post.id === updatePost.id);

        const updatePosts = [
          ...posts.slice(0, index),
          updatePost,
          ...posts.slice(index + 1),
        ];

        this.setState({ posts: updatePosts });
      },
    });

    //* ========== CreateComment Listener
    this.createCommentListener = API.graphql(
      graphqlOperation(onCreateComment)
    ).subscribe({
      next: (commentData) => {
        const createdComment = commentData.value.data.onCreateComment;
        let posts = [...this.state.posts];

        for (let post of posts) {
          if (createdComment.post.id === post.id) {
            post.comments.items.push(createdComment);
          }
        }
        this.setState({ posts });
      },
    });

    //* ========= CreatePostLike Listener
    this.createPostLikeListener = API.graphql(
      graphqlOperation(onCreateLike)
    ).subscribe({
      next: (postData) => {
        const createdLike = postData.value.data.onCreateLike;
        let posts = [...this.state.posts];

        for (let post of posts) {
          if (createdLike.post.id === post.id) {
            post.likes.items.push(createdLike);
          }
        }
        this.setState({ posts });
      },
    });
  };

  componentWillUnmount() {
    this.createPostListener.unsubscribe();
    this.deletePostListener.unsubscribe();
    this.updatePostListener.unsubscribe();
    this.createCommentListener.unsubscribe();
    this.createPostLikeListener.unsubscribe();
  }

  getPosts = async () => {
    const result = await API.graphql(graphqlOperation(listPosts));
    this.setState({ posts: result.data.listPosts.items });

    //console.log(`All Posts: `, result.data.listPosts.items);
  };

  likedPost = (postId) => {
    for (let post of this.state.posts) {
      if (post.id === postId) {
        if (post.postOwnerId === this.state.ownerId) return true;

        for (let like of post.likes.items) {
          if (like.likeOwnerId === this.state.ownerId) {
            return true;
          }
        }
      }
    }
    return false;
  };

  handleLike = async (postId) => {
    if (this.likedPost(postId)) {
      return this.setState({ errorMessage: "Can't like your own post" });
    } else {
      const input = {
        numberLikes: 1,
        likeOwnerId: this.state.ownerId,
        likeOwnerUsername: this.state.ownerUsername,
        likePostId: postId,
      };

      try {
        const result = await API.graphql(
          graphqlOperation(createLike, { input })
        );
        console.log(`Liked: `, result.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  handleMouseHover = async postId => {
    this.setState({isHovering: !this.state.isHovering})

    let innerLikes = this.state.postLikedBy
    // loops over posts we have in state
    for (let post of this.state.posts){
        if (post.id === postId){
            // if the postId arg is equal to the post.id
            // go to the post likes array at [post.like.items]
            for (let like of post.likes.items){
                innerLikes.push(like.likeOwnerUsername)
            }
        }
    }
    this.setState({postLikedBy: innerLikes})
    console.log('Post liked by:', this.state.postLikedBy);
  }

  onMouseHoverLeave = async () => {
      this.setState({isHovering: !this.state.isHovering})
      this.setState({postLikedBy: []})
  }

  render() {
    const { posts } = this.state;

    let loggedInUser = this.state.ownerId;

    return posts.map((post) => {
      return (
        <Container maxWidth="md" className="posts rowStyle" key={post.id}>
          <div>
            <Avatar
              alt=""
              src="https://cdn.fordhamram.com/wp-content/uploads/amongus-512x375.png"
            />
            <h3>{post.postOwnerUsername}</h3>
          </div>

          <img
            style={{ maxHeight: 300, maxWidth: 300 }}
            src="https://jw-webmagazine.com/wp-content/uploads/2020/03/Kimetsu-no-YaibaDemon-Slayer.jpg"
          />

          <h1>{post.postTitle}</h1>

          <span className="wrote-by">
            {"Wrote by: "} {post.postOwnerUsername}
            {" on "}{" "}
            <time className="time">
              {new Date(post.createdAt).toDateString()}
            </time>
          </span>

          <div>
            <h3>{post.postOwnerUsername}</h3>
            <p>{post.postBody}</p>
          </div>

          <br />

          <span>
            {post.postOwnerId === loggedInUser && <DeletePost data={post} />}

            {post.postOwnerId === loggedInUser && <EditPost {...post} />}

            {/* ===================  Post Like */}

            <span className="like-container">

              <p className="alert">
                {post.postOwnerId === loggedInUser && this.state.errorMessage}
              </p>

              <p className="like-button"
                style={{color: (post.likes.items.length > 0) ? "blue" : "grey"}}
                onMouseEnter={() => this.handleMouseHover(post.id)}
                onMouseLeave={() => this.onMouseHoverLeave()}
                onClick={() => this.handleLike(post.id)}>
                <FaThumbsUp />

                {
                    this.state.isHovering && 
                    <div className="user-liked">
                        {this.state.postLikedBy.length === 0 ? "No likes Yet" : "Liked by "}
                        {this.state.postLikedBy.length === 0 ? <FaSadTear /> : <UserWhoLikedPost data={this.state.postLikedBy} />}
                    </div>    
                }
              </p>

              {/* number of likes */}
              {post.likes.items.length}
            </span>

          </span>

          <span>
            <CreateCommentPost postId={post.id} />

            {post.comments.items.length > 0 && (
              <span style={{ fontSize: "19px" }}>Comments: </span>
            )}

            {post.comments.items.map((comment, index) => (
              <CommentPost key={index} commentData={comment} />
            ))}
          </span>
        </Container>
      );
    });
  }
}

export default DisplayPosts;
