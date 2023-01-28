import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import { UserContext } from '../AppContext';

const CreatePost = () => {
  const user = useContext(UserContext);

  const title = useRef();
  const text = useRef();
  const image = useRef();
  const [file, setShowImage] = useState();
  const [error, setError] = useState();

  const handleNewPost = (e) => {
    e.preventDefault();
    setError(null);
    if (file || text) {
      const data = new FormData();
      data.append('title', title.current.value);
      data.append('image', image.current.files[0]);
      data.append('text', text.current.innerText);
      data.append('pseudo', user.pseudo);
      axios
        .post(`${process.env.REACT_APP_API_URL}api/post/${user.userId}`, data, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.data.error.errors.text) {
            setError('Votre envoi ne doit pas dépasser les 250 caractères');
          }
        });
    } else {
      setError('Veuillez écrire un texte ou choisir une image ');
    }
  };

  const checkImage = (e) => {
    const file = image.current.files[0];
    const url = URL.createObjectURL(file);
    console.log(url);
    console.log(image);
    setShowImage(url);
  };
  return (
    <>
      <div className="flex row fs ai-center">
        <img
          className="profilPicture"
          src={user.profilPicture}
          alt={user.pseudo}
        />
        <div>{user.pseudo}</div>
      </div>
      <form
        className="flex cl space-around"
        action=""
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
          placeholder="Titre du Post"
          maxLength={50}
          ref={title}
          autoFocus
          required
        />
        <div>
          <label htmlFor="text"></label>

          {/*  <textarea
            name="post text"
            id="text"
            cols="10"
            rows="10"
            maxLength={250}
            form="post"
            spellCheck="true"
            ref={text}
            placeholder="Mon nouveau Post"
          ></textarea>*/}
          <div className="test">
            <div
              className="textEditable"
              contentEditable="true"
              placeholder="Contenu du post"
              ref={text}
            ></div>
            {error && <p className="error">{error}</p>}
          </div>
        </div>
        {image && (
          <div className="postImg">
            <img src={file} alt="" />
          </div>
        )}

        <br />
        <div className="flex row ai-center ac-center">
          <label htmlFor="file"></label>
          <input
            type="file"
            name="file"
            id="file"
            title=""
            accept="image/jpeg, image/png image/jpg"
            style={{ color: 'transparent' }}
            ref={image}
            onChange={checkImage}
          />
        </div>
        <br />
        <input type="submit" value="post" />
      </form>
    </>
  );
};

export default CreatePost;
