import express from 'express';
import { registerStaff, registerStudent, allStudents, allStaff, updateStaff, updateStudent, deleteStaff, deleteStudent, todayAttendanceStaff, todayAttendanceStudents, attendenceHistoryStaff, attendanceHistoryStudents } from '../controllers/admin.controller.js';
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

router.get('/allStudents', allStudents);    
router.get('/allStaff', allStaff);
router.put('/updateStaff', updateStaff);
router.put('/updateStudent', updateStudent);
router.delete('/deleteStaff', deleteStaff);
router.delete('/deleteStudent', deleteStudent);
router.get('/attendance/today/staff', todayAttendanceStaff);
router.get('/attendance/today/students', todayAttendanceStudents);
router.get('/attendance/history/staff', attendenceHistoryStaff);
router.get('/attendance/history/students', attendanceHistoryStudents);



export default router;
