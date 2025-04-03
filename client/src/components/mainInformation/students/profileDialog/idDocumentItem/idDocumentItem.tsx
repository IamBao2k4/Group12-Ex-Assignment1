import React, { useState, useEffect } from 'react';
import { Student } from '../../models/student';
import { IDDocument, CMNDDocument, CCCDDocument, PassportDocument } from '../../models/id-document';
import CMNDItem from './documentTypes/CMNDItem/CMNDItem';
import CCCDItem from './documentTypes/CCCDItem/CCCDItem';
import PassportItem from './documentTypes/passportItem/passportItem';
import "./idDocumentItem.css"

interface IdDocumentItemProps {
    student: Student;
    setDocuments: (documents: IDDocument[]) => void;
    type: string;
}

const IdDocumentItem: React.FC<IdDocumentItemProps> = ({ student, setDocuments, type }) => {
    const [selected, setSelected] = useState("");

    const getGiayTo = (type: string): IDDocument | undefined => {
        return student?.giay_to_tuy_than.find(
            (item) => item.type.toLowerCase() === type.toLowerCase()
        );
    };

    const giayToSelected = getGiayTo(selected);

    const [document, setDocument] = useState<IDDocument | undefined>(giayToSelected);

    useEffect(() => {
        setDocument(giayToSelected);
    }, [giayToSelected]);

    useEffect(() => {
        if (document) {
            // Check if the document type already exists in the current documents
            const existingDocument = student.giay_to_tuy_than.find(
                (item) => item.type === document.type
            );
    
            let updatedDocuments;
            if (existingDocument) {
                // Update the existing document
                updatedDocuments = student.giay_to_tuy_than.map((item) => {
                    if (item.type === document.type) {
                        return document;
                    }
                    return item;
                });
            } else {
                // Add the new document type to the list
                updatedDocuments = [...student.giay_to_tuy_than, document];
            }
    
            console.log("updatedDocuments", updatedDocuments);
            setDocuments(updatedDocuments);
        } else {
            setDocuments(student?.giay_to_tuy_than);
        }
    }, [document]);

    return (
        <div className="profile-dialog-info-form-group">
            <label style={{ marginTop: "20px" }}>
                Giấy tờ chứng minh nhân thân của sinh viên
            </label>
            <div className="profile-dialog-info-form-radio">
                <label>
                    <input
                        type="radio"
                        name="giayto"
                        value="CMND"
                        onChange={(e) => setSelected(e.target.value)}
                    />
                    CMND
                </label>

                <label>
                    <input
                        type="radio"
                        name="giayto"
                        value="CCCD"
                        onChange={(e) => setSelected(e.target.value)}
                    />
                    CCCD
                </label>

                <label>
                    <input
                        type="radio"
                        name="giayto"
                        value="passport"
                        onChange={(e) => setSelected(e.target.value)}
                    />
                    Hộ chiếu
                </label>
            </div>

            {selected === "CMND" && (
                <CMNDItem document={type === "edit" ? (document as CMNDDocument | null) : null} setDocument={setDocument} />
            )}

            {selected === "CCCD" && (
                <CCCDItem document={type === "edit"? (document as CCCDDocument | null): null} setDocument={setDocument} />
            )}

            {selected === "passport" && (
                <PassportItem document={type === "edit"? (document as PassportDocument | null): null} setDocument={setDocument} />
            )}
        </div>
    );
};

export default IdDocumentItem;