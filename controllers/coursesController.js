const CoursesModel = require("../models/CoursesModel");
const Enrollment = require("../models/EnrollmentModel");
const server  = require("../server");
// import axios from "axios";

// Inside courseDelete controller
const channel = server.serverInstance.getRabbitMqChannel();
if (!channel) {
  // Handle the case where the channel is not yet available
  console.error('RabbitMQ channel is not available');
  return;
}

/**
 * @swagger
 * /api/courses/create:
 *   post:
 *     tags:
 *       - Courses
 *     description: Creates a new course
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Course's details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             code:
 *               type: string
 *             description:
 *               type: string
 *             credits:
 *               type: number
 *           required:
 *             - name
 *             - code
 *             - description
 *             - credits
 *     responses:
 *       200:
 *         description: Course created successfully
 *       400:
 *         description: Please enter all the fields
 *       500:
 *         description: Error
 */
const createCourse = async (req, res, next) => {
  try {
    const { name, code, description, credits ,  price ,lecture_count ,lecture_id , image_url } = req.body;
    if (!name || !code || !description || !credits) {
      const error = new Error("Please enter all the required fields.");
      error.status = 400;
      throw error;
    }
    const courseExists = await CoursesModel.findOne({ code });
    if (courseExists) {
      const error = new Error("Course with this code already exists.");
      error.status = 400;
      throw error;
    }
    const newCourse = new CoursesModel({
      name,
      code,
      description,
      credits,
      price,
      lecture_count,
      lecture_id,
      image_url


    });

    await newCourse.save();
    return res.status(200).json({
      message: "Course created successfully.",
      details: newCourse,
    });
  } catch (error) {
    // // console.error(error);(error);
    next(error);
  }
};

/**
 * @swagger
 * /api/courses/find:
 *   get:
 *     tags:
 *       - Courses
 *     description: Retrieves all courses
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of courses
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               credits:
 *                 type: number
 *       500:
 *         description: Error
 */
const getCourses = async (_req, res, next) => {
  try {
    const courses = await CoursesModel.find().exec();
    res.status(200).json(courses);
  } catch (error) {
    // // console.error(error);(error);
    next(error);
  }
};

/**
 * @swagger
 * /api/courses/find/{id}:
 *   get:
 *     tags:
 *       - Courses
 *     description: Retrieves a course by its id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Course's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A course object
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             code:
 *               type: string
 *             description:
 *               type: string
 *             credits:
 *               type: number
 *       404:
 *         description: Course not found
 *       500:
 *         description: Error
 */
const findCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await CoursesModel.findById(id);

    if (!course) {
      const error = new Error("Course not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json(course);
  } catch (error) {
    // // console.error(error);(error);
    next(error);
  }
};

/**
 * @swagger
 * /api/courses/update/{id}:
 *   put:
 *     tags:
 *       - Courses
 *     description: Updates a course by its id
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Course's id
 *         required: true
 *         type: string
 *       - in: body
 *         name: body
 *         description: Course's updated data
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             code:
 *               type: string
 *             description:
 *               type: string
 *             credits:
 *               type: number
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Error
 */
const updateCourse = async (req, res, next) => {
  try {
    const { name, code, description, credits ,  price ,lecture_count ,lecture_id  } = req.body;
    const { id } = req.params;
    if (!name || !code || !description || !credits) {
      const error = new Error("Please enter all the required fields.");
      error.status = 400;
      throw error;
    }
    const course = await CoursesModel.findByIdAndUpdate(
      id,
      {
        name,
        code,
        description,
        credits,
        price,
        lecture_count,
        lecture_id
      },
      {
        new: true,
      }
    );
    if (!course) {
      const error = new Error("Course not found");
      error.status = 404;
      throw error;
    }
    return res.status(200).json({
      message: "Course updated successfully.",
      details: course,
    });
  } catch (error) {
    // // console.error(error);(error);
    next(error);
  }
};

/**
 * @swagger
 * /api/courses/delete/{id}:
 *   delete:
 *     tags:
 *       - Courses
 *     description: Deletes a course by its id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Course's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             details:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 code:
 *                   type: string
 *                 description:
 *                   type: string
 *                 credits:
 *                   type: number
 *       400:
 *         description: Cannot delete course with enrolled students. Consider un-enrolling them first
 *       500:
 *         description: Error
 */
const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    // 1. Check for enrolled students
    const enrollments = await Enrollment.find({ course_id: id });
    // since we are using microservices, we need to use axios to make a request to the enrollment service to get the enrollments.
    // update the url to the correct url of the enrollment service
    // const enrollments =  await axios.get('http://localhost:3000/api/enrollments/find/course/' + id);

    if (enrollments.length > 0) {
    // TODO: Un comment below  - if you want to use RabbitMQ to send message to the enrollment service
    // serverInstance.channel.sendToQueue(
    //   "deleteEnrolledStudents",
    //   Buffer.from(JSON.stringify({ course_id: id }))
    // );
      const error = new Error(
        "Cannot delete course with enrolled students. Consider un-enrolling them first."
      );
      error.status = 400;
      throw error;
    }


    // 4. Delete the course
    const course = await CoursesModel.findByIdAndDelete(id);
    if (!course) {
      const error = new Error("Course not found");
      error.status = 404;
      throw error;
    }
    res.status(200).json({
      message: "Course deleted successfully.",
      details: course,
    });
  } catch (error) {
    // // console.error(error);(error);
    next(error);
  }
};

module.exports = {
  getCourses,
  createCourse,
  findCourseById,
  updateCourse,
  deleteCourse,
};
