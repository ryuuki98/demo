// JSX
// ㄴ Javascript XML

// 익스포트 디포트 한 걸 임포트
import { RouterProvider } from "react-router-dom";
import router from "./router";

// html로 렌더링 될 수 있게끔 도와줌
function App() {
  return (
    <RouterProvider router = {router}></RouterProvider>
  );
}

export default App;