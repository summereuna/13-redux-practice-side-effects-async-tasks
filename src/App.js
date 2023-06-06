import { useSelector } from "react-redux";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";

function App() {
  const isCartVisible = useSelector((state) => state.ui.isCartVisible);

  return (
    <Layout>
      {isCartVisible && <Cart />}
      <Products />
    </Layout>
  );
}

export default App;

//  (O) 헤더에 있는 카트 버튼 클릭시 장바구니 보이고 안보이고 토글
//  ( ) ProductItem에 Add to Cart 버튼 클릭시 장바구니에 아이템 추가되게 하기 / 이미 담겨있다면 수량 조절되게
//  ( ) 장바구니에서 +/- 버튼 사용하여 수량 조절하기 / 1에서 - 하면 수량 0되어 아에 장바구니에서 삭제
