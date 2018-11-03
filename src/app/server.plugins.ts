const dummyTransactions : {id: number, date: Date, description: string, value: number, total: number }[]= [
    { id: 1, date: new Date(2018,8-1,31), description: "יתרה קודמת", value: 184.2, total: 184.2 },,
    { id: 2, date: new Date(2018,9-1,1), description: "לגנדה גלי", value: -28, total: 156.2 },
    { id: 3, date: new Date(2018,9-1,2), description: "צהריים גלי", value: -50, total: 106.2},
    { id: 4, date: new Date(2018,9-1,2), description: "חופשי יומי שחר", value: -40, total: 66.2}
];

export function plugin(app) {
    app.get('/transactions', (req, res) => {
        res.json(dummyTransactions);
    });
}