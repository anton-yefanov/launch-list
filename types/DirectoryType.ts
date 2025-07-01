import { DirectoryTag } from "@/types/DirectoryTag";
import { SubmitDifficulty } from "@/types/SubmitDifficulty";

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
