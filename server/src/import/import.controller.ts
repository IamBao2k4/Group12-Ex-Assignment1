import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    Logger
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService } from './import.service';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

@Controller('import')
export class ImportController {
    private readonly logger = new Logger(ImportController.name);

    constructor(private readonly importService: ImportService) { }

    @Post('csv')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: uploadsDir,
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const extension = path.extname(file.originalname);
                    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (file.mimetype !== 'text/csv' && !file.originalname.endsWith('.csv')) {
                    return cb(new BadRequestException('Only CSV files are allowed'), false);
                }
                cb(null, true);
            },
        }),
    )
    async importCSV(@UploadedFile() file: Express.Multer.File) {
        this.logger.log(`Received CSV file: ${file?.originalname}`);
        return this.importService.importCSV(file);
    }

    @Post('excel')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: uploadsDir,
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const extension = path.extname(file.originalname);
                    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                const validExtensions = ['.xlsx', '.xls'];
                const fileExt = path.extname(file.originalname).toLowerCase();
                if (!validExtensions.includes(fileExt)) {
                    return cb(new BadRequestException('Only Excel files are allowed'), false);
                }
                cb(null, true);
            },
        }),
    )
    async importExcel(@UploadedFile() file: Express.Multer.File) {
        this.logger.log(`Received Excel file: ${file?.originalname}`);
        return this.importService.importExcel(file);
    }
} 