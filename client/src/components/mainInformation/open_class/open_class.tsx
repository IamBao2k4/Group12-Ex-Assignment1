import React, { useState, useEffect } from 'react';
import { OpenClass, PaginationOptions, SearchOptions, ToCreateOpenClassDto } from './models/open_class.model';
import { OpenClassRoute } from './route/openClass.route';
import { Button, Form, Table, Modal, Pagination, Row, Col, Card } from 'react-bootstrap';
import '../../../components/common/DomainStyles.css';
import AddIcon from '@mui/icons-material/Add';
import { SERVER_URL } from '../../../../global';
import { useTranslation } from 'react-i18next';
import { Course } from '../courses/models/course';
import axios from 'axios';

const OpenClassComponent: React.FC = () => {
  const { t, i18n } = useTranslation();
  // State for classes and courses
  const [openClasses, setOpenClasses] = useState<OpenClass[]>([]);
  const [courses, setCourses] = useState<Course[]>([]); // Store fetched courses
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
      ten: {
        en: '',
        vi: ''
      }
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
      setError(t('openClass.fetchError'));
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
      setError(t('course.fetchError'));
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
    const selectedCourse = courses.find(course => course._id.toString() === selectedCourseId);
    setNewClass(prevState => ({
      ...prevState,
      ma_mon_hoc: selectedCourse ? {
        _id: selectedCourse._id.toString(),
        ma_mon_hoc: selectedCourse.ma_mon_hoc,
        ten: {en: selectedCourse.ten.en, vi: selectedCourse.ten.vi}
      } : { _id: '', ma_mon_hoc: '', ten: {en:'', vi:''} }
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
            ten: {
              en: '',
              vi: ''
            }
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
      setError(t('class.createError', 'Failed to create new class'));
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) {
      console.error('Invalid class ID');
      return;
    }

    const classToDelete = openClasses.find(c => c._id === id);
    if (!classToDelete) {
      console.error('Class not found');
      return;
    }

    if (window.confirm(t('openClass.deleteConfirmMessage', { name: classToDelete.ten }))) {
      try {
        await axios.delete(`${SERVER_URL}/api/v1/open-classes/${id}`);
        fetchOpenClasses();
      } catch (error) {
        console.error('Error deleting open class:', error);
      }
    }
  };

  return (
    <div className="domain-container">
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h2>{t('openClass.title')}</h2>
            <Button variant="success" onClick={() => setShowAddModal(true)}>
              <AddIcon /> {t('openClass.add')}
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {/* Filter Controls */}
          <Row className="mb-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>{t('transcript.year')}:</Form.Label>
                <Form.Select 
                  name="nam_hoc"
                  value={searchOptions.nam_hoc || ''}
                  onChange={handleFilterChange}
                >
                  <option value="">{t('common.all')}</option>
                  {[2021, 2022, 2023, 2024, 2025].map(year => (
                    <option key={year} value={year}>{year}-{year+1}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>{t('transcript.semester')}:</Form.Label>
                <Form.Select 
                  name="hoc_ky"
                  value={searchOptions.hoc_ky || ''}
                  onChange={handleFilterChange}
                >
                  <option value="">{t('common.all')}</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>{t('common.search')}:</Form.Label>
                <Form.Control
                  type="text"
                  name="keyword"
                  value={searchOptions.keyword || ''}
                  onChange={handleFilterChange}
                  placeholder={t('common.searchPlaceholder')}
                />
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Button variant="primary" onClick={() => fetchOpenClasses()}>
                {t('common.view')}
              </Button>
            </Col>
          </Row>

          {/* Classes Table */}
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>{t('openClass.classCode')}</th>
                  <th>{t('openClass.courseCode')}</th>
                  <th>{t('openClass.courseName')}</th>
                  <th>{t('openClass.instructor')}</th>
                  <th>{t('openClass.capacity')}</th>
                  <th>{t('openClass.schedule')}</th>
                  <th>{t('openClass.location')}</th>
                  <th>{t('common.action')}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center">{t('common.loading')}</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={9} className="text-center text-danger">{error}</td>
                  </tr>
                ) : openClasses.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center">{t('openClass.notFound')}</td>
                  </tr>
                ) : (
                  openClasses.map((openClass) => (
                    <tr key={openClass._id}>
                      <td>{openClass.ma_lop}</td>
                      <td>{openClass.ma_mon_hoc.ma_mon_hoc}</td>
                      <td>{i18n.language === "en" ? openClass.ma_mon_hoc?.ten.en : openClass.ma_mon_hoc?.ten.vi}</td>
                      <td>{openClass.giang_vien}</td>
                      <td>{openClass.so_luong_toi_da}</td>
                      <td>{openClass.lich_hoc}</td>
                      <td>{openClass.phong_hoc}</td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setNewClass(openClass);
                            setShowAddModal(true);
                          }}
                        >
                          {t('common.edit')}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(openClass._id)}
                          disabled={!openClass._id}
                        >
                          {t('common.delete')}
                        </Button>
                      </td>
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
          <Modal.Title>
            {newClass._id ? t('common.edit') : t('common.add')} {t('openClass.title')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>{t('openClass.classCode')}</Form.Label>
              <Form.Control
                type="text"
                name="ma_lop"
                value={newClass.ma_lop}
                onChange={handleNewClassChange}
                placeholder={t('openClass.classCodePlaceholder')}
                required
              />
            </Form.Group>

            {/* <Form.Group className="mb-3">
              <Form.Label>{t('openClass.className')}</Form.Label>
              <Form.Control
                type="text"
                name="ten"
                value={newClass.ten}
                onChange={handleNewClassChange}
                placeholder={t('openClass.classNamePlaceholder')}
                required
              />
            </Form.Group> */}

            <Form.Group className="mb-3">
              <Form.Label>{t('openClass.courseCode')}</Form.Label>
              <Form.Select
                name="ma_mon_hoc"
                value={newClass.ma_mon_hoc._id}
                onChange={handleCourseChange}
                required
              >
                <option value="">{t('course.selectCourse')}</option>
                {courses.map(course => (
                  <option key={course._id.toString()} value={course._id.toString()}>{course.ma_mon_hoc}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t('openClass.courseName')}</Form.Label>
              <Form.Control
                type="text"
                name="ma_mon_hoc"
                value={i18n.language === "en" ? newClass.ma_mon_hoc.ten.en : newClass.ma_mon_hoc.ten.vi}
                onChange={handleNewClassChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t('openClass.instructor')}</Form.Label>
              <Form.Control
                type="text"
                name="giang_vien"
                value={newClass.giang_vien}
                onChange={handleNewClassChange}
                placeholder={t('openClass.instructorPlaceholder')}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t('openClass.capacity')}</Form.Label>
              <Form.Control
                type="number"
                name="so_luong_toi_da"
                value={newClass.so_luong_toi_da}
                onChange={handleNewClassChange}
                min="1"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t('openClass.schedule')}</Form.Label>
              <Form.Control
                type="text"
                name="lich_hoc"
                value={newClass.lich_hoc}
                onChange={handleNewClassChange}
                placeholder={t('openClass.schedulePlaceholder')}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t('openClass.location')}</Form.Label>
              <Form.Control
                type="text"
                name="phong_hoc"
                value={newClass.phong_hoc}
                onChange={handleNewClassChange}
                placeholder={t('openClass.locationPlaceholder')}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {t('common.save')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default OpenClassComponent;
