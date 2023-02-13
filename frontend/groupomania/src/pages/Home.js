import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../components/AppContext';
import Post from '../components/Posts/Post';
import axios from 'axios';
import CreatePost from '../components/Posts/CreatePost';
import { Navigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import AnchorLink from 'react-anchor-link-smooth-scroll';
const Home = () => {
  const user = useContext(UserContext);
  const [posts, setPosts] = useState();
  const [wantCreatePost, setWantCreatePost] = useState(false);
  const [loadPosts, setLoadPosts] = useState();
  const [numberOfPosts, setNumberOfPosts] = useState(0);

  const fetchPosts = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}api/post`, {
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data.slice(0, numberOfPosts + 5);
        setNumberOfPosts(numberOfPosts + 5);
        setPosts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updatePosts = () => {
    fetchPosts();
  };

  const loadMore = () => {
    // window.innerHeight = document.documentElement.scrollTop + 1 : partie qui corrend à l'endroit (barre de défilement) où on se trouve dans le document , le plus 1(pixel) permet d'activer la condition
    //document.scrollingElement.scrollHeight : partie qui calcule la hauteur de tout le document
    console.log(window.innerHeight + document.documentElement.scrollTop + 1);
    console.log(document.scrollingElement.scrollHeight);
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >
      document.scrollingElement.scrollHeight
    ) {
      setLoadPosts(true);
    }
  };
  useEffect(() => {
    console.log('hello');

    fetchPosts();
    setLoadPosts(false);
    window.addEventListener('scroll', loadMore);
    return () => window.removeEventListener('scroll', loadMore);
  }, [loadPosts]);

  const scroll = () => {
    setWantCreatePost(true);
    const el = document.getElementById('createPost');
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  };
  const switchCreatePost = () => {
    setWantCreatePost(true);
  };
  const unSwitchCreatePost = () => {
    setWantCreatePost(false);
  };
  return (
    <>
      {user ? (
        <main>
          {wantCreatePost ? (
            <div id="machin">
              <CreatePost
                unSwitchCreatePost={unSwitchCreatePost}
                updatePosts={updatePosts}
              />
            </div>
          ) : (
            <section id="section" className="flex ac-center newPostContainer">
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
          <button onClick={scroll}> </button>
          <HashLink
            onClick={switchCreatePost}
            className="createPost-btn"
            smooth
            to="#createPost"
          >
            <i class="fa-solid fa-pencil"></i>
          </HashLink>
        </main>
      ) : (
        <Navigate to="/signing" />
      )}
    </>
  );
};

export default Home;
