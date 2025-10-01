export default function ServiceLanguages() {
  const languages = [
    { name: 'Chinese', flag: '🇨🇳', speakers: '1.1B+ speakers', code: 'CN' },
    { name: 'English', flag: '🇺🇸', speakers: '1.5B+ speakers', code: 'US' },
    { name: 'Thai', flag: '🇹🇭', speakers: '69M+ speakers', code: 'TH' },
    { name: 'Vietnamese', flag: '🇻🇳', speakers: '95M+ speakers', code: 'VN' },
    { name: 'Spanish', flag: '🇪🇸', speakers: '500M+ speakers', code: 'ES' },
    { name: 'French', flag: '🇫🇷', speakers: '280M+ speakers', code: 'FR' }
  ];

  const otherLanguages = [
    '🇯🇵 Japanese', '🇰🇷 Korean', '🇩🇪 German', '🇮🇹 Italian',
    '🇵🇹 Portuguese', '🇷🇺 Russian', '🇦🇷 Arabic', '🇮🇳 Hindi',
    '🇧🇷 Brazilian', '🇳🇱 Dutch', '🇸🇪 Swedish', '🇳🇴 Norwegian'
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ngôn ngữ được hỗ trợ</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Giao tiếp với khán giả trên toàn thế giới bằng ngôn ngữ mẹ đẻ của họ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {languages.map((language, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{language.flag}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{language.name}</h3>
                  <p className="text-gray-600 text-sm">{language.speakers}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-medium rounded-full">
                  <i className="ri-check-line w-3 h-3 flex items-center justify-center mr-1 inline-flex"></i>
                  Có sẵn
                </span>
                <div className="text-purple-600 font-semibold text-sm">{language.code}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Cộng thêm 40+ ngôn ngữ khác</h3>
          <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-4xl mx-auto">
            {otherLanguages.map((language, index) => (
              <span key={index} className="px-4 py-2 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-600 rounded-full transition-colors cursor-pointer">
                {language}
              </span>
            ))}
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="ri-global-line w-8 h-8 flex items-center justify-center text-purple-600"></i>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">50+</h4>
                <p className="text-gray-600">Ngôn ngữ hỗ trợ</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="ri-user-voice-line w-8 h-8 flex items-center justify-center text-blue-600"></i>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">200+</h4>
                <p className="text-gray-600">Tùy chọn giọng nói</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="ri-earth-line w-8 h-8 flex items-center justify-center text-orange-600"></i>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">95%+</h4>
                <p className="text-gray-600">Phủ sóng toàn cầu</p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 whitespace-nowrap cursor-pointer">
              <i className="ri-translate-2 w-5 h-5 flex items-center justify-center mr-2 inline-flex"></i>
              Thử tất cả ngôn ngữ
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}