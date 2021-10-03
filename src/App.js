import './App.css';
import CreatePost from './components/CreatePost/CreatePost';
import DisplayPosts from './components/DisplayPosts/DisplayPosts';

function App() {
  return (
    <div className="App">
      <CreatePost />
      <DisplayPosts />
    </div>
  );
}

export default App;
