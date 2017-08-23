const routes = require('express').Router();
const Backend = require('./Backend');
const service = new Backend();

module.exports = (EventHandler) => {
    
    routes.get('/movies', (req, res, next) => {
        service.getMovies()
            .then(movies => res.json(movies))
            .catch(next);
    });
    
    routes.get('/movie/:id', (req, res, next) => {
        service.getMovie(req.params.id)
        .then(movie => res.json(movie))
        .catch(next);
    });

    return routes;
}