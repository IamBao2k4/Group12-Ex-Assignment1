import { useEffect, useState, useCallback } from "react";
import { Faculty } from "./models/faculty";
import Header from "../header/header";
import './faculties.css';
import FacultyItem from "./facultyItem/facultyItem";
import DetailDialog from "./detailDialog/detailDialog";
import AddIcon from '@mui/icons-material/Add';
import { Card, Button, Table, Pagination } from 'react-bootstrap';
import ConfirmationDialog from '../../common/ConfirmationDialog';
import { useNotification } from '../../common/NotificationContext';
import { FacultiesRoute } from "./route/faculties.route";

const Faculties = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [type, setType] = useState('');
  const [chosenFaculty, setChosenFaculty] = useState<Faculty>(faculties[0]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  const fetchFaculties = useCallback(async () => {
    setLoading(true);
    try {
      const response = await FacultiesRoute.getFaculties({ page: currentPage, limit: 10 }, { searchString: search });
      setFaculties(response.data);
      setTotalPages(response.meta.total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching faculties:', error);
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    fetchFaculties();
  }, [fetchFaculties]);

  useEffect(() => {
    setChosenFaculty(faculties[0]);
  }, [faculties]);

  function DetailHandler(type: string) {
    const detailDialog = document.querySelector('.dialog-container') as HTMLElement;
    setType(type);
    detailDialog.classList.toggle('hidden');
  }

  async function DeleteHandler() {
    try {
      await FacultiesRoute.deleteFaculty(chosenFaculty._id.toString());
      showNotification('success', `Faculty "${chosenFaculty.ten_khoa}" deleted successfully`);
      setShowConfirmation(false);
      fetchFaculties();
    } catch (error) {
      showNotification('error', 'Error occurred while deleting faculty');
      console.error('Error deleting faculty:', error);
    }
  }

  if (faculties.length === 0 || chosenFaculty === undefined) {
    return (
      <div className="domain-container">
        <Header searchHandler={setSearch} />
        <Card>
          <Card.Header>
            <h2>Danh sách khoa</h2>
          </Card.Header>
          <Card.Body>
            <div className="text-center">Không tìm thấy khoa nào</div>
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
        message={`Are you sure you want to delete the faculty "${chosenFaculty.ten_khoa}"?`}
        onConfirm={DeleteHandler}
        onCancel={() => setShowConfirmation(false)}
      />
      <DetailDialog 
        type={type} 
        faculty={chosenFaculty ?? faculties[0]} 
        onSuccess={fetchFaculties}
      />
      <Header searchHandler={setSearch} />
      
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Danh sách khoa</h2>
            <Button variant="success" onClick={() => DetailHandler('add')}>
              <AddIcon /> Thêm khoa mới
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Mã khoa</th>
                  <th>Tên khoa</th>
                  <th>Ngày thêm</th>
                  <th>Ngày cập nhật</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center">Đang tải...</td>
                  </tr>
                ) : faculties.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center">Không tìm thấy khoa nào</td>
                  </tr>
                ) : (
                  faculties.map((faculty) => (
                    <FacultyItem 
                      key={faculty._id.toString()} 
                      faculty={faculty} 
                      setChosenFaculty={setChosenFaculty} 
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

export default Faculties;