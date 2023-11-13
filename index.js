require("dotenv").config
const mysql = require("mysql")

const express = require("express")
var app = express()
const bodyparser = require("body-parser")


app.use(bodyparser.json())

var mysqlConnection = mysql.createConnection({
    host:"localhost",
    user:"sqluser",
    password:"password",
    database:"EmployeeDB",
    multipleStatements:true
})

// work is kinda slow and I am frustrated
mysqlConnection.connect((err)=>{
    if(!err) console.log("DB connected Succesfully");
    else console.log(err.message);
})


app.listen(3000,()=>{console.log("Port is listening on 3000");})


// Get all Employees
app.get("/employees",(req,res)=>{
    mysqlConnection.query("SELECT * FROM Employee",(err,rows,fields)=>{
        if(!err) res.send(rows);
        else console.log(err.message);
    })
})

// Get an Employee with given ID
app.get("/employees/:id",(req,res)=>{
    mysqlConnection.query("SELECT * FROM Employee WHERE EmpID = ?",[req.params.id],(err,rows,fields)=>{
        if(!err) res.send(rows);
        else console.log(err.message);
    })
})

// delete an Employee
app.delete("/employees/:id",(req,res)=>{
    mysqlConnection.query("DELETE FROM Employee WHERE EmpID = ?",[req.params.id],(err,rows,fields)=>{
        if(!err) res.send("Deleted Successfully");
        else console.log(err.message);
    })
})

// Insert an Employee
app.post("/employees",(req,res)=>{
    let emp = req.body
    var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary)"
    mysqlConnection.query(sql,[emp.EmpID,emp.Name,emp.EmpCode,emp.Salary],(err,rows,fields)=>{
        if(!err) {
            rows.forEach(element => {
               if (element.constructor == Array){
                res.send("Inserted ID : "+ element[0].EmpID)
               }
            });
        }
        else console.log(err.message);
    })
})


// Update an Employee
app.put("/employees",(req,res)=>{
    let emp = req.body
    var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary)"
    mysqlConnection.query(sql,[emp.EmpID,emp.Name,emp.EmpCode,emp.Salary],(err,rows,fields)=>{
        if(!err) res.send("Updated Successfully")
        else console.log(err.message);
    })
})