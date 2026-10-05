import app from './app.js'
import PORT from './config/env.js'


app.listen(PORT , ()=>{
    console.log(`Anvaya auth service is running on PORT ${PORT}`)
})