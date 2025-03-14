import { Student } from "../../../../../model/student";
import "./profileDialog.css";
import React, { useEffect } from "react";

interface StudentItemProps {
    type: string;
    student: Student;
}

const validateEmail = (email: string) => {
    const emailError = document.querySelector(
        ".profile-dialog-info-form-error-email"
    ) as HTMLElement;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        emailError.style.display = "flex";
        return false;
    } else {
        emailError.style.display = "none";
        return true;
    }
};

const validatePhone = (phone: string) => {
    const phoneError = document.querySelector(
        ".profile-dialog-info-form-error-phone"
    ) as HTMLElement;
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phone)) {
        phoneError.style.display = "flex";
        return false;
    }
    phoneError.style.display = "none";
    return true;
};

const ProfileDialog: React.FC<StudentItemProps> = ({ type, student }) => {
    const profileDialog = document.querySelector(
        ".profile-dialog-container"
    ) as HTMLElement;

    function setInnerHTML() {
        if (!student) {
            return <div>Loading...</div>;
        }
        const name = document.getElementById("name") as HTMLInputElement;
        const id = document.getElementById("id") as HTMLInputElement;
        const birthday = document.getElementById(
            "birthday"
        ) as HTMLInputElement;
        const gender = document.getElementById("gender") as HTMLInputElement;
        const faculty = document.getElementById("faculty") as HTMLSelectElement;
        const course = document.getElementById("course") as HTMLInputElement;
        const program = document.getElementById("program") as HTMLInputElement;
        const address = document.getElementById("address") as HTMLInputElement;
        const email = document.getElementById("email") as HTMLInputElement;
        const phone = document.getElementById("phone") as HTMLInputElement;
        const status = document.getElementById("status") as HTMLSelectElement;

        if (
            !name ||
            !id ||
            !birthday ||
            !gender ||
            !faculty ||
            !course ||
            !program ||
            !address ||
            !email ||
            !phone ||
            !status
        ) {
            return;
        }

        if (type === "edit") {
            name.value = student.ho_ten;
            id.value = student.ma_so_sinh_vien;
            birthday.value = student.ngay_sinh;
            gender.value = student.gioi_tinh;
            faculty.value = student.khoa;
            if (student.khoa === "Khoa Luật") {
                faculty.value = "khoa-luat";
            } else if (student.khoa === "Khoa Tiếng Anh thương mại") {
                faculty.value = "khoa-tieng-anh";
            } else if (student.khoa === "Khoa Tiếng Nhật") {
                faculty.value = "khoa-tieng-nhat";
            } else {
                faculty.value = "khoa-tieng-phap";
            }
            course.value = student.khoa_hoc;
            program.value = student.chuong_trinh;
            address.value = student.dia_chi || "";
            email.value = student.email || "";
            phone.value = student.so_dien_thoai || "";
            if (student.tinh_trang === "Đang học") {
                status.value = "dang-hoc";
            } else if (student.tinh_trang === "Đã tốt nghiệp") {
                status.value = "da-tot-nghiep";
            } else if (student.tinh_trang === "Đã thôi học") {
                status.value = "da-thoi-hoc";
            } else {
                status.value = "tam-dung-hoc";
            }
        } else {
            name.value = "";
            id.value = "";
            birthday.value = "";
            gender.value = "";
            faculty.value = "";
            course.value = "";
            program.value = "";
            address.value = "";
            email.value = "";
            phone.value = "";
            status.value = "";
        }
    }

    useEffect(() => {
        setInnerHTML();
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;
        const emailInput = form.querySelector("#email") as HTMLInputElement;
        const phoneInput = form.querySelector("#phone") as HTMLInputElement;

        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();

        let isValid = true;

        if (!validateEmail(email)) isValid = false;
        if (!validatePhone(phone)) isValid = false;

        if (!isValid) return;

        const data = new FormData(form);

        if (data.get("faculty") === "khoa-luat") {
            data.set("faculty", "Khoa Luật");
        } else if (data.get("faculty") === "khoa-tieng-anh") {
            data.set("faculty", "Khoa Tiếng Anh thương mại");
        } else if (data.get("faculty") === "khoa-tieng-nhat") {
            data.set("faculty", "Khoa Tiếng Nhật");
        } else {
            data.set("faculty", "Khoa Tiếng Pháp");
        }

        if (data.get("status") === "dang-hoc") {
            data.set("status", "Đang học");
        } else if (data.get("status") === "da-tot-nghiep") {
            data.set("status", "Đã tốt nghiệp");
        } else if (data.get("status") === "da-thoi-hoc") {
            data.set("status", "Đã thôi học");
        } else {
            data.set("status", "Tạm dừng học");
        }

        const studentData = {
            ho_ten: data.get("name") as string,
            ma_so_sinh_vien: data.get("id") as string,
            ngay_sinh: data.get("birthday") as string,
            gioi_tinh: data.get("gender") as string,
            khoa: data.get("faculty") as string,
            khoa_hoc: data.get("course") as string,
            chuong_trinh: data.get("program") as string,
            dia_chi: data.get("address") as string,
            email: data.get("email") as string,
            so_dien_thoai: data.get("phone") as string,
            tinh_trang: data.get("status") as string,
        };

        if (type === "add") {
            try {
                const response = await fetch(
                    "http://localhost:3001/api/v1/students",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(studentData),
                    }
                );

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || "Có lỗi xảy ra");
                }

                alert("Tạo sinh viên thành công!");
                return responseData;
            } catch (error) {
                if (error instanceof Error) {
                    alert(error.message);
                } else {
                    alert("Lỗi không xác định!");
                }
            }
        } else {
            try {
                const response = await fetch(
                    `http://localhost:3001/api/v1/students/${student._id}`,
                    {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(studentData),
                    }
                );

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || "Có lỗi xảy ra");
                }

                alert("Cập nhật sinh viên thành công!");
                profileDialog.classList.toggle("hidden");
                window.location.reload();
                return responseData;
            } catch (error) {
                if (error instanceof Error) {
                    alert(error.message);
                } else {
                    alert("Lỗi không xác định!");
                }
            }
        }
    };

    function CancelHandler() {
        profileDialog.classList.toggle("hidden");
    }

    return (
        <div className="profile-dialog-container hidden">
            <div className="profile-dialog">
                <h1>Profile</h1>
                <div className="profile-dialog-info">
                    <form
                        className="profile-dialog-info-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="profile-dialog-info-form-top">
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="name">Họ tên</label>
                                <input type="text" id="name" name="name" />
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="id">Mã số sinh viên</label>
                                <input type="text" id="id" name="id" />
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="birthday">Ngày sinh</label>
                                <input
                                    type="date"
                                    id="birthday"
                                    name="birthday"
                                />
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="gender">Giới tính</label>
                                <input type="text" id="gender" name="gender" />
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="faculty">Khoa</label>
                                <div className="profile-dialog-info-form-select">
                                    <select name="faculty" id="faculty">
                                        <option value="khoa-luat">
                                            Khoa Luật
                                        </option>
                                        <option value="khoa-tieng-anh">
                                            Khoa Tiếng Anh thương mại
                                        </option>
                                        <option value="khoa-tieng-nhat">
                                            Khoa Tiếng Nhật
                                        </option>
                                        <option value="khoa-tieng-phap">
                                            Khoa Tiếng Pháp
                                        </option>
                                    </select>

                                    <i className="fa-solid fa-caret-up"></i>
                                </div>
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="course">Khóa</label>
                                <input type="text" id="course" name="course" />
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="program">Chương trình</label>
                                <input
                                    type="text"
                                    id="program"
                                    name="program"
                                />
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="address">Địa chỉ</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                />
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    onInput={(e) =>
                                        validateEmail(e.currentTarget.value)
                                    }
                                />
                                <div className="profile-dialog-info-form-error profile-dialog-info-form-error-email">
                                    <i className="fa-solid fa-circle-exclamation"></i>
                                    <span>Email không hợp lệ</span>
                                </div>
                            </div>
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="phone">Số điện thoại</label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    onInput={(e) =>
                                        validatePhone(e.currentTarget.value)
                                    }
                                />
                                <div className="profile-dialog-info-form-error profile-dialog-info-form-error-phone">
                                    <i className="fa-solid fa-circle-exclamation"></i>
                                    <span>Số điện thoại không hợp lệ</span>
                                </div>
                            </div>
                        </div>
                        <div className="profile-dialog-info-form-bottom">
                            <div className="profile-dialog-info-form-group">
                                <label htmlFor="status">Tình trạng</label>
                                {/* <input type="text" id="status" name="status" /> */}
                                <div className="profile-dialog-info-form-select">
                                    <select name="status" id="status">
                                        <option value="dang-hoc">
                                            Đang học
                                        </option>
                                        <option value="da-tot-nghiep">
                                            Đã tốt nghiệp
                                        </option>
                                        <option value="da-thoi-hoc">
                                            Đã thôi học
                                        </option>
                                        <option value="tam-dung-hoc">
                                            Tạm dừng học
                                        </option>
                                    </select>

                                    <i className="fa-solid fa-caret-up"></i>
                                </div>
                            </div>
                            <div className="profile-dialog-action">
                                <button
                                    className="profile-dialog-action-save"
                                    type="submit"
                                >
                                    {type !== "add" ? "Save" : "Add"}
                                </button>
                                <button
                                    className="profile-dialog-action-cancel"
                                    type="button"
                                    onClick={CancelHandler}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileDialog;
