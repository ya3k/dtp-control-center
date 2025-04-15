//D:\FPT\capstoneprj\dtp-control-center\src\apiRequests\upload.ts
import { apiEndpoint } from "@/configs/routes";
import { sessionToken } from "@/lib/http";

const baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT;

// Define image types and resource types as constants
export const IMAGE_TYPES = {
  DESTINATION: "1",
  TOUR: "2",
  REVIEW: "0"
};

export const RESOURCE_TYPES = {
  IMAGE: "0",
  VIDEO: "1"
};

interface UploadResponse {
  urls: string[];
}

const uploadApiRequest = {
  /**
   * Upload a tour image - Only requires the file
   * @param file File to upload
   * @returns Promise with upload response containing URLs
   */
  uploadTourImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("types", IMAGE_TYPES.TOUR);
    formData.append("resourceType", RESOURCE_TYPES.IMAGE);
    
    return uploadApiRequest.uploadWithFormData(formData);
  },

  /**
   * Upload a destination image - Only requires the file
   * @param file File to upload
   * @returns Promise with upload response containing URLs
   */
  uploadDestinationImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("types", IMAGE_TYPES.DESTINATION);
    formData.append("resourceType", RESOURCE_TYPES.IMAGE);
    
    return uploadApiRequest.uploadWithFormData(formData);
  },

  /**
   * Upload a review image - Only requires the file
   * @param file File to upload
   * @returns Promise with upload response containing URLs
   */
  uploadReviewImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("types", IMAGE_TYPES.REVIEW);
    formData.append("resourceType", RESOURCE_TYPES.IMAGE);
    
    return uploadApiRequest.uploadWithFormData(formData);
  },

  /**
   * Generic upload function that handles FormData (used internally)
   * @param formData FormData object containing files and parameters
   * @returns Promise with upload response
   */
  uploadWithFormData: async (formData: FormData): Promise<UploadResponse> => {
    try {
      // Log FormData contents for debugging
      console.log(`FormData contents:`);
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1] instanceof File ?
          `File: ${pair[1].name}, size: ${pair[1].size}, type: ${pair[1].type}` :
          pair[1]);
      }

      // Use fetch API directly instead of http.post
      const response = await fetch(`${baseURL}${apiEndpoint.upload}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: formData // Pass FormData directly
      });

      // Handle non-ok responses
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Upload failed with status ${response.status}:`, errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Response:`, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  }
};

// Helper function to get the auth token
function getAuthToken() {
  // If you have access to sessionToken from your http module
  if (typeof sessionToken !== 'undefined' && sessionToken.value) {
    return sessionToken.value;
  }

  return '';
}

export default uploadApiRequest;