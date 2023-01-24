import React, { useRef } from 'react';

const CreatePost = () => {
  const Titre = useRef();
  const handleNewPost = async () => {};

  return (
    <div >
      <form
        className="flex cl space-around"
        action=""
        name="postSubmit"
        onSubmit={handleNewPost}
      >
        <label htmlFor="Titre"></label>
        <input
        className='title'
          type="text"
          name="Titre"
          id="Titre"
          placeholder="Titre du Post"
          ref={Titre}
        />
        <label htmlFor="text"></label>
        <textarea
          name="post text"
          id="text"
          cols="30"
          rows="10"
          placeholder="Nouveau post"
        ></textarea>
        <br />
        <div className="flex row ai-center ac-center">
          <label htmlFor="file">Envoyer une image</label>
          <input
            type="file"
            name="file"
            id="file"
            title=""
            accept="image/jpeg, image/png image/jpg"
            style={{ color: 'transparent' }}
          />
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
