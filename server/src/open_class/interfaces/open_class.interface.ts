import { Document, Types } from 'mongoose'; 
import { CourseName } from '../../course/interfaces/course.interface';
// danh sách lớp mở
export interface OpenClass extends Document {
  ma_lop: string;
  ma_mon_hoc: string;
  course_details?: {
    ma_mon_hoc: string;
    ten: CourseName;
    _id: string;
  }; // Add course_details here
  si_so: number; // Sĩ số lớp học phần
  nam_hoc: number;
  hoc_ky: number;
  giang_vien: string;
  so_luong_toi_da: number;
  lich_hoc: string;
  phong_hoc: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
