import axios from 'axios';
import { useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import ReactModal from 'react-modal';
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
        props.updateComments();
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
  const [isOpen, setIsOpen] = useState(false);
 const [closeOnClick,setCloseOnClick]= useState(false)
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal =()=>{
    setIsOpen(false)
  }
  const handle=()=>{
    setCloseOnClick(false)
  }
  ReactModal.setAppElement('#app');

  const hello =()=>{
    console.log("hello")
  }

  return (
    <div className="comments-container">
      <div className="flex cl ">
        <div className="flex cl  create-comment-container">
          <div className="flex row fs ai-center ac-center pseudo-container">
            <img src={postProps.profilPicture} alt="Profil" />
            <div className="pseudo">{postProps.pseudo}</div>
          </div>
          <div className="form-container">
            <form name="commentSubmit" onSubmit={handleComment}>
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
            <button onClick={openModal}> open modal</button>
            <ReactModal
              isOpen={isOpen}
              className="modal"
              contentLabel="Voulez vous..."
              overlayClassName="overlay"
              shouldCloseOnOverlayClick={true}
              onRequestClose={closeModal}
              shouldCloseOnEsc={true}
            >
              <div className='div'>
              <button onClick={handle} > console</button>
              </div>
              
            </ReactModal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
