const express=require("express");
const bodyParser=require("body-parser");
const dirname=require("path");
const fileURLToPathfrom=require("url");
const swal=require("sweetalert");
const app=express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
var serviceAccount = require("./key.json");
const { compile } = require("ejs");
initializeApp({
  credential: cert(serviceAccount)
});
var fid="";
var sid="";
var queries=[];
var replies=[];
var name="";
var sub="";
var dis=[];
var show=[];
const db = getFirestore();
app.get("/",(req,res)=>{
  res.render("dashboard.ejs");
})
app.get("/flogin",(req,res)=>{
  res.render("flogin.ejs");
})
app.get("/fsignup",(req,res)=>{
  res.render("fsignup.ejs");
})
app.get("/slogin",(req,res)=>{
  res.render("slogin.ejs");
})
app.get("/ssignup",(req,res)=>{
  res.render("ssignup.ejs");
})
app.post("/faculty",(req,res)=>{
  fid=req.body.name;
  res.render("student.ejs");
})
app.post("/loginsubmits",(req,res)=>{
  db.collection("faculty").doc(req.body.dept.toUpperCase()).collection("facultymembers").where("email","==",req.body.email).where("password","==",req.body.password).get().then((docs)=>{
      if(docs.size>0){
        fid=req.body.email;
         res.redirect("/factultymembers");
      }
      else{
          res.render("login.ejs",{
              name:"Enter valid input",
          })
      }
  })
})
app.post("/sloginsubmits",(req,res)=>{
  db.collection("users").where("email","==",req.body.email).where("password","==",req.body.password).get().then((docs)=>{
      if(docs.size>0){
        sid=req.body.email;
         res.render("maindashboard.ejs",{
          name:req.body.email,
         });
      }
      else{
          res.render("slogin.ejs",{
              name:"Enter valid input",
          })
      }
  })
})
app.get("/cse",(req,res)=>{
  show=[];
  db.collection("faculty").doc("CSE").collection("facultymembers").get().then((docs)=>{
    if(docs.size>0){
        docs.forEach((doc)=>{
            show.push({
              name:doc.data().name,
              dept:doc.data().department,
              email:doc.data().email,
            })
        })
      }
  res.render("show.ejs",{
    names:show,
  });
})
})
app.get("/ece",(req,res)=>{
  show=[];
  db.collection("faculty").doc("ECE").collection("facultymembers").get().then((docs)=>{
    if(docs.size>0){
        docs.forEach((doc)=>{
            show.push({
              name:doc.data().name,
              dept:doc.data().department,
              email:doc.data().email,
            })
        })
      }
  res.render("show.ejs",{
    names:show,
  });
})
})
app.get("/eee",(req,res)=>{
  show=[];
  db.collection("faculty").doc("EEE").collection("facultymembers").get().then((docs)=>{
    if(docs.size>0){
        docs.forEach((doc)=>{
            show.push({
              name:doc.data().name,
              dept:doc.data().department,
              email:doc.data().email,
            })
        })
      }
  res.render("show.ejs",{
    names:show,
  });
})
})
app.get("/mech",(req,res)=>{
  show=[];
  db.collection("faculty").doc("MECH").collection("facultymembers").get().then((docs)=>{
    if(docs.size>0){
        docs.forEach((doc)=>{
            show.push({
              name:doc.data().name,
              dept:doc.data().department,
              email:doc.data().email,
            })
        })
      }
  res.render("show.ejs",{
    names:show,
  });
})
})
app.get("/civil",(req,res)=>{
  show=[];
  db.collection("faculty").doc("CIVIL").collection("facultymembers").get().then((docs)=>{
    if(docs.size>0){
        docs.forEach((doc)=>{
            show.push({
              name:doc.data().name,
              dept:doc.data().department,
              email:doc.data().email,
            })
        })
      }
  res.render("show.ejs",{
    names:show,
  });
})
})
app.post("/signsubmit",(req,res)=>{
  var depts="";
  db.collection("faculty").where("email","==",req.body.email).get().then((docs)=>{
      if(docs.size===0){
        if(req.body.dept.toLowerCase()==='cse'){
            depts="CSE";
        }
        else if(req.body.dept.toLowerCase()==='ece'){
          depts="ECE";
      }
      else if(req.body.dept.toLowerCase()==='mech'){
        depts="MECH";
       }
       else if(req.body.dept.toLowerCase()==='civil'){
        depts="CIVIL";
       }
       db.collection("faculty").doc(depts).collection("facultymembers").doc(req.body.name).set({
        name:req.body.name,
        password:req.body.password,
        email:req.body.email,
        department:req.body.dept,
       }).then(function(){
        res.render("flogin.ejs");
       })
      }
      else{
          res.render("signout.ejs",{
              name:"This email is already exist",
          });
          }
  })

})
app.post("/ssignsubmit",(req,res)=>{
  db.collection("users").where(req.body.email,"==","email").get().then((docs)=>{
    if(docs.size==0){
      db.collection("users").doc(req.body.name).set({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
       }).then(function(){
        res.render("slogin.ejs");
       })
    }
    else{
      res.render("ssignup.ejs",{
        name:"This email is already exist",
      })
    }
  })


})
app.get("/facultyreplies",(req,res)=>{
  replies=[];
  db.collection("replies").doc(sid).collection("faculties").get().then((docs)=>{
    if(docs.size>0){
        docs.forEach((doc)=>{
            replies.push({
              name:doc.data().name,
              sub:doc.data().subject,
              discription:doc.data().discription,
              response:doc.data().response,
              replyby:doc.data().replyby,
            })
        })
      }
  res.render("facultyreplies.ejs",{
    names:replies,
  });
})
})
app.post("/query",(req,res)=>{
    db.collection("doubts").doc(fid).collection("students").doc(req.body.username).set({
      name:req.body.username,
      subject:req.body.sub,
      discription:req.body.discription,
    })
    res.send(` 
     <html> 
     <head> 
       <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script> 
     </head> 
     <body> 
       <script> 
         swal({ 
           title: "Success!", 
           text: "Request sent successfully.", 
           icon: "success", 
           button: "OK" 
         })
       </script> 
     </body> 
     </html> 
   `);
})
app.post("/queryreply",(req,res)=>{
  db.collection("facultyreply").doc(fid).collection("students").doc(req.body.name).set({
    name:req.body.name,
    subject:req.body.sub,
    discription:req.body.discription,
    response:req.body.response,
    replyby:fid,
  })
  db.collection("replies").doc(req.body.name).collection("faculties").doc(fid).set({
    name:req.body.name,
    subject:req.body.sub,
    discription:req.body.discription,
    response:req.body.response,
    replyby:fid,
  })
  db.collection("doubts").doc(fid).collection("students").doc(req.body.name).delete();
  res.redirect("/factultymembers");

})
app.post("/Editqueryreply",(req,res)=>{
  db.collection("facultyreply").doc(fid).collection("students").doc(req.body.name).set({
    name:req.body.name,
    subject:req.body.sub,
    discription:req.body.discription,
    response:req.body.response,
    replyby:fid,
  })
  db.collection("replies").doc(req.body.name).collection("faculties").doc(fid).update({
    response:req.body.response,
  })       
  res.redirect("/replies");
})
app.get("/factultymembers",(req,res)=>{
  queries=[];
  db.collection("doubts").doc(fid).collection("students").get().then((docs)=>{
    if(docs.size>0){
        docs.forEach((doc)=>{
            queries.push({
              name:doc.data().name,
              sub:doc.data().subject,
              discription:doc.data().discription,
            })
        })
      }
  res.render("faculty.ejs",{
    names:queries,
    name:fid,
  });
})
});
app.get("/replies",(req,res)=>{
  dis=[];
  db.collection("facultyreply").doc(fid).collection("students").get().then((docs)=>{
    if(docs.size>0){
      docs.forEach((doc)=>{
          dis.push({
            name:doc.data().name,
            sub:doc.data().subject,
            discription:doc.data().discription,
            response:doc.data().response,
          })
      })
    }
    res.render("replies.ejs",{
      names:dis,
    })
  })
})
app.post("/delete",(req,res)=>{
  db.collection("doubts").doc(fid).collection("students").doc(req.body.name).delete();
  res.redirect("/factultymembers");
})
app.post("/Editdelete",(req,res)=>{
  db.collection("facultyreply").doc(fid).collection("students").doc(req.body.name).delete();
  res.redirect("/replies");
})
app.get("/sLogout",(req,res)=>{
  res.render("slogin.ejs",{
    name:"Logout Successfully",
  })
})
app.get("/fLogout",(req,res)=>{
  res.render("flogin.ejs",{
    name:"Logout Successfully",
  })
})
app.listen(3000,(req,res)=>{
  console.log("Server starts");
})
