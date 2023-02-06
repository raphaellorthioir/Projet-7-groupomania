import React from 'react';


const Comments = (props) => {
  console.log(props);
  return (
    // essai import create comments

    <div>
       <div className='flex cl space-around'>
            <div>
                <img src={`${props.comment.profilPicture}`} alt="" />
                <div>{props.comment.pseudo}</div>
            </div>
       </div>

    </div>
  );
};

export default Comments;
