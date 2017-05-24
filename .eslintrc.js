module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "globals" : {
  },
  "plugins": [
    'html'
  ],
  "rules" : {
    "padded-blocks": 0,
    "no-underscore-dangle": ["error", { "allowAfterThis": true }]
  },
};
