const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll(".deleteBtn");

let videoId;

const alertFlash = (info, message) => {
  const div = document.createElement("div");
  div.className = `message ${info}`;
  const span = document.createElement("span");
  span.innerText = message;
  div.appendChild(span);
  document.body.prepend(div);
  setTimeout(() => {
    div.remove();
  }, 10000);
};

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = id;
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = `  ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "X";
  span2.addEventListener("click", handleDelete);
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  if (text.trim() === "") {
    return;
  }
  videoId = videoContainer.dataset.id;
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const handleDelete = async (event) => {
  const li = event.target.parentElement;
  const commentId = li.dataset.id;
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
  });
  if (response.status !== 200) {
    return alertFlash("error", "Failed to Delete Comment.");
  }
  li.remove();
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

deleteBtn.forEach((btn) => btn.addEventListener("click", handleDelete));
