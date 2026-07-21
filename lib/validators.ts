import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const studentLoginSchema = z.object({
  uid: z.string().min(3, 'Student UID is required (e.g. ATM2026-001)'),
});

export const teamSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Team name must be at least 2 characters'),
  code: z.string().min(2, 'Team code must be at least 2 characters'),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color code'),
  logo_url: z.string().optional().or(z.literal('')),
  leader_id: z.string().optional().nullable(),
  assistant_id: z.string().optional().nullable(),
});

export const studentSchema = z.object({
  id: z.string().optional(),
  uid: z.string().min(3, 'Unique Identification Code (UID) is required'),
  name: z.string().min(2, 'Student full name is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  category: z.enum(['JUNIOR', 'SENIOR']),
  team_id: z.string().min(1, 'Team selection is required'),
  photo_url: z.string().optional().or(z.literal('')),
});

export const programmeSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(2, 'Programme code is required'),
  name: z.string().min(2, 'Programme name is required'),
  type: z.enum(['ON_STAGE', 'OFF_STAGE']),
  category: z.enum(['JUNIOR', 'SENIOR', 'GENERAL']),
  point_category: z.enum(['A', 'B']),
  max_participants_per_team: z.coerce.number().min(1, 'At least 1 participant per team'),
  status: z.enum(['OPEN', 'LOCKED']),
});

export const scheduleSchema = z.object({
  id: z.string().optional(),
  programme_id: z.string().min(1, 'Programme selection is required'),
  venue: z.string().min(2, 'Venue location is required'),
  event_date: z.string().min(1, 'Date is required'),
  event_time: z.string().min(1, 'Time is required'),
  round: z.string().default('Finals'),
  judges: z.string().optional(),
});

export const assignmentSchema = z.object({
  student_id: z.string().min(1, 'Student selection is required'),
  programme_id: z.string().min(1, 'Programme selection is required'),
  team_id: z.string().min(1, 'Team is required'),
});

export const resultSchema = z.object({
  id: z.string().optional(),
  programme_id: z.string().min(1, 'Programme selection is required'),
  first_place_student_id: z.string().optional().nullable(),
  second_place_student_id: z.string().optional().nullable(),
  third_place_student_id: z.string().optional().nullable(),
  first_place_team_id: z.string().optional().nullable(),
  second_place_team_id: z.string().optional().nullable(),
  third_place_team_id: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  remarks: z.string().optional(),
});

export const appealSchema = z.object({
  id: z.string().optional(),
  programme_id: z.string().min(1, 'Programme selection is required'),
  team_id: z.string().min(1, 'Team selection is required'),
  title: z.string().min(3, 'Appeal title is required'),
  description: z.string().min(10, 'Detailed appeal description is required'),
  proof_url: z.string().optional().or(z.literal('')),
});

export const documentSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'Document title is required'),
  description: z.string().optional(),
  file_url: z.string().min(1, 'File URL is required'),
  file_size: z.number().default(0),
  file_type: z.string().default('application/pdf'),
  visibility: z.enum(['ADMIN', 'LEADER', 'STUDENT', 'PUBLIC']),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type StudentLoginInput = z.infer<typeof studentLoginSchema>;
export type TeamInput = z.infer<typeof teamSchema>;
export type StudentInput = z.infer<typeof studentSchema>;
export type ProgrammeInput = z.infer<typeof programmeSchema>;
export type ScheduleInput = z.infer<typeof scheduleSchema>;
export type AssignmentInput = z.infer<typeof assignmentSchema>;
export type ResultInput = z.infer<typeof resultSchema>;
export type AppealInput = z.infer<typeof appealSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;
