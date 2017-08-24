const socket_io = require('socket.io');
const Backend = require('./Backend');
const service = new Backend();
const EventTypes = require('./EventTypes');

module.exports.use = (instance) => {
    console.log('boostrap socket.io');
    let io = socket_io.listen(instance);

    io.sockets.on('connection', (socket) => {
 
        socket.on(EventTypes.GET_MOVIES_DETAILS, (movieIDs) => {
            (movieIDs || []).forEach(id => {
                setTimeout(() => {
                    service.getMovie(id).then(movie => {
                        socket.emit(EventTypes.MOVIE_DETAIL_RECEIVED, movie);
                    });
                }, 500);
            })
        });

    });

}
