import _ from "lodash";

_.map([1,2,3,4], item => 2^item)

_([[1,2,3,4]])
  .map(item => item * 2)
  .value();
