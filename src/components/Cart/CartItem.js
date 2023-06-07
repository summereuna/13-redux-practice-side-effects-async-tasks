import { useDispatch } from "react-redux";
import classes from "./CartItem.module.css";
import { cartActions } from "../../store/cart-slice";

const CartItem = (props) => {
  const { id, price, quantity, totalPrice, title } = props.item;

  const dispatch = useDispatch();

  const addItemHandler = (event) => {
    event.preventDefault();
    //페이로드로 추가할 아이템 객체 전달
    dispatch(
      cartActions.addItemToCart({ id, price, quantity, totalPrice, title })
    );
  };

  const removeItemHandler = (event) => {
    event.preventDefault();
    //페이로드로 삭제할 아이템의 아이디 전달
    dispatch(cartActions.removeItemFromCart(id));
  };

  return (
    <li className={classes.item} id={id}>
      <header>
        <h3>{title}</h3>
        <div className={classes.price}>
          ${totalPrice.toFixed(2)}
          <span className={classes.itemprice}>(${price.toFixed(2)}/item)</span>
        </div>
      </header>
      <div className={classes.details}>
        <div className={classes.quantity}>
          x <span>{quantity}</span>
        </div>
        <div className={classes.actions}>
          <button onClick={removeItemHandler}>-</button>
          <button onClick={addItemHandler}>+</button>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
