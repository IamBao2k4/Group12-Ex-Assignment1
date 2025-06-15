import axios from 'axios';
import { SERVER_URL } from '../../../../../global';
import { PaginationOptions, PaginatedResponse } from '../../open_class/models/open_class.model';
import { StudentStatus } from '../models/student_status';

const API_URL = `${SERVER_URL}/api/v1/student-statuses`;

export const StudentStatusesRoute = {
  getStudentStatuses: async (
    pagination: PaginationOptions,
    searchOptions: { searchString?: string },
    lang: string = 'vi'
  ): Promise<PaginatedResponse<StudentStatus>> => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          searchString: searchOptions.searchString || '',
          lang: lang,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching student statuses:', error);
      throw error;
    }
  },

  createStudentStatus: async (studentStatusData: { tinh_trang: {en: string, vi: string} }): Promise<void> => {
    try {
      await axios.post(API_URL, studentStatusData, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error creating student status:', error);
      throw error;
    }
  },

  updateStudentStatus: async (id: string, studentStatusData: { tinh_trang: {en: string, vi: string} }): Promise<void> => {
    try {
      await axios.patch(`${API_URL}/${id}`, studentStatusData, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error(`Error updating student status ${id}:`, error);
      throw error;
    }
  },

  deleteStudentStatus: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting student status ${id}:`, error);
      throw error;
    }
  },
};