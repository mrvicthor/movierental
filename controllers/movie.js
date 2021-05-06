const Movie = require("../models/Movie");

exports.list = async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.render("movies", { movies: movies });
  } catch (e) {
    res.status(404).send({ message: "could not list movies" });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await Movie.findByIdAndRemove(id);
    res.redirect("/movies");
  } catch (e) {
    res.status(404).send({
      message: `could not delete record ${id}`,
    });
  }
};

exports.addMovie = async (req, res) => {
  try {
    const movie = new Movie({
      title: req.body.title,
      genre: req.body.genre,
      rating: parseInt(req.body.rating),
    });
    await movie.save();
    res.redirect("/movies/?message=movie has been added");
  } catch (e) {
    if (e.errors) {
      console.log(e.errors);
      res.render("add-movie", { errors: e.errors });
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
};

exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const movie = await Movie.findById(id);

    res.render("edit-movie", { movie: movie });
  } catch (e) {
    if (e.errors) {
      console.log(e.errors);
      res.render("edit-movie", { errors: e.errors });
      return;
    }
    res.status(404).send(`Could not find movie ${id}`);
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const movie = await Movie.updateOne({ _id: id }, req.body);
    res.redirect("/movies/?message=movie has been updated");
  } catch (e) {
    res.status(404).send({
      message: `could not find movie ${id}`,
    });
  }
};
