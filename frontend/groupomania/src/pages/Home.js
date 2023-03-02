import React, { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../components/AppContext';
import Post from '../components/Posts/Post';
import axios from 'axios';
import CreatePost from '../components/Posts/CreatePost';
import { Navigate, useNavigate } from 'react-router-dom';
import ReactModal from 'react-modal';
const Home = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
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
        const data = res.data.slice(0, numberOfPosts + 5);
        setNumberOfPosts(numberOfPosts + 5);
        setPosts(data);
      })
      .catch((err) => {
        if (err.status === 500) navigate('/error-page');
      });
  };

  const fetchUser = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}api/auth/${user.userId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setGetUser(res.data.docs);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate('error-auth-page');
        }
        if (err.response.status === 404) {
          navigate('/error-page');
        }
      });
  };
  const loadMore = () => {
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
  useEffect(() => {
    if (user && numberOfPosts === 0) {
      fetchUser();
    }
    fetchPosts();
    setLoadPosts(false);
    window.addEventListener('scroll', loadMore);
    return () => window.removeEventListener('scroll', loadMore);
  }, [loadPosts]);
  const refresh = () => {
    window.location.reload();
    window.scroll(0, 5);
  };

  const updatePosts = () => {
    fetchPosts();
    setIsOpen(false);
    window.scroll(0, 5);
  };

  const createPostModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const goToCreatePost = (e) => {
    e.preventDefault();
    setWantCreatePost(true);
    window.scroll(0, 5);
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
          <div className="home">
            {wantCreatePost ? (
              <section>
                <CreatePost
                  getUser={getUser}
                  unSwitchCreatePost={unSwitchCreatePost}
                  updatePosts={updatePosts}
                />
              </section>
            ) : (
              <article
                id="createPost"
                className="flex ac-center newPostContainer"
              >
                <div
                  className={
                    windowSize.current[0] <= 1024
                      ? 'hideCreatePost'
                      : 'create-container'
                  }
                >
                  <div className="flex row ai-center ac-center space-around create-box">
                    <img
                      className="profilPicture"
                      src={getUser?.profilPicture}
                      alt={getUser?.pseudo}
                    />
                    <div className="createSwitch" onClick={switchCreatePost}>
                      Quoi de neuf, {getUser?.pseudo} ?
                    </div>
                  </div>
                </div>
              </article>
            )}

            <section>
              {posts &&
                posts.map((item) => (
                  <Post
                    getUser={getUser}
                    post={item}
                    updatePosts={updatePosts}
                    key={item._id}
                  />
                ))}
            </section>
            <button
              id="scrollToCreate"
              title="créer un post"
              name="création de post"
              type="button"
              aria-pressed="false"
              className="create-post-btn"
              onClick={
                windowSize.current[0] <= 1024 ? createPostModal : goToCreatePost
              }
            >
              <i className="fa-solid fa-pencil"></i>{' '}
            </button>
            <button
              id="refresh"
              title="Rafraîchir la page des posts"
              name="Rafraîchir la page des posts"
              type="button"
              aria-pressed="false"
              className="home-btn"
              onClick={refresh}
            >
              <i className="fa-solid fa-rotate-right"></i>{' '}
            </button>
            <ReactModal
              isOpen={isOpen}
              className="create-post-modal"
              contentLabel="Voulez vous..."
              overlayClassName="create-post-overlay"
              onRequestClose={closeModal}
              shouldCloseOnOverlayClick={false}
              preventScroll={false}
            >
              <CreatePost
                getUser={getUser}
                updatePosts={updatePosts}
                closeModal={closeModal}
              />
              <div onClick={closeModal} className="stop-modal">
                <i class="fa-solid fa-xmark"></i>
              </div>
            </ReactModal>
            {spinner && (
              <div className="load-post-spinner">
                <i className="fa-solid fa-circle-notch"></i>
              </div>
            )}
          </div>
        </main>
      ) : (
        <Navigate to="/signing" />
      )}
    </>
  );
};

export default Home;
