// Setup a NoteRouter class which takes the note service as a dependency, that was we can inject the NoteService when we use our Router. As this is not a hard coded value we will need to inject the noteService for every instance of the note router.
// let user = { id: 1, username: "sam", password: "123" };
class NoteRouter {
  constructor(noteService, express) {
    this.noteService = noteService;
    this.express = express;
  }

  // This utilises the express Router method, basically we are binding the path/ request to each restful verb
  router() {
    let router = this.express.Router();
    router.get("/", this.get.bind(this));
    router.post("/", this.post.bind(this));
    router.put("/:id", this.put.bind(this));
    router.delete("/:id", this.delete.bind(this));
    return router;
  }

  // Here we handle what will occur when we have been sent down a particular path, this path is '/' - we will just list all of the notes, that match our(req.auth.user)
  get(req, res) {
    return (
      this.noteService
        // .list(user.id)
        // req.user ---> {id: 1, username: 'ash', password: '123'}
        .list(req.user.id)
        .then((notes) => res.json(notes)) // What we do with the information that we receive, here we send the notes back in JSON format.
        .catch((err) => res.status(500).json(err))
    ); // This .catch is to handle any errors that may befall our project.
  }

  post(req, res) {
    return (
      this.noteService
        // .add(req.body.note, user.id)
        .add(req.body.note, req.user.id)
        // .then(() => this.noteService.list(user.id))
        .then(() => this.noteService.list(req.user.id))
        .then((notes) => res.json(notes)) // [{id: 2, content: 'hi}, {id: 2, content: 'hello'}]
        .catch((err) => res.status(500).json(err))
    );
  }

  // Here we handle our put request, which has an id as a parameter (req.params.id), the body of the updated note (req.body.note) and the user who's note we want to update (req.auth.user)
  put(req, res) {
    return (
      this.noteService
        .update(req.params.id, req.body.note) // The noteService fires the update command, this will update our note (and our JSON file)
        // .then(() => this.noteService.list(user.id)) // Then we fire list note from the same noteService which returns the array of notes for that user.
        .then(() => this.noteService.list(req.user.id)) // Then we fire list note from the same noteService which returns the array of notes for that user.
        .then((notes) => res.json(notes)) // Then we respond to the request with all of our notes in the JSON format back to our clients browser.
        .catch((err) => res.status(500).json(err))
    );
  }

  delete(req, res) {
    return (
      this.noteService
        .remove(req.params.id)
        // .then(() => this.noteService.list(user.id))
        .then(() => this.noteService.list(req.user.id))
        .then((notes) => res.json(notes))
        .catch((err) => res.status(500).json(err))
    );
  }
}

module.exports = NoteRouter;
