import { Profile } from './profile';
import { RAND } from '../util';

export function generateProfiles(num = 100): Profile[] {
  const profiles: Profile[] = [];
  for (let i: number = 0; i < num; i++) {
    profiles.push({
      budgetRating: RAND(1, 3) as 1 | 2 | 3,
      preferLocal: !!RAND(0, 1),
      preferOrganic: !!RAND(0, 1)
    });
  }
  return profiles;
}

