import React, { useState } from 'react';
import { Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import styles from '../styles.module.css';
import ComboFormModal from './ComboFormModal';
import { DAY_COLUMNS, formatHour } from './constants';
import type { Combo } from './types';
import type { UseOnboardingState } from './hooks/useOnboardingState';

interface StepCombosProps {
    onboarding: UseOnboardingState;
}

const dayLabel = (dow: number) => DAY_COLUMNS.find((c) => c.dayOfWeek === dow)?.full ?? `Ngày ${dow}`;

const StepCombos: React.FC<StepCombosProps> = ({ onboarding }) => {
    const { state, addCombo, updateCombo, removeCombo } = onboarding;
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Combo | null>(null);

    const openCreate = () => {
        setEditing(null);
        setModalOpen(true);
    };
    const openEdit = (c: Combo) => {
        setEditing(c);
        setModalOpen(true);
    };
    const handleSave = (combo: Combo) => {
        if (editing) updateCombo(editing.id, combo);
        else addCombo(combo);
        setModalOpen(false);
        setEditing(null);
    };

    return (
        <div>
            <h2 className={styles.stepHeading}>Tạo combo học</h2>
            <p className={styles.stepHint}>
                Combo là <strong>khung lịch dùng chung cho mọi môn</strong> bạn dạy. Phụ huynh sẽ chọn môn cụ thể khi đặt
                lịch — giá tự tính theo giá/giờ của môn đó. Bước này không bắt buộc.
            </p>

            <div className={styles.comboList}>
                {state.combos.map((c) => (
                    <div key={c.id} className={styles.comboCard}>
                        <div className={styles.comboCardHead}>
                            <span
                                className={`${styles.comboTypeBadge} ${
                                    c.type === 'fixed' ? styles.comboFixed : styles.comboFlex
                                }`}
                            >
                                {c.type === 'fixed' ? 'Cố định' : 'Linh hoạt'}
                            </span>
                            <div className={styles.comboCardActions}>
                                <button type="button" className={styles.iconBtn} onClick={() => openEdit(c)}>
                                    <EditOutlined />
                                </button>
                                <Popconfirm
                                    title="Xóa combo này?"
                                    onConfirm={() => removeCombo(c.id)}
                                    okText="Xóa"
                                    cancelText="Hủy"
                                    okButtonProps={{ danger: true }}
                                >
                                    <button type="button" className={`${styles.iconBtn} ${styles.iconBtnDanger}`}>
                                        <DeleteOutlined />
                                    </button>
                                </Popconfirm>
                            </div>
                        </div>

                        <h4 className={styles.comboName}>{c.name}</h4>

                        {c.type === 'fixed' ? (
                            <ul className={styles.comboSessionList}>
                                {c.sessions.map((s, i) => (
                                    <li key={i}>
                                        {dayLabel(s.dayOfWeek)} · {formatHour(s.startHour)}–
                                        {formatHour(s.startHour + s.durationHours)} ({s.durationHours} giờ)
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className={styles.comboFlexInfo}>
                                <div>
                                    <strong>{c.sessionsPerWeek}</strong> buổi/tuần · <strong>{c.sessionsPerMonth}</strong>{' '}
                                    buổi/tháng · <strong>{c.hoursPerSession}</strong> giờ/buổi
                                </div>
                                <p className={styles.comboDescription}>{c.description}</p>
                            </div>
                        )}
                    </div>
                ))}

                <button type="button" className={styles.comboAddBtn} onClick={openCreate}>
                    <PlusOutlined />
                    <span>Thêm combo</span>
                </button>
            </div>

            <ComboFormModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditing(null);
                }}
                onSave={handleSave}
                initial={editing}
                availability={state.availability}
            />
        </div>
    );
};

export default StepCombos;
