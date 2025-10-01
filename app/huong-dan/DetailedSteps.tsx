'use client';

import { useState } from 'react';

export default function DetailedSteps() {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      id: 'upload',
      title: 'Bước 1: Tải video lên',
      description: 'Hướng dẫn chi tiết cách tải video lên hệ thống',
      content: [
        'Nhấn vào nút "Tải video lên" trên trang chủ',
        'Kéo thả file video từ máy tính hoặc nhấn để chọn file',
        'Hoặc dán link video từ YouTube, TikTok, Facebook',
        'Chờ hệ thống tải và phân tích video (1-2 phút)',
        'Xem trước video để đảm bảo chất lượng tốt'
      ],
      tips: [
        'Hỗ trợ định dạng: MP4, AVI, MOV, WMV, FLV',
        'Kích thước tối đa: 2GB cho tài khoản miễn phí',
        'Độ phân giải khuyến nghị: 720p trở lên',
        'Âm thanh rõ ràng sẽ cho kết quả dịch tốt hơn'
      ]
    },
    {
      id: 'settings',
      title: 'Bước 2: Cài đặt dịch thuật',
      description: 'Tùy chỉnh các thông số dịch thuật theo nhu cầu',
      content: [
        'Chọn ngôn ngữ gốc của video (tự động nhận diện)',
        'Chọn ngôn ngữ đích muốn dịch sang',
        'Lựa chọn giọng đọc AI (nam/nữ, giọng địa phương)',
        'Tùy chỉnh kiểu phụ đề (font, màu sắc, vị trí)',
        'Xem trước một đoạn ngắn để kiểm tra'
      ],
      tips: [
        'Chọn giọng phù hợp với nội dung video',
        'Phụ đề màu trắng với viền đen dễ đọc nhất',
        'Kiểm tra tốc độ đọc phụ đề phù hợp không',
        'Có thể điều chỉnh sau khi xem kết quả mẫu'
      ]
    },
    {
      id: 'process',
      title: 'Bước 3: Xử lý và tải về',
      description: 'Theo dõi quá trình xử lý và tải về kết quả',
      content: [
        'Nhấn "Bắt đầu dịch" để khởi động quá trình AI',
        'Theo dõi tiến độ qua thanh progress bar',
        'Nhận thông báo qua email khi hoàn thành',
        'Xem trước video đã dịch trước khi tải về',
        'Tải về file video hoặc chỉ file phụ đề'
      ],
      tips: [
        'Thời gian xử lý: 1-3 phút cho mỗi phút video',
        'Có thể tải về nhiều định dạng khác nhau',
        'File được lưu trữ 30 ngày trên hệ thống',
        'Có thể chỉnh sửa phụ đề sau khi dịch xong'
      ]
    }
  ];
  
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Hướng dẫn chi tiết từng bước</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Làm theo hướng dẫn này để thành thạo việc sử dụng công cụ dịch video AI
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Các bước thực hiện</h3>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(index)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                        activeStep === index
                          ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          activeStep === index
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{step.title}</h4>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:w-2/3">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6">
                  <h3 className="text-2xl font-bold mb-2">{steps[activeStep].title}</h3>
                  <p className="text-purple-100">{steps[activeStep].description}</p>
                </div>
                
                <div className="p-8">
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Các bước thực hiện:</h4>
                    <div className="space-y-3">
                      {steps[activeStep].content.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-purple-600">{index + 1}</span>
                          </div>
                          <p className="text-gray-700">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="ri-lightbulb-line w-5 h-5 flex items-center justify-center text-orange-600"></i>
                      Mẹo và lưu ý quan trọng:
                    </h4>
                    <div className="space-y-2">
                      {steps[activeStep].tips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center text-orange-600 mt-1 flex-shrink-0"></i>
                          <p className="text-gray-700 text-sm">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}