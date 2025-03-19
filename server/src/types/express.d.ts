// This file extends Express types to include Multer
import 'express';
import { Multer as MulterType } from 'multer';

declare global {
    namespace Express {
        // Add Multer namespace to Express
        namespace Multer {
            interface File {
                fieldname: string;
                originalname: string;
                encoding: string;
                mimetype: string;
                size: number;
                destination: string;
                filename: string;
                path: string;
                buffer: Buffer;
            }
        }
    }
} 