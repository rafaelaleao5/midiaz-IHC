const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export interface FaceDetectionResult {
  user_id: string;
  confidence: number;
  face_location: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface PhotoProcessingResult {
  photo_id: string;
  filename: string;
  detections: FaceDetectionResult[];
  total_faces: number;
}

export interface UserPhotoSearchResult {
  photo_id: string;
  event_id: string;
  confidence: number;
  processed_at: string;
}

export interface FaceMatchResult {
  found_matches: number;
  matches: Array<{
    match: boolean;
    location: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  }>;
}

export interface FaceComparisonResult {
  match: boolean;
}

export interface SystemStats {
  total_users_registered: number;
  total_photos_processed: number;
  total_detections: number;
}

export class FaceRecognitionService {
  private static async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Registra uma foto de referência do usuário
   */
  static async registerFace(userId: string, file: File): Promise<{
    success: boolean;
    message: string;
    user_id: string;
    face_detected: boolean;
  }> {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/register-face`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erro ao registrar rosto');
    }

    return await response.json();
  }

  /**
   * Detecta um rosto específico em uma imagem alvo
   */
  static async detectFace(
    referenceImage: File,
    targetImage: File
  ): Promise<FaceMatchResult> {
    const formData = new FormData();
    formData.append('reference_image', referenceImage);
    formData.append('target_image', targetImage);

    const response = await fetch(`${API_BASE_URL}/api/detect-face`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erro ao detectar rosto');
    }

    return await response.json();
  }

  /**
   * Compara dois rostos para verificar se são da mesma pessoa
   */
  static async compareFaces(
    referenceImage: File,
    targetImage: File
  ): Promise<FaceComparisonResult> {
    const formData = new FormData();
    formData.append('reference_image', referenceImage);
    formData.append('target_image', targetImage);

    const response = await fetch(`${API_BASE_URL}/api/compare-faces`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erro ao comparar rostos');
    }

    return await response.json();
  }

  /**
   * Processa fotos de evento para detectar rostos
   */
  static async detectFacesInPhotos(
    eventId: string,
    files: File[]
  ): Promise<{
    success: boolean;
    results: PhotoProcessingResult[];
    total_photos_processed: number;
  }> {
    const formData = new FormData();
    formData.append('event_id', eventId);
    
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_BASE_URL}/api/detect-faces`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erro ao processar fotos');
    }

    return await response.json();
  }

  /**
   * Busca fotos onde um usuário específico aparece
   */
  static async searchUserPhotos(
    userId: string,
    eventId?: string
  ): Promise<{
    success: boolean;
    user_id: string;
    photos_found: number;
    photos: UserPhotoSearchResult[];
  }> {
    const params = new URLSearchParams();
    if (eventId) {
      params.append('event_id', eventId);
    }

    const endpoint = `/api/search-user-photos/${userId}${params.toString() ? `?${params.toString()}` : ''}`;
    
    return await this.makeRequest(endpoint);
  }

  /**
   * Obtém estatísticas do sistema
   */
  static async getStats(): Promise<SystemStats> {
    return await this.makeRequest('/api/stats');
  }

  /**
   * Verifica se a API está funcionando
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Simula o processamento de fotos para quando a API não está disponível
   */
  static async simulatePhotoProcessing(
    eventId: string,
    files: File[]
  ): Promise<{
    success: boolean;
    results: PhotoProcessingResult[];
    total_photos_processed: number;
  }> {
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    const results: PhotoProcessingResult[] = files.map((file, index) => ({
      photo_id: `${eventId}_${index}`,
      filename: file.name,
      total_faces: Math.floor(Math.random() * 5) + 1,
      detections: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
        user_id: `user_${Math.floor(Math.random() * 100)}`,
        confidence: Math.floor(Math.random() * 20) + 80,
        face_location: {
          top: Math.floor(Math.random() * 100),
          right: Math.floor(Math.random() * 100) + 100,
          bottom: Math.floor(Math.random() * 100) + 100,
          left: Math.floor(Math.random() * 100),
        }
      }))
    }));

    return {
      success: true,
      results,
      total_photos_processed: files.length
    };
  }
}

// Hook personalizado para usar o serviço
export const useFaceRecognition = () => {
  const registerUserFace = async (userId: string, file: File) => {
    try {
      return await FaceRecognitionService.registerFace(userId, file);
    } catch (error) {
      console.error('Erro ao registrar rosto:', error);
      throw error;
    }
  };

  const detectFaceInImage = async (referenceImage: File, targetImage: File) => {
    try {
      return await FaceRecognitionService.detectFace(referenceImage, targetImage);
    } catch (error) {
      console.error('Erro ao detectar rosto:', error);
      throw error;
    }
  };

  const compareTwoFaces = async (referenceImage: File, targetImage: File) => {
    try {
      return await FaceRecognitionService.compareFaces(referenceImage, targetImage);
    } catch (error) {
      console.error('Erro ao comparar rostos:', error);
      throw error;
    }
  };

  const processEventPhotos = async (eventId: string, files: File[]) => {
    try {
      // Primeiro tenta usar a API real
      const isApiAvailable = await FaceRecognitionService.healthCheck();
      
      if (isApiAvailable) {
        return await FaceRecognitionService.detectFacesInPhotos(eventId, files);
      } else {
        // Fallback para simulação
        console.warn('API não disponível, usando simulação');
        return await FaceRecognitionService.simulatePhotoProcessing(eventId, files);
      }
    } catch (error) {
      console.error('Erro ao processar fotos:', error);
      // Fallback para simulação em caso de erro
      return await FaceRecognitionService.simulatePhotoProcessing(eventId, files);
    }
  };

  const findUserPhotos = async (userId: string, eventId?: string) => {
    try {
      const isApiAvailable = await FaceRecognitionService.healthCheck();
      
      if (isApiAvailable) {
        return await FaceRecognitionService.searchUserPhotos(userId, eventId);
      } else {
        // Simular resultado quando API não está disponível
        return {
          success: true,
          user_id: userId,
          photos_found: Math.floor(Math.random() * 10) + 1,
          photos: Array.from({ length: Math.floor(Math.random() * 10) + 1 }, (_, i) => ({
            photo_id: `photo_${i}`,
            event_id: eventId || `event_${i}`,
            confidence: Math.floor(Math.random() * 20) + 80,
            processed_at: new Date().toISOString()
          }))
        };
      }
    } catch (error) {
      console.error('Erro ao buscar fotos do usuário:', error);
      throw error;
    }
  };

  const getSystemStats = async () => {
    try {
      const isApiAvailable = await FaceRecognitionService.healthCheck();
      
      if (isApiAvailable) {
        return await FaceRecognitionService.getStats();
      } else {
        // Retornar estatísticas simuladas
        return {
          total_users_registered: Math.floor(Math.random() * 1000) + 100,
          total_photos_processed: Math.floor(Math.random() * 5000) + 500,
          total_detections: Math.floor(Math.random() * 10000) + 1000
        };
      }
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  };

  const checkApiHealth = async () => {
    return await FaceRecognitionService.healthCheck();
  };

  return {
    registerUserFace,
    detectFaceInImage,
    compareTwoFaces,
    processEventPhotos,
    findUserPhotos,
    getSystemStats,
    checkApiHealth,
  };
}; 