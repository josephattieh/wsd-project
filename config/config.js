let config = {};

if (Deno.env.get('DATABASE_URL')) {
  config.database = Deno.env.get('DATABASE_URL');
} else 
{
  config.database = Deno.env.get('DATABASE_URL_LOCAL');
}

let port = 7777;
if (Deno.args.length > 0) {
  const lastArgument = Deno.args[Deno.args.length - 1];
  port = Number(lastArgument);
}

// {
//   if (Deno.env.get('TEST_ENVIRONMENT')){
//     config.database = "postgres://hvpjiioe:9aK6OBpcXTtWTmsO43Kj9V0jYta9QAs8@isilo.db.elephantsql.com:5432/hvpjiioe";

    

//   }else{
//     config.database = "postgres://dgphvolt:XWHrlKChN6XhdSsWzSOWpZWflSLAxQCe@lallah.db.elephantsql.com:5432/dgphvolt";

//   }}

export { config, port }; 