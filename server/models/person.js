module.exports = (sequelize, DataType) => {
    let model = sequelize.define('Person', {
        first_name: {
            type: DataType.TEXT
        },
        last_name: {
            type: DataType.TEXT
        },
        cnp: {
            type: DataType.TEXT
        }
    }, {
        timestamps: true
    });

    return model;
};