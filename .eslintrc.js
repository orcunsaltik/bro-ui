module.exports = {
    'env': {
        browser: true,
            es6: true
    },
    'extends': [
        'airbnb-base'
    ],
    'parserOptions': {
        ecmaVersion: 2018,
         sourceType: 'module'
    },
    'rules': {
        'comma-dangle':         [2, 'never'],
        'import/no-unresolved': [2, {ignore: ['Bro']}],
        'no-cond-assign':       [2, 'except-parens'],
        'indent':               0,
        'no-continue':          0,
        'no-multi-spaces':      0,
        'no-nested-ternary':    0,
        'no-param-reassign':    0,
        'no-trailing-spaces':   0,
        'no-underscore-dangle': 0,
        'prefer-destructuring': 0,
        'no-bitwise':           0,
        'func-names':           0,
        'padded-blocks':        0,
        'prefer-rest-params':   0
    }
};
