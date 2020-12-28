import { send } from '../deps.js';

const errorMiddleware = async (context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
}


const authenticationMiddleware = async ({ request, response, session }, next) => {
  const authenticated = await session.get("authenticated");
  console.log("boolean ", authenticated);
  if (request.url.pathname.includes("behavior") && !authenticated) {
    console.log("We are redirecting...");
    await next();
    response.redirect("/auth/login")
  } else {
    await next();

  }
}

const requestTimingMiddleware = async ({ request, session }, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  const user = await session.get("user");
  var msg = "";
  if (user == undefined || user == [] || user == null || user == {}) {
    console.log(user);
    msg = "Anonymous";
  } else {
    msg = `${user.id} ${user.email}`;
  }
  console.log(` ${msg} : ${new Date().toISOString()} ${request.method} ${request.url.pathname} - ${ms} ms`);
}

const serveStaticFilesMiddleware = async (context, next) => {
  if (context.request.url.pathname.startsWith('/static')) {
    const path = context.request.url.pathname.substring(7);

    await send(context, path, {
      root: `${Deno.cwd()}/static`
    });

  } else {
    await next();
  }
}


export { authenticationMiddleware, errorMiddleware, requestTimingMiddleware, serveStaticFilesMiddleware };