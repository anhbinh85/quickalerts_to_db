const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON request bodies
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const eventData = req.body;

    // Basic logging to console
    console.log('Received QuickAlert:', JSON.stringify(eventData, null, 2));

    // TODO: Process the eventData (e.g., store in database, trigger actions)
    // In a real app, you would replace this with your database logic
    // and any other actions you want to take.

    res.status(200).send('Event received');
});

app.listen(PORT, () => {
    console.log(`Webhook server listening on port ${PORT}`);
});
