import React, { useEffect, useState, useContext } from 'react'

import { client, urlFor } from '../../lib/client'

import { Context } from '../../context/StateContext'

import { useRouter } from 'next/router'
import Link from 'next/link'
import { Spinner } from '../../components'

const userProfile = () => {

  const router = useRouter()

  const useStateContext = useContext(Context)

  const { user, setUser } = useStateContext

  async function getUser() {
    const userInfo = localStorage.getItem('userInfo') !== 'undefined' ? JSON.parse(localStorage.getItem('userInfo')) : localStorage.clear()
    if (userInfo) {
      const query = `*[_type == "user" && userName == '${userInfo ? userInfo.userName : ''}' && password == '${userInfo ? userInfo.password : ''}']`
      const userData = await client.fetch(query)
      setUser(userData)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  function userAvatar() {
    if (user && user[0].avatar) {
      return urlFor(user[0].avatar)
    } else if (user && !user[0].avatar && user[0].avatarURL) {
      return user[0].avatarURL
    }
  }

  return (
    <div>
      {user ? <div className='user-profile-container'>
        <div className='user-image'>
          <div className='user-image-container'>
            <img src={userAvatar()} className='user-avatar' />
          </div>
          <h3>{user ? user[0].fullName : ''}</h3>
          <Link href={user ? `${user[0]?.userName}/security` : '/'}>
            <p className='change-password'>Change password</p>
          </Link>
        </div>
        <div className='user-info'>
          <p className='user-detail'>Full name: <span>{user ? user[0].fullName : ''}</span></p>

          <p className='user-detail'>Address: <span>{user ? user[0].address : ''}</span></p>

          <p className='user-detail'>Phone number: <span>{user ? user[0].phoneNumber : ''}</span></p>

          <button type='button' className='edit-button' onClick={() => router.push(`${user[0].userName}/edit`)}>Edit profile</button>
        </div>
      </div> : (
        <div className='user-not-exist'>
          <Spinner />
        </div>
      )}
    </div>
  )
}

export default userProfile