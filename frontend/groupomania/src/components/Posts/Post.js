import { useContext } from 'react';
import Likes from './Likes';
import { UserContext } from '../AppContext';
import { NavLink } from 'react-router-dom';

const Post = (props) => {
  const user = useContext(UserContext);
  
  const dateString=props.post.updatedAt

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric"}
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  const date=formatDate(dateString)
  
  return (
    <div className="flex cl space-around post ">
      <div  className='flex row sb'>
        <NavLink
          to={{
            pathname: '/profil',
            search: `?user=${props.post.userId}`,
          }}
        >
          <div>
            <div className="flex row ai-center ">
              <img
                className="profilPicture"
                src={props.post.profilPicture}
                alt="Profil"
              />
              <div>{props.post.pseudo}</div>
            </div>
          </div>
        </NavLink>
        {user.userId === props.post.userId && (
          <div>
            <i class="fa-solid fa-pen-to-square"></i>
          </div>
        )}
      </div>
      <div className='date'>`Posté le`{date}</div>
      <div className="title">{props.post.title}</div>
      <div className="text">{props.post.text}</div>

      <div>
        <br />
        {props.post.imageUrl && (
          <img src={props.post.imageUrl} loading="lazy" alt="Post"></img>
        )}
      </div>
      <div className="flex row sb container">
        <Likes {...props} />
      </div>
    </div>
  );
};

export default Post;
