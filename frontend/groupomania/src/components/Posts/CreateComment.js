import axios from 'axios';
import { useRef} from 'react';
import TextareaAutosize from 'react-textarea-autosize';

const CreateComment = (props) => {
  console.log(props);
  const postProps = props.postProps.post;

  const comment = useRef();

  const createComment = async () => {
    await axios
      .patch(
        `${process.env.REACT_APP_API_URL}api/post/comment-post/${postProps._id}`,
        { text: comment.current.value },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        props.updateComments(res.data.comments);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(props);
  const handleComment = (e) => {
    if (e.key === 'Enter') {
      createComment();
    }
  };

  // Modal \\

  return (
    <div className="comments-container">
      <div className="flex cl ">
        <div className="flex cl  create-comment-container">
          <div className="flex row fs ai-center ac-center pseudo-container">
            <img src={postProps.profilPicture} alt="Profil" />
            <div className="pseudo">{postProps.pseudo}</div>
          </div>
          <div className="form-container">
            <form name="commentSubmit" onSubmit={createComment}>
              <div className="comment-textarea">
                <label htmlFor="comment"></label>
                <TextareaAutosize
                  name="comment"
                  id="comment"
                  placeholder="Commenter..."
                  minRows={1}
                  maxRows={20}
                  autoFocus
                  ref={comment}
                  onKeyDown={handleComment}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
