import React, { useState, useEffect } from 'react';
import { OpenClass, PaginationOptions, SearchOptions, ToCreateOpenClassDto } from './models/open_class.model';
import { OpenClassRoute } from './route/openClass.route';
import { Button, Form, Table, Modal, Pagination, Row, Col, Card } from 'react-bootstrap';
import './open_class.css';

const OpenClassComponent: React.FC = () => {
  // State for classes and courses
  const [openClasses, setOpenClasses] = useState<OpenClass[]>([]);
  const [courses, setCourses] = useState<any[]>([]); // Store fetched courses
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: 1,
    limit: 10
  });
  const [totalPages, setTotalPages] = useState<number>(1);
  
  // Search/Filter state
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    nam_hoc: undefined,
    hoc_ky: undefined,
    keyword: ''
  });
  
  // New class form state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newClass, setNewClass] = useState<OpenClass>({
    ma_lop: '',
    ma_mon_hoc: {
      _id: '',
      ma_mon_hoc: '',
      ten: ''
    },
    ten: '', 
    si_so: 0,
    nam_hoc: new Date().getFullYear(),
    hoc_ky: 1,
    giang_vien: '',
    so_luong_toi_da: 35,
    lich_hoc: '',
    phong_hoc: ''
  });

  // Load classes and courses on component mount and when filter/pagination changes
  useEffect(() => {
    fetchOpenClasses();
    fetchCourses(); // Fetch courses as well
  }, [pagination.page, pagination.limit, searchOptions]);

  const fetchOpenClasses = async () => {
    setLoading(true);
    try {
      const response = await OpenClassRoute.getOpenClasses(pagination, searchOptions);
      setOpenClasses(response.data);
      setTotalPages(response.meta.totalPages);
      setError(null); // Clear any existing error
      setLoading(false);
    } catch (err) {
      console.error('Error fetching open classes:', err);
      setError('Không thể tải danh sách lớp mở. Vui lòng thử lại sau.');
      setOpenClasses([]);
      setLoading(false);
    }
  };

  // Fetch courses from the OpenClassService
  const fetchCourses = async () => {
    try {
      const response = await OpenClassRoute.getAllCourseAvailable();
      setCourses(response);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses');
    }
  };

  // Handle filter/search changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSearchOptions({
      ...searchOptions,
      [name]: value === '' ? undefined : name === 'keyword' ? value : Number(value)
    });
    // Reset to first page when filters change
    setPagination({ ...pagination, page: 1 });
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  // Handle new class form changes
  const handleNewClassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClass({
      ...newClass,
      [name]: ['nam_hoc', 'hoc_ky', 'si_so', 'so_luong_toi_da'].includes(name) ? Number(value) : value
    });
  };

  // Handle course selection change
  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCourseId = e.target.value;
    const selectedCourse = courses.find(course => course._id === selectedCourseId);
    setNewClass(prevState => ({
      ...prevState,
      ma_mon_hoc: selectedCourse || { _id: '', ma_mon_hoc: '', ten: '' }
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await OpenClassRoute.createOpenClass(ToCreateOpenClassDto(newClass));
      setShowAddModal(false);
      // Reset form
      setNewClass({
        ma_lop: '',
        ma_mon_hoc: 
          {
            _id: '',
            ma_mon_hoc: '',
            ten: ''
          },
        ten: '',
        si_so: 0,
        nam_hoc: new Date().getFullYear(),
        hoc_ky: 1,
        giang_vien: '',
        so_luong_toi_da: 35,
        lich_hoc: '',
        phong_hoc: ''
      });
      // Refresh data
      fetchOpenClasses();
    } catch (err) {
      setError('Failed to create new class');
    }
  };

  return (
    <div className="open-class-container mt-4">
      <Card>
        <Card.Header className="bg-primary text-white">
          <h2>Danh sách lớp mở trong {searchOptions.nam_hoc || 'tất cả năm học'} / HK{searchOptions.hoc_ky || 'tất cả'}</h2>
        </Card.Header>
        <Card.Body>
          {/* Filter Controls */}
          <Row className="mb-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Năm Học:</Form.Label>
                <Form.Select 
                  name="nam_hoc"
                  value={searchOptions.nam_hoc || ''}
                  onChange={handleFilterChange}
                >
                  <option value="">Tất cả</option>
                  {[2021, 2022, 2023, 2024, 2025].map(year => (
                    <option key={year} value={year}>{year}-{year+1}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Học Kỳ:</Form.Label>
                <Form.Select 
                  name="hoc_ky"
                  value={searchOptions.hoc_ky || ''}
                  onChange={handleFilterChange}
                >
                  <option value="">Tất cả</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Tìm kiếm:</Form.Label>
                <Form.Control
                  type="text"
                  name="keyword"
                  value={searchOptions.keyword || ''}
                  onChange={handleFilterChange}
                  placeholder="Nhập từ khóa..."
                />
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Button variant="primary" onClick={() => fetchOpenClasses()}>
                Xem
              </Button>
              <Button variant="success" className="ms-2" onClick={() => setShowAddModal(true)}>
                Thêm lớp mới
              </Button>
            </Col>
          </Row>

          {/* Classes Table */}
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Mã MH</th>
                  <th>Tên Môn Học</th>
                  <th>Lớp</th>
                  <th>Số TC</th>
                  <th>Sĩ Số</th>
                  <th>Đã ĐK</th>
                  <th>Khóa</th>
                  <th>Lịch Học</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center">Loading...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="text-center text-danger">{error}</td>
                  </tr>
                ) : openClasses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center">Không tìm thấy lớp học nào</td>
                  </tr>
                ) : (
                  openClasses.map((openClass) => (
                    <tr key={openClass._id}>
                      <td>{openClass.ma_mon_hoc.ma_mon_hoc}</td>
                      <td>{openClass.ma_mon_hoc.ten}</td>
                      <td>{openClass.ma_lop}</td>
                      <td>3</td>
                      <td>{openClass.so_luong_toi_da}</td>
                      <td>{openClass.si_so}</td>
                      <td>{openClass.nam_hoc}</td>
                      <td>{openClass.lich_hoc}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center">
            <Pagination>
              <Pagination.First 
                onClick={() => handlePageChange(1)} 
                disabled={pagination.page === 1}
              />
              <Pagination.Prev 
                onClick={() => handlePageChange(Math.max(1, pagination.page! - 1))} 
                disabled={pagination.page === 1}
              />
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item 
                  key={i + 1} 
                  active={i + 1 === pagination.page}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next 
                onClick={() => handlePageChange(Math.min(totalPages, pagination.page! + 1))} 
                disabled={pagination.page === totalPages}
              />
              <Pagination.Last 
                onClick={() => handlePageChange(totalPages)} 
                disabled={pagination.page === totalPages}
              />
            </Pagination>
          </div>
        </Card.Body>
      </Card>

      {/* Add New Class Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm Lớp Mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Mã Lớp</Form.Label>
              <Form.Control
                type="text"
                name="ma_lop"
                value={newClass.ma_lop}
                onChange={handleNewClassChange}
                placeholder="Ví dụ: 24_001"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mã Môn Học</Form.Label>
              <Form.Select
                name="ma_mon_hoc"
                value={newClass.ma_mon_hoc._id}
                onChange={handleCourseChange}
                required
              >
                <option value="">Chọn Môn Học</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>{course.ten}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Năm Học</Form.Label>
                  <Form.Control
                    type="number"
                    name="nam_hoc"
                    value={newClass.nam_hoc}
                    onChange={handleNewClassChange}
                    min="2020"
                    max="2030"
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Học Kỳ</Form.Label>
                  <Form.Control
                    type="number"
                    name="hoc_ky"
                    value={newClass.hoc_ky}
                    onChange={handleNewClassChange}
                    min="1"
                    max="3"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Giảng Viên</Form.Label>
              <Form.Control
                type="text"
                name="giang_vien"
                value={newClass.giang_vien}
                onChange={handleNewClassChange}
                placeholder="Tên giảng viên"
                required
              />
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Sĩ Số Hiện Tại</Form.Label>
                  <Form.Control
                    type="number"
                    name="si_so"
                    value={newClass.si_so}
                    onChange={handleNewClassChange}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Sĩ Số Tối Đa</Form.Label>
                  <Form.Control
                    type="number"
                    name="so_luong_toi_da"
                    value={newClass.so_luong_toi_da}
                    onChange={handleNewClassChange}
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Lịch Học</Form.Label>
              <Form.Control
                type="text"
                name="lich_hoc"
                value={newClass.lich_hoc}
                onChange={handleNewClassChange}
                placeholder="Ví dụ: T2(1-4), T5(6-9)"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phòng Học</Form.Label>
              <Form.Control
                type="text"
                name="phong_hoc"
                value={newClass.phong_hoc}
                onChange={handleNewClassChange}
                placeholder="Ví dụ: A102"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Lưu
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default OpenClassComponent;
