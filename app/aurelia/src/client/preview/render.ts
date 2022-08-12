import type { RenderContext } from '@storybook/store';
import { Aurelia, CustomElement, Constructable, ICustomElementViewModel } from 'aurelia';
import { AureliaFramework } from './types';

let previousAurelia: Aurelia;
export async function renderToDOM(
  {
    storyFn,
    kind,
    name,
    showMain,
    showError,
    forceRemount,
    storyContext: { parameters, component },
  }: RenderContext<AureliaFramework>,
  domElement: HTMLElement
) {
  const story = storyFn();

  if (!story) {
    showError({
      title: `Expecting an Aurelia component from the story: "${name}" of "${kind}".`,
      description: `
        Did you forget to return the Aurelia component from the story?
        Use "() => ({ template: '<custom-component></custom-component>' })" when defining the story.
      `,
    });
  }
  showMain();
  console.log(previousAurelia, story);
  if (previousAurelia) {
    await previousAurelia.stop();
  }

  previousAurelia = new Aurelia(story.container);
  if (story.items && story.items.length > 0) {
    previousAurelia.register(...story.items);
  }

  if (story.components && story.components.length > 0) {
    previousAurelia.container.register(...story.components);
  }

  let { template } = story;
  if (component) {
    const def = CustomElement.getDefinition(component);
    const innerHtml = story.props.innerHtml ?? '';
    template =
      template ??
      `<${def.name} ${Object.values(def.bindables)
        .map((bindable) => `${bindable.attribute}.bind="${bindable.property}"`)
        .join(' ')}>${innerHtml}</${def.name}>`;
    previousAurelia.register(component);
  }
  console.log(parameters.args, story.props);
  const App = CustomElement.define({ name: 'sb-app', template }, class {});

  const app = Object.assign(new App(), { ...parameters.args, ...story.props });

  await previousAurelia
    .app({
      host: domElement,
      component: app,
    })
    .start();
}
