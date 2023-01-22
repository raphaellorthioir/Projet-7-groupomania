import React from 'react';


const Post = (props) => {
   
  
    return (
        <div className='post-container'>
            <div className='flex cl '>
            <div className='flex row'>
                <img src="" alt="" />
                <div>{props.post.pseudo}</div>
            </div>
            <div>
                <p>{props.post.text}</p>
                <br />
                {props.post.imageUrl && <img src={props.imageUrl} alt='Post'></img>}
            </div>
            <div className='flex row'>
                <button>Like</button>
                <button>Dislike</button>
            </div>
        </div>
        </div>
        
    );
};

export default Post;