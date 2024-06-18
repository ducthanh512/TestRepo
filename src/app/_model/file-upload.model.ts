import { SafeUrl } from '@angular/platform-browser';
export interface FileUpload {
  id?: number;
  batchId?: number;
  createdTime?: Date;
  modifiedTime?: Date;
  file?: File | null;
  formFile?: string | null;
  url?: SafeUrl;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  createdUser?: string;
  sentitive?: boolean;
  matterNumber?: string;
  location?: string;
  category?: string;
  status?: string;
  position?: number;
  briefType?: string;
  hNumber?:string;
}

export interface FileUploadsByCategory {
  filesUpload: FileUpload[];
  category: string;
  isActive?: boolean;
}
