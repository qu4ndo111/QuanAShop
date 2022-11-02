import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { Context } from '../context/StateContext'
import { urlFor } from '../lib/client'


const searchItem = ({ product: {
    image,
    name,
    slug,
    price,
    details

} }) => {

    const useStateContext = React.useContext(Context)

    const { turnOffSearchItem } = useStateContext
    return (
        <Link href={`/product/${slug.current}`}>
            <div className='search-item-container' onClick={() => {
                turnOffSearchItem()
            }}>
                <div className='image-container' >
                    <img
                        src={urlFor(image && image[0])}
                        className='item-image'
                    />
                </div>
                <div className='info-container'>
                    <div className='info'>
                        <h1 className='item-name'>{name}</h1>
                    </div>
                    <div className='info'>
                        <p className='item-details'>{details}</p>
                    </div>
                    <div className='info'>
                        <p className='item-price'>${price}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}



export default searchItem