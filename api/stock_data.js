let stock_data = {},
    dao = require('./dao');

dao.register('stock_data').then((base) => {
    stock_data.base = base
})

module.exports = stock_data;