import { useState, useEffect } from 'react';
import { Popconfirm, message } from 'antd';
import styles from './styles.module.css';
import type { StudentType } from '../../types/student.type';
import {
  getStudents,
  deleteStudent,
  createParentStudent,
  updateParentStudent,
  type ICreateParentStudent,
} from '../../services/student.service';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { format } from 'date-fns';
import AddStudentModal from './components/AddStudentModal';
import EditStudentModal from './components/EditStudentModal';

const ParentStudent = () => {
  const [students, setStudents] = useState<StudentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentType | null>(null);

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

  const handleAddStudent = async (payload: ICreateParentStudent) => {
    try {
      console.log(payload);

      await createParentStudent(payload);
      message.success('Student added successfully');
      // Refresh students list
      const response = await getStudents();
      if (response.statusCode === 200) {
        setStudents(response.content);
      }
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Error adding student:', err);
      message.error('Failed to add student');
    }
  };

  const handleEditClick = (student: StudentType) => {
    setEditingStudent(student);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditingStudent(null);
    setIsEditModalOpen(false);
  };

  const handleEditSubmit = async (id: string, payload: ICreateParentStudent) => {
    try {
      await updateParentStudent(id, payload);
      message.success('Student updated successfully');
      // Refresh students list
      const response = await getStudents();
      if (response.statusCode === 200) {
        setStudents(response.content);
      }
      handleEditModalClose();
    } catch (err) {
      console.error('Error updating student:', err);
      message.error('Failed to update student');
    }
  };

  const handleDeleteConfirm = async (student: StudentType) => {
    try {
      await deleteStudent(student.studentId);
      message.success('Student deleted successfully');
      // Remove from local state
      setStudents((prev) => prev.filter((s) => s.studentId !== student.studentId));
    } catch (err) {
      console.error('Error deleting student:', err);
      message.error('Failed to delete student');
    }
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
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.ageCell}>
                      {student.age && <span className={styles.ageValue}>{student.age} years old</span>}
                    </td>
                    <td className={styles.gradeCell}>
                      {student.gradeLevel && <span className={styles.gradeBadge}>{student.gradeLevel}</span>}
                    </td>
                    <td className={styles.schoolCell}>
                      <span className={styles.schoolValue}>{student.school}</span>
                    </td>
                    <td className={styles.actionsCell}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleEditClick(student)}
                        type="button"
                        title="Edit Student"
                      >
                        <Edit3 size={16} />
                      </button>
                      <Popconfirm
                        title="Delete Student"
                        description={`Are you sure you want to delete ${student.fullName}? This action cannot be undone.`}
                        onConfirm={() => handleDeleteConfirm(student)}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                      >
                        <button className={styles.actionBtnDelete} type="button" title="Delete Student">
                          <Trash2 size={16} />
                        </button>
                      </Popconfirm>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      )}

      {/* Add Student Modal */}
      <AddStudentModal isOpen={isAddModalOpen} onClose={handleAddModalClose} onSubmit={handleAddStudent} />

      {/* Edit Student Modal */}
      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSubmit={handleEditSubmit}
        student={editingStudent}
      />
    </div>
  );
};

export default ParentStudent;
