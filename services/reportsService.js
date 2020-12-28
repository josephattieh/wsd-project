import { executeQuery } from "../database/database.js";

//generic methods used
const format = (data) => {
    if (data == undefined || data == null) {
        return "No data for the given duration.";
    }
    return Number(data).toFixed(2);
}
const retrieveDataNoUser = async (dayUpper, dayLower, monthUpper, monthLower, yearUpper, yearLower) => {
    var dateLower = `${yearLower}-${monthLower}-${dayLower}-`;
    var dateUpper = `${yearUpper}-${monthUpper}-${dayUpper}`;
    const average_sleep_duration = await executeQuery("SELECT AVG(sleep_duration) FROM reports WHERE date>=$1 AND date<=$2 ", dateLower, dateUpper);
    const average_sleep_quality = await executeQuery("SELECT AVG(sleep_quality) FROM reports WHERE date>=$1 AND date<=$2 ", dateLower, dateUpper);
    const average_generic_mood = await executeQuery("SELECT AVG(generic_mood) FROM reports WHERE date>=$1 AND date<=$2 ", dateLower, dateUpper);
    const average_sport_duration = await executeQuery("SELECT AVG(sport_duration) FROM reports WHERE date>=$1 AND date<=$2 ", dateLower, dateUpper);
    const average_studying_duration = await executeQuery("SELECT AVG(studying_duration) FROM reports WHERE date>=$1 AND date<=$2 ", dateLower, dateUpper);
    const average_eating_quality = await executeQuery("SELECT AVG(eating_quality) FROM reports WHERE date>=$1 AND date<=$2 ", dateLower, dateUpper);
    return {
        average_sleep_duration: format(average_sleep_duration.rowsOfObjects()[0].avg),
        average_sleep_quality: format(average_sleep_quality.rowsOfObjects()[0].avg),
        average_generic_mood: format(average_generic_mood.rowsOfObjects()[0].avg),
        average_sport_duration: format(average_sport_duration.rowsOfObjects()[0].avg),
        average_studying_duration: format(average_studying_duration.rowsOfObjects()[0].avg),
        average_eating_quality: format(average_eating_quality.rowsOfObjects()[0].avg)
    }
}
const retrieveData = async (dayUpper, dayLower, monthUpper, monthLower, yearUpper, yearLower, user_id) => {
    var dateLower = `${yearLower}-${monthLower}-${dayLower}-`;
    var dateUpper = `${yearUpper}-${monthUpper}-${dayUpper}`;
    const average_sleep_duration = await executeQuery("SELECT AVG(sleep_duration) FROM reports WHERE date>=$1 AND date<=$2 AND user_id=$3", dateLower, dateUpper, user_id);
    const average_sleep_quality = await executeQuery("SELECT AVG(sleep_quality) FROM reports WHERE date>=$1 AND date<=$2 AND user_id=$3", dateLower, dateUpper, user_id);
    const average_generic_mood = await executeQuery("SELECT AVG(generic_mood) FROM reports WHERE date>=$1 AND date<=$2 AND user_id=$3", dateLower, dateUpper, user_id);
    const average_sport_duration = await executeQuery("SELECT AVG(sport_duration) FROM reports WHERE date>=$1 AND date<=$2 AND user_id=$3", dateLower, dateUpper, user_id);
    const average_studying_duration = await executeQuery("SELECT AVG(studying_duration) FROM reports WHERE date>=$1 AND date<=$2 AND user_id=$3", dateLower, dateUpper, user_id);
    const average_eating_quality = await executeQuery("SELECT AVG(eating_quality) FROM reports WHERE date>=$1 AND date<=$2 AND user_id=$3", dateLower, dateUpper, user_id);
    return {
        average_sleep_duration: format(average_sleep_duration.rowsOfObjects()[0].avg),
        average_sleep_quality: format(average_sleep_quality.rowsOfObjects()[0].avg),
        average_generic_mood: format(average_generic_mood.rowsOfObjects()[0].avg),
        average_sport_duration: format(average_sport_duration.rowsOfObjects()[0].avg),
        average_studying_duration: format(average_studying_duration.rowsOfObjects()[0].avg),
        average_eating_quality: format(average_eating_quality.rowsOfObjects()[0].avg)
    }
}

const checkIfReportedToday = async (user_id) => {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    console.log(user_id, day, month, year);
    const morning = await executeQuery("SELECT * FROM reports WHERE user_id =$1 AND day=$2 AND month=$3 AND year=$4 AND is_morning=TRUE", user_id, day, month, year);
    const evening = await executeQuery("SELECT * FROM reports WHERE user_id =$1 AND day=$2 AND month=$3 AND year=$4 AND is_morning=FALSE", user_id, day, month, year);
    var msg = "";
    if (morning) {
        const v = morning.rowsOfObjects();
        console.log("values", v);
        if (v.length > 0)
            msg = msg + "You reported for today's morning! \n";
    }
    if (evening) {
        const vv = evening.rowsOfObjects();
        console.log("values", vv);
        if (vv.length > 0)
            msg = msg + "You reported for today's evening!"
    }
    return msg;
}
const addMorningReport = async (user_id, day, month, year, sleep_duration, sleep_quality, generic_mood) => {
    var date = `${year}-${month}-${day}`;
    const res = await executeQuery("SELECT * FROM reports WHERE user_id =$1 AND day=$2 AND month=$3 AND year=$4 AND date=$5 AND is_morning=TRUE", user_id, day, month, year, date);
    if (res) {
        //the user has already reported, delete the entry
        const v = res.rowsOfObjects();
        console.log(v);
        for (var i = 0; i < v.length; i++) {
            await executeQuery("DELETE FROM reports WHERE id = $1", v[i].id);

        }
    }
    await executeQuery("INSERT INTO reports (user_id,day, month, year,sleep_duration, sleep_quality, generic_mood, date, is_morning) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)", user_id, day, month, year, sleep_duration, sleep_quality, generic_mood, date);

}
const addEveningReport = async (user_id, day, month, year, sport_duration, studying_duration, eating_quality, generic_mood) => {
    var date = `${year}-${month}-${day}`;

    const res = await executeQuery("SELECT * FROM reports WHERE user_id =$1 AND day=$2 AND month=$3 AND year=$4 AND is_morning=FALSE", user_id, day, month, year);
    if (res) {

        //the user has already reported, delete the entry
        const v = res.rowsOfObjects();
        console.log(v);

        for (var i = 0; i < v.length; i++) {
            await executeQuery("DELETE FROM reports WHERE id = $1", v[i].id);
        }
    }
    await executeQuery("INSERT INTO reports (user_id,day, month, year,sport_duration, studying_duration,eating_quality, generic_mood, date, is_morning) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, FALSE)", user_id, day, month, year, sport_duration, studying_duration, eating_quality, generic_mood, date);
}

//api to be accessed by anyone
const getApiSummary = async () => {
    // /api
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();


    var dateLower = new Date();
    dateLower.setDate(date.getDate() - 7);
    var dayLower = dateLower.getDate();
    var monthLower = dateLower.getMonth() + 1;
    var yearLower = dateLower.getFullYear();
    const data = await retrieveDataNoUser(day, dayLower, month, monthLower, year, yearLower);
    return data;

}
const getApiSummarySpecific = async (day, year, month) => {
    // /api/year/month/day
    var date = `${year}-${month}-${day}`;
    const average_sleep_duration = await executeQuery("SELECT AVG(sleep_duration) FROM reports WHERE date=$1 ", date);
    const average_sleep_quality = await executeQuery("SELECT AVG(sleep_quality) FROM reports WHERE date=$1 ", date);
    const average_generic_mood = await executeQuery("SELECT AVG(generic_mood) FROM reports WHERE date=$1 ", date);
    const average_sport_duration = await executeQuery("SELECT AVG(sport_duration) FROM reports WHERE date=$1 ", date);
    const average_studying_duration = await executeQuery("SELECT AVG(studying_duration) FROM reports WHERE date=$1 ", date);
    const average_eating_quality = await executeQuery("SELECT AVG(eating_quality) FROM reports WHERE date=$1 ", date);
    return {
        average_sleep_duration: format(average_sleep_duration.rowsOfObjects()[0].avg),
        average_sleep_quality: format(average_sleep_quality.rowsOfObjects()[0].avg),
        average_generic_mood: format(average_generic_mood.rowsOfObjects()[0].avg),
        average_sport_duration: format(average_sport_duration.rowsOfObjects()[0].avg),
        average_studying_duration: format(average_studying_duration.rowsOfObjects()[0].avg),
        average_eating_quality: format(average_eating_quality.rowsOfObjects()[0].avg)
    }

}
//api to be accessed by each user
const getStatisticsPerWeekPerUser = async (user_id, w, y) => {

    var correct = new Date(y, 0, 1);
    while (correct.getDay() != 1) {
        correct.setDate(correct.getDate() + 1);
    }
    var d = ((w - 2) * 7) + correct.getDate(); 
    var dateLower = new Date(y, 0, d);
    var dayLower = dateLower.getDate();
    var monthLower = dateLower.getMonth() + 1;
    var yearLower = dateLower.getFullYear();
    
    
    var date = new Date(dateLower.setDate(dateLower.getDate() + 6));
    dateLower = new Date(y, 0, d);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    const data = await retrieveData(day, dayLower, month, monthLower, year, yearLower, user_id);
    return data;


}


const getStatisticsPerWeekPerUserDefault = async (user_id) => {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var dateLower = new Date();
    dateLower.setDate(date.getDate() - 7);
    var dayLower = dateLower.getDate();
    var monthLower = dateLower.getMonth() + 1;
    var yearLower = dateLower.getFullYear();
    const data = await retrieveData(day, dayLower, month, monthLower, year, yearLower, user_id);
    return data;
}

const getStatisticsPerMonthPerUserDefault = async (user_id) => {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var dateLower = new Date(date.setMonth(date.getMonth() - 1));
    var dayLower = dateLower.getDate();
    var monthLower = dateLower.getMonth() + 1;
    var yearLower = dateLower.getFullYear();
    console.log("month", day, month, year, dayLower, monthLower, yearLower);

    const data = await retrieveData(day, dayLower, month, monthLower, year, yearLower, user_id);
    return data;

}
const getStatisticsPerMonthPerUser = async (user_id, m, y) => {
    var dateLower = new Date(y, m - 1, 1);
    var dayLower = dateLower.getDate();
    var monthLower = dateLower.getMonth() + 1;
    var yearLower = dateLower.getFullYear();

    var date = new Date(dateLower.setMonth(dateLower.getMonth() + 1));
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    const data = await retrieveData(day, dayLower, month, monthLower, year, yearLower, user_id);
    return data;

}

export { checkIfReportedToday, addMorningReport, addEveningReport, getApiSummary, getApiSummarySpecific, getStatisticsPerWeekPerUser, getStatisticsPerWeekPerUserDefault, getStatisticsPerMonthPerUser, getStatisticsPerMonthPerUserDefault };