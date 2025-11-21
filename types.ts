
export interface ReflectionItem {
  id: string;
  title: string;
  description: string;
}

export interface ReflectionInput {
  did: string[];
  bad: ReflectionItem[];
  thinking: ReflectionItem[];
}

export interface AnalysisModule {
  related_item_title: string;
  theory: string;
  explanation: string;
  actions: string[];
}

export interface AIAnalysis {
  bad_modules: AnalysisModule[];
  thinking_modules: AnalysisModule[];
  encouragement: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export const DEFAULT_INPUT: ReflectionInput = {
  did: [''],
  bad: [{ id: '1', title: '', description: '' }],
  thinking: [{ id: '1', title: '', description: '' }]
};

export type Language = 'en' | 'zh';
