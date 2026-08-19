const book=document.getElementById("book");
const openBook=document.getElementById("openBook");
const pageTwo=document.getElementById("pageTwo");
const backButton=document.getElementById("backButton");
const form=document.getElementById("rsvpForm");
const guestName=document.getElementById("guestName");
const confirmButton=document.getElementById("confirmButton");
const statusMessage=document.getElementById("statusMessage");
const successBox=document.getElementById("successBox");

openBook.addEventListener("click",()=>{
  book.classList.add("open");
  pageTwo.setAttribute("aria-hidden","false");
  setTimeout(()=>guestName.focus(),700);
});

backButton.addEventListener("click",()=>{
  book.classList.remove("open");
  pageTwo.setAttribute("aria-hidden","true");
  form.hidden=false;
  successBox.hidden=true;
  guestName.value="";
  statusMessage.textContent="";
  confirmButton.disabled=false;
  confirmButton.textContent="Confirmar presença";
});

form.addEventListener("submit",(event)=>{
  const nome=guestName.value.trim();
  if(!nome){
    event.preventDefault();
    statusMessage.textContent="Por favor, informe seu nome.";
    guestName.focus();
    return;
  }
  statusMessage.textContent="Enviando...";
  confirmButton.disabled=true;
  confirmButton.textContent="Enviando...";

  setTimeout(()=>{
    form.hidden=true;
    successBox.hidden=false;
    statusMessage.textContent="";
    guestName.value="";
    confirmButton.disabled=false;
    confirmButton.textContent="Confirmar presença";
  },1000);
});

guestName.addEventListener("input",()=>{
  if(guestName.value.trim()) statusMessage.textContent="";
});
