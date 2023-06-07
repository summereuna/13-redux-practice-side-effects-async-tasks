import { createSlice } from "@reduxjs/toolkit";

const initialCartState = {
  items: [],
  totalQuantity: 0, //항목 수량 합
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    addItemToCart(state, action) {
      //있는지 없는지 상관없이 일단 카트 총 수량은 무조건 1씩 증가
      state.totalQuantity++;

      // 페이로드로 추가할 아이템 가져오기
      const newItem = action.payload;

      //이미 존재하는 item인 경우 items 배열의 추가 품목으로 푸쉬하는 대신, 기존 장바구니에 든 해당 item의 quantity수량을 늘리자
      //기존 아이템 배열에서 새로추가할 아이템의 아이디와 같은 아이디를 가진 아이템 찾기
      const existingItem = state.items.find((item) => item.id === newItem.id);

      //기존 배열에 존재 하는 아이템이 아닌 경우
      if (!existingItem) {
        //배열에 추가하기: 리덕스 툴킷 사용하고 있기 때문에 이렇게 해도 됨
        //기존 배열에 푸시하기 새로운 아이템 객체 푸시
        state.items.push({
          id: newItem.id,
          price: newItem.price,
          quantity: 1, //처음 항목 추가하면 수량은 1
          totalPrice: newItem.price, //price도 처음 추가한 거니까 항목의 가격 그대로 유지
          title: newItem.title,
        });
      } else {
        //이미 존재한다면 기존 항목에 대해 바꾸기
        //리덕스 툴킷 이용 중이기 때문에 그냥 기존 항목에 접근하여 기존 항목의 해당 필드를 업데이트 하면 된다.
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      }
    },

    removeItemFromCart(state, action) {
      //있는지 없는지 상관없이 일단 카트 총 수량은 무조건 1씩 감소
      state.totalQuantity--;

      //페이로드로 삭제할 아이템의 아이디 받아옴
      const removeItemId = action.payload;

      const existingItem = state.items.find((item) => item.id === removeItemId);

      if (existingItem.quantity === 1) {
        //카트에 기존 아이템 수량 1이었다면 완전히 삭제
        //filter()로 제거하려는 항목 필터링하여 빼고(!==) 새 배열 반환하기
        state.items = state.items.filter((item) => item.id !== removeItemId);
      } else {
        //수량 하나 줄이기
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      }
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
