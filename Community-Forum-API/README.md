# Community Forum API

## Project Goal:

Welcome to the Community Forum API, a robust and flexible RESTful API designed to power an engaging and dynamic community forum platform much like StackOverflow. The primary goal of this project is to provide developers with a comprehensive foundation for building and customizing their own forum-based applications. With a focus on simplicity, scalability, and extensibility, this API aims to empower developers to create vibrant online communities.

## What We've Accomplished:

In this project, we have meticulously designed and implemented a feature-rich API for managing questions, answers, user profiles, and more. Some key achievements include:

- **Authentication and Authorization:** Secure your forum with user authentication and authorization mechanisms, ensuring that only authorized users can interact with the API.

- **Questions and Answers:** Create, retrieve, update, and delete questions and answers, enabling a seamless flow of information within the community.

- **User Profiles:** Manage user profiles with the ability to update information such as username, bio, and profile image.

- **Tags and Categories:** Organize content with tags and categories, allowing users to discover relevant topics easily.

- **Community Interaction:** Enable users to post questions, provide answers, and engage in meaningful discussions.

- **Tag Listing:** Effortlessly retrieve a list of unique tags used in the forum, providing insights into popular topics.

This project showcases a deep understanding of RESTful API development, emphasizing best practices in security, data modeling, and user experience. Whether you're a seasoned developer looking for a robust API solution or a newcomer eager to explore the world of community forums, this API has you covered.

Explore the documentation below to get started with integrating the Community Forum API into your projects and building vibrant online communities.

<!-- Community Forum -->

This application lists all API endpoints for creating a community forum.

- For authenticated request, add token in req headers - Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
- All routes prefix /api in their endpoint - eg: /api/users/login

<!-- One major learning from this project: -->

Error faced:
Cast to ObjectId failed for value "aman12345" (type string) at path "author" because of "BSONError"

When does it occur?
When I pass a request from POSTMAN like:
{
"title": "What is event loop",
"author": "aman12345",
"slug": "what-is-EVENT-LOOP"
}

say my goal is - to update the question using the request above.
First, using the questionID - we find the authorID, which is inturn a particular user's id who is logged in.
Then, using that user's Id when we try to update the author field, it gives an error like:

console.log(userForThisQuestion.\_id);
OUTPUT: new ObjectId('65726adc7069d9040b298a04')
Expected: 65726adc7069d9040b298a04

Solution - We need a plain string representation of the ObjectId. To convert the Mongoose ObjectId to a string, you can use the .toString() method.
In this case since we will query in a lot of places we have used a custom function - objectIdToString which does the same thing.

<!-- Q1. REGISTER USER -->

Requirements:
method -> POST
pathname -> /users/register
required fields are
username, email, password
optional fields are
name, image, bio

It should return user document according to above User specs:
{
"user": {
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
"email": "qwerty@gmail.com",
"username": "qwerty"
}
}

Ans 1.

<!-- OUTPUT -->

{
"user": {
"username": "aseshad2",
"email": "anand2@gmail.com",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTcyM2RhNGVlYmY4OGYwNjYyOGRmOGEiLCJlbWFpbCI6ImFuYW5kMkBnbWFpbC5jb20iLCJpYXQiOjE3MDE5ODU3MDB9.DRuh4gvwLJ2u5lkKqlbMKqUgBUOOoOkA3y7V3FAQzvI"
}
}

<!-- Q2. LOGIN -->

Requirements:
method -> POST
pathname -> /users/login
required fields are
email, password
no optional fields
It should return user document according to above User specs.

Ans:

<!-- OUTPUT -->

{
"user": {
"username": "aseshad6",
"email": "anand6@gmail.com",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTcyNDQzY2RiNDgyMzFjNzEyZjQwMTIiLCJlbWFpbCI6ImFuYW5kNkBnbWFpbC5jb20iLCJpYXQiOjE3MDE5OTExMzB9.f_FSQwcnfaEUIjKQ4bq9hwNga3vRap_mzHmAV3D4000"
}
}

<!-- Q3. Get the CURRENT USER -->

method -> GET
pathname -> /users/current-user
authentication required(token)
It should return user document according to above User specs.

Ans:<!-- OUTPUT -->

{
"user": {
"username": "aseshad6",
"email": "anand6@gmail.com",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTcyNDQzY2RiNDgyMzFjNzEyZjQwMTIiLCJlbWFpbCI6ImFuYW5kNkBnbWFpbC5jb20iLCJpYXQiOjE3MDE5OTAyNzR9.PXfTWX4d0jBKrS6ENE2Jm-z7D10NZTDYN5tFJlDBvmY"
}
}

Now, a profile at this community forum must look like:
{
"profile": {
"name": "Qwerty",
"username": "qwerty",
"image": "some image url",
"bio": "tell me something about yourself"
}
}

app.js - spearate router added app.use('/api/profile', profileRouter);

<!-- Q4. Display user's PROFILE INFO:  -->

Requirements:
method -> GET
pathname -> /profile/:username
authentication optional
It should return user document according to above Profile specs.

Ans: Check profiles.js router for logic

<!-- OUTPUT -->

{
"profile":
{
"name":"Anand New",
"username":"anandsesha12345",
"image":"3628746475682834nkjdsdhsgfksdfns.jpg",
"bio":"Some random bio info4"
}
}

<!-- Q5. UPDATE user's Profile info: -->

Requirements:
method -> PUT
pathname -> /profile/:username
authentication required
optional arguments are
username, name, bio, image, email
It should return user document according to above Profile specs.

Ans.
First I register the user and login using token. Then using the username we can do a PUT req and change any info like username, name, email, image, bio.

<!-- Output -->

{
"updatedProfile":
{
"username":"aman12345",
"name":"aman",
"image":"aman12345.jpg",
"bio":"Some random guy to prove a point",
"email":"aman@gmail.com"
}
}

<!-- Q6. Create a QUESTION in the Forum -->

New route handled in app.js /api/questions

Requirements:

method -> POST
pathname -> /questions
authentication required
required fields are
title
author
slug
optional fields are
description
tags
It should return the Question which was created.

Ans.
NOTE: Since I have modelled the question schema to have author as the user who is logged in, So, when author name comes in request - using that name we get all fields of that User (including his \_id) - using that we create the question (which needs author: <userid>)

<!-- OUTPUT -->

{
"questions":[
{
"title":"What is Jason.parse?",
"author":"65726adc7069d9040b298a04",
"slug":"what-is-json-parse",
"tags":[],
"\_id":"65727da385cd3588884126e9",
"createdAt":"2023-12-08T02:21:23.450Z",
"updatedAt":"2023-12-08T02:21:23.450Z",
"\_\_v":0
}
]
}

<!-- Q7. List Questions -->

Requirements:
method -> GET
pathname -> /questions
authentication optional
It should return an array of All Question in the above specified format.

Ans.

<!-- Output -->

{
"questions":[
{"\_id":"65727da385cd3588884126e9","title":"What is Jason.parse?","author":"65726adc7069d9040b298a04","slug":"what-is-json-parse","tags":[],"createdAt":"2023-12-08T02:21:23.450Z","updatedAt":"2023-12-08T02:21:23.450Z","\*\*v":0},

        {"\_id":"6573bc096cf069b675357173","title":"What is EVENT LOOP","author":"65726adc7069d9040b298a04","slug":"what-is-event-loop","tags":[],"createdAt":"2023-12-09T00:59:53.896Z","updatedAt":"2023-12-09T00:59:53.896Z","\*\*v":0}
    ]

}

<!-- Q8. UPDATE question -->

method -> PUT
pathname -> /questions/:questionId
authentication required

optional fields are

description
tags
title
It should return the Question which was updated.

Ans.

<!-- OUTPUT -->

{
"question": {
"\_id": "6573d3d59c317ecd9df65ea3",
"title": "What is React12",
"author": "65726adc7069d9040b298a04",
"slug": "what-is-react-12",
"tags": [],
"createdAt": "2023-12-09T02:41:25.265Z",
"updatedAt": "2023-12-09T03:05:06.037Z",
"\_\_v": 0
}
}

<!-- Q9. DELETE QUESTION -->

method -> DELETE
pathname -> /questions/:slug
authentication required
It should return deleted Question. It should also delete associated answers.

Ans.

<!-- OUTPUT -->

{
"question": {
"\_id": "6573d3d59c317ecd9df65ea3",
"title": "What is React12",
"author": "65726adc7069d9040b298a04",
"slug": "what-is-react-12",
"tags": [],
"createdAt": "2023-12-09T02:41:25.265Z",
"updatedAt": "2023-12-09T03:05:06.037Z",
"\_\_v": 0
}
}
And, the corresponding Answers to this question are also deleted.

NOTE:
For answers - add and list answers are modelled inside /api/questions route since these 2 routes require questionId.
Whereas the update and delete answers are modelled inside /api/answers - routes/answers.js since they dont need the questionId.

<!-- Q10. Add ANSWER -->

method -> POST
pathname -> /questions/:questionId/answers
authentication required

required fileds are

text answer
author
It should return an Answer

Ans.

<!-- OUTPUT -->

{
"answers": {
"text": "This is the answer to the event loop question 1",
"author": "65726adc7069d9040b298a04",
"questionId": "6573bc096cf069b675357173",
"\_id": "6573e45e5a86d2ad7a0fc5e1",
"createdAt": "2023-12-09T03:51:58.748Z",
"updatedAt": "2023-12-09T03:51:58.748Z",
"\_\_v": 0
}
}

<!-- Q11. LIST all answers for a given question -->

method -> GET
pathname -> /questions/:questionId/answers
authentication required
It should return an array of answers

Ans.

<!-- OUTPUT -->

{
"answers": [
[
{
"_id": "6573e3f8bffa7ab7a23c8cb3",
"text": "This is the answer to the event loop question",
"author": "65726adc7069d9040b298a04",
"questionId": "6573bc096cf069b675357173",
"createdAt": "2023-12-09T03:50:16.831Z",
"updatedAt": "2023-12-09T03:50:16.831Z",
"__v": 0
},
{
"_id": "6573e45e5a86d2ad7a0fc5e1",
"text": "This is the answer to the event loop question 1",
"author": "65726adc7069d9040b298a04",
"questionId": "6573bc096cf069b675357173",
"createdAt": "2023-12-09T03:51:58.748Z",
"updatedAt": "2023-12-09T03:51:58.748Z",
"__v": 0
}
]
]
}

<!-- Q12. Update an answer -->

method -> PUT
pathname -> /answers/:answerId
authentication required
required field
answer text
It should return an Answer.

Ans.

<!-- OUTPUT -->

{
"answer": {
"\_id": "6573e45e5a86d2ad7a0fc5e1",
"text": "This is the answer to the event loop question 1 again",
"author": "65726adc7069d9040b298a04",
"questionId": "6573bc096cf069b675357173",
"createdAt": "2023-12-09T03:51:58.748Z",
"updatedAt": "2023-12-09T04:02:47.270Z",
"\_\_v": 0
}
}

<!-- Q13. DELETE the answer and remove reference of the answer from the Question table -->

Ans.

<!-- OUTPUT -->

{
"\_id": "6573e3f8bffa7ab7a23c8cb3",
"text": "This is the answer to the event loop question",
"author": "65726adc7069d9040b298a04",
"questionId": "6573bc096cf069b675357173",
"createdAt": "2023-12-09T03:50:16.831Z",
"updatedAt": "2023-12-09T03:50:16.831Z",
"\_\_v": 0
}

<!-- Q14. List tags -->

method -> GET
pathname -> /tags
authentication optional
It should return an array of all tags used.

{
"tags": [
"nodejs",
"streams",
"react"
]
}

Ans.

<!-- OUTPUT -->

{
"tagsArray": [
"React",
"Redux",
"JS"
]
}

Future scope:

Further add endpoints for following actions

- follow/unfollow other user
- upvote questions/answers
- add comments on questions/answers
- admin dashboard
  - admin registration/login
  - admin can track/block users
  - admin can track all questions at a time
