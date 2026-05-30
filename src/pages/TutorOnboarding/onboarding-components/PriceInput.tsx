import React from 'react';
import { Slider, InputNumber } from 'antd';
import styles from '../styles.module.css';
import { formatPrice } from './constants';

interface PriceInputProps {
    value: number | null;
    onChange: (v: number | null) => void;
    min?: number;
    max?: number;
    step?: number;
    suffix?: string; // mặc định 'VND / giờ'
}

// PriceInput dùng cho B2 (giá/giờ) và B4 (giá combo). Slider + ô nhập tay
// đồng bộ, gõ tự do; chỉ ép [min,max] khi rời ô (antd InputNumber min/max).
const PriceInput: React.FC<PriceInputProps> = ({
    value,
    onChange,
    min = 50000,
    max = 1000000,
    step = 10000,
    suffix = 'VND / giờ',
}) => {
    // Mốc động: 4 cột tròn k/tr theo khoảng [min,max].
    const fmtMark = (n: number) => (n >= 1000000 ? `${Math.round(n / 100000) / 10}tr` : `${Math.round(n / 1000)}k`);
    const mid1 = min + Math.round(((max - min) / 3) / step) * step;
    const mid2 = min + Math.round(((max - min) * 2 / 3) / step) * step;
    const marks: Record<number, string> = {
        [min]: fmtMark(min),
        [mid1]: fmtMark(mid1),
        [mid2]: fmtMark(mid2),
        [max]: fmtMark(max),
    };

    return (
        <div>
            <div className={styles.priceDisplay}>
                {formatPrice(value ?? 0)} <span>{suffix}</span>
            </div>

            <Slider
                min={min}
                max={max}
                step={step}
                value={value ?? min}
                onChange={(v) => onChange(v as number)}
                marks={marks}
                tooltip={{ formatter: (v) => `${formatPrice(v ?? 0)}đ` }}
            />

            <div className={styles.priceInputRow}>
                <span className={styles.priceInputLabel}>Hoặc nhập chính xác:</span>
                <InputNumber<number>
                    min={min}
                    max={max}
                    step={step}
                    value={value ?? undefined}
                    onChange={(v) => onChange(v ?? null)}
                    formatter={(v) => (v ? formatPrice(Number(v)) : '')}
                    parser={(v) => (v ? Number(v.replace(/\D/g, '')) : 0)}
                    addonAfter="VND"
                    style={{ width: 170 }}
                />
            </div>
        </div>
    );
};

export default PriceInput;
