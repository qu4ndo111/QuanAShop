import React, { useContext, useEffect, useState } from 'react'

import { AiOutlineCamera } from 'react-icons/ai'

import { useRouter } from 'next/router'

import { Context } from '../../../context/StateContext'
import { Spinner } from '../../../components'
import { client, urlFor } from '../../../lib/client'

const edit = () => {

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

    const [loading, setLoading] = useState(false)

    function handleChangeImage(e) {
        const { type, name } = e.target.files[0]

        setLoading(true)

        client.assets.upload('image', e.target.files[0], {
            contentType: type,
            filename: name,
        }).then(document => {
            setFile(document)
            setLoading(false)
        })
    }

    function HandleSubmitInfo(e) {
        e.preventDefault()
        if(user && user[0].fullName || user[0].address || user[0].phoneNumber) {
            if (userInfoForm.address != '' || userInfoForm.fullName != '' || userInfoForm.phoneNumber != '' || file) {
                client.patch(user ? user[0]._id : null).set({
                    avatar: {
                        _type: 'image',
                        asset: {
                            _type: 'reference',
                            _ref: file._id
                        }
                    }
                }).commit()
                
                client.patch(user ? user[0]._id : null).set({ fullName: userInfoForm.fullName === '' ? user[0].fullName : userInfoForm.fullName, address: userInfoForm.address === '' ? user[0].address : userInfoForm.address , phoneNumber: userInfoForm.phoneNumber === '' ? user[0].phoneNumber : userInfoForm.phoneNumber }).commit().then(() => router.back())
            } else {
                setCheckInfo(true)
            }
        } else {
            if (userInfoForm.address != '' && userInfoForm.fullName != '' && userInfoForm.phoneNumber != '') {
                if (file) {
                    client.patch(user ? user[0]._id : null).set({
                        avatar: {
                            _type: 'image',
                            asset: {
                                _type: 'reference',
                                _ref: file._id
                            }
                        }
                    }).commit()
                }
                client.patch(user ? user[0]._id : null).set({ fullName: userInfoForm.fullName, address: userInfoForm.address, phoneNumber: userInfoForm.phoneNumber }).commit().then(() => router.back())
            } else {
                setCheckInfo(true)
            }
        }

    }

    function handleChangeInfo(e) {
        setCheckInfo(false)
        const { name, value } = e.target
        setUserInfoForm(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    function userAvatar() {
        if (user && user[0].avatar && !file?.url) {
            return urlFor(user[0].avatar)
        } else if (user && !user[0].avatar && user[0].avatarURL && !file?.url) {
            return user[0].avatarURL
        } else if (file?.url) {
            return file?.url
        }
    }

    function userName(placeholder) {
        if(user && user[0].fullName) {
            return user[0].fullName
        } else {
            return placeholder
        }
    }

    function userAddress(placeholder) {
        if(user && user[0].address) {
            return user[0].address
        } else {
            return placeholder
        }
    }

    function userPhoneNumber(placeholder) {
        if(user && user[0].phoneNumber) {
            return user[0].phoneNumber
        } else {
            return placeholder
        }
    }

    return (
        <form className='user-profile-container' onSubmit={HandleSubmitInfo}>
            <div className='user-image'>
                <div className='user-image-container'>
                    <img src={userAvatar()} className='user-avatar' />
                    {loading ? (
                        <span className='change-image-loading'>
                            <Spinner className=''/>
                        </span>
                    ) : (
                        <label htmlFor='image-upload' className='change-image'>
                        <input
                            type='file'
                            id='image-upload'
                            accept="image/*"
                            onChange={handleChangeImage}
                        />
                        <AiOutlineCamera size={30} className='camera-icon' />
                    </label>
                    )}
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
                        placeholder={userName('Enter your full name')}
                        onChange={handleChangeInfo}
                        name='fullName'
                    />
                </div>


                <div className='form-profile'>
                    <label htmlFor='address'>Address</label>
                    <input
                        id='address'
                        type='text'
                        placeholder={userAddress('Enter your address')}
                        onChange={handleChangeInfo}
                        name='address'
                    />
                </div>

                <div className='form-profile'>
                    <label htmlFor='phonenumber'>Phone number</label>
                    <input
                        id='phonenumber'
                        type='text'
                        placeholder={userPhoneNumber('Enter your phone number')}
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