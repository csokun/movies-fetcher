const socket_io = require('socket.io');

const EventTypes = require('./EventTypes');
const Backend = require('./Backend');
const service = new Backend();

module.exports.use = (instance) => {

    console.log('boostrap socket.io');
    
    let io = socket_io.listen(instance);
    io.sockets.on('connection', (socket) => {
 
        /**
         * Listening for client request
         */
        socket.on(EventTypes.GET_MOVIES_DETAILS, (movieIDs) => {
            (movieIDs || []).forEach(id => {
                
                // Every 500ms send a request to backend
                // because I am a good guy!
                setTimeout(() => {
                    service.getMovie(id).then(movie => {
                        // let the client know
                        socket.emit(EventTypes.MOVIE_DETAIL_RECEIVED, movie);
                    });
                }, 500);

            })
        });

    });

}
