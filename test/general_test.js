import { app } from "../app.js";
import { showLanding } from "../routes/controllers/landingController.js";
import { showReporting, showSummary } from "../routes/controllers/reportingController.js";
import { errorMiddleware } from "../middlewares/middlewares.js";
import { getMoodChange } from "../services/landingService.js";
import { executeQuery } from "../database/database.js";
import { assertEquals, superoak } from "../deps.js";


Deno.test({
    name: "Database works (2 tables)",
    async fn() {
        const res = await executeQuery("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public'");
        const rows = res.rowsOfObjects().map(v => v.tablename);
        assertEquals(rows.includes("users"), true);
        assertEquals(rows.includes("reports"), true);
    },
    sanitizeResources: false,
    sanitizeOps: false


});
Deno.test({
    name: "The landing page is rendered correctly",
    async fn() {
        let usedParameterValue = "./main.ejs";

        const myRenderFunction = (parameterValue) => {
            usedParameterValue = parameterValue;
        };

        const myContext = {
            render: myRenderFunction
        };
        await showLanding(myContext);
    },
    sanitizeResources: false,
    sanitizeOps: false
});


Deno.test({
    name: "The user is able to access the registration page.",
    async fn() {

        let testClient = await superoak(app);
        var response = await testClient
            .get("/auth/registration");
        assertEquals(response.text.includes('type="email"'), true)
        assertEquals(response.text.includes('type="password"'), true)


    },

    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "The user is able to access the login page.",
    async fn() {

        let testClient = await superoak(app);
        var response = await testClient
            .get("/auth/login");
        assertEquals(response.text.includes('type="email"'), true)
        assertEquals(response.text.includes('type="password"'), true)


    },

    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Any user is able to access the api page.",
    async fn() {

        let testClient = await superoak(app);
        var response = await testClient
            .get("/api/summary");
        console.log(response.text);
        assertEquals(response.text.includes("average_sleep_duration"), true);
        assertEquals(response.text.includes("average_sleep_quality"), true);
        assertEquals(response.text.includes("average_generic_mood"), true);
        assertEquals(response.text.includes("average_sport_duration"), true);
        assertEquals(response.text.includes("average_studying_duration"), true);
        assertEquals(response.text.includes("average_eating_quality"), true);

    },

    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Any user is able to access the api page using a date.",
    async fn() {

        const y = Math.floor(Math.random() * 1000+1000);
        const m = Math.floor(Math.random() * 12);
        const d = Math.floor(Math.random() * 12);
        console.log(y, m, d);
        let testClient = await superoak(app);
        var response = await testClient
            .get(`/api/summary/${y}/${m}/${d}`);

        assertEquals(response.text.includes("average_sleep_duration"), true);
        assertEquals(response.text.includes("average_sleep_quality"), true);
        assertEquals(response.text.includes("average_generic_mood"), true);
        assertEquals(response.text.includes("average_sport_duration"), true);
        assertEquals(response.text.includes("average_studying_duration"), true);
        assertEquals(response.text.includes("average_eating_quality"), true);

    },

    sanitizeResources: false,
    sanitizeOps: false
});


Deno.test({
    name: "Test rendering of the reporting page.",
    async fn() {
        let usedParameterValue = null;

        const myRenderFunction = (parameterValue) => {
            usedParameterValue = parameterValue;
        };
        const getAuthenticated = (param) => {
            return true;
        };
        const myContext = {
            session: {
                get: getAuthenticated
            },
            render: myRenderFunction,
            response: {}
        }
        const next = () => { }
        await showReporting(myContext);


    },

    sanitizeResources: false,
    sanitizeOps: false
});


Deno.test({
    name: "Test rendering of the summary page.",
    async fn() {
        let usedParameterValue = null;

        const myRenderFunction = (parameterValue) => {
            usedParameterValue = parameterValue;
        };
        const getAuthenticated = (param) => {
            return true;
        };
        const myContext = {
            session: {
                get: getAuthenticated
            },
            render: myRenderFunction,
            response: {}
        }
        const next = () => { }
        await showSummary(myContext);


    },

    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test("Error Middleware Test", async () => {
    const fun = () => {
    };
    const fun2 = () => {
        throw Error('hello!');
    };
    await errorMiddleware(fun, fun);
    await errorMiddleware(fun, fun2);
});

Deno.test("serveStaticFilesMiddleware", async () => {
    const testClient = await superoak(app);
    const resp = await testClient.get("/static/static.js");
    assertEquals(resp.text, "OK");

});


Deno.test("requestTimingMiddleware ", async () => {
    const testClient = await superoak(app);
    await testClient.post("/its_a_test_Post");

});

Deno.test("Mood change trend ", async () => {
    const a = await getMoodChange();
    assertEquals(a.text.includes("look"), true);
});
