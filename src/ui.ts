import { Profile } from './profile';
import { BehaviorSubject, Observable } from 'rxjs/index';
import { Food, FoodOutput } from './food';
import { FOOD_INVENTORY } from './food/inventory';

import './public/index.css';

interface FoodScored extends Food, FoodOutput {

}

export class UIController {

  public disabledDispatcher: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private items: FoodScored[] = [];

  private profileDispatcher: BehaviorSubject<Profile> = new BehaviorSubject<Profile>({
    budgetRating: 1,
    preferLocal: false,
    preferOrganic: false
  });

  constructor() {
    this.events();
    this.items = FOOD_INVENTORY.map((item: Food) => {
      return {...item, wanted: 0};
    });
    this.disabledDispatcher.subscribe((val: boolean) => {
      if (val) {
        $('#budget-selector').find('button').attr('disabled','disabled');
        $('#organic').attr('disabled','disabled');
        $('#local').attr('disabled','disabled');
      } else {
        $('#budget-selector').find('button').removeAttr('disabled');
        $('#organic').removeAttr('disabled');
        $('#local').removeAttr('disabled');
      }
    });
  }

  public onProfileChange(): Observable<Profile> {
    return this.profileDispatcher.asObservable();
  }

  private events(): void {
    this.profileDispatcher.subscribe((profile: Profile) => {
      this.renderItems();
    });

    const that: UIController = this;
    $('#budget-selector').find('button').on('click', function () {
      const profile: Profile = that.profileDispatcher.getValue();
      $(this).addClass('active').siblings().removeClass('active');
      switch (this.textContent) {
        case '$':
          profile.budgetRating = 1;
          break;
        case '$$':
          profile.budgetRating = 2;
          break;
        case '$$$':
          profile.budgetRating = 3;
          break;
        default:
          break;
      }
      that.profileDispatcher.next(profile);
    });

    $('#organic').on('change', function () {
      const profile: Profile = that.profileDispatcher.getValue();
      profile.preferOrganic = (this as HTMLInputElement).checked;
      that.profileDispatcher.next(profile);
    });

    $('#local').on('change', function () {
      const profile: Profile = that.profileDispatcher.getValue();
      profile.preferLocal = (this as HTMLInputElement).checked;
      that.profileDispatcher.next(profile);
    });
  }

  public updateRank(id: string, score: number): void {
    this.items.forEach((item: FoodScored) => {
      if (item.id === id) {
        item.wanted = score;
      }
    });
    this.renderItems();
  }

  public getSortedItems(): FoodScored[] {
    return this.items.sort((a: FoodScored, b: FoodScored) => {
      return b.wanted - a.wanted;
    });
  }

  private renderItems(): void {
    let list: string = '';
    this.getSortedItems().forEach((item: FoodScored, index: number) => {
      list += `
        <li class="list-group-item filter-user container" data-name="${item.name}">
            <div class="row">
                <div class="media col-sm-3">
                        <img src="${item.img}" class="img-circle img-thumbnail">
                </div>
                <div class="col-sm-6">
                    <p class="text-center">${item.name}</p>
                </div>
                <div class="col-sm-3 text-center">
                    <span class="badge badge-light">${index + 1}</span>
                    <span class="price">$${item.price}</span>
                    <span class="weight">${item.weight}Oz</span>
                </div>
            </div>
        </li>
      `;
    });
    $('#recommendations').empty().append(list);
  }
}

