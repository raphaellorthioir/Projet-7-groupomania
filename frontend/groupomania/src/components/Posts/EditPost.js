import React, { useRef, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../AppContext';

const EditPost = (props) => {
  const postToEdit = props.postToEdit;

  const stopEdit = () => {
    props.stopEdit();
  };
  const navigate = useNavigate();
  const [files, setFiles] = useState(postToEdit.imageUrl);
  const updatedTitle = useRef();
  const updatedText = useRef();
  const updatedImage = useRef();
  const [error, setError] = useState();

  const handleEditPost = (e) => {
    e.preventDefault();
    setError(null);
    if (files || updatedText.current.innerText) {
      const data = new FormData();
      data.append('title', updatedTitle.current.value);
      if (updatedImage.current.files[0]) {
        data.append('image', updatedImage.current.files[0]);
      } else if (!files) {
        data.append('imageUrl', '');
      }
      data.append('text', updatedText.current.innerText);
      axios
        .put(
          `${process.env.REACT_APP_API_URL}api/post/${postToEdit._id}`,
          data,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log(res);
          props.updatePost(res.data);
          props.stopEdit();
        })
        .catch((err) => {
          if (err.response.status === 500)
            setError('Votre post ne doit pas dépasser les 1000 caractères');
          if (err.response.status === 401) {
            navigate('/error-auth-page');
          } else navigate('/error-page');
        });
    } else {
      setError('*Veuillez écrire un texte ou choisir une image ');
    }
  };

  const setImage = () => {
    const files = updatedImage.current.files[0];
    const newImg = URL.createObjectURL(files);
    setFiles(newImg);
  };

  const removeImage = () => {
    setFiles(null);
  };

  return (
    <div className="editPostContainer flex cl">
      <div className="flex row sb ai-center">
        <div className="flex row ai-center">
          <img
            className="profilPicture"
            src={props.postToEdit.profilPicture}
            alt={props.postToEdit.pseudo}
          />
          <div className="pseudo">{props.postToEdit.pseudo}</div>
        </div>

        <div onClick={stopEdit} className="stop-edit flex row ai-center">
          <i class="fa-solid fa-arrow-left"></i>
        </div>
      </div>
      <form
        className="flex cl space-around"
        id="updatePost"
        name="UpdatePostSubmit"
        onSubmit={handleEditPost}
      >
        <label htmlFor="Titre"></label>
        <input
          className="title"
          type="text"
          name="Titre"
          id="Titre"
          placeholder="Titre"
          maxLength={45}
          ref={updatedTitle}
          defaultValue={
            props.isUpdated ? props.updatedData.title : postToEdit.title
          }
          autoFocus
          required
        />
        <div>
          <label htmlFor="text"></label>
          <div className="text">
            <div
              className="textEditable"
              contentEditable="true"
              placeholder="Contenu du post"
              ref={updatedText}
            >
              {postToEdit.text}
            </div>
            {error && <p className="error">{error}</p>}
          </div>
        </div>
        {files && (
          <div className="postImg">
            <div className="delete-img-btn">
              <i className="fa-solid fa-xmark" onClick={removeImage}></i>
            </div>

            <img src={files} alt="" />
          </div>
        )}

        <br />
        <div className="flex row space-around">
          <div className=" send-box flex row space-around ai-center ">
            <div className="flex row ai-center">
              <label htmlFor="EditPostFile">
                <i className="fa-regular fa-file-image"></i>
              </label>
            </div>

            <input
              type="file"
              name="File"
              id="EditPostFile"
              title=""
              accept="image/jpeg, image/png image/jpg"
              style={{ color: 'transparent' }}
              onChange={setImage}
              className="imgInput"
              ref={updatedImage}
            />
            <input className="submit" type="submit" value="Modifier" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
