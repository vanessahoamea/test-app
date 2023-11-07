module.exports = (sequelize, DataType) => {
    let model = sequelize.define('Car', {
        brand: {
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