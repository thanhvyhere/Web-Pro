import knex from '../utils/db.js';

const newsService = {
    // Fetch all news
    async getAllNews() {
        return await knex('news').select('*'); // Adjust table name and fields as needed
    },

    // Fetch news by ID
    async getNewsById(id) {
        return await knex('news').where('id', id).first();
    },

    // Add a new news item
    async addNews(newsItem) {
        return await knex('news').insert(newsItem);
    },

    // Delete news by ID
    async deleteNewsById(id) {
        return await knex('news').where('id', id).del();
    },
};

export default newsService;
