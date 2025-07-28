const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface FaceDetectionResult {
  success: boolean;
  message: string;
  user_id: string;
  face_detected: boolean;
  photo_id?: string;
}

export interface PhotoUploadResult {
  success: boolean;
  message: string;
  photo?: {
    id: number;
    filename: string;
    file_size: number;
    created_at: string;
  };
}

export interface UserPhoto {
  id: number;
  filename: string;
  file_size: number;
  is_reference: boolean;
  face_detected: boolean;
  created_at: string;
}

export interface UserPhotosResponse {
  success: boolean;
  photos: UserPhoto[];
}

export class FaceRecognitionService {
  private static getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('midiaz_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  static async registerFace(facePhoto: File): Promise<FaceDetectionResult> {
    const formData = new FormData();
    formData.append('file', facePhoto);

    try {
      const response = await fetch(`${API_BASE_URL}/api/register-face`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao registrar rosto');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao registrar rosto');
    }
  }

  static async uploadPhoto(photo: File): Promise<PhotoUploadResult> {
    const formData = new FormData();
    formData.append('file', photo);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload-photo`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao fazer upload da foto');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao fazer upload da foto');
    }
  }

  static async getUserPhotos(): Promise<UserPhotosResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/photos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao buscar fotos');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao buscar fotos');
    }
  }

  static async getSystemStats(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao buscar estatísticas');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao buscar estatísticas');
    }
  }
}

// Hook para usar o serviço de reconhecimento facial
export const useFaceRecognition = () => {
  const registerUserFace = async (userId: string, facePhoto: File): Promise<FaceDetectionResult> => {
    return await FaceRecognitionService.registerFace(facePhoto);
  };

  const uploadUserPhoto = async (photo: File): Promise<PhotoUploadResult> => {
    return await FaceRecognitionService.uploadPhoto(photo);
  };

  const getUserPhotos = async (): Promise<UserPhotosResponse> => {
    return await FaceRecognitionService.getUserPhotos();
  };

  const getSystemStats = async (): Promise<any> => {
    return await FaceRecognitionService.getSystemStats();
  };

  return {
    registerUserFace,
    uploadUserPhoto,
    getUserPhotos,
    getSystemStats,
  };
}; 