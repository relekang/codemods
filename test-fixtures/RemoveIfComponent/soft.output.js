/* global something */
import If from 'if_component';

export default () => (
  <div>
    <If soft condition={something === 'something'}>
      <div className="s">
        <div>wat.</div>
      </div>
    </If>
    {something === 'something' &&
      <div className="s">
        <div>wat.</div>
      </div>
    }
  </div>
);
