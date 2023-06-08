import { useDispatch, useSelector } from "react-redux";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import Notification from "./components/UI/Notification";
import { useEffect } from "react";
import { fetchCartData, sendCartData } from "./store/cart-actions";

let isInitial = true;

function App() {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.ui.notification);
  const isCartVisible = useSelector((state) => state.ui.isCartVisible);
  const cart = useSelector((state) => state.cart);

  //처음으로 렌더링 될 때 실행하도록 별도로 효과 만들어도 됨
  useEffect(() => {
    dispatch(fetchCartData());
    //가져오기가 완료되면 cart를 교체하기 때문에 컴포넌트가 재렌더링된다.
  }, [dispatch]);

  useEffect(() => {
    //처음 실행될 때 실행
    if (isInitial) {
      isInitial = false;
      return;
    }

    //여기서 sendCartData함수, 즉 사용자 지정 액션 생성자에 cart를 인자로 보내기
    dispatch(sendCartData(cart));
  }, [cart, dispatch]);

  return (
    <>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {isCartVisible && <Cart />}
        <Products />
      </Layout>
    </>
  );
}

export default App;
