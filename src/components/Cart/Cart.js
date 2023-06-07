import { useSelector } from "react-redux";
import Card from "../UI/Card";
import classes from "./Cart.module.css";
import CartItem from "./CartItem";

const Cart = (props) => {
  const cartItems = useSelector((state) => state.cart.items);

  return (
    <Card className={classes.cart}>
      <h2>Your Shopping Cart</h2>
      <ul>
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={{
              id: item.id,
              quantity: item.quantity,
              price: item.price,
              totalPrice: item.totalPrice,
              title: item.title,
            }}
          />
        ))}
      </ul>
    </Card>
  );
};

export default Cart;
