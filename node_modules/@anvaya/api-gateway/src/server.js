import app from './app.js'
import PORT from './config/env.js'



app.listen(PORT, ()=>{
    console.log(`Api gateway is running on port ${PORT}`)
})