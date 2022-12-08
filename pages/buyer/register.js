import React, { useContext, useEffect } from 'react'
import { client, urlFor } from '../../lib/client'
import { BiShow, BiHide } from 'react-icons/bi'
import Link from 'next/link'
import { Context } from '../../context/StateContext'

import { GoogleLogin } from '@react-oauth/google'

const register = ({ bannerData }) => {

  const { passwordShown, setPasswordShown, notMatchPassword, HandleRegister, registerForm, responseGoogle, HandleSubmitRegister, userExist, setUserExist, setRegisterForm, registerSuccess, setLoginForm, setWrongAccount } = useContext(Context)

  useEffect(() => {
    if (notMatchPassword) {
      setUserExist(false)
    }
  }, [notMatchPassword])


  function showHidePassword() {
    if (passwordShown) {
      return (
        <div className='showPassContainer'>
          <BiShow size={25} className='icon-showhidePassword' onClick={() => setPasswordShown(false)} />
          <p className='showPassword'>Show password</p>
        </div>
      )
    } else {
      return (
        <div className='showPassContainer'>
          <BiHide size={25} className='icon-showhidePassword' onClick={() => setPasswordShown(true)} />
          <p className='showPassword'>Show password</p>
        </div>
      )


    }
  }

  return (
    <div className='profile-login register-form'>
      <div className='login-banner'>
        <h1>QuanA Shop</h1>
        <img src={urlFor(bannerData.length && bannerData[0].image)} className='login-banner-image' />
      </div>
      <form className='login-form' onSubmit={HandleSubmitRegister}>
        <p className='title'>Register <span>QuanA Shop</span> account</p>
        {registerSuccess && <p className='login-incorrect register'>Register successful!</p>}
        <label htmlFor='username'>User name:</label>
        <input
          id='username'
          type='text'
          placeholder='Email or Username'
          onChange={HandleRegister}
          value={registerForm.userName || ''}
          name='userName'
          required
        />
        <label htmlFor='password'>Password:</label>
        <div className='password-container'>
          <input
            id='password'
            type={passwordShown ? 'text' : 'password'}
            placeholder='Password'
            onChange={HandleRegister}
            value={registerForm.password || ''}
            name='password'
            required
          />
        </div>
        <label htmlFor='RepeatPassword'>Repeat password:</label>
        <div className='password-container'>
          <input
            className={notMatchPassword ? 'red' : ''}
            id='RepeatPassword'
            type={passwordShown ? 'text' : 'password'}
            placeholder='Repeat Password'
            onChange={HandleRegister}
            value={registerForm.repeatPassword || ''}
            name='repeatPassword'
            required
          />
        </div>
        {showHidePassword()}
        {notMatchPassword && <p className='login-incorrect'>Password do not match</p>}
        {userExist && <p className='login-incorrect'>User already exist!</p>}
        <p className='register-text'>By creating an account you agree to our <span>Terms & Privacy.</span></p>
        <button
          type='submit'
          className='login-button'
        >REGISTER</button>
        <p className='register-text'>Already have an account? <span onClick={() => {
          setRegisterForm({})
          setLoginForm({})
          setWrongAccount(false)
        }}><Link href={'/buyer/login'}>Sign in</Link></span></p>
        <div className='line' />
        <p className='other-method'>Or login with</p>
        <div className='googleLogin'>
          <GoogleLogin
            onSuccess={responseGoogle}
            onError={responseGoogle}
            cancel_on_tap_outside
          />
        </div>
      </form>
    </div>
  )
}

export const getServerSideProps = async () => {

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  return {
    props: { bannerData }
  }
}

export default register