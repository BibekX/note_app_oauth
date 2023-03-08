class NoteService {
  constructor(knex) {
    this.knex = knex;
  }

  list(user_id) {
    return this.knex("notes")
      .select("id", "content")
      .where("user_id", user_id)
      .orderBy("id", "asc");
  }

  add(note, user_id) {
    return this.knex("notes").insert({ user_id, content: note });
  }

  update(note_id, note) {
    return this.knex("notes").update({ content: note }).where({ id: note_id });
  }

  remove(note_id) {
    return this.knex("notes").del().where({ id: note_id });
  }
}

module.exports = NoteService;
