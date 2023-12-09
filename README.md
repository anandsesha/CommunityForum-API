# CommunityForum-API

JWT-secured RESTful API for a dynamic Community Forum, enabling secure user interactions and seamless integration with web applications.

## Project Goal

Welcome to the Community Forum API, a robust and flexible RESTful API designed to power an engaging and dynamic community forum platform much like StackOverflow. The primary goal of this project is to provide developers with a comprehensive foundation for building and customizing their own forum-based applications. With a focus on simplicity, scalability, and extensibility, this API aims to empower developers to create vibrant online communities.

## What We've Accomplished

In this project, we have meticulously designed and implemented a feature-rich API for managing questions, answers, user profiles, and more. Some key achievements include:

- **Authentication and Authorization:** Secure your forum with user authentication and authorization mechanisms, ensuring that only authorized users can interact with the API.

- **Questions and Answers:** Create, retrieve, update, and delete questions and answers, enabling a seamless flow of information within the community.

- **User Profiles:** Manage user profiles with the ability to update information such as username, bio, and profile image.

- **Tags and Categories:** Organize content with tags and categories, allowing users to discover relevant topics easily.

- **Community Interaction:** Enable users to post questions, provide answers, and engage in meaningful discussions.

- **Tag Listing:** Effortlessly retrieve a list of unique tags used in the forum, providing insights into popular topics.

This project showcases a deep understanding of RESTful API development, emphasizing best practices in security, data modeling, and user experience. Whether you're a seasoned developer looking for a robust API solution or a newcomer eager to explore the world of community forums, this API has you covered.

Explore the documentation below to get started with integrating the Community Forum API into your projects and building vibrant online communities.

## Getting Started

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/your-username/CommunityForum-API.git
cd CommunityForum-API
npm install

```

## Configuration

Create a .env file in the root directory and set the following variables:

DATABASE_URL=your-mongodb-url
SECRET_KEY=your-secret-key


## Running the server

npm start


## API Endpoints 

All tested via Postman as a client.


### 1. Register User

**Method:** `POST`

**Pathname:** `/api/users/register`

**Required Fields:**
- `username`
- `email`
- `password`

**Optional Fields:**
- `name`
- `image`
- `bio`

**Response:**
```json
{
  "user": {
    "token": "your_token_here",
    "email": "user@example.com",
    "username": "example_user"
  }
}
```

**Checkout the Readme.md file inside the project for all the Endpoints handled and tested in the project**



## Project Learning: Handling ObjectId Casting Error

Problem Description:

## Error:
```json
Cast to ObjectId failed for value "aman12345" (type string) at path "author" because of "BSONError"
```

## When Does It Occur?
This error occurs when attempting to UPDATE a question using a request like the one below in POSTMAN:

```json
{
  "title": "What is event loop",
  "author": "Anand",
  "slug": "what-is-EVENT-LOOP"
}
```

The goal is to update the question using the provided request. First, using the questionID, the corresponding authorID is obtained, which represents the ID of a specific user who is logged in. However, when using that user's ID to update the author field, the mentioned casting error occurs.

## Issue Analysis:
Received ObjectId: new ObjectId('65726adc7069d9040b298a04')
Expected Format: 65726adc7069d9040b298a04

## Solution:
To resolve this issue, a plain string representation of the ObjectId is needed. This can be achieved by using the .toString() method. Throughout the project, a custom function named objectIdToString has been implemented to consistently convert Mongoose ObjectIds to strings.

## Key Takeaways:
* Always ensure that the author field is correctly represented as a string when updating or referencing ObjectId in MongoDB.
* Use the .toString() method or equivalent approaches to convert ObjectId to a plain string representation.

This learning is crucial for handling ObjectId-related operations and can be applied consistently across the project.


## Future Scope
Further, add endpoints for the following actions:

* Follow/unfollow other users
* Upvote questions/answers
* Add comments on questions/answers
* Admin dashboard
        - Admin registration/login
        - Admin can track/block users
        - Admin can track all questions at a time


Feel free to contribute and enhance the features of this API!
