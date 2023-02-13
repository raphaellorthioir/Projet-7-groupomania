import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import { UserContext } from '../AppContext';
import { useNavigate } from 'react-router-dom';

const CreatePost = (post) => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const form = useRef();
  const title = useRef();
  const text = useRef();
  const image = useRef();
  const [file, setFile] = useState();
  const [error, setError] = useState();

  // When is Editing

  const handleNewPost = (e) => {
    e.preventDefault();
    setError(null);
    if (file || text.current.innerText) {
      const data = new FormData();
      data.append('profilPicture', user.profilPicture);
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
          post.unSwitchCreatePost();
          text.current.innerText = '';
          form.current.reset();
          setFile(null);
        })
        .catch((err) => {
          console.log(err);
          if (err) {
            if (err.response.data.error)
              setError('Votre envoi ne doit pas dépasser les 250 caractères');
            else {
              navigate('/logout');
            }
          }
        });
    } else {
      setError('*Veuillez écrire un texte ou télécharger une image ');
    }
  };

  const checkImage = () => {
    console.log(form);
    const files = image.current.files[0];
    const newImg = URL.createObjectURL(files);
    setFile(newImg);
  };

  const removeImage = () => {
    URL.revokeObjectURL(file);
    image.current.value = null;
    setFile(null);
  };

  return (
    <div id="createPost" className="newPostContainer flex cl">
      <div className="flex row fs ai-center pseudo-container">
        <img
          className="profilPicture"
          src={user.profilPicture}
          alt={user.pseudo}
        />
        <div>{user.pseudo}</div>
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
          maxLength={45}
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
            <div>Joindre une image</div>
            <label htmlFor="file">
              <i className="fa-regular fa-file-image"></i>
            </label>
          </div>

          <input
            type="file"
            name="file"
            id="file"
            title=""
            accept="image/jpeg, image/png image/jpg"
            style={{ color: 'transparent' }}
            onChange={checkImage}
            className="imgInput"
            ref={image}
          />
          <input type="submit" value="Envoyer" />
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
