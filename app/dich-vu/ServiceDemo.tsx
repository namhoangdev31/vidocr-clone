
'use client';

import { useState } from 'react';

export default function ServiceDemo() {
  const [activeTab, setActiveTab] = useState('before');

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Xem Demo Trực Tiếp</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá sự khác biệt trước và sau khi sử dụng dịch vụ AI Translation của chúng tôi
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-2 rounded-full flex">
            <button 
              onClick={() => setActiveTab('before')}
              className={`px-8 py-3 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'before' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Trước khi dùng
            </button>
            <button 
              onClick={() => setActiveTab('after')}
              className={`px-8 py-3 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'after' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Sau khi dùng
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl">
              <div className="space-y-4">
                <img 
                  src="https://readdy.ai/api/search-image?query=Frustrated%20person%20working%20manually%20on%20video%20translation%2C%20messy%20workspace%20with%20papers%20and%20notes%2C%20stressed%20expression%2C%20traditional%20video%20editing%20setup%20with%20multiple%20monitors%2C%20time-consuming%20work%20environment&width=600&height=400&seq=before-demo&orientation=landscape" 
                  alt="Before Demo" 
                  className="w-full h-64 object-cover rounded-lg" 
                />
                <div className="text-center">
                  <h3 className="text-white font-semibold mb-2">Phương pháp truyền thống</h3>
                  <div className="flex justify-center space-x-4 text-sm text-red-400">
                    <span>⏰ 8-12 giờ</span>
                    <span>💰 $500-1000</span>
                    <span>😰 Stress cao</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
              Cách cũ
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Tìm dịch thuật viên</h4>
                  <p className="text-gray-600">Mất thời gian tìm người có kinh nghiệm và đáng tin cậy</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Chờ đợi lâu</h4>
                  <p className="text-gray-600">Phải chờ 1-2 tuần để hoàn thành công việc</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Chi phí cao</h4>
                  <p className="text-gray-600">Tốn kém và có thể cần sửa đổi nhiều lần</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Chỉnh sửa phức tạp</h4>
                  <p className="text-gray-600">Khó khăn trong việc chỉnh sửa và cập nhật</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
