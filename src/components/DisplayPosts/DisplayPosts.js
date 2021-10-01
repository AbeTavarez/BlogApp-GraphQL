import React, {Component} from "react";
// import method 
import { listPosts } from "../../graphql/queries";
//imports the api
import {API, graphqlOperation} from 'aws-amplify';

class DisplayPosts extends Component {
    componentDidMount = async () => {
        this.getPosts()
    }

    getPosts = async () => {
        const result = await API.graphql(graphqlOperation(listPosts))
        console.log(`All Posts: `, JSON.stringify(result.data.listPosts.items));
    }
    render() {
        return (
            <div>
                Hello world
            </div>
        )
    }
}

export default DisplayPosts;