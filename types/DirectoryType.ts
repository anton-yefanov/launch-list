import { DirectoryTag } from "@/types/DirectoryTag";

enum SubmitDifficulty {
  High = "High",
  Ok = "Ok",
  Low = "Low",
}

export interface DirectoryType {
  name: string;
  description: string;
  url: string;
  bgColor: string;
  domainRating: number;
  viewsPerMonth: number;
  tags: DirectoryTag[];
  submitDifficulty: SubmitDifficulty;
}
