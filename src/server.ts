import { createApp } from "./app.js";
import { env } from "./config/index.js";

const app = createApp();
app.listen(env.PORT,env.HOST,()=>{
    console.log(`Server running on http://${env.HOST}:${env.PORT}`);
})