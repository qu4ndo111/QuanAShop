import React, { useState, useContext, useEffect } from 'react'

import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar, AiFillCamera } from 'react-icons/ai'
import { FaUser } from 'react-icons/fa'

import { urlFor, client } from '../../lib/client'
import Product from '../../components/Product'
import { Context } from '../../context/StateContext'

import { nanoid } from 'nanoid'

const ProductDetails = ({ product, products }) => {
    const { image, name, details, price, categories, _id, comment, slug } = product

    const [index, setIndex] = useState(0)

    const [userReview, setUserReview] = useState([{
        slug: slug,
        comments: [
            {
                name: '',
                comment: ''
            }
        ]
    }])

    const useStateContext = useContext(Context)

    const { decQty, incQty, qty, onAdd, setShowCart, HandleChangeComment, reviewData, } = useStateContext

    const similarProduct = products?.filter(product => product.categories?.includes(categories[0]))

    const handleBuyNow = () => {
        onAdd(product, qty)

        setShowCart(true)
    }

    const userComments = userReview?.filter(comment => comment.slug === slug)


    function HandleSubmitComment(event) {
        event.preventDefault()
        client.patch(_id).setIfMissing({ comment: [] }).insert('after', 'comment[-1]', [{ _key: nanoid(), name: reviewData.name, comment: reviewData.comment }]).commit()
        setUserReview(userReview.map(data => data.slug === slug ? { ...data, comments: [...data.comments, { name: reviewData.name, comment: reviewData.comment }] } : data))
        console.log(userReview)
    }

    return (
        <div>
            <div className='product-detail-container'>
                <div>
                    <div className='product-detail-image'>
                        <img src={urlFor(image && image[index])}
                            className='product-detail-image'
                        />
                    </div>
                    <div className='small-image-container'>
                        {image?.map((item, i) => (
                            <img
                                key={i}
                                src={urlFor(item)}
                                className={i === index ? 'small-image selected-image' : 'small-image'}
                                onMouseEnter={() => setIndex(i)}
                            />
                        ))}
                    </div>
                </div>
                <div className='product-content-container'>
                    <div className='product-detail-desc'>
                        <h1>{name}</h1>
                        <div className='reviews'>
                            <AiFillStar />
                            <AiFillStar />
                            <AiFillStar />
                            <AiFillStar />
                            <AiOutlineStar />
                            <p>(20)</p>
                        </div>

                    </div>
                    <h4>Details: </h4>
                    <p>{details}</p>
                    <p className='price'>${price}</p>
                    <div className='quantity'>
                        <h3>Quantity: </h3>
                        <p className='quantity-desc'>
                            <span className='minus'
                                onClick={decQty}>
                                <AiOutlineMinus />
                            </span>
                            <span className='num'
                            >
                                {qty}
                            </span>
                            <span className='plus'
                                onClick={incQty}>
                                <AiOutlinePlus />
                            </span>
                        </p>
                    </div>
                    <div className='buttons'>
                        <button type='button' className='add-to-cart' onClick={() => onAdd(product, qty)}>
                            Add to Cart
                        </button>
                        <button type='button' className='buy-now' onClick={handleBuyNow}>
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
            <div className='maylike-products-wrapper'>
                <h2>You may also like</h2>
                <div className='marquee'>
                    <div className='maylike-products-container'>
                        {similarProduct.map((item) => (
                            <Product key={item._id}
                                product={item} />
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <form className='user-review-container' onSubmit={HandleSubmitComment}>
                    <h2>Review product</h2>
                    <input
                        type='text'
                        placeholder='Please enter your name'
                        onChange={HandleChangeComment}
                        value={reviewData.name}
                        name='name'
                        required

                    />
                    <textarea
                        placeholder='Enter your comment here'
                        onChange={HandleChangeComment}
                        value={reviewData.comment}
                        name='comment'
                        required
                    />
                    <div className='form-button'>
                        <label htmlFor='image-upload' className='button-upload'>
                            <input
                                type='file'
                                id='image-upload'
                            />
                            <AiFillCamera size={30} />
                        </label>
                        <button type='submit'>Post comment</button>
                    </div>
                    <div>
                        <div>
                            {userComments?.map(data => data.comments.map(data => (
                                data.name && <div className='feedback' key={data._key}>
                                    <FaUser className='user-icon' size={30} />
                                    <div >
                                        <h3>{data.name}</h3>
                                        <p>{data.comment}</p>
                                    </div>
                                </div>
                            )))}
                        </div>
                    </div>
                </form>
            </div>

        </div>
    )
}

export const getStaticPaths = async () => {
    const query = `*[_type == "product"] {
        slug {
            current
        }
    }`

    const products = await client.fetch(query)

    const paths = products.map((product) => ({
        params: {
            slug: product.slug.current
        }
    }))

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps = async ({ params: { slug } }) => {
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
    const productQuery = '*[_type == "product"]'

    const product = await client.fetch(query);
    const products = await client.fetch(productQuery)

    return {
        props: { products, product }
    }
}

export default ProductDetails
