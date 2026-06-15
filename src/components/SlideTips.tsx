import React, { useState } from 'react';
import { PresentationPlan } from '../types';
import { Layout, Image as ImageIcon, FileText, Sparkles, Pin, CheckCircle } from 'lucide-react';

interface SlideTipsProps {
  plan: PresentationPlan;
}

export default function SlideTips({ plan }: SlideTipsProps) {
  const [activeSlide, setActiveSlide] = useState<number>(1);

  const slides = [
    {
      id: 1,
      title: '1슬라이드 (표지)',
      desc: '발표를 여는 얼굴이에요. 주제가 한눈에 잘 들어오게 꾸며봐요!',
      tip: '주제와 어울리는 깔끔하고 두꺼운 글씨체와 중심을 잡아줄 대표 이미지 1장을 가운데에 가득 채워봐!',
      render: () => (
        <div id="slide-1-preview" className="w-full aspect-[16/9] bg-[#FF8FA3] text-white rounded-xl p-6 flex flex-col justify-between shadow-md relative overflow-hidden border border-[#FF8FA3]/80">
          {/* Mock background circle */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/15 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full font-mono font-bold">Slide 01</span>
          </div>

          <div className="my-auto space-y-2">
            <div className="h-1.5 w-12 bg-[#FFD97D] rounded-full"></div>
            <h3 className="text-lg md:text-xl font-black tracking-tight leading-tight drop-shadow-sm">
              {plan.subtopic || '나의 멋진 발표 주제명'}
            </h3>
            <p className="text-xs text-rose-55 font-semibold">우리 주변의 생생한 이야기를 발표해봐요</p>
          </div>

          <div className="flex justify-between items-end border-t border-white/20 pt-3">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#FFD97D] animate-pulse"></span>
              <span className="text-[9px] text-rose-50/90 font-bold">초등 5학년 실과 디지털 저작도구</span>
            </div>
            <p className="text-xs font-black text-[#FFD97D]">발표자: {plan.studentName || '나'}</p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: '2슬라이드 (처음)',
      desc: '왜 이 주제를 골랐는지 이유를 설명하며 친구들의 집중을 이끌어내요.',
      tip: '네가 이 주제를 고른 동기와 경험을 친구들이 가슴 깊이 다가올 수 있게 뉴스 캡처나 관련 사진으로 크게 보여주면 집중도가 훨씬 상승해!',
      render: () => (
        <div id="slide-2-preview" className="w-full aspect-[16/9] bg-white border-2 border-[#E2D9C8] text-[#432818] rounded-xl p-6 flex flex-col justify-between shadow-md relative">
          <div className="flex justify-between items-center border-b border-[#E2D9C8]/60 pb-2">
            <h4 className="text-xs font-black text-[#FF8FA3] flex items-center gap-1">🌱 발표를 시작하며 (처음)</h4>
            <span className="text-[10px] font-mono font-bold text-[#6E5340] bg-[#FFFDF5] border border-[#E2D9C8] px-1.5 py-0.5 rounded">Slide 02</span>
          </div>

          <div className="grid grid-cols-2 gap-4 my-auto">
            {/* Left Column: text motivation */}
            <div className="flex flex-col justify-center space-y-2">
              <div className="bg-[#FFFDF5] border-l-4 border-[#FF8FA3] p-2.5 rounded-r">
                <span className="text-[10px] font-bold text-[#432818] block mb-0.5">💡 내가 이 주제를 고른 이유:</span>
                <p className="text-[11px] leading-relaxed text-[#6E5340] font-bold line-clamp-3">
                  "{plan.motivation || '이 주제가 친구들에게 꼭 유익할 것 같아 선정했습니다.'}"
                </p>
              </div>
            </div>

            {/* Right Column: Visual news frame box */}
            <div className="bg-[#FFFDF5] rounded-lg p-2 border-2 border-[#E2D9C8] border-dashed flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute top-1 left-1.5 flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#FFD97D]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4E09B]"></div>
              </div>
              <ImageIcon className="w-5 h-5 text-[#FF8FA3] mb-1" />
              <span className="text-[10px] font-bold text-[#432818]">생생한 일상 사진 또는 뉴스 캡처</span>
              <span className="text-[9px] text-[#6E5340]/70 mt-0.5">(친구가 이해하기 편해요!)</span>
            </div>
          </div>

          <div className="text-[9px] text-[#6E5340]/70">
            * 꿀팁: 긴 문장 대신 관련 사진 한 장이 한 단원 요약보다 눈에 띄어요.
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: '3슬라이드 (가운데 ❶)',
      desc: '가장 중요하게 알려줄 첫 번째 핵심 정보를 담아요.',
      tip: '핵심 내용 첫 번째는 구구절절 긴 줄글로 쓰지 말고, 눈에 확 띄는 귀여운 관련 아이콘이나 핵심 단어로 한눈에 들어오게 디자인해봐!',
      render: () => (
        <div id="slide-3-preview" className="w-full aspect-[16/9] bg-white border-2 border-[#E2D9C8] text-[#432818] rounded-xl p-6 flex flex-col justify-between shadow-md relative">
          <div className="flex justify-between items-center border-b border-[#E2D9C8]/60 pb-2">
            <h4 className="text-xs font-black text-[#FF8FA3]">📌 발표의 중심 (가운데-1)</h4>
            <span className="text-[10px] font-mono font-bold text-[#6E5340] bg-[#FFFDF5] border border-[#E2D9C8] px-1.5 py-0.5 rounded">Slide 03</span>
          </div>

          <div className="my-auto flex flex-col items-center justify-center text-center space-y-3 px-4">
            {/* Round Icon */}
            <div className="w-10 h-10 bg-[#FF8FA3]/15 rounded-full flex items-center justify-center border-2 border-[#FF8FA3] shadow-xs">
              <span className="text-sm font-black text-[#FF8FA3]">1</span>
            </div>
            
            {/* Dynamic keyword summary */}
            <div className="space-y-1.5">
              <h5 className="text-[10px] font-black text-[#432818] bg-[#FFD97D]/30 border border-[#FFD97D]/60 px-2 py-0.5 rounded-full inline-block">첫 번째 중요 정보</h5>
              <p className="text-xs font-bold text-[#432818] leading-relaxed max-w-sm mx-auto">
                {plan.core1 || '여기에 첫 번째 핵심 내용을 깔끔한 키워드로 정리해보세요.'}
              </p>
            </div>
          </div>

          <div className="text-[9px] text-[#6E5340]/70 text-center">
            * 꿀팁: 슬라이드에 글이 가득 차면 듣는 사람이 읽기 힘들어해요! 3~4개의 요점 문장만 적기!
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: '4슬라이드 (가운데 ❷)',
      desc: '두 번째 핵심 내용을 알려주는 중요한 슬라이드예요.',
      tip: '두 번째 핵심 정보 역시 큰 글씨체와 눈에 편안한 배색을 사용하고, 캔바나 PPT의 레이아웃 요소를 활용해 단락을 분리하여 정렬해 보세요!',
      render: () => (
        <div id="slide-4-preview" className="w-full aspect-[16/9] bg-white border-2 border-[#E2D9C8] text-[#432818] rounded-xl p-6 flex flex-col justify-between shadow-md relative">
          <div className="flex justify-between items-center border-b border-[#E2D9C8]/60 pb-2">
            <h4 className="text-xs font-black text-[#FF8FA3]">📌 발표의 중심 (가운데-2)</h4>
            <span className="text-[10px] font-mono font-bold text-[#6E5340] bg-[#FFFDF5] border border-[#E2D9C8] px-1.5 py-0.5 rounded">Slide 04</span>
          </div>

          <div className="my-auto flex flex-col items-center justify-center text-center space-y-3 px-4">
            {/* Round Icon */}
            <div className="w-10 h-10 bg-[#FFD97D]/35 rounded-full flex items-center justify-center border-2 border-[#FFD97D] shadow-xs">
              <span className="text-sm font-black text-[#432818]">2</span>
            </div>
            
            {/* Dynamic keyword summary */}
            <div className="space-y-1.5">
              <h5 className="text-[10px] font-black text-[#432818] bg-[#D4E09B]/40 border border-[#D4E09B]/80 px-2 py-0.5 rounded-full inline-block">두 번째 중요 정보</h5>
              <p className="text-xs font-bold text-[#432818] leading-relaxed max-w-sm mx-auto">
                {plan.core2 || '여기에 두 번째 핵심 내용을 깔끔한 키워드로 정리해보세요.'}
              </p>
            </div>
          </div>

          <div className="text-[9px] text-[#6E5340]/70 text-center">
            * 꿀팁: 아이콘(색상 대비) 또는 미디어 자료를 하나 덧붙여도 좋아요.
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: '5슬라이드 (끝)',
      desc: '발표를 끝맺으며 친구들에게 강조하고 싶은 하이라이트 문장을 담아요.',
      tip: '친구들이 발표를 듣고 꼭 실천해주었으면 좋겠다고 당부하는 말을 엄청나게 큰 폰트로 쿵! 강조하여 가슴속에 남겨보자!',
      render: () => (
        <div id="slide-5-preview" className="w-full aspect-[16/9] bg-[#432818] border-2 border-[#432818] text-white rounded-xl p-6 flex flex-col justify-between shadow-md relative overflow-hidden">
          {/* subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#FF8FA3]/20 rounded-full blur-2xl"></div>

          <div className="flex justify-between items-center border-b border-[#E2D9C8]/10 pb-2">
            <h4 className="text-xs font-black text-[#FFD97D]">✨ 발표를 마무리하며 (끝)</h4>
            <span className="text-[10px] font-mono font-bold text-rose-100 bg-[#FF8FA3]/30 px-1.5 py-0.5 rounded">Slide 05</span>
          </div>

          <div className="my-auto text-center space-y-2">
            <span className="text-[10px] font-bold text-[#FFD97D]">우리가 꼭 지켜야 할 실천 약속! 🤙</span>
            <h3 className="text-sm md:text-md font-black tracking-wide leading-relaxed text-[#FFFDF5] max-w-md mx-auto">
              "{plan.conclusion || '소중한 우리들의 작은 약속, 오늘부터 꼭 같이 실천해 보기로 해요!'}"
            </h3>
          </div>

          <div className="flex justify-between items-end pt-2 text-[9px] text-white/50">
            <span>* 꿀팁: '감사합니다' 슬라이드 앞에 오물조물 각오를 넣으면 백 점!</span>
            <span className="font-black text-[#FF8FA3]">👍 발표 끝!</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-2xl border-2 border-[#E2D9C8] chat-bubble p-5 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E2D9C8]/60 pb-4">
        <div>
          <h3 className="font-extrabold text-[#432818] flex items-center gap-2 text-sm">
            <Layout className="w-5 h-5 text-[#FF8FA3]" />
            🖥️ 디지털 저작 도구(캔바, PPT) 활용 슬라이드 제작 팁!
          </h3>
          <p className="text-[#6E5340] text-xs mt-1">
            계획한 내용들이 실제 슬라이드로 어떻게 구현되면 좋은지 시각화된 시안을 보고 클릭해 봐요!
          </p>
        </div>
        
        {/* Step dots */}
        <div className="flex gap-1.5">
          {slides.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSlide(s.id)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeSlide === s.id
                  ? 'bg-[#FF8FA3] text-white ring-2 ring-[#FF8FA3]/30 scale-105 shadow-sm'
                  : 'bg-[#FFFDF5] text-[#6E5340] border border-[#E2D9C8] hover:bg-[#FFD97D]/10'
              }`}
            >
              {s.id}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Visual Simulated Canvas - 16:9 Aspect Ratio on Left Side (7 Cols) */}
        <div className="md:col-span-7 space-y-2">
          <div className="bg-[#432818] p-2.5 rounded-2xl shadow-inner border border-[#E2D9C8]/20">
            <div className="flex items-center gap-1.5 mb-2 px-1">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFD97D]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#D4E09B]"></div>
              <span className="text-[10px] text-white/40 ml-2 font-mono font-bold tracking-wider">CANVA / POWERPOINT PREVIEW LAYER</span>
            </div>
            {slides.find((s) => s.id === activeSlide)?.render()}
          </div>
          <div className="flex justify-between text-[11px] text-[#6E5340]/70 px-1 font-semibold">
            <span>💻 5학년 대화 협동 학습 도구</span>
            <span>화면을 캔바나 PPT에 복사해보세요!</span>
          </div>
        </div>

        {/* Written Tip instructions on Right Side (5 Cols) */}
        <div className="md:col-span-5 flex flex-col justify-between h-auto md:min-h-[290px] bg-[#FFFDF5] p-4 md:p-5 rounded-2xl border-2 border-[#E2D9C8] shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-[#FF8FA3] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Tip {activeSlide}
              </span>
              <h4 className="font-extrabold text-[#432818] text-sm">{slides[activeSlide - 1].title}</h4>
            </div>

            <p className="text-[#6E5340] text-xs font-bold leading-relaxed">
              {slides[activeSlide - 1].desc}
            </p>

            <div className="bg-white/90 border-l-4 border-[#FF8FA3] p-3 rounded-r-lg space-y-1 shadow-2xs">
              <span className="text-xs font-black text-[#FF8FA3] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD97D] fill-[#FFD97D]" />
                피움이의 특급 시각 배치 요령:
              </span>
              <p className="text-[#6E5340] text-xs leading-relaxed font-semibold">
                {slides[activeSlide - 1].tip}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E2D9C8]/60 flex items-center gap-2 text-xs text-[#FF8FA3] font-black">
            <CheckCircle className="w-4 h-4 text-[#D4E09B]" />
            <span>이 레이아웃을 그대로 PPT나 캔바에서 구현하면 우수 상은 단짝친구 꺼! 🎉</span>
          </div>
        </div>
      </div>
    </div>
  );
}
