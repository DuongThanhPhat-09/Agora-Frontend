import { useState } from 'react';
import type { TutorDetailForReview } from '../../../types/admin.types';
import '../../../styles/pages/admin-vetting-modal.css';

interface TutorDetailModalProps {
  tutorDetail: TutorDetailForReview | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (tutorId: string) => Promise<void>;
  onReject: (tutorId: string, rejectionNote: string) => Promise<void>;
}

type TabType = 'personal' | 'identity' | 'profile' | 'subjects' | 'availability' | 'credentials';

const TutorDetailModal: React.FC<TutorDetailModalProps> = ({
  tutorDetail,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  if (!isOpen || !tutorDetail) return null;

  const { user, profile, subjects, availability } = tutorDetail;

  // Tab configuration
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'personal', label: 'Thông tin cá nhân', icon: 'person' },
    { id: 'identity', label: 'Xác minh danh tính', icon: 'badge' },
    { id: 'profile', label: 'Hồ sơ gia sư', icon: 'school' },
    { id: 'subjects', label: 'Môn học', icon: 'menu_book' },
    { id: 'availability', label: 'Lịch rảnh', icon: 'event' },
    { id: 'credentials', label: 'Bằng cấp', icon: 'workspace_premium' },
  ];

  // Handlers
  const handleApprove = async () => {
    if (!profile.tutorid) return;

    const confirmed = window.confirm(
      'Bạn có chắc chắn muốn phê duyệt hồ sơ gia sư này?\n\n' +
      'Profile sẽ được công khai và gia sư có thể bắt đầu nhận học viên.'
    );

    if (!confirmed) return;

    setIsApproving(true);
    try {
      await onApprove(profile.tutorid);
      onClose();
    } catch (error) {
      console.error('Error approving tutor:', error);
      alert('Có lỗi xảy ra khi phê duyệt. Vui lòng thử lại.');
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectClick = () => {
    setShowRejectionModal(true);
  };

  const handleRejectSubmit = async (rejectionNote: string) => {
    if (!profile.tutorid) return;

    setIsRejecting(true);
    try {
      await onReject(profile.tutorid, rejectionNote);
      setShowRejectionModal(false);
      onClose();
    } catch (error) {
      console.error('Error rejecting tutor:', error);
      alert('Có lỗi xảy ra khi từ chối. Vui lòng thử lại.');
    } finally {
      setIsRejecting(false);
    }
  };

  // Format date helper
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Format day of week helper
  const formatDayOfWeek = (day: number): string => {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[day] || 'N/A';
  };

  return (
    <>
      {/* Modal Overlay */}
      <div className="vetting-modal-overlay" onClick={onClose}>
        <div className="vetting-modal-container" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="vetting-modal-header">
            <div className="vetting-modal-title-section">
              <h2 className="vetting-modal-title">Xem xét hồ sơ gia sư</h2>
              <p className="vetting-modal-subtitle">{user.fullname}</p>
            </div>
            <button className="vetting-modal-close-btn" onClick={onClose}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="vetting-modal-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`vetting-modal-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="material-symbols-outlined">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="vetting-modal-body">
            {/* Tab 1: Personal Info */}
            {activeTab === 'personal' && (
              <div className="vetting-tab-content">
                <h3 className="vetting-section-title">Thông tin cá nhân</h3>
                <div className="vetting-info-grid">
                  <div className="vetting-info-item">
                    <label>Họ và tên</label>
                    <p>{user.fullname}</p>
                  </div>
                  <div className="vetting-info-item">
                    <label>Email</label>
                    <p>{user.email}</p>
                  </div>
                  <div className="vetting-info-item">
                    <label>Số điện thoại</label>
                    <p>{user.phone}</p>
                  </div>
                  <div className="vetting-info-item">
                    <label>Ngày sinh</label>
                    <p>{formatDate(user.birthdate)}</p>
                  </div>
                  <div className="vetting-info-item">
                    <label>Giới tính</label>
                    <p>{user.gender || 'N/A'}</p>
                  </div>
                  <div className="vetting-info-item">
                    <label>Địa chỉ</label>
                    <p>{user.address || 'N/A'}</p>
                  </div>
                  <div className="vetting-info-item">
                    <label>Số CCCD</label>
                    <p>{user.identitynumber || 'N/A'}</p>
                  </div>
                  <div className="vetting-info-item">
                    <label>Trạng thái xác minh</label>
                    <span className={`vetting-badge ${user.isidentityverified ? 'verified' : 'pending'}`}>
                      {user.isidentityverified ? '✓ Đã xác minh' : '⏳ Chưa xác minh'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Identity Verification */}
            {activeTab === 'identity' && (
              <div className="vetting-tab-content">
                <h3 className="vetting-section-title">Xác minh danh tính (CCCD)</h3>

                <div className="vetting-identity-status">
                  <span className={`vetting-badge ${user.isidentityverified ? 'verified' : 'pending'}`}>
                    {user.isidentityverified ? '✓ Đã xác minh' : '⏳ Chờ xác minh'}
                  </span>
                </div>

                <div className="vetting-cccd-section">
                  <p className="vetting-cccd-label">Số CCCD: <strong>{user.identitynumber || 'N/A'}</strong></p>

                  <div className="vetting-cccd-images">
                    {/* CCCD Front */}
                    <div className="vetting-cccd-image-wrapper">
                      <label>CCCD Mặt trước</label>
                      {user.idcardfronturl ? (
                        <img
                          src={user.idcardfronturl}
                          alt="CCCD mặt trước"
                          className="vetting-cccd-image"
                        />
                      ) : (
                        <div className="vetting-cccd-placeholder">Chưa có ảnh</div>
                      )}
                    </div>

                    {/* CCCD Back */}
                    <div className="vetting-cccd-image-wrapper">
                      <label>CCCD Mặt sau</label>
                      {user.idcardbackurl ? (
                        <img
                          src={user.idcardbackurl}
                          alt="CCCD mặt sau"
                          className="vetting-cccd-image"
                        />
                      ) : (
                        <div className="vetting-cccd-placeholder">Chưa có ảnh</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* eKYC Data - TODO: Parse and display */}
                {user.ekycRawData && (
                  <div className="vetting-ekyc-section">
                    <h4 className="vetting-subsection-title">Dữ liệu eKYC</h4>
                    <div className="vetting-info-box">
                      <p className="vetting-info-note">
                        Dữ liệu được trích xuất tự động từ CCCD
                      </p>
                      {/* TODO: Parse ekycRawData JSON and display formatted */}
                      <pre className="vetting-ekyc-data">{user.ekycRawData}</pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Tutor Profile */}
            {activeTab === 'profile' && (
              <div className="vetting-tab-content">
                <h3 className="vetting-section-title">Hồ sơ gia sư</h3>

                <div className="vetting-info-grid">
                  <div className="vetting-info-item full-width">
                    <label>Tiêu đề</label>
                    <p>{profile.headline || 'N/A'}</p>
                  </div>

                  <div className="vetting-info-item full-width">
                    <label>Giới thiệu bản thân</label>
                    <p className="vetting-multiline">{profile.bio || 'N/A'}</p>
                  </div>

                  <div className="vetting-info-item">
                    <label>Học phí/giờ</label>
                    <p className="vetting-price">{profile.hourlyrate.toLocaleString('vi-VN')} VND</p>
                  </div>

                  <div className="vetting-info-item">
                    <label>Kinh nghiệm</label>
                    <p>{profile.experience} năm</p>
                  </div>

                  <div className="vetting-info-item">
                    <label>Học vấn</label>
                    <p>{profile.education || 'N/A'}</p>
                  </div>

                  <div className="vetting-info-item">
                    <label>GPA</label>
                    <p>{profile.gpa || 'N/A'}</p>
                  </div>

                  <div className="vetting-info-item">
                    <label>Khu vực dạy</label>
                    <p>{profile.teachingareacity || 'N/A'} - {profile.teachingareadistrict || 'N/A'}</p>
                  </div>

                  <div className="vetting-info-item">
                    <label>Hình thức dạy</label>
                    <p>{profile.teachingmode || 'N/A'}</p>
                  </div>
                </div>

                {/* Video intro */}
                {profile.videointrourl && (
                  <div className="vetting-video-section">
                    <label>Video giới thiệu</label>
                    <video
                      controls
                      className="vetting-video-player"
                      src={profile.videointrourl}
                    >
                      Trình duyệt không hỗ trợ video
                    </video>
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Subjects */}
            {activeTab === 'subjects' && (
              <div className="vetting-tab-content">
                <h3 className="vetting-section-title">Môn học giảng dạy</h3>

                {subjects.length > 0 ? (
                  <div className="vetting-subjects-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Môn học</th>
                          <th>Cấp lớp</th>
                          <th>Chuyên môn</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjects.map((subject) => (
                          <tr key={subject.subjectid}>
                            <td>{subject.subjectname}</td>
                            <td>{subject.gradelevels}</td>
                            <td>{subject.specialization || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="vetting-empty-message">Chưa có môn học nào</p>
                )}
              </div>
            )}

            {/* Tab 5: Availability */}
            {activeTab === 'availability' && (
              <div className="vetting-tab-content">
                <h3 className="vetting-section-title">Lịch rảnh</h3>

                {availability.length > 0 ? (
                  <div className="vetting-availability-list">
                    {availability.map((slot) => (
                      <div key={slot.availabilityid} className="vetting-availability-item">
                        <div className="vetting-availability-day">
                          <span className="material-symbols-outlined">event</span>
                          <strong>{formatDayOfWeek(slot.dayofweek)}</strong>
                        </div>
                        <div className="vetting-availability-time">
                          <span className="material-symbols-outlined">schedule</span>
                          <span>{slot.starttime} - {slot.endtime}</span>
                        </div>
                        <div className={`vetting-availability-status ${slot.isavailable ? 'available' : 'unavailable'}`}>
                          {slot.isavailable ? 'Có thể dạy' : 'Không có thể'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="vetting-empty-message">Chưa có lịch rảnh nào</p>
                )}
              </div>
            )}

            {/* Tab 6: Credentials */}
            {activeTab === 'credentials' && (
              <div className="vetting-tab-content">
                <h3 className="vetting-section-title">Bằng cấp / Chứng chỉ</h3>

                {/* TODO: Parse certificateurl JSONB and display */}
                <div className="vetting-info-box">
                  <p className="vetting-info-note">
                    Hiển thị danh sách bằng cấp từ JSONB certificateurl
                  </p>
                  {profile.certificateurl && (
                    <pre className="vetting-credentials-data">
                      {JSON.stringify(profile.certificateurl, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="vetting-modal-footer">
            <button
              className="vetting-btn vetting-btn-secondary"
              onClick={onClose}
            >
              Đóng
            </button>
            <button
              className="vetting-btn vetting-btn-danger"
              onClick={handleRejectClick}
              disabled={isRejecting || isApproving}
            >
              {isRejecting ? 'Đang xử lý...' : 'Từ chối hồ sơ'}
            </button>
            <button
              className="vetting-btn vetting-btn-primary"
              onClick={handleApprove}
              disabled={isRejecting || isApproving}
            >
              {isApproving ? 'Đang xử lý...' : '✓ Phê duyệt & Công khai'}
            </button>
          </div>
        </div>
      </div>

      {/* Rejection Modal - TODO: Create separate component */}
      {showRejectionModal && (
        <RejectionModalPlaceholder
          isOpen={showRejectionModal}
          onClose={() => setShowRejectionModal(false)}
          onSubmit={handleRejectSubmit}
          isSubmitting={isRejecting}
        />
      )}
    </>
  );
};

// Temporary Rejection Modal Placeholder
const RejectionModalPlaceholder: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
  isSubmitting: boolean;
}> = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [rejectionNote, setRejectionNote] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (rejectionNote.trim().length < 20) {
      setError('Lý do từ chối phải có ít nhất 20 ký tự');
      return;
    }
    onSubmit(rejectionNote);
  };

  if (!isOpen) return null;

  return (
    <div className="vetting-modal-overlay" onClick={onClose}>
      <div className="vetting-rejection-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Từ chối hồ sơ</h3>
        <p>Vui lòng nhập lý do từ chối hồ sơ gia sư này:</p>

        <textarea
          className="vetting-rejection-textarea"
          value={rejectionNote}
          onChange={(e) => {
            setRejectionNote(e.target.value);
            setError('');
          }}
          placeholder="Nhập lý do từ chối (tối thiểu 20 ký tự)..."
          rows={5}
        />

        {error && <p className="vetting-error-message">{error}</p>}

        <div className="vetting-rejection-footer">
          <button className="vetting-btn vetting-btn-secondary" onClick={onClose}>
            Hủy
          </button>
          <button
            className="vetting-btn vetting-btn-danger"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận từ chối'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorDetailModal;
