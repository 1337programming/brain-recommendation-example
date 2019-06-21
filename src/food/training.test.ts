import { Profile } from '../profile';
import { Food } from './food';
import { FOOD_INVENTORY } from './inventory';
import { scoreAlgorithm } from './training';
import { FoodConfig, WeightModel } from './config';

// min, max of ppo (price per oz)
let min: number = Infinity;
let max: number = -Infinity;
let minRef: number = -1;
let maxRef: number = -1;
let ppo;
FOOD_INVENTORY.forEach((item: Food, index: number) => {
  ppo = item.price/item.weight;
  if (!min && !max) {
    min = max = ppo;
  }
  if (ppo > max) {
    max = ppo;
    maxRef = index;
  }
  if (min > ppo) {
    min = ppo;
    minRef = index;
  }
});

const cheapestItem: Food = FOOD_INVENTORY[minRef];
const expensiveItem: Food = FOOD_INVENTORY[maxRef];

test('Check if cheapest item is scored ', () => {
  const cheapProfile: Profile = {
    budgetRating: 1,
    preferLocal: false,
    preferOrganic: false
  };

  const weights: WeightModel = {
    organic: 0.25,
    localBiz: 0.25,
    price: 0.25,
    quality: 0.25,
  };

  /**
   * a + b + c + d = 100% if (a, b) = true
   * in this case (a,b) = false
   * c + d = 100%
   *
   * Assuming quality is fixed at 4 each, making each item score 8/10 = d
   * Assuming weights are the same (25% each)
   * weights (a,b) are out, making (c,d) = 50% each
   * For cheapest item we should expect a 10/10 on price, since we are basing it off the item
   *
   *    However because we have a budget rating of 1, the weight of price increases by 10% (c increases by 10%)
   *    But the weights must all sum to 100%, so we must distribute the weights accordingly.
   *    So:
   *      c + d = 100% --> 50% + 50% = 100%
   *    Becomes:
   *      c + d = 100% --> 60% + 40% = 100%
   *
   * The score should be as followed:
   *
   *    c_Score = 100%, d_Score = 80%
   *
   *    SCORE = ((c * c_Score) + (d * d_Score)) * SCORE_MAG --> SCORE_MAG or range to get point score out of a 0-10 scale
   */

  const mockScore = ((0.6 * 1) + (0.4 * 0.8)) * FoodConfig.MAX_SCORE; // @TODO a
  const cheapItemScore = scoreAlgorithm(cheapestItem, cheapProfile, {...weights});
  const expensiveItemScore = scoreAlgorithm(expensiveItem, cheapProfile, {...weights});
  console.log('Score:', cheapItemScore.output.wanted);
  console.log('Mock:', mockScore);

  expect(cheapItemScore.output.wanted).toBe(mockScore);
  expect(cheapItemScore.output.wanted).toBeGreaterThan(expensiveItemScore.output.wanted);

});
