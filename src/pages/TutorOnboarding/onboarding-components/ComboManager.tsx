import React, { useState } from 'react';
import { Popconfirm } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import styles from '../styles.module.css';
import ComboFormModal from './ComboFormModal';
import { DAY_COLUMNS, formatHour } from './constants';
import type { FixedCombo, TutorAvailabilitySlot } from './types';

interface ComboManagerProps {
  combos: FixedCombo[];
  availability: TutorAvailabilitySlot[];
  onAdd: (combo: FixedCombo) => void;
  onUpdate: (id: string, combo: FixedCombo) => void;
  onRemove: (id: string) => void;
}

const dayLabel = (dow: number) => DAY_COLUMNS.find((c) => c.dayOfWeek === dow)?.full ?? `Ngày ${dow}`;
const getTotalHours = (combo: FixedCombo) => combo.sessions.reduce((sum, session) => sum + session.durationHours, 0);

const ComboManager: React.FC<ComboManagerProps> = ({ combos, availability, onAdd, onUpdate, onRemove }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FixedCombo | null>(null);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (combo: FixedCombo) => {
    setEditing(combo);
    setModalOpen(true);
  };
  const handleSave = (combo: FixedCombo) => {
    if (editing) onUpdate(editing.id, combo);
    else onAdd(combo);
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <>
      <section className={styles.comboManager}>
        <div className={styles.comboManagerHead}>
          <h3 className={styles.comboManagerTitle}>Gói lịch học của bạn</h3>
          {combos.length > 0 && (
            <button type="button" className={styles.comboPrimaryAction} onClick={openCreate}>
              <PlusOutlined />
              <span>Thêm gói</span>
            </button>
          )}
        </div>

        {combos.length === 0 ? (
          <div className={styles.comboEmptyState}>
            <div className={styles.comboEmptyIcon}>
              <CalendarOutlined />
            </div>
            <button type="button" className={styles.comboPrimaryAction} onClick={openCreate}>
              <PlusOutlined />
              <span>Tạo gói lịch học</span>
            </button>
          </div>
        ) : (
          <div className={styles.comboList}>
            {combos.map((combo) => (
              <div key={combo.id} className={styles.comboCard}>
                <div className={styles.comboCardHead}>
                  <span className={`${styles.comboTypeBadge} ${styles.comboFixed}`}>Lịch cố định</span>
                  <div className={styles.comboCardActions}>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={() => openEdit(combo)}
                      aria-label={`Sửa ${combo.name}`}
                      title="Sửa gói lịch học"
                    >
                      <EditOutlined />
                    </button>
                    <Popconfirm
                      title="Xóa gói lịch học này?"
                      onConfirm={() => onRemove(combo.id)}
                      okText="Xóa"
                      cancelText="Hủy"
                      okButtonProps={{ danger: true }}
                    >
                      <button
                        type="button"
                        className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                        aria-label={`Xóa ${combo.name}`}
                        title="Xóa gói lịch học"
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
                    <strong>{combo.sessions.length}</strong> buổi/tuần
                  </span>
                  <span>
                    <ClockCircleOutlined />
                    <strong>{getTotalHours(combo)}</strong> giờ/tuần
                  </span>
                </div>

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
              </div>
            ))}

            <button type="button" className={styles.comboAddBtn} onClick={openCreate}>
              <span className={styles.comboAddIcon}>
                <PlusOutlined />
              </span>
              <strong>Thêm gói lịch học khác</strong>
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
          existingCombos={editing ? combos.filter((c) => c.id !== editing.id) : combos}
        />
      )}
    </>
  );
};

export default ComboManager;
