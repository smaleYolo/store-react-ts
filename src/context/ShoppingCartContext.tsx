import {createContext, ReactNode, useContext, useState} from "react";
import ShoppingCart from "../components/ShoppingCart";
import {useLocalStorage} from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
    children: ReactNode
}

type ShoppingCartContext = {
    openCart: () => void,
    closeCart: () => void,
    getItemQuantity: (id: number) => number,
    increaseCartQuantity: (id: number) => void,
    decreaseCartQuantity: (id: number) => void,
    removeFromCart: (id: number) => void,
    cartQuantity: number,
    cartItems: CartItem[]
}

const ShoppingCartContext = createContext({} as ShoppingCartContext)

type CartItem = {
    id: number,
    quantity: number
}

export function useShoppingCart() {
    return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider( {children}: ShoppingCartProviderProps ) {
    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('shopping-cart',[])
    const [isOpen, setIsOpen] = useState(false)

    const cartQuantity = cartItems.reduce((quantity,item) => quantity + item.quantity ,0)

    const openCart = () => setIsOpen(true)

    const closeCart = () => setIsOpen(false)

    const getItemQuantity = (id: number) => {
        return cartItems.find(item => item.id === id)?.quantity || 0
    }

    const increaseCartQuantity = (id: number) => {
        setCartItems(cartItems => {
            if(cartItems.find(item => item.id === id) == null){
                return [...cartItems, {id, quantity: 1}]
            } else {
                return cartItems.map(item => {
                    if(item.id === id){
                        return {
                            ...item,
                            quantity: item.quantity + 1
                        }
                    } else {
                        return item
                    }
                })
            }
        })
    }

    const decreaseCartQuantity = (id: number) => {
        setCartItems(cartItems => {
            if(cartItems.find(item => item.id === id)?.quantity == 1){
                return cartItems.filter(item => item.id !== id)
            } else {
                return cartItems.map(item => {
                    if(item.id === id){
                        return {
                            ...item,
                            quantity: item.quantity - 1
                        }
                    } else {
                        return item
                    }
                })
            }
        })
    }

    const removeFromCart = (id: number) => {
        setCartItems(cartItems => cartItems.filter(item => item.id !== id))
    }

    return (
        <ShoppingCartContext.Provider value={{
            getItemQuantity,
            increaseCartQuantity,
            decreaseCartQuantity,
            removeFromCart,
            cartItems,
            closeCart,
            openCart,
            cartQuantity,
        }}>
            {children}
            <ShoppingCart isOpen={isOpen}/>
        </ShoppingCartContext.Provider>
    )
}