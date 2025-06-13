---
sidebar_position: 6
---

# Database Schema Documentation

Complete database schema documentation for the **Student Management System**. This system uses MongoDB with Mongoose ODM for data modeling and validation.

## Overview

The database consists of 8 main collections with relationships established through ObjectId references. All collections support soft deletion and include automatic timestamps.

### Database Connection

```javascript
// MongoDB URI Configuration
// Development: mongodb://localhost:27017/University
// Production: mongodb://localhost:27017/University_prod
```

## Collections Schema

### 🎓 Students Collection

**Collection Name:** `students`

Core entity representing student records with personal information, academic details, and contact data.

```javascript
{
  _id: ObjectId,
  ma_so_sinh_vien: String,           // Student ID (required, unique)
  ho_ten: String,                    // Full name (required)
  ngay_sinh: String,                 // Birth date (required)
  gioi_tinh: {                       // Gender (bilingual)
    en: String,                      // English: "Male", "Female", etc.
    vi: String                       // Vietnamese: "Nam", "Nữ", etc.
  },
  khoa: ObjectId,                    // Reference to Faculty (required)
  khoa_hoc: String,                  // Academic year (required)
  chuong_trinh: ObjectId,            // Reference to Program (required)
  dia_chi_thuong_tru: {              // Permanent address (required)
    chi_tiet: String,                // Detailed address
    phuong_xa: String,               // Ward
    quan_huyen: String,              // District
    tinh_thanh_pho: String,          // Province/City
    quoc_gia: String                 // Country (default: "Việt Nam")
  },
  dia_chi_tam_tru: {                 // Temporary address (optional)
    // Same structure as dia_chi_thuong_tru
  },
  dia_chi_nhan_thu: {                // Mailing address (optional)
    // Same structure as dia_chi_thuong_tru
  },
  giay_to_tuy_than: [                // ID Documents array
    {
      type: String,                  // "cmnd", "cccd", "passport"
      so: String,                    // Document number
      ngay_cap: Date,                // Issue date
      noi_cap: String,               // Place of issue
      ngay_het_han: Date,            // Expiration date
      co_gan_chip: Boolean,          // Has chip (CCCD only)
      quoc_gia_cap: String,          // Issuing country (Passport only)
      ghi_chu: String                // Notes (optional)
    }
  ],
  email: String,                     // Email address (optional)
  so_dien_thoai: String,             // Phone number (optional)
  tinh_trang: ObjectId,              // Reference to StudentStatus
  created_at: Date,                  // Creation timestamp
  updated_at: Date,                  // Last update timestamp
  deleted_at: Date                   // Soft delete timestamp
}
```

**Relationships:**

- `khoa` → References `faculties` collection
- `chuong_trinh` → References `programs` collection
- `tinh_trang` → References `studentstatuses` collection

**Indexes:**

- `ma_so_sinh_vien` (unique)
- `khoa` (compound with other fields for queries)
- `email` (sparse, unique)

---

### 🏛️ Faculties Collection

**Collection Name:** `faculties`

Academic faculties/departments organization structure.

```javascript
{
  _id: ObjectId,
  ma_khoa: String,                   // Faculty code (required)
  ten_khoa: {                        // Faculty name (bilingual)
    en: String,                      // English name
    vi: String                       // Vietnamese name
  },
  created_at: Date,                  // Creation timestamp
  updated_at: Date,                  // Last update timestamp
  deleted_at: Date                   // Soft delete timestamp
}
```

**Example Data:**

```javascript
{
  ma_khoa: "CNTT",
  ten_khoa: {
    en: "Information Technology",
    vi: "Công Nghệ Thông Tin"
  }
}
```

---

### 📚 Programs Collection

**Collection Name:** `programs`

Academic programs/curricula offered by the university.

```javascript
{
  _id: ObjectId,
  name: {                            // Program name (bilingual)
    en: String,                      // English name
    vi: String                       // Vietnamese name
  },
  ma: String,                        // Program code (required)
  created_at: Date,                  // Creation timestamp
  updated_at: Date,                  // Last update timestamp
  deleted_at: Date                   // Soft delete timestamp
}
```

**Example Data:**

```javascript
{
  name: {
    en: "Computer Science",
    vi: "Khoa Học Máy Tính"
  },
  ma: "CS"
}
```

---

### 📖 Courses Collection

**Collection Name:** `courses`

Course catalog with details about subjects and their requirements.

```javascript
{
  _id: ObjectId,
  ma_mon_hoc: String,                // Course code (required, unique)
  ten: {                             // Course name (bilingual)
    en: String,                      // English name
    vi: String                       // Vietnamese name
  },
  tin_chi: Number,                   // Credit hours (required)
  khoa: ObjectId,                    // Reference to Faculty (required)
  mon_tien_quyet: [ObjectId],        // Prerequisites (array of Course refs)
  vo_hieu_hoa: Boolean,              // Disabled flag (default: false)
  created_at: Date,                  // Creation timestamp
  updated_at: Date,                  // Last update timestamp
  deleted_at: Date                   // Soft delete timestamp
}
```

**Relationships:**

- `khoa` → References `faculties` collection
- `mon_tien_quyet` → Array of references to `courses` collection

**Example Data:**

```javascript
{
  ma_mon_hoc: "CS101",
  ten: {
    en: "Introduction to Programming",
    vi: "Giới Thiệu Lập Trình"
  },
  tin_chi: 3,
  khoa: ObjectId("faculty_id"),
  mon_tien_quyet: [ObjectId("prerequisite_course_id")]
}
```

---

### 🏫 Open Classes Collection

**Collection Name:** `openclasses`

Scheduled class offerings with instructor and timing information.

```javascript
{
  _id: ObjectId,
  ma_lop: String,                    // Class code (required)
  ma_mon_hoc: String,                // Reference to Course (required)
  course_details: {                  // Populated course information
    ma_mon_hoc: String,              // Course code
    ten: {                           // Course name (bilingual)
      en: String,
      vi: String
    },
    _id: String                      // Course ID
  },
  si_so: Number,                     // Current enrollment (default: 0)
  nam_hoc: Number,                   // Academic year (required)
  hoc_ky: Number,                    // Semester (required)
  giang_vien: String,                // Instructor name (required)
  so_luong_toi_da: Number,           // Maximum capacity (required)
  lich_hoc: String,                  // Schedule (required)
  phong_hoc: String,                 // Classroom (required)
  created_at: Date,                  // Creation timestamp
  updated_at: Date,                  // Last update timestamp
  deleted_at: Date                   // Soft delete timestamp
}
```

**Relationships:**

- `ma_mon_hoc` → References `courses` collection

**Example Data:**

```javascript
{
  ma_lop: "CS101_2024_1",
  ma_mon_hoc: "course_id",
  nam_hoc: 2024,
  hoc_ky: 1,
  giang_vien: "Dr. Nguyen Van A",
  so_luong_toi_da: 40,
  lich_hoc: "Monday, Wednesday 8:00-9:30",
  phong_hoc: "A101"
}
```

---

### 📝 Enrollments Collection

**Collection Name:** `enrollments`

Student course registrations and enrollment tracking.

```javascript
{
  _id: ObjectId,
  ma_sv: String,                     // Student ID (required)
  ma_mon: String,                    // Course ID (required)
  ma_lop: String,                    // Class code (required)
  thoi_gian_dang_ky: Date,           // Registration time (default: now)
  thoi_gian_huy: Date,               // Withdrawal time (optional)
  created_at: Date,                  // Creation timestamp
  updated_at: Date,                  // Last update timestamp
  deleted_at: Date                   // Soft delete timestamp
}
```

**Business Logic:**

- Supports upsert operations for enrollment management
- Tracks both registration and withdrawal timestamps
- Used for capacity management in open classes

---

### 📊 Transcripts Collection

**Collection Name:** `transcripts`

Academic transcripts storing student grades and course completions.

```javascript
{
  _id: ObjectId,
  ma_mon_hoc: ObjectId,              // Reference to Course (required)
  ma_so_sinh_vien: ObjectId,         // Reference to Student (required)
  diem: Number,                      // Grade/Score (required)
  trang_thai: String,                // Status: "passed", "failed", etc.
  hoc_ky: String,                    // Semester (e.g., "2023-1")
  nam_hoc: String,                   // Academic year (e.g., "2023-2024")
  created_at: Date,                  // Creation timestamp
  updated_at: Date,                  // Last update timestamp
  deleted_at: Date                   // Soft delete timestamp
}
```

**Relationships:**

- `ma_mon_hoc` → References `courses` collection
- `ma_so_sinh_vien` → References `students` collection

**Indexes:**

- Compound index on `ma_so_sinh_vien` + `ma_mon_hoc` for efficient transcript queries

---

### 📈 Student Statuses Collection

**Collection Name:** `studentstatuses`

Student status categories for tracking academic standing.

```javascript
{
  _id: ObjectId,
  tinh_trang: {                      // Status name (bilingual)
    en: String,                      // English status
    vi: String                       // Vietnamese status
  },
  created_at: Date,                  // Creation timestamp
  updated_at: Date,                  // Last update timestamp
  deleted_at: Date                   // Soft delete timestamp
}
```

**Example Data:**

```javascript
{
  tinh_trang: {
    en: "Active",
    vi: "Đang học"
  }
}
```

**Common Status Values:**

- Active / Đang học
- Suspended / Tạm nghỉ
- Graduated / Đã tốt nghiệp
- Dropped Out / Thôi học

## Data Types and Validation

### Multilingual Fields

All user-facing text fields support bilingual content with English and Vietnamese:

```javascript
{
  en: String,  // English text
  vi: String   // Vietnamese text
}
```

**Used in:**

- Faculty names (`ten_khoa`)
- Program names (`name`)
- Course names (`ten`)
- Student statuses (`tinh_trang`)
- Gender information (`gioi_tinh`)

### Address Structure

Standardized address format for Vietnamese locations:

```javascript
{
  chi_tiet: String,        // Detailed address
  phuong_xa: String,       // Ward/Commune
  quan_huyen: String,      // District/County
  tinh_thanh_pho: String,  // Province/City
  quoc_gia: String         // Country (default: "Việt Nam")
}
```

### ID Document Types

Supports three types of identification documents:

```javascript
{
  type: "cmnd" | "cccd" | "passport",
  so: String,              // Document number
  ngay_cap: Date,          // Issue date
  noi_cap: String,         // Place of issue
  ngay_het_han: Date,      // Expiration date

  // CCCD specific
  co_gan_chip: Boolean,    // Required when type is "cccd"

  // Passport specific
  quoc_gia_cap: String,    // Required when type is "passport"

  ghi_chu: String          // Optional notes
}
```

## Database Constraints and Business Rules

### Unique Constraints

- Student ID (`ma_so_sinh_vien`) must be unique
- Course code (`ma_mon_hoc`) must be unique
- Email addresses must be unique (sparse index)

### Required Fields

- All timestamp fields are automatically managed
- Core identification fields are required
- Relationships to master data are required

### Soft Delete Implementation

- All collections support soft deletion via `deleted_at` field
- Queries automatically filter out deleted records
- Cascade deletion is not implemented (maintains referential integrity)

### Validation Rules

- Email domain validation for student emails
- Phone number format validation
- ID document validation based on type
- Credit hours must be positive numbers
- Class capacity must be at least 1

## Performance Considerations

### Indexing Strategy

```javascript
// Recommended indexes
db.students.createIndex({ ma_so_sinh_vien: 1 }, { unique: true });
db.students.createIndex({ khoa: 1, chuong_trinh: 1 });
db.students.createIndex({ email: 1 }, { unique: true, sparse: true });

db.courses.createIndex({ ma_mon_hoc: 1 }, { unique: true });
db.courses.createIndex({ khoa: 1 });

db.transcripts.createIndex({ ma_so_sinh_vien: 1, ma_mon_hoc: 1 });
db.transcripts.createIndex({ ma_so_sinh_vien: 1 });

db.enrollments.createIndex({ ma_sv: 1 });
db.enrollments.createIndex({ ma_lop: 1 });
```

### Query Optimization

- Use pagination for large result sets
- Implement proper population for referenced documents
- Filter deleted records at the database level
- Use aggregation pipelines for complex reporting

## Migration and Backup

### Schema Versioning

- Use Mongoose schema versioning for migrations
- Maintain backward compatibility during updates
- Document schema changes in migration scripts

### Backup Strategy

- Regular automated backups of the entire database
- Point-in-time recovery capability
- Export functionality for individual collections
- Separate backup storage for production environments

## Security Considerations

### Data Protection

- Personal information is stored in compliance with privacy regulations
- ID document information requires special handling
- Student contact information has restricted access

### Access Control

- API-level authentication and authorization
- Role-based access to different data types
- Audit logging for sensitive operations
- Rate limiting on data export functions

This database schema provides a robust foundation for the Student Management System with proper normalization, referential integrity, and scalability considerations.
