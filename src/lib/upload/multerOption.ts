import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { ENDPOINT } from "src/config/config";
import HttpError from "../error/httpError";
import uuidRandom from "./uuidRandom";

export const multerOptions = {
  fileFilter: (request, file, callback) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      callback(null, true);
    } else {
      callback(new HttpError(400, '지원하지 않는 이미지 형식입니다.'), false);
    }
  },

  storage: diskStorage({
    destination: (request, file, callback) => {
      const uploadPath: string = 'public';

      // public 폴더가 존재하지 않으면 생성
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }

      callback(null, uploadPath);
    },

    filename: (request, file, callback) => {
      callback(null, uuidRandom(file));
    }
  })
}

export const createImageURL = (file): string => {
  const serverAddress: string = ENDPOINT.SERVER;

  return `${serverAddress}/public/${file.filename}`;
}