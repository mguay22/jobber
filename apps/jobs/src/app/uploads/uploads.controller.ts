import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { UPLOAD_FILE_PATH } from './upload';

@Controller('uploads')
export class UploadsController {
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOAD_FILE_PATH,
        filename: (_req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const filename = `${file.fieldname}-${uniqueSuffix}.json`;
          callback(null, filename);
        },
      }),
      fileFilter: (_req, file, callback) => {
        if (file.mimetype !== 'application/json') {
          return callback(
            new BadRequestException('Only JSON files are allowed!'),
            false
          );
        }
        callback(null, true);
      },
    })
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'File uploaded successfully',
      filename: file.filename,
    };
  }
}
