import React from 'react'

import './facultyItem.css'

import { Faculty } from '../models/faculty'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import { SERVER_URL } from '../../../../../global'

interface FacultyItemProps {
    faculty: Faculty
    DetailHandler: (type: string) => void
    setChosenFaculty: (student: Faculty) => void
}

const FacultyItem: React.FC<FacultyItemProps> = ({ faculty, DetailHandler, setChosenFaculty}) => {

    async function DeleteHandler() {
        console.log("Deleting ...")
        await fetch(SERVER_URL + `/api/v1/faculties/${faculty._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(() => {
            window.location.reload()
        })
    }

  return (
    <div>
        <div className="faculty-item row">
            <div className="faculty-item-info">
                <div className="faculty-item-info-id">{faculty.ma_khoa}</div>
                <div className="faculty-item-info-name">{faculty.ten_khoa}</div>
                <div className="faculty-item-info-created-date">{faculty.created_at?.toString().split("T")[0]}</div>
                <div className="faculty-item-info-updated-date">{faculty.updated_at?.toString().split("T")[0]}</div>
                <div className="faculty-item-info-action">
                    <button className="faculty-item-info-action-edit" onClick={() => {DetailHandler('edit'); setChosenFaculty(faculty)}}><EditIcon/></button>
                    <button className="faculty-item-info-action-delete" onClick={DeleteHandler}><DeleteIcon/></button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default FacultyItem
