import { apiClient } from '../api'

export interface Voice {
  id: string;
  name: string;
  language: string;
  gender: 'male' | 'female';
  previewUrl?: string;
}

export interface DubbingRequest {
  text: string;
  voice: string;
  speed?: number;
}

export interface DubbingResponse {
  audioUrl: string;
  duration?: number;
}

export class DubbingService {
  async generateDubbing(params: DubbingRequest): Promise<DubbingResponse> {
    // Mock implementation - anh replace sau bằng API thật
    const response = await apiClient.post('/dubbing/generate', params);
    return response.data;
  }

  async getVoices(): Promise<Voice[]> {
    // Mock voices - anh replace sau bằng API thật
    return [
      {
        id: 'voice-1',
        name: 'Vietnamese Female',
        language: 'vi',
        gender: 'female',
        previewUrl: '/api/mock/voice-preview-1.mp3'
      },
      {
        id: 'voice-2',
        name: 'Vietnamese Male',
        language: 'vi',
        gender: 'male',
        previewUrl: '/api/mock/voice-preview-2.mp3'
      },
      {
        id: 'voice-3',
        name: 'English Female',
        language: 'en',
        gender: 'female',
        previewUrl: '/api/mock/voice-preview-3.mp3'
      }
    ];
  }

  async previewVoice(voiceId: string): Promise<string> {
    // Mock preview - anh replace sau bằng API thật
    const voices = await this.getVoices();
    const voice = voices.find(v => v.id === voiceId);
    return voice?.previewUrl || '';
  }
}

export const dubbingService = new DubbingService();
