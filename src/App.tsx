// import { Routes } from "react-router-dom";

// function App() {
//   return (
//     <div>
//       <Routes>

//       </Routes>
//     </div>
//   );
// }

// export default App;

import { Routes, Route, Link } from "react-router-dom";
import { useState } from "react";

// Component Trang chủ
function Home() {
  const [count, setCount] = useState(0);
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Trang Chủ</h1>
      <div className="card bg-gray-100 p-4 rounded-lg shadow-md max-w-sm mx-auto">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </div>
    </div>
  );
}

// Component Trang giới thiệu (Ví dụ trang khác)
function About() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-green-600">Trang Giới Thiệu</h1>
      <p className="mt-4 text-gray-600">
        Đây là ví dụ về chuyển trang với React Router.
      </p>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Menu điều hướng */}
      <nav className="bg-gray-800 text-white p-4">
        <ul className="flex justify-center space-x-6">
          <li>
            <Link to="/" className="hover:text-blue-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-blue-300">
              About
            </Link>
          </li>
        </ul>
      </nav>

      {/* Khu vực hiển thị nội dung route */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
