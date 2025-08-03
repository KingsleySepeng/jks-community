// resource.ts
export interface Resource {
  id: string;
  clubId: string;
  title: string;
  description: string;
  contentType: string;
  base64Data: string;
  uploadedAt: string;
}

export interface ResourceRequest {
  clubId:string,
  title: string;
  description: string;
  file: File;
}
