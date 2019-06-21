import { Food, FoodModel } from './food';
import { UIController } from './ui';
import { Profile } from './profile';
import { FOOD_INVENTORY } from './food/inventory';

const ui: UIController = new UIController();
const model: FoodModel = new FoodModel();
const $notifications = $('#notifications');

// Handle Train Click Button
$('#train').on('click', async function () {
  const progressBar: string = `
    <div class="progress progress-striped active">
        <div class="progress-bar progress-bar-striped progress-bar-success bg-info" style="width:0%">
            Loading...
        </div>
    </div>
  `;
  $notifications.append(progressBar);
  const $progressBar = $('.progress-bar');
  let value: number = 0;
  const state = await model.train(20000, (state) => {
    value = Math.floor((state.iterations / state.totalIterations) * 100);
    console.log('Training Status', value, state.iterations, state);
    $progressBar.attr('value', value).width(`${value}%`).text(`Training (${value}%)`);
  });
  $progressBar.hide(1000);
  $notifications.empty();
  console.log('Training Done', state);
  model.save();
});

model.ready().subscribe((ready: boolean) => {
  ui.disabledDispatcher.next(!ready);
});

ui.onProfileChange().subscribe((profile: Profile) => {
  if (model.readyDispatcher.getValue()) {
    FOOD_INVENTORY.forEach((item: Food) => {
      const output: number[] = model.run({
        pricePerOz: item.price / item.weight,
        organicCertified: item.organicCertified,
        locallyGrown: item.locallyGrown,
        ingredientQuality: item.ingredientQuality,
        budgetRating: profile.budgetRating,
        organicPreferred: profile.preferOrganic,
        localPreferred: profile.preferLocal
      });
      ui.updateRank(item.id, output[0]);
    });
    console.log(ui.getSortedItems());
  }
});
