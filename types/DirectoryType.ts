import { DirectoryTag } from "@/types/DirectoryTag";
import { SubmitDifficulty } from "@/types/SubmitDifficulty";

export interface DirectoryType {
  _id: string;
  name: string;
  slug: string;
  description: string;
  url: string;
  bgColor: string;
  domainRating: number;
  viewsPerMonth: number;
  tags: DirectoryTag[];
  submitDifficulty: SubmitDifficulty;
}
