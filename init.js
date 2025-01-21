const mongoose=require("mongoose");
const chat=require("./model/chat.js");
main()
.then(()=>{console.log("db connected")})
.catch((er)=>{
    console.log(er);
})
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsApp');
}
 
  
chat.insertMany([
 
{ from: "Aarav", to: "Rohan", msg: "Good morning!", created_at: new Date()},
 {from: "Priya", to: "Anjali", msg: "How are you?", created_at: new Date()},
{ from: "Vikram", to: "Karan", msg: "Let's meet up.", created_at: new Date()},
{ from: "Sneha", to: "Meera", msg: "Call me back.", created_at: new Date()},
{ from: "Ravi", to: "Amit", msg: "See you soon.", created_at: new Date()},
{ from: "Neha", to: "Pooja", msg: "Miss you!", created_at: new Date()},
{ from: "Arjun", to: "Rahul", msg: "Happy birthday!", created_at: new Date()},
])
 