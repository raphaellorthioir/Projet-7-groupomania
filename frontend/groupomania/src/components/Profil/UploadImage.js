import axios from 'axios';
import React, { useState } from 'react';

const UploadImage = (props) => {
  const [file, setFile] = useState(props.profilPicture);

  const handlePicture = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('image', file);
    
    axios
      .put(
        `${process.env.REACT_APP_API_URL}api/auth/uploadImgProfil/${props._id}`,
        data,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setFile(res.data.profilPicture)
   
      })
      .catch((err) => {
        if (err) setFile(null);
        console.log(err);
      });
  };
  return (
    <form action="" onSubmit={handlePicture} className="upload-pic">
      <label htmlFor="file">Changer d'image</label>
      <input
        className="hide-input"
        type="file"
        name="file"
        id="file"
        accept=".jpg, .jpeg, .png"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <br />
      <input type="submit" value="Envoyer image" />
    </form>
  );
};

export default UploadImage;
