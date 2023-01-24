import { useContext } from 'react';
import Likes from './Likes';
import { UserContext } from '../AppContext';

const Post = (props) => {
  const user = useContext(UserContext);
  return (
    <div className="flex cl sb ">
      <div className="flex row ai-center ">
        <img className="profilPicture" src={user.profilPicture} alt="Profil" />
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
  );
};

export default Post;
