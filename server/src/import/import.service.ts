import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from '../student/interfaces/student.interface';
import * as fs from 'fs';
import csv from 'csv-parser';
import * as XLSX from 'xlsx';
import { IDDocument } from '../student/interfaces/id-document.interface';

@Injectable()
export class ImportService {
    private readonly logger = new Logger(ImportService.name);

    constructor(
        @InjectModel('Student') private studentModel: Model<Student>,
    ) { }

    /**
     * Import data from CSV file to students collection
     */
    async importCSV(file: Express.Multer.File): Promise<{ success: boolean; imported: number; errors: any[] }> {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        const results: any[] = [];
        const errors: any[] = [];

        return new Promise((resolve, reject) => {
            fs.createReadStream(file.path)
                .pipe(csv())
                .on('data', (data: any) => results.push(data))
                .on('end', async () => {
                    try {
                        this.logger.log(`Parsed ${results.length} records from CSV file`);
                        let importedCount = 0;

                        for (const record of results) {
                            try {
                                // Transform data to match your Student model
                                const studentData = this.transformStudentData(record);

                                // Create or update student record
                                await this.createOrUpdateStudent(studentData);
                                importedCount++;
                            } catch (error) {
                                this.logger.error(`Error importing record: ${JSON.stringify(record)}`, error.stack);
                                errors.push({ record, error: error.message });
                            }
                        }

                        // Delete the temporary file
                        fs.unlinkSync(file.path);

                        resolve({
                            success: true,
                            imported: importedCount,
                            errors
                        });
                    } catch (error) {
                        reject(error);
                    }
                })
                .on('error', (error) => {
                    fs.unlinkSync(file.path);
                    reject(error);
                });
        });
    }

    /**
     * Import data from Excel file to students collection
     */
    async importExcel(file: Express.Multer.File): Promise<{ success: boolean; imported: number; errors: any[] }> {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        try {
            const workbook = XLSX.read(file.buffer);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert to JSON
            const results = XLSX.utils.sheet_to_json(worksheet);
            this.logger.log(`Parsed ${results.length} records from Excel file`);

            let importedCount = 0;
            const errors: any[] = [];

            for (const record of results) {
                try {
                    // Transform data to match your Student model
                    const studentData = this.transformStudentData(record);

                    // Create or update student record
                    await this.createOrUpdateStudent(studentData);
                    importedCount++;
                } catch (error) {
                    this.logger.error(`Error importing record: ${JSON.stringify(record)}`, error.stack);
                    errors.push({ record, error: error.message });
                }
            }

            // Delete the temporary file
            fs.unlinkSync(file.path);

            return {
                success: true,
                imported: importedCount,
                errors
            };
        } catch (error) {
            fs.unlinkSync(file.path);
            throw error;
        }
    }

    /**
     * Transform raw data to match Student model
     */
    private transformStudentData(rawData: any): Partial<Student> {
        // This transformation depends on your CSV/Excel structure
        // Here's a simple example; adjust according to your actual data structure

        // Basic fields
        const studentData: Partial<Student> = {
            ma_so_sinh_vien: rawData.ma_so_sinh_vien,
            ho_ten: rawData.ho_ten,
            ngay_sinh: rawData.ngay_sinh,
            gioi_tinh: rawData.gioi_tinh,
            khoa: rawData.khoa,
            khoa_hoc: rawData.khoa_hoc,
            chuong_trinh: rawData.chuong_trinh,
            tinh_trang: rawData.tinh_trang || 'Đang học',
            email: rawData.email,
            so_dien_thoai: rawData.so_dien_thoai,
        };

        // Handle address if present
        if (rawData.dia_chi_chi_tiet) {
            studentData.dia_chi_thuong_tru = {
                chi_tiet: rawData.dia_chi_chi_tiet,
                phuong_xa: rawData.dia_chi_phuong_xa,
                quan_huyen: rawData.dia_chi_quan_huyen,
                tinh_thanh_pho: rawData.dia_chi_tinh_thanh_pho,
                quoc_gia: rawData.dia_chi_quoc_gia || 'Việt Nam',
            };
        }

        // Handle ID document if present
        if (rawData.giay_to_loai && rawData.giay_to_so) {
            const idDoc: any = {
                type: rawData.giay_to_loai,
                so: rawData.giay_to_so,
                ngay_cap: rawData.giay_to_ngay_cap,
                noi_cap: rawData.giay_to_noi_cap,
                ngay_het_han: rawData.giay_to_ngay_het_han,
            };

            // Add type-specific fields
            if (idDoc.type === 'cccd') {
                idDoc.co_gan_chip = rawData.giay_to_co_gan_chip === 'true'
                    || rawData.giay_to_co_gan_chip === true
                    || rawData.giay_to_co_gan_chip === 1;
            } else if (idDoc.type === 'passport') {
                idDoc.quoc_gia_cap = rawData.giay_to_quoc_gia_cap;
                if (rawData.giay_to_ghi_chu) {
                    idDoc.ghi_chu = rawData.giay_to_ghi_chu;
                }
            }

            studentData.giay_to_tuy_than = [idDoc];
        }

        return studentData;
    }

    /**
     * Create a new student or update existing one
     */
    private async createOrUpdateStudent(studentData: Partial<Student>): Promise<Student | null> {
        // Require MSSV field
        if (!studentData.ma_so_sinh_vien) {
            throw new BadRequestException('Mã số sinh viên is required');
        }

        // Check if student already exists
        const existingStudent = await this.studentModel.findOne({
            ma_so_sinh_vien: studentData.ma_so_sinh_vien
        }).exec();

        if (existingStudent) {
            // Update existing student
            return this.studentModel.findOneAndUpdate(
                { ma_so_sinh_vien: studentData.ma_so_sinh_vien },
                { $set: studentData },
                { new: true }
            ).exec();
        } else {
            // Create new student
            const newStudent = new this.studentModel(studentData);
            return newStudent.save();
        }
    }
} 