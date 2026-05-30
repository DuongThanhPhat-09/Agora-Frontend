import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Radio, Select, Input, InputNumber, Button } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import styles from '../styles.module.css';
import ComboPreview from './ComboPreview';
import { DAY_COLUMNS, formatHour } from './constants';
import type { AvailabilitySlot, Combo, FixedCombo, FlexCombo } from '../onboarding-components/types';

interface ComboFormModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (combo: Combo) => void;
    initial: Combo | null;
    availability: AvailabilitySlot[];
}

const newComboId = () => `combo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const defaultFixed = (): FixedCombo => ({
    id: newComboId(),
    type: 'fixed',
    name: '',
    sessions: [],
});

const defaultFlex = (): FlexCombo => ({
    id: newComboId(),
    type: 'flex',
    name: '',
    sessionsPerWeek: 2,
    sessionsPerMonth: 8,
    hoursPerSession: 1.5,
    description: '',
});

const ComboFormModal: React.FC<ComboFormModalProps> = ({ open, onClose, onSave, initial, availability }) => {
    const [combo, setCombo] = useState<Combo>(() => initial ?? defaultFixed());

    useEffect(() => {
        if (open) setCombo(initial ?? defaultFixed());
    }, [open, initial]);

    const { availByDay, availSet, availableDays } = useMemo(() => {
        const map = new Map<number, number[]>();
        availability.forEach((sl) => {
            const arr = map.get(sl.dayOfWeek) ?? [];
            arr.push(sl.startHour);
            map.set(sl.dayOfWeek, arr.sort((a, b) => a - b));
        });
        const set = new Set(availability.map((sl) => sl.id));
        const days = DAY_COLUMNS.filter((c) => map.has(c.dayOfWeek));
        return { availByDay: map, availSet: set, availableDays: days };
    }, [availability]);

    const maxDuration = (day: number, start: number) => {
        let n = 0;
        while (n < 4 && availSet.has(`${day}-${start + n}`)) n++;
        return Math.max(1, n);
    };

    const isValid = (() => {
        if (!combo.name.trim()) return false;
        if (combo.type === 'fixed') {
            if (combo.sessions.length === 0) return false;
            return combo.sessions.every((s) => {
                for (let i = 0; i < s.durationHours; i++) {
                    if (!availSet.has(`${s.dayOfWeek}-${s.startHour + i}`)) return false;
                }
                return true;
            });
        }
        return (
            combo.sessionsPerWeek > 0 &&
            combo.sessionsPerMonth > 0 &&
            combo.hoursPerSession > 0 &&
            combo.description.trim().length > 0
        );
    })();

    const handleTypeChange = (type: 'fixed' | 'flex') => {
        if (type === combo.type) return;
        setCombo(type === 'fixed' ? defaultFixed() : defaultFlex());
    };

    // Fixed combo session helpers — guard bằng discriminator để TS narrow combo.
    const addSession = () => {
        if (combo.type !== 'fixed') return;
        const day = availableDays[0]?.dayOfWeek ?? 1;
        const startHour = availByDay.get(day)?.[0] ?? 6;
        setCombo({
            ...combo,
            sessions: [...combo.sessions, { dayOfWeek: day, startHour, durationHours: 1 }],
        });
    };
    const updateSession = (i: number, patch: Partial<FixedCombo['sessions'][number]>) => {
        if (combo.type !== 'fixed') return;
        setCombo({
            ...combo,
            sessions: combo.sessions.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
        });
    };
    const removeSession = (i: number) => {
        if (combo.type !== 'fixed') return;
        setCombo({ ...combo, sessions: combo.sessions.filter((_, idx) => idx !== i) });
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            onOk={() => onSave(combo)}
            okText={initial ? 'Cập nhật combo' : 'Tạo combo'}
            cancelText="Hủy"
            okButtonProps={{ disabled: !isValid }}
            title={initial ? 'Sửa combo' : 'Tạo combo học'}
            width={620}
            destroyOnClose
        >
            <div className={styles.comboForm}>
                <div className={styles.comboFormField}>
                    <Radio.Group value={combo.type} onChange={(e) => handleTypeChange(e.target.value)}>
                        <Radio value="fixed">Combo cố định</Radio>
                        <Radio value="flex">Combo linh hoạt</Radio>
                    </Radio.Group>
                </div>

                <div className={styles.comboFormField}>
                    <label className={styles.comboFormLabel}>Tên combo</label>
                    <Input
                        value={combo.name}
                        onChange={(e) => setCombo({ ...combo, name: e.target.value } as Combo)}
                        placeholder="vd: Combo 8 buổi/tháng — tối T2/T4/T6"
                    />
                </div>

                <div className={styles.comboFormHint}>
                    Combo là khung lịch dùng chung. Phụ huynh sẽ chọn môn học trong các môn bạn dạy ở bước đặt lịch — giá
                    sẽ được tính theo giá/giờ của môn đó.
                </div>

                {combo.type === 'fixed' ? (
                    <div className={styles.comboFormField}>
                        <label className={styles.comboFormLabel}>
                            Buổi cố định trong tuần — chọn từ lịch rảnh
                        </label>
                        {availableDays.length === 0 ? (
                            <div className={styles.comboFormHint}>
                                Chưa có lịch rảnh. Quay lại bước 3 để đánh dấu khung giờ trước.
                            </div>
                        ) : (
                            <div className={styles.sessionList}>
                                {combo.sessions.map((sess, i) => {
                                    const dayHours = availByDay.get(sess.dayOfWeek) ?? [];
                                    const md = maxDuration(sess.dayOfWeek, sess.startHour);
                                    return (
                                        <div key={i} className={styles.sessionRow}>
                                            <Select
                                                size="small"
                                                value={sess.dayOfWeek}
                                                onChange={(v) => {
                                                    const firstHour = availByDay.get(v)?.[0] ?? 6;
                                                    updateSession(i, {
                                                        dayOfWeek: v,
                                                        startHour: firstHour,
                                                        durationHours: 1,
                                                    });
                                                }}
                                                options={availableDays.map((c) => ({
                                                    value: c.dayOfWeek,
                                                    label: c.full,
                                                }))}
                                                style={{ minWidth: 110 }}
                                            />
                                            <Select
                                                size="small"
                                                value={sess.startHour}
                                                onChange={(v) => {
                                                    const newMax = maxDuration(sess.dayOfWeek, v);
                                                    updateSession(i, {
                                                        startHour: v,
                                                        durationHours: Math.min(sess.durationHours, newMax),
                                                    });
                                                }}
                                                options={dayHours.map((h) => ({
                                                    value: h,
                                                    label: formatHour(h),
                                                }))}
                                                style={{ minWidth: 90 }}
                                            />
                                            <Select
                                                size="small"
                                                value={sess.durationHours}
                                                onChange={(v) => updateSession(i, { durationHours: v })}
                                                options={Array.from({ length: md }, (_, k) => ({
                                                    value: k + 1,
                                                    label: `${k + 1} giờ`,
                                                }))}
                                                style={{ minWidth: 80 }}
                                            />
                                            <Button
                                                size="small"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => removeSession(i)}
                                            />
                                        </div>
                                    );
                                })}
                                <Button
                                    size="small"
                                    icon={<PlusOutlined />}
                                    onClick={addSession}
                                    style={{ alignSelf: 'flex-start' }}
                                >
                                    Thêm buổi
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className={styles.comboFormRow}>
                            <div className={styles.comboFormField}>
                                <label className={styles.comboFormLabel}>Số buổi / tuần</label>
                                <InputNumber
                                    value={combo.sessionsPerWeek}
                                    min={1}
                                    max={7}
                                    onChange={(v) =>
                                        setCombo({ ...combo, sessionsPerWeek: (v as number) ?? 1 } as Combo)
                                    }
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div className={styles.comboFormField}>
                                <label className={styles.comboFormLabel}>Số buổi / tháng</label>
                                <InputNumber
                                    value={combo.sessionsPerMonth}
                                    min={1}
                                    max={31}
                                    onChange={(v) =>
                                        setCombo({ ...combo, sessionsPerMonth: (v as number) ?? 1 } as Combo)
                                    }
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div className={styles.comboFormField}>
                                <label className={styles.comboFormLabel}>Số giờ / buổi</label>
                                <InputNumber
                                    value={combo.hoursPerSession}
                                    min={0.5}
                                    max={8}
                                    step={0.5}
                                    onChange={(v) =>
                                        setCombo({ ...combo, hoursPerSession: (v as number) ?? 1 } as Combo)
                                    }
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>
                        <div className={styles.comboFormField}>
                            <label className={styles.comboFormLabel}>Mô tả gói</label>
                            <Input.TextArea
                                rows={3}
                                value={combo.description}
                                onChange={(e) => setCombo({ ...combo, description: e.target.value } as Combo)}
                                placeholder="vd: Phụ huynh tự chọn lịch theo số buổi/tuần. Ưu tiên cuối tuần buổi tối..."
                            />
                        </div>
                    </>
                )}

                <ComboPreview combo={combo} availability={availability} />
            </div>
        </Modal>
    );
};

export default ComboFormModal;
