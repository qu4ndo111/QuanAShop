import React, { createContext, useContext, useState, useEffect } from "react";
import toast, { Toast } from "react-hot-toast";
import { client, urlFor } from "../lib/client";

import jwtDecode from "jwt-decode";
import { useRouter } from 'next/router';


export const Context = createContext()

export const StateContext = ({ children }) => {

    const router = useRouter()

    const [showCart, setShowCart] = useState(false)
    const [cartItems, setCartItems] = useState([])

    const [totalPrice, setTotalPrice] = useState(0)

    const [totalQuantities, setTotalQuantities] = useState(0)
    const [qty, setQty] = useState(1)

    const [windowWidth, setWindowWidth] = useState()

    const [searchText, setSearchText] = useState('')
    const [openSearch, setOpenSearch] = useState(false)
    const [searching, setSearching] = useState(false)
    const [searchItems, setSearchItems] = useState([])

    const [products, setProducts] = useState()
    const [productFound, setProductFound] = useState(false)

    const [passwordShown, setPasswordShown] = useState(false)
    const [wrongAccount, setWrongAccount] = useState(false)
    const [notMatchPassword, setNotMatchPassword] = useState(false)
    const [userExist, setUserExist] = useState(false)
    const [registerSuccess, setRegisterSuccess] = useState(false)

    const [user, setUser] = useState()
    const [userData, setUserData] = useState()

    const [loginForm, setLoginForm] = useState({
        userName: '',
        password: '',
    })
    const [registerForm, setRegisterForm] = useState({
        userName: '',
        password: '',
        repeatPassword: ''
    })

    const [reviewData, setReviewData] = useState({
        name: '',
        comment: ''
    })

    let foundProduct
    let index


    async function fetchData() {
        const query = '*[_type == "product"]';
        const products = await client.fetch(query);
        setProducts(products)

        const userQuery = '*[_type == "user"]';
        const userDatas = await client.fetch(userQuery);
        setUserData(userDatas);
    }

    useEffect(() => {
        fetchData()
    })

    useEffect(() => {
        function WatchWidth() {
            setWindowWidth(this.window.innerWidth)
        }
        window.addEventListener("resize", WatchWidth)

        if (windowWidth >= 600) setOpenSearch(false)
        if (windowWidth <= 600) setSearching(false)
    }, [windowWidth])

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find(item => item._id === product._id)

        setTotalPrice(prevTotalPrice => prevTotalPrice + product.price * quantity)
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities + quantity)
        if (checkProductInCart) {


            const updatedCartItems = cartItems.map(cartProduct => {
                if (cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })
            setCartItems(updatedCartItems)

        } else {
            product.quantity = quantity

            setCartItems([...cartItems, { ...product }])
        }
        toast.success(`${qty} ${product.name} added to the cart.`)
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id)
        const newCartItems = cartItems.filter((item) => item._id !== product._id)

        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity)
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity)
        setCartItems(newCartItems)
    }

    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id)
        index = cartItems.findIndex((product) => product._id === id)


        if (value === 'inc') {
            setCartItems(cartItems.map((item) => item._id === id ? { ...foundProduct, quantity: foundProduct.quantity + 1 } : item))
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price)
            setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1)
        } else if (value === 'dec') {
            if (foundProduct.quantity > 1) {
                setCartItems(cartItems.map((item) => item._id === id ? { ...foundProduct, quantity: foundProduct.quantity - 1 } : item))
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price)
                setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
            }
        }

    }

    const incQty = () => {
        setQty((prevQty) => prevQty + 1)
    }

    const decQty = () => {
        setQty((prevQty) => {
            if (prevQty - 1 < 1) return 1;

            return prevQty - 1
        })
    }

    function HandleChange(event) {
        const searchWord = event.target.value
        setSearchText(searchWord)
        const newFilter = products?.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()))

        if (searchWord === '') {
            setSearchItems([])
        } else {
            setSearchItems(newFilter)
        }
        if (searchItems.length > 0) {
            setProductFound(true)
        } else if (searchItems.length == 0) {
            setProductFound(false)
        }
    }

    const toggleSearchBar = () => {
        setOpenSearch(prev => !prev)
    }

    const turnOffSearchItem = () => {
        setSearching(false)
        setSearchText("")
    }

    async function login() {
        const query = `*[_type == "user" && userName match '${loginForm.userName}' && password match '${loginForm.password}']`;
        const user = await client.fetch(query)
        setUser(user[0])
        console.log(user)
        if (user.length == 0) {
            setWrongAccount(true)
        } else {
            router.push('/')
        }
    }

    function createAccount() {
        const account = {
            _id: registerForm.userName,
            _type: 'user',
            userName: registerForm.userName,
            password: registerForm.password,
        }

        client.createIfNotExists(account)
    }

    function HandleLogin(event) {
        const { name, value } = event.target
        setWrongAccount(false)
        setLoginForm(prevData => {
            return {
                ...prevData,
                [name]: value
            }
        })
    }

    function HandleRegister(event) {
        const { name, value } = event.target
        setNotMatchPassword(false)
        setUserExist(false)
        setRegisterForm(prevData => {
            return {
                ...prevData,
                [name]: value
            }
        })
    }

    function HandleSubmitLogin(event) {
        event.preventDefault()
        login()

    }

    function HandleSubmitRegister(event) {
        event.preventDefault()
        userData?.map(users => {
            if (users.userName === registerForm.userName) {
                setUserExist(true)
            }
        })
        if (registerForm.password != registerForm.repeatPassword) {
            setNotMatchPassword(true)
        } else if (registerForm.password === registerForm.repeatPassword) {
            createAccount()
        }
        
        const accountName = userData.find((element) => element.userName == registerForm.userName)

        if (registerForm.password === registerForm.repeatPassword && registerForm.userName !== accountName?.userName ) {
            setRegisterSuccess(true)
        }

        
    }

    function HandleChangeComment(event) {
        const { name, value } = event.target
        setReviewData(prevData => {
            return {
                ...prevData,
                [name]: value
            }
        })
    }



    const responseGoogle = (response) => {
        var decoded = jwtDecode(response.credential)
        router.push('/')
    }

    return (
        <Context.Provider
            value={{
                showCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                setShowCart,
                toggleCartItemQuantity,
                onRemove,
                setCartItems,
                setTotalPrice,
                setTotalQuantities,
                HandleChange,
                searchText,
                toggleSearchBar,
                openSearch,
                searching,
                turnOffSearchItem,
                searchItems,
                productFound,
                products,
                setSearching,
                passwordShown,
                setPasswordShown,
                wrongAccount,
                setWrongAccount,
                notMatchPassword,
                setNotMatchPassword,
                userExist,
                setUserExist,
                registerSuccess,
                setRegisterSuccess,
                HandleLogin,
                loginForm,
                setLoginForm,
                HandleSubmitLogin,
                registerForm,
                setRegisterForm,
                HandleRegister,
                HandleSubmitRegister,
                responseGoogle,
                reviewData,
                HandleChangeComment,
                user,
                setUser,
            }}
        >
            {children}
        </Context.Provider>
    )
}

// item.name.toLowerCase().includes(form.searchText.toLowerCase())