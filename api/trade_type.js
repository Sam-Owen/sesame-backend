let trade_type = {},
    dao = require('./dao');

dao.register('trade_type').then((base) => {
    trade_type.base = base
})


module.exports = trade_type;