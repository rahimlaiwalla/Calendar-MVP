import React, { Component } from 'react';

const Login = (props) => {
  return(
    <div>
      <h1>Login Page</h1>
      <form>
        <label>
          {'Username'}
          <input type="text"></input>
          {'Password'}
          <input type="text"></input>
          <input type="submit" value="Submit"></input>
        </label>
      </form>
    </div>
  )
}

export default Login;