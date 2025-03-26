import React, { useState, useEffect } from 'react';
import { Student } from '../../models/student';
import { IDDocument } from '../../models/id-document';
import CMNDItem from './documentTypes/CMNDItem/CMNDItem';
import CCCDItem from './documentTypes/CCCDItem/CCCDItem';
import PassportItem from './documentTypes/passportItem/passportItem';

interface IdDocumentItemProps {
    student: Student;
    setDocuments: (documents: IDDocument[]) => void;
}

const IdDocumentItem: React.FC<IdDocumentItemProps> = ({ student, setDocuments }) => {
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

            {selected === "CMND" && document?.type === "cmnd" && (
                <CMNDItem document={document} setDocument={setDocument} />
            )}

            {selected === "CCCD" && document?.type === "cccd" && (
                <CCCDItem document={document} setDocument={setDocument} />
            )}

            {selected === "passport" && document?.type === "passport" && (
                <PassportItem document={document} setDocument={setDocument} />
            )}
        </div>
    );
};

export default IdDocumentItem;