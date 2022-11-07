import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { AiOutlineShoppingCart, AiOutlineSearch, } from 'react-icons/ai'
import {FaUser} from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { Cart, SearchItem } from '.'
import { Context } from '../context/StateContext'



const Navbar = () => {

  const useStateContext = React.useContext(Context)

  const { showCart, setShowCart, totalQuantities, searchText, HandleChange, toggleSearchBar, openSearch, searching, turnOffSearchItem, searchItems, productFound, setSearching } = useStateContext

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
              // onBlur={() => setSearching(false)}
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
        <div className={openSearch ? 'profile-close' : 'profile'}>
            <Link href={'/buyer/login'} passHref>
              <FaUser className='user-icon'/>
            </Link>
        </div>
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

