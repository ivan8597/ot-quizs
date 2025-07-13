export interface Option {
  id: number;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
  correctOptionId: number;
  ntd?: string;
}

export interface TestResultHistory {
  id: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  answers: Record<string, any>;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface TestResult {
  question: Question;
  userAnswer: number;
  isCorrect: boolean;
}

export interface TestResultsData {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  questionResults: TestResult[];
  answers: Record<string, any>;
}