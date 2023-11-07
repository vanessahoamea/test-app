module.exports = db => {
    return {
        create: (req, res) => {
            db.models.Person.create(req.body).then(() => {
                res.send({ success: true });
            }).catch(() => res.status(401));
        },

        update: (req, res) => {
            db.models.Person.update(req.body, { where: { id: req.body.id } }).then(() => {
                res.send({ success: true })
            }).catch(() => res.status(401));
        },
    
        findAll: (_, res) => {
            db.query(`SELECT p.id, first_name, last_name, cnp, json_agg(
                json_build_object('id', c.id, 'brand', brand, 'model', model, 'year', year, 'cylinder_capacity', cylinder_capacity)
            ) AS car_list
            FROM "Person" p
            LEFT JOIN "Junction" j ON p.id = j.person_id
            LEFT JOIN "Car" c ON j.car_id = c.id
            GROUP BY p.id
            ORDER BY p.id`, { type: db.QueryTypes.SELECT }).then(resp => {
                res.send(resp);
            }).catch(() => res.status(401));
        },

        find: (req, res) => {
            db.query(`SELECT p.id, first_name, last_name, cnp, json_agg(
                json_build_object('id', c.id, 'brand', brand, 'model', model, 'year', year, 'cylinder_capacity', cylinder_capacity)
            ) AS car_list
            FROM "Person" p
            LEFT JOIN "Junction" j ON p.id = j.person_id
            LEFT JOIN "Car" c ON j.car_id = c.id
            WHERE p.id = ${req.params.id}
            GROUP BY p.id
            ORDER BY p.id`, { type: db.QueryTypes.SELECT }).then(resp => {
              res.send(resp[0]);
            }).catch(() => res.status(401));
        },

        destroy: (req, res) => {
            db.query(`DELETE FROM "Person" WHERE id = ${req.params.id}`, { type: db.QueryTypes.DELETE }).then(() => {
                res.send({ success: true });
            }).catch(() => res.status(401));
        },

        addCar: (req, res) => {
            db.models.Junction.create({ person_id: req.params.id, car_id: req.body.car_id }).then(() => {
                res.send({ success: true })
            }).catch(() => res.status(401));
        },

        removeCar: (req, res) => {
            db.query(`DELETE FROM "Junction" WHERE person_id = ${req.params.id} AND car_id = ${req.body.car_id}`, { type: db.QueryTypes.DELETE }).then(() => {
                res.send({ success: true })
            }).catch(() => res.status(401));
        }
    };
};