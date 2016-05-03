/* global something, value */
import If from 'if_component';

export default () => (
  <If condition={something === 'something'}>
    <div>
      <If condition={something === 'something'}>
        <div className="s">
          <div>wat.</div>
        </div>
      </If>
      <If condition={something === 'something'}>
        {value}
      </If>
    </div>
  </If>
);
