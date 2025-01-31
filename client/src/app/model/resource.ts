export interface Resource {
  id: string;
  title: string;
  description: string;
  fileUrl?: string;    // e.g. link to PDF or doc
  videoUrl?: string;   // e.g. link to YouTube or stored video
  category?: string;   // e.g. "Syllabus", "SeminarVideo"
  dateCreated: Date;
}
