const routes = require('express').Router();
const Backend = require('./Backend');
const service = new Backend();

/**
 * GET /api/movies
 * Get all movies
 */
routes.get('/movies', (req, res, next) => {
    service.getMovies()
        .then(movies => res.json(movies))
        .catch(next);
});

/**
 * GET /api/movie/:id
 * Get a movie details - collect price from all sources
 */
routes.get('/movie/:id', (req, res, next) => {
    service.getMovie(req.params.id)
        .then(movie => res.json(movie))
        .catch(next);
});

module.exports = routes;