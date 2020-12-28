import { superoak, assertEquals, assertNotEquals } from "../deps.js";
import { app } from "../app.js";
import { executeQuery } from "../database/database.js"

function generate(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


function nextInt(min, max) {
  return Math.random() * (max - min) + min;
}

const data = {};

Deno.test({
  name: "The user is able to access main page.",
  async fn() {

    let testClient = await superoak(app);
    var response = await testClient
      .get("/");
    let headers = response.headers["set-cookie"];
    data.cookie = headers.split(";")[0];;

  },

  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "The user is able to sign up given correct email and password.",
  async fn() {



    data.email = generate(10) + "@gmail.com";
    data.password = generate(10);
    console.log(data);
    let testClient = await superoak(app);
    var response = await testClient
      .post("/auth/registration")
      .set('cookie', data.cookie)
      .send(`email=${data.email}&password=${data.password}&verification=${data.password}`);
    let headers = response.headers["set-cookie"];
    if (headers)
      data.cookie = headers.split(";")[0];



  },
  sanitizeResources: false,
  sanitizeOps: false
});


Deno.test({
  name: "The Sign Up adds an entry to the database where the password is not in plaintext",
  async fn() {
    //if no error till now, check database entry
    const res = await executeQuery("SELECT * from users where email =$1", data.email.toLowerCase());
    const rows = res.rowsOfObjects();
    assertNotEquals(rows, undefined);
    assertNotEquals(rows, null);
    assertEquals(rows.length, 1);
    assertNotEquals(rows[0].password, data.password);
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "The user can login and access the reports page",
  async fn() {


    let testClient = await superoak(app);
    try {
      const response = await testClient
        .post("/auth/login")
        .set("Cookie", data.cookie)
        .send(`email=${data.email}&password=${data.password}`).expect(200);
    }
    catch (Error) {
    }

    testClient = await superoak(app);

    let resp = await testClient
      .get(`/behavior/reporting`)
      .set("Cookie", data.cookie)
      .expect(200);
    console.log("Aki");


  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "The user cannot login with a wrong email/password",
  async fn() {
    var email = generate(10) + "@gmail.com";
    var password = generate(10);

    let testClient = await superoak(app);
    try {
      const response = await testClient
        .post("/auth/login")
        .send(`email=${email}&password=${password}`).expect(200);
    }
    catch (Error) {
    }

    testClient = await superoak(app);

    let resp = await testClient
      .get(`/behavior/reporting`);
    assertEquals(resp.text.includes('<a href="../../../auth/login" >Login</a>'), true);
    console.log("Aki");


  },
  sanitizeResources: false,
  sanitizeOps: false
});


Deno.test({
  name: "The user can login and access the reports morning page",
  async fn() {

    let testClient = await superoak(app);
    try {
      const response = await testClient
        .post("/auth/login")
        .set("Cookie", data.cookie)
        .send(`email=${data.email}&password=${data.password}`).expect(200);
    }
    catch (Error) {

    }

    testClient = await superoak(app);
    let resp = await testClient
      .get(`/behavior/reporting`)
      .set("Cookie", data.cookie)
      .expect(200);

    testClient = await superoak(app);
    resp = await testClient
      .get(`/behavior/reporting/morning`)
      .set("Cookie", data.cookie)
      .expect(200);

    assertEquals(resp.text.includes('Morning'), true)
    assertEquals(resp.text.includes('<form method="POST" content="reporting/morning">'), true)


  },
  sanitizeResources: false,
  sanitizeOps: false
});


Deno.test({
  name: "The user can login and access the reports evening page",
  async fn() {

    let testClient = await superoak(app);
    try {
      const response = await testClient
        .post("/auth/login")
        .set("Cookie", data.cookie)
        .send(`email=${data.email}&password=${data.password}`).expect(200);
    }
    catch (Error) {

    }

    testClient = await superoak(app);
    let resp = await testClient
      .get(`/behavior/reporting`)
      .set("Cookie", data.cookie)
      .expect(200);


    testClient = await superoak(app);
    resp = await testClient
      .get(`/behavior/reporting/evening`)
      .set("Cookie", data.cookie)
      .expect(200);

    assertEquals(resp.text.includes('Evening'), true)
    assertEquals(resp.text.includes('<form method="POST" content="reporting/evening">'), true)


  },
  sanitizeResources: false,
  sanitizeOps: false
});



Deno.test({
  name: "The user can login and access the user specific summary page",
  async fn() {

    let testClient = await superoak(app);
    try {
      const response = await testClient
        .post("/auth/login")
        .set("Cookie", data.cookie)
        .send(`email=${data.email}&password=${data.password}`).expect(200);
    }
    catch (Error) {

    }

    testClient = await superoak(app);
    let resp = await testClient
      .get(`/behavior/summary`)
      .set("Cookie", data.cookie)
      .expect(200);

    assertEquals(resp.text.includes('Summary'), true)
    assertEquals(resp.text.includes('<form method="POST" content="/behavior/summary">'), true)


  },
  sanitizeResources: false,
  sanitizeOps: false
});
