// AKMM Talents Meet Management System (ATMMS) Domain Types

export type UserRole = 'ADMIN' | 'LEADER' | 'ASSISTANT' | 'STUDENT';
export type GenderType = 'MALE' | 'FEMALE' | 'OTHER';
export type StudentCategory = 'JUNIOR' | 'SENIOR';
export type ProgrammeType = 'ON_STAGE' | 'OFF_STAGE';
export type ProgrammeCategory = 'JUNIOR' | 'SENIOR' | 'GENERAL';
export type PointCategory = 'A' | 'B';
export type ProgrammeStatus = 'OPEN' | 'LOCKED';
export type ResultStatus = 'DRAFT' | 'PUBLISHED';
export type AppealStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type DocumentVisibility = 'ADMIN' | 'LEADER' | 'STUDENT' | 'PUBLIC';

export interface User {
  id: string;
  auth_id?: string;
  email?: string;
  full_name: string;
  role: UserRole;
  team_id?: string;
  team?: Team;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  color: string;
  logo_url?: string;
  leader_id?: string;
  assistant_id?: string;
  total_points: number;
  leader?: User;
  assistant?: User;
  student_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  uid: string;
  name: string;
  gender: GenderType;
  category: StudentCategory;
  team_id: string;
  team?: Team;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Programme {
  id: string;
  code: string;
  name: string;
  type: ProgrammeType;
  category: ProgrammeCategory;
  point_category: PointCategory;
  max_participants_per_team: number;
  status: ProgrammeStatus;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: string;
  programme_id: string;
  programme?: Programme;
  venue: string;
  event_date: string;
  event_time: string;
  round: string;
  judges?: string;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  student_id: string;
  student?: Student;
  programme_id: string;
  programme?: Programme;
  team_id: string;
  team?: Team;
  created_at: string;
}

export interface Result {
  id: string;
  programme_id: string;
  programme?: Programme;
  first_place_student_id?: string;
  first_place_student?: Student;
  second_place_student_id?: string;
  second_place_student?: Student;
  third_place_student_id?: string;
  third_place_student?: Student;
  first_place_team_id?: string;
  first_place_team?: Team;
  second_place_team_id?: string;
  second_place_team?: Team;
  third_place_team_id?: string;
  third_place_team?: Team;
  status: ResultStatus;
  remarks?: string;
  published_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Appeal {
  id: string;
  programme_id: string;
  programme?: Programme;
  team_id: string;
  team?: Team;
  submitted_by: string;
  submitter?: User;
  title: string;
  description: string;
  proof_url?: string;
  status: AppealStatus;
  admin_response?: string;
  created_at: string;
  updated_at: string;
}

export interface AppDocument {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  file_size: number;
  file_type: string;
  visibility: DocumentVisibility;
  download_count: number;
  uploaded_by?: string;
  created_at: string;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id?: string;
  user?: User;
  action: string;
  entity: string;
  entity_id?: string;
  details?: any;
  ip_address?: string;
  created_at: string;
}

export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
