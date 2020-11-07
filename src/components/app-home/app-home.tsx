import { Component, h, Host, State } from "@stencil/core";
import { calculateMacros, dateToString, goToRecipeInfo } from "../../helpers/utils";
import { IDaily, IRecipe } from "../../interfaces";
import { getTodayDaily } from "../../services/daily.tracker.service";
import { removeMealFromDaily } from "../../services/local.db";

@Component({
  tag: "app-home",
  styleUrl: "app-home.css"
})
export class AppHome {

  @State() daily: IDaily;
  @State() pastDailyEntries: IDaily[];
  @State() dailyCalories;
  @State() dailyFat;
  @State() dailyProtein;
  @State() dailyCarbs;
  today: number
  pastDate: number;
  dates: number[];
  scrollTopMax: number;
  timeout: NodeJS.Timeout;

  ionNavEvent() {
    document.querySelector('ion-nav')
      .addEventListener('ionNavWillChange', () => {
        this.getDailyEntry(this.daily.date);
      });
  }

  componentWillLoad() {
    this.today = new Date().valueOf();
    this.refreshDailyData({ date: this.today, meals: [] });
    this.pastDate = this.today;
    this.pastDailyEntries = [];
    this.dates = [];
    this.getDailyEntry(this.daily.date);
  }

  async componentDidLoad() {
    this.ionNavEvent();
  }

  getToolbar() {
    return <ion-toolbar color="primary">
      <ion-searchbar onClick={() => this.goToRecipeList()}></ion-searchbar>
      <ion-buttons slot="end">
        <ion-button href="/user/profile">
          <ion-icon slot="icon-only" name="ellipsis-vertical-outline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  }

  async getDailyEntry(date: number) {
    try {
      const result = await getTodayDaily(date);
      clearTimeout(this.timeout);
      if (result) {
        this.refreshDailyData(result);
      }
    } catch (error) {
      this.timeout = setTimeout(() => this.getDailyEntry(date), 1000);
    }
  };

  generatePastDate() {
    let pastDate = new Date(this.pastDate);
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const date = new Date(`${pastDate.getMonth() + 1}/${pastDate.getDate() - 1}/${pastDate.getFullYear()}`);
    if (isNaN(date.getDate())) {
      let month = 0;
      if (pastDate.getMonth() !== 0) {
        month = pastDate.getMonth();
      } else {
        month = 12;
      }
      const lastDayOfTheMonth = daysInMonth[month - 1];
      this.pastDate = new Date(`${month}/${lastDayOfTheMonth}/${pastDate.getFullYear()}`).valueOf();
    } else {
      this.pastDate = date.valueOf();
    }
  }

  async getPastDailyEntries() {
    //TODO: Query past daily entries by dates
    //TODO: GetPastDailyEntries(this.pastDate)
    //TODO: Limit it to per database not a FOR condition
    for (let i = 0; i < 10; i++) {
      this.generatePastDate();
      try {
        const result = await getTodayDaily(this.pastDate);
        clearTimeout(this.timeout);
        if (result) {
          this.pastDailyEntries = [...this.pastDailyEntries, result];
        }
      } catch (error) {
        this.timeout = setTimeout(() => this.getPastDailyEntries(), 1000);
      }
    };
  }

  goToRecipeList() {
    const router = document.querySelector('ion-router');
    if (router)
      router.push('/recipe/list', 'forward');
    return false;
  }

  async getDailyPastEntries(ev: CustomEvent<import("@ionic/core").ScrollDetail>) {
    const content = document.querySelector<HTMLIonContentElement>('#home-content');
    const scroll = await content.getScrollElement();
    this.scrollTopMax = scroll['scrollTopMax'];

    if ((ev.detail.currentY == this.scrollTopMax)) {
      this.getPastDailyEntries();
    }
  }

  removeMeal(meal: IRecipe): void {
    try {
      const data = removeMealFromDaily({ meal: meal, date: this.today });
      this.refreshDailyData(data);
    } catch (error) {
      console.error(error);
    }
  }

  refreshDailyData(data) {
    this.daily = {
      ...data
    }
    if (this.daily.meals.length > 0) {
      const macros = calculateMacros(this.daily.meals);
      this.dailyCalories = macros.dailyCalories;
      this.dailyCarbs = macros.dailyCarbs;
      this.dailyFat = macros.dailyFat;
      this.dailyProtein = macros.dailyProtein;
    } else {
      this.dailyCalories = 0;
      this.dailyCarbs = 0;
      this.dailyFat = 0;
      this.dailyProtein = 0;
    }
  }

  render() {
    return (
      <Host>
        <ion-header>
          {
            navigator.userAgent.match('iPhone') || navigator.userAgent.match('Android')
              ? ''
              : this.getToolbar()
          }
        </ion-header>
        <ion-content scrollEvents={true} onIonScroll={(ev => this.getDailyPastEntries(ev))} id="home-content" class="ion-padding">
          <img src="/assets/images/stick guy.png" />
          <h2>Today</h2>
          <h3>{this.dailyCalories} calories</h3>
          <ion-list lines="none">
            <ion-item-group>
              <ion-item-divider color="secondary">
                <ion-label>MacroNutrients</ion-label>
              </ion-item-divider>
              <ion-item>
                <ion-label>{this.dailyCarbs}% carbs</ion-label>
              </ion-item>
              <ion-item>
                <ion-label>{this.dailyProtein}% protein</ion-label>
              </ion-item>
              <ion-item>
                <ion-label>{this.dailyFat}% fat</ion-label>
              </ion-item>
            </ion-item-group>
            <ion-item-group>
              <ion-item-divider color="tertiary">
                <ion-label>Meals:</ion-label>
              </ion-item-divider>
              {
                this.daily.meals.map(meal =>
                  <app-recipe-daily
                    // onClick={() => goToRecipeInfo(meal.name)}
                    name={meal.name}
                    calories={meal.calories}
                    image={meal.image}
                  >
                    <ion-button slot="buttons" fill="outline" onClick={() => this.removeMeal(meal)}>
                      <ion-icon slot="icon-only" name="remove"></ion-icon>
                    </ion-button>
                    <ion-button slot="buttons" fill="outline" onClick={() => goToRecipeInfo(meal.name)}>
                      <ion-icon slot="icon-only" name="information-outline"></ion-icon>
                    </ion-button>
                  </app-recipe-daily>
                )
              }
            </ion-item-group>
            {
              this.pastDailyEntries.length > 0
                ? <ion-item-group>
                  <ion-item-divider color="medium">
                    <ion-label>This week:</ion-label>
                  </ion-item-divider>
                  {
                    this.pastDailyEntries.map((daily, i) =>
                      <div>
                        <div class="ion-text-end">
                          <h6>{calculateMacros(daily.meals).dailyCalories} calories in {dateToString(new Date(daily.date))}</h6>
                        </div>
                        {
                          daily.meals.map(meal =>
                            <app-recipe-daily
                              name={meal.name}
                              calories={meal.calories}
                              image={meal.image}
                            // onClick={() => goToRecipeInfo(meal.name)}
                            >
                            </app-recipe-daily>
                          )
                        }
                      </div>
                    )
                  }
                </ion-item-group>
                : ''
            }
          </ion-list>
        </ion-content>
        <ion-footer>
          {
            navigator.userAgent.match('iPhone') || navigator.userAgent.match('Android')
              ? this.getToolbar()
              : ''
          }
        </ion-footer>
      </Host>
    )
  }
}
