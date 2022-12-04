import React, { useContext, useEffect, useState } from 'react'

import { AiOutlineCamera } from 'react-icons/ai'

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

    const { user, setUser } = useStateContext

    const [file, setFile] = useState()
    
    const [userInfoForm, setUserInfoForm] = useState({
        fullName: '',
        address: '',
        phoneNumber: '',
    })

    const [checkInfo, setCheckInfo] = useState(false)

    function handleChangeImage(e) {
        setFile(URL.createObjectURL(e.target.files[0]))
    }

    function HandleSubmitImage(e) {
        e.preventDefault()
        if(userInfoForm.address != '' && userInfoForm.fullName != '' && userInfoForm.phoneNumber != '') {
            client.patch(user ? user[0]._id : null).set({avatarURL: file, fullName: userInfoForm.fullName, address: userInfoForm.address, phoneNumber: userInfoForm.phoneNumber}).commit().then(() => router.back())
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
        <form className='user-profile-container' onSubmit={HandleSubmitImage}>
            <div className='user-image'>
                <div className='user-image-container'>
                <img src={file ? file : user ? user[0].avatarURL : file } className='user-avatar'/>
                    <label htmlFor='image-upload' className='change-image'>
                        <input
                            type='file'
                            id='image-upload'
                            accept="image/*"
                            onChange={handleChangeImage}
                        />
                        <AiOutlineCamera size={30} className='camera-icon' />
                    </label>
                </div>
                <h3>{user ? user[0].fullName : ''}</h3>
            </div>
            <div className='user-info'>
                {checkInfo && <h3>Please enter your information</h3>}
                <div className='form-profile'>
                    <label htmlFor='name'>Full name</label>
                    <input
                        id='name'
                        type='text'
                        placeholder='Enter your full name'
                        onChange={handleChangeInfo}
                        name='fullName'
                    />
                </div>


                <div className='form-profile'>
                    <label htmlFor='address'>Address</label>
                    <input
                        id='address'
                        type='text'
                        placeholder='Enter your address'
                        onChange={handleChangeInfo}
                        name='address'
                    />
                </div>

                <div className='form-profile'>
                    <label htmlFor='phonenumber'>Phone number</label>
                    <input
                        id='phonenumber'
                        type='text'
                        placeholder='Enter your phone number'
                        onChange={handleChangeInfo}
                        name='phoneNumber'
                    />
                </div>

                <div className='profile-btn-container'>
                    <button type='button' onClick={() => router.back()}>Cancel</button>
                    <button type='submit' >Submit</button>
                </div>

            </div>
        </form>
    )
}

export default edit