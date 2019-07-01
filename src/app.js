const express = require('express');
require('./db/mongoose');
const userRouter = require('./routes/user');
const taskRouter = require('./routes/tasks');

const app = express();
const port = process.env.PORT;

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log(`Server Up and Running on port ${port}`);
})