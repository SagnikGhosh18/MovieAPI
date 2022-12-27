//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Database connectivity

mongoose.connect("mongodb://localhost:27017/movieDB",{useNewUrlParser:true});

const movieSchema = {
  title:String,
  director:String
};
const Movie = mongoose.model("Movie",movieSchema);

///// Requests targetting all articles /////


app.route("/movies")
  .get(function(req,res){
    Movie.find(function(err,foundMovies){
      if(!err){
        res.send(foundMovies);
      }
      else{
        res.send(err);
      }
    });
  })
  .post(function(req,res){
    console.log(req.body.title);
    console.log(req.body.director);

    const newMovie = new Movie({
      title: req.body.title,
      director: req.body.director
    });
    newMovie.save(function(err){
      if(!err){
        res.send("Successfully added new entry");
      }
      else{
        res.send(err);
      }
    });
  })
  .delete(function(req,res){
    Movie.deleteMany(function(err){
      if(!err){
        res.send("Successfully deleted all.");
      }
      else{
        res.send(err);
      }
    });
  });

///// Requests targetting specific articles /////

app.route("/movies/:movieTitle")
  .get(function(req,res){
    Movie.findOne({title: req.params.movieTitle},function(err,foundMovie){
      if(foundMovie){
        res.send(foundMovie);
      }
      else{
        res.send("No movie");
      }
    });
  })
  .put(function(req,res){     //This only updates the field whcih is provided and deletes the other fields.
    Movie.findOneAndUpdate(
      {title: req.params.movieTitle},
      {title: req.body.title,director: req.body.director},
      {overwrite: true},
      function(err){
        if(!err){
          res.send("Successfully updated");
        }
      }
    );
  })
  .patch(function(req,res){
    Movie.update(
      {title: req.params.movieTitle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("Successfully patched");
        }
      }
    );
  })
  .delete(function(req,res){
    Movie.findOneAndDelete(
      {title: req.params.movieTitle},
      function(err){
        if(!err){
          res.send("Successfully deleted");
        }
      }
    );
  });





/// Port
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
