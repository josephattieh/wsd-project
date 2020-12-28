import {addMorningReport, addEveningReport}  from "../../services/reportsService.js"
import  {getStatisticsPerWeekPerUserDefault, getStatisticsPerMonthPerUserDefault, getStatisticsPerMonthPerUser, getStatisticsPerWeekPerUser} from "../../services/reportsService.js";

const reportMorning =async({ response, request, session}) =>{
    const body = request.body();
    const params = await body.value;

    const authenticated = await session.get("authenticated");
    if(!authenticated){
        response.body="Kindly authenticate first";
        return;
    }

    const date = params.get("date");   
    const duration = params.get("duration");   
    const quality = params.get("quality");  
    const generic = params.get("generic");  
    
    const splitted = date.split("-");
    const day = splitted[2];
    const month = splitted[1];
    const year = splitted[0];
    const user_id = await session.get('user');

    addMorningReport(user_id.id,day,month, year, duration, quality,generic );
    await session.set("message", "Successful reporting!")
    response.redirect('/behavior/reporting/morning');


}
const reportEvening =async({ response, request, session}) =>{
    const body = request.body();
    const params = await body.value;
    const authenticated = await session.get("authenticated");
    if(!authenticated){
        response.body="Kindly authenticate first";
        return;
    }
    const date = params.get("date");   
    const sport = params.get("sport");   
    const study = params.get("study");   
    const eating = params.get("eating");   
    const generic = params.get("generic");  
    const user_id = await session.get('user');
    console.log(user_id);
    const splitted = date.split("-");
    const day = splitted[2];
    const month = splitted[1];
    const year = splitted[0];
    addEveningReport(user_id.id, day,month, year, sport, study, eating, generic);
    await session.set("message", "Successful reporting!")
    response.redirect('/behavior/reporting/evening');

}

const updateSumaryPage =async({ response, request, session, render})=>{
    const body = request.body();
    const params = await body.value;
    const week = params.get("week");
    const month = params.get("month");
    const data={};
    const user = await session.get("user");
    const authenticated = await session.get("authenticated");
    if(!authenticated){
        response.body="Kindly authenticate first";
        return;
    }
    if(!week){
        data.week = await getStatisticsPerWeekPerUserDefault(user.id);

    }else{
        
        data.week = await getStatisticsPerWeekPerUser(user.id, week.split("-W")[1], week.split("-W")[0]);

    }
    if(!month){
        data.month = await getStatisticsPerMonthPerUserDefault(user.id);

    }else{
        data.month = await getStatisticsPerMonthPerUser(user.id, month.split("-")[1], month.split("-")[0]);

    }
    data.email = user.email;
    data.weekdefault = week;
    data.monthdefault = month;
    
    render("./reports/summary.ejs", data);
}
export { reportMorning,reportEvening,updateSumaryPage};