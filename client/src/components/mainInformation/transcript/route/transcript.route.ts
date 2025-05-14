import {
    PaginatedResponse,
    PaginationOptions,
    SearchOptions,
    TranscriptModel,
} from "../models/transcript.model";
import { SERVER_URL } from "../../../../../global";
import axios from "axios";

export const transcriptRoute = {
    getTranscript: async (
        studentId: string,
        pagination: PaginationOptions = { page: 1, limit: 10 },
        searchOptions: SearchOptions = {}
    ): Promise<PaginatedResponse<TranscriptModel>> => {
        try {
            let url = `${SERVER_URL}/api/v1/students/transcripts/${studentId}?page=${pagination.page}&limit=${pagination.limit}`;

            if (searchOptions.nam_hoc) {
                url += `&nam_hoc=${searchOptions.nam_hoc}`;
            }

            if (searchOptions.hoc_ky) {
                url += `&hoc_ky=${searchOptions.hoc_ky}`;
            }

            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching transcripts:", error);
            throw error;
        }
    },
};
