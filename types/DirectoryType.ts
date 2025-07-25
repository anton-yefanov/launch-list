import { DirectoryTag } from "@/types/DirectoryTag";
import { SubmitDifficulty } from "@/types/SubmitDifficulty";

export interface DirectoryType {
  _id: string;
  h1: string;
  name: string;
  about: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  description: string;
  url: string;
  bgColor: string;
  domainRating: number;
  viewsPerMonth: number;
  tags: DirectoryTag[];
  submitDifficulty: SubmitDifficulty;
}
