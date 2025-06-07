import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Card, Modal, Form } from 'react-bootstrap';
import '../../../components/common/DomainStyles.css';
import AddIcon from '@mui/icons-material/Add';
import { SERVER_URL } from '../../../../global';
import { useTranslation } from 'react-i18next';
import { Program } from './models/program';

interface ProgramForm {
    _id: string;
    name: string;
    ma: string;
    created_at: string;
    updated_at: string;
}

const Programs: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [programs, setPrograms] = useState<Program[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);
    const [formData, setFormData] = useState<Omit<ProgramForm, '_id' | 'created_at' | 'updated_at'>>({
        name: '',
        ma: ''
    });

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}/api/v1/programs`);
            const programsData = Array.isArray(response.data) ? response.data : response.data.data || [];
            setPrograms(programsData);
        } catch (error) {
            console.error('Error fetching programs:', error);
            setPrograms([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProgram) {
                await axios.put(`${SERVER_URL}/api/v1/programs/${editingProgram._id}`, formData);
            } else {
                await axios.post(`${SERVER_URL}/api/v1/programs`, formData);
            }
            fetchPrograms();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving program:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm(t('program.deleteConfirmMessage', { name: programs.find(p => p._id.toString() === id)?.name }))) {
            try {
                await axios.delete(`${SERVER_URL}/api/v1/programs/${id}`);
                fetchPrograms();
            } catch (error) {
                console.error('Error deleting program:', error);
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProgram(null);
        setFormData({ name: '', ma: '' });
    };

    const handleEdit = (program: Program) => {
        setEditingProgram(program);
        setFormData({
            name: i18n.language === 'en' ? program.name.en : program.name.vi,
            ma: program.ma
        });
        setShowModal(true);
    };

    return (
        <div className="domain-container">
            <Card>
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                        <h2>{t('program.title')}</h2>
                        <Button variant="success" onClick={() => setShowModal(true)}>
                            <AddIcon /> {t('program.add')}
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>{t('program.programName')}</th>
                                    <th>{t('program.programCode')}</th>
                                    <th>{t('common.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!programs || programs.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="text-center">{t('program.notFound')}</td>
                                    </tr>
                                ) : (
                                    programs.map((program) => (
                                        <tr key={program._id.toString()}>
                                            <td>{ i18n.language === "en"? program.name.en : program.name.vi }</td>
                                            <td>{program.ma}</td>
                                            <td>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleEdit(program)}
                                                >
                                                    {t('common.edit')}
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(program._id.toString())}>
                                                    {t('common.delete')}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingProgram ? t('common.edit') : t('common.add')} {t('program.title')}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>{t('program.programName')}</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{t('program.programCode')}</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.ma}
                                onChange={(e) => setFormData({ ...formData, ma: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            {t('common.cancel')}
                        </Button>
                        <Button variant="primary" type="submit">
                            {t('common.save')}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default Programs;