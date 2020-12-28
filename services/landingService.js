import { executeQuery } from "../database/database.js";

const getMoodChange = async () => {
    const today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();

    const average_generic_mood_today = await executeQuery("SELECT AVG(generic_mood) FROM reports WHERE day=$1 AND  month =$2 AND year=$3 ", day, month, year);


    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var day2 = yesterday.getDate();
    var month2 = yesterday.getMonth() + 1;
    var year2 = yesterday.getFullYear();

    const average_generic_mood_yesterday = await executeQuery("SELECT AVG(generic_mood) FROM reports WHERE day=$1 AND  month =$2 AND year=$3 ", day2, month2, year2);

    const data = { average_generic_mood_today: Number(average_generic_mood_today.rowsOfObjects()[0].avg).toFixed(2), average_generic_mood_yesterday: Number(average_generic_mood_yesterday.rowsOfObjects()[0].avg).toFixed(2), text: "" };
    if (data.average_generic_mood_today == 0 || data.average_generic_mood_yesterday == 0) {
        data.text = "It looks that there are missing trends..";
    } else
        if (data.average_generic_mood_today < data.average_generic_mood_yesterday) {
            data.text = "Things are looking gloomy today";
        }
        else {
            data.text = "Things are looking brighter today";

        }
    return data;
}

export { getMoodChange };