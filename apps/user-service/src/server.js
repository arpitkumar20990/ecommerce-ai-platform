import app from "./app.js"
import { PORT } from "./config/env.js"

app.listen(PORT, ()=>{
    console.log(`Anvaya user service is running on port ${PORT}`)
})