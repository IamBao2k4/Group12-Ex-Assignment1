import axios from 'axios';
import { SERVER_URL } from '../../../../../global';
import { PaginationOptions, PaginatedResponse } from '../../open_class/models/open_class.model';
import { Faculty } from '../models/faculty';

const API_URL = `${SERVER_URL}/api/v1/faculties`;

export const FacultiesRoute = {
  getFaculties: async (
    pagination: PaginationOptions,
    searchOptions: { searchString?: string }
  ): Promise<PaginatedResponse<Faculty>> => {
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
      console.error('Error fetching faculties:', error);
      throw error;
    }
  },

  createFaculty: async (facultyData: { ma_khoa: string; ten_khoa: string }): Promise<void> => {
    try {
      await axios.post(API_URL, facultyData, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error creating faculty:', error);
      throw error;
    }
  },

  updateFaculty: async (id: string, facultyData: { ma_khoa: string; ten_khoa: string }): Promise<void> => {
    try {
      await axios.patch(`${API_URL}/${id}`, facultyData, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error(`Error updating faculty ${id}:`, error);
      throw error;
    }
  },

  deleteFaculty: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting faculty ${id}:`, error);
      throw error;
    }
  },
};