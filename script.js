const book = document.getElementById("book");
const ambient = document.getElementById("ambient");
const pageTwo = document.getElementById("pageTwo");

const turnPageButton = document.getElementById("turnPageButton");
const backButton = document.getElementById("backButton");

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

  /* levanta a pontinha */
  book.classList.add("peeling");

  /* inicia a virada logo depois */
  setTimeout(() => {
    book.classList.add("turning");
    pageTwo.setAttribute("aria-hidden", "false");
  }, 170);

  /* fixa no estado aberto */
  setTimeout(() => {
    book.classList.remove("peeling", "turning");
    book.classList.add("open");
    ambient.style.backgroundImage = 'url("imagens/pagina2.png")';
    animationLocked = false;
  }, 1090);
}

function backToPageOne() {
  if (animationLocked || !book.classList.contains("open")) return;

  animationLocked = true;
  resetPageTwo();

  /*
    Volta de forma suave sem Web Animations pesado:
    usa transição CSS temporária só em transform.
  */
  const turningPage = document.getElementById("turningPage");

  book.classList.remove("open");

  turningPage.style.transition = "transform .82s cubic-bezier(.42,.02,.20,1)";
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
  }, 850);
}

turnPageButton.addEventListener("click", openPageTwo);
backButton.addEventListener("click", backToPageOne);

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
  O iframe carrega uma vez ao iniciar.
  Só mostramos sucesso quando houve um envio real.
*/
submitFrame.addEventListener("load", () => {
  if (submissionState !== "sending") return;

  submissionState = "done";
  statusMessage.textContent = "";
  confirmButton.disabled = false;
  form.hidden = true;
  successMessage.hidden = false;
});
