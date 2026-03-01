import React, { useState } from 'react';
import { Modal, Rate, Input, Spin } from 'antd';
import { toast } from 'react-toastify';
import { createFeedback, type CreateFeedbackRequest } from '../../../services/feedback.service';

const { TextArea } = Input;

interface CreateFeedbackModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    lessonId: number;
    bookingId: number;
    tutorId: string;
    tutorName?: string;
    subjectName?: string;
}

const CreateFeedbackModal: React.FC<CreateFeedbackModalProps> = ({
    open, onClose, onSuccess, lessonId, bookingId, tutorId, tutorName, subjectName,
}) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.warn('Vui lòng chọn số sao đánh giá.');
            return;
        }

        try {
            setSubmitting(true);
            const request: CreateFeedbackRequest = {
                lessonId,
                bookingId,
                toUserId: tutorId,
                rating,
                comment: comment.trim() || undefined,
                feedbackType: 'post_lesson',
            };
            await createFeedback(request);
            toast.success('Đã gửi đánh giá thành công!');
            handleReset();
            onSuccess();
        } catch (error) {
            toast.error('Không thể gửi đánh giá. Vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReset = () => {
        setRating(0);
        setComment('');
    };

    const handleCancel = () => {
        handleReset();
        onClose();
    };

    const ratingLabels = ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc'];

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            title={null}
            footer={null}
            width={480}
            centered
            destroyOnClose
        >
            <div style={{ padding: '8px 0' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1a2238', margin: '0 0 4px 0' }}>
                        Đánh giá buổi học
                    </h2>
                    {tutorName && (
                        <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                            Gia sư: <strong>{tutorName}</strong>
                            {subjectName && <> · {subjectName}</>}
                        </p>
                    )}
                </div>

                {/* Rating */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Rate
                        value={rating}
                        onChange={setRating}
                        style={{ fontSize: '32px' }}
                    />
                    {rating > 0 && (
                        <div style={{ marginTop: '4px', fontSize: '13px', color: '#F59E0B', fontWeight: 500 }}>
                            {ratingLabels[rating]}
                        </div>
                    )}
                </div>

                {/* Comment */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1a2238', marginBottom: '6px' }}>
                        Nhận xét (không bắt buộc)
                    </label>
                    <TextArea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn về buổi học..."
                        rows={4}
                        maxLength={500}
                        showCount
                        style={{ borderRadius: '8px' }}
                    />
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={handleCancel}
                        style={{
                            padding: '8px 20px', borderRadius: '8px', border: '1px solid #e8e8e8',
                            background: '#fff', color: '#666', fontSize: '14px', cursor: 'pointer',
                        }}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || rating === 0}
                        style={{
                            padding: '8px 20px', borderRadius: '8px', border: 'none',
                            background: rating === 0 ? '#ccc' : '#4F46E5', color: '#fff',
                            fontSize: '14px', fontWeight: 500,
                            cursor: submitting || rating === 0 ? 'not-allowed' : 'pointer',
                            opacity: submitting ? 0.7 : 1,
                        }}
                    >
                        {submitting ? <Spin size="small" /> : 'Gửi đánh giá'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CreateFeedbackModal;
