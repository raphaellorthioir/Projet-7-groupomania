import { useContext } from 'react';
import Likes from './Likes';
import { UserContext } from '../AppContext';

const Post = (props) => {
  const user = useContext(UserContext);
  console.log(props.post.pseudo);
  return (
    <div className="flex cl space-around post ">
      <div className="flex row ai-center ">
        <img className="profilPicture" src={user.profilPicture} alt="Profil" />
        <div>{props.post.pseudo}</div>
      </div>
      <div>
        {props.post.title}
      </div>
      <div className='text'>
      {props.post.text}
      </div>
      
      <div>
        <br />
        {props.post.imageUrl && <img src={props.post.imageUrl} loading='lazy' alt="Post"></img>}
      </div>
      <div className="flex row sb container">
        <Likes {...props} />
      </div>
    </div>
  );
};

export default Post;
