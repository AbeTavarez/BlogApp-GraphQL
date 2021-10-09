import './App.css';
import CreatePost from './components/CreatePost/CreatePost';
import DisplayPosts from './components/DisplayPosts/DisplayPosts';
import { withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';


function App() {
  return (
    <div className="App">
      <CreatePost />
      <DisplayPosts />
    </div>
  );
}

export default withAuthenticator(App, {includeGreetings: true});
