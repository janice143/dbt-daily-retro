export interface ReflectionInput {
  did: string;
  bad: string;
  thinking: string;
}

export interface AIAnalysis {
  essence: string;
  key_insight: string;
  actionable_steps: string[];
  encouragement: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export const DEFAULT_INPUT: ReflectionInput = {
  did: '',
  bad: '',
  thinking: ''
};

export type Language = 'en' | 'zh';