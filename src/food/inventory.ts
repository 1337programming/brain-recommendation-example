import { Food } from './food';

export const FOOD_INVENTORY: Food[] = [
  {
    id: '100001',
    name: 'Wag Amazon Brand Dry Dog Food',
    img: 'https://images-na.ssl-images-amazon.com/images/I/81zDNvH3tkL._SL1500_.jpg',
    price: 12.99,
    weight: 83.2,
    // price: 37.99,
    // weight: 91,
    organicCertified: false,
    locallyGrown: false,
    ingredientQuality: 3 // going off Amazon ratings for now
  },
  {
    id: '100003',
    name: 'Purina Pro Plan Dry Puppy Food',
    img: 'https://images-na.ssl-images-amazon.com/images/I/81QOOrUcNQL._SL1500_.jpg',
    price: 47.98,
    weight: 552,
    // price: 40.99,
    // weight: 80,
    organicCertified: false,
    locallyGrown: false,
    ingredientQuality: 4 // going off Amazon ratings for now
  },
  {
    id: '100004',
    name: 'Pedigree Complete Nutrition Puppy Dry Dog Food',
    img: 'https://images-na.ssl-images-amazon.com/images/I/81753eskvxL._SL1500_.jpg',
    price: 22.19,
    weight: 580.8,
    // price: 36.99,
    // weight: 91,
    organicCertified: false,
    locallyGrown: false,
    ingredientQuality: 4 // going off Amazon ratings for now
  },
  {
    id: '100005',
    name: 'Purina ONE SmartBlend Natural Puppy Dog Food',
    img: 'https://images-na.ssl-images-amazon.com/images/I/81zgonh9vaL._SL1500_.jpg',
    price: 23.99,
    weight: 256,
    // price: 29.99,
    // weight: 83,
    organicCertified: false,
    locallyGrown: false,
    ingredientQuality: 4 // going off Amazon ratings for now
  },
  {
    id: '100006',
    name: 'Blue Buffalo Wilderness High Protein Grain Free, Natural Puppy Dry Dog Food',
    img: 'https://images-na.ssl-images-amazon.com/images/I/912JuolFI2L._SL1500_.jpg',
    price: 41.49,
    weight: 177.6,
    // price: 36.99,
    // weight: 92,
    organicCertified: false,
    locallyGrown: false,
    ingredientQuality: 4 // going off Amazon ratings for now
  },
  {
    id: '100007',
    name: 'Hill\'s Science Diet Dry Dog Food, Puppy, Small Paws for Small Breeds, Chicken Meal, Barley & Brown Rice Recipe',
    img: 'https://images-na.ssl-images-amazon.com/images/I/81qqrdewZlL._SL1500_.jpg',
    price: 30.99,
    weight: 252.8,
    // price: 42.99,
    // weight: 95,
    organicCertified: false,
    locallyGrown: false,
    ingredientQuality: 4 // going off Amazon ratings for now
  },
  {
    id: '100008',
    name: 'ORIJEN Dry Dog Food, Puppy, Biologically Appropriate & Grain Free',
    img: 'https://petco.scene7.com/is/image/PETCO/2992437-center-1?$ProductDetail-large$',
    price: 93.99,
    weight: 411.2,
    // price: 29.99,
    // weight: 93,
    organicCertified: true,
    locallyGrown: false,
    ingredientQuality: 4 // going off Amazon ratings for now
  },
  {
    id: '100009',
    name: 'Bravo! Homestyle Complete Beef Dinner Grain-Free Freeze-Dried Dog Food',
    img: 'https://img.chewy.com/is/catalog/80120_MAIN._AC_SL1500_V1477926711_.jpg',
    price: 109.4,
    weight: 96,
    // price: 35.99,
    // weight: 90,
    organicCertified: true,
    locallyGrown: false,
    ingredientQuality: 4 // going off Amazon ratings for now
  },
  {
    id: '100010',
    name: 'KASIKS Wild Pacific Ocean Fish Meal Formula Grain-Free Dry Dog Food',
    img: 'https://img.chewy.com/is/image/catalog/88481_MAIN._AC_SL400_V1525875523_.jpg',
    price: 57.74,
    weight: 400,
    // price: 28.99,
    // weight: 78,
    organicCertified: true,
    locallyGrown: false,
    ingredientQuality: 4 // going off Amazon ratings for now
  },
  {
    id: '100011',
    name: 'Kiwi Kitchens Air Dried Beef Dog Food',
    img: 'https://www.petfoodreviews.com.au/wp-content/uploads/2018/10/Kiwi-Kitchens-Air-Dried-Chicken-Dog-Food.jpg',
    price: 69.99,
    weight: 70.4,
    // price: 27.99,
    // weight: 83,
    organicCertified: true,
    locallyGrown: false,
    ingredientQuality: 4 // going off Amazon ratings for now
  },
  {
    id: '100012',
    name: 'K9 Natural Lamb Feast Raw Freeze-Dried Dog Food',
    img: 'https://images-na.ssl-images-amazon.com/images/I/71XUjPr%2BzzL._SY679_.jpg',
    price: 205.99,
    weight: 512,
    // price: 26.99,
    // weight: 83,
    organicCertified: true,
    locallyGrown: false,
    ingredientQuality: 4 // going off Amazon ratings for now
  }
];

export function getAvgPricePerOz(): number {
  let sum: number = 0;
  FOOD_INVENTORY.forEach((item: Food) => {
    sum += (item.price / item.weight);
  });
  return sum / FOOD_INVENTORY.length;
}

export function getPricePerOz(): number[] {
  return FOOD_INVENTORY.map((item: Food) => {
    return item.price / item.weight
  });
}

export function getMinMaxPricePerOz(): {min: number; max: number;} {
  const pricePerOzs: number[] = getPricePerOz();
  return {
    min: Math.min(...pricePerOzs),
    max: Math.max(...pricePerOzs)
  };
}