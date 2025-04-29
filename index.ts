import e from "express";

const app = e();

app.get('/', (req, res) => {
    res.send('API IS WORKING!');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});