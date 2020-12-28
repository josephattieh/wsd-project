import { getMoodChange } from "../../services/landingService.js";


const showLanding = async ({ render }) => {

    const data = await getMoodChange();
    render("./main.ejs", data);
}

export { showLanding };