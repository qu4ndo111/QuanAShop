import React from 'react'
import { Product } from '../../components'
import { client } from '../../lib/client'

import { VscTriangleRight } from 'react-icons/vsc'

import Link from 'next/link'

const category = ({ categoryName, products }) => {

  return (
    <div className='categories-container'>
      <div className='product-all'>
        {products?.map((product => {
          if (product.categories?.includes(categoryName.name)) {
            return (
              <Product key={product._id}
                product={product}
              />
            )
          }
        }))}
      </div>
      <Link href={'/'} legacyBehavior>
        <p className='go-back'>Back to Home page<VscTriangleRight size={10}/></p>
      </Link>
    </div>
  );
}

export const getStaticPaths = async () => {
  const query = `*[_type == "category"] {
      slug {
          current
      }
  }`

  const categories = await client.fetch(query)

  const paths = categories.map((category) => ({
    params: {
      category: category.slug.current
    }
  }))

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps = async ({ params: { category } }) => {
  const query = `*[_type == "category" && slug.current == '${category}'][0]`;
  const productsQuery = '*[_type == "product"]';

  const categoryName = await client.fetch(query);
  const products = await client.fetch(productsQuery)

  return {
    props: { products, categoryName }
  }
}

export default category