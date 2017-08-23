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
                expect(movies).to.have.lengthOf(7);
                done();
            }).catch(done);;
    });

    it('should be able to get movie detail', (done) => {
        service.getMovie('0076759').then(movie => {
            expect(movie.Title).to.equal("Star Wars: Episode IV - A New Hope");
            expect(movie.Prices).to.have.lengthOf(2);
            done();
        }).catch(done);
    });

});