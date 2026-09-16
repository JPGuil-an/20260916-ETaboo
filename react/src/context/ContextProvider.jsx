import {createContext, useContext, useEffect, useState} from "react";

const CART_STORAGE_KEY = 'ETABO_CART';

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

const StateContext = createContext({
  token: null,
  userName: null,
  notification: null,
  userID: null,
  userType: null,
  currentUserID: null,
  portal: null,
  cart: [],

  setUserName: () => {},
  setUserType: () => {},
  setToken: () => {},
  setNotification: () => {},
  setUserID:() => {},
  setCurrentUserID: () => {},
  setPortal: () => {},
  addToCart: () => {},
  updateCartQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
})

export const ContextProvider = ({children}) => {
  const [userName, setUserName] = useState(localStorage.getItem('USER_NAME'));
  const [userType, setUserType] = useState(localStorage.getItem('USER_TYPE'));
  const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
  const [currentUserID, setCurrentUserID] = useState(localStorage.getItem('USER_ID'));
  const [portal, _setPortal] = useState(localStorage.getItem('USER_PORTAL'));
  const [notification, _setNotification] = useState('');
  const [cart, setCart] = useState(readCart);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, kilos, available) => {
    let outcome = { ok: true };
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      const nextQuantity = Number(kilos) + Number(existing?.quantity || 0);
      if (nextQuantity > Number(available)) {
        outcome = { ok: false, message: `Only ${available} kg is currently available.` };
        return current;
      }
      const cartItem = {
        id: product.id,
        name: product.product_name,
        price: Number(product.price),
        quantity: nextQuantity,
        farmId: product.farm_belonged,
        farmName: product.farm?.farm_name || 'Local farm',
        image: product.product_picture,
        available: Number(available),
      };
      return existing ? current.map((item) => item.id === product.id ? cartItem : item) : [...current, cartItem];
    });
    return outcome;
  };

  const updateCartQuantity = (id, quantity) => setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, Number(quantity)) } : item));
  const removeFromCart = (id) => setCart((current) => current.filter((item) => item.id !== id));
  const clearCart = () => setCart([]);

  const setPortal = (nextPortal) => {
    _setPortal(nextPortal);
    if (nextPortal) {
      localStorage.setItem('USER_PORTAL', nextPortal);
    } else {
      localStorage.removeItem('USER_PORTAL');
    }
  }

  const setToken = (token) => {
    _setToken(token)
    if (token) {
      localStorage.setItem('ACCESS_TOKEN', token);
    } else {
      localStorage.removeItem('ACCESS_TOKEN');
      localStorage.removeItem('USER_ID');
      localStorage.removeItem('USER_TYPE');
      localStorage.removeItem('USER_NAME');
      localStorage.removeItem('USER_PORTAL');
      _setPortal(null);
    }
  }

  if(currentUserID){
    localStorage.setItem('USER_ID', currentUserID);
    localStorage.setItem('USER_TYPE', userType)
    localStorage.setItem('USER_NAME', userName)
  }

  const setNotification = message => {
    _setNotification(message);

    setTimeout(() => {
      _setNotification('')
    }, 5000)
  }


  return (
    <StateContext.Provider value={{
      userName,
      setUserName,
      userType,
      setUserType,
      token,
      setToken,
      currentUserID,
      setCurrentUserID,
      notification,
      setNotification,
      portal,
      setPortal,
      cart,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
    }}>
      {children}
    </StateContext.Provider>
  );
}

export const useStateContext = () => useContext(StateContext);
