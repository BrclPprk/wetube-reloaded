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
  span2.innerText = "❌";
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
      // headers는 메타데이터를 알려줌
      "Content-Type": "application/json",
    }, // image/jpeg 같은 MIME타입 표기
    body: JSON.stringify({ text }),
    // 네트워크는 json 형태의 데이터를 보낼 수 없기에, 모든 환경에서 사용가능한 string으로 변환
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
