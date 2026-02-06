import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import type { StudentType } from '../../types/student.type';
import { getStudents } from '../../services/student.service';
import { Plus, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';

// Add Student Modal
const AddStudentModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    school: '',
    gradeLevel: '',
    learningGoals: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';
    if (!formData.school.trim()) newErrors.school = 'School is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Submit student data:', formData);
    // TODO: Call API to add student

    // Reset form and close modal
    setFormData({
      fullName: '',
      birthDate: '',
      school: '',
      gradeLevel: '',
      learningGoals: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Add New Student</h2>
          <button className={styles.modalCloseBtn} onClick={onClose} type="button">
            <Trash2 size={20} />
          </button>
        </div>

        <form className={styles.addStudentForm} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>
              Full Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`${styles.formInput} ${errors.fullName ? styles.formInputError : ''}`}
              placeholder="Enter student's full name"
            />
            {errors.fullName && <span className={styles.errorMessage}>{errors.fullName}</span>}
          </div>

          <div className={styles.formRow}>
            <label className={styles.formLabel}>
              Birth Date <span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className={`${styles.formInput} ${errors.birthDate ? styles.formInputError : ''}`}
            />
            {errors.birthDate && <span className={styles.errorMessage}>{errors.birthDate}</span>}
          </div>

          <div className={styles.formRow}>
            <label className={styles.formLabel}>
              School <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              className={`${styles.formInput} ${errors.school ? styles.formInputError : ''}`}
              placeholder="Enter school name"
            />
            {errors.school && <span className={styles.errorMessage}>{errors.school}</span>}
          </div>

          <div className={styles.formRow}>
            <label className={styles.formLabel}>Grade Level</label>
            <select name="gradeLevel" value={formData.gradeLevel} onChange={handleChange} className={styles.formInput}>
              <option value="">Select grade level</option>
              <option value="Grade 1">Grade 1</option>
              <option value="Grade 2">Grade 2</option>
              <option value="Grade 3">Grade 3</option>
              <option value="Grade 4">Grade 4</option>
              <option value="Grade 5">Grade 5</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>
          </div>

          <div className={styles.formRow}>
            <label className={styles.formLabel}>Learning Goals</label>
            <textarea
              name="learningGoals"
              value={formData.learningGoals}
              onChange={handleChange}
              className={styles.formTextarea}
              placeholder="Enter learning goals..."
              rows={3}
            />
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.modalBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.modalBtnPrimary}>
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  studentName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentName: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.deleteModalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.deleteModalIcon}>
          <Trash2 size={48} />
        </div>
        <h3 className={styles.deleteModalTitle}>Delete Student</h3>
        <p className={styles.deleteModalText}>
          Are you sure you want to delete <strong>{studentName}</strong>? This action cannot be undone.
        </p>
        <div className={styles.deleteModalActions}>
          <button type="button" className={styles.modalBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.modalBtnDanger} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ParentStudent = () => {
  const [students, setStudents] = useState<StudentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteStudent, setDeleteStudent] = useState<StudentType | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await getStudents();
        if (response.statusCode === 200) {
          setStudents(response.content);
        }
      } catch (err) {
        console.error('Error fetching students:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleViewDetails = (student: StudentType) => {
    console.log('View details:', student);
    // TODO: Navigate to student detail page
  };

  const handleDeleteClick = (student: StudentType) => {
    setDeleteStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteStudent(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteStudent) {
      console.log('Delete student:', deleteStudent);
      // TODO: Call API to delete student
      // Remove from local state temporarily
      setStudents((prev) => prev.filter((s) => s.studentId !== deleteStudent.studentId));
    }
    handleDeleteClose();
  };

  const formatBirthDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Student Management</h1>
          <p className={styles.subtitle}>Manage your linked students</p>
        </div>
        <button className={styles.addBtn} onClick={handleAddClick} type="button">
          <Plus size={20} />
          <span>Add Student</span>
        </button>
      </header>

      {/* Loading State */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Loading students...</p>
        </div>
      ) : (
        <main className={styles.mainContent}>
          {students.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Plus size={64} />
              </div>
              <h3 className={styles.emptyTitle}>No Students Yet</h3>
              <p className={styles.emptyText}>
                Get started by adding your first student to begin tracking their learning journey.
              </p>
              <button className={styles.emptyBtn} onClick={handleAddClick} type="button">
                <Plus size={20} />
                <span>Add Your First Student</span>
              </button>
            </div>
          ) : (
            <table className={styles.studentsTable}>
              <thead>
                <tr>
                  <th className={styles.tableHeader}>Student</th>
                  <th className={styles.tableHeader}>Age</th>
                  <th className={styles.tableHeader}>Grade</th>
                  <th className={styles.tableHeader}>School</th>
                  <th className={styles.tableHeaderActions}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.studentId} className={styles.tableRow}>
                    <td className={styles.studentCell}>
                      <div className={styles.studentInfo}>
                        <div className={styles.studentAvatar}>
                          <img
                            src={student.avatarURL || 'https://via.placeholder.com/48'}
                            alt={student.fullName}
                            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/48')}
                          />
                        </div>
                        <div className={styles.studentDetails}>
                          <div className={styles.studentName}>{student.fullName}</div>
                          <div className={styles.studentMeta}>
                            <span className={styles.studentAge}>Age: {student.age}</span>
                            <span className={styles.studentBirthdate}>Born: {formatBirthDate(student.birthDate)}</span>
                          </div>
                          <div className={styles.studentExtra}>
                            <span className={styles.studentSchool}>{student.school}</span>
                            <span className={styles.studentGrade}>{student.gradeLevel}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.ageCell}>
                      <span className={styles.ageValue}>{student.age} years old</span>
                    </td>
                    <td className={styles.gradeCell}>
                      <span className={styles.gradeBadge}>{student.gradeLevel}</span>
                    </td>
                    <td className={styles.schoolCell}>
                      <span className={styles.schoolValue}>{student.school}</span>
                    </td>
                    <td className={styles.actionsCell}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleViewDetails(student)}
                        type="button"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className={styles.actionBtnDelete}
                        onClick={() => handleDeleteClick(student)}
                        type="button"
                        title="Delete Student"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      )}

      {/* Add Student Modal */}
      <AddStudentModal isOpen={isAddModalOpen} onClose={handleAddModalClose} />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        studentName={deleteStudent?.fullName || 'this student'}
      />
    </div>
  );
};

export default ParentStudent;
