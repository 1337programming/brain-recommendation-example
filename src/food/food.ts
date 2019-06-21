export interface Food {
  id: string;
  name: string;
  img: string;
  price: number;
  weight: number;
  organicCertified: boolean;
  locallyGrown: boolean;
  ingredientQuality: number; // 0-5 stars
}
