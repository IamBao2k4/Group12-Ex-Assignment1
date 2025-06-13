---
sidebar_position: 5
---

# API Usage Examples

This page provides practical examples of how to use the Student Manager System API with various programming languages and tools.

## JavaScript/Node.js Examples

### Basic Setup

```javascript
const API_BASE_URL = "http://localhost:3000/api";

// Helper function for API calls
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
```

### Student Management Examples

#### Create a New Student

```javascript
async function createStudent() {
  const studentData = {
    ma_sv: "SV2024001",
    ho_ten: "Nguyen Van A",
    gioi_tinh: {
      en: "Male",
      vi: "Nam",
    },
    ngay_sinh: "2000-05-15",
    email: "nguyenvana@university.edu.vn",
    sdt: "0123456789",
    dia_chi: {
      chi_tiet: "123 Main Street",
      phuong_xa: "Ward 1",
      quan_huyen: "District 1",
      tinh_thanh_pho: "Ho Chi Minh City",
      quoc_gia: "Vietnam",
    },
    cccd: {
      type: "cccd",
      so: "001234567890",
      ngay_cap: "2018-01-01",
      noi_cap: "Ho Chi Minh City Police",
      ngay_het_han: "2033-01-01",
      co_gan_chip: true,
    },
    khoa: "faculty_object_id",
    chuong_trinh: "program_object_id",
    tinh_trang: "status_object_id",
  };

  try {
    const result = await apiRequest("/students", {
      method: "POST",
      body: JSON.stringify(studentData),
    });
    console.log("Student created:", result);
    return result;
  } catch (error) {
    console.error("Error creating student:", error);
  }
}
```

#### Search Students with Pagination

```javascript
async function searchStudents(searchTerm = "", page = 1, limit = 10) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(searchTerm && { searchString: searchTerm }),
  });

  try {
    const result = await apiRequest(`/students?${params}`);
    console.log(`Found ${result.meta.total} students`);
    return result;
  } catch (error) {
    console.error("Error searching students:", error);
  }
}

// Usage
searchStudents("Nguyen", 1, 20).then((data) => {
  console.log("Students:", data.data);
  console.log("Pagination:", data.meta);
});
```

#### Update Student Information

```javascript
async function updateStudent(studentId, updateData) {
  try {
    const result = await apiRequest(`/students/${studentId}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
    });
    console.log("Student updated:", result);
    return result;
  } catch (error) {
    console.error("Error updating student:", error);
  }
}

// Example: Update student's email and phone
updateStudent("student_id_here", {
  email: "newemail@university.edu.vn",
  sdt: "0987654321",
});
```

### Faculty and Program Management

#### Create Faculty and Program

```javascript
async function setupFacultyAndProgram() {
  // Create faculty first
  const facultyData = {
    ma_khoa: "CNTT",
    ten_khoa: {
      en: "Information Technology",
      vi: "Công Nghệ Thông Tin",
    },
  };

  const faculty = await apiRequest("/faculties", {
    method: "POST",
    body: JSON.stringify(facultyData),
  });

  // Create program
  const programData = {
    name: {
      en: "Computer Science",
      vi: "Khoa Học Máy Tính",
    },
    ma: "CS",
  };

  const program = await apiRequest("/programs", {
    method: "POST",
    body: JSON.stringify(programData),
  });

  return { faculty, program };
}
```

### Course and Enrollment Management

#### Complete Course Registration Flow

```javascript
async function enrollStudentInCourse() {
  // 1. Get available courses
  const courses = await apiRequest("/courses/all-available");
  console.log("Available courses:", courses);

  // 2. Create open class
  const openClassData = {
    ma_lop: "CS101_2024_1",
    ma_mon_hoc: courses[0]._id, // Use first available course
    nam_hoc: 2024,
    hoc_ky: 1,
    giang_vien: "Dr. Nguyen Van B",
    so_luong_toi_da: 40,
    lich_hoc: "Monday, Wednesday 8:00-9:30",
    phong_hoc: "A101",
  };

  const openClass = await apiRequest("/open_class", {
    method: "POST",
    body: JSON.stringify(openClassData),
  });

  // 3. Enroll student
  const enrollmentData = {
    ma_sv: "SV2024001",
    ma_lop: openClass.ma_lop,
    ma_mon: openClass.ma_mon_hoc,
    thoi_gian_dang_ky: new Date().toISOString(),
  };

  const enrollment = await apiRequest("/enrollments", {
    method: "POST",
    body: JSON.stringify(enrollmentData),
  });

  return { openClass, enrollment };
}
```

### File Import/Export Examples

#### Import Students from CSV

```javascript
async function importStudentsFromCSV(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_BASE_URL}/import/csv`, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header, let browser set it for FormData
    });

    if (!response.ok) {
      throw new Error(`Import failed: ${response.status}`);
    }

    const result = await response.json();
    console.log(`Successfully imported ${result.imported} students`);

    if (result.errors.length > 0) {
      console.warn("Import errors:", result.errors);
    }

    return result;
  } catch (error) {
    console.error("Error importing CSV:", error);
  }
}

// Usage with file input
document.getElementById("csvInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    importStudentsFromCSV(file);
  }
});
```

#### Export Students to Excel

```javascript
async function exportStudentsToExcel() {
  try {
    const response = await fetch(`${API_BASE_URL}/export/students/excel`);

    if (!response.ok) {
      throw new Error(`Export failed: ${response.status}`);
    }

    // Create blob and download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_export_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    console.log("Export completed successfully");
  } catch (error) {
    console.error("Error exporting to Excel:", error);
  }
}
```

## Python Examples

### Using Requests Library

```python
import requests
import json
from datetime import datetime

API_BASE_URL = 'http://localhost:3000/api'

class StudentAPI:
    def __init__(self, base_url=API_BASE_URL):
        self.base_url = base_url
        self.headers = {'Content-Type': 'application/json'}

    def create_student(self, student_data):
        """Create a new student"""
        response = requests.post(
            f'{self.base_url}/students',
            headers=self.headers,
            data=json.dumps(student_data)
        )
        response.raise_for_status()
        return response.json()

    def get_students(self, page=1, limit=10, search=''):
        """Get paginated list of students"""
        params = {
            'page': page,
            'limit': limit,
            'searchString': search
        }
        response = requests.get(f'{self.base_url}/students', params=params)
        response.raise_for_status()
        return response.json()

    def update_student(self, student_id, update_data):
        """Update student information"""
        response = requests.patch(
            f'{self.base_url}/students/{student_id}',
            headers=self.headers,
            data=json.dumps(update_data)
        )
        response.raise_for_status()
        return response.json()

    def import_csv(self, file_path):
        """Import students from CSV file"""
        with open(file_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(f'{self.base_url}/import/csv', files=files)
            response.raise_for_status()
            return response.json()

# Usage example
api = StudentAPI()

# Create a student
student_data = {
    "ma_sv": "SV2024002",
    "ho_ten": "Tran Thi B",
    "gioi_tinh": {"en": "Female", "vi": "Nữ"},
    "ngay_sinh": "2001-03-20",
    "email": "tranthib@university.edu.vn",
    "sdt": "0987654321"
}

try:
    new_student = api.create_student(student_data)
    print(f"Created student: {new_student['ma_sv']}")

    # Search for students
    students = api.get_students(search="Tran")
    print(f"Found {students['meta']['total']} students")

except requests.exceptions.RequestException as e:
    print(f"API Error: {e}")
```

## cURL Examples

### Basic CRUD Operations

#### Create Faculty

```bash
curl -X POST http://localhost:3000/api/faculties \
  -H "Content-Type: application/json" \
  -d '{
    "ma_khoa": "CNTT",
    "ten_khoa": {
      "en": "Information Technology",
      "vi": "Công Nghệ Thông Tin"
    }
  }'
```

#### Get Students with Pagination

```bash
curl -X GET "http://localhost:3000/api/students?page=1&limit=5&searchString=Nguyen"
```

#### Update Course

```bash
curl -X PATCH http://localhost:3000/api/courses/COURSE_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "ten": {
      "en": "Advanced Programming",
      "vi": "Lập Trình Nâng Cao"
    },
    "tin_chi": 4
  }'
```

#### Import CSV File

```bash
curl -X POST http://localhost:3000/api/import/csv \
  -F "file=@students.csv"
```

#### Export to Excel

```bash
curl -X GET http://localhost:3000/api/export/students/excel \
  --output students_export.xlsx
```

## React.js Integration Example

### Custom Hook for API

```javascript
// hooks/useStudentAPI.js
import { useState, useCallback } from "react";

const API_BASE_URL = "http://localhost:3000/api";

export function useStudentAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createStudent = useCallback(
    (studentData) => {
      return apiCall("/students", {
        method: "POST",
        body: JSON.stringify(studentData),
      });
    },
    [apiCall]
  );

  const getStudents = useCallback(
    (page = 1, limit = 10, search = "") => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { searchString: search }),
      });

      return apiCall(`/students?${params}`);
    },
    [apiCall]
  );

  return {
    loading,
    error,
    createStudent,
    getStudents,
  };
}
```

### React Component Example

```javascript
// components/StudentList.js
import React, { useState, useEffect } from "react";
import { useStudentAPI } from "../hooks/useStudentAPI";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { loading, error, getStudents } = useStudentAPI();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const result = await getStudents(page, 10, search);
        setStudents(result.data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };

    fetchStudents();
  }, [page, search, getStudents]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search students..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}

      <ul>
        {students.map((student) => (
          <li key={student._id}>
            {student.ho_ten} - {student.ma_sv}
          </li>
        ))}
      </ul>

      <button onClick={() => setPage((p) => Math.max(1, p - 1))}>
        Previous
      </button>
      <span> Page {page} </span>
      <button onClick={() => setPage((p) => p + 1)}>Next</button>
    </div>
  );
}

export default StudentList;
```

## Error Handling Best Practices

### JavaScript Error Handling

```javascript
async function robustAPICall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    // Handle different status codes
    switch (response.status) {
      case 200:
      case 201:
        return await response.json();

      case 400:
        const badRequestError = await response.json();
        throw new Error(`Validation Error: ${badRequestError.message}`);

      case 404:
        throw new Error("Resource not found");

      case 409:
        throw new Error("Resource already exists");

      case 500:
        throw new Error("Server error. Please try again later.");

      default:
        throw new Error(`Unexpected error: ${response.status}`);
    }
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Network error. Please check your connection.");
    }
    throw error;
  }
}
```

### Python Error Handling

```python
import requests
from requests.exceptions import RequestException, ConnectionError, Timeout

def safe_api_request(url, method='GET', **kwargs):
    try:
        response = requests.request(method, url, timeout=30, **kwargs)

        if response.status_code == 200:
            return response.json()
        elif response.status_code == 400:
            error_data = response.json()
            raise ValueError(f"Validation Error: {error_data.get('message', 'Unknown error')}")
        elif response.status_code == 404:
            raise FileNotFoundError("Resource not found")
        elif response.status_code == 409:
            raise FileExistsError("Resource already exists")
        else:
            response.raise_for_status()

    except ConnectionError:
        raise ConnectionError("Unable to connect to the API server")
    except Timeout:
        raise TimeoutError("Request timed out")
    except RequestException as e:
        raise RuntimeError(f"API request failed: {e}")
```

## Performance Tips

1. **Use Pagination**: Always use pagination for large datasets
2. **Implement Caching**: Cache frequently accessed data like faculties and programs
3. **Batch Operations**: Group multiple operations when possible
4. **Error Retry Logic**: Implement retry logic for network failures
5. **Request Debouncing**: Debounce search requests to avoid excessive API calls

## Testing Examples

### Jest Testing for API Functions

```javascript
// __tests__/studentAPI.test.js
import { createStudent, getStudents } from "../api/studentAPI";

// Mock fetch
global.fetch = jest.fn();

describe("Student API", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("createStudent should return created student", async () => {
    const mockStudent = { _id: "123", ma_sv: "SV001", ho_ten: "Test Student" };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockStudent,
    });

    const studentData = { ma_sv: "SV001", ho_ten: "Test Student" };
    const result = await createStudent(studentData);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/students",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      })
    );
    expect(result).toEqual(mockStudent);
  });

  test("getStudents should handle pagination", async () => {
    const mockResponse = {
      data: [{ _id: "123", ma_sv: "SV001" }],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await getStudents(1, 10, "test");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/students?page=1&limit=10&searchString=test"
    );
    expect(result).toEqual(mockResponse);
  });
});
```

These examples provide a comprehensive guide for integrating with the Student Manager System API across different platforms and programming languages.
