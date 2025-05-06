import axios from 'axios';
import { SERVER_URL } from '../../../../../global';
import { PaginationOptions, PaginatedResponse } from '../../open_class/models/open_class.model';
import { Subject } from '../models/course';
import { Faculty } from '../../faculties/models/faculty';

const API_URL = `${SERVER_URL}/api/v1/courses`;
const FACULTY_API_URL = `${SERVER_URL}/api/v1/faculties`;

export const CoursesRoute = {
  getCourses: async (
    pagination: PaginationOptions,
    searchOptions: { searchString?: string }
  ): Promise<PaginatedResponse<Subject>> => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          searchString: searchOptions.searchString || '',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  createCourse: async (courseData: { ten: string; ma_mon_hoc: string; tin_chi: number; khoa: string }): Promise<void> => {
    try {
      await axios.post(API_URL, courseData, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  updateCourse: async (id: string, courseData: { ten: string; ma_mon_hoc: string; tin_chi: number; khoa: string }): Promise<void> => {
    try {
      await axios.patch(`${API_URL}/${id}`, courseData, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error(`Error updating course ${id}:`, error);
      throw error;
    }
  },

  deleteCourse: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting course ${id}:`, error);
      throw error;
    }
  },

  getFacultyById: async (facultyId: string): Promise<{ ten_khoa: string }> => {
    try {
      const response = await axios.get(`${FACULTY_API_URL}/${facultyId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching faculty with ID ${facultyId}:`, error);
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
};