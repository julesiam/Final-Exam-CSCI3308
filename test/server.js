// Imports the server.js file to be tested.
let server = require("../server");
//Assertion (Test Driven Development) and Should, Expect(Behaviour driven development) library
let chai = require("chai");
// Chai HTTP provides an interface for live integration testing of the API's.
let chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp); 
const { expect } = chai;
var assert = chai.assert;



describe("Server!", () => {
    it ("Positive test for API search", done => {
        chai
            .request(server)
            .post("/get_feed")
            .send({title: "Broccoli"})
            .end((err, res) => {
                expect(res.text).to.contain('Broccoli & Stilton soup'); //name of 1st result
                expect(res.text).to.contain('Microwave until garlic sizzles, 30 seconds.'); //instructions from 2nd result
                done();
            });
    });

    it ("Positive test for post review", done => {
        chai
            .request(server)
            .post("/post_review")
            .send({user_review: "Ummmmm excuse me I searced for tea not STEAK", meal_id: 52935, meal_name: "Steak Diane"})
            .end((err, res) => {
                expect(res.text).to.contain('Steak Diane');
                expect(res.text).to.contain('Ummmmm excuse me I searced for tea not STEAK');
                done();
            });
    });

    it ("Negative test for API search (no title provided)", done => {
        chai
            .request(server)
            .post("/get_feed")
            .send({title: ""})
            .end((err, res) => {
                expect(res.text).to.contain('No title was provided for the search.');
                done();
            });
    });

    it ("Postive Test for review search (only passes with review_db initialized)", done => {
        chai
            .request(server)
            .post("/search_reviews")
            .send({searchword: "tea"})
            .end((err, res) => {
                expect(res.text).to.contain('Steak Diane');
                expect(res.text).to.contain('Ummmmm excuse me I searced for tea not STEAK');
                done();
            });
    });

    it ("Positive test for display all reviews (only passes with review_db initialized)", done => {
        chai
            .request(server)
            .get("/reviews")
            .end((err, res) => {
                expect(res.text).to.contain('Steak Diane');
                expect(res.text).to.contain('Ummmmm excuse me I searced for tea not STEAK');
                done();
            });
    });

    it ("Negative test for display all reviews", done => {
        chai
            .request(server)
            .get("/reviews")
            .end((err, res) => {
                expect(res.text).to.not.contain('No title was provided for the search.');
                expect(res.text).to.not.contain('Simply mix all dry ingredients with wet ingredients and blend altogether.');
                done();
            });
    });
});