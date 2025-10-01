'use client';

export default function HowItWorks() {
  const steps = [
    {
      title: 'Tải lên Video',
      description: 'Tải lên video bạn muốn dịch chỉ bằng cách kéo và thả!',
      image: 'https://cdn-site-assets.veed.io/Select_a_Video_File_fe95259209/Select_a_Video_File_fe95259209.png?width=320&quality=75'
    },
    {
      title: 'AI tự động dịch và lồng tiếng', 
      description: 'AI sẽ dịch văn bản và âm thanh trong Video từ hàng trăm ngôn ngữ sang nhiều ngôn ngữ khác, công việc Dịch, Edit và Lồng tiếng cũng sẽ được tự động hoàn toàn',
      image: 'https://cdn-site-assets.veed.io/Manually_type_auto_transcribe_or_upload_subtitle_file_fa12432027/Manually_type_auto_transcribe_or_upload_subtitle_file_fa12432027.png?width=320&quality=75'
    },
    {
      title: 'Tải xuống',
      description: 'Tải xuống nhanh chóng với nhiều định dạng MP4, SRT, ASS ở độ phân giải Full HD 1080P!',
      image: 'https://cdn-site-assets.veed.io/Edit_and_Download_7808b216d9/Edit_and_Download_7808b216d9.png?width=320&quality=75'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-4 block">
            Toàn cầu hóa nội dung trong thời đại số
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Có ngay Video với một ngôn ngữ hoàn toàn khác chỉ trong 3 bước!
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-white rounded-2xl p-8 shadow-xl mb-6">
                <img 
                  src={step.image}
                  alt={step.title}
                  className="w-full h-48 object-contain mx-auto"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                {step.title}
              </h3>
              <p className="text-blue-100 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}