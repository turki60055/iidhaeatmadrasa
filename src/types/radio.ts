export interface SchoolInfo {
  countryMinistry: string;
  educationDirectorate: string;
  schoolName: string;
  schoolStage: 'ابتدائي' | 'متوسط' | 'ثانوي' | 'مشترك';
  academicYear: string;
  semester: string;
  dayOfWeek: string;
  hijriDate: string;
  gregorianDate: string;
  broadcastSupervisor: string;
  schoolPrincipal: string;
  headStudent: string;
  schoolLogoUrl?: string;
  selectedEmblem?: string;
}

export interface StudentPresenter {
  id: string;
  name: string;
  grade: string;
  sectionId?: string;
}

export interface QuranSection {
  surah: string;
  verses: string;
  text: string;
}

export interface HadithSection {
  narrator: string;
  text: string;
}

export interface SpeechSection {
  title: string;
  content: string;
}

export interface WisdomSection {
  text: string;
  author?: string;
}

export interface PoetrySection {
  verses: string;
  poet?: string;
}

export interface QuizSection {
  question: string;
  answer: string;
  hint?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  presenterName?: string;
  presenterGrade?: string;
  estimatedMinutes?: number;
}

export interface RadioBroadcast {
  id: string;
  title: string;
  topic: string;
  tone?: string;
  targetDuration?: string;
  createdAt: string;
  updatedAt: string;
  schoolInfo: SchoolInfo;
  introduction: {
    text: string;
    presenterName?: string;
    presenterGrade?: string;
    estimatedMinutes?: number;
  };
  quran: {
    data: QuranSection;
    enabled: boolean;
    presenterName?: string;
    presenterGrade?: string;
    estimatedMinutes?: number;
  };
  hadith: {
    data: HadithSection;
    enabled: boolean;
    presenterName?: string;
    presenterGrade?: string;
    estimatedMinutes?: number;
  };
  speech: {
    data: SpeechSection;
    enabled: boolean;
    presenterName?: string;
    presenterGrade?: string;
    estimatedMinutes?: number;
  };
  didYouKnow: {
    items: string[];
    enabled: boolean;
    presenterName?: string;
    presenterGrade?: string;
    estimatedMinutes?: number;
  };
  wisdom: {
    data: WisdomSection;
    enabled: boolean;
    presenterName?: string;
    presenterGrade?: string;
    estimatedMinutes?: number;
  };
  poetry: {
    data: PoetrySection;
    enabled: boolean;
    presenterName?: string;
    presenterGrade?: string;
    estimatedMinutes?: number;
  };
  quiz: {
    data: QuizSection;
    enabled: boolean;
    presenterName?: string;
    presenterGrade?: string;
    estimatedMinutes?: number;
  };
  supplication: {
    text: string;
    enabled: boolean;
    presenterName?: string;
    presenterGrade?: string;
    estimatedMinutes?: number;
  };
  outro: {
    text: string;
    presenterName?: string;
    presenterGrade?: string;
    estimatedMinutes?: number;
  };
  customSections: CustomSection[];
  presentingTips?: string[];
  students: StudentPresenter[];
}

export type PrintTemplateType = 'official' | 'modern' | 'cue_sheet' | 'student_cards';
