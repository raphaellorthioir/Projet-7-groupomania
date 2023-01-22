import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../components/AppContext';
import Navbar from '../components/Navbar';
import Post from '../components/Posts/Post'
import axios from 'axios';

const Home = () => {
  const user = useContext(UserContext)
  const [posts,setPosts]=useState()
  
  useEffect(()=>{

    const fetchPosts = async()=>{
      await axios.get(`${process.env.REACT_APP_API_URL}api/post`,{
        withCredentials:true
      })
      .then((res)=>{
        setPosts(res.data)
        
      })
      .catch((res)=>{
        console.log(res)
      })
    }
    fetchPosts()
  },[])
 
  return(
    <div>
      {user ? 
     (
      <div className='profil-page flex cl space-around'>
        <Navbar/>
        {posts && posts.map((item,index)=>
          <Post post={item} key={index}/>
        )
        }
        
      </div> )
      : ( <Navigate to="/signing"/> )}
      
    </div>
    
  
  );
};

export default Home;
