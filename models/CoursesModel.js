const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  name: String, // Name of the course.
  code: String, // Unique course code.
  description: String, // Unique course code.
  credits: Number, 
  price : Number,
  lecture_count : Number,
  lecture_id : String,
  image_url : String
});
module.exports = mongoose.model("Course", CourseSchema);
