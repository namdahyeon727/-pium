import React from 'react';
import { ConversationStep, PiumExpression } from '../types';

interface PiumAvatarProps {
  step: ConversationStep;
  expression: PiumExpression;
}

export default function PiumAvatar({ step, expression }: PiumAvatarProps) {
  // Convert steps to growth stages
  const getGrowthStage = (currentStep: ConversationStep) => {
    switch (currentStep) {
      case 'NAME':
        return 1; // Seed/Tiny Sprout
      case 'KEYWORD':
        return 2; // Sprout grows two leaves
      case 'SUBTOPIC_CHOOSE':
        return 3; // Leaf stem grows taller
      case 'MOTIVATION':
        return 4; // Stem develops a small green bud
      case 'CORE_1':
        return 5; // Flower bud starts turning colorful
      case 'CORE_2':
        return 6; // Flower starts blooming slightly
      case 'CONCLUSION':
        return 7; // Flower almost fully bloomed
      case 'FINISHED':
        return 8; // Magnificent golden fully opened flower with glowing sparkles!
      default:
        return 1;
    }
  };

  const stage = getGrowthStage(step);

  // SVG eye rendering based on expression
  const renderEyes = () => {
    switch (expression) {
      case 'happy':
        return (
          <>
            {/* Curved happy eyes */}
            <path d="M 18 20 Q 23 15 28 20" stroke="#4B2D0B" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 32 20 Q 37 15 42 20" stroke="#4B2D0B" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        );
      case 'thinking':
        return (
          <>
            {/* Thinking / rolling eyes */}
            <circle cx="23" cy="18" r="4.5" fill="#4B2D0B" />
            <circle cx="21" cy="16" r="1.5" fill="#FFFFFF" />
            <circle cx="37" cy="18" r="4.5" fill="#4B2D0B" />
            <circle cx="35" cy="16" r="1.5" fill="#FFFFFF" />
            {/* Arched eyebrows */}
            <path d="M 18 13 Q 23 10 28 13" stroke="#4B2D0B" strokeWidth="1.5" fill="none" />
            <path d="M 32 13 Q 37 10 42 13" stroke="#4B2D0B" strokeWidth="1.5" fill="none" />
          </>
        );
      case 'proud':
        return (
          <>
            {/* Big sparkling eyes */}
            <circle cx="23" cy="19" r="5" fill="#4B2D0B" />
            <circle cx="21" cy="17" r="2" fill="#FFFFFF" />
            <circle cx="24" cy="21" r="1" fill="#FFFFFF" />
            <circle cx="37" cy="19" r="5" fill="#4B2D0B" />
            <circle cx="35" cy="17" r="2" fill="#FFFFFF" />
            <circle cx="38" cy="21" r="1" fill="#FFFFFF" />
            {/* Sweet raised eyebrows */}
            <path d="M 17 12 Q 22 9 27 12" stroke="#4B2D0B" strokeWidth="1.5" fill="none" />
            <path d="M 33 12 Q 38 9 43 12" stroke="#4B2D0B" strokeWidth="1.5" fill="none" />
          </>
        );
      case 'talking':
        return (
          <>
            {/* Simple blinking eyes for speaking */}
            <ellipse cx="23" cy="19" rx="3.5" ry="4" fill="#4B2D0B" />
            <circle cx="22" cy="17" r="1" fill="#FFFFFF" />
            <ellipse cx="37" cy="19" rx="3.5" ry="4" fill="#4B2D0B" />
            <circle cx="36" cy="17" r="1" fill="#FFFFFF" />
          </>
        );
      case 'default':
      default:
        return (
          <>
            {/* Friendly blinking eyes */}
            <circle cx="23" cy="19" r="4" fill="#4B2D0B" />
            <circle cx="21.5" cy="17.5" r="1.5" fill="#FFFFFF" />
            <circle cx="37" cy="19" r="4" fill="#4B2D0B" />
            <circle cx="35.5" cy="17.5" r="1.5" fill="#FFFFFF" />
          </>
        );
    }
  };

  // SVG mouth rendering based on expression
  const renderMouth = () => {
    switch (expression) {
      case 'happy':
      case 'proud':
        return <path d="M 23 26 Q 30 34 37 26" fill="#F43F5E" stroke="#4B2D0B" strokeWidth="2.5" strokeLinecap="round" />;
      case 'thinking':
        return <path d="M 26 27 Q 30 25 34 27" stroke="#4B2D0B" strokeWidth="3" strokeLinecap="round" fill="none" />;
      case 'talking':
        return (
          <ellipse cx="30" cy="28" rx="3.5" ry="5" fill="#F43F5E" stroke="#4B2D0B" strokeWidth="2" />
        );
      case 'default':
      default:
        return <path d="M 25 26 Q 30 30 35 26" stroke="#4B2D0B" strokeWidth="2.5" strokeLinecap="round" fill="none" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-emerald-50/50 rounded-2xl border-2 border-emerald-100 shadow-sm relative overflow-hidden h-full min-h-[290px] transition-all duration-500">
      {/* Sparkle effects on finished stage */}
      {stage === 8 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-6 text-yellow-400 animate-bounce delay-100">✨</div>
          <div className="absolute top-10 right-8 text-amber-400 animate-pulse delay-300">⭐</div>
          <div className="absolute bottom-16 left-8 text-yellow-300 animate-pulse delay-200">⭐</div>
          <div className="absolute top-1/2 right-12 text-teal-400 animate-bounce delay-500">✨</div>
        </div>
      )}

      {/* Sprout / Flower Stage Badge */}
      <div className="absolute top-3 left-3 bg-white/90 border border-emerald-100 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-xs">
        <span className="text-xs font-semibold text-emerald-700">🌱 성장 단계</span>
        <span className="text-xs font-bold text-amber-500">{stage}/8</span>
      </div>

      <div className="relative w-48 h-48 flex items-end justify-center select-none" id="pium-avatar">
        {/* SVG Sprout Container */}
        <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-md">
          {/* DEFINITIONS FOR GRADIENTS AND STYLES */}
          <defs>
            <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#A16207" />
            </linearGradient>
            <linearGradient id="stemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="100%" stopColor="#166534" />
            </linearGradient>
            <linearGradient id="petalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>
            <linearGradient id="chestnutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#9A3412" />
            </linearGradient>
          </defs>

          {/* FLOWER POT (Always Present) */}
          <ellipse cx="50" cy="88" rx="20" ry="6" fill="#713F12" opacity="0.3" />
          <path d="M 33 76 L 37 92 Q 50 95 63 92 L 67 76 Z" fill="url(#potGrad)" stroke="#451A03" strokeWidth="1.5" />
          <ellipse cx="50" cy="76" rx="17" ry="3.5" fill="#4B2D0B" stroke="#451A03" strokeWidth="1" />
          {/* Dirt level */}
          <ellipse cx="50" cy="76" rx="16" ry="2.5" fill="#78350F" />

          {/* STAGE 1: Small Seedling */}
          {stage === 1 && (
            <g className="animate-pulse">
              {/* Stem is just a tiny hook */}
              <path d="M 50 76 Q 49 71 52 68" stroke="url(#stemGrad)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              {/* Seed casing */}
              <path d="M 52 68 C 50 64, 55 60, 56 64 C 57 68, 54 70, 52 68" fill="#451A03" />
              {/* First tiny green leaf breaking out */}
              <path d="M 54 64 C 54 59, 59 58, 56 63 Z" fill="#86EFAC" stroke="#15803D" strokeWidth="0.7" />
            </g>
          )}

          {/* STAGE 2: Sprout with two leaves */}
          {stage === 2 && (
            <g>
              {/* Short stem */}
              <path d="M 50 76 Q 50 64 49 58" stroke="url(#stemGrad)" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              {/* Left Leaf */}
              <path d="M 49 61 C 41 52, 40 60, 48 61 Z" fill="url(#leafGrad)" stroke="#15803D" strokeWidth="1" />
              {/* Right Leaf */}
              <path d="M 49 58 C 58 50, 57 58, 50 58 Z" fill="url(#leafGrad)" stroke="#15803D" strokeWidth="1" />
            </g>
          )}

          {/* STAGE 3: Stem grows taller */}
          {stage === 3 && (
            <g>
              {/* Tall Stem */}
              <path d="M 50 76 Q 48 64 51 46" stroke="url(#stemGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />
              {/* Alternating leaves */}
              <path d="M 49 64 C 40 58, 41 65, 49 64 Z" fill="url(#leafGrad)" stroke="#15803D" strokeWidth="1" />
              <path d="M 50 54 C 58 48, 57 55, 50 54 Z" fill="url(#leafGrad)" stroke="#15803D" strokeWidth="1" />
              {/* Tiny tiny bud helper */}
              <circle cx="51" cy="45" r="3" fill="#4ADE80" stroke="#15803D" strokeWidth="1" />
            </g>
          )}

          {/* STAGE 4: Stem grows with a small green bulb */}
          {stage === 4 && (
            <g>
              {/* Curved Tall Stem */}
              <path d="M 50 76 Q 46 58 52 38" stroke="url(#stemGrad)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
              {/* Leaves */}
              <path d="M 48 61 C 39 56, 38 64, 48 61 Z" fill="url(#leafGrad)" stroke="#15803D" strokeWidth="1" />
              <path d="M 49 48 C 58 43, 57 50, 49 48 Z" fill="url(#leafGrad)" stroke="#15803D" strokeWidth="1" />
              {/* Green Bud bulb */}
              <circle cx="52" cy="38" r="7" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
              {/* Petal bits peeking out from base */}
              <path d="M 52 31 Q 52 38 49 35" stroke="#EAB308" strokeWidth="1.5" fill="none" />
              <path d="M 52 31 Q 54 38 55 35" stroke="#EAB308" strokeWidth="1.5" fill="none" />
            </g>
          )}

          {/* STAGE 5: Flower bud starting to color */}
          {stage === 5 && (
            <g>
              {/* Strong Stem */}
              <path d="M 50 76 Q 47 52 50 35" stroke="url(#stemGrad)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
              {/* Leaves */}
              <path d="M 48 58 C 38 52, 38 60, 48 58 Z" fill="url(#leafGrad)" stroke="#15803D" strokeWidth="1" />
              <path d="M 49 45 C 59 40, 58 48, 49 45 Z" fill="url(#leafGrad)" stroke="#15803D" strokeWidth="1" />
              
              {/* Bud expanding with pink/yellow colors */}
              <circle cx="50" cy="35" r="9" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
              <ellipse cx="50" cy="31" rx="6" ry="6" fill="#F43F5E" stroke="#BE123C" strokeWidth="1" />
              <ellipse cx="46" cy="33" rx="4" ry="4" fill="#EAB308" />
              <ellipse cx="54" cy="33" rx="4" ry="4" fill="#EAB308" />
            </g>
          )}

          {/* STAGE 6: Flower starts blooming slightly */}
          {stage === 6 && (
            <g>
              {/* Solid Stem */}
              <path d="M 50 76 Q 48 50 50 35" stroke="url(#stemGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
              {/* Big Leaves */}
              <path d="M 49 55 C 38 49, 36 59, 49 55 Z" fill="url(#leafGrad)" stroke="#15803D" strokeWidth="1.2" />
              <path d="M 50 43 C 61 38, 60 47, 50 43 Z" fill="url(#leafGrad)" stroke="#15803D" strokeWidth="1.2" />

              {/* Small opening petals */}
              <g className="animate-bounce" style={{ animationDuration: '4s' }}>
                {/* Petals background */}
                <circle cx="50" cy="30" r="14" fill="none" stroke="#FDE047" strokeWidth="6" strokeDasharray="6 2" />
                {/* Center Core */}
                <circle cx="50" cy="30" r="10" fill="#F97316" stroke="#C2410C" strokeWidth="1.5" />
                {/* Cute Micro Pium Face */}
                <g transform="translate(20, 10)">
                  <circle cx="28" cy="18" r="1.5" fill="#4B2D0B" />
                  <circle cx="32" cy="18" r="1.5" fill="#4B2D0B" />
                  <path d="M 29 21 Q 30 23 31 21" stroke="#4B2D0B" strokeWidth="1" fill="none" />
                </g>
              </g>
            </g>
          )}

          {/* STAGE 7: Almost fully bloomed */}
          {stage === 7 && (
            <g>
              <path d="M 50 76 L 50 36" stroke="url(#stemGrad)" strokeWidth="6.5" strokeLinecap="round" fill="none" />
              <path d="M 50 58 C 36 52, 34 64, 50 58 Z" fill="url(#leafGrad)" stroke="#15803D" strokeWidth="1.5" />
              <path d="M 50 46 C 64 39, 63 51, 50 46 Z" fill="url(#leafGrad)" stroke="#15803D" strokeWidth="1.5" />

              {/* Large opening sunflower blooms */}
              <g className="animate-spin" style={{ animationDuration: '40s' }}>
                {/* Petals */}
                <path d="M 50 12 L 53 22 L 62 14 L 60 25 L 71 21 L 65 31 L 76 31 L 67 37 L 74 46 L 64 47 L 68 57 L 58 53 L 58 64 L 50 57 L 42 64 L 42 53 L 32 57 L 36 47 L 26 46 L 33 37 L 24 31 L 35 31 L 29 21 L 40 25 L 38 14 L 47 22 Z" fill="url(#petalGrad)" stroke="#D97706" strokeWidth="1" />
              </g>

              {/* Center Brown plate */}
              <circle cx="50" cy="36" r="14" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
              
              {/* Cute face layer */}
              <g transform="translate(20, 16)">
                {renderEyes()}
                {renderMouth()}
                {/* Cheek support */}
                <circle cx="20" cy="22" r="3" fill="#FB7185" opacity="0.6" />
                <circle cx="40" cy="22" r="3" fill="#FB7185" opacity="0.6" />
              </g>
            </g>
          )}

          {/* STAGE 8: Magnificent fully opened flower with golden sparkles! */}
          {stage === 8 && (
            <g className="animate-wiggle">
              {/* Strong stem with sway animation background */}
              <path d="M 50 76 Q 51 53 49 39" stroke="url(#stemGrad)" strokeWidth="7" strokeLinecap="round" fill="none" />
              <path d="M 50 54 C 34 49, 32 62, 50 54 Z" fill="url(#leafGrad)" stroke="#15803D" strokeWidth="1.5" />
              <path d="M 49 44 C 65 36, 63 50, 49 44 Z" fill="url(#leafGrad)" stroke="#15803D" strokeWidth="1.5" />

              {/* Petal Crown */}
              <g className="origin-[49px_39px] animate-spin" style={{ animationDuration: '25s' }}>
                <path d="M 49 11 L 53 23 L 64 13 L 61 25 L 73 20 L 66 31 L 78 31 L 68 38 L 76 48 L 65 48 L 69 60 L 58 55 L 57 67 L 49 59 L 41 67 L 40 55 L 29 60 L 33 48 L 22 48 L 30 38 L 20 31 L 32 31 L 25 20 L 37 25 L 34 13 L 45 23 Z" fill="url(#petalGrad)" stroke="#D97706" strokeWidth="1.5" />
              </g>

              {/* Big fluffy center face plate */}
              <circle cx="49" cy="39" r="17" fill="#78350F" stroke="#451A03" strokeWidth="2" />
              {/* Light yellow seed details */}
              <circle cx="49" cy="39" r="14" fill="none" stroke="#FDE047" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />

              {/* Dynamic Face Layer */}
              <g transform="translate(19, 19)">
                {renderEyes()}
                {renderMouth()}
                {/* Blushing cheeks for complete joy */}
                <circle cx="18" cy="23" r="3" fill="#F43F5E" opacity="0.8" className="animate-ping" style={{ animationDuration: '3s' }} />
                <circle cx="18" cy="23" r="3" fill="#F43F5E" opacity="0.8" />
                <circle cx="42" cy="23" r="3" fill="#F43F5E" opacity="0.8" className="animate-ping" style={{ animationDuration: '3s' }} />
                <circle cx="42" cy="23" r="3" fill="#F43F5E" opacity="0.8" />
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Pium-i Text Status Display */}
      <div className="text-center mt-3 mr-1 relative">
        <span className="text-emerald-900 font-bold block text-sm drop-shadow-xs">🌻 AI 조력자 피움이</span>
        <span className="text-emerald-600 text-xs font-semibold block mt-0.5">
          {stage === 1 && "앗! 땅속에 씨앗이 자라고 있어요."}
          {stage === 2 && "아기 새싹 두 잎이 뿅! 🌿"}
          {stage === 3 && "계획서를 준비하며 매일 성장해요!"}
          {stage === 4 && "친구의 멋진 경험을 기다리는 몽우리!"}
          {stage === 5 && "무지개 꽃망울로 자라났어요 🌸"}
          {stage === 6 && "꽃이 수줍게 봉오리를 열어요!"}
          {stage === 7 && "정말 최고야! 조금만 더 하면 피어나요!"}
          {stage === 8 && "와! 멋진 계획서 꽃이 활짝 피었습니다! ✨"}
        </span>
      </div>
    </div>
  );
}
