export type RecipeItem = {
  id: string;
  isMembersOnly: boolean;
  title: string;
  description: string;
  rating: number;
  modifiedAt: Date;
  slug: string;
  imageUri: '';
  gram: number;
  color: string;
};

export type RecipeFlatListItem = {
  title: string;
  query: string;
  items: RecipeItem[];
};
