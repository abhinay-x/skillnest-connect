import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata
} from 'firebase/storage';
import { storage } from './config';

// Storage paths
export const STORAGE_PATHS = {
  PROFILE_IMAGES: 'profile-images',
  WORKER_PORTFOLIO: 'worker-portfolio',
  SERVICE_IMAGES: 'service-images',
  TOOL_IMAGES: 'tool-images',
  DOCUMENTS: 'documents',
  CHAT_MEDIA: 'chat-media',
  TRAINING_MATERIALS: 'training-materials'
};

// Upload file with progress tracking
export const uploadFileWithProgress = (file, path, onProgress = null) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        console.error('Upload error:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url: downloadURL,
            path: path,
            size: uploadTask.snapshot.totalBytes,
            contentType: file.type
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

// Simple file upload
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      success: true,
      url: downloadURL,
      path: path,
      size: snapshot.totalBytes,
      contentType: file.type,
      error: null
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      url: null,
      error: error.message
    };
  }
};

// Upload multiple files
export const uploadMultipleFiles = async (files, basePath, onProgress = null) => {
  try {
    const uploadPromises = files.map((file, index) => {
      const fileName = `${Date.now()}_${index}_${file.name}`;
      const filePath = `${basePath}/${fileName}`;
      
      return uploadFileWithProgress(file, filePath, (progress) => {
        if (onProgress) {
          onProgress(index, progress);
        }
      });
    });

    const results = await Promise.all(uploadPromises);
    return { success: true, files: results, error: null };
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    return { success: false, files: [], error: error.message };
  }
};

// Delete file
export const deleteFile = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.message };
  }
};

// Get file metadata
export const getFileMetadata = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const metadata = await getMetadata(storageRef);
    return { metadata, error: null };
  } catch (error) {
    console.error('Error getting file metadata:', error);
    return { metadata: null, error: error.message };
  }
};

// List files in a directory
export const listFiles = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    
    const files = await Promise.all(
      result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        const metadata = await getMetadata(itemRef);
        
        return {
          name: itemRef.name,
          path: itemRef.fullPath,
          url: url,
          size: metadata.size,
          contentType: metadata.contentType,
          timeCreated: metadata.timeCreated,
          updated: metadata.updated
        };
      })
    );
    
    return { files, error: null };
  } catch (error) {
    console.error('Error listing files:', error);
    return { files: [], error: error.message };
  }
};

// Upload profile image
export const uploadProfileImage = async (file, userId) => {
  const fileName = `${userId}_${Date.now()}.${file.name.split('.').pop()}`;
  const path = `${STORAGE_PATHS.PROFILE_IMAGES}/${fileName}`;
  return await uploadFile(file, path);
};

// Upload worker portfolio images
export const uploadPortfolioImages = async (files, workerId, onProgress = null) => {
  const basePath = `${STORAGE_PATHS.WORKER_PORTFOLIO}/${workerId}`;
  return await uploadMultipleFiles(files, basePath, onProgress);
};

// Upload service images
export const uploadServiceImages = async (files, serviceId, onProgress = null) => {
  const basePath = `${STORAGE_PATHS.SERVICE_IMAGES}/${serviceId}`;
  return await uploadMultipleFiles(files, basePath, onProgress);
};

// Upload tool images
export const uploadToolImages = async (files, toolId, onProgress = null) => {
  const basePath = `${STORAGE_PATHS.TOOL_IMAGES}/${toolId}`;
  return await uploadMultipleFiles(files, basePath, onProgress);
};

// Upload document
export const uploadDocument = async (file, userId, documentType) => {
  const fileName = `${documentType}_${userId}_${Date.now()}.${file.name.split('.').pop()}`;
  const path = `${STORAGE_PATHS.DOCUMENTS}/${fileName}`;
  return await uploadFile(file, path);
};

// Upload chat media
export const uploadChatMedia = async (file, chatId) => {
  const fileName = `${chatId}_${Date.now()}.${file.name.split('.').pop()}`;
  const path = `${STORAGE_PATHS.CHAT_MEDIA}/${fileName}`;
  return await uploadFile(file, path);
};

// Validate file
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxFiles = 10
  } = options;

  const errors = [];

  if (file.size > maxSize) {
    errors.push(`File size must be less than ${maxSize / 1024 / 1024}MB`);
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate multiple files
export const validateFiles = (files, options = {}) => {
  const { maxFiles = 10 } = options;
  const errors = [];

  if (files.length > maxFiles) {
    errors.push(`Maximum ${maxFiles} files allowed`);
  }

  const fileValidations = files.map((file, index) => ({
    index,
    file,
    validation: validateFile(file, options)
  }));

  const invalidFiles = fileValidations.filter(f => !f.validation.isValid);
  
  if (invalidFiles.length > 0) {
    invalidFiles.forEach(f => {
      errors.push(`File ${f.index + 1}: ${f.validation.errors.join(', ')}`);
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    fileValidations
  };
};

// Generate unique filename
export const generateUniqueFileName = (originalName, prefix = '') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  return `${prefix}${timestamp}_${random}.${extension}`;
};

// Compress image before upload (basic implementation)
export const compressImage = (file, quality = 0.8, maxWidth = 1920, maxHeight = 1080) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(compressedFile);
        },
        file.type,
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};
