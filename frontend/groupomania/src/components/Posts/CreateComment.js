import axios from 'axios';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';

const CreateComment = (props) => {
  const postProps = props.postProps.post;
  const userProps = props.postProps.getUser;

  const [errorComment, setError] = useState(null);
  const navigate = useNavigate();
  const comment = useRef();
  const form = useRef();
  const error = useRef();

  const createComment = async (e) => {
    e.preventDefault();
    if (form.current.elements.comment.textLength < 1) {
      setError('*Votre commentaire est vide');
    } else {
      setError(null);
      await axios
        .patch(
          `${process.env.REACT_APP_API_URL}api/post/comment-post/${postProps._id}`,
          { text: comment.current.value },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          form.current.reset();
          props.updateComments(res.data);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            navigate('/error-auth-page');
          }
          if (err.response.status === 500) {
            navigate('/error-page');
          }
        });
    }
  };

  // Modal \\

  return (
    <div className="comments-container">
      <div className="flex cl">
        <div>
          <div className="flex row fs ai-center ac-center pseudo-container">
            <img
              className="profilPicture"
              src={userProps.profilPicture}
              alt="Profil"
            />
            <div className="pseudo">{userProps.pseudo}</div>
          </div>
        </div>

        <div className="form-container ">
          <form ref={form} className="flex row fs" name="commentSubmit">
            <label htmlFor="comment"></label>
            <div className="comment-textarea">
              <TextareaAutosize
                name="comment"
                id="comment"
                placeholder="Commenter..."
                minLength={10}
                maxLength={20}
                minRows={1}
                maxRows={20}
                autoFocus
                ref={comment}
                onChange={() => setError(null)}
              />
            </div>
            <div onClick={createComment} className="input-container">
              <label htmlFor="sendComment" className="icon-label">
                <div className="icon-box">
                  <i className="fa-regular fa-paper-plane"></i>
                </div>
              </label>
              <input
                name="sendComment"
                id="sendComment"
                type="submit"
                value=""
                className="send-comment-btn"
              ></input>
            </div>
          </form>
          {errorComment ? (
            <p className="error" ref={error}>
              {errorComment}
            </p>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
