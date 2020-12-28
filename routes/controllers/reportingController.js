import { checkIfReportedToday } from "../../services/reportsService.js";
import { getStatisticsPerMonthPerUserDefault, getStatisticsPerWeekPerUserDefault } from "../../services/reportsService.js";

const getDateRender = () => {
    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    today = yyyy + "-" + mm + "-" + dd;
    return today;
}

const showReporting = async ({ render, session, response }) => {
    const authenticated = await session.get("authenticated");
    parseInt("REPORTING", authenticated);
    const user = await session.get("user");
    if (!authenticated) {
        session.set("feedback", ["Kindly log in first"])
        response.status = 404;

        render("./users/message_login.ejs");
    }
    else {
        const msg = await checkIfReportedToday(user.id);
        response.status = 200;

        render('./reports/report.ejs', { email: user.email, message: msg });
    }
};

const showReportingMorning = async ({ render, session, response }) => {
    const authenticated = await session.get("authenticated");
    const user = await session.get("user");
    if (!authenticated) {
        session.set("feedback", ["Kindly log in first"])
        response.redirect("/auth/login");
    }
    else {
        const message = await session.get("message");
        render('./reports/morning.ejs', { email: user.email, message: message, today: getDateRender() });
        await session.set("message", "")

    }
}


const showReportingEvening = async ({ render, session, response }) => {
    const authenticated = await session.get("authenticated");
    const user = await session.get("user");
    if (!authenticated) {
        session.set("feedback", ["Kindly log in first"])
        response.redirect("/auth/login");
    }
    else {
        const message = await session.get("message");
        render('./reports/evening.ejs', { email: user.email, message: message, today: getDateRender() });
        await session.set("message", "")
    }
}

const showSummary = async ({ render, session, response }) => {
    const authenticated = await session.get("authenticated");
    const user = await session.get("user");
    if (!authenticated) {
        session.set("feedback", ["Kindly log in first"])
        response.redirect("/auth/login");
    }
    else {
        const data = { week: [], month: [] };
        data.week = await getStatisticsPerWeekPerUserDefault(user.id);
        data.month = await getStatisticsPerMonthPerUserDefault(user.id);
        console.log("summary");
        response.status = 200;
        render('./reports/summary.ejs', { email: user.email, week: data.week, month: data.month, weekdefault: null, monthdefault: null });



    }
}


export { showSummary, showReporting, showReportingMorning, showReportingEvening };