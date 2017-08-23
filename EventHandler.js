const EventEmitter = require('events');

const EventTypes = {
    GET_MOVIES_DETAILS: 'GET_MOVIES_DETAILS',
    MOVIE_DETAIL_RECEIVED: 'MOVIE_DETAIL_RECEIVED'
};

const handler = new EventEmitter();

module.exports = {
    TYPES: EventTypes,
    on: handler.on,
    emit: handler.emit
};