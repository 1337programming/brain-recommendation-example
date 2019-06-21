import * as brain from 'brain.js';
import { FoodInput, FoodTrainingFeed, generateTrainingData } from './training';
import { generateProfiles, Profile } from '../profile';
import { FOOD_INVENTORY } from './inventory';
import { INeuralNetworkState } from 'brain.js';
import { INeuralNetworkTrainingData } from 'brain.js';
import { INeuralNetworkJSON } from 'brain.js';
import { BehaviorSubject, Observable } from 'rxjs/index';
import { isBrowser } from '../util';

export class FoodModel {

  public readyDispatcher: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); // @TODO make private
  private net: brain.NeuralNetwork;

  constructor() {
    const config: brain.INeuralNetworkOptions = {
      binaryThresh: 0.5,
      hiddenLayers: [3, 3, 3, 3, 4, 3, 4, 3, 4],
      activation: 'sigmoid',
      leakyReluAlpha: 0.01
    };

    this.net = new brain.NeuralNetwork(config);
    if (isBrowser) {
      const cache: string | null = window.localStorage.getItem('trainingData');
      if (cache) {
        this.net.fromJSON(JSON.parse(cache));
        this.readyDispatcher.next(true);
      }
    }
  }

  public train(iterations: number = 20000, callback?: (state: INeuralNetworkState & { totalIterations: number }) => void): Promise<INeuralNetworkState> {
    const profiles: Profile[] = generateProfiles(25);
    const trainingDataFull: FoodTrainingFeed[] = generateTrainingData(profiles, FOOD_INVENTORY);
    // Normalize, document order @TODO
    const trainingData: INeuralNetworkTrainingData[] = trainingDataFull.map((data: FoodTrainingFeed) => {
      return {
        input: [
          data.input.pricePerOz,
          Number(data.input.organicCertified),
          Number(data.input.locallyGrown),
          data.input.ingredientQuality,
          data.input.budgetRating,
          Number(data.input.organicPreferred),
          Number(data.input.localPreferred)
        ],
        output: [data.output.wanted]
      }
    });

    return this.net.trainAsync<INeuralNetworkTrainingData[]>(trainingData, {
      iterations: iterations,
      callbackPeriod: 100,
      callback: (state: INeuralNetworkState) => {
        if (callback) {
          callback({...state, totalIterations: iterations});
        }
        this.readyDispatcher.next(true);
      }
    });
  }

  public run(data: FoodInput): number[] {
    if (this.readyDispatcher.getValue()) {
      return this.net.run<number[], number[]>(
        [
          data.pricePerOz,
          Number(data.organicCertified),
          Number(data.locallyGrown),
          data.ingredientQuality,
          data.budgetRating,
          Number(data.organicPreferred),
          Number(data.localPreferred)
        ]
      );
    } else {
      throw new Error('Model is not ready');
    }
  }

  public ready(): Observable<boolean> {
    return this.readyDispatcher.asObservable();
  }

  public save(): INeuralNetworkJSON {
    if (isBrowser) {
      window.localStorage.setItem('trainingData', JSON.stringify(this.net.toJSON()));
    } else {
      console.warn('Not in a browser runtime, returning JSON');
    }
    return this.net.toJSON();
  }
}

