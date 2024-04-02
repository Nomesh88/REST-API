const express=require('express');
const  bodyPraser=require('body-parser');


const app=express();

// data contains all the jokes
const data=require('./all.json');
app.use(bodyPraser.urlencoded({extended:true}));


const port=3000;
//In order to create joke we have all.json file which contains 1000 random jokes


//Create GET route
app.get("/jokes/random",(req,res)=>{
    const randomIndex=Math.floor(Math.random()*data.length);
    res.json(data[randomIndex]);// .json converts js object into json and returning the response in json format
    
})

// GET A SPECIFIC JOKE like by id ,if 1 get data[0], 2 get data[1] and so on....
app.get("/jokes/:id",(req,res)=>{
    const paramsID=parseInt(req.params.id); // converting the input from string to INT to get id of the request from params of the request
    res.json(data[paramsID-1]);
})

// GET joke by filtering on the joke type 
// we have filter option of mature variable with true or false 
// we need to return a randomm joke based on variable value
app.get("/filter", (req, res) => {
    const query = req.query.mature==='true'; // true or false and convertin it to boolean since our mature variable is a boolean
    const filtered = [];
    for (let i = 0; i < data.length; i++) {
        const matureBool = data[i].mature === true || data[i].mature === 'true';
        if (matureBool === query) {
            filtered.push(data[i]);
        }
    }
    res.json(filtered);
});

//  POST request
// we need to add a new joke 
// link, score,part1,mature , author, part2
app.post("/jokes",(req,res)=>{
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const newJoke={
        link:fullUrl,
        score:req.body.score,
        Part1:req.body.part1,
        mature:req.body.mature,
        author:req.body.author,
        part2:req.body.part2
    }
    data.push(newJoke);
    res.json(newJoke)
})


// put request 
app.put("/jokes/:id",(req,res)=>{
const id=parseInt(req.params.id);
var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
const updateJoke={
    link:fullUrl,
    score:req.body.score,
    Part1:req.body.part1,
    mature:req.body.mature,
    author:req.body.author,
    part2:req.body.part2
}
data[id-1]=updateJoke;
res.json(updateJoke);
})

// PATCH reqest
app.patch("/jokes/:id",(req,res)=>{
    const id=parseInt(req.params.id);
    const patchJoke={
        link:data[id-1].link,
        score:data[id-1].score || req.body.score,
        part1:data[id-1].part1 || req.body.part1,
        mature:req.body.mature,
        author:data[id-1].author || req.body.author,
        part2:data[id-1].part2|| req.body.part2
    }
    data[id-1]=patchJoke;
    res.json(data[id-1]);
})


// DELETE request
app.delete("/jokes/:id",(req,res)=>{
    const id=parseInt(req.params.id);
    if(id<data.length){
    data.splice(id-1,1);
    res.sendStatus(200);
    }
    else{
        res.sendStatus(404);
    }
})

//delete all 
// replace the data array with data=[] when the req provided key is matched with master key .

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})
