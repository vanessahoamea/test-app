module.exports = (sequelize, DataType) => {
    let model = sequelize.define('Junction', {
        person_id: {
            type: DataType.INTEGER
        },
        car_id: {
            type: DataType.INTEGER
        }
    }, {
        timestamps: true
    });

    return model;
};