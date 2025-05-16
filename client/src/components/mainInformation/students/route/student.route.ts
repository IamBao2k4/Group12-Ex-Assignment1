import axios from 'axios';
import { SERVER_URL } from '../../../../../global';
import { PaginatedResponse } from '../../open_class/models/open_class.model';
import { Student } from '../models/student';
import { Faculty } from '../../faculties/models/faculty';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const API_URL = `${SERVER_URL}/api/v1/students`;
const FACULTY_API_URL = `${SERVER_URL}/api/v1/faculties`;

export const StudentRoute = {
  getStudents: async (
    pagination: { page: number; limit?: number },
    filters: { searchString?: string; faculty?: string }
  ): Promise<PaginatedResponse<Student>> => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          page: pagination.page,
          limit: pagination.limit || 10,
          searchString: filters.searchString || '',
          faculty: filters.faculty || '',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  getAllFaculties: async (): Promise<Faculty[]> => {
    try {
      const response = await axios.get(`${FACULTY_API_URL}/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching faculties:', error);
      throw error;
    }
  },

  getStudentById: async (id: string): Promise<Student> => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching student with ID ${id}:`, error);
      throw error;
    }
  },

  createStudent: async (studentData: Partial<Student>): Promise<Student> => {
    try {
      const response = await axios.post(API_URL, studentData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  },

  updateStudent: async (id: string, studentData: Partial<Student>): Promise<Student> => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, studentData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating student ${id}:`, error);
      throw error;
    }
  },

  deleteStudent: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting student ${id}:`, error);
      throw error;
    }
  },

  importStudents: (file: File): Promise<Student[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'array' });
          
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          
          const jsonData: Student[] = XLSX.utils.sheet_to_json(sheet);
          resolve(jsonData);
        } catch (error) {
          console.error('Error parsing import file:', error);
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        reject(error);
      };
      
      reader.readAsArrayBuffer(file);
    });
  },

  exportStudents: (students: Student[], fileType: 'csv' | 'xlsx'): void => {
    if (students.length === 0) {
      throw new Error('No data to export');
    }
    
    const ws = XLSX.utils.json_to_sheet(students);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    
    if (fileType === 'xlsx') {
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(data, 'students.xlsx');
    } else {
      XLSX.writeFile(wb, 'students.csv');
    }
  },

  // Additional utility methods can be added as needed
  validateStudentData: (data: Partial<Student>): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Perform validation logic
    if (!data.ho_ten || data.ho_ten.trim() === '') {
      errors.push('Student name is required');
    }
    
    if (!data.ma_so_sinh_vien || data.ma_so_sinh_vien.trim() === '') {
      errors.push('Student ID is required');
    }

    // Add other validations as needed
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
};