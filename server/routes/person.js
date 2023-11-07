module.exports = app => {
    'use strict';
    const express    = require('express');
    const personCtrl = require('../controllers/personCtrl')(app.locals.db);
    const router     = express.Router();

    router.post('/', personCtrl.create);
    router.put('/', personCtrl.update);
    router.get('/', personCtrl.findAll);
    router.get('/:id', personCtrl.find);
    router.delete('/:id', personCtrl.destroy);
    router.post('/:id/addCar', personCtrl.addCar);
    router.delete('/:id/removeCar', personCtrl.removeCar);

    return router;
};