/**
 * Index برای export کردن تمام configهای تست‌ها
 * این فایل به مرور با اضافه شدن تست‌های جدید تکمیل می‌شود
 */

import { GAD7_CONFIG } from './gad7';
import { PHQ9_CONFIG } from './phq9';
import { CREATIVITY_CONFIG } from './creativity';
import { PSS10_CONFIG } from './pss10';
import { LEARNING_STYLE_CONFIG } from './learning-style';
import { GROWTH_MINDSET_CONFIG } from './growth-mindset';
import { CURIOSITY_CONFIG } from './curiosity';
import { ADAPTABILITY_CONFIG } from './adaptability';
import { INNOVATION_CONFIG } from './innovation';
import { WORK_LIFE_BALANCE_CONFIG } from './work-life-balance';
import { HOBBIES_INTERESTS_CONFIG } from './hobbies-interests';
import { PERSONAL_VALUES_CONFIG } from './personal-values';
import { TIME_PREFERENCE_CONFIG } from './time-preference';
import { IDEAL_ENVIRONMENT_CONFIG } from './ideal-environment';
import { LIFESTYLE_HARMONY_CONFIG } from './lifestyle-harmony';
import { BAI_CONFIG } from './bai';
import { BDI2_CONFIG } from './bdi2';
import { ROSENBERG_CONFIG } from './rosenberg';
import { PSQI_CONFIG } from './psqi';
import { MAAS_CONFIG } from './maas';
import { FOCUS_ATTENTION_CONFIG } from './focus-attention';
import { TIME_MANAGEMENT_CONFIG } from './time-management';
import { UCLA_LONELINESS_CONFIG } from './ucla-loneliness';
import { ATTACHMENT_CONFIG } from './attachment';
import { SPIN_CONFIG } from './spin';
import { EQ_CONFIG } from './eq';
import { STAI_CONFIG } from './stai';
import { HADS_CONFIG } from './hads';
import { NEO_FFI_CONFIG } from './neo-ffi';
import { BFI_CONFIG } from './bfi';
import { MBTI_CONFIG } from './mbti';
import { RIASEC_CONFIG } from './riasec';
import { SWLS_CONFIG } from './swls';
import { PANAS_CONFIG } from './panas';
import { ISI_CONFIG } from './isi';
import { LIFESTYLE_SLEEP_QUALITY_CONFIG } from './lifestyle-sleep-quality';
import { PHYSICAL_ACTIVITY_CONFIG } from './physical-activity';
import { EATING_HABITS_CONFIG } from './eating-habits';
import { GENERAL_HEALTH_CONFIG } from './general-health';
import { PSSS_CONFIG } from './psss';
import { MEMORY_CONFIG } from './memory';
import { COGNITIVE_IQ_CONFIG } from './cognitive-iq';
import { DECISION_MAKING_CONFIG } from './decision-making';
import { PROBLEM_SOLVING_CONFIG } from './problem-solving';
import { TEAMWORK_CONFIG } from './teamwork';
import { COMMUNICATION_SKILLS_CONFIG } from './communication-skills';
import { LEADERSHIP_CONFIG } from './leadership';
import { DASS21_CONFIG } from './dass21';
import { RESILIENCE_CONFIG } from './resilience';

export const TEST_CONFIGS = {
  GAD7: GAD7_CONFIG,
  PHQ9: PHQ9_CONFIG,
  Creativity: CREATIVITY_CONFIG,
  PSS10: PSS10_CONFIG,
  LearningStyle: LEARNING_STYLE_CONFIG,
  GrowthMindset: GROWTH_MINDSET_CONFIG,
  Curiosity: CURIOSITY_CONFIG,
  Adaptability: ADAPTABILITY_CONFIG,
  Innovation: INNOVATION_CONFIG,
  WorkLifeBalance: WORK_LIFE_BALANCE_CONFIG,
  HobbiesInterests: HOBBIES_INTERESTS_CONFIG,
  PersonalValues: PERSONAL_VALUES_CONFIG,
  TimePreference: TIME_PREFERENCE_CONFIG,
  IdealEnvironment: IDEAL_ENVIRONMENT_CONFIG,
  LifestyleHarmony: LIFESTYLE_HARMONY_CONFIG,
  BAI: BAI_CONFIG,
  BDI2: BDI2_CONFIG,
  Rosenberg: ROSENBERG_CONFIG,
  PSQI: PSQI_CONFIG,
  MAAS: MAAS_CONFIG,
  FocusAttention: FOCUS_ATTENTION_CONFIG,
  TimeManagement: TIME_MANAGEMENT_CONFIG,
  UCLA: UCLA_LONELINESS_CONFIG,
  Attachment: ATTACHMENT_CONFIG,
  SPIN: SPIN_CONFIG,
  EQ: EQ_CONFIG,
  STAI: STAI_CONFIG,
  HADS: HADS_CONFIG,
  NEOFFI: NEO_FFI_CONFIG,
  BFI: BFI_CONFIG,
  MBTI: MBTI_CONFIG,
  RIASEC: RIASEC_CONFIG,
  SWLS: SWLS_CONFIG,
  PANAS: PANAS_CONFIG,
  ISI: ISI_CONFIG,
  LifestyleSleepQuality: LIFESTYLE_SLEEP_QUALITY_CONFIG,
  PhysicalActivity: PHYSICAL_ACTIVITY_CONFIG,
  EatingHabits: EATING_HABITS_CONFIG,
  GeneralHealth: GENERAL_HEALTH_CONFIG,
  PSSS: PSSS_CONFIG,
  Memory: MEMORY_CONFIG,
  CognitiveIQ: COGNITIVE_IQ_CONFIG,
  DecisionMaking: DECISION_MAKING_CONFIG,
  ProblemSolving: PROBLEM_SOLVING_CONFIG,
  Teamwork: TEAMWORK_CONFIG,
  CommunicationSkills: COMMUNICATION_SKILLS_CONFIG,
  Leadership: LEADERSHIP_CONFIG,
  DASS21: DASS21_CONFIG,
  Resilience: RESILIENCE_CONFIG,
};

export type TestConfigId = keyof typeof TEST_CONFIGS;

