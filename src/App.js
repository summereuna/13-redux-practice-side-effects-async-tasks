import { useDispatch, useSelector } from "react-redux";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import Notification from "./components/UI/Notification";
import { useEffect } from "react";
import { uiActions } from "./store/ui-slice";

let isInitial = true;

function App() {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.ui.notification);
  const isCartVisible = useSelector((state) => state.ui.isCartVisible);
  const cart = useSelector((state) => state.cart);
  //useSelector는 리덕스에 대한 구독을 설정하기 때문에 리덕스 스토어가 변경될 때 마다 컴포넌트 함수를 재실행시켜 늘 최신 상태를 유지한다.
  //따라서 여기서 가져오는 cart는 최신 버전의 카트다.
  //그렇기 때문에 아래의 useEffect()에서 cart를 디펜던시 배열에 추가하면 cart 상태 변경 시 컴포넌트가 재렌더링 되어 최신의 상태를 가질 수 있다.

  //useEffect()사용하여 카트 상태 변경 사항 관찰하기
  useEffect(() => {
    //http request 보내기
    const sendCartData = async () => {
      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "Sending...",
          message: "Sending cart data",
        })
      );

      const response = await fetch(
        "https://react-http-35c4a-default-rtdb.firebaseio.com/cart",
        {
          //POST는 새 데이터를 데이터 목록에 추가
          //PUT은 새 데이터를 기존 데이터에 오버라이드
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );

      if (!response.ok) {
        throw new Error("Sending cart data filed.");
      }

      //데이터 바로 가져다 쓸 일은 없으니 굳이 안가져와도 됨
      //const responseData = await response.json();

      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Sent cart data successfully!",
        })
      );
    };

    //사이드 이펙트가 처음 실행될 때, 즉 앱 처음 로딩 시 장바구니 데이터 전송 차단하기
    if (isInitial) {
      //이제 첫 렌더링 아니니까 바꿔주고
      isInitial = false;
      return;
    }

    //sendCartData 함수는 promise를 반환하므로 catch를 불러올 수 있음
    //catch()로 여기에서 발생할 수 있는 모든 오류 포착
    sendCartData().catch((error) => {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Sending cart data filed!",
        })
      );
    });

    //리액트 리덕스가 dispatch를 절대 변경되지 않는 함수임을 보장하므로 의존성 배열에 안전하게 추가 가능
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
