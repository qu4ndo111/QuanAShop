import React, { useEffect, useContext } from 'react'
import Link from 'next/link'
import { BsBagCheckFill } from 'react-icons/bs'
import confetti from "canvas-confetti";
import { Context } from '../context/StateContext'

const Success = () => {
    const useStateContext = useContext(Context)
    const { setCartItems, setTotalPrice, setTotalQuantities } = useStateContext

    useEffect(() => {
        setCartItems([])
        setTotalPrice(0)
        setTotalQuantities(0)
        var end = Date.now() + (3 * 1000);

        // go Buckeyes!
        var colors = ['#bb0000', '#ffffff'];
        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }())
    }, [])

    return (
        <div className='success-wrapper'>
            <div className='success'>
                <p className='icon'>
                    <BsBagCheckFill />
                </p>
                <h2>Thank you for your order!</h2>
                <p className='email-msg'>Check your email inbox for the receipt.</p>
                <p className='description'>
                    If you have any questions, please email <a className='email' href='mailto:shopquana@test.com'>
                        shopquana@test.com
                    </a>

                </p>
                <Link href='/' legacyBehavior>
                    <button type='button' width='300px' className='btn'>
                        Continue Shopping
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Success