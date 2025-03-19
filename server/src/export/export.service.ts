import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from '../student/interfaces/student.interface';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

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
    ) {
        if (!fs.existsSync(this.exportsDir)) {
            fs.mkdirSync(this.exportsDir, { recursive: true });
        }
    }


    async exportStudentsToExcel(): Promise<{ filePath: string; fileName: string }> {
        try {
            const students = await this.studentModel
                .find({ deleted_at: { $exists: false } })
                .lean()
                .exec();
            
            this.logger.log(`Exporting ${students.length} students to Excel file`);

            const studentData = students.map(student => this.transformStudentToExcelRow(student));
            
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
                .lean()
                .exec();
            
            this.logger.log(`Exporting ${students.length} students to CSV file`);

            const studentData = students.map(student => this.transformStudentToExcelRow(student));
            
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
    

    private transformStudentToExcelRow(student: Student): any {
        const idDoc = student.giay_to_tuy_than && student.giay_to_tuy_than.length > 0 
            ? student.giay_to_tuy_than[0] 
            : null;
            
        return {
            'Mã số sinh viên': student.ma_so_sinh_vien,
            'Họ tên': student.ho_ten,
            'Ngày sinh': student.ngay_sinh,
            'Giới tính': student.gioi_tinh,
            'Khoa': student.khoa,
            'Khóa học': student.khoa_hoc,
            'Chương trình': student.chuong_trinh,
            'Email': student.email || '',
            'Số điện thoại': student.so_dien_thoai || '',
            'Tình trạng': student.tinh_trang,
            'Địa chỉ chi tiết': student.dia_chi_thuong_tru?.chi_tiet || '',
            'Phường/Xã': student.dia_chi_thuong_tru?.phuong_xa || '',
            'Quận/Huyện': student.dia_chi_thuong_tru?.quan_huyen || '',
            'Tỉnh/Thành phố': student.dia_chi_thuong_tru?.tinh_thanh_pho || '',
            'Quốc gia': student.dia_chi_thuong_tru?.quoc_gia || '',
            'Loại giấy tờ': idDoc?.type || '',
            'Số giấy tờ': idDoc?.so || '',
            'Ngày cấp': idDoc?.ngay_cap || '',
            'Nơi cấp': idDoc?.noi_cap || '',
            'Có gắn chip': idDoc?.type === 'cccd' ? idDoc['co_gan_chip'] || '' : '',
            'Ngày hết hạn': idDoc?.ngay_het_han || '',
            'Ngày tạo': student.created_at ? new Date(student.created_at).toLocaleString() : '',
            'Ngày cập nhật': student.updated_at ? new Date(student.updated_at).toLocaleString() : '',
        };
    }
} 