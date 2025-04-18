import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    Col,
    Form,
    Pagination,
    Row,
    Table,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { PaginationOptions, TranscriptModel } from "./models/transcript.model";
import { transcriptRoute } from "./route/transcript.route";

const Transcript: React.FC = () => {
    const { studentId } = useParams();
    const [transcript, setTranscript] = React.useState<TranscriptModel[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    const [pagination, setPagination] = useState<PaginationOptions>({
        page: 1,
        limit: 10,
    });
    const [totalPages, setTotalPages] = useState<number>(1);

    const [searchOptions, setSearchOptions] = useState({
        nam_hoc: undefined,
        hoc_ky: undefined,
        keyword: "",
    });

    useEffect(() => {
        fetchTranscript();
    }, [pagination.page, pagination.limit, searchOptions]);

    const fetchTranscript = async () => {
        setLoading(true);
        try {
            const response = await transcriptRoute.getTranscript(
                studentId as string,
                pagination,
                searchOptions
            );
            setTranscript(response.data);
            setTotalPages(response.meta.totalPages);
            setError(null);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching transcript:", error);
            setError("Lỗi khi tải bảng điểm. Vui lòng thử lại sau.");
            setTranscript([]);
            setLoading(false);
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSearchOptions({
            ...searchOptions,
            [name]: value === "" ? undefined : value,
        });
        console.log("Updated searchOptions:", {
            ...searchOptions,
            [name]:
                value === ""
                    ? undefined
                    : name === "keyword"
                    ? value
                    : Number(value),
        });
        setPagination({ ...pagination, page: 1 }); // Reset to first page on filter change
    };

    const handlePageChange = (page: number) => {
        setPagination({ ...pagination, page });
    };

    const convertVietnameseToEnglishName = (str: string): string => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D")
            .replace(/[^\w\s]/gi, "") // Xóa ký tự đặc biệt (nếu có)
            .replace(/\s+/g, " ") // Chuẩn hóa khoảng trắng
            .trim();
    };

    const exportToPDF = () => {
        const doc = new jsPDF();

        doc.setFont("Helvetica", "normal");

        doc.setFontSize(18);
        doc.text(
            "ACADEMIC TRANSCRIPT",
            doc.internal.pageSize.getWidth() / 2,
            20,
            {
                align: "center",
            }
        );

        doc.setFontSize(14);
        const studentId = transcript[0]?.ma_so_sinh_vien.ma_so_sinh_vien;
        const studentName = transcript[0]?.ma_so_sinh_vien.ho_ten;

        const convertedId = convertVietnameseToEnglishName(studentId);
        const convertedName = convertVietnameseToEnglishName(studentName);
        doc.text(
            `${convertedId} - ${convertedName}`,
            doc.internal.pageSize.getWidth() / 2,
            30,
            {
                align: "center",
            }
        );

        doc.setFontSize(12);
        const tableColumn = ["Course ID", "Course title", "Credits", "Point"];
        const tableRows: string[][] = [];

        transcript.forEach((transcriptItem) => {
            const transcriptData = [
                `${transcriptItem.ma_mon_hoc.ma_mon_hoc}`,
                `${transcriptItem.ma_mon_hoc.ten}`,
                `${transcriptItem.ma_mon_hoc.tin_chi}`,
                `${transcriptItem.diem}`,
            ];
            tableRows.push(transcriptData);
        });

        autoTable(doc, {
            startY: 50,
            head: [tableColumn],
            body: tableRows,
        });

        doc.save(`${convertedId}-transcript.pdf`);
    };

    return (
        <div className="transcript-container mt-4">
            <Card>
                <Card.Header className="bg-primary text-white">
                    <h2>Kết quả học tập</h2>
                </Card.Header>
                <Card.Body>
                    <div className="d-flex align-items-end mb-3">
                        <Row className="flex-grow-1">
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Năm học:</Form.Label>
                                    <Form.Select
                                        name="nam_hoc"
                                        value={searchOptions.nam_hoc || ""}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Tất cả</option>
                                        {[2021, 2022, 2023, 2024, 2025].map(
                                            (year) => (
                                                <option
                                                    key={year}
                                                    value={`${year}-${
                                                        year + 1
                                                    }`}
                                                >
                                                    {year}-{year + 1}
                                                </option>
                                            )
                                        )}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Học kỳ:</Form.Label>
                                    <Form.Select
                                        name="hoc_ky"
                                        value={searchOptions.hoc_ky || ""}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button
                            variant="outline-primary"
                            className="align-self-end"
                            onClick={exportToPDF}
                        >
                            Export PDF
                        </Button>
                    </div>

                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>NH/HK</th>
                                    <th>Môn học</th>
                                    <th>Số TC</th>
                                    <th>Điểm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="text-center">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="text-center text-danger"
                                        >
                                            {error}
                                        </td>
                                    </tr>
                                ) : transcript.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center">
                                            Không tìm thấy bảng điểm của sinh
                                            viên
                                        </td>
                                    </tr>
                                ) : (
                                    transcript.map((transcriptItem) => (
                                        <tr key={transcriptItem._id}>
                                            <td>
                                                {transcriptItem.nam_hoc}/
                                                {transcriptItem.hoc_ky}
                                            </td>

                                            <td>
                                                {
                                                    transcriptItem.ma_mon_hoc
                                                        .ma_mon_hoc
                                                }{" "}
                                                -{" "}
                                                {transcriptItem.ma_mon_hoc.ten}
                                            </td>

                                            <td>
                                                {
                                                    transcriptItem.ma_mon_hoc
                                                        .tin_chi
                                                }
                                            </td>

                                            <td>{transcriptItem.diem}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>

                    <div className="d-flex justify-content-center">
                        <Pagination>
                            <Pagination.First
                                onClick={() => handlePageChange(1)}
                                disabled={pagination.page === 1}
                            />
                            <Pagination.Prev
                                onClick={() =>
                                    handlePageChange(
                                        Math.max(1, pagination.page! - 1)
                                    )
                                }
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
                                onClick={() =>
                                    handlePageChange(
                                        Math.min(
                                            totalPages,
                                            pagination.page! + 1
                                        )
                                    )
                                }
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
        </div>
    );
};

export default Transcript;
