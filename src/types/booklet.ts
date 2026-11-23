export type PageCategory = 'cover' | 'intro' | 'joyful' | 'emotional' | 'emergency' | 'closing';

export interface BookletPageMeta {
  index: number;
  pageNumber: number | null; // null for cover
  id: string;
  headerTitle: string;
  title: string;
  tocTitle?: string;
  category: PageCategory;
  interactiveBadge?: string;
}

export interface SleepDayEntry {
  quality: 'مريح' | 'متقطع' | 'صعب' | '';
  phoneBeforeBed: 'نعم' | 'لا' | '';
  stress: 'منخفض' | 'متوسط' | 'مرتفع' | '';
}

export interface ExerciseData {
  mood_now?: string;
  page4_q1?: string;
  page5_stress1?: string;
  page5_stress1_action?: string;
  page5_stress2?: string;
  page5_stress2_action?: string;
  page5_stress3?: string;
  page5_stress3_action?: string;
  page6_enjoy?: string;
  page6_affect?: string;
  page7_emotion?: string;
  page7_what?: string;
  page7_felt?: string;
  page7_need?: string;
  page7_acted?: string;
  page8_prob?: string;
  page8_canDo?: string;
  page8_step?: string;
  page8_control?: string;
  page9_sleep_notes?: string;
  page10_drain?: string;
  page10_restore?: string;
  page10_reduce?: string;
  page11_my_boundary?: string;
  page12_hurt?: string;
  page12_limit?: string;
  page12_distance?: string;
  page12_help?: string;
  page13_reasons?: string; // comma-separated keys
  page14_signs?: string; // comma-separated keys
  plan_decline?: string;
  plan_drain?: string;
  plan_helps?: string;
  plan_person?: string;
  plan_pro?: string;
  plan_step?: string;
  [key: string]: string | undefined;
}

export type SleepLogMap = Record<number, SleepDayEntry>;
