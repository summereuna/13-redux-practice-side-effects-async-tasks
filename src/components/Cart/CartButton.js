import { useDispatch, useSelector } from "react-redux";
import classes from "./CartButton.module.css";
import { uiActions } from "../../store/ui-slice";

const CartButton = (props) => {
  //배지에 카트 총 수량 표시
  const cartTotalQuantity = useSelector((state) => state.cart.totalQuantity);

  const dispatch = useDispatch();

  const toggleCartHandler = (event) => {
    event.preventDefault();
    dispatch(uiActions.toggleCart());
  };

  return (
    <button className={classes.button} onClick={toggleCartHandler}>
      <span>My Cart</span>
      <span className={classes.badge}>{cartTotalQuantity}</span>
    </button>
  );
};

export default CartButton;
