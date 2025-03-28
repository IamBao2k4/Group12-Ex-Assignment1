# Project Name

Student Manager

## Cấu trúc source code

-Source gồm 2 phần là client và server
-Trong các phần thì source code được chia ra thành các thư mục ứng với các chức năng lưu trữ khác nhau

## Hướng dẫn cài đặt & chạy chương trình

- Yêu cầu cần cài đặt mongodb ở máy.

- Tạo file .env trong folder migration
  - Nội dung file .env :
    - MONGO_URI=
  - Tạo file .env trong folder server
    - Nội dùng file .env :
      - NODE_ENV=development
      - MONGO_URI_DEV= 
      - MONGO_URI_PROD=
      - PORT=3001
- Mở 2 terminal
  - terminal 1:
    - cd migration
    - npm install
    - node migration.js
  - terminal 2:
    - cd server
    - npm install
    - npm run start:dev
  - terminal 3:
    - cd client
    - npm install
    - npm run dev

## Minh chứng chức năng
### Khoa
- Quản lý khoa
  - ![alt text](image/faculty_dashboard.jpg)
- Thêm khoa
  - ![alt text](image/faculty_add.jpg)
- Sửa khoa
  - ![alt text](image/faculty_edit.jpg)

### Chương trình
- Quản lý chương trình
  - ![alt text](image/program_dashboard.jpg)
- Thêm chương trình
  - ![alt text](image/program_add.jpg)
- Sửa chương trình
  - ![alt text](image/program_edit.jpg)

### Tình trạng
- Quản lý tình trạng
  - ![alt text](image/status_dashboard.jpg)
- Thêm tình trạng
  - ![alt text](image/status_add.jpg)
- Sửa tình trạng
  - ![alt text](image/status_edit.jpg)

### Tìm kiếm theo khoa + tên
  - ![alt text](image/find_by_faculty_name.jpg)

### Xác thực số điện thoại
  - ![alt text](image/phone_validate.jpg)

### Xác thực email
  - ![alt text](image/email_validate_1.jpg)
  - ![alt text](image/email_validate_2.jpg)

### Xác thực mã số sinh viên
  - ![alt text](image/student_id_validate.jpg)

### Xác thực tình trạng
  - ![alt text](image/status_validate.jpg)
