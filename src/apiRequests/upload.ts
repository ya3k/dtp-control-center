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
   * Upload multiple files with a single API call
   * @param files Array of Files to upload
   * @param imageTypes Array of image types corresponding to each file (or single type for all)
   * @param resourceType Resource type for all files
   * @returns Promise with upload response containing all URLs in a single array
   */
  uploadMultipleFiles: async (
    files: File[],
    imageTypes: string | string[],
    resourceType: string = RESOURCE_TYPES.IMAGE
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    
    // Add each file individually with its corresponding type
    files.forEach((file) => {
      formData.append("files", file);
    });
    
    // Handle image types - can be a single type for all files or array of types
    if (Array.isArray(imageTypes)) {
      // If array has single item, use it for all files
      if (imageTypes.length === 1) {
        files.forEach(() => {
          formData.append("types", imageTypes[0]);
        });
      } else {
        // Must match files array length
        if (imageTypes.length !== files.length) {
          throw new Error("imageTypes array must match files array length");
        }
        
        // Add each type
        imageTypes.forEach(type => {
          formData.append("types", type);
        });
      }
    } else {
      // Single type for all files
      files.forEach(() => {
        formData.append("types", imageTypes);
      });
    }
    
    // Add resource type for each file
    files.forEach(() => {
      formData.append("resourceType", resourceType);
    });

    // Debug log for FormData
    // console.log('FormData structure:');
    // for (const [key, value] of formData.entries()) {
    //   if (value instanceof File) {
    //     console.log(`${key}:`, {
    //       name: value.name,
    //       type: value.type,
    //       size: `${(value.size / 1024 / 1024).toFixed(2)} MB`
    //     });
    //   } else {
    //     console.log(`${key}:`, value);
    //   }
    // }
    
    return uploadApiRequest.uploadWithFormData(formData);
  },

  /**
   * Upload multiple images of the same type
   * @param files Array of Files to upload
   * @param imageType Single image type for all files
   * @param resourceType Resource type
   * @returns Promise with upload response containing URLs
   */
  uploadImages: async (
    files: File[], 
    imageType: string = IMAGE_TYPES.REVIEW,
    resourceType: string = RESOURCE_TYPES.IMAGE
  ): Promise<UploadResponse> => {
    return uploadApiRequest.uploadMultipleFiles(files, imageType, resourceType);
  },

  /**
   * Upload multiple tour images
   * @param files Array of Files to upload
   * @returns Promise with upload response containing URLs
   */
  uploadTourImages: async (files: File[]): Promise<UploadResponse> => {
    // console.log('uploadTourImages called with:', {
    //   numberOfFiles: files.length,
    //   files: files.map(f => ({
    //     name: f.name,
    //     type: f.type,
    //     size: `${(f.size / 1024 / 1024).toFixed(2)} MB`
    //   }))
    // });

    // Create an array of tour image types matching the number of files
    const imageTypes = Array(files.length).fill(IMAGE_TYPES.TOUR);
    
    return uploadApiRequest.uploadMultipleFiles(files, imageTypes, RESOURCE_TYPES.IMAGE);
  },

  /**
   * Upload multiple destination images
   * @param files Array of Files to upload
   * @returns Promise with upload response containing URLs
   */
  uploadDestinationImages: async (files: File[]): Promise<UploadResponse> => {
    return uploadApiRequest.uploadImages(files, IMAGE_TYPES.DESTINATION, RESOURCE_TYPES.IMAGE);
  },

  /**
   * Upload multiple review images
   * @param files Array of Files to upload
   * @returns Promise with upload response containing URLs
   */
  uploadReviewImages: async (files: File[]): Promise<UploadResponse> => {
    return uploadApiRequest.uploadImages(files, IMAGE_TYPES.REVIEW);
  },

  /**
   * Upload mixed types of images in a single request
   * @param files Array of Files to upload
   * @param typeMapping Object mapping file indexes to image types
   * @returns Promise with upload response containing URLs
   */
  uploadMixedImages: async (
    files: File[],
    typeMapping: Record<number, string>
  ): Promise<UploadResponse> => {
    const types = files.map((_, index) => 
      typeMapping[index] || IMAGE_TYPES.REVIEW // Default to REVIEW if not specified
    );
    
    return uploadApiRequest.uploadMultipleFiles(files, types);
  },

  /**
   * For backward compatibility - Upload a single image
   * @param file File to upload
   * @param imageType Image type
   * @returns Promise with upload response containing URLs
   */
  uploadSingleImage: async (
    file: File,
    imageType: string
  ): Promise<UploadResponse> => {
    return uploadApiRequest.uploadImages([file], imageType);
  },

  /**
   * Generic upload function that handles FormData (used internally)
   * @param formData FormData object containing files and parameters
   * @returns Promise with upload response
   */
  uploadWithFormData: async (formData: FormData): Promise<UploadResponse> => {
    try {
      // Enhanced FormData logging
      // console.log('FormData contents:');
      // for (const pair of formData.entries()) {
      //   if (pair[1] instanceof File) {
      //     console.log(`${pair[0]}: File`, {
      //       name: pair[1].name,
      //       type: pair[1].type,
      //       size: `${(pair[1].size / 1024 / 1024).toFixed(2)} MB`
      //     });
      //   } else {
      //     console.log(`${pair[0]}:`, pair[1]);
      //   }
      // }

      // Log request details
      // console.log('Upload request URL:', `${baseURL}${apiEndpoint.upload}`);
      // console.log('Upload request headers:', {
      //   Authorization: 'Bearer [TOKEN]' // Don't log actual token
      // });

      const response = await fetch(`${baseURL}${apiEndpoint.upload}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        // console.error('Upload failed with status:', response.status);
        // console.error('Error response:', errorText);
        // console.error('Response headers:', Object.fromEntries(response.headers.entries()));
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Upload successful. Response:', data);
      return data;
    } catch (error) {
      console.error('Upload error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
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