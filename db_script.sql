DROP TABLE IF EXISTS meal_reviews CASCADE;
CREATE TABLE IF NOT EXISTS meal_reviews (
    review_id SERIAL PRIMARY KEY,
    meal_id INT,       /* ID of the meal                */
    meal_name VARCHAR(50),      /* Final score of the game for the Buffs         */
    review VARCHAR(500),        /* Review (max length is 500) */
    review_date VARCHAR(60)  /* Date of the review                             */
);