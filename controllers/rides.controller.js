const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Ride = require('../models/ride.model');

module.exports = (app) => {
    // GET all rides
    app.get('/rides', (req, res) => {
        Ride.find({})
            .populate('rider')
            .then((rides) => {
                // console.log(rides);
                res.send({ rides });
            })
            .catch((err) => {
                console.log(err.message);
                res.status(400).send(err.message)
            });
    });
    // SHOW one ride
    app.get('/rides/:id', async (req, res) => {
        const ride = await Ride.findById(req.params.id).populate('rider');
        res.send({ride});
    });

    // CREATE one ride
    app.post('/rides', async (req, res) => {
        const decoded = jwt.verify(req.cookies.rideToken, process.env.SECRET);
        Ride.create({...req.body, rider:decoded._id})
            .then((ride) => {
                res.send({ rideId: ride._id });
            })
            .catch((err) => {
                console.log(err.message);
            });
    });

    // DELETE one ride
    app.delete('/rides/:id', (req, res) => {
        Ride.deleteOne(req.params.id)
            .then(() => {
                res.redirect('/rides');
            })
            .catch((err) => {
                console.log(err.message);
            });
    });
};