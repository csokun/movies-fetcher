const GET = require('./get-promise');
const config = require('./config');

class MovieService {

    constructor() { 
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
    
    getMovies () {
        let self = this;
        let promises = self.PROVIDERS.map((provider) => {
            return GET(`${provider.name}/movies`, [], config.get('retry'))
                .then(response => {
                    let movies = response.Movies || [];                    
                    // clean movie ids
                    movies.forEach(movie => {
                        movie.ID = movie.ID.replace(/cw|fw/g, '');
                    });
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
            return GET(`${provider.name}/movie/${provider.shortName}${movieId}`, null, config.get('retry'));
        });

        // always return two object instances
        // same movie from different cinemas
        // just want to collect different prices
        return Promise.all(promises).then(results => {
            let movie = { ID: movieId, Prices: [] };
            (results || []).filter(instance => !!instance)
                .forEach(instance => {
                    let provider = this.PROVIDERS.find(p => instance.ID.startsWith(p.shortName));
                    movie.Prices.push({
                        price: instance.Price,
                        cinema: provider.shortName 
                    });

                    delete instance.ID;
                    delete instance.Price;
                    Object.assign(movie, instance);
                });
            return movie;
        });
    }

}

module.exports = MovieService;