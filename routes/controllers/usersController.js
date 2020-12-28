const showLogIn = async ({ render, session, response }) => {

  const authenticated = await session.get("authenticated");

  if (!authenticated) {
    var feedbacks = await session.get("feedback");
    var email = await session.get("email");

    if (!feedbacks) {
      feedbacks = [];
    }
    console.log(feedbacks);

    await session.set("feedback", [])
    await session.set("email", "")
    render('./users/login.ejs', { feedbacks: feedbacks, email: email });

  }
  else {
    var user = await session.get("user");
    render("./users/message_loggedin.ejs", { email: user.email });

  }



};

const showSignUp = async ({ render, session, response }) => {
  const authenticated = await session.get("authenticated");
  if (!authenticated) {
    var feedbacks = await session.get("feedback");
    var email = await session.get("email");
    if (!feedbacks) {
      feedbacks = [];
    }
    console.log(feedbacks);

    await session.set("feedback", [])
    await session.set("email", "")

    render('./users/signup.ejs', { feedbacks: feedbacks, email: email });

  }
  else {
    // response.redirect("../behavior/reporting");
    var user = await session.get("user");
    render("./users/message_loggedin.ejs", { email: user.email });

  }
};

export { showLogIn, showSignUp };