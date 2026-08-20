const book = document.getElementById("book");
const ambient = document.getElementById("ambient");
const pageTwo = document.getElementById("pageTwo");
const flipPage = document.getElementById("flipPage");

const turnPageButton = document.getElementById("turnPageButton");
const backButton = document.getElementById("backButton");

const form = document.getElementById("rsvpForm");
const guestName = document.getElementById("guestName");
const confirmButton = document.getElementById("confirmButton");
const statusMessage = document.getElementById("statusMessage");
const successMessage = document.getElementById("successMessage");
const submitFrame = document.getElementById("submitFrame");

let isAnimating = false;
let submitState = "idle";

function openSecondPage() {
  if (isAnimating || book.classList.contains("open")) return;

  isAnimating = true;
  submitState = "idle";

  // Sempre entra na página 2 com o formulário visível.
  form.hidden = false;
  successMessage.hidden = true;
  statusMessage.textContent = "";
  confirmButton.disabled = false;

  // 1) levanta a pontinha
  book.classList.add("corner-lift");

  // 2) depois começa a virada da folha
  setTimeout(() => {
    book.classList.add("turning");
    pageTwo.setAttribute("aria-hidden", "false");
  }, 240);

  // 3) fixa o estado final
  setTimeout(() => {
    book.classList.remove("corner-lift", "turning");
    book.classList.add("open");
    ambient.style.backgroundImage = 'url("imagens/pagina2.png")';
    isAnimating = false;
  }, 1390);
}

function backToFirstPage() {
  if (isAnimating || !book.classList.contains("open")) return;

  isAnimating = true;

  // Esconde qualquer mensagem antes de voltar.
  submitState = "idle";
  form.hidden = false;
  successMessage.hidden = true;
  statusMessage.textContent = "";
  confirmButton.disabled = false;
  guestName.value = "";

  // Retira o estado fixo e anima de volta.
  book.classList.remove("open");

  const animation = flipPage.animate(
    [
      { transform: "rotateY(-180deg) translateZ(0)" },
      { transform: "rotateY(-150deg) translateZ(20px)", offset: .20 },
      { transform: "rotateY(-108deg) translateZ(42px)", offset: .43 },
      { transform: "rotateY(-64deg) translateZ(46px)", offset: .64 },
      { transform: "rotateY(-25deg) translateZ(25px)", offset: .82 },
      { transform: "rotateY(0deg) translateZ(0)" }
    ],
    {
      duration: 1050,
      easing: "cubic-bezier(.55,.02,.24,.99)",
      fill: "both"
    }
  );

  ambient.style.backgroundImage = 'url("imagens/pagina1.png")';

  animation.finished.finally(() => {
    animation.cancel();
    pageTwo.setAttribute("aria-hidden", "true");
    isAnimating = false;
  });
}

turnPageButton.addEventListener("click", openSecondPage);
backButton.addEventListener("click", backToFirstPage);

form.addEventListener("submit", (event) => {
  const nome = guestName.value.trim();

  if (!nome) {
    event.preventDefault();
    statusMessage.textContent = "Por favor, informe seu nome.";
    guestName.focus({ preventScroll: true });
    return;
  }

  submitState = "sending";
  statusMessage.textContent = "Enviando...";
  confirmButton.disabled = true;
});

/*
  O iframe carrega uma vez ao iniciar.
  Só aceitamos o evento se um envio estiver em andamento.
  Isso elimina o bug do “Oba!” aparecer ao abrir a página 2.
*/
submitFrame.addEventListener("load", () => {
  if (submitState !== "sending") return;

  submitState = "done";
  confirmButton.disabled = false;
  statusMessage.textContent = "";

  form.hidden = true;
  successMessage.hidden = false;
  guestName.value = "";
});
