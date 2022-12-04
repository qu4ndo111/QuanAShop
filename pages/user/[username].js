import React, { useEffect, useState, useContext } from 'react'

import { client } from '../../lib/client'
import { urlFor } from '../../lib/client'

import { Context } from '../../context/StateContext'

import { useRouter } from 'next/router'
import Link from 'next/link'
import { FooterBanner } from '../../components'

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

  if (typeof window !== 'undefined') {
    useEffect(() => {
      getUser()
    }, [])
  }

  return (
    <div className='user-profile-container'>
      <div className='user-image'>
        <div className='user-image-container'>
          <img src={user ? user[0].avatarURL : ''} className='user-avatar' />
        </div>
        <h3>{user ? user[0].fullName : ''}</h3>
      </div>
      <div className='user-info'>
        <p className='user-detail'>Full name: <span>{user ? user[0].fullName : ''}</span></p>

        <p className='user-detail'>Address: <span>{user ? user[0].address : ''}</span></p>

        <p className='user-detail'>Phone number: <span>{user ? user[0].phoneNumber : ''}</span></p>

        <button type='button' className='edit-button' onClick={() => router.push(`${user[0].userName}/edit`)}>Edit profile</button>
      </div>
    </div>
  )
}

export default userProfile