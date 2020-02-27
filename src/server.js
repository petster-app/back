'use strict';

const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;

const searchRouter = require('./routes/search-router');
const detailsRouter = require('./routes/details-router');
const favoritesRouter = require('./routes/favorites-router');
const userRouter = require('./routes/user-router');

app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(searchRouter);
app.use(detailsRouter);
app.use(favoritesRouter);
app.use(userRouter);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
