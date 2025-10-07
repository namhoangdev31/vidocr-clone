import {
    ApiResponse,
    AffiliateInviteDto,
    AffiliateCommissionDto,
    AffiliateStatsDto,
    AffiliateWithdrawRequestDto,
    AffiliateLinkDto,
    CreateWithdrawRequestDto
} from '@/app/lib/types/affiliate';
import { apiClient } from '@/app/lib/api';

// Settings interface
export interface SettingItem {
    key: string;
    value: string;
}

class AffiliateApiService {
    private baseUrl = '/affiliate';

    private async request<T>(endpoint: string, config: any = {}): Promise<T> {
        try {
            const response = await apiClient({
                url: `${this.baseUrl}${endpoint}`,
                method: config.method || 'GET',
                data: config.data,
                ...config
            });

            return response.data.data;
        } catch (error: any) {
            if (error.response) {
                const errorMessage = error.response.data?.message || `API Error: ${error.response.status}`;
                throw new Error(errorMessage);
            } else if (error.request) {
                throw new Error('Lỗi kết nối mạng');
            } else {
                // Other error
                throw new Error(error.message || 'Có lỗi xảy ra');
            }
        }
    }

    // GET /v1/affiliate/invite-link - Lấy link affiliate
    async getInviteLink(): Promise<AffiliateLinkDto> {
        return await this.request<AffiliateLinkDto>('/invite-link');
    }

    // GET /v1/affiliate/stats - Lấy thống kê affiliate
    async getStats(): Promise<AffiliateStatsDto> {
        return await this.request<AffiliateStatsDto>('/stats');
    }

    // GET /v1/affiliate/invitees - Lấy danh sách người đã mời
    async getInvitees(): Promise<AffiliateInviteDto[]> {
        return await this.request<AffiliateInviteDto[]>('/invitees');
    }

    // GET /v1/affiliate/commissions - Lấy lịch sử hoa hồng
    async getCommissions(): Promise<AffiliateCommissionDto[]> {
        return await this.request<AffiliateCommissionDto[]>('/commissions');
    }

    // GET /v1/affiliate/withdraw-requests - Lấy lịch sử rút tiền
    async getWithdrawRequests(): Promise<AffiliateWithdrawRequestDto[]> {
        return await this.request<AffiliateWithdrawRequestDto[]>('/withdraw-requests');
    }

    // POST /v1/affiliate/withdraw-requests - Tạo yêu cầu rút tiền
    async createWithdrawRequest(data: CreateWithdrawRequestDto): Promise<AffiliateWithdrawRequestDto> {
        return await this.request<AffiliateWithdrawRequestDto>('/withdraw-requests', {
            method: 'POST',
            data: data,
        });
    }

    // GET /v1/settings - Lấy cài đặt hệ thống
    async getSettings(): Promise<SettingItem[]> {
        return await this.request<SettingItem[]>('/settings');
    }
}

export const affiliateApi = new AffiliateApiService();