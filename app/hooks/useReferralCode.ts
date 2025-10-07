'use client';

import { useState, useEffect, useCallback } from 'react';

const REFERRAL_CODE_KEY = 'affiliate_ref_code';
const REFERRAL_EXPIRY_KEY = 'affiliate_ref_expiry';
const REFERRAL_EXPIRY_DAYS = 30; // Ref code expires after 30 days

export const useReferralCode = () => {
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [isValidReferralCode, setIsValidReferralCode] = useState<boolean>(false);

    // Save referral code to localStorage with expiry
    const saveReferralCode = useCallback((refCode: string) => {
        if (!refCode || refCode.trim() === '') return false;

        try {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + REFERRAL_EXPIRY_DAYS);

            localStorage.setItem(REFERRAL_CODE_KEY, refCode.trim());
            localStorage.setItem(REFERRAL_EXPIRY_KEY, expiryDate.getTime().toString());

            setReferralCode(refCode.trim());
            setIsValidReferralCode(true);

            console.log('Referral code saved:', refCode.trim());
            return true;
        } catch (error) {
            console.error('Error saving referral code:', error);
            return false;
        }
    }, []);

    // Get referral code from localStorage
    const getReferralCode = useCallback((): string | null => {
        try {
            const storedCode = localStorage.getItem(REFERRAL_CODE_KEY);
            const storedExpiry = localStorage.getItem(REFERRAL_EXPIRY_KEY);

            if (!storedCode || !storedExpiry) {
                return null;
            }

            const expiryDate = new Date(parseInt(storedExpiry));
            const now = new Date();

            // Check if referral code has expired
            if (now > expiryDate) {
                clearReferralCode();
                return null;
            }

            return storedCode;
        } catch (error) {
            console.error('Error getting referral code:', error);
            return null;
        }
    }, []);

    // Clear referral code from localStorage
    const clearReferralCode = useCallback(() => {
        try {
            localStorage.removeItem(REFERRAL_CODE_KEY);
            localStorage.removeItem(REFERRAL_EXPIRY_KEY);
            setReferralCode(null);
            setIsValidReferralCode(false);
            console.log('Referral code cleared');
        } catch (error) {
            console.error('Error clearing referral code:', error);
        }
    }, []);

    // Extract referral code from URL
    const extractReferralFromUrl = useCallback((url?: string): string | null => {
        try {
            const currentUrl = url || window.location.href;
            const urlParams = new URLSearchParams(new URL(currentUrl).search);
            return urlParams.get('ref');
        } catch (error) {
            console.error('Error extracting referral from URL:', error);
            return null;
        }
    }, []);

    // Initialize referral code on component mount
    useEffect(() => {
        // First, check if there's a ref parameter in the current URL
        const urlRef = extractReferralFromUrl();
        if (urlRef) {
            saveReferralCode(urlRef);
            return;
        }

        // If no URL ref, check localStorage
        const storedRef = getReferralCode();
        if (storedRef) {
            setReferralCode(storedRef);
            setIsValidReferralCode(true);
        }
    }, [extractReferralFromUrl, getReferralCode, saveReferralCode]);

    // Handle page navigation to capture ref codes
    useEffect(() => {
        const handlePopState = () => {
            const urlRef = extractReferralFromUrl();
            if (urlRef) {
                saveReferralCode(urlRef);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [extractReferralFromUrl, saveReferralCode]);

    // Format referral code for API submission
    const getFormattedReferralCode = useCallback((): string | undefined => {
        const code = getReferralCode();
        return code || undefined;
    }, [getReferralCode]);

    // Check if user came from referral link
    const isFromReferralLink = useCallback((): boolean => {
        return isValidReferralCode && referralCode !== null;
    }, [isValidReferralCode, referralCode]);

    // Get referral info for display
    const getReferralInfo = useCallback(() => {
        if (!isValidReferralCode || !referralCode) {
            return null;
        }

        try {
            const expiryTimestamp = localStorage.getItem(REFERRAL_EXPIRY_KEY);
            const expiryDate = expiryTimestamp ? new Date(parseInt(expiryTimestamp)) : null;

            return {
                code: referralCode,
                expiryDate,
                isValid: isValidReferralCode,
                daysRemaining: expiryDate ? Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0,
            };
        } catch (error) {
            console.error('Error getting referral info:', error);
            return null;
        }
    }, [isValidReferralCode, referralCode]);

    return {
        referralCode,
        isValidReferralCode,
        saveReferralCode,
        getReferralCode,
        clearReferralCode,
        extractReferralFromUrl,
        getFormattedReferralCode,
        isFromReferralLink,
        getReferralInfo,
    };
};