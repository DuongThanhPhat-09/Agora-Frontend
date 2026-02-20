import React, { useState } from 'react';
import { Form, Input, Checkbox, Button, message as antMessage } from 'antd';
import { submitLessonReport, type SubmitReportRequest } from '../../../services/lesson.service';

const { TextArea } = Input;

interface LessonReportFormProps {
  lessonId: number;
  onSubmitSuccess: () => void;
  onCancel?: () => void;
}

const LessonReportForm: React.FC<LessonReportFormProps> = ({
  lessonId,
  onSubmitSuccess,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      const request: SubmitReportRequest = {
        lessonContent: values.lessonContent,
        homework: values.homework || '',
        tutorNotes: values.tutorNotes || '',
        isStudentPresent: values.isStudentPresent ?? true,
        attendanceNote: values.attendanceNote || '',
      };
      await submitLessonReport(lessonId, request);
      antMessage.success('Nộp báo cáo buổi học thành công!');
      onSubmitSuccess();
    } catch (error: any) {
      antMessage.error(error.response?.data?.message || 'Không thể nộp báo cáo. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid rgba(26,34,56,0.1)' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600, color: '#1a2238' }}>
        Báo cáo buổi học
      </h3>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ isStudentPresent: true }}
      >
        <Form.Item
          name="lessonContent"
          label="Nội dung đã dạy"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung đã dạy' }]}
        >
          <TextArea rows={4} placeholder="Mô tả nội dung buổi học..." />
        </Form.Item>

        <Form.Item name="homework" label="Bài tập về nhà">
          <TextArea rows={3} placeholder="Bài tập giao cho học sinh (nếu có)..." />
        </Form.Item>

        <Form.Item name="tutorNotes" label="Ghi chú">
          <TextArea rows={2} placeholder="Ghi chú thêm về buổi học..." />
        </Form.Item>

        <Form.Item name="isStudentPresent" valuePropName="checked">
          <Checkbox>Học sinh có mặt</Checkbox>
        </Form.Item>

        <Form.Item name="attendanceNote" label="Ghi chú điểm danh">
          <Input placeholder="Ghi chú về việc tham gia của học sinh..." />
        </Form.Item>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button onClick={onCancel}>Hủy</Button>
          )}
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            style={{ background: '#3e2f28', borderColor: '#3e2f28' }}
          >
            Nộp báo cáo
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LessonReportForm;
