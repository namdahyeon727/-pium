export type ConversationStep = 
  | 'NAME'            // 0: Ask for child's name
  | 'KEYWORD'         // 1: Ask for presentation keyword (topic word)
  | 'SUBTOPIC_CHOOSE' // 2: Gemini suggests 3 subtopics, child picks or types custom
  | 'MOTIVATION'     // 3: Ask for the motivation (처ם)
  | 'CORE_1'          // 4: Ask for core content 1 (가운데 1)
  | 'CORE_2'          // 5: Ask for core content 2 (가운데 2)
  | 'CONCLUSION'      // 6: Ask for conclusion and advice/feeling (끝)
  | 'FINISHED';       // 7: Output final plan & slides guide

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  timestamp: string;
}

export interface PresentationPlan {
  studentName: string;
  keyword: string;
  subtopic: string;
  motivation: string;
  core1: string;
  core2: string;
  conclusion: string;
}

export type PiumExpression = 'default' | 'happy' | 'thinking' | 'proud' | 'talking';
