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
    //cart.change가 true 인 경우에만 데이터를 파이어 베이스에 보낼 수 있도록 하기
    //false인 경우, 로컬에서 변경되지 않았기 때문에 파이어베이스로도 보내지 않는다.
    //로컬에서 장바구니에 추가할 경우에만 파이어 베이스로도 보내는 것
    if (cart.changed) {
      //여기서 sendCartData함수, 즉 사용자 지정 액션 생성자에 cart를 인자로 보내기
      dispatch(sendCartData(cart));
    }
  }, [cart, dispatch]);

  //Notification 렌더링시 cart.changed 조건 추가해줘야 카트에 처음으로 담기 전, 즉 데이터베이스에 아직 아무것도 없는 상태에서 get 에러 안뜸
  return (
    <>
      {cart.changed && notification && (
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
