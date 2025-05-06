import { useEffect, useState, useCallback } from "react";
import { StudentStatus } from "./models/student_status";
import Header from "../header/header";
import './student_statuses.css';
import StudentStatusItem from "./student_statusItem/student_statusItem";
import DetailDialog from "./detailDialog/detailDialog";
import AddIcon from '@mui/icons-material/Add';
import { Card, Button, Table, Pagination } from 'react-bootstrap';
import ConfirmationDialog from '../../common/ConfirmationDialog';
import { useNotification } from '../../common/NotificationContext';
import { StudentStatusesRoute } from "./route/student_statuses.route";

const StudentStatuses = () => {
  const [studentStatuses, setStudentStatuses] = useState<StudentStatus[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [type, setType] = useState('');
  const [chosenStatus, setChosenStatus] = useState<StudentStatus>(studentStatuses[0]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  const fetchStudentStatuses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await StudentStatusesRoute.getStudentStatuses({ page: currentPage, limit: 10 }, { searchString: search });
      setStudentStatuses(response.data);
      setTotalPages(response.meta.total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching student statuses:', error);
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    fetchStudentStatuses();
  }, [fetchStudentStatuses]);

  useEffect(() => {
    setChosenStatus(studentStatuses[0]);
  }, [studentStatuses]);

  function DetailHandler(type: string) {
    const detailDialog = document.querySelector('.dialog-container') as HTMLElement;
    setType(type);
    detailDialog.classList.toggle('hidden');
  }

  async function DeleteHandler() {
    try {
      await StudentStatusesRoute.deleteStudentStatus(chosenStatus._id.toString());
      showNotification('success', `Student status "${chosenStatus.tinh_trang}" deleted successfully`);
      setShowConfirmation(false);
      fetchStudentStatuses();
    } catch (error) {
      showNotification('error', 'Error occurred while deleting student status');
      console.error('Error deleting student status:', error);
    }
  }

  if(studentStatuses.length === 0 || chosenStatus === undefined) {
    return (
      <div className="domain-container">
        <Header searchHandler={setSearch} />
        <Card>
          <Card.Header>
            <h2>Danh sách trạng thái sinh viên</h2>
          </Card.Header>
          <Card.Body>
            <div className="text-center">Không tìm thấy trạng thái nào</div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="domain-container">
      <ConfirmationDialog
        isOpen={showConfirmation}
        title="Delete Confirmation"
        message={`Are you sure you want to delete the student status "${chosenStatus.tinh_trang}"?`}
        onConfirm={DeleteHandler}
        onCancel={() => setShowConfirmation(false)}
      />
      <DetailDialog 
        type={type} 
        studentStatus={chosenStatus ?? studentStatuses[0]} 
        onSuccess={fetchStudentStatuses}
      />
      <Header searchHandler={setSearch} />
      
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Danh sách trạng thái sinh viên</h2>
            <Button variant="success" onClick={() => DetailHandler('add')}>
              <AddIcon /> Thêm trạng thái mới
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Tên trạng thái</th>
                  <th>Ngày thêm</th>
                  <th>Ngày cập nhật</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center">Đang tải...</td>
                  </tr>
                ) : studentStatuses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">Không tìm thấy trạng thái nào</td>
                  </tr>
                ) : (
                  studentStatuses.map((status) => (
                    <StudentStatusItem 
                      key={status._id.toString()} 
                      studentStatus={status} 
                      setChosenStudentStatus={setChosenStatus} 
                      DetailHandler={DetailHandler}
                      setShowConfirmation={setShowConfirmation}
                    />
                  ))
                )}
              </tbody>
            </Table>
          </div>

          <div className="d-flex justify-content-center mt-3">
            <Pagination>
              <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
              <Pagination.Prev 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                disabled={currentPage === 1}
              />
              
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item 
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              
              <Pagination.Next 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                disabled={currentPage === totalPages}
              />
              <Pagination.Last 
                onClick={() => setCurrentPage(totalPages)} 
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default StudentStatuses;