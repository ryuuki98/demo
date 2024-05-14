// JSX
// ㄴ Javascript XML

// 익스포트 디포트 한 걸 임포트
import BookList from "./components/BookList";

// html로 렌더링 될 수 있게끔 도와줌
function App() {
  return (
    <>
    <BookList />
    </>
  );
}

export default App;