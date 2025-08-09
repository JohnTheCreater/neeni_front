import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { API_URL } from '../../config';
import { useNavigate } from 'react-router-dom';

const SetAuthInfo = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const nav = useNavigate();
  
    const handleSubmit = (e) => {
      e.preventDefault();
      
      
      if (username === '' || password === '') {
        setError(true);
      }
      else
      {
        axios.post(`${API_URL}/api/setAuthInfo`,{username:username,password:password})
        .then(result=>{
            
            nav("/home");
            console.log(result);
        })
        .catch(err=>console.log(err))
        setError(false);
      }
    };
  
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-10 w-96">
          <h2 className="relative text-3xl mb-6">set username & password </h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">Invalid Username or Password </span>
              <button onClick={()=>{setError(false)}}>X</button>
              
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
  
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="btn btn-primary"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
}

export default SetAuthInfo;
