import { FunctionComponent, useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import styles from './AddAvailabilityModal.module.css';

interface AddAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddAvailabilityModal: FunctionComponent<AddAvailabilityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [date, setDate] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement add availability logic
    console.log('Add availability:', { date, fromTime, toTime });
    onClose();
    // Reset form
    setDate('');
    setFromTime('');
    setToTime('');
  };

  const handleCancel = () => {
    // Reset form
    setDate('');
    setFromTime('');
    setToTime('');
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.modalOverlay} ${isOpen ? styles.open : ''}`}
        onClick={handleOverlayClick}
      />

      {/* Sidebar Modal */}
      <div className={`${styles.sidebarModal} ${isOpen ? styles.open : ''}`}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Add Availability</h2>
          <button className={styles.closeBtn} onClick={handleCancel} type="button">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Form Content */}
        <div className={styles.content}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formFields}>
              {/* Date Field */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Date</label>
                <div className={styles.inputWrapper}>
                  <div className={styles.inputIcon}>
                    <Calendar size={14} strokeWidth={2} />
                  </div>
                  <input
                    type="date"
                    className={styles.input}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Time Range Fields */}
              <div className={styles.timeRangeGroup}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>From</label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.inputIcon}>
                      <Clock size={14} strokeWidth={2} />
                    </div>
                    <input
                      type="time"
                      className={styles.input}
                      value={fromTime}
                      onChange={(e) => setFromTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>To</label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.inputIcon}>
                      <Clock size={14} strokeWidth={2} />
                    </div>
                    <input
                      type="time"
                      className={styles.input}
                      value={toTime}
                      onChange={(e) => setToTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actions}>
              <button type="submit" className={styles.primaryBtn}>
                Publish Slot
              </button>
              <button type="button" className={styles.secondaryBtn} onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddAvailabilityModal;
