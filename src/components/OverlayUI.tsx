import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ChevronDown, ArrowRight, Zap, Shield, Maximize } from 'lucide-react';
import Scene from './Scene';

gsap.registerPlugin(ScrollTrigger);

export default function OverlayUI() {
  const container = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState('#E31B23');
  
  // Pause videos when they are not in the viewport to save CPU/GPU resources
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0 }
    );

    const videos = document.querySelectorAll('video');
    videos.forEach((video) => observer.observe(video));

    return () => {
      videos.forEach((video) => observer.unobserve(video));
      observer.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    if (!container.current) return;
    
    const ctx = gsap.context(() => {
      // NOTE: Hero text (GTI / Legend Returns) animation was moved to index.css 
      // (pure CSS keyframes) because GSAP JS animations on page load often stutter
      // due to main-thread blocking when Three.js compiles WebGL shaders for the 3D car model.

      // Section 2 Parallax effect for fade-up elements
      gsap.utils.toArray('.fade-up').forEach((el: any) => {
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom', // Triggers exactly when the element enters the bottom of the screen
            toggleActions: 'play none none none'
          }
        });
      });

      // Counters
      const counters = gsap.utils.toArray('.counter');
      counters.forEach((counter: any) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '';
        const decimals = target % 1 !== 0 ? 1 : 0;
        
        gsap.fromTo(counter, 
          { textContent: 0 }, 
          {
            textContent: target,
            duration: 2.5,
            ease: 'power2.out',
            snap: { textContent: 1 / Math.pow(10, decimals) },
            scrollTrigger: {
              trigger: counter,
              start: 'top bottom',
              toggleActions: 'play none none none'
            },
            onUpdate: function() {
              counter.innerHTML = Number(this.targets()[0].textContent).toFixed(decimals) + suffix;
            }
          }
        );
      });
    }, container);
    
    return () => ctx.revert();
  }, []);

  const faqs = [
    { q: "Какова цена Volkswagen Golf GTI в автосалонах?", a: "В настоящее время все автомобили Volkswagen Golf GTI распроданы. Ориентировочная стоимость составляет около 50 90 900 INR (эквивалент). Следите за обновлениями о наличии и ценах на нашем официальном сайте и в социальных сетях." },
    { q: "Какова максимальная скорость Volkswagen Golf GTI и как быстро он разгоняется до 100 км/ч?", a: "Volkswagen Golf GTI разгоняется от 0 до 100 км/ч всего за 5,9 секунды. Захватывающая динамика и непревзойденный контроль на дороге." },
    { q: "Какой двигатель установлен в Volkswagen Golf GTI?", a: "Golf GTI оснащен 2,0-литровым двигателем TSI объемом 1984 куб. см, который работает в паре с 7-ступенчатой коробкой передач DSG для достижения оптимальной производительности." },
    { q: "Каковы габариты Volkswagen Golf GTI?", a: "Длина Golf GTI составляет 4 289 мм, ширина — 1 789 мм, а высота — 1 471 мм." },
    { q: "Какой дорожный просвет (клиренс) у Volkswagen Golf GTI?", a: "Дорожный просвет Volkswagen Golf GTI составляет 136 мм." }
  ];

  return (
    <div id="main-scroll-container" ref={container} className="w-full text-white pointer-events-none relative overflow-x-hidden">
      
      {/* Decorative background typography to fill empty space */}
      <div className="fixed top-[20%] right-[-10%] text-[25vw] font-black text-white/[0.02] tracking-tighter uppercase z-[-1] pointer-events-none">8.5</div>
      <div className="fixed bottom-[10%] left-[-5%] text-[20vw] font-black text-white/[0.015] tracking-tighter uppercase z-[-1] pointer-events-none">GTI</div>
      
      {/* 1. Hero Section */}
      <section className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-[-1] bg-black">
          <video src="/assets/intro_optimized.mp4" autoPlay muted loop playsInline className="object-cover w-full h-full opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#111]"></div>
        </div>
        
        <div className="text-center z-10 flex flex-col items-center w-full px-4">
          <h1 className="hero-title-gti text-[25vw] md:text-[20vw] leading-none font-black text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-red-800 drop-shadow-[0_0_40px_rgba(227,27,35,0.6)] uppercase tracking-tighter will-change-transform">
            GTI
          </h1>
          <h2 className="hero-subtitle text-2xl sm:text-4xl md:text-6xl font-bold uppercase tracking-widest mt-[-2vw] text-gray-100 drop-shadow-xl will-change-transform text-center">
            Легенда Возвращается
          </h2>
        </div>
        
        <div className="absolute bottom-12 left-0 right-0 mx-auto flex flex-col items-center justify-center animate-bounce opacity-80 w-full">
          <span className="text-xs sm:text-sm uppercase tracking-widest mb-3 font-medium text-center">Раскройте мощь</span>
          <ChevronDown size={28} className="text-vw-red" />
        </div>
      </section>

      {/* 2. Exterior & 3D Showcase */}
      <section id="section-2" className="w-full relative py-32 bg-gradient-to-b from-[#111] to-transparent z-20">
        <div className="container mx-auto px-6 relative h-full flex flex-col md:flex-row">
          
          {/* Left Column for UI */}
          <div className="pointer-events-auto flex flex-col justify-center w-full md:w-1/2 z-30 relative">
            <div className="fade-up bg-black/60 p-8 sm:p-10 rounded-3xl backdrop-blur-xl border border-gray-800/50 shadow-2xl relative overflow-hidden">
              {/* Decorative Red Accent */}
              <div className="absolute top-0 left-0 w-2 h-full bg-vw-red"></div>
              
              <h2 className="text-5xl md:text-7xl font-black mb-8 text-white uppercase tracking-tight">Эволюция<br/><span className="text-vw-red">Иконы</span></h2>
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-10">
                Mk 8.5 доводит легендарную формулу хот-хэтча до совершенства. Эстетика, рожденная на треке, теперь правит на улицах.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-red-900/30 p-3 rounded-full text-vw-red"><Zap size={24} /></div>
                  <div>
                    <h4 className="font-bold text-lg">Матричные LED Фары</h4>
                    <p className="text-sm text-gray-400">С интеллектуальным освещением IQ.LIGHT</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-red-900/30 p-3 rounded-full text-vw-red"><Shield size={24} /></div>
                  <div>
                    <h4 className="font-bold text-lg">Решетка Соты</h4>
                    <p className="text-sm text-gray-400">Агрессивный и продуваемый дизайн</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-red-900/30 p-3 rounded-full text-vw-red"><Maximize size={24} /></div>
                  <div>
                    <h4 className="font-bold text-lg">Классическая Красная Линия</h4>
                    <p className="text-sm text-gray-400">Символ подлинного характера GTI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column for 3D model */}
          <div className="w-full md:w-1/2 h-[500px] md:h-auto md:absolute md:right-0 md:top-0 md:bottom-0 flex flex-col items-center justify-center pointer-events-auto z-20">
            <div 
              className="w-full h-[600px] md:h-[800px] cursor-grab active:cursor-grabbing md:-ml-32 mt-10 md:mt-0 relative"
              data-lenis-prevent="true"
              style={{ touchAction: 'none' }}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
               <Scene carColor={selectedColor} />
            </div>
            
            {/* Color Picker Swatches */}
            <div className="absolute top-1/2 right-4 md:right-10 -translate-y-1/2 flex flex-col gap-4 bg-black/40 p-3 rounded-full border border-gray-800 backdrop-blur-md">
              {[
                { hex: '#E31B23', name: 'Kings Red' },
                { hex: '#FFFFFF', name: 'Pure White' },
                { hex: '#111111', name: 'Deep Black' },
                { hex: '#777777', name: 'Moonstone Grey' }
              ].map((color) => (
                <button
                  key={color.hex}
                  onClick={() => setSelectedColor(color.hex)}
                  title={color.name}
                  className={`w-8 h-8 rounded-full border-2 transition-transform duration-300 ${selectedColor === color.hex ? 'scale-125 border-white' : 'border-transparent hover:scale-110'}`}
                  style={{ backgroundColor: color.hex, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}
                />
              ))}
            </div>

            {/* Label Underneath */}
            <div className="absolute bottom-0 md:-bottom-2 left-0 right-0 mx-auto w-max flex items-center gap-3 bg-black/60 px-6 py-3 rounded-full border border-gray-700 backdrop-blur-md shadow-2xl pointer-events-none z-30">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vw-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
              <span className="text-xs sm:text-sm uppercase tracking-widest text-gray-300 font-bold">Интерактивная 3D Модель</span>
            </div>
          </div>
          
        </div>
      </section>

      {/* 3. Interior Video & Photo Gallery */}
      <section id="section-3" className="w-full bg-[#0a0a0a] relative pointer-events-auto mt-[40vh]">
        <div className="relative w-full h-[70vh] overflow-hidden">
          <video src="/assets/interior_optimized.mp4" autoPlay muted loop playsInline className="object-cover w-full h-full opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full container mx-auto px-6">
            <h2 className="text-5xl md:text-8xl font-black uppercase fade-up mb-4 drop-shadow-xl">Digital<br/>Cockpit <span className="text-vw-red">Pro</span></h2>
            <p className="text-xl text-gray-300 max-w-xl fade-up drop-shadow-md">
              Полный контроль в ваших руках. Инновационные дисплеи и премиальные материалы, сохранившие классическую клетку Clark.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-20">
          <div className="flex flex-col gap-8 fade-up max-w-5xl mx-auto">
            <img src="/assets/Снимок экрана 2026-09-14 111830.png" alt="Driving Dynamic" className="rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.01]" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <img src="/assets/Снимок экрана 2026-09-14 111912.png" alt="Front Detail" className="rounded-3xl shadow-xl w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.02]" />
              <img src="/assets/image.webp" alt="Front View" className="rounded-3xl shadow-xl w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.02]" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Engine & Dynamics - Split Layout */}
      <section className="py-32 w-full bg-[#111] pointer-events-auto relative border-y border-[#222]">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
           <img src="/assets/движок.png" className="w-full h-full object-cover blur-sm" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left side: Engine Image */}
            <div className="fade-up relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-600/20 to-red-900/20 blur-2xl rounded-full"></div>
              <img src="/assets/движок.png" alt="TSI Engine" className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative z-10 hover:-translate-y-4 transition-transform duration-700" />
            </div>
            
            {/* Right side: Specs & Title */}
            <div className="flex flex-col justify-center">
              <h2 className="text-6xl md:text-8xl font-black uppercase mb-2 tracking-tight fade-up">Чистая</h2>
              <h2 className="text-6xl md:text-8xl font-black uppercase mb-12 text-vw-red tracking-tight fade-up">Мощь</h2>
              
              <p className="text-xl text-gray-400 mb-12 border-l-2 border-vw-red pl-4 fade-up">
                Сердце GTI — легендарный 2.0L TSI турбированный двигатель (1984 cc), работающий в паре со сверхбыстрой 7-ступенчатой коробкой DSG.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="fade-up bg-black/40 p-6 rounded-2xl border border-gray-800">
                  <div className="text-5xl font-black text-white mb-2 counter" data-target="265" data-suffix=" PS">0</div>
                  <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Мощность</p>
                </div>
                <div className="fade-up bg-black/40 p-6 rounded-2xl border border-gray-800">
                  <div className="text-5xl font-black text-vw-red mb-2 counter" data-target="5.9" data-suffix=" s">0</div>
                  <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Разгон 0-100 км/ч</p>
                </div>
                <div className="fade-up bg-black/40 p-6 rounded-2xl border border-gray-800 sm:col-span-2">
                  <div className="text-5xl font-black text-white mb-2 counter" data-target="370" data-suffix=" Nm">0</div>
                  <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Крутящий момент</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 5. Detailed Technical Specs */}
      <section className="py-24 w-full bg-[#0a0a0a] pointer-events-auto relative">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-20 text-center fade-up tracking-wide">Характеристики</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="fade-up bg-[#111] p-8 rounded-3xl border border-[#222]">
              <h3 className="text-xl font-bold mb-6 text-vw-red uppercase tracking-wider">Двигатель</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex justify-between border-b border-[#222] pb-2"><span>Тип</span> <span className="font-medium text-white">2.0L TSI</span></li>
                <li className="flex justify-between border-b border-[#222] pb-2"><span>Объем</span> <span className="font-medium text-white">1984 cc</span></li>
                <li className="flex justify-between border-b border-[#222] pb-2"><span>Трансмиссия</span> <span className="font-medium text-white">7-Speed DSG</span></li>
              </ul>
            </div>

            <div className="fade-up bg-[#111] p-8 rounded-3xl border border-[#222]">
              <h3 className="text-xl font-bold mb-6 text-vw-red uppercase tracking-wider">Шасси</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex justify-between border-b border-[#222] pb-2"><span>Тормоза</span> <span className="font-medium text-white">Дисковые (в круг)</span></li>
                <li className="flex justify-between border-b border-[#222] pb-2"><span>Шины</span> <span className="font-medium text-white">225/40 R18</span></li>
                <li className="flex justify-between border-b border-[#222] pb-2"><span>Радиус</span> <span className="font-medium text-white">5.45 м</span></li>
              </ul>
            </div>

            <div className="fade-up bg-[#111] p-8 rounded-3xl border border-[#222]">
              <h3 className="text-xl font-bold mb-6 text-vw-red uppercase tracking-wider">Габариты</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex justify-between border-b border-[#222] pb-2"><span>Д/Ш/В (мм)</span> <span className="font-medium text-white">4289 / 1789 / 1471</span></li>
                <li className="flex justify-between border-b border-[#222] pb-2"><span>Клиренс</span> <span className="font-medium text-white">136 мм</span></li>
                <li className="flex justify-between border-b border-[#222] pb-2"><span>Багажник</span> <span className="font-medium text-white">380 л</span></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: New Info (Tech & Safety) */}
            <div className="fade-up flex flex-col justify-center">
              <h3 className="text-3xl font-black mb-8 uppercase tracking-widest text-white">Технологии и Безопасность</h3>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Golf GTI заботится не только о скорости, но и о вашей безопасности. Интеллектуальные ассистенты делают каждую поездку уверенной.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-vw-red mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-white text-xl">IQ.DRIVE Travel Assist</h4>
                    <p className="text-gray-500 text-sm">Полуавтономное вождение: удержание в полосе и адаптивный круиз-контроль на любых скоростях.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-vw-red mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-white text-xl">Адаптивное шасси DCC</h4>
                    <p className="text-gray-500 text-sm">Постоянно регулирует жесткость подвески, адаптируясь под дорожные условия и выбранный режим вождения.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-vw-red mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-white text-xl">Harman Kardon Audio</h4>
                    <p className="text-gray-500 text-sm">Премиальная акустическая система мощностью 480 Вт для идеального звучания.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Colors Image */}
            <div className="fade-up flex justify-center lg:justify-end">
              <div className="bg-[#111] p-8 rounded-3xl border border-[#222] w-full flex flex-col items-center">
                <h3 className="text-lg font-bold mb-6 uppercase tracking-widest text-gray-500">Доступные цвета</h3>
                <img src="/assets/цвета.png" alt="Colors" className="w-[90%] h-auto mix-blend-screen opacity-90 hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-32 w-full bg-[#111] pointer-events-auto">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-4xl font-black text-center mb-16 uppercase fade-up tracking-wider">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group bg-[#1a1a1a] rounded-2xl p-6 cursor-pointer fade-up transition-all hover:bg-[#222] border border-[#222] hover:border-gray-700">
                <summary className="flex justify-between items-center font-medium text-lg list-none">
                  <span className="pr-6">{faq.q}</span>
                  <span className="transition-transform duration-300 group-open:rotate-180 flex-shrink-0 text-vw-red">
                    <ChevronDown size={24} />
                  </span>
                </summary>
                <div className="text-gray-400 mt-6 leading-relaxed border-t border-[#333] pt-6">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Footer / CTA */}
      <footer className="py-40 w-full bg-black relative flex flex-col items-center justify-center pointer-events-auto border-t border-[#333]">
        <div className="text-center z-10 fade-up">
          <h2 className="text-5xl md:text-7xl font-black uppercase mb-12 tracking-tight text-white drop-shadow-2xl">Готовы к дороге?</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => alert('В данный момент форма предзаказа находится в разработке!')}
              className="bg-vw-red text-white px-10 py-5 rounded-full font-bold text-lg uppercase tracking-wider hover:bg-red-700 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(227,27,35,0.4)]"
            >
              Сделать предзаказ <ArrowRight size={24} />
            </button>
            <a 
              href="/assets/golf-gti-brochure.pdf" 
              target="_blank" 
              className="border-2 border-gray-600 text-gray-300 px-10 py-5 rounded-full font-bold text-lg uppercase tracking-wider hover:bg-white hover:text-black hover:border-white transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              Скачать брошюру
            </a>
          </div>
        </div>
        
        <a 
          href="https://portfolio-vecta-web.vercel.app/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="absolute bottom-6 right-6 text-sm text-gray-500 hover:text-white transition-colors duration-300 font-medium"
        >
          создано VectaWeb
        </a>
      </footer>
    </div>
  );
}
