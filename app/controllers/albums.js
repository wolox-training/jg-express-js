const fetch = require('node-fetch');

exports.getListAlbums = (req, res, next) => {
  return fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then(response => response.json())
    .then(json => res.send(json))
    .catch(next);
};
