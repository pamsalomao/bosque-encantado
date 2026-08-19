const book=document.getElementById("book");const openBook=document.getElementById("openBook");const backButton=document.getElementById("backButton");const pageRsvp=document.getElementById("pageRsvp");const form=document.getElementById("rsvpForm");const guestName=document.getElementById("guestName");const confirmButton=document.getElementById("confirmButton");const statusMessage=document.getElementById("statusMessage");const successMessage=document.getElementById("successMessage");const submitFrame=document.getElementById("submitFrame");

openBook.addEventListener("click",()=>{book.classList.add("open");pageRsvp.setAttribute("aria-hidden","false");setTimeout(()=>guestName.focus(),700)});

backButton.addEventListener("click",()=>{book.classList.remove("open");pageRsvp.setAttribute("aria-hidden","true");form.hidden=false;successMessage.hidden=true;statusMessage.textContent="";confirmButton.disabled=false;confirmButton.innerHTML="<span>🌿</span> Confirmar presença"});

form.addEventListener("submit",(event)=>{const nome=guestName.value.trim();if(!nome){event.preventDefault();statusMessage.textContent="Por favor, informe seu nome.";guestName.focus();return}statusMessage.textContent="Enviando...";confirmButton.disabled=true;confirmButton.innerHTML="<span>🌿</span> Enviando...";setTimeout(()=>{form.hidden=true;successMessage.hidden=false;confirmButton.disabled=false;confirmButton.innerHTML="<span>🌿</span> Confirmar presença";guestName.value=""},900)});

guestName.addEventListener("input",()=>{if(guestName.value.trim())statusMessage.textContent=""});
