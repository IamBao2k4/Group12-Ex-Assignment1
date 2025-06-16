---
sidebar_position: 4
---

# Web API Documentation

Comprehensive API documentation for the **Student Manager System**. This RESTful API provides endpoints to manage students, faculties, programs, courses, enrollments, transcripts, and other educational resources.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Response Format

All API responses follow a consistent JSON format:

### Success Response

```json
{
    "data": "Actual response data",
    "meta": {
        "page": 1,
        "limit": 10,
        "total": 100,
        "totalPages": 10
    }
}
```

### Error Response

```json
{
    "statusCode": 404,
    "message": "Resource not found",
    "error": "Not Found"
}
```

## API Endpoints

### 🎓 Students Management

Manage student records, profiles, and academic information.

| Method   | Endpoint                    | Description                    |
| -------- | --------------------------- | ------------------------------ |
| `POST`   | `/students`                 | Create a new student           |
| `GET`    | `/students`                 | Get paginated list of students |
| `GET`    | `/students/:id`             | Get student details by ID      |
| `PATCH`  | `/students/:id`             | Update student information     |
| `DELETE` | `/students/:id`             | Delete a student               |
| `GET`    | `/students/:id/transcripts` | Get student's transcripts      |

#### Create Student

```http
POST /students
Content-Type: application/json

{
  "ma_sv": "SV001",
  "ho_ten": "Nguyen Van A",
  "gioi_tinh": {
    "en": "Male",
    "vi": "Nam"
  },
  "ngay_sinh": "2000-01-01",
  "email": "student@university.edu.vn",
  "sdt": "0123456789",
  "khoa": "faculty_id",
  "chuong_trinh": "program_id",
  "tinh_trang": "status_id"
}
```

#### Query Parameters for GET /students

-   `page` (number): Page number (default: 1)
-   `limit` (number): Items per page (default: 10)
-   `searchString` (string): Search in student name or ID
-   `faculty` (string): Filter by faculty ID

---

### 🏛️ Faculties Management

Manage academic faculties/departments.

| Method   | Endpoint         | Description                          |
| -------- | ---------------- | ------------------------------------ |
| `POST`   | `/faculties`     | Create a new faculty                 |
| `GET`    | `/faculties`     | Get paginated list of faculties      |
| `GET`    | `/faculties/all` | Get all faculties without pagination |
| `GET`    | `/faculties/:id` | Get faculty details by ID            |
| `PATCH`  | `/faculties/:id` | Update faculty information           |
| `DELETE` | `/faculties/:id` | Delete a faculty                     |

#### Create Faculty

```http
POST /faculties
Content-Type: application/json

{
  "ma_khoa": "CNTT",
  "ten_khoa": {
    "en": "Information Technology",
    "vi": "Công Nghệ Thông Tin"
  }
}
```

---

### 📚 Programs Management

Manage academic programs and curricula.

| Method   | Endpoint        | Description                         |
| -------- | --------------- | ----------------------------------- |
| `POST`   | `/programs`     | Create a new program                |
| `GET`    | `/programs`     | Get paginated list of programs      |
| `GET`    | `/programs/all` | Get all programs without pagination |
| `PATCH`  | `/programs/:id` | Update program information          |
| `DELETE` | `/programs/:id` | Delete a program                    |

#### Create Program

```http
POST /programs
Content-Type: application/json

{
  "name": {
    "en": "Computer Science",
    "vi": "Khoa Học Máy Tính"
  },
  "ma": "CS"
}
```

---

### 📖 Courses Management

Manage courses and subjects.

| Method   | Endpoint                 | Description                        |
| -------- | ------------------------ | ---------------------------------- |
| `POST`   | `/courses`               | Create a new course                |
| `GET`    | `/courses`               | Get paginated list of courses      |
| `GET`    | `/courses/all`           | Get all courses without pagination |
| `GET`    | `/courses/all-available` | Get available courses only         |
| `GET`    | `/courses/:id`           | Get course details by ID           |
| `PATCH`  | `/courses/:id`           | Update course information          |
| `DELETE` | `/courses/:id`           | Delete a course                    |

#### Create Course

```http
POST /courses
Content-Type: application/json

{
  "ma_mon_hoc": "CS101",
  "ten": {
    "en": "Introduction to Programming",
    "vi": "Giới Thiệu Lập Trình"
  },
  "tin_chi": 3,
  "khoa": "faculty_id",
  "mon_tien_quyet": ["prerequisite_course_id"]
}
```

#### Query Parameters for GET /courses

-   `faculty` (string): Filter by faculty ID
-   `available` (string): Filter available courses ("true"/"false")

---

### 📝 Enrollments Management

Manage student course enrollments.

| Method   | Endpoint                          | Description                       |
| -------- | --------------------------------- | --------------------------------- |
| `POST`   | `/enrollments`                    | Create/Update enrollment (upsert) |
| `GET`    | `/enrollments`                    | Get paginated list of enrollments |
| `GET`    | `/enrollments/:id`                | Get enrollment details by ID      |
| `DELETE` | `/enrollments/:id`                | Delete an enrollment              |
| `GET`    | `/enrollments/student/:studentId` | Get enrollments by student        |
| `DELETE` | `/enrollments/course/:courseId`   | Delete enrollments by course      |

#### Create/Update Enrollment

```http
POST /enrollments
Content-Type: application/json

{
  "ma_sv": "SV001",
  "ma_lop": "CS101_L01",
  "ma_mon": "course_id",
  "thoi_gian_dang_ky": "2024-01-15T10:30:00Z"
}
```

---

### 📊 Transcripts Management

Manage student academic transcripts and grades.

| Method   | Endpoint           | Description                       |
| -------- | ------------------ | --------------------------------- |
| `POST`   | `/transcripts`     | Create a new transcript record    |
| `GET`    | `/transcripts`     | Get paginated list of transcripts |
| `DELETE` | `/transcripts/:id` | Delete a transcript record        |

#### Create Transcript

```http
POST /transcripts
Content-Type: application/json

{
  "ma_sv": "student_id",
  "ma_mon_hoc": "course_id",
  "diem_so": 8.5,
  "diem_chu": "A",
  "ghi_chu": "Excellent performance"
}
```

---

### 🏫 Open Classes Management

Manage open class schedules and offerings.

| Method   | Endpoint                         | Description                        |
| -------- | -------------------------------- | ---------------------------------- |
| `POST`   | `/open_class`                    | Create a new open class            |
| `GET`    | `/open_class`                    | Get paginated list of open classes |
| `GET`    | `/open_class/all`                | Get all open classes               |
| `GET`    | `/open_class/:id`                | Get open class details by ID       |
| `PATCH`  | `/open_class/:id`                | Update open class information      |
| `DELETE` | `/open_class/:id`                | Delete an open class               |
| `GET`    | `/open_class/student/:studentId` | Get classes by student             |

#### Create Open Class

```http
POST /open_class
Content-Type: application/json

{
  "ma_lop": "CS101_L01",
  "ma_mon_hoc": "course_id",
  "nam_hoc": 2024,
  "hoc_ky": 1,
  "giang_vien": "Dr. Nguyen Van B",
  "so_luong_toi_da": 40,
  "lich_hoc": "Mon, Wed 8:00-9:30",
  "phong_hoc": "A101"
}
```

---

### 📈 Student Status Management

Manage student status categories.

| Method   | Endpoint                | Description                         |
| -------- | ----------------------- | ----------------------------------- |
| `POST`   | `/student-statuses`     | Create a new student status         |
| `GET`    | `/student-statuses`     | Get paginated list of statuses      |
| `GET`    | `/student-statuses/all` | Get all statuses without pagination |
| `GET`    | `/student-statuses/:id` | Get status details by ID            |
| `PATCH`  | `/student-statuses/:id` | Update status information           |
| `DELETE` | `/student-statuses/:id` | Delete a status                     |

#### Create Student Status

```http
POST /student-statuses
Content-Type: application/json

{
  "tinh_trang": {
    "en": "Active",
    "vi": "Đang học"
  }
}
```

---

### 📥 Import Management

Import data from CSV and Excel files.

| Method | Endpoint        | Description                         |
| ------ | --------------- | ----------------------------------- |
| `POST` | `/import/csv`   | Import student data from CSV file   |
| `POST` | `/import/excel` | Import student data from Excel file |

#### Import CSV

```http
POST /import/csv
Content-Type: multipart/form-data

file: [CSV file with student data]
```

**File Requirements:**

-   **CSV**: Maximum 5MB, `.csv` extension
-   **Excel**: Maximum 10MB, `.xlsx` or `.xls` extension

**Response:**

```json
{
    "success": true,
    "imported": 150,
    "errors": []
}
```

---

### 📤 Export Management

Export data to CSV and Excel formats.

| Method | Endpoint                 | Description                       |
| ------ | ------------------------ | --------------------------------- |
| `GET`  | `/export/students/excel` | Export all students to Excel file |
| `GET`  | `/export/students/csv`   | Export all students to CSV file   |

#### Export Students to Excel

```http
GET /export/students/excel
```

**Response:**

-   Returns a downloadable Excel file
-   Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
-   Filename format: `student_export_YYYY-MM-DDTHH-MM-SS.xlsx`

---

## Data Transfer Objects (DTOs)

### Student Data Structure

```json
{
    "ma_sv": "string", // Student ID
    "ho_ten": "string", // Full name
    "gioi_tinh": {
        "en": "string", // Gender in English
        "vi": "string" // Gender in Vietnamese
    },
    "ngay_sinh": "date", // Birth date
    "email": "string",
    "sdt": "string", // Phone number
    "dia_chi": {
        "chi_tiet": "string",
        "phuong_xa": "string",
        "quan_huyen": "string",
        "tinh_thanh_pho": "string",
        "quoc_gia": "string"
    },
    "cccd": {
        "type": "cccd|cmnd|passport",
        "so": "string",
        "ngay_cap": "date",
        "noi_cap": "string",
        "ngay_het_han": "date"
    },
    "khoa": "ObjectId", // Faculty reference
    "chuong_trinh": "ObjectId", // Program reference
    "tinh_trang": "ObjectId" // Status reference
}
```

### Course Data Structure

```json
{
    "ma_mon_hoc": "string", // Course code
    "ten": {
        "en": "string", // Course name in English
        "vi": "string" // Course name in Vietnamese
    },
    "tin_chi": "number", // Credit hours
    "khoa": "ObjectId", // Faculty reference
    "mon_tien_quyet": ["ObjectId"], // Prerequisites
    "vo_hieu_hoa": "boolean" // Disabled flag
}
```

## Error Codes

| Code  | Description                              |
| ----- | ---------------------------------------- |
| `400` | Bad Request - Invalid input data         |
| `404` | Not Found - Resource does not exist      |
| `409` | Conflict - Resource already exists       |
| `422` | Unprocessable Entity - Validation failed |
| `500` | Internal Server Error - Server error     |

## Pagination

Most GET endpoints support pagination with the following parameters:

-   `page` (number, default: 1): Page number
-   `limit` (number, default: 10): Items per page
-   `searchString` (string): Search term for filtering

**Pagination Response:**

```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 250,
    "totalPages": 25
  }
}
```

## Internationalization

The system supports bilingual content (English/Vietnamese) for:

-   Faculty names (`ten_khoa`)
-   Program names (`name`)
-   Course names (`ten`)
-   Student status (`tinh_trang`)
-   Gender information (`gioi_tinh`)

All multilingual fields follow this structure:

```json
{
    "en": "English text",
    "vi": "Vietnamese text"
}
```

## File Upload Specifications

### Import Files

-   **CSV**: Text files with comma-separated values
-   **Excel**: Microsoft Excel files (.xlsx, .xls)
-   **Size Limits**: CSV (5MB), Excel (10MB)

### Export Files

-   Generated files include timestamps in filename
-   Available formats: Excel (.xlsx), CSV (.csv)
-   Files are streamed directly to the client

## Best Practices

1. **Error Handling**: Always check response status codes
2. **Pagination**: Use pagination for large datasets
3. **Validation**: Validate data before sending requests
4. **File Uploads**: Check file size and format requirements
5. **Object References**: Use valid ObjectId format for references

## Support

For API support and questions, please refer to the development team or create an issue in the project repository.
