const Backend = require('./Backend');
const expect = require('chai').expect;

describe('Backend', () => {
    let service;

    beforeEach(() => {
        service = new Backend(); 
    });

    it('should be able to get movies', (done) => {
        service.getMovies()
            .then(movies => {
                expect(movies).to.be.an.instanceof(Array);
                done();
            }).catch(done);;
    });

    it('should be able to get movie detail', (done) => {
        service.getMovie('cinemaworld', 'cw0076759').then(movie => {
            expect(movie.Title).to.equal("Star Wars: Episode IV - A New Hope");
            done();
        }).catch(done);
    });

    it('should be able to get cheap price for movie', (done) => {
        service.getCheapPrice('0076759').then(result => {
            expect(result).to.equal(29.5);
            done();
        }).catch(done);
    });

});