import { STATUS } from "../auth/presentation/enums/status.enum";

export class CustomResponse {
  constructor(
    public statusCode: number,
    public statusMessage: STATUS,
    public data: any,
    public errorMessage: string,
    public responseMessage: string 
  ) {}

  toJSON() {
    return {
      statusCode: this.statusCode,
      statusMessage: this.statusMessage,
      data: this.data,
      errorMessage: this.errorMessage,
      responseMessage: this.responseMessage,
    };
  }
}
