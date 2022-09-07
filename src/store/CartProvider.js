import { useReducer } from 'react';

import CartContext from './cart-context';

const defaultCartState = {
  items: [],
  totalAmount: 0,
};
// logic for updating cart
const cartReducer = (state, action) => {
  if (action.type === 'ADD') {
    // updating total amount
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;
    // gets index from state.items and checks that id match
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    const existingCartItem = state.items[existingCartItemIndex];
    let updatedItems;
    // if it exists, updating the amount
    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };
      // updating the item
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      // else it stays
      updatedItems = state.items.concat(action.item);
    }

    // returning items and updated total
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }
  if (action.type === 'REMOVE') {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingItem = state.items[existingCartItemIndex];
    const updatedTotalAmount = state.totalAmount - existingItem.price;
    let updatedItems;
    // if item id & action id dont match keep, if they match remove
    if (existingItem.amount === 1) {
        updatedItems = state.items.filter(item => item.id !== action.id);
    } else {
        // reducing the amount if removed
        const updatedItem = { ...existingItem, amount: existingItem.amount - 1};
        updatedItems = [...state.items];
        updatedItems[existingCartItemIndex] = updatedItem;
    }
    return {
        items: updatedItems,
        totalAmount: updatedTotalAmount
    };
  }
  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: 'ADD', item: item });
  };

  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: 'REMOVE', id: id });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
