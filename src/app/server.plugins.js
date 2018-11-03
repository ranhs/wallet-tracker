"use strict";
exports.__esModule = true;
var dummyTransactions = [
    { id: 1, date: new Date(2018, 8 - 1, 31), description: "יתרה קודמת", value: 184.2, total: 184.2 },
    { id: 2, date: new Date(2018, 9 - 1, 1), description: "לגנדה גלי", value: -28, total: 156.2 },
    { id: 3, date: new Date(2018, 9 - 1, 2), description: "צהריים גלי", value: -50, total: 106.2 },
    { id: 4, date: new Date(2018, 9 - 1, 2), description: "חופשי יומי שחר", value: -40, total: 66.2 },
    { id: 5, date: new Date(2018, 9 - 1, 4), description: "משיכה", value: 200, total: 266.2 },
    { id: 6, date: new Date(2018, 9 - 1, 4), description: "מכונת חטיפים", value: -4.5, total: 261.7 },
    { id: 7, date: new Date(2018, 9 - 1, 4), description: "פתוח קול שחר", value: -200, total: 61.7 },
    { id: 8, date: new Date(2018, 9 - 1, 8), description: "משיכה", value: 200, total: 261.7 }
];
function plugin(app) {
    app.get('/transactions', function (req, res) {
        res.json(dummyTransactions);
    });
}
exports.plugin = plugin;
