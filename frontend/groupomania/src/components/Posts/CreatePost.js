import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import { UserContext } from '../AppContext';
import { useNavigate } from 'react-router-dom';

const CreatePost = (post) => {
  const user = useContext(UserContext);
  console.log(post);
  const navigate = useNavigate();
  const form = useRef();
  const title = useRef();
  const text = useRef();
  const image = useRef();
  const createPost = useRef();
  const [file, setFile] = useState();
  const [error, setError] = useState();
  const windowSize = useRef([window.innerWidth]);
  // When is Editing

  const handleNewPost = (e) => {
    e.preventDefault();
    setError(null);
    if (file || text.current.innerText) {
      const data = new FormData();
      data.append('profilPicture', post.getUser.profilPicture);
      data.append('title', title.current.value);
      if (file) {
        data.append('image', image.current.files[0]);
      }
      data.append('text', text.current.innerText);
      data.append('pseudo', user.pseudo);
      axios
        .post(`${process.env.REACT_APP_API_URL}api/post/${user.userId}`, data, {
          withCredentials: true,
        })
        .then(() => {
          post.updatePosts();
          if (windowSize.current[0] >= 1024) {
            post.unSwitchCreatePost();
          }

          text.current.innerText = '';
          form.current.reset();
          setFile(null);
        })
        .catch((err) => {
          if (err.response.status === 400)
            setError('Votre envoi ne doit pas dépasser les 250 caractères');
          if (err.response.status === 401) {
            navigate('/error-auth-page');
          }
          if (err.response.status === 500) {
            navigate('/error-page');
          }
        });
    } else {
      setError('*Veuillez écrire un texte ou télécharger une image ');
    }
  };
  if (createPost.current && createPost.current.style.display === 'none') {
    createPost.current.style.display = 'block';
  }

  const checkImage = () => {
    const files = image.current.files[0];
    const newImg = URL.createObjectURL(files);
    setFile(newImg);
  };

  const removeImage = () => {
    URL.revokeObjectURL(file);
    image.current.value = null;
    setFile(null);
  };
  const closeModal = () => {
    post.closeModal();
  };

  return (
    <article
      ref={createPost}
      id="createPost"
      className="newPostContainer flex cl"
    >
      <div className="flex row sb" style={{ position: 'relative' }}>
        <div className="flex row fs ai-center pseudo-container">
          <img
            className="  profilPicture"
            src={post.getUser.profilPicture}
            alt={post.getUser.pseudo}
          />
          <div className="pseudo">{post.getUser.pseudo}</div>
          {windowSize.current[0] <= 480 && (
            <span onClick={closeModal} className="stop-create">
              {' '}
              <i className="fa-solid fa-xmark"></i>{' '}
            </span>
          )}
        </div>
        <div onClick={() => post.unSwitchCreatePost()} className="stop-create">
          <i class="fa-solid fa-xmark"></i>
        </div>
      </div>
      <form
        ref={form}
        className="flex cl space-around"
        id="post"
        name="postSubmit"
        onSubmit={handleNewPost}
      >
        <label htmlFor="Titre"></label>
        <input
          className="title"
          type="text"
          name="Titre"
          id="Titre"
          placeholder="Titre"
          maxLength={100}
          ref={title}
          autoFocus
          required
        />
        <div>
          <label htmlFor="text"></label>
          <div className="scrolltop">
            <div
              className="textEditable"
              contentEditable="true"
              placeholder="Contenu du post"
              ref={text}
            ></div>
            {error && <p className="error">{error}</p>}
          </div>
        </div>
        {file && (
          <div className="postImg">
            <div className="delete-img-btn">
              <i className="fa-solid fa-xmark" onClick={removeImage}></i>
            </div>

            <img src={file} alt="" />
          </div>
        )}

        <br />
        <div className=" join-img-container flex row space-around ai-center ac-center ">
          <div className="flex row ai-center ac-center">
            <label htmlFor="file">
              <i className="fa-regular fa-file-image"></i>
            </label>
          </div>

          <input
            type="file"
            name="file"
            id="file"
            title=""
            accept="image/jpeg image/png image/jpg image/gif"
            style={{ color: 'transparent' }}
            onChange={checkImage}
            className="imgInput"
            ref={image}
          />
          <input type="submit" value="Envoyer" />
        </div>
      </form>
    </article>
  );
};

export default CreatePost;
