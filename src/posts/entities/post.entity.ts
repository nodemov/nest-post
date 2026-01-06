export class PostEntity {
  id: number;
  title: string;
  detail: string;
  cover: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
