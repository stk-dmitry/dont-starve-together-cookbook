import { defineStore } from 'pinia';
import { orderBy, union } from 'lodash-es';

import { IUIState } from '@/store/ui/types';
import recipes from '@/constants/recipes';
import { IFood } from '@/models/recipes';
import { arrayToggle } from '@/helpers/utiity';

export const uiStore = defineStore('ui', {
  state: (): IUIState => ({
    search: '',
    isVegetable: false,
    isWarlySpecific: false,
    ingredients: [],
    order: ['asc', 'name'],
    characters: [],
  }),
  getters: {
    recipes(state) {
      let filtered = recipes;
      if (state.search) {
        filtered = filtered.filter(q => new RegExp(state.search, 'i').test(q.name));
      }
      if (state.isVegetable) {
        filtered = filtered.filter(q => q.isVegetable);
      }
      if (state.isWarlySpecific) {
        filtered = filtered.filter(q => q.isWarlySpecific);
      }
      if (state.characters.length) {
        filtered = filtered.filter(q => q.charactersLove && state.characters.includes(q.charactersLove));
      }
      if (state.ingredients.length) {
        filtered = filtered.filter(q =>  {
          const ingredients = union(...q.ingredients);
          return !!ingredients.find(d => state.ingredients.includes(d));
        });
      }
      return orderBy(filtered, state.order[1], state.order[0]);
    }
  },
  actions: {
    setOrder(value: string) {
      const split = value.split(',');
      this.order = [split[0] as 'asc'|'desc', split[1]];
    },
    onSelectCharacter(character: string) {
      this.characters = arrayToggle(this.characters, character);
    },
    onSelectIngredients(food: IFood) {
      this.ingredients = arrayToggle(this.ingredients, food.foodId);
    }
  }
});
