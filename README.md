***GROUP 5***
- Đoàn Minh Khanh - 22110042
- Nguyễn Thành Tính - 22110077
- Đinh Thị Thanh Vy - 22110093

# NewsLand - News Publishing & Moderation Platform

## Overview

NewsLand is a web-based platform designed for publishing and moderating news articles. It allows users to submit, review, and manage news content while ensuring that all submissions meet editorial standards. The platform supports the following features:

- **Article Submission**: Allows users to submit articles for review.
- **Admin Review**: Admins can review, approve, or reject articles before they go live.
- **User Authentication**: Secure login and registration system for both admins and regular users.
- **Responsive Design**: The platform is fully responsive, ensuring usability on both desktops and mobile devices.

## Features

- **User Management**: Handle user registrations, login, and profiles.
- **Article Management**: Submit articles for approval, with options for admins to approve or reject.
- **Comments & Feedback**: Users can leave feedback on articles after they’re published.
- **Notifications**: Admins and users receive notifications on article status.

---

## Installation Guide

### 1. Clone the Repository

Clone the project to your local machine using the following command:

```bash
git clone https://github.com/thanhvyhere/Web-Pro.git
```

### 2. Navigate to the Project Directory

Move into the project directory:

```bash
cd Web-Pro
```

### 3. Install the Dependencies

Run the following command to install the necessary dependencies:

```bash
npm install
```

### 4. Database Setup

There are two SQL files in the `database` directory that you'll need to set up the database.

#### 4.1. Create the Database

Make sure you have MySQL or MariaDB installed on your machine. Then, follow these steps:

1. Log in to MySQL:
    ```bash
    mysql -u root -p
    ```
    Enter your password when prompted.

2. Create a new database:
    ```sql
    CREATE DATABASE newsland;
    ```

3. Exit MySQL:
    ```sql
    EXIT;
    ```

#### 4.2. Set Up the Database Schema

You have two SQL files for database setup: `news.sql` and `newsland.sql`. These files define the structure and initial data for the project.

1. **Import `news.sql`**:
   This file contains the tables and structure for the database. Run the following command to import it into the `newsland` database:
   
    ```bash
    mysql -u root -p newsland < database/news.sql
    ```

2. **Import `newsland.sql`**:
   This file contains any additional data or specific configuration for the project. Run the following command to import it as well:
   
    ```bash
    mysql -u root -p newsland < database/newsland.sql
    ```

#### 4.3. Configure the Database Connection

In our project, the database connection is set up in the `utils/db.js` file using `knex` with the `mysql2` client. The current configuration is as follows:

```js
import knexObj from 'knex';

const knex = knexObj({
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',   // Update your MySQL password here
        database: 'newslanddb' // Ensure this matches the database name you created
    },
    pool: { min: 0, max: 7 }
});

export default knex;
```

### 5. Run the Server

Start the application by running:

```bash
npm start
```

The application should now be running at `http://localhost:3000`.

---

## Contributing

Feel free to fork the repository and submit pull requests. Make sure to follow the coding conventions and submit a detailed description of any changes or additions.

---

## How to Use

### Register an Account
- Visit `http://localhost:3000/register`.
- Fill in the required information and click "Register" to create an account.

### Log In
- Visit `http://localhost:3000/login`.
- Enter the registered username and password to log in.

---

# Administrator System

## Administrator Features

### 1. Manage Categories
Administrators can view, add, update, and delete news categories.

> - **View Category List**:
  Go to [http://localhost:3000/administrator/manage_categories](http://localhost:3000/administrator/manage_categories) to view the list of categories. Here, you can perform actions such as adding, updating, or deleting categories from the existing list.

> - **Add New Category**:
  Visit the category list and click the **Add Category** button. Then, enter the category name and select a parent category (if any), then click **Save**.

> - **Update Category**:
  Go to the category list to view the current categories. Select the category you want to update and click **Update**. Make changes and save them.

> - **Delete Category**:
  Go to the category list, select the category you want to delete, and click **Delete**. Confirm and the category will be removed.

### 2. Manage Tags
Administrators can manage tags for news articles.

> - **View Tag List**:
  Go to [http://localhost:3000/administrator/manage_tags](http://localhost:3000/administrator/manage_tags) to view all tags. You can select a tag to update or delete.

> - **Add New Tag**:
  Go to the tag list and click the **Add Tag** button. Enter the tag name and click **Save**.

> - **Update Tag**:
  Go to the tag list, select the tag you want to update and click **Update**. Make changes and save them.

> - **Delete Tag**:
  Go to the tag list, select the tag you want to delete and click **Delete**. Confirm and the tag will be removed.

### 3. Manage News Articles
Administrators can approve and change the status of news articles.

> - **View News List**:
  Go to [http://localhost:3000/administrator/manage_news](http://localhost:3000/administrator/manage_news) to view the list of articles. Select an article to manage and make changes.

> - **Update Article Status**:
  Go to the news list, select the article you want to update and click **Update Status**. Change the status from **Normal** to **Premium** and save.

### 4. Manage Users
Administrators can manage users, including editors and reporters.

> - **View User List**:
  Go to [http://localhost:3000/administrator/manage_users](http://localhost:3000/administrator/manage_users) to view the list of users. From here, you can select a user to update or delete.

> - **Add New User**:
  Go to the user list and click the **Add User** button. Enter the necessary information and click **Save** to create a new user.

> - **Update User Information**:
  Go to the user list, select the user you want to update and click **Update**. Make changes and save.

> - **Delete User**:
  Go to the user list, select the user you want to delete and click **Delete**. Confirm and the user will be removed from the system.


---

# Editor System

## Editor Features

### 1. Manage Pending Articles (Repository)
Editors can view a list of pending (draft) articles submitted by reporters in the categories they manage.

> - **View Pending Articles**:
  Go to [http://localhost:3000/editor/repository](http://localhost:3000/editor/repository) to view all pending articles.

> - **Approve Articles**:
  Editors can approve articles, after which they can edit information such as category, tag, and the scheduled publishing time.

> - **Reject Articles**:
  Editors can reject articles and request the reporter to revise the article. A reason for rejection should be provided so the reporter can make the necessary changes.

### 2. Manage Reviewed Articles
Editors can view articles that have been reviewed and check the details.

> Go to [http://localhost:3000/editor/reviewed](http://localhost:3000/editor/reviewed) to view the list of reviewed articles.

### 3. Manage Rejected Articles
Editors can view rejected articles and the reasons for rejection.

> Go to [http://localhost:3000/editor/editor_rejected](http://localhost:3000/editor/editor_rejected) to view rejected articles.

### 4. Manage Approved Articles and Confirm Publication Schedule
Editors can view approved articles and confirm their publication schedule.

> - **View Approved Articles**:
  Go to [http://localhost:3000/editor/editor_approved](http://localhost:3000/editor/editor_approved) to view the list of approved articles.

> - **Edit Publication Details**:
  Editors can change publication details, add categories and tags to the article.

### 5. Manage Publishing Schedule
Editors can manage the publishing schedule for approved articles and assign categories.

> Go to [http://localhost:3000/editor/schedule](http://localhost:3000/editor/schedule) to view the list of articles and publishing schedules.

### 6. Provide Feedback on Rejected Articles
Editors can provide reasons for rejecting articles so reporters can make revisions.

> Go to [http://localhost:3000/editor/feedback](http://localhost:3000/editor/feedback) to provide feedback for rejected articles.

### 7. Modify Articles After Approval
Editors can edit approved articles and confirm the publishing schedule.

> Go to [http://localhost:3000/editor/modify](http://localhost:3000/editor/modify) to edit an article after approval, change categories, tags, and publication time.

### 8. Update Article Status
Editors can update the status of an article (approve, reject, pending).

> Go to [http://localhost:3000/editor/update-status](http://localhost:3000/editor/update-status) to change the status of an article.

---
# Writer System

## Writer Features

### 1. **Create and Submit Articles**
Writers can create and submit articles for approval. The submission includes the title, abstract, content, category, tags, and an image (either uploaded or from a URL).

> To create a new article, go to [http://localhost:3000/writer/create_article](http://localhost:3000/writer/create_article). You will need to input the following:
>   - **Title**: The article's headline.
>   - **Abstract**: A short summary of the article.
>  - **Content**: The main body of the article.
>  - **Category**: Select the appropriate category for the article.
>  - **Tags**: Optionally, assign tags to the article.
>  - **Image**: Upload an image or provide a URL for the article cover image.


### 2. **View Articles by Status**
Writers can view their articles categorized by their approval status, which includes articles awaiting approval, approved articles, published articles, and rejected articles.

> - **Pending Approval**:  
  To view pending articles, go to [http://localhost:3000/writer/pending_approval](http://localhost:3000/writer/pending_approval).
  
> - **Approved**:  
  To view approved articles, go to [http://localhost:3000/writer/approved](http://localhost:3000/writer/approved).

> - **Published**:  
  To view articles that have been published, go to [http://localhost:3000/writer/published](http://localhost:3000/writer/published).

> - **Rejected**:  
  To view rejected articles and reasons for rejection, go to [http://localhost:3000/writer/rejected](http://localhost:3000/writer/rejected).

### 3. **Edit Articles**
Writers are allowed to edit only the articles that are pending approval or have been rejected. 

> You can edit the articles by navigating to the rejected or pending approval list and making the necessary changes.

### 4. **Upload Images and Add YouTube Links**
Writers can upload images for their articles or use an external URL. They can also embed YouTube videos within their articles.

> - **Image Upload**:  
  Writers can upload images that are stored in the server or provide a URL to an image.
  
> - **YouTube Links**:  
  You can embed YouTube videos by adding the video URL within the article content.

### 5. **Article Status Updates**
Writers can track the status of their articles (pending, approved, rejected, or published). They will be notified if their article has been rejected, along with the reasons for rejection.

---
# Subscriber System

## Subscriber Features

### 1. **Account Registration and Access**
Subscribers can register (purchase a subscription) and gain access to premium articles. The subscription lasts for 7 days (or a set number of minutes), and access to premium content is limited to the subscription period. Once expired, the subscriber needs to renew their subscription to continue accessing premium content.

> Subscribers must log in or create an account to access premium content.

### 2. **Premium Articles**
Premium articles are displayed at the top of search results and article listings. Subscribers can view and download articles marked as premium (PDF format).

> Subscribers can view premium articles at [http://localhost:3000/subscriber/premium](http://localhost:3000/subscriber/premium), where premium articles are prioritized.

### 3. **Library View**
Subscribers can view their library of saved articles. These are articles that the subscriber has saved for future reference. The library also shows a mix of saved and random articles that the subscriber can browse.

>  To view your saved articles, go to [http://localhost:3000/subscriber/library](http://localhost:3000/subscriber/library). The page displays saved articles, along with additional random articles.

### 4. **Download Premium Articles**
Subscribers can download premium articles in PDF format. The articles are converted from HTML to plain text, and an image (if available) is included in the PDF.

>  Subscribers can download articles in PDF format by clicking the download button. The PDF includes the article's title, content, and cover image (if available).

### 5. **Save and Manage Articles**
Subscribers can save articles to read later. Saved articles are stored in the subscriber's profile and can be accessed at any time.

>  Subscribers can save articles by clicking the save button on an article page. Saved articles can be viewed and managed in the saved articles section.

### 6. **Subscription Renewal**
When the subscription expires (7 days or the set duration), the subscriber will need to renew their subscription to regain access to premium articles.

>  Subscribers can renew their subscription by following the instructions provided on the website.

---

## Notes

- **Subscription Expiry**: Subscribers' accounts are valid for 7 days from activation. Upon expiry, access to premium content will be restricted.
- **Premium Articles**: Articles marked as premium will be given priority in search and listing results.
- **PDF Generation**: Subscribers can download articles as PDFs, with content formatted and an optional cover image included.
- **User Authentication**: Subscribers must be logged in to access premium content and manage their saved articles.

---
# Guest System

## Guest Features

### 1. **Menu System**
The guest user can access a menu that displays a list of categories. Categories are organized into two levels for easy navigation.

### 2. **Homepage**
The homepage serves as the primary entry point for guests. It provides several key sections to keep the user engaged:

> - **Featured Articles**:  
  Displays 3-4 highlighted articles from the past week. These are curated for their relevance and popularity.

> - **Most Viewed Articles**:  
  Displays the 10 most viewed articles across all categories, offering popular content to the user.

> - **Newest Articles**:  
  Displays the 10 most recent articles across all categories.

> - **Top 10 Categories**:  
  Shows the top 10 categories, each with the most recent article listed.

### 3. **Article List by Category/Tag**
Guests can explore a full list of articles sorted by category or tag, with pagination for easy browsing.

### 4. **Article Detail Page**
Guests can click on any article (not premium) to view its full details. The detail page includes comprehensive content for a deeper reading experience.

### 5. **Search Functionality**
Guests can search for articles using full-text search. The search function is capable of looking through:

> - **Title**
> - **Abstract**
> - **Full Article Content**

This enables guests to quickly find articles that match their interests.

### 6. **Quick Navigation**
Guests can easily navigate between categories and tags. Clicking on a category or tag will automatically take them to the article listing page for that category/tag.

---
Thank you for using **NewsLand**. If you have any questions, please contact us via [support email](mailto:tnvgoods@gmail.com).

### Copyright
- This application is developed by NewsLand.
- Copyright protected by current laws.
