const book = document.getElementById("book");
const page2 = document.getElementById("page2");
const turnPageButton = document.getElementById("turnPageButton");
const backButton = document.getElementById("backButton");

const form = document.getElementById("rsvpForm");
const guestName = document.getElementById("guestName");
const confirmButton = document.getElementById("confirmButton");

const sendingMessage = document.getElementById("sendingMessage");
const successMessage = document.getElementById("successMessage");
const submitFrame = document.getElementById("submitFrame");

let waitingForSubmission = false;

function openSecondPage() {
  book.classList.add("open");
  page2.setAttribute("aria-hidden", "false");

  setTimeout(() => {
    guestName.focus({ preventScroll: true });
  }, 950);
}

function returnToFirstPage() {
  book.classList.remove("open");
  page2.setAttribute("aria-hidden", "true");

  form.hidden = false;
  successMessage.hidden = true;
  sendingMessage.hidden = true;

  guestName.value = "";
  confirmButton.disabled = false;
  waitingForSubmission = false;
}

turnPageButton.addEventListener("click", openSecondPage);
backButton.addEventListener("click", returnToFirstPage);

form.addEventListener("submit", (event) => {
  const nome = guestName.value.trim();

  if (!nome) {
    event.preventDefault();
    guestName.focus({ preventScroll: true });
    return;
  }

  waitingForSubmission = true;
  sendingMessage.hidden = false;
  confirmButton.disabled = true;
});

/*
  O iframe dispara "load" quando o Google Apps Script termina de responder.
  Só mostramos sucesso se houve um envio de verdade.
*/
submitFrame.addEventListener("load", () => {
  if (!waitingForSubmission) return;

  waitingForSubmission = false;
  sendingMessage.hidden = true;
  confirmButton.disabled = false;
  form.hidden = true;
  successMessage.hidden = false;
  guestName.value = "";
});

/* Evita o zoom automático do iPhone em alguns campos ao receber foco. */
guestName.addEventListener("focus", () => {
  document.documentElement.style.setProperty("--input-active", "1");
});
