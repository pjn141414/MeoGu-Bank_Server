import { Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { multerOptions } from 'src/lib/upload/multerOption';
import AuthGuard from 'src/middleware/auth.middleware';
import { UploadService } from './upload.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
  ) { }

  @UseInterceptors(FilesInterceptor('images', 1, multerOptions))
  // FilesInterceptor 첫번째 매개변수: formData의 key 값,
  // 두번째 매개변수: 파일 최대 갯수,
  // 세번째 매개변수: 파일 설정 (위에서 작성했던 multer 옵션들)

  @Post('/')
  public uploadFiles(
    @UploadedFiles() files: File[],
  ) {
    const UploadedFiles: string[] = this.uploadService.uploadFile(files);

    return {
      status: 200,
      message: '파일 업로드를 성공했습니다.',
      data: {
        files: UploadedFiles,
      },
    };
  }
}
