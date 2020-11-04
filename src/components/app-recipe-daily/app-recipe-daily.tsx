import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'app-recipe-daily',
  styleUrl: 'app-recipe-daily.css'
})
export class AppRecipeDaily {
  @Prop() name: string;
  @Prop() calories: number;
  @Prop() image: string;

  render() {
    return (
      <Host>
        <ion-item>
          <ion-thumbnail slot="start">
            <ion-img src={this.image} ></ion-img>
          </ion-thumbnail>
          <ion-grid>
            <ion-row>
              <ion-label>
                {this.name}
                <br />
                {this.calories} calories
                <slot name="category"></slot>
              </ion-label>
            </ion-row>
            <ion-row>
              <ion-label><slot name="ratings"></slot></ion-label>
            </ion-row>
            <ion-row>
              <div><slot name="buttons"></slot></div>
            </ion-row>
          </ion-grid>
        </ion-item>
      </Host>
    );
  }

}
