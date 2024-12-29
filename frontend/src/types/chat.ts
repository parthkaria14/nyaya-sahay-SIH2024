export type QueryType = 'normal' | 'templates' | 'caseStatus';

export interface Attachment {
  name: string;
  type: string;
  url: string;
  size?: number;
}

export interface Template {
  id: string;
  name: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: QueryType;
  templates?: Template[];
  caseStatus?: {
    cnrNumber: string;
    result: string;
  };
}

export interface ChatResponse {
  id: string;
  content: string;
  timestamp: string;
}

export interface FeedbackPayload {
  messageId: string;
  feedback: 'like' | 'dislike';
  timestamp: string;
}

export interface CaseStatusResponse {
  success: boolean;
  result: string;
  captcha_base64?: string;
}