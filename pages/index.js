import React, { useEffect } from 'react'

import { Product, FooterBanner, HeroBanner, ProductCategory } from '../components'
import { client } from '../lib/client'
import { Context } from '../context/StateContext'

import Slider from "react-slick"

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = ({ products, bannerData, categoryData }) => {

  const useStateContext = React.useContext(Context)
  const { setUser } = useStateContext

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

  const setting = {
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 5,
    dots: true,
    autoplay: true,
    speed: 300,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1550,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 1350,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 950,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 620,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  }

  return (
    <div>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]} />
      <div className='products-heading'>
        <h2>Best selling Products</h2>
        <p>Speakers of many variations</p>
      </div>
      <Slider className='best-selling-product-slider best-products' {...setting}>
        {products?.map((product => <Product key={product._id}
          product={product}
        />))}
      </Slider>
      {categoryData.map(category => <ProductCategory products={products} categoryName={category.name} category={category} key={category._id} />)}
      <FooterBanner footerBanner={bannerData && bannerData[0]} />
    </div>
  )
};

export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  const categoryQuery = '*[_type == "category"] | order(_createdAt asc)'
  const categoryData = await client.fetch(categoryQuery)

  return {
    props: { products, bannerData, categoryData }
  }
}

export default Home
