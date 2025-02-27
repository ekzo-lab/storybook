import { StoryFn } from '@storybook/addons';
import { withActions } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { StoryFnAureliaReturnType } from '@storybook/aurelia';

export default {
  title: 'Link/Basic',
  decorators: [withActions],
};

export const customCoolButtonTest: StoryFn<Partial<StoryFnAureliaReturnType>> = () => ({
  template: `<button class="btn btn-outline-dark" click.delegate="buttonLink()">GO TO BUTTONS</button>`,
  state: {
    buttonLink: linkTo('Custom|Custom Elements', 'Auto Generate Knobs Story'),
  },
});
