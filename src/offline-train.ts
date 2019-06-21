// This script will run and save a training run time file

import { FoodModel } from './food';
import * as fs from 'fs';

const model: FoodModel = new FoodModel();

// Handle Train Click Button
async function train() {
  let value: number = 0;
  const state = await model.train(20000, (state) => {
    value = Math.floor((state.iterations / state.totalIterations) * 100);
    console.log('Training Status', `${value}%`, state.iterations, state);
  });
  console.log('Training Done', state);
  fs.writeFileSync(`training.json`, JSON.stringify(model.save(), null, 4));
}

train()
  .then(() => {
    console.log('Complete');
  })
  .catch((err: Error) => {
    console.error(err);
  });

