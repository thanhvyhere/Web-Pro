import db from '../utils/db.js';

export default {
  // Lấy tất cả nhãn
  async findAll() {
    try {
      const tags = await db('tags');
      return tags;
    } catch (error) {
      throw new Error('Error fetching tags: ' + error.message);
    }
  },

  // Lấy một nhãn theo ID
  async findById(id) {
    try {
      if (!id) throw new Error('Tag ID is required');
      const tag = await db('tags').where('TagID', id).first();
      if (!tag) throw new Error('Tag not found');
      return tag;
    } catch (error) {
      throw new Error('Error fetching tag by ID: ' + error.message);
    }
  },

  // Thêm nhãn mới
  async add(tag) {
    try {
      if (!tag || !tag.TagName) throw new Error('Tag name is required');
      
      const [newTag] = await db('tags').insert({
        TagName: tag.TagName,
      }).returning('TagID');
      
      return newTag;
    } catch (error) {
      throw new Error('Error adding new tag: ' + error.message);
    }
  },

  // Cập nhật nhãn
  async update(id, tag) {
    try {
      if (!id) throw new Error('Tag ID is required');
      if (!tag || !tag.TagName) throw new Error('Tag name is required');
      
      const existingTag = await db('tags').where('TagID', id).first();
      if (!existingTag) throw new Error('Tag not found');
      
      const updatedRows = await db('tags')
        .where('TagID', id)
        .update({
          TagName: tag.TagName,
        });

      if (updatedRows === 0) throw new Error('No changes made or tag not found');
      return updatedRows;
    } catch (error) {
      throw new Error('Error updating tag: ' + error.message);
    }
  },

  // Xoá nhãn
  async delete(id) {
    try {
      if (!id) throw new Error('Tag ID is required');
      
      const existingTag = await db('tags').where('TagID', id).first();
      if (!existingTag) throw new Error('Tag not found');

      const deletedRows = await db('tags').where('TagID', id).del();
      if (deletedRows === 0) throw new Error('Tag not found');
      return deletedRows;
    } catch (error) {
      throw new Error('Error deleting tag: ' + error.message);
    }
  },

  // Lấy tất cả các bài viết có liên quan đến tag
  async getArticlesByTag(tagId) {
    try {
      const articles = await db('news_tags')
        .join('news', 'news.NewsID', '=', 'news_tags.NewsID')
        .where('news_tags.TagID', tagId)
        .select('news.NewsID', 'news.Title', 'news.Content');
      
      return articles;
    } catch (error) {
      throw new Error('Error fetching articles for tag: ' + error.message);
    }
  },

  // Thêm bài viết vào nhãn
  async addArticleToTag(newsId, tagId) {
    try {
      const existingLink = await db('news_tags')
        .where({ NewsID: newsId, TagID: tagId })
        .first();

      if (existingLink) throw new Error('Article already linked to this tag');

      await db('news_tags').insert({ NewsID: newsId, TagID: tagId });
    } catch (error) {
      throw new Error('Error linking article to tag: ' + error.message);
    }
  },

  // Xóa bài viết khỏi nhãn
  async removeArticleFromTag(newsId, tagId) {
    try {
      await db('news_tags')
        .where({ NewsID: newsId, TagID: tagId })
        .del();
    } catch (error) {
      throw new Error('Error removing article from tag: ' + error.message);
    }
  }
};
