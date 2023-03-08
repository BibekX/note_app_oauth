var notesTemplate = Handlebars.compile(
  `
  {{#each notes}}
  <div class="note">
      <span class="input"><textarea id={{id}}>{{content}}</textarea></span>
      <button class="remove btn btn-xs" id={{id}}><i class="fa fa-trash" aria-hidden="true"></i></button>
  </div>
  {{/each}}
    `
);

const reloadNotes = (notes) => {
  $("#notes").html(notesTemplate({ notes }));
};

$(() => {
  $("#add").submit((e) => {
    e.preventDefault();

    if ($("textarea[name=note]").val() === "") {
      return;
    }
    const val = $("textarea[name=note]").val();
    $("textarea[name=note]").val("");
    axios
      .post("/api/notes/", {
        note: val,
      })
      .then((res) => {
        reloadNotes(res.data);
      })
      .catch((err) => {
        window.location.reload();
      });
  });

  $("#notes").on("blur", "textarea", (event) => {
    axios
      .put("/api/notes/" + $(event.currentTarget).attr("id"), {
        note: $(event.currentTarget).val(),
      })
      .then((res) => {
        reloadNotes(res.data);
      })
      .catch((e) => {
        alert(e);
      });
  });

  $("#notes").on("click", ".remove", (event) => {
    axios
      .delete("/api/notes/" + $(event.currentTarget).attr("id"))
      .then((res) => {
        reloadNotes(res.data);
      })
      .catch((e) => {
        alert(e);
      });
  });
});
