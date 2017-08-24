window.onload = function () {
    let movies = [];
    
    let content = document.getElementById('content');

    let socket = io.connect('/');

    $.get('/api/movies', (data) => {
        movies = data;
        
        let IDs = data.map(movie => {
            return movie.ID
        });

        socket.emit('GET_MOVIES_DETAILS', IDs);
        
        _showMovies();
    });
    
    socket.on('MOVIE_DETAIL_RECEIVED', (movie) => {
        _showDetail(movie);
    });

    socket.on('disconnect', reason => {
        if(socket.io.connecting.indexOf(socket) === -1){
            socket.connect('/');
        }
    });

    function _showMovies () {
        let cards = movies.map(movie => {
            return `
            <div class="ui card" id="${movie.ID}">
                <div class="image">
                    <img src="${movie.Poster}" onError="this.onerror=null;this.src='https://semantic-ui.com/images/avatar/large/steve.jpg'" />
                </div>
                <div class="content">
                    <div class="header">${movie.Title}</div>
                    <div class="meta">
                        <a>${movie.Year}</a>
                    </div>
                    <div class="description">
                        <div class="ui active inline loader"></div>
                    </div>
                </div>
            </div>
            `;
        }).join("");

        content.innerHTML = `<div class="ui link cards">${cards}</div>`;
    }
    
    function _showDetail(movie) {
        let prices = (movie.Prices || []),
            priceTpl = '';
        
        if (prices.length > 0) {
            prices.sort((a, b) => {
                return a.price - b.price;
            });

            let saved = (prices.length > 1) 
                ? (prices[1].price - prices[0].price).toFixed(2)
                : 0;

            let source = prices[0]; // always the cheapest one!
            priceTpl = `
                <div class="extra content">
                    ${saved ? `<span class="right floated">Saved $${saved}</span>`: ''}
                    <span>
                    <i class="ticket icon"></i>
                    $${source.price} @${source.cinema.toUpperCase()}
                    </span>
                </div>
                `;
        }

        $(`#${movie.ID} .description`).html(`<p>Saved $${movie.Plot || ''}</p>`);
        if (!!priceTpl) $(`#${movie.ID}`).append(priceTpl);
    }

}