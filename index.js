import express from "express";
import mongoose, { Schema } from "mongoose";
import  cors from "cors";

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors())

app.use(express.json());
const uri = process.env.MONGO_URI;
const port = process.env.PORT || 8000;
mongoose.connect(uri).then(console.log);
mongoose.connect(uri);

const users = mongoose.model(
  "users",
  new Schema({ email: String, uid: String, username: String })
);

app.post("/users/create", async (req, res) => {
await users.findOne({uid:req.body.uid}).then(user=>{
	if(user ==null){

		const shortName = uniqueNamesGenerator({ //NOTE: package  to gentrate random name
			dictionaries: [adjectives, animals, colors], 
			length: 2,
		});
		const user = {
			email: req.body.email,
			uid: req.body.uid,
			username: shortName,
		};
		users
			.create(user)
			.then(console.log)
			.then(() => {
				res.send({msg:"user created successfully",username:shortName});
			});
	}else{
res.send({msg:"user alred exists",username :user.username})
	}

})
});

app.get("/user/:uid",async(req,res)=>{
	let uid = req.params.uid;
	console.log(uid)
	await users.findOne({uid:uid}).catch(err=>{
		console.log(err)
	}).then(user=>{

	res.send({username :user?.username})

	})

});

app.listen("8000", () => {
  console.log("server started on localhost://", port);
});
