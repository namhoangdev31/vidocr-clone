'use client';

export default function Portfolio() {
  const projects = [
    {
      title: 'E-Commerce Platform',
      category: 'Web Development',
      image: 'https://readdy.ai/api/search-image?query=modern%20e-commerce%20website%20interface%20on%20laptop%20screen%20showing%20product%20catalog%20with%20clean%20design%2C%20shopping%20cart%20functionality%2C%20purple%20and%20white%20color%20scheme%2C%20professional%20business%20website%20layout&width=400&height=300&seq=portfolio-ecommerce&orientation=landscape'
    },
    {
      title: 'Mobile Banking App',
      category: 'Mobile App',
      image: 'https://readdy.ai/api/search-image?query=sleek%20mobile%20banking%20app%20interface%20on%20smartphone%20screen%20with%20financial%20dashboard%2C%20transaction%20history%2C%20modern%20UI%20design%20with%20purple%20gradient%20colors%2C%20secure%20banking%20interface&width=400&height=300&seq=portfolio-banking&orientation=landscape'
    },
    {
      title: 'Restaurant Brand Identity',
      category: 'Brand Design',
      image: 'https://readdy.ai/api/search-image?query=elegant%20restaurant%20brand%20identity%20design%20mockup%20with%20logo%2C%20business%20cards%2C%20menu%20design%2C%20sophisticated%20purple%20and%20yellow%20color%20palette%2C%20premium%20dining%20branding%20materials&width=400&height=300&seq=portfolio-restaurant&orientation=landscape'
    },
    {
      title: 'Fitness Tracking App',
      category: 'Mobile App',
      image: 'https://readdy.ai/api/search-image?query=modern%20fitness%20tracking%20mobile%20app%20interface%20showing%20workout%20statistics%2C%20health%20metrics%20dashboard%2C%20vibrant%20purple%20and%20yellow%20UI%20design%2C%20athletic%20lifestyle%20app&width=400&height=300&seq=portfolio-fitness&orientation=landscape'
    },
    {
      title: 'Corporate Website',
      category: 'Web Development',
      image: 'https://readdy.ai/api/search-image?query=professional%20corporate%20website%20homepage%20on%20desktop%20computer%20with%20clean%20business%20layout%2C%20team%20photos%2C%20service%20sections%2C%20modern%20purple%20corporate%20design%20theme&width=400&height=300&seq=portfolio-corporate&orientation=landscape'
    },
    {
      title: 'Fashion Campaign',
      category: 'Photography',
      image: 'https://readdy.ai/api/search-image?query=stylish%20fashion%20photography%20campaign%20with%20model%20wearing%20contemporary%20clothing%2C%20professional%20studio%20lighting%2C%20purple%20and%20yellow%20color%20accents%2C%20high-end%20fashion%20editorial%20style&width=400&height=300&seq=portfolio-fashion&orientation=landscape'
    }
  ];

  return (
    <section id="portfolio" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Portfolio
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Take a look at some of our recent work and see how we've helped businesses transform their digital presence.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <img 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                  <span className="text-sm font-medium text-yellow-400 mb-2 block">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold">
                    {project.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}