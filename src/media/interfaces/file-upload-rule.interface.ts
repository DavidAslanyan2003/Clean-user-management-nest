export interface FileUploadRule {
  maxFiles: number;
  maxFileSize: number; // in bytes
  totalMaxSize?: number; // in bytes, optional
}
