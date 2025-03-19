import {
    Controller,
    Get,
    Res,
    Logger,
    HttpStatus,
    StreamableFile
} from '@nestjs/common';
import { Response } from 'express';
import { ExportService } from './export.service';
import * as fs from 'fs';

@Controller('export')
export class ExportController {
    private readonly logger = new Logger(ExportController.name);

    constructor(private readonly exportService: ExportService) { }

    @Get('students/excel')
    async exportStudentsToExcel(@Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
        try {
            const { filePath, fileName } = await this.exportService.exportStudentsToExcel();
            
            const file = fs.createReadStream(filePath);
            
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${fileName}"`,
            });
            
            this.logger.log(`Sending Excel file ${fileName} to client`);
            
            return new StreamableFile(file);
        } catch (error) {
            this.logger.error(`Error sending Excel file: ${error.message}`, error.stack);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Không thể tạo file Excel',
                error: 'Internal Server Error'
            });
            throw error;
        }
    }

    @Get('students/csv')
    async exportStudentsToCSV(@Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
        try {
            const { filePath, fileName } = await this.exportService.exportStudentsToCSV();
            
            const file = fs.createReadStream(filePath);
            
            res.set({
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${fileName}"`,
            });
            
            this.logger.log(`Sending CSV file ${fileName} to client`);
            
            return new StreamableFile(file);
        } catch (error) {
            this.logger.error(`Error sending CSV file: ${error.message}`, error.stack);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Không thể tạo file CSV',
                error: 'Internal Server Error'
            });
            throw error;
        }
    }
} 