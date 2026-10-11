import {prisma} from "./config/prisma.js";

async function testDatabase(){
    try {
        const result = await prisma.$queryRaw`SELECT 1`

        console.log("Database connected successfuly");
        console.log(result);
    } catch (error) {
        console.log("Databse connection failed:", error);
        process.exitCode =1;
    }finally{
        await prisma.$disconnect();
    }
}

testDatabase();