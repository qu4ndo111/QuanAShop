import React, { useEffect } from 'react'

import { Product, FooterBanner, HeroBanner, ProductCategory } from '../components'
import { client } from '../lib/client'
import { Context } from '../context/StateContext'

import { BiLeftArrow, BiRightArrow } from 'react-icons/bi'

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

  // function PrevArrow({ onClick }) {
  //   return (
  //     <div onClick={onClick} className='prev-btn'>
  //       <BiLeftArrow size={30} />
  //     </div>
  //   )
  // }

  // function NextArrow({ onClick }) {
  //   return (
  //     <div onClick={onClick} className='next-btn'>
  //       <BiRightArrow size={30} />
  //     </div>
  //   )
  // }

  const setting = {
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 5,
    dots: true,
    autoplay: true,
    speed: 300,
    autoplaySpeed: 2000,
    // prevArrow: <PrevArrow />,
    // nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1284,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
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
      <Slider className='best-selling-product-container best-products' {...setting}>
        {products?.map((product => <Product key={product._id}
          product={product}
        />))}
      </Slider>
      <ProductCategory products={products} categoryName={'Headphone'} categoryData={categoryData} />
      <ProductCategory products={products} categoryName={'In ear'} categoryData={categoryData} />
      <ProductCategory products={products} categoryName={'Speaker'} categoryData={categoryData} />



      <FooterBanner footerBanner={bannerData && bannerData[0]} />
    </div>
  )
};

export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  const categoryQuery = '*[_type == "category"]'
  const categoryData = await client.fetch(categoryQuery)

  return {
    props: { products, bannerData, categoryData }
  }
}

export default Home
