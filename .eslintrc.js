module.exports = {
    "parser": "babel-eslint",
    "env": {
        "es6": true,
        "browser": true,
        "commonjs": true,
        "node": true
    },
    "globals": {
        "chrome": false
    },
    "plugins": [
        "babel"
    ],
    "extends": "eslint:recommended",
    "rules": { // http://eslint.org/docs/rules/
        "indent": 0,
        "linebreak-style": 0,
        "quotes": [1, "single"],
        "semi": [2, "always"],
        "no-console": 0,
        "no-var": 2, // require let or const instead of var
        "prefer-arrow-callback": 2, // suggest using arrow functions as callbacks
        "prefer-const": 2, // suggest using const declaration for variables that are never modified after declared
        "prefer-rest-params": 2, // suggest using the rest parameters instead of arguments
        "prefer-spread": 2, // suggest using the spread operator instead of .apply().
        "prefer-template": 2, // suggest using template literals instead of strings concatenation

        // babel plugin https://github.com/babel/eslint-plugin-babel
        "babel/generator-star-spacing": 2, // Handles async/await functions correctly
        "babel/new-cap": 0, // Ignores capitalized decorators (@Decorator)
        "babel/array-bracket-spacing": 0, // Handles destructuring arrays with flow type in function parameters
        "babel/object-curly-spacing": 0, // doesn't complain about export x from "mod"; or export * as x from "mod";
        "babel/object-shorthand": 0, // doesn't fail when using object spread (...obj)
        "babel/arrow-parens": 2, // Handles async functions correctly
        "babel/no-await-in-loop": 1 // guard against awaiting async functions inside of a loop
    }
};
