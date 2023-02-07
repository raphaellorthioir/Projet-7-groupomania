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

  // STATES \\

  const [isUpdated, setIsUpdated] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [displayValidationMessage, setDisplayValidationMessage] = useState();
  const [date, setDate] = useState();
  const [title, setTitle] = useState();
  const [text, setText] = useState();
  const [image, setImage] = useState();

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
      .patch(
        `${process.env.REACT_APP_API_URL}api/post/delete-comment/${props.post._id}`,
        {
          commentId: commentId,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
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
        navigate('/signing')
      });
  };
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

  const primitiveCreateDate = new Date(createdAt).valueOf();
  const primitiveUpdateDate = new Date(updatedAt).valueOf();

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
    setTitle(data.title);
    setText(data.text);
    setImage(data.imageUrl);
    setIsEditing(false);
    setIsUpdated(true);
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
        navigate('/signing');
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
          postToEdit={props}
          stopEdit={stopEdit}
          updatePost={updatePost}
          updatedData={{ date, title, text, image }}
          isUpdated={isUpdated}
        />
      ) : (
        <section className="flex cl space-around ">
          <div className="post">
            <div className="flex row sb">
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
                      src={props.post.profilPicture}
                      alt="Profil"
                    />
                    <div>{props.post.pseudo}</div>
                  </div>
                </div>
              </NavLink>
              {(user.userId === props.post.userId || user.isAdmin) && (
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
                      <li onClick={editPost}>Modifier</li>
                      <li onClick={openModal}>Supprimer</li>
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
            {isUpdated ? (
              <>
                <div className="date">
                  <i className="fa-regular fa-pen-to-square"></i> Modifié le{' '}
                  {date}
                </div>
                <div className="title">{title}</div>
                <div className="text">{text}</div>
                <div className="postImg">
                  {image && <img src={image} loading="lazy" alt="Post"></img>}
                </div>
                <div className="flex row sb ai-center">
                  <div className="flex row stretch ai-center container">
                    <Likes {...props} />
                    <div className="comment-icon">
                      <i
                        onClick={displayComments}
                        className="fa-regular fa-comment-dots"
                      ></i>
                      {commentsData.length >= 1 && commentsData.length}
                    </div>
                  </div>
                  {displayValidationMessage && (
                    <div className="success-icon flex row ai-center">
                      <span>Post modifié</span>
                      <i class="fa-solid fa-circle-check"></i>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {primitiveUpdateDate > primitiveCreateDate ? (
                  <>
                    <div className="date">
                      <i className="fa-regular fa-pen-to-square"></i>
                      <span>Modifié le {updateDate}</span>
                    </div>
                    <div className="title">{props.post.title}</div>
                    <div className="text">{props.post.text}</div>
                    <div className="postImg">
                      {props.post.imageUrl && (
                        <img
                          src={props.post.imageUrl}
                          loading="lazy"
                          alt="Post"
                        ></img>
                      )}
                    </div>
                    <div className="flex row sb ai-center">
                      <div className="flex row stretch ai-center container">
                        <Likes {...props} />
                        <div onClick={displayComments} className="comment-icon">
                          <i className="fa-regular fa-comment-dots"></i>
                          {commentsData.length >= 1 && commentsData.length}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="date">`Posté le`{createDate}</div>
                    <div className="title">{props.post.title}</div>
                    <div className="text">{props.post.text}</div>
                    <div className="postImg">
                      {props.post.imageUrl && (
                        <img
                          src={props.post.imageUrl}
                          loading="lazy"
                          alt="Post"
                        ></img>
                      )}
                    </div>
                    <div className="flex row sb ai-center">
                      <div className="flex row stretch ai-center container">
                        <Likes {...props} />
                        <div onClick={displayComments} className="comment-icon">
                          <i className="fa-regular fa-comment-dots"></i>
                          {commentsData.length >= 1 && commentsData.length}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
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
