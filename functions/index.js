const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');

const admin = require('firebase-admin');

const firebaseApp = admin.initializeApp(functions.config().firebase);

const app = express();

// Seeting Middle Ware For Body Parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,res,next) => {

	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization");

	if(req.method ==='OPTIONS'){
		res.header('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');

		return res.status(200).json({});
	}

	next();

});

app.get('/',(req,res)=>{
    res.send("Hello Sohel");
})

app.get('/device',(req,res)=>{
    //const time = firebaseApp.database().ServerValue.TIMESTAMP
    //admin.database.ServerValue.TIMESTAMP

    res.send("HHHH");
})

app.post('/device',(req,res)=>{
    
    const macId =req.body.macid;

    const data = {
        servertime:admin.database.ServerValue.TIMESTAMP,
        lat:req.body.lat,
        lng:req.body.lng,
        ignitionstatus:req.body.ignitionstatus
    }

    if(macId){
        const dbRef = firebaseApp.database().ref("/"+macId);

        const key = dbRef.push().key;

        dbRef.child(key).set(data).then(()=>{
            return res.status(201).json({
                message:"Data Added Successfully"
            })
        }).catch(err=>{
            res.status(500).json(err);
        })
    }else{
        return res.status(400).json({
            message:"Mac ID Not Found"
        })
    }

    
})
// If Request is not match in the Above Route

app.use((req,res,next)=>{
	const error = new Error('Not Found');
	error.status = 404;

	// pass the Error to the Next Method
	next(error);
});


app.use((err,req,res,next) =>{

	res.status(err.status || 500);

	console.log(err.status);
	res.json({
		error:{
			message: err.message
		}
	})

});




// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.app = functions.https.onRequest(app);


