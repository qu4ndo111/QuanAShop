import React, { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { AiOutlineShoppingCart, AiOutlineSearch, } from 'react-icons/ai'
import { FaUser } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { ImExit } from 'react-icons/im'

import { Cart, SearchItem } from '.'

import { Context } from '../context/StateContext'

import { urlFor } from '../lib/client'

import Switch from "react-switch"

const Navbar = () => {

  const router = useRouter()

  const useStateContext = React.useContext(Context)

  const { showCart, setShowCart, totalQuantities, searchText, HandleChange, toggleSearchBar, openSearch, searching, turnOffSearchItem, searchItems, productFound, setSearching, setLoginForm, setRegisterForm, user, setUser, setUserExist, theme, setTheme, checked, setChecked, darkMode } = useStateContext

  const [openProfileMenus, setOpenProfileMenus] = useState(false)



  function changeClassName() {
    if (openSearch && !searching) {
      return 'search-text-open'
    } else if (!openSearch && !searching) {
      return 'search-text'
    } else if (openSearch && searching) {
      return 'search-text-open-typing'
    } else if (!openSearch && searching) {
      return 'search-text-typing'
    }
  }

  function showItem() {
    if (productFound) {
      return searchItems.map(product => <SearchItem key={product._id} product={product} />)
    } else {
      return <div className='not-found-item'>
        <p>No results were found!</p>
      </div>
    }
  }

  function userAvatar() {
    if (user && user[0]?.avatar) {
      return urlFor(user[0]?.avatar)
    } else if (user && !user[0]?.avatar && user[0]?.avatarURL) {
      return user[0]?.avatarURL
    }
  }

  return (
    <div>
      <div className='navbar-container'>
        <p className={openSearch ? 'logo-close' : 'logo'}>
          <Link href='/'>QuanA Headphones</Link>
        </p>
        <div className={openSearch ? 'navbar-search-open' : 'navbar-search'}>
          <div className='search-items' >
            <input
              type={'text'}
              className={changeClassName()}
              placeholder='Click here to search'
              onChange={HandleChange}
              value={searchText}
              onFocus={() => setSearching(true)}
            />
            {searching && <div className={openSearch ? 'items-open' : 'items'}>
              {
                showItem()
              }
            </div>}

            {
              searching ? <IoClose className='icon' onClick={() => turnOffSearchItem()} /> : <AiOutlineSearch className='icon' />
            }
            {
              searching ? <IoClose className='icon-open' onClick={() => turnOffSearchItem()} /> : <AiOutlineSearch
                className='icon-open'
                onClick={() => toggleSearchBar()}
              />
            }
          </div>
        </div>
        {!user && <div className='profile-container'>
          <div className={openSearch ? 'profile-close' : 'profile'}
            onMouseEnter={() => setOpenProfileMenus(true)}
            onMouseLeave={() => setOpenProfileMenus(false)}
          >
            <FaUser className='user-icon' />
          </div>
          {openProfileMenus && <div className={openSearch ? 'cart-icon-close' : 'profile-menus no-user'}
            onMouseEnter={() => setOpenProfileMenus(true)}
            onMouseLeave={() => setOpenProfileMenus(false)}
          >
            <button type='button' className='profile-menus-btn' onClick={() => {
              router.push('/buyer/login')
              setOpenProfileMenus(false)
              setLoginForm({})
              setRegisterForm({})
            }}><FaUser /> Login</button>
            <label className='profile-menus-btn'>
              <Switch onChange={() => darkMode()} checked={checked} />
              <h4>Dark mode</h4>
            </label>
          </div>}
        </div>
        }
        {
          user && <div className='profile-container'>
            <div className={openSearch ? 'profile-close' : 'profile profile-image'}
              onMouseEnter={() => setOpenProfileMenus(true)}
              onMouseLeave={() => setOpenProfileMenus(false)}
            >
              <img src={userAvatar()} className={openSearch ? 'avatar' : ''} />
            </div>
            {openProfileMenus && <div className={openSearch ? 'cart-icon-close' : 'profile-menus'}
              onMouseEnter={() => setOpenProfileMenus(true)}
              onMouseLeave={() => setOpenProfileMenus(false)}
            >
              <button type='button' className='profile-menus-btn' onClick={() => {
                router.push(`/user/${user[0].userName}`)
                setOpenProfileMenus(false)
              }}><FaUser /> View profile</button>
              <label className='profile-menus-btn'>
                <Switch onChange={() => darkMode()} checked={checked} />
                <h4>Dark mode</h4>
              </label>
              <button type='button' className={openSearch ? 'cart-icon-close' : 'profile-menus-btn'} onClick={() => {
                setUser(null)
                setUserExist(false)
                localStorage.clear()
                setOpenProfileMenus(false)
                router.push('/')
              }}><ImExit /> Log out</button>
            </div>}
          </div>
        }
        <button type='button' className={openSearch ? 'cart-icon-close' : 'cart-icon'}
          onClick={() => setShowCart(true)}>
          <AiOutlineShoppingCart />
          <span className={openSearch ? 'cart-item-qty-close' : 'cart-item-qty'}>{totalQuantities}</span>
        </button>

        {showCart && <Cart />}
      </div>



    </div>
  )
}





export default Navbar

