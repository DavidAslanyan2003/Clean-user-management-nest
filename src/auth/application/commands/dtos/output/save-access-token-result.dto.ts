export interface SaveAccessTokenResultDto {
  id?: string;
  userId?: string;
  token: string;
  createdAt?: Date;
  updatedAt?: Date | null;
}
