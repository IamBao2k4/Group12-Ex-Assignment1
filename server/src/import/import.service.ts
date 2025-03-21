import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from '../student/interfaces/student.interface';
import * as fs from 'fs';
import csv from 'csv-parser';
import * as XLSX from 'xlsx';
import { IDDocument } from '../student/interfaces/id-document.interface';
import { StudentTransformer } from '../common/utils/student-transformer.util';
import { FacultyService } from '../faculty/services/faculty.service';
import { ProgramService } from '../program/services/program.service';

@Injectable()
export class ImportService {
    private readonly logger = new Logger(ImportService.name);

    constructor(
        @InjectModel('Student') private studentModel: Model<Student>,
        private readonly facultyService: FacultyService,
        private readonly programService: ProgramService,
    ) { }

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
                                const studentData = await StudentTransformer.fromExcelRow(record, this.facultyService, this.programService);
                                await this.createOrUpdateStudent(studentData);
                                importedCount++;
                            } catch (error) {
                                this.logger.error(`Error importing record: ${JSON.stringify(record)}`, error.stack);
                                errors.push({ record, error: error.message });
                            }
                        }

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

    async importExcel(file: Express.Multer.File): Promise<{ success: boolean; imported: number; errors: any[] }> {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        try {
            const workbook = XLSX.read(fs.readFileSync(file.path));
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            if (!worksheet) {
                throw new BadRequestException('Excel file is empty or invalid');
            }

            const results = XLSX.utils.sheet_to_json(worksheet);
            
            if (!results || results.length === 0) {
                throw new BadRequestException('No data found in Excel file');
            }

            this.logger.log(`Parsed ${results.length} records from Excel file`);

            let importedCount = 0;
            const errors: any[] = [];

            for (const record of results) {
                try {
                    if (!record['Mã số sinh viên'] && !record.ma_so_sinh_vien) {
                        throw new BadRequestException('Mã số sinh viên is required');
                    }

                    const studentData = await StudentTransformer.fromExcelRow(record, this.facultyService, this.programService);
                    await this.createOrUpdateStudent(studentData);
                    importedCount++;
                } catch (error) {
                    this.logger.error(`Error importing record: ${JSON.stringify(record)}`, error.stack);
                    errors.push({ 
                        record, 
                        error: error instanceof BadRequestException 
                            ? error.message 
                            : 'Error processing record'
                    });
                }
            }

            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }

            return {
                success: true,
                imported: importedCount,
                errors
            };
        } catch (error) {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }

            this.logger.error('Error importing Excel file:', error.stack);
            
            if (error instanceof BadRequestException) {
                throw error;
            }
            
            throw new BadRequestException(
                'Failed to import Excel file. Please check file format and try again.'
            );
        }
    }

    private async createOrUpdateStudent(studentData: Partial<Student>): Promise<Student | null> {
        if (!studentData.ma_so_sinh_vien) {
            throw new BadRequestException('Mã số sinh viên is required');
        }

        const existingStudent = await this.studentModel.findOne({
            ma_so_sinh_vien: studentData.ma_so_sinh_vien
        }).exec();

        if (existingStudent) {
            return this.studentModel.findOneAndUpdate(
                { ma_so_sinh_vien: studentData.ma_so_sinh_vien },
                { $set: studentData },
                { new: true }
            ).exec();
        } else {
            const newStudent = new this.studentModel(studentData);
            return newStudent.save();
        }
    }
} 