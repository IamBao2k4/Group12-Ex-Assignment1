// import React, { useState, useEffect } from "react";
// import { Student } from "../../models/student";
// import { IDDocument } from "../../models/id-document";
// import CMNDItem from "./documentTypes/CMNDItem/CMNDItem";
// import CCCDItem from "./documentTypes/CCCDItem/CCCDItem";
// import PassportItem from "./documentTypes/passportItem/passportItem";
// import "./idDocumentItem.css";

// interface IdDocumentItemProps {
//     student: Student;
//     setDocuments: (documents: IDDocument[]) => void;
// }

// const IdDocumentItem: React.FC<IdDocumentItemProps> = ({
//     student,
//     setDocuments,
// }) => {
//     const [selected, setSelected] = useState("");

//     const getGiayTo = (type: string): IDDocument | undefined => {
//         return student?.giay_to_tuy_than.find(
//             (item) => item.type.toLowerCase() === type.toLowerCase()
//         );
//     };

//     const giayToSelected = getGiayTo(selected);

//     const [document, setDocument] = useState<IDDocument | undefined>(
//         giayToSelected
//     );

//     useEffect(() => {
//         setDocument(giayToSelected);
//     }, [giayToSelected]);

//     return (
//         <div className="profile-dialog-info-form-group">
//             <label style={{ marginTop: "20px" }}>
//                 Giấy tờ chứng minh nhân thân của sinh viên
//             </label>
//             <div className="profile-dialog-info-form-radio">
//                 <label>
//                     <input
//                         type="radio"
//                         name="giayto"
//                         value="CMND"
//                         onChange={(e) => setSelected(e.target.value)}
//                     />
//                     CMND
//                 </label>

//                 <label>
//                     <input
//                         type="radio"
//                         name="giayto"
//                         value="CCCD"
//                         onChange={(e) => setSelected(e.target.value)}
//                     />
//                     CCCD
//                 </label>

//                 <label>
//                     <input
//                         type="radio"
//                         name="giayto"
//                         value="passport"
//                         onChange={(e) => setSelected(e.target.value)}
//                     />
//                     Hộ chiếu
//                 </label>
//             </div>

//             {selected === "CMND" && document?.type === "cmnd" && (
//                 <CMNDItem document={document} setDocument={setDocument} />
//             )}

//             {selected === "CCCD" && document?.type === "cccd" && (
//                 <CCCDItem document={document} setDocument={setDocument} />
//             )}

//             {selected === "passport" && document?.type === "passport" && (
//                 <PassportItem document={document} setDocument={setDocument} />
//             )}
//         </div>
//     );
// };

// export default IdDocumentItem;

import React, { useState, useEffect } from "react";
import { Student } from "../../models/student";
import { IDDocument } from "../../models/id-document";
import CMNDItem from "./documentTypes/CMNDItem/CMNDItem";
import CCCDItem from "./documentTypes/CCCDItem/CCCDItem";
import PassportItem from "./documentTypes/passportItem/passportItem";
import "./idDocumentItem.css";

interface IdDocumentItemProps {
    student: Student;
    setDocuments: (documents: IDDocument[]) => void;
}

// Chỉ cho phép các giá trị hợp lệ
const validDocumentTypes = ["cmnd", "cccd", "passport"] as const;
type ValidDocumentType = (typeof validDocumentTypes)[number];

const IdDocumentItem: React.FC<IdDocumentItemProps> = ({
    student,
    setDocuments,
}) => {
    // Lấy loại giấy tờ đầu tiên nếu có
    const initialType = student.giay_to_tuy_than?.[0]?.type || "";

    const [selected, setSelected] = useState<string>(initialType);

    // Hàm lấy giấy tờ theo loại
    const getGiayTo = (type: string): IDDocument | undefined => {
        return student?.giay_to_tuy_than.find(
            (item) => item.type.toLowerCase() === type.toLowerCase()
        );
    };

    // Nếu có sẵn giấy tờ, dùng nó. Nếu không, tạo mới.
    const [document, setDocument] = useState<IDDocument | undefined>(
        getGiayTo(initialType) || undefined
    );

    useEffect(() => {
        const foundDocument = getGiayTo(selected);
        if (foundDocument) {
            setDocument(foundDocument);
        } else if (
            validDocumentTypes.includes(
                selected.toLowerCase() as ValidDocumentType
            )
        ) {
            setDocument({
                type: selected.toLowerCase() as ValidDocumentType, // Ép kiểu an toàn
                number: "",
                issueDate: "",
                issuePlace: "",
            });
        }
    }, [selected]);

    return (
        <div className="profile-dialog-info-form-group">
            <label style={{ marginTop: "20px" }}>
                Giấy tờ chứng minh nhân thân của sinh viên
            </label>
            <div className="profile-dialog-info-form-radio">
                {["CMND", "CCCD", "passport"].map((type) => (
                    <label key={type}>
                        <input
                            type="radio"
                            name="giayto"
                            value={type}
                            checked={selected === type}
                            onChange={(e) => setSelected(e.target.value)}
                        />
                        {type === "CMND"
                            ? "CMND"
                            : type === "CCCD"
                            ? "CCCD"
                            : "Hộ chiếu"}
                    </label>
                ))}
            </div>

            {selected.toLowerCase() === "cmnd" && document?.type === "cmnd" && (
                <CMNDItem document={document} setDocument={setDocument} />
            )}

            {selected.toLowerCase() === "cccd" && document?.type === "cccd" && (
                <CCCDItem document={document} setDocument={setDocument} />
            )}

            {selected.toLowerCase() === "passport" &&
                document?.type === "passport" && (
                    <PassportItem
                        document={document}
                        setDocument={setDocument}
                    />
                )}
        </div>
    );
};

export default IdDocumentItem;
