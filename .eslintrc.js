module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": 0
        ,
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": 0
        ,
        "semi": [
            "error",
            "always"
        ]
    }
};
