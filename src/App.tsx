import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Send, Sparkles, MessageCircle, 
  RefreshCw, Printer, Copy, CheckCircle2, User, HelpCircle, 
  Award, BookOpen, ChevronRight, Trophy, Heart, Trash2, ArrowRight,
  Search, Users, Tag, ExternalLink, Calendar, Plus, X
} from 'lucide-react';
import { ConversationStep, ChatMessage, PresentationPlan, PiumExpression } from './types';
import PiumAvatar from './components/PiumAvatar';
import SlideTips from './components/SlideTips';

export default function App() {
  // Conversational States
  const [currentStep, setCurrentStep] = useState<ConversationStep>('NAME');
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [piumExpression, setPiumExpression] = useState<PiumExpression>('happy');
  const [suggestedSubtopics, setSuggestedSubtopics] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  // Completed Plan Data
  const [plan, setPlan] = useState<PresentationPlan>({
    studentName: '',
    keyword: '',
    subtopic: '',
    motivation: '',
    core1: '',
    core2: '',
    conclusion: ''
  });

  // Peer & Classmate plans state
  const [peersPlans, setPeersPlans] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('전체');
  const [selectedPeerPlan, setSelectedPeerPlan] = useState<any | null>(null);

  // Chat Log State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      text: '안녕! 나는 초등학교 5학년 친구들의 발표 계획서 작성을 돕는 친근하고 따뜻한 AI 학습 조력자 피움(Pium)이야! 🌱\n\n단 한 번뿐인 너의 발표를 반짝반짝 빛나게 만들어 줄게. 시작하기 전에 피움이가 너를 뭐라고 부르면 좋을까? 너의 이름을 알려줘! 😊',
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Fetch classmates' plans
  const fetchPeerPlans = async () => {
    try {
      const res = await fetch('/api/plans');
      const data = await res.json();
      if (data.plans) {
        setPeersPlans(data.plans);
      }
    } catch (err) {
      console.error("Error fetching peer plans:", err);
    }
  };

  useEffect(() => {
    fetchPeerPlans();
  }, []);

  // No-op TTS as voice is removed
  const speakText = (textToSpeak: string) => {
    // Audio synthesis disabled of user intent
  };

  // Predefined Sentence Helpers ("생각 주머니 🎁" - Scaffolding for primary schoolers)
  const getStartersForStep = (): string[] => {
    switch (currentStep) {
      case 'KEYWORD':
        return ['스마트폰', '인터넷', '반려동물', '친환경', '우리 반 고민', '독도', '미래 직업'];
      case 'MOTIVATION':
        return [
          '가족들과 뉴스를 보다가 해결하고 싶어져서 소개해 주고 싶었어요.',
          '일상생활에서 직접 경험하면서 더 깊이 연구해 보고 싶었기 때문이에요.',
          '우리 반 친구들도 이 문제의 심각성을 꼭 알아야 할 것 같아서 골랐어요.'
        ];
      case 'CORE_1':
        return [
          '첫 번째 핵심은 가장 친밀하게 겪을 수 있는 원인을 알려주는 것이에요.',
          '첫 번째로 친구들이 주의를 기울여 살펴봐야 할 주요 배경 상황이에요.'
        ];
      case 'CORE_2':
        return [
          '두 번째 핵심으로는 친구들과 다 함께 당장 실천해 볼 수 있는 구체적 행동 꿀팁이에요.',
          '두 번째로 우리 모두 쉽게 동참할 수 있는 해결책을 제안해 주고 싶어요.'
        ];
      case 'CONCLUSION':
        return [
          '친구들이 이 발표를 듣고 작은 것이라도 매일매일 함께 실천했으면 좋겠어요.',
          '발표 자료를 구상하고 계획해 보면서 저스스로도 많은 것을 깊이 느낄 수 있었습니다.'
        ];
      default:
        return [];
    }
  };

  // Handle Input submission
  const handleSend = async (customValue?: string) => {
    const valueToSend = (customValue || userInput).trim();
    if (!valueToSend) return;

    // Reset input
    if (!customValue) {
      setUserInput('');
    }

    // Add student message to chat log
    const userMsg: ChatMessage = {
      id: Date.now().toString() + "-student",
      role: 'user',
      text: valueToSend,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    // Run State Machine logic
    setIsLoading(true);
    setPiumExpression('thinking');

    try {
      if (currentStep === 'NAME') {
        const studentName = valueToSend;
        setPlan(prev => ({ ...prev, studentName }));
        
        // Formulated step response
        const nextPrompt = `와! 멋진 이름이구나, ${studentName} 친구! 🌸\n\n그럼 첫 번째 생각 열기 단계부터 시작해 보자!\n\n오늘 마음에 품고 온 **발표하고 싶은 주제나 큰 낱말(키워드)**이 무엇인지 말해줄 수 있니? (예: 스마트폰, 우주, 기후변화 등)`;
        
        setMessages(prev => [...prev, {
          id: Date.now().toString() + "-pium",
          role: 'assistant',
          text: nextPrompt,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }]);

        setCurrentStep('KEYWORD');
        setPiumExpression('happy');
        speakText(nextPrompt);
        setIsLoading(false);

      } else if (currentStep === 'KEYWORD') {
        const keyword = valueToSend;
        setPlan(prev => ({ ...prev, keyword }));

        // Prompt Gemini to get 3 interesting subtopics
        const res = await fetch('/api/subtopics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword, studentName: plan.studentName })
        });
        const data = await res.json();

        if (data.subtopics && data.subtopics.length > 0) {
          setSuggestedSubtopics(data.subtopics);
          
          const nextPrompt = `우와! **'${keyword}'**에 관심이 많았구나! 아주 파고들기 흥미진진한 주제야. ⚽\n\n초등학교 5학년 수준에서 탐구해서 캔바나 PPT로 발표하기 좋은 **3가지 구체적인 발표용 소주제**를 피움이가 짜왔어! 마음에 쏙 드는 것을 하나 골라보거나, 마음에 드는 게 없다면 너만의 주제를 직접 적어줘!`;
          
          setMessages(prev => [...prev, {
            id: Date.now().toString() + "-pium",
            role: 'assistant',
            text: nextPrompt,
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
          }]);
          
          setCurrentStep('SUBTOPIC_CHOOSE');
          setPiumExpression('proud');
          speakText(nextPrompt);
        } else {
          throw new Error("Subtopics empty");
        }
        setIsLoading(false);

      } else if (currentStep === 'SUBTOPIC_CHOOSE') {
        const subtopic = valueToSend;
        const updatedPlan = { ...plan, subtopic };
        setPlan(updatedPlan);

        // Move to Motivation step
        const nextStep: ConversationStep = 'MOTIVATION';
        setCurrentStep(nextStep);

        const chatRes = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedMessages,
            currentStep: nextStep,
            subtopic,
            keyword: plan.keyword,
            studentName: plan.studentName
          })
        });
        const chatData = await chatRes.json();
        
        const text = chatData.text || `어머나! '${subtopic}' 주제로 발표를 결정해 보았구나. 멋져요!\n\n이 주제를 **왜 친구들에게 가르쳐주고 싶었니?** 혹시 평소 내 생활의 재미난 경험이나 뉴스, 만화책에서 접한 일이 있다면 편하게 이유를 귀띔해줘! 🌿`;
        
        setMessages(prev => [...prev, {
          id: Date.now().toString() + "-pium",
          role: 'assistant',
          text,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }]);
        setPiumExpression('happy');
        speakText(text);
        setIsLoading(false);

      } else if (currentStep === 'MOTIVATION') {
        const motivation = valueToSend;
        const updatedPlan = { ...plan, motivation };
        setPlan(updatedPlan);

        const nextStep: ConversationStep = 'CORE_1';
        setCurrentStep(nextStep);

        const chatRes = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedMessages,
            currentStep: nextStep,
            subtopic: plan.subtopic,
            keyword: plan.keyword,
            studentName: plan.studentName
          })
        });
        const chatData = await chatRes.json();
        
        const text = chatData.text || `동기가 정말 속 깊고 멋져서 학급 친구들이 고개를 세차게 끄덕이겠어!\n\n그럼 이번에는 가장 중심 전개가 될 '가운데' 부분을 정돈해 보자. 친구들에게 가장 중요하게 알려줄 **첫 번째 핵심 내용**은 무엇인가요? 차근차근 골라볼까요?`;
        
        setMessages(prev => [...prev, {
          id: Date.now().toString() + "-pium",
          role: 'assistant',
          text,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }]);
        setPiumExpression('happy');
        speakText(text);
        setIsLoading(false);

      } else if (currentStep === 'CORE_1') {
        const core1 = valueToSend;
        const updatedPlan = { ...plan, core1 };
        setPlan(updatedPlan);

        const nextStep: ConversationStep = 'CORE_2';
        setCurrentStep(nextStep);

        const chatRes = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedMessages,
            currentStep: nextStep,
            subtopic: plan.subtopic,
            keyword: plan.keyword,
            studentName: plan.studentName
          })
        });
        const chatData = await chatRes.json();
        
        const text = chatData.text || `첫 번째 핵심 내용 설명이 아주 기막히네! ✏️\n\n그 다음으로 이어서 보여줄 **두 번째로 중요한 핵심 소식(내용)**은 또 어떤 걸 담으면 밸런스가 맞을까? 한 번 알려줘!`;
        
        setMessages(prev => [...prev, {
          id: Date.now().toString() + "-pium",
          role: 'assistant',
          text,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }]);
        setPiumExpression('proud');
        speakText(text);
        setIsLoading(false);

      } else if (currentStep === 'CORE_2') {
        const core2 = valueToSend;
        const updatedPlan = { ...plan, core2 };
        setPlan(updatedPlan);

        const nextStep: ConversationStep = 'CONCLUSION';
        setCurrentStep(nextStep);

        const chatRes = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedMessages,
            currentStep: nextStep,
            subtopic: plan.subtopic,
            keyword: plan.keyword,
            studentName: plan.studentName
          })
        });
        const chatData = await chatRes.json();
        
        const text = chatData.text || `아주 근사하게 핵심 두 가지를 다 정리했구나! 꽃봉오리가 열릴 것만 같아. 🌸\n\n마지막으로 발표를 마칠 때 친구들에게 **이것만큼은 꼭 실천하자! 라고 다짐할 한 마디**나 발표 기획을 마치는 **느낀 점**에 대해 말해볼까?`;
        
        setMessages(prev => [...prev, {
          id: Date.now().toString() + "-pium",
          role: 'assistant',
          text,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }]);
        setPiumExpression('talking');
        speakText(text);
        setIsLoading(false);

      } else if (currentStep === 'CONCLUSION') {
        const conclusion = valueToSend;
        const finalPlan = { ...plan, conclusion };
        setPlan(finalPlan);

        setCurrentStep('FINISHED');
        setPiumExpression('happy');

        const successMsg = `와! 정말 해내었구나, ${plan.studentName} 친구! 🌻\n\n너의 차근차근 깊은 생각 덕분에 피움이의 발표 계획서 꽃이 눈부시게 피었어! 대단해! 축하해! 🥳\n\n이제 너가 피움이와 함께 다듬은 세상에 단 하나뿐인 완벽한 발표 계획서와 슬라이드 꿀팁 상자를 다듬어 선물로 공개할게! 아래에서 확인해 보렴!`;
        
        setMessages(prev => [...prev, {
          id: Date.now().toString() + "-pium",
          role: 'assistant',
          text: successMsg,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }]);

        // Save the finished plan in the server database (real integration!)
        try {
          await fetch('/api/plans', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalPlan)
          });
          // Refresh children plans list
          fetchPeerPlans();
        } catch (saveErr) {
          console.error("Error saving plan:", saveErr);
        }

        speakText(successMsg);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + "-pium-error",
        role: 'assistant',
        text: '잠깐 연결 요정이 장난을 쳤나 봐! 마저 이어서 대답해 주면 피움이가 정돈해 줄게.',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsLoading(false);
      setPiumExpression('default');
    }
  };

  const handleSubtopicSelect = (topic: string) => {
    handleSend(topic);
  };

  const handleStartersSelect = (starter: string) => {
    setUserInput(prev => {
      if (prev.endsWith(' ') || prev === '') {
        return prev + starter;
      }
      return prev + ' ' + starter;
    });
  };

  // Reset the process completely
  const handleReset = () => {
    if (confirm("정말 처음부터 계획서를 다시 작성해 볼까요? (지금까지 쓴 것은 사라져요!)")) {
      setCurrentStep('NAME');
      setUserInput('');
      setSuggestedSubtopics([]);
      setPlan({
        studentName: '',
        keyword: '',
        subtopic: '',
        motivation: '',
        core1: '',
        core2: '',
        conclusion: ''
      });
      setMessages([
        {
          id: 'init-1',
          role: 'assistant',
          text: '안녕! 나는 초등학교 5학년 친구들의 발표 계획서 작성을 돕는 친근하고 따뜻한 AI 학습 조력자 피움(Pium)이야! 🌱\n\n시작하기 전에 피움이가 너를 뭐라고 부르면 좋을까? 너의 이름을 알려줘! 😊',
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setPiumExpression('happy');
    }
  };

  // Copy Plaintext Plan to Clipboard
  const handleCopyClipboard = () => {
    const textPlan = `
✨ 발표 계획서 꽃이 피었습니다!

[발표 주제]: ${plan.subtopic}
[만든 이]: ${plan.studentName}
[처음 (선택 동기)]: ${plan.motivation}
[가운데 (핵심 내용 1)]: ${plan.core1}
[가운데 (핵심 내용 2)]: ${plan.core2}
[끝 (실천/느낀 점)]: ${plan.conclusion}

* 피움이와 함께 작성해낸 소중한 발표 계획서입니다. 교과서 활동지나 선생님 과제용으로 사용하세요! `;

    navigator.clipboard.writeText(textPlan.trim()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('클립보드 복사 에러:', err);
    });
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Render checkmarks based on step completion
  const isStepDone = (checkStep: ConversationStep): boolean => {
    const stepOrder: ConversationStep[] = ['NAME', 'KEYWORD', 'SUBTOPIC_CHOOSE', 'MOTIVATION', 'CORE_1', 'CORE_2', 'CONCLUSION', 'FINISHED'];
    const activeIndex = stepOrder.indexOf(currentStep);
    const targetIndex = stepOrder.indexOf(checkStep);
    return activeIndex > targetIndex;
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#432818] font-sans antialiased flex flex-col" id="app_root_container">
      {/* Header Banner - Artistic Flair Styling */}
      <header className="bg-white/60 backdrop-blur-md border-b-2 border-dashed border-[#E2D9C8] relative py-4 px-6 select-none shrink-0 print:hidden" id="app_main_header">
        <div className="absolute top-0 right-0 p-3 opacity-15">
          <Sparkles className="w-24 h-24 text-[#AA8F83]" />
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF8FA3] rounded-full flex items-center justify-center text-white text-2xl shadow-sm">
              🌱
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#432818] flex items-center gap-2">
                발표 도우미 <span className="text-[#FF8FA3] font-black">피움(Pium)이</span>
              </h1>
              <p className="text-[#6E5340] text-[11.5px] mt-0.5 leading-relaxed font-semibold">
                초등 5학년 실과 디지털 저작도구(PPT, Canva) 활용 발표 기획 협동 교재 🌿
              </p>
            </div>
          </div>

          <div className="flex gap-2.5">
            {/* Reset Button */}
            <button
              id="header_reset_btn"
              onClick={handleReset}
              className="px-4 py-2 rounded-full bg-white hover:bg-[#FFFDF5] text-[#432818] border-2 border-[#E2D9C8] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#FF8FA3]" />
              <span>새로 만들기</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 print:p-0 print:block">
        
        {/* Left Side: Avatar Panel & Step Checklist (4 columns) */}
        <section className="lg:col-span-4 flex flex-col gap-6 print:hidden">
          {/* Avatar Area */}
          <PiumAvatar step={currentStep} expression={piumExpression} />

          {/* Stepped Greenhouse Timeline Progress */}
          <div className="bg-white rounded-2xl border-2 border-[#E2D9C8] chat-bubble p-4 md:p-5 flex-1 flex flex-col justify-between" id="pium_timeline_panel">
            <div>
              <h2 className="text-xs font-black uppercase text-[#6E5340] tracking-wider flex items-center gap-1.5 mb-3" id="timeline_title">
                <BookOpen className="w-4 h-4 text-[#FF8FA3]" />
                계획서 꽃봉오리 심기 현황
              </h2>

              <ul className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2D9C8]" id="timeline_list">
                {/* Seed: Name */}
                <li className="flex items-center gap-3 relative z-10" id="step_name_item">
                  <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isStepDone('NAME') || currentStep !== 'NAME'
                      ? 'bg-[#D4E09B]/40 text-[#432818] border-2 border-[#D4E09B]'
                      : 'bg-[#FFD97D] text-[#432818] ring-4 ring-[#FFD97D]/30 border-2 border-[#FF8FA3] font-black animate-pulse'
                  }`}>
                    👤
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${currentStep === 'NAME' ? 'text-[#432818]' : 'text-[#6E5340]'}`}>
                      1. 친구 명함 걸어두기
                    </span>
                    <span className="text-[10px] text-[#6E5340]/80 leading-tight">발표자 이름 기재</span>
                  </div>
                  {(isStepDone('NAME') || currentStep !== 'NAME') && <span className="ml-auto text-[#FF8FA3] font-bold">🌸</span>}
                </li>

                {/* Grow: Keyword */}
                <li className="flex items-center gap-3 relative z-10" id="step_keyword_item">
                  <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isStepDone('KEYWORD')
                      ? 'bg-[#D4E09B]/40 text-[#432818] border-2 border-[#D4E09B]'
                      : currentStep === 'KEYWORD'
                      ? 'bg-[#FFD97D] text-[#432818] ring-4 ring-[#FFD97D]/30 border-2 border-[#FF8FA3] font-black animate-pulse'
                      : 'bg-white border-2 border-[#E2D9C8] text-slate-400'
                  }`}>
                    ✍️
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${currentStep === 'KEYWORD' ? 'text-[#432818]' : 'text-[#6E5340]/60'}`}>
                      2. 생각 밭 가꾸기 (키워드)
                    </span>
                    <span className="text-[10px] text-[#6E5340]/50 leading-tight">주요 주제 단어 입력</span>
                  </div>
                  {isStepDone('KEYWORD') && <span className="ml-auto text-[#FF8FA3] font-bold">🌸</span>}
                </li>

                {/* Grow: Subtopic */}
                <li className="flex items-center gap-3 relative z-10" id="step_subtopic_item">
                  <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isStepDone('SUBTOPIC_CHOOSE')
                      ? 'bg-[#D4E09B]/40 text-[#432818] border-2 border-[#D4E09B]'
                      : currentStep === 'SUBTOPIC_CHOOSE'
                      ? 'bg-[#FFD97D] text-[#432818] ring-4 ring-[#FFD97D]/30 border-2 border-[#FF8FA3] font-black animate-pulse'
                      : 'bg-white border-2 border-[#E2D9C8] text-slate-400'
                  }`}>
                    🌻
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${currentStep === 'SUBTOPIC_CHOOSE' ? 'text-[#432818]' : 'text-[#6E5340]/60'}`}>
                      3. 상세한 소주제 돋보기
                    </span>
                    <span className="text-[10px] text-[#6E5340]/50 leading-tight">구체적인 연구 소주제 선정</span>
                  </div>
                  {isStepDone('SUBTOPIC_CHOOSE') && <span className="ml-auto text-[#FF8FA3] font-bold">🌸</span>}
                </li>

                {/* Motivation (Beginning) */}
                <li className="flex items-center gap-3 relative z-10" id="step_motivation_item">
                  <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isStepDone('MOTIVATION')
                      ? 'bg-[#D4E09B]/40 text-[#432818] border-2 border-[#D4E09B]'
                      : currentStep === 'MOTIVATION'
                      ? 'bg-[#FFD97D] text-[#432818] ring-4 ring-[#FFD97D]/30 border-2 border-[#FF8FA3] font-black animate-pulse'
                      : 'bg-white border-2 border-[#E2D9C8] text-slate-400'
                  }`}>
                    💡
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${currentStep === 'MOTIVATION' ? 'text-[#432818]' : 'text-[#6E5340]/60'}`}>
                      4. 발표 동기 마중물 (처음)
                    </span>
                    <span className="text-[10px] text-[#6E5340]/50 leading-tight">발표 소주제 선정 이유</span>
                  </div>
                  {isStepDone('MOTIVATION') && <span className="ml-auto text-[#FF8FA3] font-bold">🌸</span>}
                </li>

                {/* Core contents (Middle) */}
                <li className="flex items-center gap-3 relative z-10" id="step_cores_item">
                  <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isStepDone('CORE_2')
                      ? 'bg-[#D4E09B]/40 text-[#432818] border-2 border-[#D4E09B]'
                      : (currentStep === 'CORE_1' || currentStep === 'CORE_2')
                      ? 'bg-[#FFD97D] text-[#432818] ring-4 ring-[#FFD97D]/30 border-2 border-[#FF8FA3] font-black animate-pulse'
                      : 'bg-white border-2 border-[#E2D9C8] text-[#6E5340]'
                  }`}>
                    📌
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${(currentStep === 'CORE_1' || currentStep === 'CORE_2') ? 'text-[#432818]' : 'text-[#6E5340]/60'}`}>
                      5. 발표 알짜 정보 (가운데)
                    </span>
                    <span className="text-[10px] text-[#6E5340]/50 leading-tight">가장 중요한 핵심 정보 두 가지</span>
                  </div>
                  {isStepDone('CORE_2') && <span className="ml-auto text-[#FF8FA3] font-bold">🌸</span>}
                </li>

                {/* Conclusion (Ending) */}
                <li className="flex items-center gap-3 relative z-10" id="step_conclusion_item">
                  <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isStepDone('CONCLUSION')
                      ? 'bg-[#D4E09B]/40 text-[#432818] border-2 border-[#D4E09B]'
                      : currentStep === 'CONCLUSION'
                      ? 'bg-[#FFD97D] text-[#432818] ring-4 ring-[#FFD97D]/30 border-2 border-[#FF8FA3] font-black animate-pulse'
                      : 'bg-white border-2 border-[#E2D9C8] text-[#6E5340]'
                  }`}>
                    🤙
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${currentStep === 'CONCLUSION' ? 'text-[#432818]' : 'text-[#6E5340]/60'}`}>
                      6. 당부와 소감 보따리 (끝)
                    </span>
                    <span className="text-[10px] text-[#6E5340]/50 leading-tight">실천 약속 혹은 발표 준비 소감</span>
                  </div>
                  {isStepDone('CONCLUSION') && <span className="ml-auto text-[#FF8FA3] font-bold">🌸</span>}
                </li>
              </ul>
            </div>

            {/* Support Message */}
            <div className="mt-6 pt-4 border-t border-[#E2D9C8]/60 bg-[#FFFDF5] p-3 rounded-xl flex items-start gap-2 text-[10.5px] text-[#6E5340] leading-relaxed font-semibold" id="timeline_footer_note">
              <span className="text-base shrink-0">🎒</span>
              <span>
                초등학교 5학년 서술 활동의 격려형 피드백을 제공합니다. 계획서 양식을 마쳐 캔바(Canva)로 공유해 보세요!
              </span>
            </div>
          </div>
        </section>

        {/* Right Side: Conversation Console OR Final Display Plan (8 columns) */}
        <section className="lg:col-span-8 flex flex-col gap-6 print:block print:w-full">
          {currentStep !== 'FINISHED' ? (
            /* ACTIVE CONVERSATION FLOW CHAT CONSOLE */
            <div className="bg-white rounded-2xl border-2 border-[#E2D9C8] chat-bubble flex flex-col h-[610px] relative overflow-hidden" id="pium_chat_console">
              
              {/* Chat Title / Milestone Head */}
              <div className="bg-[#FFFDF5] border-b-2 border-dashed border-[#E2D9C8] py-3.5 px-5 flex items-center justify-between" id="chat_console_header">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#FF8FA3]" />
                  <span className="font-extrabold text-[#432818] text-sm">피움이와의 일대일 학습 정원</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#FF8FA3] animate-pulse"></span>
                  <span className="text-[11px] text-[#432818] font-bold bg-[#FF8FA3]/20 border border-[#FF8FA3]/35 px-2 py-0.5 rounded-full">실과 탐구 단원</span>
                </div>
              </div>

              {/* Chat Message Logs Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-amber-200" id="chat_logs_container">
                {messages.map((msg, index) => {
                  const isAssistant = msg.role === 'assistant';
                  return (
                    <div
                      key={msg.id || index}
                      className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} items-start gap-2`}
                    >
                      {isAssistant && (
                        <div className="w-8 h-8 rounded-full bg-[#FF8FA3]/10 flex items-center justify-center text-md border-2 border-[#FF8FA3] shrink-0 select-none">
                          🌱
                        </div>
                      )}
                      
                      <div className="flex flex-col space-y-1 max-w-[82%] relative">
                        {isAssistant && (
                          <span className="text-[9.5px] font-bold text-[#6E5340] px-1 select-none">피움이</span>
                        )}
                        <div className={`p-3.5 rounded-2xl text-[12.5px] font-medium leading-relaxed whitespace-pre-wrap break-all ${
                          isAssistant
                            ? 'bg-white border-2 border-[#E2D9C8] text-[#432818] rounded-tl-none shadow-xs'
                            : 'bg-[#FF8FA3] text-white rounded-tr-none shadow-xs font-semibold'
                        }`}>
                          {msg.text}
                        </div>
                        <span className={`text-[9px] text-[#6E5340]/60 absolute -bottom-4 ${isAssistant ? 'right-0' : 'left-0'} select-none`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Is Loading Indicators */}
                {isLoading && (
                  <div className="flex justify-start items-center gap-2.5" id="chat_loading_indicator">
                    <div className="w-8 h-8 rounded-full bg-[#FF8FA3]/10 flex items-center justify-center text-md border-2 border-[#E2D9C8] shrink-0">
                      🌱
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-[9.5px] font-bold text-[#6E5340] px-1 select-none">피움이</span>
                      <div className="bg-white p-3 rounded-2xl flex items-center gap-2 border-2 border-[#E2D9C8] shadow-xs">
                        <span className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-[#FF8FA3] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-1.5 h-1.5 bg-[#FF8FA3] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-1.5 h-1.5 bg-[#FF8FA3] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </span>
                        <span className="text-xs text-[#FF8FA3] font-bold">생각을 가꾸는 중... 🌱</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* DYNAMIC MIDDLEWARE: Selecting proposed subtopics cards if at Stage 2 */}
              {currentStep === 'SUBTOPIC_CHOOSE' && suggestedSubtopics.length > 0 && (
                <div className="bg-[#FFFDF5] border-t-2 border-[#E2D9C8] p-4 space-y-2.5 animate-fadeIn" id="subtopic_suggestions_panel">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-[#FF8FA3]" />
                    <span className="text-xs font-black text-[#432818]">피움이가 추천하는 초등 5학년 맞춤형 소주제:</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {suggestedSubtopics.map((topic, i) => (
                      <button
                        key={i}
                        onClick={() => handleSubtopicSelect(topic)}
                        disabled={isLoading}
                        className="text-left bg-white p-3 rounded-xl border-2 border-[#E2D9C8] hover:border-[#FF8FA3] hover:shadow-xs text-xs font-bold text-[#432818] leading-normal transition-all active:scale-[0.98] cursor-pointer"
                      >
                        <span className="text-[#FF8FA3] font-black block text-[10px] mb-0.5">추천 주제 {i+1}</span>
                        {topic}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-[#6E5340]">💡 마음에 드는 카드를 콕 누르면 자동 선택돼 피움이에게 전송돼요!</p>
                </div>
              )}

              {/* SENTENCE STARTERS: Scaffold basket (생각 주머니) */}
              {currentStep !== 'NAME' && currentStep !== 'SUBTOPIC_CHOOSE' && (
                <div className="bg-white/80 border-t-2 border-dashed border-[#E2D9C8] p-3 flex flex-wrap gap-2 items-center" id="sentence_starters_panel">
                  <div className="text-[10px] font-black text-[#6E5340] flex items-center gap-1 select-none">
                    <span>💡 문장 생각 주머니 🎁:</span>
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto py-1 scrollbar-none w-full md:w-auto">
                    {getStartersForStep().map((starter, i) => (
                      <button
                        key={i}
                        onClick={() => handleStartersSelect(starter)}
                        disabled={isLoading}
                        className="bg-[#FFFDF5] border-2 border-[#E2D9C8] text-[#432818] rounded-full px-3  py-1 text-[11px] font-bold hover:border-[#FF8FA3] hover:text-[#FF8FA3] hover:shadow-inner transition-all shrink-0 cursor-pointer"
                      >
                        {currentStep === 'KEYWORD' ? `#${starter}` : starter}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Input Submission form */}
              <div className="p-3 bg-[#FFFDF5] border-t-2 border-[#E2D9C8] flex items-center gap-3" id="main_input_form">
                {/* Main text message form */}
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      handleSend();
                    }
                  }}
                  disabled={isLoading}
                  className="flex-1 bg-white border-2 border-[#E2D9C8] rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#FF8FA3] focus:ring-0 text-[#432818] placeholder-[#6E5340]/50"
                  placeholder={
                    isLoading 
                      ? "피움이가 생각을 싹 틔울 수 있게 잠시 기다려보자..." 
                      : "여기에 하고 싶은 이야기를 멋지게 적어보아요..."
                  }
                  id="chat_text_input"
                />

                {/* Send Button */}
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !userInput.trim()}
                  className="p-2.5 rounded-xl bg-[#FF8FA3] hover:bg-[#FF8FA3]/90 text-white disabled:bg-slate-200 disabled:text-slate-400 disabled:opacity-50 shrink-0 transition-all cursor-pointer"
                  id="chat_send_btn"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            /* COMPLETED TREASURE PRESENTATION PLAN & SLIDETIPS */
            <div className="space-y-6" id="completed_plan_container">
              
              {/* Grand Finished presentation plan certificate */}
              <div className="bg-white rounded-3xl border-2 border-[#E2D9C8] chat-bubble p-6 relative overflow-hidden print:border-none print:shadow-none print:p-0" id="finished_certificate_card">
                
                {/* Visual flower stamp badge top corner */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#FF8FA3]/15 rounded-full flex items-center justify-center text-[#FF8FA3] rotate-12 opacity-40 select-none print:hidden">
                  <span className="text-6xl font-black">🌱</span>
                </div>

                <div className="text-center space-y-1.5 pb-5 border-b-2 border-dashed border-[#E2D9C8]">
                  <div className="inline-block bg-[#FF8FA3] text-white font-black px-4 py-1 rounded-full text-xs tracking-wider uppercase shadow-2xs">
                    🏆 PRESENTATION PLAN SUCCESS
                  </div>
                  <h2 className="text-md md:text-lg font-black tracking-tight text-[#432818] mt-2">
                    ✨ {plan.studentName}이가 완성한 발표 계획서 꽃이 피었습니다! ✨
                  </h2>
                  <p className="text-[#6E5340] text-xs font-semibold">
                    피움이와 함께 힘을 합쳐 만들어낸 아주 귀중하고 꼼꼼한 초등 발표 계획서입니다.
                  </p>
                </div>

                {/* Completed Plan Grid Sheet Table */}
                <div className="my-6 overflow-hidden rounded-2xl border-2 border-[#E2D9C8] select-all print:border-slate-800" id="completed_plan_table_wrapper">
                  <table className="min-w-full divide-y-2 divide-[#E2D9C8] print:divide-slate-800">
                    <thead className="bg-[#FFFDF5] print:bg-slate-100">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-black text-[#432818] tracking-wider w-[22%]">
                          구분
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-black text-[#432818] tracking-wider">
                          계획서 내역
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[#E2D9C8] print:divide-slate-800">
                      <tr>
                        <td className="px-4 py-3 text-xs font-black text-[#432818] bg-[#D4E09B]/20 whitespace-nowrap">
                          발표 주제
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-[#432818] leading-relaxed">
                          {plan.subtopic || `[키워드 : ${plan.keyword}]`}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-xs font-black text-[#432818] bg-[#D4E09B]/20 whitespace-nowrap">
                          만든 이 (기록자)
                        </td>
                        <td className="px-4 py-3 text-xs font-extrabold text-[#FF8FA3]">
                          {plan.studentName} (초등학교 5학년)
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-xs font-black text-[#432818] bg-[#D4E09B]/20">
                          처음 (동기)
                        </td>
                        <td className="px-4 py-3 text-xs text-[#432818] leading-relaxed font-semibold">
                          {plan.motivation}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-xs font-black text-[#432818] bg-[#D4E09B]/20">
                          가운데 (핵심 내용)
                        </td>
                        <td className="px-4 py-3 text-xs text-[#432818] leading-relaxed space-y-2 font-semibold">
                          <p className="flex items-start gap-1 pb-1">
                            <span className="text-[#FF8FA3] text-[10px] font-extrabold bg-[#FF8FA3]/20 rounded-full px-1.5 py-0.5 border border-[#FF8FA3]/30">핵심 ❶</span>
                            <span>{plan.core1}</span>
                          </p>
                          <p className="flex items-start gap-1 border-t border-[#E2D9C8]/40 pt-1.5">
                            <span className="text-[#6E5340] text-[10px] font-extrabold bg-[#FFD97D]/30 rounded-full px-1.5 py-0.5 border border-[#FFD97D]/60 font-black">핵심 ❷</span>
                            <span>{plan.core2}</span>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-xs font-black text-[#432818] bg-[#D4E09B]/20">
                          끝 (느낀 점/소감)
                        </td>
                        <td className="px-4 py-3 text-xs text-[#432818] leading-relaxed font-semibold">
                          {plan.conclusion}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Control Action Tools - Copy, Print, New draft */}
                <div className="flex flex-wrap gap-2.5 justify-center print:hidden border-t-2 border-dashed border-[#E2D9C8] pt-4" id="certificate_footer_actions">
                  {/* Copy Button */}
                  <button
                    onClick={handleCopyClipboard}
                    className={`px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 tracking-tight transition-all cursor-pointer ${
                      copied
                        ? 'bg-[#FF8FA3] text-white scale-102 shadow-sm border-2 border-[#FF8FA3]'
                        : 'bg-[#FFFDF5] hover:bg-[#FFD97D]/10 text-[#432818] border-2 border-[#E2D9C8]'
                    }`}
                    id="chart_copy_plain_btn"
                  >
                    <Copy className="w-4 h-4 text-[#FF8FA3]" />
                    <span>{copied ? '클립보드 복사 성공! 👍' : '텍스트 전체 복사하기'}</span>
                  </button>

                  {/* Print Button */}
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2.5 rounded-full bg-[#FF8FA3] hover:opacity-90 text-white border-2 border-[#FF8FA3] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                    id="chart_print_btn"
                  >
                    <Printer className="w-4 h-4" />
                    <span>인쇄하여 교과서에 붙이기 (Print)</span>
                  </button>

                  {/* Reset Button */}
                  <button
                    onClick={handleReset}
                    className="px-4 py-2.5 rounded-full border-2 border-[#E2D9C8] bg-white hover:bg-[#FFFDF5] text-[#432818] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                    id="chart_reset_new_btn"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#FF8FA3]" />
                    <span>새 계획서 정원 가꾸기</span>
                  </button>
                </div>
              </div>

              {/* Slide tips interactive visual mock layouts */}
              <div className="print:hidden">
                <SlideTips plan={plan} />
              </div>

              {/* Bottom motivation cards */}
              <div className="bg-[#D4E09B]/25 rounded-2xl border-2 border-[#D4E09B] p-5 shrink-0 flex items-start gap-3 print:hidden shadow-xs" id="teacher_motivation_card">
                <div className="text-3xl mt-0.5 shrink-0">👏</div>
                <div className="space-y-1">
                  <p className="text-[#432818] text-xs font-black">피움이 선생님의 마지막 조언:</p>
                  <p className="text-[#6E5340] text-sm leading-relaxed handwriting font-gaegu font-bold">
                    "완성한 계획서를 복사해서 캔바(Canva)나 미리캔버스, 파워포인트를 켜고 5개 슬라이드를 뚝딱 만들어보자! 
                     친구들에게 최고의 발표 선물이 될 거야! 너의 노력의 꽃이 활짝 필 수 있게 늘 응원할게!"
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

      </main>

      {/* Plane 2: Peer Classmates Garden */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-6 pb-16 print:hidden" id="peers_garden_section">
        <div className="bg-white rounded-3xl border-2 border-[#E2D9C8] p-6 md:p-8 space-y-6">
          
          {/* Garden Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-dashed border-[#E2D9C8] pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#D4E09B]/45 rounded-2xl flex items-center justify-center text-2xl border-2 border-[#D4E09B]">
                🌸
              </div>
              <div>
                <h2 className="text-[#432818] text-base md:text-lg font-black flex items-center gap-2">
                  다른 친구들의 발표 생각 정원 <span className="bg-[#D4E09B]/70 text-[#432818] text-[10.5px] font-black px-2.5 py-0.5 rounded-full">우리 반 모아보기</span>
                </h2>
                <p className="text-[#6E5340] text-xs font-semibold mt-0.5">
                  5학년 친구들이 정성껏 피워낸 멋진 발표 계획서들을 살펴보고 유익한 영감을 얻어보아요! 🪴
                </p>
              </div>
            </div>

            {/* Quick Stats count of plans */}
            <div className="bg-[#FFFDF5] border-2 border-[#E2D9C8] px-4 py-2 rounded-xl flex items-center gap-2">
              <span className="text-[11px] text-[#6E5340] font-bold">자라난 생각 꽃송이:</span>
              <span className="text-sm text-[#FF8FA3] font-black">{peersPlans.length}개</span>
            </div>
          </div>

          {/* Search bar & Tag selector filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-[#AA8F83] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="친구 이름이나 주제, 키워드를 찾아보세요..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFFDF5] border-2 border-[#E2D9C8] rounded-xl text-xs font-bold text-[#432818] placeholder-[#AA8F83] focus:outline-none focus:border-[#FF8FA3]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AA8F83] hover:text-[#FF8FA3] p-1 cursor-pointer border-0 bg-transparent"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Tags list */}
            <div className="md:col-span-7 flex flex-wrap gap-1.5 justify-start md:justify-end">
              {['전체', '스마트폰', '기후변화', '바른 언어', '반려동물'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-black transition-all cursor-pointer border-2 ${
                    selectedTag === tag
                      ? 'bg-[#FF8FA3] border-[#FF8FA3] text-white shadow-xs'
                      : 'bg-[#FFFDF5] border-[#E2D9C8] text-[#6E5340] hover:bg-[#FFFDF5]/40 hover:border-[#FF8FA3]/60'
                  }`}
                >
                  {tag === '전체' ? '📍 모두 보기' : `#${tag}`}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          {peersPlans.filter(p => {
            const matchesSearch = 
              p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.subtopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.keyword.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTag = selectedTag === '전체' || p.keyword === selectedTag;
            return matchesSearch && matchesTag;
          }).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {peersPlans.filter(p => {
                const matchesSearch = 
                  p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.subtopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.keyword.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesTag = selectedTag === '전체' || p.keyword === selectedTag;
                return matchesSearch && matchesTag;
              }).map((p, idx) => {
                const themes = [
                  { bg: 'bg-[#FFF9FA] border-[#FF8FA3]/40 hover:border-[#FF8FA3]', badge: 'bg-[#FF8FA3]/15 text-[#FF8FA3]' },
                  { bg: 'bg-[#FAFDF6] border-[#D4E09B]/50 hover:border-[#D4E09B]', badge: 'bg-[#D4E09B]/40 text-[#432818]' },
                  { bg: 'bg-[#FFFDF5] border-[#FFD97D]/50 hover:border-[#FFD97D]', badge: 'bg-[#FFD97D]/30 text-[#432818]' },
                  { bg: 'bg-[#FAF9F5] border-[#AA8F83]/40 hover:border-[#AA8F83]', badge: 'bg-[#AA8F83]/15 text-[#432818]' }
                ];
                const theme = themes[idx % themes.length];

                return (
                  <div
                    key={p.id || idx}
                    onClick={() => setSelectedPeerPlan(p)}
                    className={`rounded-2xl border-2 p-5 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md ${theme.bg}`}
                  >
                    <div className="space-y-3.5">
                      {/* Card meta: Name badge */}
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${theme.badge}`}>
                          👤 {p.studentName} 친구
                        </span>
                        <span className="text-[9px] text-[#6E5340]/60 font-mono font-bold">
                          {p.createdAt ? p.createdAt.split(' ')[0] : '방금 전'}
                        </span>
                      </div>

                      {/* Card Subtopic */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#FF8FA3] font-extrabold block">#{p.keyword || '주제'}</span>
                        <h3 className="text-xs font-black text-[#432818] line-clamp-2 leading-relaxed h-[36px]">
                          {p.subtopic}
                        </h3>
                      </div>
                    </div>

                    {/* Footer btn layout */}
                    <div className="mt-5 pt-3 border-t border-[#E2D9C8]/40 flex items-center justify-between text-[10.5px]">
                      <span className="text-[#6E5340] font-bold">기획안 상세</span>
                      <span className="text-[#FF8FA3] font-black flex items-center gap-0.5 transition-transform">
                        살펴보기 🔍
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#FFFDF5] rounded-2xl border-2 border-[#E2D9C8] border-dashed p-12 text-center space-y-2">
              <span className="text-4xl block">🌾</span>
              <p className="text-[#6E5340] text-xs font-bold">
                검색 조건이나 선택한 해시태그와 일치하는 친구의 꽃송이가 없어요.
              </p>
              <p className="text-[10.5px] text-[#6E5340]/70">
                다른 이름이나 키워드로 새로 검색해 보거나 해시태그 필터를 조율해 보렴!
              </p>
            </div>
          )}

        </div>
      </section>

      {/* Selected Peer Plan Expanded Details Dialog Backdrop Modal */}
      {selectedPeerPlan && (
        <div className="fixed inset-0 z-50 bg-[#432818]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn" id="peer_detail_modal">
          <div className="bg-[#FFFDF5] w-full max-w-5xl rounded-3xl border-3 border-[#E2D9C8] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="bg-white border-b-2 border-dashed border-[#E2D9C8] p-4 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🌱</span>
                <div>
                  <h3 className="text-[#432818] text-sm font-black flex items-center gap-2">
                    {selectedPeerPlan.studentName} 친구의 반짝이는 발표 계획서 분석서
                  </h3>
                  <p className="text-[11px] text-[#6E5340] font-semibold">
                    이 계획서를 바탕으로 완성한 슬라이드 배치 시안을 함께 살펴볼까요?
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedPeerPlan(null)}
                className="w-8 h-8 rounded-full bg-[#FFFDF5] hover:bg-[#FF8FA3]/20 hover:text-[#FF8FA3] border border-[#E2D9C8] flex items-center justify-center text-slate-500 transition-all cursor-pointer border-0"
                id="modal_close_btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Container */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Column Left: Plan Information Table Layout (5 Cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-white p-4 rounded-2xl border-2 border-[#E2D9C8] chat-bubble space-y-3">
                    <h4 className="text-xs font-black text-[#FF8FA3] flex items-center gap-1 border-b border-[#E2D9C8]/50 pb-2">
                      📋 한눈에 보는 기획 요약
                    </h4>

                    <div className="space-y-3 divide-y divide-[#E2D9C8]/50 text-[11.5px]">
                      <div className="pt-1">
                        <span className="text-[10px] text-[#6E5340] font-bold block mb-0.5">발표 대주제 (키워드)</span>
                        <p className="font-extrabold text-[#432818] bg-[#D4E09B]/20 px-2 py-1 rounded inline-block text-[11px]">
                          🌿 {selectedPeerPlan.keyword}
                        </p>
                      </div>

                      <div className="pt-2">
                        <span className="text-[10px] text-[#6E5340] font-bold block mb-1">상세 소주제</span>
                        <p className="font-black text-[#432818] leading-relaxed">
                          {selectedPeerPlan.subtopic}
                        </p>
                      </div>

                      <div className="pt-2">
                        <span className="text-[10px] text-[#6E5340] font-bold block mb-1">처음 (선택 동기)</span>
                        <p className="font-semibold text-[#6E5340] leading-relaxed">
                          "{selectedPeerPlan.motivation}"
                        </p>
                      </div>

                      <div className="pt-2">
                        <span className="text-[10px] text-[#6E5340] font-bold block mb-1">가운데 (핵심 내용 두 가지)</span>
                        <div className="space-y-1.5 font-semibold text-[#6E5340]">
                          <p className="flex items-start gap-1 p-1 bg-[#FFFDF5] border border-[#E2D9C8]/40 rounded">
                            <span className="text-[#FF8FA3] text-[9px] font-black shrink-0 bg-[#FF8FA3]/15 px-1 rounded">1</span>
                            <span>{selectedPeerPlan.core1}</span>
                          </p>
                          <p className="flex items-start gap-1 p-1 bg-[#FFFDF5] border border-[#E2D9C8]/40 rounded">
                            <span className="text-[#FFD97D] text-[9px] font-black shrink-0 bg-[#FFD97D]/30 px-1 rounded">2</span>
                            <span>{selectedPeerPlan.core2}</span>
                          </p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <span className="text-[10px] text-[#6E5340] font-bold block mb-1">끝 (실천 다짐 및 소감)</span>
                        <p className="font-semibold text-[#432818] bg-[#FFD97D]/10 p-2.5 rounded-xl border border-[#FFD97D]/40 leading-relaxed">
                          "{selectedPeerPlan.conclusion}"
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`${selectedPeerPlan.studentName} 친구의 키워드 [${selectedPeerPlan.keyword}]와 소주제를 삼아 나만의 지혜를 보태볼까요??? (기존 작성 내용은 새로 시작돼요!)`)) {
                        setCurrentStep('MOTIVATION');
                        setPlan({
                          studentName: plan.studentName || '나',
                          keyword: selectedPeerPlan.keyword,
                          subtopic: selectedPeerPlan.subtopic,
                          motivation: '',
                          core1: '',
                          core2: '',
                          conclusion: ''
                        });
                        setMessages([
                          {
                            id: Date.now().toString() + "-pium-inspire",
                            role: 'assistant',
                            text: `멋진 선택이야! ${plan.studentName || '나'} 친구도 ${selectedPeerPlan.studentName} 친구처럼 스마트하게 **'${selectedPeerPlan.subtopic}'**으로 마스터피스 기획서를 채워보자! 🔥\n\n그럼 너만의 독창적인 **[선택 동기(처음)]**를 지어 아래 채팅창에 입력해 볼래?`,
                            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
                          }
                        ]);
                        setSelectedPeerPlan(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="w-full py-3 rounded-2xl bg-[#D4E09B] hover:bg-[#D4E09B]/80 text-[#432818] text-xs font-black border-2 border-[#D4E09B] transition-all hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>💡 이 친구 기획안 본보기로 영감 받기 (Template 사용)</span>
                  </button>
                </div>

                {/* Column Right: Dynamic Interactive Slide Previews (7 Cols) */}
                <div className="lg:col-span-7">
                  <div className="bg-white overflow-hidden rounded-2xl border-2 border-[#E2D9C8] p-1 shadow-sm">
                    <SlideTips plan={selectedPeerPlan} />
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#FFFDF5] border-t-2 border-[#E2D9C8] p-4 flex justify-end sticky bottom-0 z-10">
              <button
                onClick={() => setSelectedPeerPlan(null)}
                className="px-5 py-2.5 rounded-full bg-[#FF8FA3] text-white hover:opacity-90 font-black text-xs cursor-pointer shadow-xs border-0"
              >
                생각 정원으로 돌아가기 🌸
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer Banner */}
      <footer className="bg-white/60 border-t-2 border-dashed border-[#E2D9C8] py-4 px-6 text-center text-xs text-[#6E5340] font-semibold tracking-tight leading-relaxed select-none shrink-0 print:hidden mt-auto" id="app_main_footer">
        <p>Copyright © 2026 초등발표연구교육원. All material designed with Pium-i assistant framework.</p>
        <p className="text-[#AA8F83] mt-0.5 text-[10.1px]">본 저작권 보호장치는 초등학교 5학년 저작 도구 과정의 교실 환경에 호환됩니다.</p>
      </footer>
    </div>
  );
}
