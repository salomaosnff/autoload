const path = require('path');

// É Object?
const isObject = item => {
    return item && typeof item === 'object' && !Array.isArray(item);
};

// Deep Merge
const deepMerge = (target, source) => {
    const output = Object.assign({}, target);

    if(isObject(target) && isObject(source)){
        Object.keys(source).forEach(key => {
            if(isObject(source[key])){
                if(!(key in target)) Object.assign(output, {[key]: source[key]});
                else output[key] = deepMerge(target[key], source[key]);
            } else  Object.assign(output, { [key]: source[key] })
        });
    }
    return output;
};

// Path -> Object
const path2Obj = (entity, val) => {
    val = val === null ? {} : val;

    const
        obj = {},
        props = entity.split(path.sep).filter(Boolean);

    let prop, tmp = obj;

    while(prop = props.shift())
        tmp = props.length <= 0 ? tmp[prop] = val : tmp[prop] = {};

    return obj;
};

// obtêm somente as pastas principais do path
const path_base = (base, path_string) => {

    // Substitui
    return path_string.substr(base.length + 1).replace(/^[\/\\]/,"");
};

module.exports = { isObject, deepMerge, path2Obj, path_base };