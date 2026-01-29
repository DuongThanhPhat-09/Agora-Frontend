import React, { useState, useEffect } from 'react';
import EditModal from './EditModal';
import FormField from './FormField';
import {
    validateHourlyRate,
    validateTrialPrice,
    formatVND,
    parseVND
} from '../utils/validation';
import styles from './PricingModal.module.css';

interface PricingData {
    hourlyRate: number;
    trialLessonPrice: number | null;
    allowNegotiation: boolean;
}

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: PricingData) => void;
    initialData: PricingData;
}

const PricingModal: React.FC<PricingModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData
}) => {
    const [formData, setFormData] = useState<PricingData>(initialData);
    const [hourlyRateDisplay, setHourlyRateDisplay] = useState(formatVND(initialData.hourlyRate));
    const [trialPriceDisplay, setTrialPriceDisplay] = useState(
        initialData.trialLessonPrice ? formatVND(initialData.trialLessonPrice) : ''
    );
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData(initialData);
            setHourlyRateDisplay(formatVND(initialData.hourlyRate));
            setTrialPriceDisplay(initialData.trialLessonPrice ? formatVND(initialData.trialLessonPrice) : '');
            setErrors({});
        }
    }, [isOpen, initialData]);

    // Handle hourly rate change
    const handleHourlyRateChange = (value: string) => {
        const numValue = parseVND(value);
        setFormData(prev => ({ ...prev, hourlyRate: numValue }));
        setHourlyRateDisplay(value);
    };

    // Format on blur
    const handleHourlyRateBlur = () => {
        if (formData.hourlyRate > 0) {
            setHourlyRateDisplay(formatVND(formData.hourlyRate));
        }
    };

    // Handle trial price change
    const handleTrialPriceChange = (value: string) => {
        if (!value.trim()) {
            setFormData(prev => ({ ...prev, trialLessonPrice: null }));
            setTrialPriceDisplay('');
            return;
        }
        const numValue = parseVND(value);
        setFormData(prev => ({ ...prev, trialLessonPrice: numValue }));
        setTrialPriceDisplay(value);
    };

    // Format on blur
    const handleTrialPriceBlur = () => {
        if (formData.trialLessonPrice && formData.trialLessonPrice > 0) {
            setTrialPriceDisplay(formatVND(formData.trialLessonPrice));
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validate hourly rate
        const hourlyValidation = validateHourlyRate(formData.hourlyRate);
        if (!hourlyValidation.isValid) {
            newErrors.hourlyRate = hourlyValidation.error || '';
        }

        // Validate trial price
        const trialValidation = validateTrialPrice(formData.trialLessonPrice, formData.hourlyRate);
        if (!trialValidation.isValid) {
            newErrors.trialPrice = trialValidation.error || '';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle save
    const handleSave = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsLoading(false);

        onSave(formData);
        onClose();
    };

    return (
        <EditModal
            isOpen={isOpen}
            onClose={onClose}
            onSave={handleSave}
            title="Chinh sua gia day"
            isLoading={isLoading}
            size="small"
        >
            <div className={styles.form}>
                {/* Hourly Rate */}
                <div className={styles.priceField}>
                    <FormField
                        type="text"
                        name="hourlyRate"
                        label="Gia theo gio"
                        value={hourlyRateDisplay}
                        onChange={handleHourlyRateChange}
                        placeholder="VD: 200,000 VND"
                        required
                        error={errors.hourlyRate}
                        hint="50,000 - 2,000,000 VND"
                    />
                </div>

                {/* Trial Lesson Price */}
                <div className={styles.priceField}>
                    <FormField
                        type="text"
                        name="trialPrice"
                        label="Gia buoi hoc thu"
                        value={trialPriceDisplay}
                        onChange={handleTrialPriceChange}
                        placeholder="De trong neu khong co"
                        error={errors.trialPrice}
                        hint="Phai thap hon gia theo gio"
                    />
                </div>

                {/* Allow Negotiation */}
                <FormField
                    type="checkbox"
                    name="allowNegotiation"
                    label="Cho phep thuong luong gia"
                    checked={formData.allowNegotiation}
                    onChange={(checked) => setFormData(prev => ({ ...prev, allowNegotiation: checked }))}
                />

                {/* Pricing Tips */}
                <div className={styles.tips}>
                    <h4>Meo dat gia</h4>
                    <ul>
                        <li>Gia buoi hoc thu thap hon se thu hut nhieu hoc sinh hon</li>
                        <li>Xem xet gia thi truong trong khu vuc cua ban</li>
                        <li>Co the dieu chinh gia theo cap do va do kho cua mon hoc</li>
                    </ul>
                </div>
            </div>
        </EditModal>
    );
};

export default PricingModal;
