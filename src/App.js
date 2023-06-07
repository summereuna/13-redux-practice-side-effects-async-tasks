import { useSelector } from "react-redux";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { useEffect } from "react";

function App() {
  const isCartVisible = useSelector((state) => state.ui.isCartVisible);
  const cart = useSelector((state) => state.cart);
  //useSelector는 리덕스에 대한 구독을 설정하기 때문에 리덕스 스토어가 변경될 때 마다 컴포넌트 함수를 재실행시켜 늘 최신 상태를 유지한다.
  //따라서 여기서 가져오는 cart는 최신 버전의 카트다.
  //그렇기 때문에 아래의 useEffect()에서 cart를 디펜던시 배열에 추가하면 cart 상태 변경 시 컴포넌트가 재렌더링 되어 최신의 상태를 가질 수 있다.

  //useEffect()사용하여 카트 상태 변경 사항 관찰하기
  useEffect(() => {
    //http request 보내기
    fetch("https://react-http-35c4a-default-rtdb.firebaseio.com/cart.json", {
      //POST는 새 데이터를 데이터 목록에 추가
      //PUT은 새 데이터를 기존 데이터에 오버라이드
      method: "PUT",
      body: JSON.stringify(cart),
    });
  }, [cart]);

  return (
    <Layout>
      {isCartVisible && <Cart />}
      <Products />
    </Layout>
  );
}

export default App;
