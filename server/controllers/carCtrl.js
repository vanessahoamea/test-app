module.exports = db => {
    return {
        create: (req, res) => {
            if(!req.body.brand || !req.body.model || !req.body.year || !req.body.cylinder_capacity)
                return res.status(400).send({ success: false, required_fields: 'brand, model, year, cylinder_capacity' });

            db.models.Car.create(req.body).then((car) => {
                res.send({ success: true, id: car.id });
            }).catch(() => res.status(401));
        },

        update: (req, res) => {
            db.models.Car.update(req.body, { where: { id: req.body.id } }).then(() => {
                res.send({ success: true })
            }).catch(() => res.status(401));
        },

        findAll: (_, res) => {
            db.query(`SELECT id, brand, model, year, cylinder_capacity
            FROM "Car"
            ORDER BY id`, { type: db.QueryTypes.SELECT }).then(resp => {
                res.send(resp);
            }).catch(() => res.status(401));
        },

        find: (req, res) => {
            db.query(`SELECT id, brand, model, year, cylinder_capacity
            FROM "Car"
            WHERE id = ${req.params.id}
            ORDER BY id`, { type: db.QueryTypes.SELECT }).then(resp => {
                res.send(resp[0]);
            }).catch(() => res.status(401));
        },

        destroy: (req, res) => {
            db.query(`DELETE FROM "Car" WHERE id = ${req.params.id}`, { type: db.QueryTypes.DELETE }).then(() => {
                res.send({ success: true });
            }).catch(() => res.status(401));
        },
    };
};