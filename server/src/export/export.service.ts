import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from '../student/interfaces/student.interface';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { StudentTransformer } from '../common/utils/student-transformer.util';
import { FacultyService } from '../faculty/services/faculty.service';
import { ProgramService } from '../program/services/program.service';
import { StudentStatusService } from '../student_status/services/student_status.service';

interface WorkSheet {}
interface WorkBook {
    SheetNames: string[];
    Sheets: { [sheet: string]: WorkSheet };
}

declare module 'xlsx' {
    interface Utils {
        json_to_sheet(data: any[]): WorkSheet;
        book_new(): WorkBook;
        book_append_sheet(workbook: WorkBook, worksheet: WorkSheet, name: string): void;
    }
    
    export function write(workbook: WorkBook, options: { type: string; bookType: string }): Buffer;
}

@Injectable()
export class ExportService {
    private readonly logger = new Logger(ExportService.name);
    private readonly exportsDir = path.join(process.cwd(), 'exports');

    constructor(
        @InjectModel('Student') private studentModel: Model<Student>,
        private readonly facultyService: FacultyService,
        private readonly programService: ProgramService,
        private readonly studentStatusService: StudentStatusService,
    ) {
        if (!fs.existsSync(this.exportsDir)) {
            fs.mkdirSync(this.exportsDir, { recursive: true });
        }
    }

    async exportStudentsToExcel(): Promise<{ filePath: string; fileName: string }> {
        try {
            const students = await this.studentModel
                .find({ deleted_at: { $exists: false } })
                .populate('khoa', 'ten_khoa ma_khoa')
                .populate('chuong_trinh', 'name ma')
                .populate('tinh_trang', 'tinh_trang')
                .lean()
                .exec();
            
            this.logger.log(`Exporting ${students.length} students to Excel file`);

            const studentsWithNames = await this.enhanceStudentsWithNames(students);
            
            const studentData = studentsWithNames.map(student => StudentTransformer.toExcelRow(student));
            
            // @ts-ignore
            const worksheet = XLSX.utils.json_to_sheet(studentData);
            // @ts-ignore
            const workbook = XLSX.utils.book_new();
            // @ts-ignore
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
            
            const fileName = `student_export_${new Date().toISOString().replace(/:/g, '-')}.xlsx`;
            const filePath = path.join(this.exportsDir, fileName);
            
            const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
            fs.writeFileSync(filePath, excelBuffer);
            
            this.logger.log(`Excel file created at: ${filePath}`);
            
            return {
                filePath,
                fileName
            };
        } catch (error) {
            this.logger.error('Error exporting students to Excel:', error.stack);
            throw error;
        }
    }

    async exportStudentsToCSV(): Promise<{ filePath: string; fileName: string }> {
        try {
            const students = await this.studentModel
                .find({ deleted_at: { $exists: false } })
                .populate('khoa', 'ten_khoa ma_khoa')
                .populate('chuong_trinh', 'name ma')
                .populate('tinh_trang', 'tinh_trang')
                .lean()
                .exec();
            
            this.logger.log(`Exporting ${students.length} students to CSV file`);

            const studentsWithNames = await this.enhanceStudentsWithNames(students);
            
            const studentData = studentsWithNames.map(student => StudentTransformer.toExcelRow(student));
            
            const headers = Object.keys(studentData[0]);
            const csvRows = [
                headers.join(','),
                ...studentData.map(row => 
                    headers.map(header => {
                        const cellValue = row[header] !== undefined && row[header] !== null ? row[header].toString() : '';
                        return `"${cellValue.replace(/"/g, '""')}"`;
                    }).join(',')
                )
            ];
            
            const csvContent = csvRows.join('\n');
            
            const fileName = `student_export_${new Date().toISOString().replace(/:/g, '-')}.csv`;
            const filePath = path.join(this.exportsDir, fileName);
            
            fs.writeFileSync(filePath, csvContent, { encoding: 'utf8' });
            
            this.logger.log(`CSV file created at: ${filePath}`);
            
            return {
                filePath,
                fileName
            };
        } catch (error) {
            this.logger.error('Error exporting students to CSV:', error.stack);
            throw error;
        }
    }


    private async enhanceStudentsWithNames(students: any[]): Promise<any[]> {
        try {
            // Lấy tất cả các faculty, program và status để có map đầy đủ
            const [faculties, programs, statuses] = await Promise.all([
                this.facultyService.getAll(),
                this.programService.getAll(),
                this.studentStatusService.getAll()
            ]);

            // Tạo map từ ID tới tên và mã để tra cứu nhanh - sử dụng type assertion
            const facultyMap = new Map(faculties.map(f => [(f as any)._id.toString(), { 
                ten_khoa: (f as any).ten_khoa,
                ma_khoa: (f as any).ma_khoa
            }]));
            const programMap = new Map(programs.map(p => [(p as any)._id.toString(), { 
                name: (p as any).name,
                ma: (p as any).ma 
            }]));
            const statusMap = new Map(statuses.map(s => [(s as any)._id.toString(), (s as any).tinh_trang]));

            // Xử lý từng student để đảm bảo tên đã được populate
            return students.map(student => {
                const enhancedStudent = { ...student };

                // Khoa
                if (student.khoa) {
                    if (typeof student.khoa === 'object' && student.khoa.ten_khoa) {
                        enhancedStudent.khoa_ten = student.khoa.ten_khoa;
                        enhancedStudent.khoa_ma = student.khoa.ma_khoa;
                    } else {
                        const facultyId = typeof student.khoa === 'object' ? student.khoa._id?.toString() : student.khoa.toString();
                        const faculty = facultyMap.get(facultyId) || { ten_khoa: 'Không xác định', ma_khoa: '' };
                        enhancedStudent.khoa_ten = faculty.ten_khoa;
                        enhancedStudent.khoa_ma = faculty.ma_khoa;
                    }
                }

                // Chương trình
                if (student.chuong_trinh) {
                    if (typeof student.chuong_trinh === 'object' && student.chuong_trinh.name) {
                        enhancedStudent.chuong_trinh_ten = student.chuong_trinh.name;
                        enhancedStudent.chuong_trinh_ma = student.chuong_trinh.ma;
                    } else {
                        const programId = typeof student.chuong_trinh === 'object' ? student.chuong_trinh._id?.toString() : student.chuong_trinh.toString();
                        const program = programMap.get(programId) || { name: 'Không xác định', ma: '' };
                        enhancedStudent.chuong_trinh_ten = program.name;
                        enhancedStudent.chuong_trinh_ma = program.ma;
                    }
                }

                // Tình trạng
                if (student.tinh_trang) {
                    if (typeof student.tinh_trang === 'object' && student.tinh_trang.tinh_trang) {
                        enhancedStudent.tinh_trang_ten = student.tinh_trang.tinh_trang;
                    } else {
                        const statusId = typeof student.tinh_trang === 'object' ? student.tinh_trang._id?.toString() : student.tinh_trang.toString();
                        enhancedStudent.tinh_trang_ten = statusMap.get(statusId) || 'Không xác định';
                    }
                }

                return enhancedStudent;
            });
        } catch (error) {
            this.logger.error('Error enhancing student data with names:', error.stack);
            return students; // Trả về dữ liệu gốc nếu có lỗi
        }
    }
} 