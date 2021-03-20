//jshint version:6

const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.raw());

app.use(express.static("public"));

//TODO - DATABASE CONNECTION.
mongoose.connect("mongodb://localhost:27017/WikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
    title: String,
    content: String,
};

const Article = mongoose.model("Article", articleSchema);

//TODO - fetch all articles
app.get('/articles', function (request, response) {

    Article.find({}, function (err, allArticles) {
        if (err) {
            console.log(err);
            response.send(err);
        } else {
            console.log(allArticles);
            response.send(allArticles);
        }
    });

});

//TODO - Post an article
app.post("/articles", function (request, response) {
    console.log(request.body);

    new Article(
        {
            title: request.body.title,
            content: request.body.content,
        }
    ).save(function (err) {
        if (err) {
            response.send(err);
        } else {
            response.send({
                message: "Successfully added a new article."
            });
        }
    });

});

//TODO - Delete all articles.
app.delete("/articles", function (request, response) {

    Article.deleteMany({}, {}, function (err) {
        if (err) {
            response.send(err);
        } else {
            response.send({
                message: "Successfully deleted all articles."
            });
        }
    })
});

//TODO /////////////////////////////////// Route in Express /////////////////////////////////////////////////////
//get, post, put, patch and delete an single article.
app.route("/articles/:articleTitle")
    .get(function (request, response) {

        Article.findOne({title: request.params.articleTitle}, function (err, foundContent) {
            if (err) {
                response.send(err);
            } else {
                response.send({
                    message: "Successfully found an articles.",
                    data: foundContent,
                });
            }
        });

    })
    .put(function (request, response) {

        console.log(request.params);
        console.log(request.body);

        Article.update({title: request.params.articleTitle},
            {
                title: request.body.title,
                content: request.body.content
            }, {overwrite: true}, function (err) {
                if (err) {
                    response.send(err);
                } else {
                    response.send({
                        message: "Successfully Updated an articles.",
                    });
                }
            });
    })
    .patch(function (request,response) {

        Article.update({title: request.params.articleTitle},
        {
            $set: request.body //to update whole body
            }, function (err) {
                if (err) {
                    response.send(err);
                } else {
                    response.send({
                        message: "Successfully Updated an articles.",
                    });
                }
            });

    })
    .delete(function (request, response) {

        Article.deleteOne({title: request.params.articleTitle},function (err) {
            if (err) {
                response.send(err);
            } else {
                response.send({
                    message: "Successfully Deleted an articles.",
                });
            }

        });

    });


app.listen(3000, function () {
    console.log("Server started on port 3000");
});