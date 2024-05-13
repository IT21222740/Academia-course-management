const express = require("express");
const {
  createCourse,
  getCourses,
  deleteCourse,
  updateCourse,
  findCourseById,
} = require("../../controllers/coursesController");
// const { checkAllowed } = require("../../middleware/auth");
const { courseCreate, courseFind, courseFindById, courseUpdate, courseDelete } =
  require("../../util/config").routeUrls;

const router = express.Router();

// router.post(courseCreate, checkAllowed, createCourse);
router.post(courseCreate, createCourse);
router.get(courseFind, getCourses);
router.get(courseFindById, findCourseById);
router.put(courseUpdate, updateCourse);
router.delete(courseDelete, deleteCourse);

module.exports = router;
