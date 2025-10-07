// Affiliate API Response Types

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    } | null;
}

// Affiliate Invite Types
export interface AffiliateInviteDto {
    id: string;
    inviterUserId: string;
    inviteeEmail: string;
    inviteeUserId: string | null;
    inviteLink: string;
    status: 'invited' | 'registered' | 'email_confirmed';
    createdAt: string;
    completedAt: string | null;
    updatedAt: string;
}

// Affiliate Commission Types
export interface AffiliateCommissionDto {
    id: string;
    inviterUserId: string;
    inviteeUserId: string | null;
    type: 'invite_completed' | 'service_purchase';
    amount: number;
    status: 'pending' | 'available' | 'withdrawn';
    refId: string | null;
    createdAt: string;
    updatedAt: string;
}

// Affiliate Stats Types
export interface AffiliateStatsDto {
    totalInvites: number;
    successfulInvites: number;
    availableCommission: number;
    withdrawnCommission: number;
    affiliateCode: string;
    affiliateLink: string;
}

// Affiliate Withdraw Request Types
export interface AffiliateWithdrawRequestDto {
    id: string;
    userId: string;
    amount: number;
    commissionIds: string[];
    status: 'pending' | 'success' | 'rejected';
    requestedAt: string;
    processedAt: string | null;
    adminNote: string | null;
    updatedAt: string;
}

// Affiliate Link Types
export interface AffiliateLinkDto {
    affiliateCode: string;
    affiliateLink: string;
}

// Request Types
export interface CreateWithdrawRequestDto {
    amount: number;
    commissionIds: string[];
}

// Frontend specific types
export interface AffiliateData {
    stats: AffiliateStatsDto;
    invitees: AffiliateInviteDto[];
    commissions: AffiliateCommissionDto[];
    withdrawRequests: AffiliateWithdrawRequestDto[];
    affiliateLink: AffiliateLinkDto;
}

export interface AffiliateLoadingState {
    stats: boolean;
    invitees: boolean;
    commissions: boolean;
    withdrawRequests: boolean;
    affiliateLink: boolean;
    createWithdrawRequest: boolean;
    settings: boolean;
}

export interface AffiliateError {
    stats: string | null;
    invitees: string | null;
    commissions: string | null;
    withdrawRequests: string | null;
    affiliateLink: string | null;
    createWithdrawRequest: string | null;
    settings: string | null;
}