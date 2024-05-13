const mongoose = require("mongoose");
const EnrollmentSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the Student enrolled in the course.
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Reference to the Course the student is enrolled in.
});

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
