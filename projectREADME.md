GET Request to /api -> serves up a json representation of all the available endpoints of the api

GET Request to /api/topics -> serves an array of all topics
NO queries

GET Request to /api/articles -> serves an array of all articles
Queries: author, topic, sort_by, order
/api/articles?author=&topic=

GET Request to /api/articles/:article_id -> serves a specified article
NO queries

PATCH Request to /api/articles/:article_id": Increments the vote count on specified article. Can be positive or negative increment. Serves updated article. Accepts patch in following format: { "inc_votes": 100 }
Responds with article with incriment applied

GET Request to /api/articles/:article_id/comments" -> serves comments on specified article
Queries: sort-by, order,
/api/articles/:article_id/comments?author=

POST Request to /api/articles/:article_id/comments -> Adds new comment to database when posted in the format below. Serves posted comment
Must be valid username and object keys as follows:
{
"author": "tickle122",
"body": "example of a comment"
}
Responds with posted comment.

GET Request to /api/comments/comment_id" -> serves comment specified

DELETE Request to /api/comments/comment_id -> deletes specified comment. responds with 204 status if successful

# NC_NEWS

## An API serving articles and comments.

## Getting Started

In order to use this API, fork and clone this repo.

You will need to make sure you have all of the software and packages specified in the PREREQUISITES section below before you can use it.

You will then need to specify your databases and data locations in your seed.js and knexfile.js files

to run your tests on your test data...
to run your dev data for inspection...

to run your app for production...

### Prerequisites

for running - express, knex, pg(postgres)
for dev/testing - chai, chai sorted, mocha, nodemon, sams-chai-sorted, supertest

### Installing

### FUNCTIONALITY

### Running Tests

### Depoloyment

### Built With

### Authors

### Acknowledgments

\*/

eg readme

https://github.com/northcoders/fe-student-tracker

Getting The Data

    We are obviously going to need some data in order to build the user interface for the student-tracker. Our react application can then make API requests and display the information on the page. For this purpose, we have built several API end-points for you to retrieve data about the students, block and cohorts at northcoders.

You can find the API here The endpoints serve up the following:
GET /api/students?graduated=[true/false]&block=[block_slug]&cohort=[startingCohort]&sort_by=[name/startingCohort]&order=[asc/desc]

    This serves up an array of students in the below format.

    There are also optional queries to:
        get students depending on whether they have graduated or not.
        get students from a specific block
        get students from a specific cohort
        sort_by a field
        order ascending or descending

{
"\_id": "5bbf0b168902695948a9ec74",
"name": "Lamar Quigley",
"startingCohort": 3,
"currentBlock": "fe"
}

GET /api/students/:id

    This serves up a student object in the form

{
"student": {
"\_id": "5bd0755a064fe4246d4975b9",
"name": "Macey Watsica",
"startingCohort": 11,
"blockHistory": [
{
"_id": "5bd0755a064fe4246d4975b2",
"number": 1,
"name": "Fundamentals",
"slug": "fun"
},
{
"_id": "5bd0755a064fe4246d4975b2",
"number": 1,
"name": "Fundamentals",
"slug": "fun"
},
{
"_id": "5bd0755a064fe4246d4975b3",
"number": 2,
"name": "Back End",
"slug": "be"
}
],
"\_\_v": 0
}
}

The blockHistory is an array representing a student's completion of blocks. Each item represents a block. I.e. The student above will have sat Fundamentals twice and will currently be on Back-End.
PATCH /api/students/:id?progress={true/false}

    Update a student's blockHistory following block reviews. Returns a student in the same format as GET /api/students/:id.

POST /api/students

    You should be able to post a body to this end-point in the below form. This endpoint returns a student in the same format as GET /api/students/:id.

{
"name": "Ant Medina",
"startingCohort": 1
}

GET /api/blocks

    This serves up all blocks in the form:

{
"blocks": [
{
"_id": "5bf69a8e4e52992859f5f758",
"number": 1,
"name": "Fundamentals",
"slug": "fun",
"__v": 0
},
... ]
}

DELETE /api/students/:id

    This will delete a given student by their id.

Quick, before we lose a student!
Tips

    Every time you develop a React app from scratch, you should go through the process of Thinking in React
    The user stories don't necessarily need to be implemented in the order given - sometimes it's best to pick off low hanging fruit first
    React's lifecycle is going to be important!
