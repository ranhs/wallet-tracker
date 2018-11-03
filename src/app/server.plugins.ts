export function plugin(app) {
    app.get('/transactions', (req, res) => {
        res.send('Hello World!');
    });
}