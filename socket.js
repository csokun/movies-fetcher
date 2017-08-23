const socket_io = require('socket.io');
const Backend = require('./Backend');
const service = new Backend();

module.exports.use = (instance, EventHandler) => {
    console.log('boostrap socket.io');
    let io = socket_io.listen(instance);

    io.sockets.on('connection', (socket) => {
        /**
         * RAW Socket.io Communication
         */ 
        socket.on(EventHandler.TYPES.GET_MOVIES_DETAILS, (movieIDs) => {
            (movieIDs || []).forEach(id => {
                setTimeout(() => {
                    service.getMovie(id).then(movie => {
                        socket.emit(EventHandler.TYPES.MOVIE_DETAIL_RECEIVED, movie);
                    });
                }, 500);
            })
        });

    });

    /**
     * Hook up node EventEmitter with socket.io
     */
    EventHandler.on(EventHandler.TYPES.MOVIES_RECEIVED, (data) => {
        io.to(data.clientId).emit('message', data);
    });

    EventHandler.on(EventHandler.TYPES.PRICES_RECEIVED, (data) => {
        io.to(data.clientId).emit('message', data);
    });
}
