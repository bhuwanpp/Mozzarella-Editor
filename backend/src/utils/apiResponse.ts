export class ApiResponse {
  message: string = "Success";
  success: boolean;
  data: any;
  constructor(message: string, data?: any) {
    this.message = message;
    this.data = data;
    this.success = true;
  }
}
