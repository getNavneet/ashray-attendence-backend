import express from 'express';
import { markCheckIn,markCheckOut,submitStudentAttendance } from '../controllers/staff.controller.js';

import { upload } from '../middleware/multer.middleware.js';
const router = express.Router();


router.route("/attendance/checkin").post(
        upload.fields([   //middleware provided by 
            {
                name: "checkInPhoto",
                maxCount: 1
            }
        ]),
        markCheckIn
    );  

router.route("/attendance/checkout").post( 
        upload.fields([   //middleware provided by 
            {
                name: "checkOutPhoto",
                maxCount: 1
            }
        ]),
        markCheckOut
    );  

router.route("/attendance/student").post(
        submitStudentAttendance
    );







export default router;
