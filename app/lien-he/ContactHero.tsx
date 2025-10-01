
'use client';

export default function ContactHero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="text-sm text-gray-600">
            <span>Trang Chủ</span>
            <span className="mx-2">›</span>
            <span className="text-blue-600">Liên Hệ</span>
          </nav>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-6">Liên Hệ</h1>
        
        <div className="flex justify-center">
          <img 
            src="https://readdy.ai/api/search-image?query=modern%20contact%20illustration%20with%20people%20connecting%20through%20digital%20devices%2C%20minimalist%20style%2C%20light%20blue%20and%20purple%20gradient%20background%2C%20professional%20business%20communication%20concept&width=300&height=200&seq=contact-hero&orientation=landscape"
            alt="Contact illustration"
            className="w-80 h-48 object-cover rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}
