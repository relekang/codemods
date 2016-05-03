/* global something, value */
export default () => (
  <span>
    {something === 'something' &&
      <div>
        {something === 'something' &&
          <div className="s">
            <div>wat.</div>
          </div>
        }
        {something === 'something' && value}
      </div>
    }
  </span>
);
