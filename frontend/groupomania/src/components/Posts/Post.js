import { useContext, useRef, useState } from 'react';
import Likes from './Likes';
import { UserContext } from '../AppContext';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import EditPost from './EditPost';
import axios from 'axios';
import Comments from './Comments';
import CreateComment from './CreateComment';
import ReactModal from 'react-modal';

const Post = (props) => {
  const navigate = useNavigate();

  // CONTEXT \\
  const user = useContext(UserContext);

  // DATE \\
  const createdAt = props.post.createdAt;
  const updatedAt = props.post.updatedAt;

  const formatCreateDate = (createdAt) => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      weekday: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return new Date(createdAt).toLocaleDateString('fr-FR', options);
  };
  const formatUpdateDate = (updatedAt) => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      weekday: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return new Date(updatedAt).toLocaleDateString(undefined, options);
  };
  const createDate = formatCreateDate(createdAt);
  const updateDate = formatUpdateDate(updatedAt);

  const [isEditing, setIsEditing] = useState(false);
  const [displayValidationMessage, setDisplayValidationMessage] = useState();
  const [post, setPost] = useState(props.post);
  const [date, setDate] = useState(updateDate);

  // REFS \\

  const ul = useRef();
  // MouseEvent \\
  const handleMouseEnter = () => {
    ul.current.style.display = 'block';
  };
  const handleMouseLeave = () => {
    ul.current.style.display = 'none';
  };

  const windowSize = useRef([window.innerWidth]);

  /* comments */

  const [showComment, setShowComment] = useState(false);
  const [commentsData, setCommentsData] = useState(
    props.post.comments.sort((a, b) => {
      return b.timestamp - a.timestamp;
    })
  );

  const displayComments = () => {
    if (showComment) setShowComment(false);
    else setShowComment(true);
  };
  const updateComments = (newCommentsArr) => {
    if (newCommentsArr.length >= 2) {
      newCommentsArr.sort((a, b) => {
        return b.timestamp - a.timestamp;
      });

      setCommentsData(newCommentsArr);
    } else {
      setCommentsData(newCommentsArr);
    }
  };

  const deleteComment = async (commentId) => {
    await axios
      .put(
        `${process.env.REACT_APP_API_URL}api/post/delete-comment/${props.post._id}`,
        {
          commentId: commentId,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        if (res.data.length > 1) {
          let data = res.data.sort((a, b) => {
            return b.timestamp - a.timestamp;
          });
          setCommentsData(data);
        } else {
          setCommentsData(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
        navigate('/logout');
      });
  };

  // Call the EditPost Component \\
  const editPost = () => {
    setDisplayValidationMessage(false);
    setIsEditing(true);
  };

  // stop Edit
  const stopEdit = () => {
    setIsEditing(false);
  };
  //
  //update values from Edit¨Post
  const updatePost = (data) => {
    const newUpdateDate = formatUpdateDate(data.updatedAt);
    setDate(newUpdateDate);
    setPost(data);
    setIsEditing(false);
    setDisplayValidationMessage(true);
  };

  // DELETE POST \\

  const deletePost = async () => {
    await axios
      .delete(`${process.env.REACT_APP_API_URL}api/post/${props.post._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        props.updatePosts();
      })
      .catch(() => {
        navigate('/logout');
      });
  };

  //MODAL\\

  const [isOpen, setIsOpen] = useState(false);
  ReactModal.setAppElement('#root');

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const yesResModal = (e) => {
    deletePost();
    closeModal();
  };
  const noResModal = () => {
    closeModal();
  };
  //RENDER\\
  return (
    <>
      {isEditing ? (
        <EditPost
          postToEdit={post}
          stopEdit={stopEdit}
          updatePost={updatePost}
        />
      ) : (
        <section id={props.post._id} className="flex cl space-around ">
          <div className="post">
            <div className="flex row sb pseudo-container">
              <NavLink
                className="pseudo-link"
                to={{
                  pathname: '/profil',
                  search: `?user=${props.post.userId}`,
                }}
              >
                <div>
                  <div className="flex row ai-center ">
                    <img
                      className="profilPicture"
                      src={post.profilPicture}
                      alt="Profil"
                    />
                    <div>{post.pseudo}</div>
                  </div>
                </div>
              </NavLink>
              {(user?.userId === post.userId || user?.isAdmin) && (
                <>
                  <div onMouseLeave={handleMouseLeave} className="edit-box">
                    <div className="icon-box">
                      <i
                        onClick={handleMouseEnter}
                        className="fa-solid fa-ellipsis-vertical"
                      ></i>
                    </div>

                    <ul
                      onMouseLeave={handleMouseLeave}
                      className="list-box"
                      ref={ul}
                    >
                      {user.userId === post.userId && (
                        <>
                          <li onClick={editPost}>Modifier</li>
                          <li onClick={openModal}>Supprimer</li>
                        </>
                      )}
                      {user.isAdmin && (
                        <>
                          <li onClick={openModal}>Supprimer</li>
                        </>
                      )}
                    </ul>
                  </div>
                  <ReactModal
                    isOpen={isOpen}
                    className="modal"
                    contentLabel="Voulez vous..."
                    overlayClassName="overlay"
                    onRequestClose={closeModal}
                  >
                    <div className="modal-container ">
                      <div className=" modal-box  ">
                        <div className="modal-ask">Supprimer le post ?</div>
                        <div className="flex row btn-box ">
                          <button onClick={yesResModal} className="yes">
                            Oui
                          </button>
                          <button onClick={noResModal} className="no">
                            Non
                          </button>
                        </div>
                      </div>
                    </div>
                  </ReactModal>
                </>
              )}
            </div>
            <>
              <div className="date">
                {createDate < date ? (
                  <>
                    <i className="fa-regular fa-pen-to-square"></i>
                    <span>Modifié le {date}</span>
                  </>
                ) : (
                  <span>Posté le {updateDate}</span>
                )}
              </div>
              <div className="title">{post.title}</div>
              <div className="text">{post.text}</div>
              <div className="postImg">
                {post.imageUrl && (
                  <img src={post.imageUrl} loading="lazy" alt="Post"></img>
                )}
              </div>
              <div className="flex row stretch ai-center ac-center container">
                <Likes {...props} />
                <div
                  onClick={displayComments}
                  className="comment-icon flex row ai-center ac-center"
                >
                  <i className="fa-regular fa-comment-dots"></i>
                  <div className="comment-counter">
                    {commentsData.length >= 1 && commentsData.length}
                  </div>
                </div>
              </div>
            </>
          </div>
          <>
            {showComment ? (
              commentsData.length >= 1 ? (
                windowSize.current[0] <= 480 ? (
                  <Navigate to={`/post?id=${props.post._id}`} />
                ) : (
                  <>
                    <CreateComment
                      postProps={props}
                      updateComments={updateComments}
                    />
                    {commentsData &&
                      commentsData.map((item) => (
                        <Comments
                          deleteComment={deleteComment}
                          comment={item}
                          key={item._id}
                        />
                      ))}
                  </>
                )
              ) : (
                <>
                  <CreateComment
                    postProps={props}
                    updateComments={updateComments}
                  />
                </>
              )
            ) : (
              <></>
            )}
          </>
        </section>
      )}
    </>
  );
};

export default Post;
