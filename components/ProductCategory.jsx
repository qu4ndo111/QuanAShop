import React, { useState } from 'react'
import Link from 'next/link'
import { urlFor } from '../lib/client';
import Product from './Product';


const productCategory = ({ categoryName, products, categoryData }) => {

    const category = categoryData?.find(a => a.name == categoryName)

    return (
        <div className='category-container'>
            <div className='categories'>
                <h2>{categoryName}</h2>
            </div>
            <div className='best-selling-product-container'>
                {products?.slice(0, 5).map((product => {
                    if (product.categories?.includes(categoryName)) {
                        return (
                            <Product key={product._id}
                                product={product}
                            />
                        )
                    }
                }))}
            </div>
            <Link href={`/categories/${category?.slug.current}`}>
                <p className='more-products'>Show more...</p>
            </Link>
        </div>
    )
}


export default productCategory