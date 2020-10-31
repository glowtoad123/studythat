var express = require('express');
var router = express.Router();
var marked = require("marked")
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);


/* GET home page. */
/* router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
 */

mongoose.connect("mongodb+srv://alonzo6546:j3xpfAfFKAoNtbJq@cluster0.f8lek.mongodb.net/studies?retryWrites=true&w=majority", {
        useNewUrlParser: true
    }).catch(function(err){
        console.log(err)
    })

  const Schema = mongoose.Schema;
  const cardSchema = new Schema({
      topic: String,
      note: String
  })
  const Card = mongoose.model("Topics", cardSchema)

router.get("/", function(req, res, next){
  Card.find({}, function(err, card){
    if(!err){
      res.render('index', {
        cardList: card,
      })
    } else {
      console.log(err)
    }
  })
})

router.post("/delete", function(req, res, next){
  const id = req.body.cardId
  console.log(id)

  Card.findByIdAndDelete(id, function(err){
    if(!err){
      console.log("item has been deleted")
      res.redirect("/")
    } else {
      console.log("error, item has not been deleted")
    }
  })
})

router.get("/card/:id", function(req, res, next){
  Card.findById(req.params.id, function(err, card){ 
    if(!err){
      res.render("card", {
          card: card
      })
    }
  })  
})

router.get("/create", function(req, res, next){

  res.render("create")
})

router.post("/create", function(req, res, next){
  const card = new Card({
      topic: req.body.topic,
      note: req.body.note
  })
  card.save()
  console.log(card.errors)
  res.redirect("/")
})

router.get("/edit/:id", function(req, res, next){
  Card.findById(req.params.id, function(err, card){
    if(!err){
      res.render("edit", {
        card: card
      })
    }
  })
})

router.post("/edit/:id", function(req, res, next){
  const id = req.params.id.replace(":", "")
  Card.findByIdAndUpdate(id, {
    topic: req.body.topic,
    note: req.body.note,
  },
  {new: true},
  function(err, card){
      if(!err){
          console.log("I'm working")
          console.log(card)
          console.log(card.topic)
          res.redirect("/card/" + card.id)
      } else if(err){
          console.log("I do not want to work even if there is nothing wrong with your code")
          console.log(err)
      }
  }
  )
})

module.exports = router;
