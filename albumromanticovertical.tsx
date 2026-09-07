import React, { useState, useEffect, useRef } from "react";

// Estilos globais e injeção de fontes
const GlobalStyles = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700;800&family=Caveat:wght@400;500;600;700&display=swap');
      
      .font-serif { font-family: 'Playfair Display', serif; }
      .font-script { font-family: 'Dancing Script', cursive; }
      .font-typewriter { font-family: 'Courier Prime', monospace; }
      .font-sans { font-family: 'Inter', sans-serif; }
      .font-hand { font-family: 'Caveat', cursive; }

      /* Esconder Scrollbar para imersão total */
      ::-webkit-scrollbar { display: none; }
      * { -ms-overflow-style: none; scrollbar-width: none; }

      :root {
        --dark-red: #000000;
        --cream: #f4ebd8;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(var(--rot, 0deg)); }
        50% { transform: translateY(-6px) rotate(calc(var(--rot, 0deg) + 1deg)); }
      }
      @keyframes drawCircle {
        0% { stroke-dashoffset: 150; opacity: 0; }
        10% { opacity: 1; }
        100% { stroke-dashoffset: 0; opacity: 1; }
      }
      @keyframes pulseGlow {
        0%, 100% { box-shadow: 0 0 10px rgba(255,255,255,0.2); }
        50% { box-shadow: 0 0 20px rgba(255,255,255,0.5); }
      }
      
      .animate-float { animation: float 4s ease-in-out infinite; }
      .draw-circle-anim {
        stroke-dasharray: 150;
        stroke-dashoffset: 150;
        animation: drawCircle 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards infinite;
        animation-delay: 0.5s;
      }

      .bg-noise-cream {
        background-color: var(--cream);
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
      }
      .bg-noise-red {
        background-color: #000000;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
      }
      .bg-leather {
        background-color: #000000;
        background-image: url("https://www.transparenttextures.com/patterns/leather.png");
        background-blend-mode: multiply;
      }

      .stamp-edge {
        background-color: var(--cream);
        mask-image: radial-gradient(circle at 10px 10px, transparent 10px, black 11px);
        mask-size: 20px 20px;
        mask-position: -10px -10px;
        -webkit-mask-image: radial-gradient(circle at 10px 10px, transparent 10px, black 11px);
        -webkit-mask-size: 20px 20px;
        -webkit-mask-position: -10px -10px;
      }

      .polaroid { 
        background: white; 
        padding: 8px 8px 24px 8px; 
        box-shadow: 0 10px 25px rgba(0,0,0,0.2); 
      }
      .polaroid img { width: 100%; height: 100%; object-fit: cover; }
    `}
  </style>
);

type PageProps = {
  children?: React.ReactNode;
  bgClass?: string;
  className?: string;
};

const Page = ({
  children,
  bgClass = "bg-noise-cream",
  className = "",
}: PageProps) => (
  <div
    className={`w-full h-[100dvh] max-w-[450px] mx-auto shrink-0 relative overflow-hidden flex flex-col snap-start shadow-[0_0_20px_rgba(0,0,0,0.1)] ${bgClass} ${className}`}
  >
    {children}
  </div>
);

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [clockAngle, setClockAngle] = useState(135);

  const stripRef = useRef<HTMLDivElement | null>(null);
  const [stripPos, setStripPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseMoveClock = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clockCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    if (clientX !== undefined && clientY !== undefined) {
      const deltaX = clientX - clockCenter.x;
      const deltaY = clientY - clockCenter.y;
      setClockAngle(Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90);
    }
  };

  const handleDragStart = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - stripPos.x, y: clientY - stripPos.y });
  };
  const handleDragMove = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setStripPos({ x: clientX - dragStart.x, y: clientY - dragStart.y });
  };
  const handleDragEnd = () => setIsDragging(false);

  if (!isOpen) {
    return (
      <div
        className="w-screen h-screen font-serif flex items-center justify-center relative overflow-hidden bg-leather cursor-pointer group transition-all duration-[1500ms]"
        onClick={() => setIsOpen(true)}
      >
        <GlobalStyles />
        <div className="absolute top-0 bottom-0 left-0 w-12 md:w-16 bg-black/40 shadow-[10px_0_20px_rgba(0,0,0,0.6)] border-r border-black"></div>
        <div className="z-10 flex flex-col items-center transform transition-transform duration-700 group-hover:scale-105 px-6 text-center">
          <p className="font-script text-[#ebd5a3] text-4xl mb-4 transform -rotate-3 opacity-90">Marina´s
          </p>
          <h1
            className="text-white text-5xl font-sans font-bold mb-16 uppercase tracking-tighter leading-none"
            style={{ textShadow: "0 5px 15px rgba(0,0,0,0.5)" }}
          >
          Birthday</h1>
          <div className="w-28 h-28 rounded-full border-2 border-[#ebd5a3]/60 flex items-center justify-center animate-[pulseGlow_2s_infinite]">
            <span className="text-[#ebd5a3] font-sans text-sm uppercase tracking-widest font-bold">
              Abrir
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-[100dvh] bg-[#111] transition-opacity duration-1000 overflow-y-scroll snap-y snap-mandatory flex flex-col items-center"
      onMouseUp={handleDragEnd}
      onTouchEnd={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <GlobalStyles />

      <Page bgClass="bg-noise-cream">
        <div className="h-[45%] w-full bg-noise-red relative border-b border-black/20 shadow-md">
          <span className="absolute top-8 left-6 text-white/50 font-hand text-3xl rotate-[-20deg]">
            ♡
          </span>
        </div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] z-10 animate-float"
          style={{ ["--rot" as any]: "-3deg" }}
        >
          <div className="polaroid w-56 h-64 transform rotate-[-3deg]">
            <img
              src="src/img/IMG_7776.JPG.jpeg"
            />
          </div>
        </div>
        <div className="h-[55%] w-full flex flex-col items-center justify-end pb-20 relative">
          <span className="absolute bottom-16 right-12 text-black font-hand text-2xl rotate-[15deg] opacity-70">
            ☆
          </span>
          <span className="absolute top-20 left-10 text-black font-hand text-2xl opacity-70">
            x
          </span>
        </div>
      </Page>

      <Page bgClass="bg-noise-cream" className="p-6 justify-between">
        <div className="relative h-[30%]">
          <div className="absolute top-4 left-4 w-40 font-typewriter text-[8px] text-gray-500 leading-tight">
            best friend, best friend, best friend...
            <br />
            best friend, best friend, best friend...
          </div>
          <img
            src="src/img/WhatsApp Image 2026-09-07 at 18.05.25.jpeg"
            className="absolute top-16 left-6 w-14 h-14 rounded-full border-2 border-white shadow-md object-cover"
          />
          <img
            src="src/img/WhatsApp Image 2026-09-07 at 18.05.26.jpeg"
            className="absolute top-24 right-10 w-16 h-16 rounded-full border-2 border-white shadow-md object-cover"
          />
          <img
            src="src/img/WhatsApp Image 2026-09-07 at 18.05.26 (1).jpeg"
            className="absolute bottom-0 left-1/4 w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
          />
        </div>
        <div
          className="flex justify-center items-center h-[25%] relative animate-float"
          style={{ ["--rot" as any]: "-2deg" }}
        >
          <div className="text-8xl drop-shadow-md z-10">🎂</div>
          <div className="absolute w-32 h-12 border-2 border-black/40 rounded-[50%] opacity-30 pointer-events-none transform -rotate-6"></div>
        </div>
        <div className="h-[45%] flex flex-col justify-end pb-6 w-[90%] mx-auto">
          <div className="flex justify-end mb-4 relative">
            <img
              src="src/img/WhatsApp Image 2026-09-07 at 18.08.47.jpeg"
              className="w-32 h-20 object-cover border-4 border-white shadow-lg transform rotate-3"
            />
          </div>
             <div className="bg-white border border-gray-200 w-full p-4 shadow-sm text-xs font-sans text-gray-700">
              <h3 className="text-center font-bold text-black uppercase mb-3 text-sm">September</h3>
              <div className="grid grid-cols-7 gap-1 text-center font-bold border-b border-gray-200 pb-2 mb-2 uppercase text-[9px]">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
              </div>
              <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center font-semibold text-[11px]">
                <div className="text-gray-300">29</div><div className="text-gray-300">30</div><div className="text-gray-300">31</div>
                <div>1</div><div>2</div><div>3</div><div>4</div>
                <div>5</div><div>6</div><div>7</div><div>8</div><div>9</div><div>10</div>
                <div className="relative flex items-center justify-center text-black font-bold text-sm">
                   11
                   <svg className="absolute w-10 h-10 -ml-0.5 pointer-events-none" viewBox="0 0 40 40">
                     <path d="M 20 10 C 20 10 15 5 10 10 C 5 15 10 25 20 30 C 30 25 35 15 30 10 C 25 5 20 10 20 10 Z" fill="none" stroke="#000000" strokeWidth="2" className="draw-circle-anim" />
                   </svg>
                </div>
                <div>12</div><div>13</div><div>14</div><div>15</div><div>16</div><div>17</div><div>18</div>
                <div>19</div><div>20</div><div>21</div><div>22</div><div>23</div><div>24</div><div>25</div>
                <div>26</div><div>27</div><div>28</div><div>29</div><div>30</div>
              </div>
           </div>
        </div>
      </Page>

      <Page bgClass="bg-noise-red" className="items-center justify-center p-6">
        <div className="w-full max-w-[320px] grid grid-cols-2 grid-rows-[120px_100px_120px] gap-3">
          <img
            src="src/img/WhatsApp Image 2026-09-07 at 18.12.48.jpeg"
            className="w-full h-full object-cover border-[3px] border-white shadow-md"
          />
          <img
            src="src/img/WhatsApp Image 2026-09-07 at 18.12.19.jpeg"
            className="w-full h-full object-cover border-[3px] border-white shadow-md"
          />
          <div className="col-span-2 w-full h-full overflow-hidden border-[3px] border-white shadow-md">
            <img
              src="src/img/WhatsApp Image 2026-09-07 at 18.17.31.jpeg"
              className="w-full h-full object-cover"
            />
          </div>
          <img
            src="src/img/WhatsApp Image 2026-09-07 at 18.10.50 (2).jpeg"
            className="w-full h-full object-cover border-[3px] border-white shadow-md"
          />
          <img
            src="src/img/WhatsApp Image 2026-09-07 at 18.10.50 (3).jpeg"
            className="w-full h-full object-cover border-[3px] border-white shadow-md"
          />
        </div>
      </Page>

      <Page bgClass="bg-white" className="p-8 flex flex-col relative">
        <h2 className="font-script text-[3.8rem] leading-none text-center text-gray-800 mt-12 mb-10">
          Feliz Aniversário!
        </h2>
        <div className="font-typewriter text-[12px] text-gray-500 space-y-4 text-justify leading-relaxed w-[86%]">
          <p>
            você é uma das melhores pessoas que eu já conheci e se tornou uma
            das pessoas mais importantes da minha vida.
          </p>
          <p>
            você é uma das melhores pessoas que eu já conheci e se tornou uma
            das pessoas mais importantes da minha vida. obrigado por cada
            conselho, cada risada e cada conversa. admiro muito a pessoa que
            você é, principalmente pela sua preocupação e empatia com os outros.
          </p>
          <p>
            eu te amo mais que tudo e sou muito grato por ter alguém como você
            ao meu lado, alguém em quem posso confiar pra tudo e com quem tenho
            uma relação de lealdade e respeito, sempre recíproca.
          </p>
        </div>
        <div className="mt-12 font-script text-[2.8rem] text-gray-800 ml-4">
          eu amo você!
        </div>
        <div className="absolute bottom-10 right-6 flex">
          <img
            src="src/img/WhatsApp Image 2026-09-07 at 18.19.50 (1).jpeg"
            className="w-24 h-32 object-cover border-[4px] border-white shadow-xl transform -rotate-12 translate-x-6 z-10"
          />
          <img
            src="src/img/WhatsApp Image 2026-09-07 at 18.19.50 (2).jpeg"
            className="w-28 h-20 object-cover border-[4px] border-white shadow-xl transform rotate-6 self-end"
          />
        </div>
      </Page>

      <Page
        bgClass="bg-noise-red"
        className="p-10 flex flex-col justify-center text-white"
      >
        <h1 className="font-sans font-bold text-6xl leading-none tracking-tight">
          Feliz
        </h1>
        <h1 className="font-script text-[4.2rem] leading-none -mt-4 mb-10 drop-shadow-md">
          Aniversário!
        </h1>
        <div className="flex items-end gap-3 mt-4">
          <span className="font-sans font-extrabold text-[8rem] leading-none tracking-tighter">
            11
          </span>
          <div className="flex flex-col pb-4">
            <span className="font-sans text-3xl font-bold mb-2">th</span>
            <p className="font-sans text-[13px] w-36 text-justify leading-tight opacity-90">
              Obrigado por ser meu lugar feliz e por fazer cada dia parecer tão
              especial. Tenho muita sorte de ter você ao meu lado.
            </p>
          </div>
        </div>
      </Page>

      <Page
        bgClass="bg-noise-cream"
        className="p-8 flex flex-col items-center relative"
      >
        <h2 className="font-sans font-bold text-black text-xs tracking-widest text-center mt-8 w-full leading-relaxed">
          EU DESEJO AS MELHORES COISAS
          <br />
          <span className="text-xl tracking-[0.2em] mt-1 block">
            PRA VOCÊ, MUNDO
          </span>
        </h2>
        <div className="w-48 h-[60%] bg-black mt-12 relative flex flex-col items-center justify-center shadow-inner">
          <img
            src="src/img/WhatsApp Image 2026-09-07 at 18.22.39.jpeg"
            className="w-36 h-36 object-cover border-[4px] border-white absolute -top-8 -left-4 shadow-xl transform rotate-[-4deg]"
          />
          <img
            src="src/img/WhatsApp Image 2026-09-07 at 18.22.39 (1).jpeg"
            className="w-36 h-36 object-cover border-[4px] border-white absolute top-1/2 -translate-y-1/2 right-[-10px] shadow-xl z-10 transform rotate-[3deg]"
          />
          <img
            src="src/img/WhatsApp Image 2026-09-07 at 18.22.39 (2).jpeg"
            className="w-36 h-36 object-cover border-[4px] border-white absolute -bottom-8 -left-2 shadow-xl z-20 transform rotate-[-2deg]"
          />
        </div>
        <div className="absolute bottom-10 right-8 flex flex-col items-center">
          <div className="text-4xl drop-shadow-sm">🖤</div>
          <p className="font-sans font-extrabold text-black text-[10px] tracking-widest mt-1">
            NÓS PRA SEMPRE
          </p>
        </div>
      </Page>

      <Page
        bgClass="bg-black"
        className="p-6 flex flex-col items-center justify-center relative"
      >
        <div className="stamp-edge w-full h-[80%] absolute inset-y-10 inset-x-4"></div>
        <div className="z-10 w-full h-full relative flex flex-col items-center justify-center">
          <div className="absolute top-16 left-6 bg-white/90 backdrop-blur-sm px-4 py-1 font-script text-[2.5rem] text-black transform -rotate-6 shadow-sm border border-gray-100">
            Eu
          </div>
          <div className="absolute top-28 right-6 bg-white/90 backdrop-blur-sm px-4 py-1 font-script text-[2.5rem] text-black transform rotate-6 shadow-sm border border-gray-100">
            Vou
          </div>
          <div className="relative mt-8">
            <div className="bg-white p-2 shadow-xl transform -rotate-[8deg] z-10 border border-gray-200">
              <img
                src="src/img/WhatsApp Image 2026-09-07 at 18.24.45.jpeg"
                className="w-32 h-44 object-cover filter grayscale contrast-110"
              />
            </div>
            <div className="bg-white p-2 shadow-xl transform rotate-[6deg] absolute top-10 left-16 z-20 border border-gray-200">
              <img
                src="src/img/WhatsApp Image 2026-09-07 at 18.24.45 (1).jpeg"
                className="w-32 h-44 object-cover filter grayscale contrast-110"
              />
            </div>
          </div>
          <div className="absolute bottom-40 left-6 bg-white/90 backdrop-blur-sm px-4 py-1 font-script text-[2.5rem] text-black transform -rotate-3 shadow-sm border border-gray-100">
            Amar
          </div>
          <div className="absolute bottom-28 right-6 bg-white/90 backdrop-blur-sm px-4 py-1 font-script text-[2.5rem] text-black transform rotate-3 shadow-sm border border-gray-100">
            Você
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-2 font-script text-[3rem] text-black transform -rotate-2 shadow-md border border-gray-100">
            Infinitamente
          </div>
        </div>
      </Page>

      <Page bgClass="bg-noise-cream" className="flex flex-col">
        <div className="h-[45%] bg-noise-red flex items-center justify-center relative border-b-4 border-white">
          <svg
            className="w-40 h-40 text-white/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 3l10 9h-3v9H5v-9H2L12 3z" />
          </svg>
          <div className="z-10 text-center text-[#ebd5a3] font-sans font-semibold tracking-[0.3em] text-sm leading-[2.5]">
            THERE IS
            <br />
            NO PLACE
            <br />
            LIKE HOME
          </div>
        </div>
        <div className="h-[55%] flex flex-col items-center justify-center p-8">
          <h2 className="font-script text-[2.5rem] text-gray-800 mb-6 drop-shadow-sm">
            You Are My Home
          </h2>
          <img
            src="src/img/WhatsApp Image 2026-09-07 at 18.30.39.jpeg"
            className="w-56 h-36 object-cover border-[5px] border-white shadow-[0_10px_20px_rgba(0,0,0,0.15)] mb-8 transform rotate-1"
          />
          <div className="w-full max-w-[280px] border-t border-gray-300 pt-5 text-left">
            <h3 className="font-serif font-bold text-5xl text-gray-900 mb-1 tracking-tight">
              home
            </h3>
            <p className="font-sans text-[10px] text-gray-400 mb-3 font-semibold">
              [noun]
            </p>
            <p className="font-sans text-xs text-gray-600 leading-relaxed text-justify font-medium">
              A place where you are always welcome and surrounded by those who
              love you.
            </p>
          </div>
        </div>
      </Page>

      <Page
        bgClass="bg-noise-cream"
        className="flex items-center justify-center"
      >
        <div
          className="relative w-72 h-72 flex items-center justify-center font-sans text-gray-800 font-bold tracking-widest text-xs"
          onMouseMove={handleMouseMoveClock}
          onTouchMove={handleMouseMoveClock}
        >
          <div className="absolute w-1 h-14 bg-black origin-bottom top-[50%] left-[50%] -ml-[2px] -mt-14 rotate-[150deg] rounded z-10 opacity-80"></div>
          <div
            className="absolute w-1.5 h-20 bg-black origin-bottom top-[50%] left-[50%] -ml-[3px] -mt-20 rounded z-10 transition-transform duration-75"
            style={{ transform: `rotate(${clockAngle}deg)` }}
          ></div>
          <div className="absolute w-4 h-4 bg-black rounded-full z-20 border-2 border-white shadow-sm"></div>
          <span className="absolute top-2 left-1/2 -translate-x-1/2">
            Twelve
          </span>
          <span className="absolute top-8 right-10 rotate-[30deg]">One</span>
          <span className="absolute top-16 right-4 rotate-[60deg]">Two</span>
          <span className="absolute top-1/2 right-0 -translate-y-1/2 rotate-90">
            Three
          </span>
          <span className="absolute bottom-16 right-4 rotate-[120deg]">
            Four
          </span>
          <span className="absolute bottom-8 right-10 rotate-[150deg]">
            Five
          </span>
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rotate-180">
            Six
          </span>
          <span className="absolute bottom-8 left-10 rotate-[210deg]">
            Seven
          </span>
          <span className="absolute bottom-16 left-4 rotate-[240deg]">
            Eight
          </span>
          <span className="absolute top-1/2 left-0 -translate-y-1/2 rotate-[270deg]">
            Nine
          </span>
          <span className="absolute top-16 left-4 rotate-[300deg]">Ten</span>
          <span className="absolute top-8 left-10 rotate-[330deg]">Eleven</span>
        </div>
      </Page>

      <Page
        bgClass="bg-noise-cream"
        className="p-8 relative flex flex-col justify-between overflow-hidden"
      >
        <h2 className="font-serif italic text-6xl text-gray-800 text-right leading-none z-10 mt-10 mr-4">
          You're
          <br />
          All
          <br />
          Thats
        </h2>
        <div className="absolute top-[25%] left-[15%] text-5xl text-black transform rotate-12 opacity-80">
          ★
        </div>
        <div className="absolute bottom-[35%] right-[15%] text-4xl text-black transform -rotate-12 opacity-80">
          ★
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-10">
          <div className="bg-white p-2 pb-6 shadow-xl border border-gray-200 transform -rotate-[12deg] absolute z-10 w-44 pointer-events-auto">
            <img
              src="src/img/WhatsApp Image 2026-09-07 at 18.32.44.jpeg"
              className="w-full h-24 object-cover filter grayscale contrast-125"
            />
          </div>
          <div className="bg-white p-2 pb-6 shadow-xl border border-gray-200 transform rotate-[8deg] absolute mt-24 ml-16 z-20 w-44 pointer-events-auto">
            <img
              src="src/img/WhatsApp Image 2026-09-07 at 18.32.45.jpeg"
              className="w-full h-24 object-cover filter grayscale contrast-125"
            />
          </div>
          <div className="bg-white p-2 pb-6 shadow-xl border border-gray-200 transform -rotate-[4deg] absolute mt-48 -ml-12 z-30 w-44 pointer-events-auto">
            <img
              src="src/img/WhatsApp Image 2026-09-07 at 18.34.28.jpeg"
              className="w-full h-24 object-cover filter grayscale contrast-125"
            />
          </div>
        </div>
        <h2 className="font-serif italic text-6xl text-gray-800 leading-none z-10 mb-10 ml-4">
          On
          <br />
          My
          <br />
          Mind
        </h2>
      </Page>
      <div className="w-full h-32 max-w-[450px] bg-[#111] snap-start flex items-center justify-center shrink-0">
        <p className="font-sans text-white/30 text-xs tracking-[0.2em] uppercase font-semibold">
          End of Album
        </p>
      </div>
    </div>
  );
}
