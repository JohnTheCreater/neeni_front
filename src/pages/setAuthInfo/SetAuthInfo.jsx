import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { API_URL } from '../../config';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const SetAuthInfo = () => {

    const [password, setPassword] = useState('');
    const [error, setError] = useState("");
    const nav = useNavigate();
  
    const handleSubmit = (e) => {
      e.preventDefault();
      
      const trimmedPassword = password.trim();
      
      if (trimmedPassword === '') {
        setError('Please Enter a valid password!');
      }
      else
      {
        api.put(`/api/admin/updateCredentials`,{password: trimmedPassword})
        .then(result=>{
            
            nav("/");
            console.log(result);
        })
        .catch(err=>setError(err?.response?.message || 'Have a problem!'))
        setError(false);
      }
    };
  
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-10 w-96">
          <h2 className="relative text-3xl mb-6 mx-[20%] w-full"> Reset Password </h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error} </span>
              <button onClick={()=>{setError('')}}>X</button>
              
            </div>
          )}
          <form onSubmit={handleSubmit}>
            
  
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
            <div className="flex w-full items-center justify-center">
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
