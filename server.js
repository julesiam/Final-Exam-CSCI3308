// Load the modules
var express = require('express'); //Express - a web application framework that provides useful utility functions like 'http'
var app = express();
var bodyParser = require('body-parser'); // Body-parser -- a library that provides functions for parsing incoming requests
app.use(bodyParser.json());              // Support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Support encoded bodies
const axios = require('axios');

//Create Database Connection
var pgp = require('pg-promise')({});
const dbConfig = {
	host: process.env.DB_IP,
	port: process.env.DB_PORT,
	database: process.env.DB,
	user:  process.env.DB_USER,
	password: process.env.DB_PASSWORD
};

const isProduction = process.env.NODE_ENV === 'production';
const dbConfig = isProduction ? process.env.DATABASE_URL : dev_dbConfig;

if (isProduction) {
	pgp.pg.defaults.ssl = {rejectUnauthorized: false};
}

let db = pgp(dbConfig);


// Set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));// Set the relative path; makes accessing the resource directory easier


// Home page
app.get('/', function(req, res) {
  res.render('pages/main.ejs', {
    my_title: "TheMealDB search",
    items: '',
    error: false,
    message: ''
  });
});

app.get('/main', function(req, res) {
  res.render('pages/main.ejs', {
    my_title: "TheMealDB search",
    items: '',
    error: false,
    message: ''
  });
});

// //Request data from API for given search criteria
app.post('/get_feed', function(req, res) {
    var title = req.body.title; //title is name of meal to search for
    var url1 = `https://www.themealdb.com/api/json/v1/1/search.php?s=${title}`;
    if(title) {
        axios({
            url: url1,
            method: 'GET',
            dataType:'json',
        })
        .then(items => {
          res.render('pages/main', {
                my_title: "TheMealDB reviews",
                items: items.data.meals,
                error: false,
                message: ''
            });
        })

        .catch(error => {
          console.log(error);
          res.render('pages/main',{
            my_title: "TheMealDB reviews",
            items: '',
            error: true,
            message: 'error'
          })
        });


    }
    else {
    // TODO: Render the home page and include an error message (e.g., res.render(...);); Why was there an error? When does this code get executed? Look at the if statement above
    // Stuck? On the web page, try submitting a search query without a search term
        res.render('pages/main', {
            my_title: "TheMealDB reviews",
            items: '',
            error: true,
            message: 'No title was provided for the search.'
        });
    }
});

//ADDS REVIEWS TO THE DB
app.post('/post_review', function(req, res) {
    user_review = req.body.user_review;
    meal_id = req.body.meal_id;
    meal_name = req.body.meal_name;
    date = new Date();
    date = date.toLocaleDateString() + " " + date.toLocaleTimeString();
    //db insert statement
    var insert_statement = `INSERT INTO meal_reviews(meal_id, meal_name, review, review_date) VALUES(${meal_id},'${meal_name}','${user_review}','${date}');`;
    var reviews_query = 'select * from meal_reviews;';

    db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(reviews_query)
        ]);
    })
    .then(function (item) {
        res.render('pages/reviews.ejs', {
            my_title: "TheMealDB reviews",
            items: item[1],
            error: false,
            message: ''
            })

    })
    .catch(function (err) {
        console.log('error', err);
        res.render('pages/main.ejs', {
            my_title: "TheMealDB reviews",
            items: '',
            error: true,
            message: 'Error: Apostrophes are not supported in reviews.'
            })
    })
    
});

//RETURNS ALL REVIEWS
app.get('/reviews', function(req, res) {
	var reviews_query = 'select * from meal_reviews;';
    
    db.any(reviews_query)
        .then(function (rows) {
            res.render('pages/reviews.ejs', {
                my_title: "TheMealDB reviews",
                items: rows,
                error: false,
                message: ''
                })

        })
        .catch(function (err) {
            console.log('error', err);
            res.render('pages/reviews.ejs', {
                my_title: "TheMealDB reviews",
                items: '',
                error: true,
                message: ''
              })
        })
});

//SEARCH REVIEWS
app.post('/search_reviews', function(req, res) {
    var search_term = req.body.searchword;
	var reviews_query = "select * from meal_reviews WHERE LOWER(meal_name) LIKE LOWER('%"+ search_term +"%');"; // Write a SQL query to retrieve the color message for the selected color

    db.any(reviews_query)
        .then(function (rows) {
            res.render('pages/reviews.ejs', {
                my_title: "TheMealDB reviews",
                items: rows,
                error: false,
                message: ''
                })

        })
        .catch(function (err) {
            console.log('error', err);
            res.render('pages/reviews.ejs', {
                my_title: "TheMealDB reviews",
                items: '',
                error: true,
                message: ''
              })
        })
});

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});