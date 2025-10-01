
'use client';

export default function LanguageSupport() {
  const languages = [
    { name: 'Tiếng Việt', flag: '🇻🇳', code: 'VI' },
    { name: 'English', flag: '🇺🇸', code: 'EN' },
    { name: '中文', flag: '🇨🇳', code: 'ZH' },
    { name: '日本語', flag: '🇯🇵', code: 'JA' },
    { name: '한국어', flag: '🇰🇷', code: 'KO' },
    { name: 'Español', flag: '🇪🇸', code: 'ES' },
    { name: 'Français', flag: '🇫🇷', code: 'FR' },
    { name: 'Deutsch', flag: '🇩🇪', code: 'DE' },
    { name: 'Italiano', flag: '🇮🇹', code: 'IT' },
    { name: 'Português', flag: '🇵🇹', code: 'PT' },
    { name: 'Русский', flag: '🇷🇺', code: 'RU' },
    { name: 'العربية', flag: '🇸🇦', code: 'AR' },
    { name: 'हिन्दी', flag: '🇮🇳', code: 'HI' },
    { name: 'Nederlands', flag: '🇳🇱', code: 'NL' },
    { name: 'Svenska', flag: '🇸🇪', code: 'SV' },
    { name: 'Türkçe', flag: '🇹🇷', code: 'TR' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Hỗ trợ hơn 100 ngôn ngữ
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tiếp cận khán giả toàn cầu với khả năng dịch thuật đa ngôn ngữ chính xác cao
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
          {languages.map((language, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-blue-50 transition-colors cursor-pointer">
              <div className="text-2xl mb-2">{language.flag}</div>
              <div className="text-sm font-medium text-gray-900 mb-1">{language.name}</div>
              <div className="text-xs text-gray-500">{language.code}</div>
            </div>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Và còn nhiều ngôn ngữ khác
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Chúng tôi liên tục cập nhật và bổ sung thêm các ngôn ngữ mới để phục vụ nhu cầu đa dạng của khách hàng
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
            Xem danh sách đầy đủ
          </button>
        </div>
      </div>
    </section>
  );
}
