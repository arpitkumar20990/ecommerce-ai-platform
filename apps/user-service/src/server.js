import "dotenv/config"
import app from "./app.js"

const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log("Anvaya user service is running on port 5002")
})