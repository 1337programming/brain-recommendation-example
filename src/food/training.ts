import { Profile } from '../profile';
import { getAvgPricePerOz, getMinMaxPricePerOz } from './inventory';
import { Food } from './food';
import { FoodConfig, WEIGHT_DEFAULTS, WeightModel } from './config';

export interface FoodInput {
  pricePerOz: number;
  organicCertified: boolean;
  locallyGrown: boolean;
  ingredientQuality: number;
  budgetRating: number;
  organicPreferred: boolean;
  localPreferred: boolean;
}

export interface FoodOutput {
  wanted: number;
}

export interface FoodTrainingFeed {
  input: FoodInput,
  output: FoodOutput
}

const AVG_PRICE_PER_OZ: number = getAvgPricePerOz();
const MIN_MAX_PRICE_PER_OZ: { min: number; max: number } = getMinMaxPricePerOz();
const CONFIG = new FoodConfig(); // Model should instantiate this

/**
 * Organic Preference - 15%
 * Local Business Preference - 10%
 * Price - 45%
 * Quality - 40%
 * @TODO fix weights, for now assume weights are the same
 */


/**
 * Simple scoring algorithm to train data on
 * @param {FoodConfig} config
 * @param {Food} item
 * @param {Profile} profile
 * @return {INeuralNetworkTrainingData}
 */
export function scoreAlgorithm(item: Food, profile: Profile, weightOverride: WeightModel = WEIGHT_DEFAULTS): FoodTrainingFeed {
  const config: FoodConfig = new FoodConfig(weightOverride);
  let organicScore: number = 0;
  let localScore: number = 0;

  if (profile.preferOrganic) {
    if (item.organicCertified) {
      organicScore = 1; // 100%
    } else {
      organicScore = 0; // 0%
    }
  } else {
    // Allocate organic weights to the rest
    config.deallocateWeight('organic');
  }

  if (profile.preferLocal) {
    if (item.locallyGrown) {
      localScore = 1; // 100%
    } else {
      localScore = 0; // 0%
    }
  } else {
    config.deallocateWeight('localBiz');
  }

  const pricePerOz = item.price / item.weight; // assuming weight is in ounces
  // Savings on scale the smaller the profiles budget rating, the smaller the range

  // Increase weight of price if budget is low, but also increase maxScore to avoid over indexing
  switch (profile.budgetRating) {
    case 1:
      config.allocateWeight('price', 0.1);
      break;
    case 2:
      config.allocateWeight('price', 0.05);
      break;
    case 3:
      break;
    default:
      throw new Error(`profile.budgetRating: "${profile.budgetRating}" is not valid`);
  }

  let savingsScore: number = ((pricePerOz - MIN_MAX_PRICE_PER_OZ.max)) /
    (MIN_MAX_PRICE_PER_OZ.min - MIN_MAX_PRICE_PER_OZ.max); // Score based on range
  const qualityScore: number = (item.ingredientQuality * 2) / 10; // Conversion from 0-5 star rating to 0-100% scale (%

  if (savingsScore < 0 || qualityScore < 0 || localScore < 0 || organicScore < 0) {
    throw new Error(`Invalid scores, cannot be below 0%. 
    Savings Score: (${savingsScore}),
    Quality Score (${qualityScore}),
    Local Score (${localScore}),
    Organic Score (${organicScore})
    `);
  }

  if (savingsScore > 1 || qualityScore > 1 || localScore > 1 || organicScore > 1) {
    throw new Error(`Invalid scores, cannot be above 100%. 
    Savings Score: (${savingsScore}),
    Quality Score (${qualityScore}),
    Local Score (${localScore}),
    Organic Score (${organicScore})
    `);
  }

  const overallScore: number =
    ((localScore * config.weights.localBiz) +
      (organicScore * config.weights.organic) +
      (savingsScore * config.weights.price) +
      (qualityScore * config.weights.quality)) * FoodConfig.MAX_SCORE;

  if (overallScore > FoodConfig.MAX_SCORE) {
    throw new Error(`Invalid score: overall score (${overallScore}) 
    cannot be above max score (${FoodConfig.MAX_SCORE})`);
  }

  return {
    input: {
      pricePerOz: pricePerOz,
      organicCertified: item.organicCertified,
      locallyGrown: item.locallyGrown,
      ingredientQuality: item.ingredientQuality,
      budgetRating: profile.budgetRating,
      organicPreferred: profile.preferOrganic,
      localPreferred: profile.preferLocal
    }, output: {
      wanted: overallScore
    }
  };
}

export function generateTrainingData(profiles: Profile[], items: Food[]): FoodTrainingFeed[] {
  const data: FoodTrainingFeed[] = [];
  profiles.forEach((profile: Profile) => {
    items.forEach((item: Food) => {
      data.push(scoreAlgorithm(item, profile)); // @TODO
    });
  });
  return data;
}