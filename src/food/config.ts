export type WeightKey = 'organic' | 'localBiz' | 'price' | 'quality';

export const WEIGHT_DEFAULTS: WeightModel = {
  'organic': 0.25,
  'localBiz': 0.25,
  'price': 0.25,
  'quality': 0.25
};

export class FoodConfig {

  public static MAX_SCORE: number = 10;
  public weights: WeightModel;

  constructor(weights: WeightModel = {...WEIGHT_DEFAULTS}) {
    this.weights = {...weights};
    this.checkSum();
  }

  public deallocateWeight(key: WeightKey): void {
    if ((this.weights as Object).hasOwnProperty(key)) {
      const weight: number = this.weights[key];
      this.weights[key] = 0;
      if (weight === 0) {
        throw new Error(`Weight (${key}) already deallocated`);
      }
      const portion: number = weight / this.weightsAvailable();
      this.increaseAvailableWeights(portion);
    } else {
      throw new Error(`Key "${key}" is invalid`);
    }
  }

  public allocateWeight(key: WeightKey, percent: number): void {
    if ((this.weights as Object).hasOwnProperty(key)) {
      this.weights[key] = this.weights[key] + percent;
      const portion: number = percent / this.weightsAvailable([key]);
      this.increaseAvailableWeights(-portion, [key]);
    } else {
      throw new Error(`Key "${key}" is invalid`);
    }
  }

  public weightsAvailable(exceptions: WeightKey[] = []): number {
    let count: number = 0;
    if (this.weights.quality > 0 && exceptions.indexOf('quality') === -1) {
      count++;
    }
    if (this.weights.localBiz > 0 && exceptions.indexOf('localBiz') === -1) {
      count++;
    }
    if (this.weights.price > 0 && exceptions.indexOf('price') === -1) {
      count++;
    }
    if (this.weights.organic > 0 && exceptions.indexOf('organic') === -1) {
      count++;
    }
    return count;
  }

  private increaseAvailableWeights(amount: number, exceptions: WeightKey[] = []): void {
    if (this.weights.quality > 0 && exceptions.indexOf('quality') === -1) {
      this.weights.quality += amount;
    }
    if (this.weights.localBiz > 0 && exceptions.indexOf('localBiz') === -1) {
      this.weights.localBiz += amount;
    }
    if (this.weights.price > 0 && exceptions.indexOf('price') === -1) {
      this.weights.price += amount;
    }
    if (this.weights.organic > 0 && exceptions.indexOf('organic') === -1) {
      this.weights.organic += amount;
    }
    this.checkSum();
  }

  private checkSum(): void {
    const sum: number = this.weights.organic + this.weights.localBiz + this.weights.price + this.weights.quality;
    if (sum !== 1) {
      throw Error(`Weights must sum to 100%, got ${sum * 100}%, Weights: ${JSON.stringify(this.weights)}`);
    }
  }

}

export interface WeightModel {
  organic: number;
  localBiz: number;
  price: number;
  quality: number;
}