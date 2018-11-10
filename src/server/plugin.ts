const dummyTransactions : {id: number, date: {year: number, month: number, day: number}, description: string, value: number, total: number }[]= [
    { id: 1, date: {year: 2018, month: 8, day: 31}, description: "יתרה קודמת", value: 184.2, total: 184.2 },
    { id: 3, date: {year: 2018, month: 9, day: 2}, description: "צהריים גלי", value: -50, total: 106.2},
    { id: 4, date: {year: 2018, month: 9, day: 2}, description: "חופשי יומי שחר", value: -40, total: 66.2},
    { id: 5, date: {year: 2018, month: 9, day: 4}, description: "משיכה", value: 200, total: 266.2},
    { id: 6, date: {year: 2018, month: 9, day: 4}, description: "מכונת חטיפים", value: -4.5, total: 261.7},
    { id: 7, date: {year: 2018, month: 9, day: 4}, description: "פתוח קול שחר", value: -200, total: 61.7},
    { id: 8, date: {year: 2018, month: 9, day: 8}, description: "משיכה", value: 200, total: 261.7}
];

export function plugin(app) {
    app.get('/transactions', (req, res) => {
        res.json(dummyTransactions);
    });
}