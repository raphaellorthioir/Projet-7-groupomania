import React, { useContext, useRef, useState } from 'react';
import { UserContext } from '../AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const EditPost = (props) => {
  const user = useContext(UserContext);
  console.log(props);
  const navigate = useNavigate();
  // PROPS VALUES \\
  const postToEdit = props.postToEdit;
  console.log(props);
  // PROPS FUNC \\

  /*Stop editing */
  const stopEdit = () => {
    props.stopEdit();
  };

  /*Send new values to Post */

  // States \\
  const [files, setFiles] = useState(postToEdit.imageUrl);

  // Ref \\

  const updatedTitle = useRef();
  const updatedText = useRef();
  const updatedImage = useRef();

  const [error, setError] = useState();

  const handleEditPost = (e) => {
    e.preventDefault();
    console.log(updatedImage);
    setError(null);
    if (files || updatedText.current.innerText) {
      const data = new FormData();
      data.append('profilPicture', user.profilPicture);
      data.append('title', updatedTitle.current.value);
      if (updatedImage.current.files[0]) {
        data.append('image', updatedImage.current.files[0]);
      } else if (!files) {
        data.append('imageUrl', '');
      }
      data.append('text', updatedText.current.innerText);
      data.append('pseudo', user.pseudo);
      axios
        .put(
          `${process.env.REACT_APP_API_URL}api/post/${postToEdit._id}`,
          data,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          props.updatePost(res.data);
          props.stopEdit();
        })
        .catch((err) => {
          console.log(updatedImage);
          console.log(err);
          if (err) {
            if (err.response.data.error)
              setError('Votre envoi ne doit pas dépasser les 250 caractères');
            else {
              // navigate('/logout');
            }
          }
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
    console.log(files);
    setFiles(null);
  };

  return (
    <div className="editPostContainer flex cl">
      <div className="flex row sb ai-center">
        <div className="flex row ai-center">
          <img
            className="profilPicture"
            src={user.profilPicture}
            alt={user.pseudo}
          />
          <div className="pseudo">{user.pseudo}</div>
        </div>

        <div onClick={stopEdit} className="stop-edit flex row ai-center">
          <i class="fa-solid fa-arrow-left"></i>
        </div>
      </div>
      <form
        className="flex cl space-around"
        action=""
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
          <div className=" labelImg flex row space-around ai-center ">
            <div className="flex row ai-center">
              <div>Joindre une image</div>
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
            <input type="submit" value="Modifier" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
