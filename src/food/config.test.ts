import { FoodConfig, WEIGHT_DEFAULTS } from './config';



test('Config allocation', () => {

  const config: FoodConfig = new FoodConfig();

  expect(config.weights.quality).toBe(WEIGHT_DEFAULTS.quality);
  expect(config.weights.localBiz).toBe(WEIGHT_DEFAULTS.localBiz);
  expect(config.weights.price).toBe(WEIGHT_DEFAULTS.price);
  expect(config.weights.organic).toBe(WEIGHT_DEFAULTS.organic);

  const x: number = 0.1;

  config.allocateWeight('price', x);
  expect(config.weightsAvailable()).toBe(4);
  expect(config.weightsAvailable(['price'])).toBe(3);
  // 3 = weights left (ignoring the allocated weight "price")
  console.log('X:', x, 'x/3', x/3, config.weights, WEIGHT_DEFAULTS);
  expect(config.weights.quality).toBe(WEIGHT_DEFAULTS.quality - (x / 3));
  expect(config.weights.localBiz).toBe(WEIGHT_DEFAULTS.localBiz - (x / 3));
  expect(config.weights.price).toBe(WEIGHT_DEFAULTS.price + x);
  expect(config.weights.organic).toBe(WEIGHT_DEFAULTS.organic - (x / 3));

});

test('Config deallocation', () => {

  const config: FoodConfig = new FoodConfig();

  expect(config.weights.quality).toBe(WEIGHT_DEFAULTS.quality);
  expect(config.weights.localBiz).toBe(WEIGHT_DEFAULTS.localBiz);
  expect(config.weights.price).toBe(WEIGHT_DEFAULTS.price);
  expect(config.weights.organic).toBe(WEIGHT_DEFAULTS.organic);

  config.deallocateWeight('organic');

  // 3 = weights left (organic removed 4-1 = 3)
  expect(config.weights.quality).toBe(WEIGHT_DEFAULTS.quality + (WEIGHT_DEFAULTS.organic/3));
  expect(config.weights.localBiz).toBe(WEIGHT_DEFAULTS.localBiz + (WEIGHT_DEFAULTS.organic/3));
  expect(config.weights.price).toBe(WEIGHT_DEFAULTS.price + (WEIGHT_DEFAULTS.organic/3));
  expect(config.weights.organic).toBe(0);


  config.deallocateWeight('localBiz');

  // 2 = weights left (organic removed 4-1 = 3)
  expect(config.weights.quality).toBe(WEIGHT_DEFAULTS.quality + ((WEIGHT_DEFAULTS.organic + WEIGHT_DEFAULTS.localBiz)/2));
  expect(config.weights.price).toBe(WEIGHT_DEFAULTS.price + ((WEIGHT_DEFAULTS.organic + WEIGHT_DEFAULTS.localBiz)/2));
  expect(config.weights.organic).toBe(0);
  expect(config.weights.localBiz).toBe(0);

});