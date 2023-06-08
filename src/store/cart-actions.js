import { cartActions } from "./cart-slice";
import { uiActions } from "./ui-slice";

// GET
//즉시 인수로 전달된 함수를 반환한 후 다른 작업 수행
export const fetchCartData = () => {
  //try block이나 await fetchData()를 사용하기 위해 비동기 함수로 바꿔주기
  return async (dispatch) => {
    //그러면 리덕스는 여기에서 반환되는 이 함수가 비동기임을 지원한다.
    const fetchData = async () => {
      const response = await fetch(
        "https://react-http-35c4a-default-rtdb.firebaseio.com/cart.json"
      );

      if (!response.ok) {
        throw new Error("Could not fetch cart data!");
      }

      const data = await response.json();
      //별도의 중첩 함수가 아니기 때문에 여기에 반환
      return data;
    };

    try {
      // firebase에 페치
      const cartData = await fetchData();
      // 이제 가져온 데이터를 스토어에도 넣어야 하는데, 여기서는 파이어베이스에 데이터 넣을 때 PUT 메소드를 사용하여 데이터를 변환하여 데이터 스냅샷을 넣어놨기 때문에
      //가져올 때는 데이터 변환하지 않고 그대로 가져와도 괜찮음

      //replaceCart 리듀서로 프론트엔드 장바구니를 firebase에서 가져온 data로 교체하기
      dispatch(cartActions.replaceCart(cartData));
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Fetching carts data failed!",
        })
      );
    }
  };
};

//
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
          message: "Sending cart data failed!",
        })
      );
    }
  };
};
// 이 코드는 리듀서에서 실행되는 코드가 아니다. 별도의 독립형 JS 함수임 ㅇㅇ~
//이 경우 App.js로 이동하여 디스패치 작업을 캡처하여 디스패치하고 알림을 표시하고 복사하고 cartSlice로 이동하여 여기서 실행함

//이렇게 함수를 생성하고 카트 데이터를 보낼 수 있다.
//이 데이터는 다른 작업을 수행하지 않고 다른 함수인 비동기 함수를 즉시 반환한다.
