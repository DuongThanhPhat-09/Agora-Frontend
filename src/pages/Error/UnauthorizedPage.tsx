import React from "react";
import { Link } from "react-router-dom";

const UnauthorizedPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
            <h1 className="text-9xl font-bold text-yellow-500">401</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mt-4">
                Chưa xác thực
            </h2>
            <p className="text-gray-500 mt-2 max-w-md">
                Bạn cần đăng nhập để truy cập trang này.
            </p>
            <Link
                to="/login"
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
            >
                Đăng nhập ngay
            </Link>
        </div>
    );
};

export default UnauthorizedPage;
