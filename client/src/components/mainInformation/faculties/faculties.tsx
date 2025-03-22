import { useEffect, useState } from "react"

import { Faculty } from "./models/faculty"
import Header from "../header/header"
import './faculties.css'

import FacultyItem from "./facultyItem/facultyItem"
import DetailDialog from "./detailDialog/detailDialog"
import AddIcon from '@mui/icons-material/Add'


const Faculties = () => {
    const [faculties, setFaculties] = useState<Faculty[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [type, setType] = useState('')
    const [chosenFaculty, setChosenFaculty] = useState<Faculty | null>(null)
    const [search, setSearch] = useState('')

    useEffect(() => {
        async function fetchFaculties() {
            try {
                const response = await fetch(`http://localhost:3001/api/v1/faculties?page=${currentPage}&searchString=${search}`,)
                const data = await response.json()
                setFaculties(data.data)
                setTotalPages(data.meta.total)
            } catch (error) {
                console.error('Error fetching faculties:', error)
            }
        }

        fetchFaculties()
    }, [search, currentPage])

    function DetailHandler(type: string) {
        const detailDialog = document.querySelector('.dialog-container') as HTMLElement
        setType(type)
        detailDialog.classList.toggle('hidden')
    }

    function handlePreviousPage() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    function handleNextPage() {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    return (
        <div className="faculties">
            <DetailDialog type={type} faculty={chosenFaculty??faculties[0]}/>
            <Header searchHandler={setSearch} />
            <div className="faculties-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <h1>Faculties</h1>
                    <button className="add-faculty" onClick={() => DetailHandler('add')}><AddIcon /></button>
                </div>

                <div className="faculties-list">
                    <div className="faculties-list-header row">
                        <div className="faculties-list-header-name">Mã khoa</div>
                        <div className="faculties-list-header-id">Tên khoa</div>
                        <div className="faculties-list-header-birthday">Ngày thêm</div>
                        <div className="faculties-list-header-status">Ngày chỉnh sửa</div>
                        <div className="faculties-list-header-action"></div>
                    </div>
                    {faculties.map((faculty) => (
                        <FacultyItem key={faculty._id.toString()} faculty={faculty} setChosenFaculty={setChosenFaculty} DetailHandler={DetailHandler}/>
                    ))}
                </div>

                <div className="faculties-pagination">
                    <button className='faculties-pagination-btn prev' onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                    <button className='faculties-pagination-btn next' onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
                </div>
            </div>
        </div>
    )
}

export default Faculties