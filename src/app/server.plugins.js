"use strict";
exports.__esModule = true;
function plugin(app) {
    app.get('/transactions', function (req, res) {
        res.send('Hello World!');
    });
}
exports.plugin = plugin;
