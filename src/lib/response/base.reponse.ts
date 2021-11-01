import { ApiProperty } from "@nestjs/swagger";

export default class BaseReponse<T> {
  @ApiProperty()
  status: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data?: T;

  constructor(
    status: number,
    message: string,
    data?: T
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}