import { createSlice } from "@reduxjs/toolkit";
import { uiActions } from "./ui-slice";

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

//RTK는 리듀서 메소드에 대해 이런 액션 생성자를 자동으로 생성하기 때문에 우리가 직접 작성할 필요가 없지만
//사용자 지정 액션 생성자는 직접 만들어야 한다. 다른 함수를 반환하는 함수를 작성하기 위해서이다.

//지정 액션 생성자 만들기: 슬라이스 갹에 외부에서 새 함수를 생성
//인자로는 카트 데이터가 필요
export const sendCartData = (cart) => {
  //dispatch를 인자로 받아 액션 객체 반환
  //async비동기 함수로 변환
  return async (dispatch) => {
    //첫번째 알람 발송
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending cart data",
      })
    );

    // data fetch
    //if check 전달한다면 잠재적인 오류 처리시 실제로 새 함수를 만들고 여기에 비동기 요청을 보낼 수 있다.
    const sendRequest = async () => {
      const response = await fetch(
        "https://react-http-35c4a-default-rtdb.firebaseio.com/cart.json",
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
    };

    try {
      //sendRequest가 비동기 함수이기 때문에 여기에 호출하고
      //요청을 보내고 기다릴 수 있고
      //프로미스도 반환 받을 수 있음
      await sendRequest();
      //그리고 현재 비동기 외부 함수인 sendCartData 안에 있기 때문에 여기서도 await 사용가능
      //함수가 꽤 많이 중첩되어 있지만 API 가져오는 방법 때문에 여기서는 추가적인 중첩이 필요함

      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Sent cart data successfully!",
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Sending cart data filed!",
        })
      );
    }
  };
};
// 이 코드는 리듀서에서 실행되는 코드가 아니다. 별도의 독립형 JS 함수임 ㅇㅇ~
//이 경우 App.js로 이동하여 디스패치 작업을 캡처하여 디스패치하고 알림을 표시하고 복사하고 cartSlice로 이동하여 여기서 실행함

//이렇게 함수를 생성하고 카트 데이터를 보낼 수 있다.
//이 데이터는 다른 작업을 수행하지 않고 다른 함수인 비동기 함수를 즉시 반환한다.

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
