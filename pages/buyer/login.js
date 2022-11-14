import React, { useContext, useState } from 'react'
import { client, urlFor } from '../../lib/client'
import { BiShow, BiHide } from 'react-icons/bi'
import Link from 'next/link'
import { Context } from '../../context/StateContext'

import { GoogleLogin } from '@react-oauth/google'



const login = ({ bannerData }) => {

  const { passwordShown, setPasswordShown, wrongAccount, HandleSubmitLogin, loginForm, HandleLogin, responseGoogle, setRegisterSuccess, setUserExist, setWrongAccount } = useContext(Context)

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
    <div className='profile-login'>
      <div className='login-banner'>
        <h1>QuanA Shop</h1>
        <img src={urlFor(bannerData.length && bannerData[0].image)} className='login-banner-image' />
      </div>
      <form className='login-form' onSubmit={HandleSubmitLogin}>
        <p className='title'>Log in to <span>QuanA Shop</span></p>
        {wrongAccount && <p className='login-incorrect'>Incorrect user name or password</p>}
        <label htmlFor='username'>User name:</label>
        <input
          id='username'
          type='text'
          placeholder='Email or Username'
          onChange={HandleLogin}
          value={loginForm.userName}
          name='userName'
          required
        />
        <label htmlFor='password'>Password:</label>
        <div className='password-container'>
          <input
            id='password'
            type={passwordShown ? 'text' : 'password'}
            placeholder='Password'
            onChange={HandleLogin}
            value={loginForm.password}
            name='password'
            required
          />
          {showHidePassword()}
          <p className='forgotPassword'>Forgot your Password?</p>
        </div>
        <button
          type='submit'
          className='login-button'
        >LOG IN</button>
        <p className='register-text'>Need an account? <span onClick={() => {
          setRegisterSuccess(false)
          setUserExist(false)
          setWrongAccount(false)
        }}><Link href={'/buyer/register'}>Register now!</Link></span></p>
        <div className='line' />
        <p className='other-method'>Or login with</p>
        <div className='googleLogin'>
            <GoogleLogin
              onSuccess={responseGoogle}
              onError={responseGoogle}
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

export default login