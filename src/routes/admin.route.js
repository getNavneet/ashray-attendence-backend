import express from 'express';
import { registerStaff, registerStudent, allStudents, allStaff, updateStaff, updateStudent, deleteStaff, deleteStudent, todayAttendanceStaff, todayAttendanceStudents,createClass, getAllClasses,getStaffAttendanceById,getStudentAttendanceById  } from '../controllers/admin.controller.js';
import { upload } from '../middleware/multer.middleware.js';
const router = express.Router();

    router.route("/register/staff").post(
        upload.fields([   //middleware provided by 
            {
                name: "photo",
                maxCount: 1
            }
        ]),
        registerStaff
    );

router.route("/register/student").post(
        upload.fields([   //middleware provided by 
            {
                name: "photo",
                maxCount: 1
            }
        ]),
        registerStudent
    );  

router.post('/createClass', createClass);
router.get('/getAllClass', getAllClasses);
router.get('/allStudents', allStudents);    
router.get('/allStaff', allStaff); 
router.route("/updateStaff").put(
    upload.fields([   //middleware provided by 
        {
            name: "photo",
            maxCount: 1
        }
    ]),
    updateStaff
);  

router.route("/updateStudent").put(
    upload.fields([   //middleware provided by 
        {
            name: "StudentPhoto",
            maxCount: 1
        }
    ]),
    updateStudent
);


// router.route("/updateStudent").put(
//     upload.single("StudentPhoto"),  // Matches frontend field name
//     updateStudent
//   );
router.delete('/deleteStaff', deleteStaff);
router.delete('/deleteStudent', deleteStudent);
router.get('/attendance/today/staff', todayAttendanceStaff);
router.get('/attendance/today/students', todayAttendanceStudents);
router.get('/staffAttendance/history/:staffId', getStaffAttendanceById);
router.get('/StudentAttendance/history/:studentId', getStudentAttendanceById);


export default router;
