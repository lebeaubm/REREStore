import React, { useState, useEffect } from 'react';

const Cart = ({ updateOrder, removeFromCart, lineItems, cart, products }) => {
  const [localLineItems, setLocalLineItems] = useState(lineItems);

  useEffect(() => {
    setLocalLineItems(lineItems);
  }, [lineItems]);

  const calculateTotal = () => {
    return localLineItems
      .filter(lineItem => lineItem.order_id === cart.id)
      .reduce((total, lineItem) => {
        const product = products.find(product => product.id === lineItem.product_id);
        return total + (lineItem.quantity * (product ? product.price : 0));
      }, 0);
  };

  const formatPrice = (priceInCents) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  const hasItemsInCart = localLineItems.some(lineItem => lineItem.order_id === cart.id);

  const addOne = async (lineItem) => {
    try {
      const updatedLineItem = { ...lineItem, quantity: lineItem.quantity + 1 };
      const response = await fetch(`/api/lineItems/${lineItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedLineItem)
      });
      if (response.ok) {
        setLocalLineItems(currentItems =>
          currentItems.map(item =>
            item.id === lineItem.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating line item:', error);
    }
  };

  const removeOne = async (lineItem) => {
    try {
      if (lineItem.quantity > 1) {
        const updatedLineItem = { ...lineItem, quantity: lineItem.quantity - 1 };
        const response = await fetch(`/api/lineItems/${lineItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedLineItem)
        });
        if (response.ok) {
          setLocalLineItems(currentItems =>
            currentItems.map(item =>
              item.id === lineItem.id ? { ...item, quantity: item.quantity - 1 } : item
            )
          );
        }
      } else {
        removeFromCart(lineItem);
      }
    } catch (error) {
      console.error('Error updating line item:', error);
    }
  };

  return (
    <div>
      <h2>Cart</h2>
      {hasItemsInCart ? (
        <ul>
          {localLineItems.filter(lineItem => lineItem.order_id === cart.id).map(lineItem => {
            const product = products.find(product => product.id === lineItem.product_id) || {};
            return (
              <li key={lineItem.id}>
                {product.name} ({lineItem.quantity}) - {formatPrice(lineItem.quantity * product.price)}  
                <button onClick={() => removeOne(lineItem)}>Remove One</button>
                <button onClick={() => addOne(lineItem)}>Add one</button>
                <button onClick={() => removeFromCart(lineItem)}>Remove All</button>

                
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Add some items to your cart.</p>
      )}
      {hasItemsInCart && (
        <div>
          <div>Total: {formatPrice(calculateTotal())}</div>
          <button onClick={() => updateOrder({...cart, is_cart: false })}>
            Create Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
