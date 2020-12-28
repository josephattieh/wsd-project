import { Router } from "../deps.js";
import { log_in,sign_up, log_out } from "./apis/usersApi.js";
import { reportMorning,reportEvening, updateSumaryPage} from "./apis/reportsApi.js";
import { showLogIn, showSignUp} from "./controllers/usersController.js"
import {showLanding} from "./controllers/landingController.js"

import { showReporting, showReportingMorning, showReportingEvening,showSummary} from "./controllers/reportingController.js"
import { reportDay , reportPastSeven } from "./apis/summaryApi.js";
const router = new Router();

router.get('/', showLanding);
router.get('/auth/login', showLogIn )
router.get('/auth/registration',showSignUp );
router.post('/auth/login', log_in);
router.post('/auth/logout', log_out);
router.get('/auth/logout', log_out);
router.post('/auth/registration', sign_up);

router.get('/behavior/reporting',showReporting );

router.get('/behavior/reporting/morning',showReportingMorning );
router.post('/behavior/reporting/morning',reportMorning );
router.get('/behavior/reporting/evening',showReportingEvening );
router.post('/behavior/reporting/evening',reportEvening);



router.get("/api/summary",reportPastSeven ) ;

router.get("/api/summary/:year/:month/:day", reportDay ) ;

router.get('/behavior/summary',showSummary);
router.post('/behavior/summary', updateSumaryPage);

export { router };