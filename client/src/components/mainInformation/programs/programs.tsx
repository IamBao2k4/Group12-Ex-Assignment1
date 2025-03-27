import { useEffect, useState } from "react";

import { Program } from "./models/program";
import Header from "../header/header";
import './programs.css';

import ProgramItem from "./programItem/programItem";
import DetailDialog from "./detailDialog/detailDialog";
import AddIcon from '@mui/icons-material/Add';

import { SERVER_URL } from '../../../../global';

const Programs = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [type, setType] = useState('');
    const [chosenProgram, setChosenProgram] = useState<Program | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function fetchPrograms() {
            try {
                const response = await fetch(SERVER_URL + `/api/v1/programs?page=${currentPage}&searchString=${search}`,);
                const data = await response.json();
                setPrograms(data.data);
                setTotalPages(data.meta.total);
            } catch (error) {
                console.error('Error fetching programs:', error);
            }
        }

        fetchPrograms();
    }, [search, currentPage]);

    function DetailHandler(type: string) {
        const detailDialog = document.querySelector('.dialog-container') as HTMLElement;
        setType(type);
        detailDialog.classList.toggle('hidden');
    }

    function handlePreviousPage() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    function handleNextPage() {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    return (
        <div className="programs">
            <DetailDialog type={type} program={chosenProgram ?? programs[0]} />
            <Header searchHandler={setSearch} />
            <div className="programs-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <h1>Programs</h1>
                    <button className="add-program" onClick={() => DetailHandler('add')}><AddIcon /></button>
                </div>

                <div className="programs-list">
                    <div className="programs-list-header row">
                        <div className="programs-list-header-id">Tên chương trình</div>
                        <div className="programs-list-header-birthday">Ngày thêm</div>
                        <div className="programs-list-header-status">Ngày chỉnh sửa</div>
                        <div className="programs-list-header-action"></div>
                    </div>
                    {programs.map((program) => (
                        <ProgramItem key={program._id.toString()} program={program} setChosenProgram={setChosenProgram} DetailHandler={DetailHandler} />
                    ))}
                </div>

                <div className="programs-pagination">
                    <button className='programs-pagination-btn prev' onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                    <button className='programs-pagination-btn next' onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default Programs;