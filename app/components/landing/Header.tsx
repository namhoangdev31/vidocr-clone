'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 font-['Pacifico'] cursor-pointer">
              logo
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
              Trang chủ
            </Link>
            <Link href="/dich-vu" className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm">
              Dịch Vụ
            </Link>
            <Link href="/gia-ca" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
              Giá Cả
            </Link>
            <Link href="/thu-vien" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
              Thư Viện
            </Link>
            <Link href="/lien-he" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
              Liên Hệ
            </Link>
            <Link href="/huong-dan" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
              Hướng Dẫn
            </Link>
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-global-line w-4 h-4 flex items-center justify-center text-blue-600"></i>
              </div>
              <span className="text-gray-700 text-sm">Tiếng Việt</span>
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-arrow-down-s-line w-4 h-4 flex items-center justify-center text-gray-400"></i>
              </div>
            </div>
            <Link href="/dang-nhap" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer flex items-center">
              <span>ĐĂNG KÍ</span>
              <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center ml-2"></i>
            </Link>
          </div>

          <div className="flex items-center space-x-4 lg:hidden">
            <button className="w-6 h-6 flex items-center justify-center cursor-pointer">
              <i className="ri-search-line w-6 h-6 flex items-center justify-center text-gray-700"></i>
            </button>
            <button 
              onClick={toggleMenu}
              className="w-6 h-6 flex items-center justify-center cursor-pointer"
            >
              <i className={`${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'} w-6 h-6 flex items-center justify-center`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Trang chủ
              </Link>
              <Link href="/dich-vu" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Dịch Vụ
              </Link>
              <Link href="/gia-ca" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Giá Cả
              </Link>
              <Link href="/thu-vien" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Thư Viện
              </Link>
              <Link href="/lien-he" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Liên Hệ
              </Link>
              <Link href="/huong-dan" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                Hướng Dẫn
              </Link>
              <div className="pt-4 border-t border-gray-100">
                <Link href="/dang-nhap" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
                  ĐĂNG KÍ
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}