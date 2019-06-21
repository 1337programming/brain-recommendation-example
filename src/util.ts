/**
 * Gets a random number inclusively
 * @param {number} min
 * @param {number} max
 * @return {number}
 * @constructor
 */
export function RAND(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const isBrowser: boolean = typeof window !== 'undefined' && typeof window.document !== 'undefined';

export const isWebWorker: boolean =
  typeof self === 'object' &&
  self.constructor &&
  self.constructor.name === 'DedicatedWorkerGlobalScope';

export  const isNode: boolean =
  typeof process !== 'undefined' &&
  process.versions != null &&
  process.versions.node != null;

