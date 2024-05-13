const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const RABIT_MQ_URI = process.env.RABIT_MQ_URI;

const userTypes = {
  Admin: "Admin",
  Instructor: "Instructor",
  Student: "Student",

};
const mainRoutes = {
  courses: "/api/courses",
  docs: "/api-docs",
};
const routeUrls = {
  updateUserPassword: "/updateUserPassword",
  register: "/register",
  login: "/login",
  timeTableCreate: "/create",
  timeTableFind: "/find/:id",
  timeTableUpdate: "/update/:id",
  roomCreate: "/create",
  roomFind: "/find",
  roomFindById: "/find/:id",
  roomUpdate: "/update/:id",
  roomDelete: "/delete/:id",
  resourceCreate: "/create",
  resourceFind: "/find",
  resourceFindById: "/find/:id",
  resourceUpdate: "/update/:id",
  resourceDelete: "/delete/:id",
  enrollCourse: "/enroll",
  enrollsByStudent: "/find/student/:id",
  enrollsByCourse: "/find/course/:id",
  enrollsStudentWithdraw: "/withdraw",
  courseCreate: "/create",
  courseFind: "/find",
  courseFindById: "/find/:id",
  courseUpdate: "/update/:id",
  courseDelete: "/delete/:id",
};

const allowedUrls = {
  [userTypes.Admin]: [
    { url: routeUrls.updateUserPassword, methods: ["PUT"] },
    { url: routeUrls.timeTableCreate, methods: [ "POST"]  },
    { url: routeUrls.timeTableFind, methods: ["GET"]  },
    { url: routeUrls.timeTableUpdate, methods: ["PUT"]  },
    { url: routeUrls.roomCreate, methods: ["POST"]  },
    { url: routeUrls.roomFind, methods: ["GET"]  },
    { url: routeUrls.roomFindById, methods: ["GET"]  },
    { url: routeUrls.roomUpdate, methods: ["PUT"]  },
    { url: routeUrls.roomDelete, methods: ["DELETE"]  },
    { url: routeUrls.resourceCreate, methods: ["POST"]  },
    { url: routeUrls.resourceFind, methods: ["GET"]  },
    { url: routeUrls.resourceFindById, methods: ["GET"]  },
    { url: routeUrls.resourceUpdate, methods: ["PUT"]  },
    { url: routeUrls.resourceDelete, methods: ["DELETE"]  },
    { url: routeUrls.enrollCourse, methods: ["POST"]  },
    { url: routeUrls.enrollsByStudent, methods: ["GET"]  },
    { url: routeUrls.enrollsByCourse, methods: ["GET"]  },
    { url: routeUrls.enrollsStudentWithdraw, methods: ["DELETE"]  },
    { url: routeUrls.courseCreate, methods: ["POST"]  },
    { url: routeUrls.courseFind, methods: ["GET"]  },
    { url: routeUrls.courseFindById, methods: ["GET"]  },
    { url: routeUrls.courseUpdate, methods: ["PUT"]  },
    { url: routeUrls.courseDelete, methods: ["DELETE"]  },
  ],
  [userTypes.Student]: [
    { url: routeUrls.updateUserPassword, methods: ["PUT"] },
    { url: routeUrls.courseFind, methods: ["GET"]  },
    { url: routeUrls.enrollCourse, methods: ["POST"]  },
    { url: routeUrls.enrollsByStudent, methods: ["GET"]  },
    { url: routeUrls.enrollsStudentWithdraw, methods: ["DELETE"]  },
  ],
};



module.exports = {
  PORT,
  MONGO_URI,
  JWT_SECRET,
  RABIT_MQ_URI,
  allowedUrls,
  routeUrls,
  userTypes,
  mainRoutes,
};
