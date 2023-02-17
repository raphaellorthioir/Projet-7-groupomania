import React, { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../components/AppContext';
import Post from '../components/Posts/Post';
import axios from 'axios';
import CreatePost from '../components/Posts/CreatePost';
import { Navigate } from 'react-router-dom';
import ReactModal from 'react-modal';
const Home = () => {
  const user = useContext(UserContext);
  const [posts, setPosts] = useState();
  const [getUser, setGetUser] = useState();
  const [wantCreatePost, setWantCreatePost] = useState(false);
  const [loadPosts, setLoadPosts] = useState(true);
  const [numberOfPosts, setNumberOfPosts] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [spinner, setSpinner] = useState(false);
  ReactModal.setAppElement('#root');
  const windowSize = useRef([window.innerWidth]);

  const fetchPosts = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}api/post`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        const data = res.data.slice(0, numberOfPosts + 5);
        setNumberOfPosts(numberOfPosts + 5);
        setPosts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updatePosts = () => {
    if (windowSize.current[0] <= 480) window.scroll(0, 2);
    fetchPosts();
    setIsOpen(false);
  };

  const fetchUser = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}api/auth/${user.userId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setGetUser(res.data.docs);
      });
  };
  const loadMore = () => {
    // window.innerHeight = document.documentElement.scrollTop + 1 : partie qui corrend à l'endroit (barre de défilement) où on se trouve dans le document , le plus 1(pixel) permet d'activer la condition
    //document.scrollingElement.scrollHeight : partie qui calcule la hauteur de tout le document
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >
      document.scrollingElement.scrollHeight
    ) {
      setLoadPosts(true);
    }
    if (document.documentElement.scrollTop === 0) {
      setSpinner(true);
      setTimeout(() => {
        fetchPosts();
        setSpinner(false);
      }, 1000);
    }
  };

  const refresh = () => {
    window.scroll(0, 0);
  };
  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    fetchPosts();
    setLoadPosts(false);
    window.addEventListener('scroll', loadMore);
    return () => window.removeEventListener('scroll', loadMore);
  }, [loadPosts]);

  const createPostModal = (e) => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const goToCreatePost = (e) => {
    e.preventDefault();
    setWantCreatePost(true);
    const el = document.getElementById('createPost');

    el?.scrollIntoView({
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
                getUser={getUser}
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
                    src={getUser?.profilPicture}
                    alt=""
                  />
                  <div className="createSwitch" onClick={switchCreatePost}>
                    Quoi de neuf, {getUser?.pseudo} ?
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="post-container  ">
            {posts &&
              posts.map((item) => (
                <Post
                  getUser={getUser}
                  post={item}
                  updatePosts={updatePosts}
                  key={item._id}
                />
              ))}
          </div>
          <button
            id="scrollToCreate"
            title="créer un post"
            name="création de post"
            type="button"
            aria-pressed="false"
            className="home-btn"
            onClick={
              windowSize.current[0] <= 480 ? createPostModal : goToCreatePost
            }
          >
            <i class="fa-solid fa-pencil"></i>{' '}
          </button>
          <button
            id="refresh"
            title="créer un post"
            name="création de post"
            type="button"
            aria-pressed="false"
            className="home-btn"
            onClick={refresh}
          >
            <i class="fa-solid fa-rotate-right"></i>{' '}
          </button>
          <ReactModal
            isOpen={isOpen}
            className="create-post-modal"
            contentLabel="Voulez vous..."
            overlayClassName="create-post-overlay"
            onRequestClose={closeModal}
            shouldCloseOnOverlayClick={false}
            preventScroll={true}
          >
            <CreatePost
              getUser={getUser}
              updatePosts={updatePosts}
              closeModal={closeModal}
            />
          </ReactModal>
          {spinner && (
            <div className="load-post-spinner">
              <i class="fa-solid fa-circle-notch"></i>
            </div>
          )}
        </main>
      ) : (
        <Navigate to="/signing" />
      )}
    </>
  );
};

export default Home;
