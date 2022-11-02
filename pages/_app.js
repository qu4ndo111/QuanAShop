import React from 'react'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'
import Layout from '../components/Layout'
import { StateContext } from '../context/StateContext'
import { GoogleOAuthProvider } from '@react-oauth/google';

function MyApp({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId='90563640091-lrsuu7k5hr1t0a6imj9o2ave1qnonstd.apps.googleusercontent.com'>
      <StateContext>
        <Layout>
          <Toaster />
          <Component {...pageProps} />
        </Layout>
      </StateContext>
    </GoogleOAuthProvider>
  )
}

export default MyApp
