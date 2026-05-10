import { Dispatch, SetStateAction } from "react";

export interface Roadmap {
  skill: string;

  user_profile: UserProfile;

  roadmap_summary: RoadmapSummary;

  phases: Phase[];

  weekly_breakdown: WeeklyBreakdown[];

  final_capstone_project?: FinalCapstoneProject;

  success_metrics: string[];

  career_next_steps: string[];
}

/* ================= USER PROFILE ================= */

export interface UserProfile {
  current_level: string;
  hours_per_day: number;
  total_weeks: number;
  total_estimated_hours: number;
}

/* ================= SUMMARY ================= */

export interface RoadmapSummary {
  goal: string;
  strategy_overview: string;
  expected_outcome: string;
}

/* ================= PHASE ================= */

export interface Phase {
  phase_number: number;
  phase_title: string;
  duration_weeks: number;
  phase_objective: string;

  topics: Topic[];
  projects?: Project[];
  milestones?: string[];
  resources: Resources;
}

/* ================= TOPICS ================= */

export interface Topic {
  topic_name: string;
  subtopics: string[];
}

/* ================= PROJECT ================= */

export interface Project {
  project_title: string;
  description: string;
  key_features?: string[];
  skills_applied?: string[];
  estimated_hours: number;
}

/* ================= RESOURCES ================= */

export interface Resources {
  documentation?: ResourceItem[];
  courses?: CourseResource[];
  youtube_channels?: ResourceItem[];
  books?: ResourceItem[];
  practice_platforms?: ResourceItem[];
}

export interface ResourceItem {
  name: string;
  link: string;
}

export interface CourseResource {
  name: string;
  platform: string;
  type: "free" | "paid";
  link: string;
}

/* ================= WEEKLY BREAKDOWN ================= */

export interface WeeklyBreakdown {
  week: number;
  daily_focus: string;
  deliverables: string[];
  study_hours_target: number;
}

/* ================= FINAL CAPSTONE ================= */

export interface FinalCapstoneProject {
  title: string;
  description: string;
  requirements: string[];
  skills_demonstrated: string[];
  estimated_hours: number;
}

export interface RoadmapGeneratorSectionProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;

  currentLevel: string;
  setCurrentLevel: React.Dispatch<React.SetStateAction<string>>;

  hours: string;
  setHours: React.Dispatch<React.SetStateAction<string>>;

  duration: string;
  setDuration: React.Dispatch<React.SetStateAction<string>>;

  handleGenerate: () => void;
  loading: boolean;
}

export interface InterviewSetupProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;

  selectedRoadmap: any | null;
  setSelectedRoadmap: Dispatch<SetStateAction<any | null>>;

  userInput: string;
  setUserInput: Dispatch<SetStateAction<string>>;

  pdfUploaded: boolean;
  setPdfUploaded: Dispatch<SetStateAction<boolean>>;

  config: {
    difficulty: string;
    topic: string;
    interviewType: string;
  };
  setConfig: Dispatch<
    SetStateAction<{
      difficulty: string;
      topic: string;
      interviewType: string;
    }>
  >;

  generateInterview: () => Promise<void>;
}

export enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

export interface SavedMessages {
  role: "user" | "system" | "assistant";
  content: string;
}

export interface InterviewSessionProps {
  time: number;
  setTime: Dispatch<SetStateAction<number>>;

  messages: SavedMessages[];

  callStatus: CallStatus;

  isSpeaking: boolean;

  handleCallConnect: () => void | Promise<void>;
  handleCallDisconnect: () => void;
}

export interface CategoryScore {
  category: string;
  score: number;
  justification: string;
}

export interface FeedbackProps {
  overallScore: number;
  overallPerformanceSummary: string;
  readinessAssessment: string;
  categoryScores: CategoryScore[];
  strengths: string[];
  criticalImprovementAreas: string[];
  roadmapOrGoalAlignment: string;
  actionableNextSteps: string[];
  finalVerdict: string;
}

/* ================= QUIZ TYPES ================= */

export interface QuizQuestion {
  id: number;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  category: string;
  tags: string[];
  whyOthersWrong?: { [key: string]: string };
}

export interface QuizTemplate {
  _id?: string;
  topic: string;
  difficulty: "Basic" | "Intermediate" | "Advanced" | "Mixed";
  questionCount: number;
  timeLimit: number;
  templateKey: string;
  questions: QuizQuestion[];
  metadata?: {
    averageScore?: number;
    totalAttempts?: number;
    passRate?: number;
    createdAt?: Date;
    updatedAt?: Date;
  };
}

export interface QuizAttempt {
  _id?: string;
  userId: string;
  quizTemplateId: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  timeLimit: number;
  score: {
    obtained: number;
    total: number;
    percentage: number;
    correctAnswers: number;
    wrongAnswers: number;
    skipped: number;
  };
  startedAt: Date;
  submittedAt?: Date;
  timeSpent: number;
  answers: {
    questionId: number;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
  }[];
  categoryWisePerformance?: {
    [key: string]: { correct: number; total: number; percentage: number };
  };
  userLevelBefore?: string;
  userLevelAfter?: string;
  levelChange?: string;
  insights?: {
    strengths: string[];
    weaknesses: string[];
    recommendedTopics: string[];
  };
  status: "in-progress" | "completed" | "auto-submitted";
  feedback?: string;
}

export interface UserTopicLevel {
  userId: string;
  topic: string;
  currentLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  levelScore: number;
  totalPoints: number;
  performance: {
    totalAttempts: number;
    averageScore: number;
    bestScore: number;
    worstScore: number;
    improvementRate: number;
  };
  streak?: {
    currentStreak: number;
    longestStreak: number;
    lastAttemptDate: Date;
  };
}
