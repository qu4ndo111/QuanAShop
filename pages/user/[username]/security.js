import React, { useContext, useEffect, useState } from 'react'

import { BiShow, BiHide } from 'react-icons/bi'

import { useRouter } from 'next/router'

import { Context } from '../../../context/StateContext'

import { client } from '../../../lib/client'

const edit = () => {

    async function getUser() {
        const userInfo = localStorage.getItem('userInfo') !== 'undefined' ? JSON.parse(localStorage.getItem('userInfo')) : localStorage.clear()
        if (userInfo) {
            const query = `*[_type == "user" && userName == '${userInfo ? userInfo.userName : ''}' && password == '${userInfo ? userInfo.password : ''}']`
            const userData = await client.fetch(query)
            setUser(userData)
        }
    }

    if (typeof window !== 'undefined') {
        useEffect(() => {
            getUser()
        }, [])
    }

    const router = useRouter()

    const useStateContext = useContext(Context)

    const [passwordShown, setPasswordShown] = useState(false)

    const { user, setUser } = useStateContext
    
    const [userInfoForm, setUserInfoForm] = useState({
        newPassword: '',
        confirmNewPassword: '',
    })

    const [checkInfo, setCheckInfo] = useState(false)

    function showHidePassword() {
        if (passwordShown) {
          return (
            <div className='showPassContainer change-user-password-container'>
              <BiShow size={25} className='icon-showhidePassword' onClick={() => setPasswordShown(false)} />
              <p className='showPassword'>Show password</p>
            </div>
          )
        } else {
          return (
            <div className='showPassContainer change-user-password-container'>
              <BiHide size={25} className='icon-showhidePassword' onClick={() => setPasswordShown(true)} />
              <p className='showPassword'>Show password</p>
            </div>
          )
          
          
        }
      }

    function HandleSubmitInfo(e) {
        e.preventDefault()
        if(userInfoForm.newPassword === userInfoForm.confirmNewPassword) {
            client.patch(user ? user[0]._id : null).set({password: userInfoForm.newPassword}).commit().then(() => router.back())
        } else {
            setCheckInfo(true)
        }
    }

    function handleChangeInfo(e) {
        setCheckInfo(false)
        const {name, value} = e.target
        setUserInfoForm(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }


    return (
        <form className='user-profile-container' onSubmit={HandleSubmitInfo}>
            <div className='user-info password'>
                {checkInfo && <h3>Password do not match</h3>}
                <div className='form-profile'>
                    <label htmlFor='name'>New password</label>
                    <input
                        id='name'
                        type={passwordShown ? 'text' : 'password'}
                        placeholder='Enter your new password'
                        onChange={handleChangeInfo}
                        name='newPassword'
                    />
                </div>


                <div className='form-profile'>
                    <label htmlFor='address'>Confirm new password</label>
                    <input
                        id='address'
                        type={passwordShown ? 'text' : 'password'}
                        placeholder='Confirm your new password'
                        onChange={handleChangeInfo}
                        name='confirmNewPassword'
                    />
                </div>
                {showHidePassword()}
                <div className='profile-btn-container'>
                    <button type='button' onClick={() => router.back()}>Cancel</button>
                    <button type='submit' >Submit</button>
                </div>

            </div>
        </form>
    )
}

export default edit