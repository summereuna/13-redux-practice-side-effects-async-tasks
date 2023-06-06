//헤더에 있는 카트 버튼 클릭시 장바구니 보이고 안보이고 토글
//ProductItem에 Add to Cart 버튼 클릭시 장바구니에 아이템 추가되게 하기 / 이미 담겨있다면 수량 조절되게
//장바구니에서 +/- 버튼 사용하여 수량 조절하기 / 1에서 - 하면 수량 0되어 아에 장바구니에서 삭제

import cartSlice from "./cart-slice";
import uiSlice from "./ui-slice";

const { configureStore } = require("@reduxjs/toolkit");

const store = configureStore({
  reducer: {
    cart: cartSlice,
    ui: uiSlice,
  },
});

export default store;
