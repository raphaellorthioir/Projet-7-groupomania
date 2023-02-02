import { useContext, useRef, useState } from 'react';
import Likes from './Likes';
import { UserContext } from '../AppContext';
import { NavLink } from 'react-router-dom';
import EditPost from './EditPost';

const Post = (props) => {
  const user = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  
  const ul = useRef();
  const title =useRef()
  const text =useRef()
  const image=useRef()

  // MouseEvent
  const handleMouseEnter = () => {
    ul.current.style.display = 'block';
  };
  const handleMouseLeave = () => {
    ul.current.style.display = 'none';
  };

  // DATE//
  const createdAt = props.post.createdAt;
  const updatedAt = props.post.updatedAt;

  const formatCreateDate = (createdAt) => {
    const options = {
      year: 'numeric',
      month: 'long',
      weekday: 'short',
      //day: 'numeric',
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

  // Call the CreatePost Component
  const editPost = () => {
    setIsEditing(true);
  };

const showUpdatePost =(updatePost)=>{
  console.log(updatePost);
}
  //RENDER
  return (
    <>
      {isEditing ? (
        <EditPost  postToEdit={props}  updatePost={showUpdatePost} />
      ) : (
        <div className="flex cl space-around post ">
          <div className="flex row sb">
            <NavLink
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
                  <li>Supprimer</li>
                </ul>
              </div>
            )}
          </div>
          {primitiveUpdateDate > primitiveCreateDate ? (
            <div className="date">
              <i className="fa-regular fa-pen-to-square"></i> Modifié le {updateDate}</div>
          ) : (
            <div className="date">`Posté le`{createDate}</div>
          )}

          <div className="title">{props.post.title}</div>
          <div className="text">{props.post.text}</div>

          <div className="postImg">
            {props.post.imageUrl && (
              <img src={props.post.imageUrl} loading="lazy" alt="Post"></img>
            )}
          </div>
          <div className="flex row stretch ai-center container">
            <Likes {...props} />
            <div className="comment-icon">
              <i className="fa-regular fa-comment-dots"></i>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Post;
