import axios from 'axios';
import { OpenClass, PaginationOptions, SearchOptions, PaginatedResponse, CreateOpenClassDto } from '../models/open_class.model';
import {Course} from '../../courses/models/course';
import { SERVER_URL } from '../../../../../global';
const API_URL = `${SERVER_URL}/api/v1/open_class`;
export const OpenClassRoute = {
  getOpenClasses: async (
    pagination: PaginationOptions = { page: 1, limit: 10 }, 
    searchOptions: SearchOptions = {}
  ): Promise<PaginatedResponse<OpenClass>> => {
    try {
      // Build query parameters
      let url = `${API_URL}?page=${pagination.page}&limit=${pagination.limit}`;
      
      // Add search options if provided
      if (searchOptions.nam_hoc) {
        url += `&nam_hoc=${searchOptions.nam_hoc}`;
      }
      if (searchOptions.hoc_ky) {
        url += `&hoc_ky=${searchOptions.hoc_ky}`;
      }
      if (searchOptions.keyword) {
        url += `&keyword=${searchOptions.keyword}`;
      }

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching open classes:', error);
      throw error;
    }
  },

  createOpenClass: async (openClass: CreateOpenClassDto): Promise<OpenClass> => {
    try {
      console.log('Creating open class with data:', openClass);
      const response = await axios.post(API_URL, openClass);
      return response.data;
    } catch (error) {
      console.error('Error creating open class:', error);
      throw error;
    }
  },

  updateOpenClass: async (id: string, openClass: Partial<OpenClass>): Promise<OpenClass> => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, openClass);
      return response.data;
    } catch (error) {
      console.error(`Error updating open class ${id}:`, error);
      throw error;
    }
  },

  deleteOpenClass: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting open class ${id}:`, error);
      throw error;
    }
  },

  getOpenClassById: async (id: string): Promise<OpenClass> => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching open class ${id}:`, error);
      throw error;
    }
  },

  getAllOpenClasses: async (): Promise<OpenClass[]> => {
    try {
      const response = await axios.get(`${API_URL}/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all open classes:', error);
      throw error;
    }
  },

  getAllCourseAvailable: async (): Promise<Course[]> => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/v1/courses/all-available`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all available courses:', error);
      throw error;
    }
  },
  getAllCourseAvailablePaging: async (pagination: PaginationOptions): Promise<PaginatedResponse<Course>> => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/v1/courses/`, {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          available: true
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all available courses:', error);
      throw error;
    }
  }

}; 