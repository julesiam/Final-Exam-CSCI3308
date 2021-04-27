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
      // Add your test cases here
    it ("Postive Test for API search", done => {
        chai
            .request(server)
            .post("/search_reviews")
            .send({searchword: "tacos"})
            .end((err, res) => {
                console.log(res.body);
                // assert.strictEqual(res.body.message, "No title was provided for the search.");
                done();
            });
    });

    // it ("Positive test for division", done => {
    //     chai
    //         .request(server)
    //         .post("/post_review")
    //         .send({num1: 6, num2: 2})
    //         .end((err, res) => {
    //             assert.strictEqual(res.body.quotient, 3);
    //             done();
    //         });
    // });
});