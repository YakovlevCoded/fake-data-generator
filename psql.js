const faker = require('faker');
const Sequelize = require('sequelize');
const config = require('dotenv').config();
// db, user, password
const sequelize = new Sequelize(process.env.DB, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: 'postgres'
});

const ordersModel = sequelize.define('orders', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
    },
    user_id: Sequelize.INTEGER,
    number: Sequelize.INTEGER,
    status: Sequelize.STRING,
    created_at: Sequelize.DATEONLY,
    completed_at: Sequelize.DATEONLY,
    product_id: Sequelize.INTEGER,
}, {
    timestamps: false
});
const productsModel = sequelize.define('products', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    created_at: Sequelize.DATEONLY,
    supplier_id: Sequelize.INTEGER,
    category_id: Sequelize.INTEGER,
}, {
    timestamps: false
});
const usersModel = sequelize.define('users', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
    },
    city: Sequelize.STRING,
    age: Sequelize.INTEGER,
    company: Sequelize.STRING,
    gender: Sequelize.TEXT,
    created_at: Sequelize.DATEONLY,
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
}, {
    timestamps: false
});
// clear tables
ordersModel.destroy({truncate: true, restartIdentity: true});
productsModel.destroy({truncate: true, restartIdentity: true});

// start date
let created_at = faker.date.between('2019-01-01', '2019-01-01');
let statusArr = ['completed', 'processing', 'shipped'];


// fake 10000 orders, 5 in one day
(async function () {
    for (let i = 0; i < 10000; i++) {
        // increment date after 5 orders
        if (i % 5 === 0) {
            created_at = addDays(created_at, 1);
        }
        // random completed date
        let completed_at = addDays(created_at, randomIntFromInterval(1, 30));

        let ob = {
            id: null,
            user_id: randomIntFromInterval(1, 700),
            number: randomIntFromInterval(1, 100),
            status: statusArr[randomIntFromInterval(0, 2)],
            created_at: created_at,
            completed_at: completed_at,
            product_id: randomIntFromInterval(1, 100),
        };
        await ordersModel.create(ob);
    }
})();
// fake 100 products
(async function () {
    for (let i = 0; i < 100; i++) {
        let ob = {
            id: null,
            name: faker.commerce.productName(),
            description: `${faker.commerce.department()} ${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()} ${faker.commerce.product()}`,
            created_at: faker.date.between('2019-01-01', '2022-01-01'),
            supplier_id: randomIntFromInterval(1, 100),
            category_id: randomIntFromInterval(1, 10),
        };
        await productsModel.create(ob);
    }
})();
// add names
(async function () {
    for (let i = 0; i < 700; i++) {
        await usersModel.update(
            {
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName()
            },
            {returning: true, where: {id: i + 1}}
        );
    }
})();

// helpers
function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
