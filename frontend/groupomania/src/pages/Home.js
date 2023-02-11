import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../components/AppContext';
import Navbar from '../components/Navbar';
import Post from '../components/Posts/Post';
import axios from 'axios';
import CreatePost from '../components/Posts/CreatePost';

const Home = () => {
  const user = useContext(UserContext);
  const [posts, setPosts] = useState();
  const [wantCreatePost, setWantCreatePost] = useState(false);
  const fetchPosts = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}api/post`, {
        withCredentials: true,
      })
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updatePosts = () => {
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const switchCreatePost = () => {
    setWantCreatePost(true);
  };
const unSwitchCreatePost =()=>{
  setWantCreatePost(false)
}
  return (
    <>
      <main>
        {wantCreatePost ? (
          <CreatePost unSwitchCreatePost={unSwitchCreatePost} updatePosts={updatePosts} />
        ) : (
          <section className="flex ac-center newPostContainer">
            <div className="create-container">
              <div className="flex row ai-center ac-center space-around create-box">
                <img
                  className="profilPicture"
                  src={user?.profilPicture}
                  alt=""
                />
                <div className="createSwitch" onClick={switchCreatePost}>
                  Quoi de neuf, {user?.pseudo} ?
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="post-container  ">
          {posts &&
            posts.map((item) => (
              <Post post={item} updatePosts={updatePosts} key={item._id} />
            ))}
        </div>
      </main>
    </>
  );
};

export default Home;
