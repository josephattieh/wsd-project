import * as usersService from "../../services/usersService.js";
import {bcrypt, validate, required, lengthBetween, isEmail, isIn } from "../../deps.js";

const validationRules = {
    email: [required, isEmail],
};

const getData = async (request) => {
    const data = {
        email: "",
        password: "",
        feedbacks: [],
    };

    if (request) {
        const body = request.body();
        const params = await body.value;
        data.password = params.get("password");
        data.email = params.get("email");
    }

    return data;
};


const validateMe = async (data) => {

    const [passes, errors] = await validate({ email: data.email }, validationRules);

    const feedbacks = [];
    if (!data.password || data.password.length < 5) {
        feedbacks.push("Password length should be at least 4 characters");
    }
    console.log(errors);
    if (errors)
        if (errors.email)
            if (errors.email.isEmail) {
                feedbacks.push(errors.email.isEmail);
            }
    if (!data.email || !data.email.includes('@') || data.email.length < 6) {
        feedbacks.push("This is not an authentic email.");
    }

    return feedbacks;
};


const log_in = async ({ response, request, session }) => {


    const body = request.body();
    const params = await body.value;

    const email = params.get('email');
    const password = params.get('password');
    await session.set('email', email);

    const data = await usersService.getUserItem(email);
    response.status = 404;
    console.log(data);
    if (!data) {
        await session.set('feedback', ["Invalid email or password"]);

        response.redirect('/auth/login');
        return;
    }


    const passwordCorrect = await bcrypt.compare(password, data.password);
    console.log(passwordCorrect);
    if (!passwordCorrect) {
        await session.set('feedback', ["Invalid email or password"]);
        console.log("setting email,..");
        response.redirect('/auth/login');
        return;
    }

    await session.set('authenticated', true);
    await session.set('user', {
        id: data.id,
        email: data.email
    });

    await session.set('feedback', ["Authenticated successfully"]);
    response.status = 200;
    console.log("amazing");

    response.redirect('/behavior/reporting');


};


const sign_up = async ({ request, response, session }) => {


    const body = request.body();
    const params = await body.value;

    const email = params.get('email');
    await session.set('email', email);

    const password = params.get('password');
    const verification = params.get('verification');

    response.status = 404;
    const data_to_validate = await getData(request);
    const feedbacks = await validateMe(data_to_validate);
    if (feedbacks.length > 0) {
        console.log("ok");
        await session.set('feedback', feedbacks);
        response.redirect('/auth/registration');
        return;
    }
    const database_data = await usersService.getUserItem(email);
    if (database_data) {
        if (database_data != []) {
            await session.set('feedback', ["email already in use"]);
            console.log("Problem");
            response.redirect('/auth/registration');
            return;
        }
    }
    if (password !== verification) {
        await session.set('feedback', ["The entered passwords did not match"]);

        response.redirect('/auth/registration');
        return;
    }
    const hash = await bcrypt.hash(password);
    // when storing a password, store the hash    
    await usersService.addUsersItem(email, hash);
    await session.set('authenticated', true);
    const data = await usersService.getUserItem(email);
    console.log(data);
    await session.set('user', {
        id: data.id,
        email: data.email
    });
    await session.set('feedback', ["Authenticated successfully"]);
    console.log("reporting");
    response.redirect('/behavior/reporting');



}

const log_out = async ({ request, response, session }) => {
    await session.set('authenticated', false);
    await session.set('user', {
        id: "",
        email: ""
    });
    await session.set('feedback', ["Logged Out"]);
    await session.set('email', "");

    response.redirect('/auth/login');

}
export { log_in, sign_up, log_out };