import express from 'express';
import { markCheckIn,markCheckOut,submitStudentAttendance,allStudents } from '../controllers/staff.controller.js';

import { upload } from '../middleware/multer.middleware.js';
const router = express.Router();


router.route("/attendance/checkin").post(
        upload.fields([   //middleware provided by 
            {
                name: "checkinPhoto",
                maxCount: 1
            }
        ]),
        markCheckIn
    );  

router.route("/attendance/checkout").post( 
        upload.fields([   //middleware provided by 
            {
                name: "checkoutPhoto",
                maxCount: 1
            }
        ]),
        markCheckOut
    );  

router.route("/attendance/student").post(
        submitStudentAttendance
    );
router.get('/student/all/:teacherId', allStudents);








export default router;
