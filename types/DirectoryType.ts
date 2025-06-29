import { DirectoryTag } from "@/types/DirectoryTag";

export interface DirectoryType {
  name: string;
  description: string;
  url: string;
  bgColor: string;
  domainRating: number;
  viewsPerMonth: number;
  tags: DirectoryTag[];
}
