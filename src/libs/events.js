const EventEmitter = require('events');

const events = new EventEmitter();
events.setMaxListeners(100);

export default events;
