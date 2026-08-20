const book = document.getElementById("book");
const ambient = document.getElementById("ambient");
const pageTwo = document.getElementById("pageTwo");
const turningPage = document.getElementById("turningPage");

const turnPageButton = document.getElementById("turnPageButton");
const backButton = document.getElementById("backButton");
const okButton = document.getElementById("okButton");

const form = document.getElementById("rsvpForm");
const guestName = document.getElementById("guestName");
const confirmButton = document.getElementById("confirmButton");
const statusMessage = document.getElementById("statusMessage");
const successMessage = document.getElementById("successMessage");
const submitFrame = document.getElementById("submitFrame");

let animationLocked = false;
let submissionState = "idle";

function resetPageTwo() {
  submissionState = "idle";
  form.hidden = false;
  successMessage.hidden = true;
  statusMessage.textContent = "";
  guestName.value = "";
  confirmButton.disabled = false;
}

function openPageTwo() {
  if (animationLocked || book.classList.contains("open")) return;

  animationLocked = true;
  resetPageTwo();

  /*
    1) A pontinha levanta.
    2) Quase imediatamente a folha acompanha.
    3) A página 2 já está renderizada por baixo, então não existe atraso visual.
  */
  book.classList.add("peeling");

  setTimeout(() => {
    book.classList.add("turning");
    pageTwo.setAttribute("aria-hidden", "false");
  }, 210);

  setTimeout(() => {
    book.classList.remove("peeling", "turning");
    book.classList.add("open");

    ambient.style.backgroundImage = 'url("imagens/pagina2.png")';
    animationLocked = false;
  }, 1190);
}

function backToPageOne() {
  if (animationLocked || !book.classList.contains("open")) return;

  animationLocked = true;
  resetPageTwo();

  book.classList.remove("open");

  /*
    Volta simples e fluida.
    O CSS principal não fica brigando com Web Animations.
  */
  turningPage.style.transition = "transform .78s cubic-bezier(.44,.01,.20,1)";
  turningPage.style.transform = "rotateY(-180deg)";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      turningPage.style.transform = "rotateY(0deg)";
    });
  });

  ambient.style.backgroundImage = 'url("imagens/pagina1.png")';

  setTimeout(() => {
    turningPage.style.transition = "";
    turningPage.style.transform = "";
    pageTwo.setAttribute("aria-hidden", "true");
    animationLocked = false;
  }, 820);
}

turnPageButton.addEventListener("click", openPageTwo);
backButton.addEventListener("click", backToPageOne);

/* O botão OK fecha a confirmação e volta para a primeira página. */
okButton.addEventListener("click", () => {
  if (animationLocked) return;
  backToPageOne();
});

form.addEventListener("submit", (event) => {
  const nome = guestName.value.trim();

  if (!nome) {
    event.preventDefault();
    statusMessage.textContent = "Por favor, informe seu nome.";
    guestName.focus({ preventScroll: true });
    return;
  }

  submissionState = "sending";
  statusMessage.textContent = "Enviando...";
  confirmButton.disabled = true;
});

/*
  O iframe carrega ao inicializar e após o Apps Script responder.
  Só mostramos sucesso quando houve envio real.
*/
submitFrame.addEventListener("load", () => {
  if (submissionState !== "sending") return;

  submissionState = "done";
  statusMessage.textContent = "";
  confirmButton.disabled = false;

  form.hidden = true;
  successMessage.hidden = false;
});
