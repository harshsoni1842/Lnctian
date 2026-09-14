
import React, { useState, useContext } from 'react'
import './Login.css'
import assets from '../../assets/assets';
import { AuthContext } from '../../context/AuthContext';


const Login = () => {

  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const { login } = useContext(AuthContext)



  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return;
    }
    login(currState === "Sign up" ? 'signup' : 'login', { fullName, email, password, bio });

  }

  return (
    <div className='login'>
      <img className='logo' src={assets.logo_big} alt="" />
      <form onSubmit={onSubmitHandler} className='login-form' >
        <h2>
          {currState}
          {isDataSubmitted && <img className='back-arrow' onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" />}
        </h2>
        {currState === "Sign up" && !isDataSubmitted && (<input onChange={(e) => setFullName(e.target.value)}
          value={fullName} className='form-input' type="text" placeholder='fullName' required />)}


        {!isDataSubmitted && (
          <>
            <input onChange={(e) => setEmail(e.target.value)} value={email}
              className='form-input' type="email" placeholder='Email address' required />
            <input onChange={(e) => setPassword(e.target.value)} value={password}
              className='form-input' type="password" placeholder='password' required />
          </>
        )}
        {currState === "Sign up" && isDataSubmitted && (
          <textarea onChange={(e) => setBio(e.target.value)} value={bio} rows={4} className='custom-input' placeholder='provide a short bio...' required >
          </textarea>
        )}
        <button type='submit'>{currState === "Login"
          ? "Login now"
          : (isDataSubmitted ? "Submit & Register" : "Next Step")}</button>
        <div className='login-term'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className='login-forgot'>
          {
            currState === "Sign up"
              ? <p className='login-toggle'>Already have an account? <span onClick={() => { setCurrState("Login"); setIsDataSubmitted(false) }}>Login here</span></p>
              : <p className='login-toggle'>Create an account <span onClick={() => setCurrState("Sign up")}>Click here</span></p>
          }
          {currState === "Login" ? <p className='login-toggle'>Forgot Password ? <span onClick={() => resetPass(email)}>Click here</span></p> : null}
        </div>
      </form>
    </div>
  )
}

export default Login
