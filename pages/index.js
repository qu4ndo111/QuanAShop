import Link from 'next/link';
import React from 'react'
import { Product, FooterBanner, HeroBanner, ProductCategory } from '../components'
import { client } from '../lib/client'


const Home = ({ products, bannerData, categoryData }) => {

  return (
    <div>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]} />


      <div className='products-heading'>
        <h2>Best selling Products</h2>
        <p>Speakers of many variations</p>
      </div>

      <div className='best-selling-product-container track'>
        {products?.map((product => <Product key={product._id}
          product={product}
        />))}
      </div>
      <ProductCategory products={products} categoryName={'Headphone'} categoryData={categoryData}/>
      <ProductCategory products={products} categoryName={'In ear'} categoryData={categoryData}/>
      <ProductCategory products={products} categoryName={'Speaker'} categoryData={categoryData}/>

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
