/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getAuthHeaders, type ApiResponse } from './tutorProfile.service';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface PaymentInfoDTO {
    bookingId: number;
    paymentLinkId: string;
    paymentCode: string;
    amount: number;
    currency: string;
    checkoutUrl: string;
    qrCode: string;
    accountNumber: string;
    accountName: string;
    bin: string;
    description: string;
    expiredAt: string | null;
    status: string;
    canPayWithWallet: boolean;
    walletBalance: number;
}

export interface PaymentStatusDTO {
    bookingId: number;
    status: string;
    amount: number;
    amountPaid: number;
    amountRemaining: number;
    isPaid: boolean;
}

/** Get payment information for a booking (QR code, checkout URL, wallet balance) */
export const getPaymentInfo = async (bookingId: number): Promise<PaymentInfoDTO> => {
    const response = await api.get(`/bookings/${bookingId}/payment-info`, {
        headers: getAuthHeaders(),
    });
    return response.data.content;
};

/** Get current payment status for a booking */
export const getPaymentStatus = async (bookingId: number): Promise<PaymentStatusDTO> => {
    const response = await api.get(`/bookings/${bookingId}/payment-status`, {
        headers: getAuthHeaders(),
    });
    return response.data.content;
};

/** Pay for a booking using wallet balance */
export const payWithWallet = async (bookingId: number): Promise<ApiResponse<any>> => {
    const response = await api.post(`/bookings/${bookingId}/pay-with-wallet`, null, {
        headers: getAuthHeaders(),
    });
    return response.data;
};
