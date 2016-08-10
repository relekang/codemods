module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);
  const removalProperty = [];

  function convertNumeric(properties) {
    return j.objectExpression(properties.map(p => {
      switch (p.key.name) {
        case 'greaterThanOrEqualTo':
          return j.property('init', j.identifier('min'), p.value);

        case 'lessThanOrEqualTo':
          return j.property('init', j.identifier('max'), p.value);

        case 'onlyInteger':
          return j.property('init', j.identifier('integerOnly'), p.value);

        default:
          return p;
      }
    }));
  }

  function convertCustom(config) {
    function stripValidate(_name) {
      name = _name.replace('validate', '');
      return name.slice(0, 1).toLowerCase() + name.slice(1);
    }

    function extract(_config) {
      let name;
      switch (_config.type) {
        case 'Identifier':
          return [stripValidate(_config.name), j.literal(true)];

        case 'CallExpression':
          name = _config.callee.property.name === 'bind' ?
            _config.callee.object.name || _config.callee.object.property.name :
            _config.callee.property.name;
          return [stripValidate(name), j.literal(true), _config.arguments];

        default:
          console.log(_config.type);
          return ['custom', _config];
      }
    }

    let [id, value, args] = extract(config); // eslint-disable-line prefer-const

    if (args) {
      if (args.length === 1 && args[0].type === 'ThisExpression') {
        args = j.literal(true);
      } else {
        args = j.arrayExpression(args);
      }
    }
    return j.property('init', j.identifier(id), args || value);
  }

  function convertLength(properties) {
    return j.objectExpression(properties.map(p => {
      switch (p.key.name) {
        case 'minimum':
          return j.property('init', j.identifier('min'), p.value);

        case 'maximum':
          return j.property('init', j.identifier('max'), p.value);

        default:
          return p;
      }
    }));
  }

  function convertIf(p) {
    const type = j.CallExpression;

    if ( // it is a if statement that checks if field is visible
      j(p).find(type, { callee: { property: { name: 'getVisibleFields' } } }).size() ||
      j(p).find(type, { callee: { property: { name: 'isFieldVisible' } } }).size() ||
      j(p).find(type, { callee: { object: { property: { name: 'isFieldVisible' } } } }).size()
    ) {
      removalProperty.push(p);
    }
    return p;
  }

  function createFieldConfig(config) {
    return config.properties.map(p => {
      switch (p.key.name) {
        case 'presence':
          return j.property('init', j.identifier('required'), p.value);

        case 'numericality':
          return j.property('init', j.identifier('numeric'), convertNumeric(p.value.properties));

        case 'length':
          return j.property('init', j.identifier('length'), convertLength(p.value.properties));

        case 'custom':
          return convertCustom(p.value);

        case 'if':
          return convertIf(p);

        case 'path':
          removalProperty.push(p);
          return p;

        case 'allowBlank':
          removalProperty.push(p);
          return p;

        default:
          return p;
      }
    });
  }

  function readOldConfig(node) {
    const config = {};
    j(node)
        .find(j.CallExpression, { callee: { name: 'addValidation' } })
        .forEach(n => {
          const args = n.value.arguments;
          if (config.hasOwnProperty(args[0].value)) {
            config[args[0].value] = j.objectExpression([
              ...config[args[0].value].properties,
              ...createFieldConfig(args[1]),
            ]);
          } else {
            config[args[0].value] = j.objectExpression(createFieldConfig(args[1]));
          }
        });
    return config;
  }

  function createConfigProperties(config) {
    return Object.keys(config).map(key =>
      j.property('init', key.indexOf('.') !== -1 ? j.literal(key) : j.identifier(key), config[key])
    );
  }

  function replaceNewExpression(node) {
    const oldConfig = readOldConfig(node);
    const config = j.objectExpression(createConfigProperties(oldConfig));
    return j.newExpression(j.identifier('Validator'), [config]);
  }

  function replaceValidateFunction(node) {
    return j.callExpression(node.callee, [
      j.callExpression(
        j.memberExpression(j.thisExpression(), j.identifier('getFieldsToValidate')),
        []
      ),
      j.callExpression(
        j.memberExpression(j.thisExpression(), j.identifier('getFormData')),
        []
      ),
    ]);
  }

  root
    .find(j.ImportDefaultSpecifier, { local: { name: 'ValidatorFactory' } })
    .map(p => p.parentPath.parentPath)
    .replaceWith(() =>
      j.importDeclaration(
        [j.importDefaultSpecifier(j.identifier('Validator'))],
        j.literal('common/src/validators')
      )
    );

  root
   .find(j.NewExpression, { callee: { name: 'ValidatorFactory' } })
   .replaceWith(p => replaceNewExpression(p));

  root
    .find(j.CallExpression, { callee: { property: { name: 'validate' } } })
    .replaceWith(p => replaceValidateFunction(p.value));

  removalProperty.forEach(item => {
    root.find(j.Property, { start: item.start }).remove();
  });

  return root.toSource();
};
