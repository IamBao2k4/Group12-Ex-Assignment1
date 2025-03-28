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
