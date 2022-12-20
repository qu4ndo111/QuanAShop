import React, { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import Navbar from './Navbar'
import Footer from './Footer'
import { Context } from '../context/StateContext'

import MessengerCustomerChat from 'react-messenger-customer-chat'

import { BsFillArrowUpCircleFill } from 'react-icons/bs'

const Layout = ({ children }) => {

  const useStateContext = useContext(Context)

  const { theme } = useStateContext

  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    })

  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }


  return (
    <div className='layout' data-theme={theme}>
      <Head>
        <title>QuanA Store </title>
      </Head>
      <header>
        <Navbar />
      </header>
      <main className='main-container'>
        {children}
        <MessengerCustomerChat
          pageId="100184946255344"
          appId='463297779202858'
        />
        <button className='back-to-top' onClick={scrollToTop}>
          {showButton && <BsFillArrowUpCircleFill size={50} />}
        </button>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default Layout