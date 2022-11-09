import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Navbar from './Navbar'
import Footer from './Footer'

import MessengerCustomerChat from 'react-messenger-customer-chat'

import { BsFillArrowUpCircleFill } from 'react-icons/bs'

const Layout = ({ children }) => {

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
    <div className='layout'>
      <Head>
        <title>QuanA Store </title>
      </Head>
      <header>
        <Navbar />
      </header>
      <main className='main-container'>
        {children}
        <MessengerCustomerChat
          pageId="100087651338697"
          appId='933001170995233'
          xfbml={true}
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