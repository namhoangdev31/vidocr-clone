
'use client';

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Tải lên video',
      description: 'Chỉ cần kéo thả video của bạn vào hệ thống',
      icon: 'ri-upload-cloud-line',
      color: 'blue'
    },
    {
      number: '2',
      title: 'Chọn ngôn ngữ',
      description: 'Chọn ngôn ngữ đích từ hơn 100 ngôn ngữ có sẵn',
      icon: 'ri-global-line',
      color: 'green'
    },
    {
      number: '3',
      title: 'Nhận kết quả',
      description: 'Video được dịch tự động với chất lượng cao',
      icon: 'ri-download-cloud-line',
      color: 'purple'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Cách thức hoạt động
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Quy trình đơn giản chỉ với 3 bước để có video đa ngôn ngữ chất lượng cao
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gray-200 transform -translate-x-1/2 z-0"></div>
              )}
              
              <div className="relative z-10 text-center">
                <div className={`w-32 h-32 mx-auto mb-6 bg-gradient-to-r ${
                  step.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  step.color === 'green' ? 'from-green-500 to-green-600' :
                  'from-purple-500 to-purple-600'
                } rounded-full flex items-center justify-center shadow-lg`}>
                  <i className={`${step.icon} text-4xl text-white`}></i>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                    step.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    step.color === 'green' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  } font-bold mb-4`}>
                    {step.number}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center mx-auto whitespace-nowrap">
            Bắt đầu dịch ngay
            <i className="ri-arrow-right-line ml-2"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
