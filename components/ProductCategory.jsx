import React from 'react'
import Link from 'next/link'
import Product from './Product';


const productCategory = ({ categoryName, products, category }) => {

    return (
        <div className='category-container'>
            <div className='categories'>
                <h2>{categoryName}</h2>
            </div>
            <div className='best-selling-product-container'>
                {products?.map((product => {
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