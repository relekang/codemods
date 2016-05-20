import microComponentCreator from './micro_component_creator';

export const SomeForm = microComponentCreator('SomeForm', props => (
  <form>
    <input name='field' value={props.value} />
  </form>
));
