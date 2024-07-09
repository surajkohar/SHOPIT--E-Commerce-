const products=require('../data/product.json')
const Product=require("../models/fakeProductModel")
const dotenv=require('dotenv')
const connectDatabase=require('../config/database')

//setting up config files
dotenv.config({path:'config/config.env'})

//connecting to database
connectDatabase();

const seedPrdoducts=async()=>{
    try{
         await Product.deleteMany();
         console.log("Products are deleted")

         await Product.insertMany(products);
         console.log("All the Products are inserted")
         process.exit();
    }
    catch(error){
      console.log(error.message)
      process.exit()
    }
}

seedPrdoducts();



