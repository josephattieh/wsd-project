Joseph Attieh

# Documentation:

This is the documentation of the web development project. This document contains all the instructions that you need to do to be able to access the project.

## Database setup

To setup the database locally, just login to ElephantSQL, create an instance (note the database URL), and run the following:
```
CREATE TABLE users (

id SERIAL PRIMARY KEY,

email VARCHAR(320) NOT NULL,

password CHAR(60) NOT NULL CHECK (char_length(password ) >4)

);

CREATE UNIQUE INDEX ON users((lower(email)));

CREATE TABLE reports(

id SERIAL PRIMARY KEY,

user_id INTEGER REFERENCES users(id),

day INTEGER CHECK (day >=1 and day <=31) NOT NULL,

month INTEGER CHECK (month >=1 and sleep_quality <=12) NOT NULL,

year INTEGER CHECK (year >=0 and year <=3000) NOT NULL,

date DATE not null,

sleep_duration DECIMAL,

sleep_quality INTEGER CHECK (sleep_quality >=0 and sleep_quality <=5),

generic_mood INTEGER CHECK (generic_mood >=0 and generic_mood <=5),

sport_duration DECIMAL,

studying_duration DECIMAL,

eating_quality INTEGER CHECK (eating_quality >=0 and eating_quality <=5),

is_morning boolean NOT NULL

);
```
## Guidelines to run the application

### First, set up the DATABASE\_URL\_LOCAL variable to be equal to the database URL you got from ElephantSQL. The configuration used to run the project locally was as follow:

```
$env:DATABASE_URL_LOCAL='postgres://username:password@lallah.db.elephantsql.com:5432/dgphvolt';
```
### Second, launch the application as follows:

```
deno run --allow-env --allow-all --unstable app.js;
```
## Guidelines to run the tests

We developed 20 tests for the application. Those are listed below:

  1. Test whether the database has 2 tables.
  2. Test whether the landing page is rendered correctly.
  3. Test whether the reporting page is rendered correctly.
  4. Test whether the summary page is rendered correctly.
  5. Test whether the user can access the registration page.
  6. Test whether the user can access the login page.
  7. Test whether any user can access the API page.
  8. Test whether any user can access the API page with a date.
  9. Test the Error Middleware.
  10. Test the Serve Static Files Middleware.
  11. Test the Request Timing Middleware.
  12. Test the mood change trend.
  13. Test whether the user is able to access the main page.
  14. Test whether the user is able to sign up given correct email and password.
  15. Test whether the Sign Up adds an entry to the database where the password in this entry is not in plaintext.
  16. Test whether the user can login and access the reports page.
  17. Test whether the user can login with a wrong email/password.
  18. Test whether the user can login and access the reports morning page.
  19. Test whether the user can login and access the reports evening page.
  20. Test whether the user can login and access the user specific summary page.

###  First, set up the DATABASE\_URL variable to be equal to the database URL and the TEST\_ENVIRONMENT to true. The configuration used to run the project locally was as follow(we used a different database for testing, but we can use the same):
```
$env:DATABASE_URL_LOCAL='postgres://username:password@isilo.db.elephantsql.com:5432/hvpjiioe';
```
### Second, launch the application as follows:
```
 deno test --allow-env --allow-all --unstable
```
## Address of the application

The application deployed on Heroku use the _ **PORT** _ environment variable to get the port and the _ **DATABASE\_URL** _ to retrieve the database URL from Heroku.
It can be found below: [https://wsd-josephattieh.herokuapp.com/](https://wsd-josephattieh.herokuapp.com/)

# Epic CheckList

| Epic Checklist | Details |
| --- | --- |
| Application divided into logical folders | Yes, the application was divided into logical folders (config, database, middleware, routes, services, views, etc.) |
| Dependencies exported from deps.js | Yes |
| Project launched from app.js, which is in the root folder | Yes, the application is launched from app.js |
| Configurations in a separate folder (e.g. config) | Yes, the configuration file contains the data required to connect to the database (url and port) which depend on the environment variables. |
| Email and password stored in the database for each user | The user data is stored in the _ **users** _ table. |
| Users can register to the application | Yes |
| Registration form is accessible at /auth/registration | Yes |
| User-specific functionality is structured into logical parts (e.g. userController.js, userService.js) | Yes |
| Application uses session-based authentication | Session-based authentication is used to store the user _ **id** _, _ **email** _ and whether they _ **authenticated** _ or not. |
| Login form is accessible at /auth/login | Yes |
| Authentication functionality is structured into logical parts (e.g. authController.js or part of userController.js, ...). | Yes |
| Application has a logout button that allows the user to logout (logging out effectively means clearing the session) | Yes (can be accessed by both POST and GET requests) |
| The application has middleware that logs all the errors that occurred within the application | Yes |
| The application has middleware that logs all requests made to the application | Yes |
| The application has middleware that controls access to the application | Yes |
| Application has middleware that controls access to static files | Yes |
| Middleware functionality is structured into logical parts (e.g. separate middlewares folder). | Yes |
| Reporting functionality is available under the path /behavior/reporting | Yes |
| Reporting cannot be done if the user is not authenticated | Yes (variable stored in session) |
| When accessing /behavior/reporting, user can choose whether morning or evening is being reported | Yes (available at /behavior/reporting/morning and /behavior/reporting/evening) |
| Morning reporting form contains fields for date, sleep duration, sleep quality, and generic mood | Yes |
| Evening reporting form contains fields for date, time spent on sports and exercise, time spent studying, regularity and quality of eating, and generic mood | Yes |
| Reported values are stored into the database | The values are stored in the _ **reports** _table. |
| Reporting functionality structured into logical parts (separate views folder, separate controller for reporting, service(s), ...) | Yes |
| Summary functionality is available under the path /behavior/summary | Yes |
| Main summary page contains the following statistics, by default shown for the last week and month | Yes, however, the week/month were not selected in the UI by default. This was done since by default, the data computed was starting from the current date (i.e. past week = [today()-7  today()] while past month =[today()-30  today()]. |
| Summary page has a selector for week and month. Check input type=&quot;week&quot; and input type=&quot;month&quot;. | Yes|
| Summary data / averages calculated within the database | Yes, this was done using the _ **AVG** _operation_._ |
| Summarization page contains statistics only for the current user. | Yes. The query sent contained the user id stored in the session object. The query returns _ **No data for the given duration** _in case no data is available for the user in the period. |
| Landing page briefly describes the purpose of the application | Yes, I added the following: This webpage serves as a self-monitoring tool for the users. |
| Landing page shows a glimpse at the data and indicates a trend | Yes, the trend was added. In case no data were found for a previous/current day, we are displaying a 0 with the message _ **It looks that there are missing trends..** _ |
| Landing page has links / buttons for login and register functionality | Yes |
| Landing page has links / buttons for reporting functionality | Yes |
| The application has at least 20 meaningful automated tests. All tests detect if e.g. tested functionality is changed so that it no longer works as expected. | Yes , the tests are available in the documentation. |
| Passwords are not stored in plaintext | Yes, the hashes of the passwords were computed and stored. |
| Field types in the database match the actual content (i.e., when storing numbers, use numeric types) | Yes, more details could be seen in the CREATE TABLE query. |
| Database queries done using parameterized queries (i.e., code cannot be injected to SQL queries) | Yes, we used executeQuery. |
| Data retrieved from the database are sanitized (i.e., if showing content from database, using \&lt;%= ... %\&gt; instead of \&lt;%- ...%\&gt; unless explicitly stated what for). | Yes. |
| Users cannot access data of other users. | Yes, the session-based authentication contains the user id used in all requests . |
| Users cannot post reports to other users&#39; accounts. | Yes|
| Expensive calculations such as calculating averages are done in the database | Yes |
| Indices are used when joining tables if the queries are such that they are used often | We used the user id stored in the session. |
| Database uses a connection pool | Yes |
| Database credentials are not included in the code | Yes, they are included in the environment variables set before running the script. |
| Views are stored in a separate folder | Yes |
| User interface uses partials for header content | Yes |
| User interface uses partials for footer content | Yes |
| Recurring parts are separated into own partials (e.g. partial for validation errors) | Yes |
| Pages with forms contain functionality that guides the user | Yes, all data has labels that would make it easy to use the app. |
| User interface uses a style library or self-made stylesheets | Yes |
| Different pages of the application follow the same style | Ye. |
| User sees if the user has logged in (e.g. with a message &#39;Logged in as my@email.net&#39; shown at the top of the page| Yes |
| The application provides an API endpoint for retrieving summary data generated over all users in a JSON format | Yes |
| The API is accessible by all | Yes |
| The API allows cross-origin requests | Yes |
| Endpoint /api/summary provides a JSON document with sleep duration, time spent on sports and exercise, time spent studying, sleep quality, and generic mood averaged over the last 7 days | Yes. In case no data is present, _ **No data for the given duration** _ is returned. | Yes |
| Endpoint /api/summary/:year/:month/:day provides a JSON document with averages for sleep duration, time spent on sports and exercise, time spent studying, sleep quality, and generic mood for the given day | Yes |
| Application is available and working in an online location (e.g. Heroku) at an address provided in the documentation | Yes, the url can be found in the documentation. |
| Application can be run locally following the guidelines in documentation | Yes, more details can be found in the documentation. |
| Documentation contains necessary CREATE TABLE statements needed to create the database used by the application | Yes! |
| Documentation contains the address at which the application can currently be accessed | Yes! |
| Documentation contains guidelines for running the application | Yes! |
| Documentation contains guidelines for running test | Yes! |
