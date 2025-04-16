# Project Name

Student Manager

## Cấu trúc source code

### Tổng quan

- Source code gồm 2 phần chính: client (frontend) và server (backend)
- Mỗi phần được tổ chức theo cấu trúc module, với mỗi thư mục đại diện cho một tính năng hoặc thành phần riêng biệt

### Client (Frontend)

- Sử dụng React với TypeScript
- Cấu trúc thư mục:
  - `/src`: Chứa mã nguồn chính của ứng dụng
    - `/components`: Các component UI được sử dụng trong ứng dụng
      - `/common`: Các component dùng chung
      - `/mainInformation`: Các component hiển thị thông tin chính
      - `/horizontalNav`: Component thanh điều hướng ngang
    - `/assets`: Lưu trữ các tài nguyên như hình ảnh, biểu tượng
    - `App.tsx`: Component gốc của ứng dụng
    - `main.tsx`: Điểm khởi đầu của ứng dụng
  - `/public`: Chứa các tệp tĩnh được phục vụ trực tiếp
  - Các file cấu hình: `vite.config.ts`, `tsconfig.json`, `eslint.config.js`

### Server (Backend)

- Sử dụng NestJS framework với TypeScript
- Cấu trúc thư mục:
  - `/src`: Chứa mã nguồn chính của server
    - `/common`: Các tiện ích, middleware, và filter dùng chung
    - `/config`: Cấu hình ứng dụng
    - `/types`: Định nghĩa các kiểu dữ liệu
    - Các module chức năng và các test của nó:
      - `/student`: Quản lý thông tin sinh viên
      - `/faculty`: Quản lý khoa
      - `/program`: Quản lý chương trình học
      - `/student_status`: Quản lý tình trạng sinh viên
      - `/course`: Quản lý học phần
      - `/enrollment`: Quản lý đăng ký học phần
      - `/transcript`: Quản lý bảng điểm
      - `/open_class`: Quản lý mở lớp
      - `/import`: Chức năng nhập dữ liệu
      - `/export`: Chức năng xuất dữ liệu
    - `app.module.ts`: Module gốc kết nối các module con
    - `main.ts`: Điểm khởi đầu của ứng dụng server
  - `/dist`: Thư mục chứa mã đã biên dịch
  - `/test`: Khởi tạo test
  - Các file cấu hình: `tsconfig.json`, `nest-cli.json`, `.env`
  - `/uploads`: Lưu trữ các file được tải lên
  - `/exports`: Lưu trữ các file xuất ra

Mỗi module trong server được tổ chức theo mô hình MVC với controller, service, DTO, entity và repository riêng biệt, tuân theo kiến trúc NestJS.

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

### Tạo module

## Course

- ![alt text](image/module_course.jpg)

## Enrollment

- ![alt text](image/module_enrollment.jpg)

## Grade

- ![alt text](image/module_grade.jpg)

## Transcript

- ![alt text](image/module_transcript.jpg)
