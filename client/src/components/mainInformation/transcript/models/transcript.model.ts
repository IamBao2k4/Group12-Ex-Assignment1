import { Document } from "mongoose";
import { CourseName } from "../../courses/models/course";

export interface TranscriptModel extends Document {
    _id: string;
    ma_mon_hoc: CourseType; // Subject code
    ma_so_sinh_vien: StudentType; // Student ID
    diem: number; // Grade
    hoc_ky: string; // Semester (e.g., "2023-1")
    nam_hoc: string; // Academic year (e.g., "2023-2024")
    trang_thai: string; // Status (e.g., "passed", "failed")
}

export type CourseType = {
    _id: string;
    ma_mon_hoc: string;
    ten: CourseName;
    tin_chi: number;
};

export type StudentType = {
    _id: string;
    ma_so_sinh_vien: string;
    ho_ten: string;
    email: string;
    so_dien_thoai: string;
    khoa: string;
    nganh: string;
};

export interface PaginationOptions {
    page?: number;
    limit?: number;
}

export interface SearchOptions {
    nam_hoc?: number;
    hoc_ky?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
