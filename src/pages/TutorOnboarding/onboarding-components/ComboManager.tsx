import React, { useState } from 'react';
import { Popconfirm } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import styles from '../styles.module.css';
import ComboFormModal from './ComboFormModal';
import { DAY_COLUMNS, formatHour } from './constants';
import type { Combo, TutorAvailabilitySlot } from './types';

interface ComboManagerProps {
  combos: Combo[];
  availability: TutorAvailabilitySlot[];
  onAdd: (combo: Combo) => void;
  onUpdate: (id: string, combo: Combo) => void;
  onRemove: (id: string) => void;
}

const dayLabel = (dow: number) => DAY_COLUMNS.find((c) => c.dayOfWeek === dow)?.full ?? `Ngày ${dow}`;
const getFixedTotalHours = (combo: Extract<Combo, { type: 'fixed' }>) =>
  combo.sessions.reduce((sum, session) => sum + session.durationHours, 0);

const ComboManager: React.FC<ComboManagerProps> = ({ combos, availability, onAdd, onUpdate, onRemove }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Combo | null>(null);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (combo: Combo) => {
    setEditing(combo);
    setModalOpen(true);
  };
  const handleSave = (combo: Combo) => {
    if (editing) onUpdate(editing.id, combo);
    else onAdd(combo);
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <>
      <section className={styles.comboManager}>
        <div className={styles.comboManagerHead}>
          <div>
            <h3 className={styles.comboManagerTitle}>Combo của bạn</h3>
            <p className={styles.comboManagerSubtitle}>Tạo một hoặc nhiều gói để phụ huynh dễ chọn lịch học phù hợp.</p>
          </div>
          {combos.length > 0 && (
            <button type="button" className={styles.comboPrimaryAction} onClick={openCreate}>
              <PlusOutlined />
              <span>Thêm combo</span>
            </button>
          )}
        </div>

        {combos.length === 0 ? (
          <div className={styles.comboEmptyState}>
            <div className={styles.comboEmptyIcon}>
              <CalendarOutlined />
            </div>
            <h3>Chưa có combo học</h3>
            <p>Tạo combo đầu tiên để phụ huynh có thể chọn lịch phù hợp khi đặt học.</p>
            <div className={styles.comboEmptyModes}>
              <span>
                <CalendarOutlined />
                Cố định theo tuần
              </span>
              <span>
                <ThunderboltOutlined />
                Linh hoạt theo số buổi
              </span>
            </div>
            <button type="button" className={styles.comboPrimaryAction} onClick={openCreate}>
              <PlusOutlined />
              <span>Tạo combo đầu tiên</span>
            </button>
          </div>
        ) : (
          <div className={styles.comboList}>
            {combos.map((combo) => {
              const totalHours =
                combo.type === 'fixed' ? getFixedTotalHours(combo) : combo.sessionsPerWeek * combo.hoursPerSession;

              return (
                <div key={combo.id} className={styles.comboCard}>
                  <div className={styles.comboCardHead}>
                    <span
                      className={`${styles.comboTypeBadge} ${
                        combo.type === 'fixed' ? styles.comboFixed : styles.comboFlex
                      }`}
                    >
                      {combo.type === 'fixed' ? 'Lịch cố định' : 'Lịch linh hoạt'}
                    </span>
                    <div className={styles.comboCardActions}>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => openEdit(combo)}
                        aria-label={`Sửa ${combo.name}`}
                        title="Sửa combo"
                      >
                        <EditOutlined />
                      </button>
                      <Popconfirm
                        title="Xóa combo này?"
                        onConfirm={() => onRemove(combo.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                      >
                        <button
                          type="button"
                          className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                          aria-label={`Xóa ${combo.name}`}
                          title="Xóa combo"
                        >
                          <DeleteOutlined />
                        </button>
                      </Popconfirm>
                    </div>
                  </div>

                  <h4 className={styles.comboName}>{combo.name}</h4>

                  <div className={styles.comboMetaRow}>
                    <span>
                      <CalendarOutlined />
                      <strong>{combo.type === 'fixed' ? combo.sessions.length : combo.sessionsPerWeek}</strong>{' '}
                      buổi/tuần
                    </span>
                    <span>
                      <ClockCircleOutlined />
                      <strong>{totalHours}</strong> giờ/tuần
                    </span>
                  </div>

                  {combo.type === 'fixed' ? (
                    <div className={styles.comboScheduleList}>
                      {combo.sessions.map((session, index) => (
                        <div key={index} className={styles.comboScheduleItem}>
                          <span className={styles.comboScheduleIndex}>{index + 1}</span>
                          <div>
                            <strong>{dayLabel(session.dayOfWeek)}</strong>
                            <span>
                              {formatHour(session.startHour)} - {formatHour(session.startHour + session.durationHours)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.comboFlexInfo}>
                      <strong>{combo.sessionsPerMonth} buổi/tháng</strong>
                      <span> · {combo.hoursPerSession} giờ/buổi</span>
                      <p className={styles.comboDescription}>{combo.description}</p>
                    </div>
                  )}
                </div>
              );
            })}

            <button type="button" className={styles.comboAddBtn} onClick={openCreate}>
              <span className={styles.comboAddIcon}>
                <PlusOutlined />
              </span>
              <strong>Thêm combo khác</strong>
              <span>Mở thêm lựa chọn lịch học cho phụ huynh</span>
            </button>
          </div>
        )}
      </section>

      {modalOpen && (
        <ComboFormModal
          open
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSave={handleSave}
          initial={editing}
          availability={availability}
        />
      )}
    </>
  );
};

export default ComboManager;
