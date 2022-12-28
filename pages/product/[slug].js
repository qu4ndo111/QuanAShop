import React, { useState, useContext, useEffect } from 'react'

import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar, AiFillCamera } from 'react-icons/ai'

import { urlFor, client } from '../../lib/client'
import Product from '../../components/Product'
import { Context } from '../../context/StateContext'
import Spinner from '../../components/Spinner'

import { nanoid } from 'nanoid'

const ProductDetails = ({ product, products }) => {

    const { image, name, details, price, categories, _id, slug, } = product
    const [loading, setLoading] = useState(false)
    const [userComments, setUserComments] = useState()
    const [index, setIndex] = useState(0)

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

    useEffect(() => {
        setLoading(true)
        const query = `*[_type == "product" && slug.current == '${slug.current}'][0]`
        client.fetch(query).then((data) => {
            setUserComments(data.comment)
            setLoading(false)
        })
    }, [slug.current])

    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "/" + currentdate.getMonth()
        + "/" + currentdate.getDay() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes()

    function userAvatar() {
        if (user && user[0].avatar) {
            return user[0].avatar
        } else if (!user) {
            return null
        }
    }

    function commentAvatar(data) {
        return <img src={data ? urlFor(data) : 'https://cdn.landesa.org/wp-content/uploads/default-user-image.png'} className='user-comment-image' />
    }

    const useStateContext = useContext(Context)

    const { decQty, incQty, qty, onAdd, setShowCart, HandleChangeComment, reviewData, user, setReviewData, setUser } = useStateContext

    const similarProduct = products?.filter(product => product.categories?.includes(categories[0]))

    const handleBuyNow = () => {
        onAdd(product, qty)

        setShowCart(true)
    }

    const setName = () => {
        if (user && user[0].fullName) {
            return user[0].fullName
        } else if (user && !user[0].fullName) {
            return user[0].userName
        } else if (!user) {
            return reviewData.name
        }
    }

    function HandleSubmitComment(event) {
        event.preventDefault()
        setLoading(true)
        client.patch(_id).setIfMissing({ comment: [] }).insert('after', 'comment[-1]', [{ _key: nanoid(), name: setName(), comment: reviewData.comment, datetime: datetime, avatar: userAvatar() }]).commit().then(data => {
           setUserComments(data.comment)
        }).then(() => {
            setReviewData(prev => {
                return {
                    ...prev,
                    comment: ''
                }
            })
            setLoading(false)
        })
    }

    const displayUserName = () => {
        if (user && user[0].fullName) {
            return user[0].fullName
        } else if (user && !user[0].fullName) {
            return user[0].userName
        } else if (!user) {
            return 'Please enter your name'
        }
    }

    const value = () => {
        if (user && user[0].fullName) {
            return user[0].fullName
        } else if (user && !user[0].fullName) {
            return user[0].userName
        } else if (!user) {
            return reviewData.name
        }
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
                            <p>({userComments ? userComments.length : 0})</p>
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
                        placeholder={displayUserName()}
                        onChange={HandleChangeComment}
                        value={value()}
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
                                multiple accept="image/*"
                            />
                            <AiFillCamera size={30} />
                        </label>
                        <button type='submit'>Post comment</button>
                    </div>
                    <div>
                        {!loading ? <div>
                            {userComments?.map(data => (
                                data.name && <div className='feedback' key={data._key}>
                                    {commentAvatar(data.avatar)}
                                    <div className='user-box'>
                                        <h3>{data.name}</h3>
                                        <div className='user-comment-box'>
                                            <p className='user-comment'>{data.comment}</p>
                                            <p className='user-date'>{data.datetime}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div> : (
                            <div className='Loading'>
                                <Spinner />
                            </div>
                        )
                        }
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
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`
    const productQuery = '*[_type == "product"]'

    const product = await client.fetch(query)
    const products = await client.fetch(productQuery)

    return {
        props: { products, product },
        revalidate: 3,
    }
}

export default ProductDetails
