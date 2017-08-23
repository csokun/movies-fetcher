const GET = require('./get-promise');

class MovieService {

    constructor(eventHandler) { 
        this.eventHandler = eventHandler;
        this.PROVIDERS = [{
            name: 'cinemaworld', 
            properName: 'Cinema World',
            shortName: 'cw'
        }, {
            name: 'filmworld',
            properName: 'Film World',
            shortName: 'fw'
        }];
    }
    
    getMovies (clientId = null) {
        let self = this;
        let promises = self.PROVIDERS.map((provider) => {
            return GET(`${provider.name}/movies`, [], 1)
                .then(response => {
                    let movies = response.Movies || [];                    
                    // clean movie ids
                    movies.forEach(movie => {
                        movie.ID = movie.ID.replace(/cw|fw/g, '');
                    });

                    if (!!clientId && !!self.eventHandler) {
                        self.eventHandler.emit(self.eventHandler.TYPES.MOVIES_RECEIVED, {
                            provider,
                            clientId,
                            movies
                        });
                    }
                    
                    return movies;
                });
        });

        return Promise.all(promises).then(results => {
                let movies = [];
                // remove duplicate
                results.reduce((a, b) => a.concat(b))
                    .forEach(t => {
                        if (movies.find(movie => movie.ID === t.ID)) return;
                        movies.push(t);
                    });
                return movies;
            }).catch(error => {
                return [];
            });
    }

    getMovie (movieId) {
        let promises = this.PROVIDERS.map((provider) => {
            return GET(`${provider.name}/movie/${provider.shortName}${movieId}`, null, 1);
        });

        // always return two object instances
        // same movie from different cinemas
        // just want to collect different prices
        return Promise.all(promises).then(results => {
            let movie = { ID: movieId, Prices: [] };
            (results || []).filter(instance => !!instance)
                .forEach(instance => {
                    movie.Prices.push({
                        price: instance.Price,
                        provider: instance.ID.replace(movieId, '')
                    });

                    delete instance.ID;
                    Object.assign(movie, instance);
                });
            return movie;
        });
    }

}

module.exports = MovieService;