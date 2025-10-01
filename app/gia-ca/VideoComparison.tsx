
'use client';

export default function VideoComparison() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            So sánh trước và sau
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Xem sự khác biệt rõ rệt khi sử dụng công cụ dịch thuật AI của chúng tôi
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Before */}
          <div className="space-y-6">
            <div className="text-center">
              <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-medium">
                Trước khi có AI
              </span>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 relative overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=Traditional%20video%20editing%20workspace%20with%20manual%20subtitle%20editing%2C%20cluttered%20interface%2C%20multiple%20windows%20open%2C%20person%20looking%20stressed%20and%20overwhelmed%2C%20outdated%20tools%20and%20software&width=500&height=300&seq=before-ai-1&orientation=landscape"
                  alt="Before AI"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-red-600">
                  <i className="ri-close-circle-line mr-3 text-xl"></i>
                  <span>Tốn hàng giờ dịch thuật thủ công</span>
                </div>
                <div className="flex items-center text-red-600">
                  <i className="ri-close-circle-line mr-3 text-xl"></i>
                  <span>Chi phí thuê dịch giả cao</span>
                </div>
                <div className="flex items-center text-red-600">
                  <i className="ri-close-circle-line mr-3 text-xl"></i>
                  <span>Chất lượng không đồng nhất</span>
                </div>
                <div className="flex items-center text-red-600">
                  <i className="ri-close-circle-line mr-3 text-xl"></i>
                  <span>Quá trình chậm và phức tạp</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* After */}
          <div className="space-y-6">
            <div className="text-center">
              <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full font-medium">
                Sau khi có AI
              </span>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
              <div className="aspect-video bg-white rounded-lg mb-4 relative overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=Modern%20AI-powered%20video%20translation%20interface%2C%20clean%20and%20intuitive%20design%2C%20automated%20workflow%2C%20person%20smiling%20while%20using%20advanced%20technology%2C%20efficient%20and%20streamlined%20process&width=500&height=300&seq=after-ai-1&orientation=landscape"
                  alt="After AI"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-green-600">
                  <i className="ri-check-circle-line mr-3 text-xl"></i>
                  <span>Dịch tự động trong vài phút</span>
                </div>
                <div className="flex items-center text-green-600">
                  <i className="ri-check-circle-line mr-3 text-xl"></i>
                  <span>Tiết kiệm 95% chi phí</span>
                </div>
                <div className="flex items-center text-green-600">
                  <i className="ri-check-circle-line mr-3 text-xl"></i>
                  <span>Chất lượng đồng nhất cao</span>
                </div>
                <div className="flex items-center text-green-600">
                  <i className="ri-check-circle-line mr-3 text-xl"></i>
                  <span>Quy trình đơn giản, nhanh chóng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
