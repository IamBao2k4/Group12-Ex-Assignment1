import axios from 'axios';
import { SERVER_URL } from '../../../../../global';
import { PaginationOptions, PaginatedResponse } from '../../open_class/models/open_class.model';
import { Program } from '../models/program';

const API_URL = `${SERVER_URL}/api/v1/programs`;

export const ProgramsRoute = {
  getPrograms: async (
    pagination: PaginationOptions,
    searchOptions: { searchString?: string }
  ): Promise<PaginatedResponse<Program>> => {
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
      console.error('Error fetching programs:', error);
      throw error;
    }
  },

  createProgram: async (programData: { name: string }): Promise<void> => {
    try {
      await axios.post(API_URL, programData, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error creating program:', error);
      throw error;
    }
  },

  updateProgram: async (id: string, programData: { name: string }): Promise<void> => {
    try {
      await axios.patch(`${API_URL}/${id}`, programData, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error(`Error updating program ${id}:`, error);
      throw error;
    }
  },

  deleteProgram: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting program ${id}:`, error);
      throw error;
    }
  },
};