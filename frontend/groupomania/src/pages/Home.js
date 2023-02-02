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

  return (
    <>
      {user ? (
        <div className="flex cl ">
          <header>
            <Navbar />
          </header>

          <div>
            <CreatePost updatePosts={updatePosts} />
          </div>

          <div className="post-container cl space-around ai-center ac-center ">
            {posts && posts.map((item) => <Post post={item} key={item._id} />)}
          </div>
        </div>
      ) : (
        <Navigate to="/signing" />
      )}
    </>
  );
};

export default Home;
