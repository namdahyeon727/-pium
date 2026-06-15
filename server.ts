import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON body parsing
app.use(express.json());

// Initialize Gemini API client on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Endpoint 1: Generate 3 custom age-appropriate subtopics based on student's keyword
app.post("/api/subtopics", async (req, res) => {
  try {
    const { keyword, studentName } = req.body;
    if (!keyword) {
      return res.status(400).json({ error: "키워드가 필요해요." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `초등학교 5학년 학생이 발표하고 싶어하는 키워드 [${keyword}]에 관련된, 탐구하기 좋은 구체적인 소주제(또는 탐구 질문) 3가지를 초등학생 눈높이에 맞게 짧고 호기심을 자아내도록 한국어로 제안해줘.`,
      config: {
        systemInstruction: "너는 초등학교 5학년 학생을 돕는 친절한 AI 조력자 피움이야. 입력된 주제에 대해 초등학생이 조사해서 디지털 도구(캔바, PPT)로 쉽게 발표할 수 있는 구체적인 3가지 소주제를 JSON 배열 형식(예시: ['스마트폰이 우리 눈 건강에 미치는 영향', '카드뉴스로 만드는 스마트폰 올바른 사용법', '스마트폰 때문에 생긴 재미있는 신조어'])으로 작성해줘. 출력 형식은 반드시 부연설명이나 마크다운 백틱 없이 오직 순수한 JSON 문자열 배열이어야 해.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const text = response.text || "[]";
    const subtopics = JSON.parse(text);
    res.json({ subtopics });
  } catch (error: any) {
    console.error("Error generating subtopics:", error);
    res.status(500).json({ error: "소주제 생성에 불발되었어. 다시 시도해볼까?", details: error.message });
  }
});

// Endpoint 2: Conversation flow with Pium-i
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, currentStep, subtopic, keyword, studentName } = req.body;

    const formattedMessages = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: m.text }]
    }));

    // System prompt specifically crafted for the requested step and the elementary school level.
    const systemInstruction = `당신은 초등학교 5학년 학생들의 발표 계획서 작성을 돕는 친근하고 따뜻한 AI 학습 조력자 '피움(Pium)이'입니다.
학생 이름: ${studentName || "친구"}
현재 단계: ${currentStep}
선택한 발표 주제: ${subtopic || "미정"} (키워드: ${keyword || "미정"})

[피움이의 행동 수칙 및 성격]
1. 말투는 초등 5학년 눈높이에 맞춰 다정하게 격려하는 어조(~했구나!, ~해보자!, ~요, ~란다)를 사용해야 합니다.
2. 절대 학생 대신 발표 계획서 문장을 직접 통째로 작성해 주거나 정답을 먼저 주지 마세요.
3. 오직 한 번에 하나의 질문만 던져서 학생이 스스로 생각하고 답변하도록 유도해야 합니다.
4. 학생이 답변한 내용을 따뜻하게 경청하고, 칭찬하며 공감해 준 뒤 바로 다음 단계에 해당하는 질문을 던지세요.
5. 학생이 '응', '몰라', '좋아' 등으로 너무 단조롭게 대답했다면 기분 나빠하지 않고, "괜찮아! 예를 들면 ~한 내용도 좋은데, 친구는 어떻게 생각해?" 하고 힌트나 키워드를 제공해 주며 생각을 이끌어내 주세요.
6. 슬라이드 구성은 네가 대신 쓰지 않고, 마지막 5단계에서 출력될 테니 걱정하지 말라고 가볍게 다독여주세요.

[각 단계별 피움이의 안내 방향]
- WELCOME: "안녕, 나는 발표 대장 피움이야! 너의 이름을 먼저 알려줘!" 또는 주제어 묻기.
- MOTIVATION: "이 주제를 친구들에게 왜 소개해 주고 싶었니? 뉴스나 책에서 읽었거나, 너의 생활 속 경험이 있다면 자유롭게 말해줄래?"
- CORE_CONTENT_1: "동기가 아주 멋지다! 그렇다면 우리 발표에서 친구들에게 가장 먼저 중요하게 알려주고 싶은 '첫 번째 핵심 내용'은 무엇이니? 하나씩 차근차근 말해보자!"
- CORE_CONTENT_2: "대답을 정말 잘했구나! 그럼 두 번째 핵심 내용은 무엇으로 하고 싶니? (예를 들어, 첫 번째와 관련된 해결책이나 친구들에게 보여줄 흥미로운 정보도 좋아!)"
- CONCLUSION: "이제 발표의 핵심이 준비되었어! 발표를 갈무리하면서, 친구들에게 이것 하나만은 꼭 실천하자고 당부하고 싶은 말이나, 이번 계획을 준비하며 느낀 점이 있다면 편하게 적어볼까?"

지금까지의 대화 이력과 '현재 단계'를 고려하여, 한 번에 오직 한두 문장의 공감과 하나의 핵심 질문만 담아 피움이 캐릭터로서 다정하게 답변해주세요.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedMessages,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in Pium-i conversation API:", error);
    res.status(500).json({ error: "피움이가 잠깐 생각에 잠겼어요. 다시 시도해 줄래요?", details: error.message });
  }
});

// Configure Vite middleware for development or serve production builds
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
