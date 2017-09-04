
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./api.ws.js');//暂时调试
} else {
    module.exports = require('./api.offline.js');
}
