import knexObj from "knex";
const knex = knexObj({
    client: 'mysql2',
    connection:{
        host:'127.0.0.1',
        port:3306,
        user: 'root',
        password: '',
        database: 'newsland',
    },
    pool: {min:0, max: 10}
});
export default knex;
