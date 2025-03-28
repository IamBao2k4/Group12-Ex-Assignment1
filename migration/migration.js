const { MongoClient, ObjectId } = require("mongodb");
const fs = require("fs").promises;
const path = require("path");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/University";
const client = new MongoClient(MONGO_URI);

const FILES_TO_IMPORT = [
  "University.faculties.json",
  "University.programs.json",
  "University.studentstatuses.json",
  "University.students.json",
];

const COLLECTION_MAPPING = {
  "University.faculties.json": "faculties",
  "University.programs.json": "programs",
  "University.studentstatuses.json": "studentstatuses",
  "University.students.json": "students",
};

function transformBSONObjects(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => transformBSONObjects(item));
  }

  if (typeof obj === "object") {
    if (obj.$oid) {
      return new ObjectId(obj.$oid);
    }

    if (obj.$date) {
      if (typeof obj.$date === "number") {
        return new Date(obj.$date);
      }
      return new Date(obj.$date);
    }

    const result = {};
    for (const key in obj) {
      result[key] = transformBSONObjects(obj[key]);
    }
    return result;
  }

  return obj;
}

async function migrateData() {
  try {
    console.log("Bắt đầu quá trình migration dữ liệu...");

    await client.connect();
    console.log("Đã kết nối đến MongoDB thành công.");

    const db = client.db();

    for (const file of FILES_TO_IMPORT) {
      try {
        const filePath = path.join(__dirname, file);
        const data = await fs.readFile(filePath, "utf8");
        const rawDocuments = JSON.parse(data);

        const documents = transformBSONObjects(rawDocuments);

        const collectionName = COLLECTION_MAPPING[file];
        const collection = db.collection(collectionName);

        console.log(`Xóa dữ liệu cũ từ collection ${collectionName}...`);
        await collection.deleteMany({});

        if (!documents || !Array.isArray(documents) || documents.length === 0) {
          console.log(`File ${file} không có dữ liệu hợp lệ, bỏ qua.`);
          continue;
        }

        console.log(
          `Nhập ${documents.length} documents vào collection ${collectionName}...`
        );
        const result = await collection.insertMany(documents);

        console.log(
          `Đã nhập ${result.insertedCount} documents vào collection ${collectionName} thành công.`
        );
      } catch (error) {
        console.error(`Lỗi khi xử lý file ${file}:`, error);
      }
    }

    console.log("Quá trình migration dữ liệu hoàn tất!");
  } catch (error) {
    console.error("Lỗi trong quá trình migration:", error);
  } finally {
    await client.close();
    console.log("Đã đóng kết nối MongoDB.");
  }
}

migrateData()
  .then(() => {
    console.log("Script migration đã chạy xong.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Lỗi không xử lý được:", error);
    process.exit(1);
  });
