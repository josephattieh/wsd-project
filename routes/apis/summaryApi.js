import { getApiSummary, getApiSummarySpecific } from "../../services/reportsService.js"

//past 7 days
const reportPastSeven = async ({ response }) => {

    const data = await getApiSummary();
    response.body = data;

}

//current day

const reportDay = async ({ response, params }) => {

    const day = params.day;
    const month = params.month;
    const year = params.year;

    const data = await getApiSummarySpecific(day, year, month);
    response.body = data;
}

export { reportPastSeven, reportDay }