import { useEffect, useState, useCallback } from "react";
import { Program } from "./models/program";
import Header from "../header/header";
import ProgramItem from "./programItem/programItem";
import DetailDialog from "./detailDialog/detailDialog";
import AddIcon from '@mui/icons-material/Add';
import { Card, Button, Table, Pagination } from 'react-bootstrap';
import ConfirmationDialog from '../../common/ConfirmationDialog';
import { useNotification } from '../../common/NotificationContext';
import { ProgramsRoute } from "./route/programs.route";

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [type, setType] = useState('');
  const [chosenProgram, setChosenProgram] = useState<Program>(programs[0]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ProgramsRoute.getPrograms({ page: currentPage, limit: 10 }, { searchString: search });
      setPrograms(response.data);
      setTotalPages(response.meta.total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  useEffect(() => {
    setChosenProgram(programs[0]);
  }, [programs]);

  function DetailHandler(type: string) {
    const detailDialog = document.querySelector('.dialog-container') as HTMLElement;
    setType(type);
    detailDialog.classList.toggle('hidden');
  }

  async function DeleteHandler() {
    try {
      await ProgramsRoute.deleteProgram(chosenProgram._id.toString());
      showNotification('success', `Program "${chosenProgram.name}" deleted successfully`);
      setShowConfirmation(false);
      fetchPrograms();
    } catch (error) {
      showNotification('error', 'Error occurred while deleting program');
      console.error('Error deleting program:', error);
    }
  }

  if (programs.length === 0 || chosenProgram === undefined) {
    return (
      <div className="domain-container">
        <Header searchHandler={setSearch} />
        <Card>
          <Card.Header>
            <h2>Danh sách chương trình</h2>
          </Card.Header>
          <Card.Body>
            <div className="text-center">Không tìm thấy chương trình nào</div>
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
        message={`Are you sure you want to delete the program "${chosenProgram.name}"?`}
        onConfirm={DeleteHandler}
        onCancel={() => setShowConfirmation(false)}
      />
      <DetailDialog 
        type={type} 
        program={chosenProgram ?? programs[0]} 
        onSuccess={fetchPrograms}
      />
      <Header searchHandler={setSearch} />
      
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Danh sách chương trình</h2>
            <Button variant="success" onClick={() => DetailHandler('add')}>
              <AddIcon /> Thêm chương trình mới
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Tên chương trình</th>
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
                ) : programs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">Không tìm thấy chương trình nào</td>
                  </tr>
                ) : (
                  programs.map((program) => (
                    <ProgramItem 
                      key={program._id.toString()} 
                      program={program} 
                      setChosenProgram={setChosenProgram} 
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

export default Programs;