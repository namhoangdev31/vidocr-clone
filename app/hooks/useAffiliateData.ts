'use client';

import { useState, useEffect, useCallback } from 'react';
import { affiliateApi, SettingItem } from '@/app/lib/api/affiliate';
import {
    AffiliateStatsDto,
    AffiliateInviteDto,
    AffiliateCommissionDto,
    AffiliateWithdrawRequestDto,
    AffiliateLinkDto,
    CreateWithdrawRequestDto,
    AffiliateLoadingState,
    AffiliateError
} from '@/app/lib/types/affiliate';

export const useAffiliateData = () => {
    // Data states
    const [stats, setStats] = useState<AffiliateStatsDto | null>(null);
    const [invitees, setInvitees] = useState<AffiliateInviteDto[]>([]);
    const [commissions, setCommissions] = useState<AffiliateCommissionDto[]>([]);
    const [withdrawRequests, setWithdrawRequests] = useState<AffiliateWithdrawRequestDto[]>([]);
    const [affiliateLink, setAffiliateLink] = useState<AffiliateLinkDto | null>(null);
    const [settings, setSettings] = useState<SettingItem[]>([]);

    // Loading states
    const [loading, setLoading] = useState<AffiliateLoadingState>({
        stats: false,
        invitees: false,
        commissions: false,
        withdrawRequests: false,
        affiliateLink: false,
        createWithdrawRequest: false,
        settings: false,
    });

    // Error states
    const [errors, setErrors] = useState<AffiliateError>({
        stats: null,
        invitees: null,
        commissions: null,
        withdrawRequests: null,
        affiliateLink: null,
        createWithdrawRequest: null,
        settings: null,
    });

    // Helper function to update loading state
    const setLoadingState = (key: keyof AffiliateLoadingState, value: boolean) => {
        setLoading(prev => ({ ...prev, [key]: value }));
    };

    // Helper function to update error state
    const setErrorState = (key: keyof AffiliateError, value: string | null) => {
        setErrors(prev => ({ ...prev, [key]: value }));
    };

    // Fetch affiliate stats
    const fetchStats = useCallback(async () => {
        try {
            console.log('🔄 Starting to fetch affiliate stats...');
            setLoadingState('stats', true);
            setErrorState('stats', null);
            const data = await affiliateApi.getStats();
            console.log('✅ Successfully fetched stats data:', data);
            setStats(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Không thể tải thống kê';
            setErrorState('stats', errorMessage);
            console.error('❌ Error fetching affiliate stats:', error);
        } finally {
            setLoadingState('stats', false);
            console.log('🏁 Finished fetching stats');
        }
    }, []);

    // Fetch affiliate link
    const fetchAffiliateLink = useCallback(async () => {
        try {
            setLoadingState('affiliateLink', true);
            setErrorState('affiliateLink', null);
            const data = await affiliateApi.getInviteLink();
            setAffiliateLink(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Không thể tải link affiliate';
            setErrorState('affiliateLink', errorMessage);
            console.error('Error fetching affiliate link:', error);
        } finally {
            setLoadingState('affiliateLink', false);
        }
    }, []);

    // Fetch invitees
    const fetchInvitees = useCallback(async () => {
        try {
            setLoadingState('invitees', true);
            setErrorState('invitees', null);
            const data = await affiliateApi.getInvitees();
            setInvitees(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Không thể tải danh sách người giới thiệu';
            setErrorState('invitees', errorMessage);
            console.error('Error fetching invitees:', error);
        } finally {
            setLoadingState('invitees', false);
        }
    }, []);

    // Fetch commissions
    const fetchCommissions = useCallback(async () => {
        try {
            setLoadingState('commissions', true);
            setErrorState('commissions', null);
            const data = await affiliateApi.getCommissions();
            setCommissions(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Không thể tải lịch sử hoa hồng';
            setErrorState('commissions', errorMessage);
            console.error('Error fetching commissions:', error);
        } finally {
            setLoadingState('commissions', false);
        }
    }, []);

    // Fetch settings
    const fetchSettings = useCallback(async () => {
        try {
            setLoadingState('settings', true);
            setErrorState('settings', null);
            const data = await affiliateApi.getSettings();
            setSettings(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Không thể tải cài đặt';
            setErrorState('settings', errorMessage);
            console.error('Error fetching settings:', error);
        } finally {
            setLoadingState('settings', false);
        }
    }, []);

    // Fetch withdraw requests
    const fetchWithdrawRequests = useCallback(async () => {
        try {
            setLoadingState('withdrawRequests', true);
            setErrorState('withdrawRequests', null);
            const data = await affiliateApi.getWithdrawRequests();
            setWithdrawRequests(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Không thể tải lịch sử rút tiền';
            setErrorState('withdrawRequests', errorMessage);
            console.error('Error fetching withdraw requests:', error);
        } finally {
            setLoadingState('withdrawRequests', false);
        }
    }, []);

    // Create withdraw request
    const createWithdrawRequest = useCallback(async (requestData: CreateWithdrawRequestDto) => {
        try {
            setLoadingState('createWithdrawRequest', true);
            setErrorState('createWithdrawRequest', null);
            const newRequest = await affiliateApi.createWithdrawRequest(requestData);

            // Update local state with new request
            setWithdrawRequests(prev => [newRequest, ...prev]);

            // Refresh stats and commissions after successful withdrawal request
            await Promise.all([fetchStats(), fetchCommissions()]);

            return { success: true, data: newRequest };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Không thể tạo yêu cầu rút tiền';
            setErrorState('createWithdrawRequest', errorMessage);
            console.error('Error creating withdraw request:', error);
            return { success: false, error: errorMessage };
        } finally {
            setLoadingState('createWithdrawRequest', false);
        }
    }, [fetchStats, fetchCommissions]);

    // Fetch all data
    const fetchAllData = useCallback(async () => {
        await Promise.all([
            fetchStats(),
            fetchAffiliateLink(),
            fetchInvitees(),
            fetchCommissions(),
            fetchWithdrawRequests(),
            fetchSettings(),
        ]);
    }, [fetchStats, fetchAffiliateLink, fetchInvitees, fetchCommissions, fetchWithdrawRequests, fetchSettings]);

    // Settings helper functions
    const getSetting = useCallback((key: string): string | null => {
        const setting = settings.find(s => s.key === key);
        return setting ? setting.value : null;
    }, [settings]);

    const getSettingAsNumber = useCallback((key: string): number | null => {
        const value = getSetting(key);
        return value ? parseFloat(value) : null;
    }, [getSetting]);

    // Auto-fetch data on mount
    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // Calculate derived data
    const derivedData = {
        totalCommissionAmount: commissions.reduce((sum, commission) => {
            if (commission.status === 'available' || commission.status === 'withdrawn') {
                return sum + commission.amount;
            }
            return sum;
        }, 0),
        availableCommissions: commissions.filter(c => c.status === 'available'),
        pendingCommissions: commissions.filter(c => c.status === 'pending'),
        withdrawnCommissions: commissions.filter(c => c.status === 'withdrawn'),
        successfulInvites: invitees.filter(invite => invite.status === 'email_confirmed'),
        pendingWithdrawRequests: withdrawRequests.filter(req => req.status === 'pending'),
        canWithdraw: commissions.some(c => c.status === 'available') &&
            !withdrawRequests.some(req => req.status === 'pending'),
    };

    return {
        // Data
        stats,
        invitees,
        commissions,
        withdrawRequests,
        affiliateLink,
        settings,
        derivedData,

        // Loading states
        loading,

        // Error states
        errors,

        // Actions
        fetchStats,
        fetchAffiliateLink,
        fetchInvitees,
        fetchCommissions,
        fetchWithdrawRequests,
        fetchSettings,
        fetchAllData,
        createWithdrawRequest,

        // Settings helpers
        getSetting,
        getSettingAsNumber,

        // Utilities
        isLoading: Object.values(loading).some(Boolean),
        hasErrors: Object.values(errors).some(Boolean),
    };
};