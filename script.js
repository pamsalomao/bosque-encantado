const book = document.getElementById("book");
const pageTwo = document.getElementById("pageTwo");
const ambientBg = document.getElementById("ambientBg");

const turnPageButton = document.getElementById("turnPageButton");
const backButton = document.getElementById("backButton");

const form = document.getElementById("rsvpForm");
const guestName = document.getElementById("guestName");
const confirmButton = document.getElementById("confirmButton");

const sendingMessage = document.getElementById("sendingMessage");
const successMessage = document.getElementById("successMessage");
const submitFrame = document.getElementById("submitFrame");

let submissionState = "idle";
let isTurning = false;

function openPageTwo() {
  if (isTurning || book.classList.contains("open")) return;

  isTurning = true;

  // Garante que a mensagem de sucesso NUNCA possa aparecer
  // simplesmente por abrir a página 2.
  submissionState = "idle";
  successMessage.hidden = true;
  sendingMessage.hidden = true;
  form.hidden = false;
  confirmButton.disabled = false;

  book.classList.add("turning");

  // A página 2 aparece por baixo durante a virada.
  pageTwo.setAttribute("aria-hidden", "false");

  setTimeout(() => {
    book.classList.remove("turning");
    book.classList.add("open");
    ambientBg.style.backgroundImage = 'url("imagens/pagina2.png")';
    isTurning = false;
  }, 1280);
}

function backToPageOne() {
  if (isTurning) return;

  isTurning = true;

  // Para voltar, reaproveitamos a animação no sentido inverso
  // por meio de uma animação Web Animations.
  const sheet = document.getElementById("flipSheet");

  book.classList.remove("open");

  const animation = sheet.animate(
    [
      { transform: "rotateY(-180deg) translateZ(0)" },
      { transform: "rotateY(-128deg) translateZ(24px)", offset: .35 },
      { transform: "rotateY(-67deg) translateZ(32px)", offset: .62 },
      { transform: "rotateY(-15deg) translateZ(12px)", offset: .86 },
      { transform: "rotateY(0deg) translateZ(0)" }
    ],
    {
      duration: 1050,
      easing: "cubic-bezier(.58,.03,.26,.99)",
      fill: "both"
    }
  );

  ambientBg.style.backgroundImage = 'url("imagens/pagina1.png")';

  animation.finished.finally(() => {
    animation.cancel();
    pageTwo.setAttribute("aria-hidden", "true");

    form.hidden = false;
    successMessage.hidden = true;
    sendingMessage.hidden = true;

    guestName.value = "";
    confirmButton.disabled = false;

    submissionState = "idle";
    isTurning = false;
  });
}

turnPageButton.addEventListener("click", openPageTwo);
backButton.addEventListener("click", backToPageOne);

form.addEventListener("submit", (event) => {
  const nome = guestName.value.trim();

  if (!nome) {
    event.preventDefault();
    guestName.focus({ preventScroll: true });
    return;
  }

  /*
    Só a partir daqui o iframe está autorizado
    a disparar a mensagem de sucesso.
  */
  submissionState = "submitting";

  sendingMessage.hidden = false;
  successMessage.hidden = true;
  confirmButton.disabled = true;
});

/*
  O iframe também pode disparar "load" ao inicializar.
  Por isso verificamos submissionState === "submitting".
  Isso elimina o bug do “Oba!” aparecer ao simplesmente virar a página.
*/
submitFrame.addEventListener("load", () => {
  if (submissionState !== "submitting") return;

  submissionState = "done";

  sendingMessage.hidden = true;
  confirmButton.disabled = false;

  form.hidden = true;
  successMessage.hidden = false;

  guestName.value = "";
});

/*
  Não damos foco automático ao abrir a página 2.
  No iPhone isso evita abrir o teclado durante a animação
  e mantém a composição visual intacta.
*/
