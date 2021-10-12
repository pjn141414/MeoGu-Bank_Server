import { Injectable } from '@nestjs/common';
import { createImageURL } from 'src/lib/upload/multerOption';

@Injectable()
export class UploadService {
  public uploadFile(files: File[]): string[] {
    const generatedFiles: string[] = [];

    for (const file of files) {
      generatedFiles.push(createImageURL(file));
    }

    return generatedFiles;
  }
}
