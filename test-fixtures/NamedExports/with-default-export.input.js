export default {
  name: 'Some name',

  getName() {
    return 'Some name';
  },

  add: (n1, n2) => n1 + n2,

  setPostalArea: Promise.method(() => this),

  obj: {
    value: 42,
  },
};
