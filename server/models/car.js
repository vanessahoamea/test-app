module.exports = (sequelize, DataType) => {
    let model = sequelize.define('Car', {
        number_plate: {
            type: DataType.TEXT
        },
        company: {
            type: DataType.TEXT
        },
        model: {
            type: DataType.TEXT
        },
        year: {
            type: DataType.INTEGER
        },
        cylinder_capacity: {
            type: DataType.INTEGER
        }
    }, {
        timestamps: true
    });

    return model;
};