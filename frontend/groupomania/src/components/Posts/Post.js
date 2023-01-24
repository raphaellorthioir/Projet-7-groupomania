
import Likes from './Likes';

const Post = (props) => {
    
  return (
    <div className="post-container">
      <div className="flex cl fullHeight sb ">
        <div className="flex row">
          <img src="" alt="" />
          <div>{props.post.pseudo}</div>
        </div>
        <div>
          <p>{props.post.text}</p>
          <br />
          {props.post.imageUrl && <img src={props.imageUrl} alt="Post"></img>}
        </div>
        <div className="flex row sb container">
          <Likes {...props} />
        </div>
      </div>
    </div>
  );
};

export default Post;
