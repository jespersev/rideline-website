// FETCH API
document.addEventListener("DOMContentLoaded", function () {
  const form=document.getElementById("inquiry-form"); if(!form)return;
  const select=document.getElementById("inquiry-motorcycle"), submit=document.getElementById("inquiry-submit");
  const status=document.getElementById("inquiry-status"), success=document.getElementById("inquiry-success"), errorBox=document.getElementById("inquiry-error");
  let motorcycles=[];
  fetch("data/motorcycles.json").then(function(r){if(!r.ok)throw new Error("Motorcycle data could not be loaded.");return r.json();}).then(function(data){
    motorcycles=data;select.innerHTML='<option value="">Select motorcycle</option>';
    data.forEach(function(bike){const option=document.createElement("option");option.value=bike.id;option.textContent=bike.name;select.appendChild(option);});
    const requested=new URLSearchParams(location.search).get("motorcycle");if(requested&&data.some(function(b){return b.id===requested;}))select.value=requested;
  }).catch(function(){select.innerHTML='<option value="">Motorcycle list unavailable</option>';errorBox.textContent="Motorcycle data could not be loaded. Please run the website through VS Code Live Server and refresh.";errorBox.classList.remove("hidden");});
  function setFieldError(id,message){const el=document.getElementById("error-"+id);if(el)el.textContent=message;}
  // FORM VALIDATION
  function validate(){let valid=true;["name","email","phone","city","motorcycle","type"].forEach(function(id){setFieldError(id,"");});
    const name=document.getElementById("inquiry-name").value.trim(), email=document.getElementById("inquiry-email").value.trim(), phone=document.getElementById("inquiry-phone").value.trim();
    const city=document.getElementById("inquiry-city").value, bike=select.value, type=document.getElementById("inquiry-type").value;
    if(!name){setFieldError("name","Please enter your full name.");valid=false;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setFieldError("email","Enter a valid email address.");valid=false;}
    if(!phone||!/^[+()\d\s.-]{7,20}$/.test(phone)){setFieldError("phone","Enter a valid contact number.");valid=false;}
    if(!city){setFieldError("city","Select a preferred location.");valid=false;}
    if(!bike){setFieldError("motorcycle","Select a motorcycle.");valid=false;}
    if(!type){setFieldError("type","Select an inquiry type.");valid=false;}
    return valid;
  }
  // ASYNCHRONOUS
  // ASYNCHRONOUS
  function delay(ms){return new Promise(function(resolve){setTimeout(resolve,ms);});}
  // FORM VALIDATION
  // FORM VALIDATION
  form.addEventListener("submit",async function(event){event.preventDefault();if(submit.disabled)return;success.classList.add("hidden");status.classList.add("hidden");errorBox.classList.add("hidden");
    if(!validate()){errorBox.textContent="Please correct the highlighted fields before submitting.";errorBox.classList.remove("hidden");return;}
    const bike=motorcycles.find(function(b){return b.id===select.value;});
    const details={name:document.getElementById("inquiry-name").value.trim(),email:document.getElementById("inquiry-email").value.trim(),phone:document.getElementById("inquiry-phone").value.trim(),city:document.getElementById("inquiry-city").value,motorcycle:bike?bike.name:select.value,type:document.getElementById("inquiry-type").value,message:document.getElementById("inquiry-message").value.trim()};
    submit.disabled=true;submit.textContent="Processing...";status.classList.remove("hidden");status.innerHTML='<span class="loading-dot"></span> Submitting your inquiry...';
    try{
      await delay(2000);status.innerHTML='<span class="loading-dot"></span> Processing your inquiry details...';
      await delay(2500);status.innerHTML='<span class="loading-dot"></span> Finalizing your inquiry...';
      await delay(2000);
      status.classList.add("hidden");success.classList.remove("hidden");
      success.innerHTML=`<h3>✓ Your inquiry has been submitted successfully.</h3><div class="inquiry-summary"><p><strong>Name</strong><br>${escapeText(details.name)}</p><p><strong>Email</strong><br>${escapeText(details.email)}</p><p><strong>Motorcycle</strong><br>${escapeText(details.motorcycle)}</p><p><strong>Preferred location</strong><br>${escapeText(details.city)}</p><p><strong>Inquiry type</strong><br>${escapeText(details.type)}</p>${details.message?`<p><strong>Message</strong><br>${escapeText(details.message)}</p>`:""}</div><a class="btn btn-red" href="motorcycles.html">Return to Motorcycles</a>`;
      form.reset();
    }catch(error){status.classList.add("hidden");errorBox.textContent="Something went wrong while processing the demo inquiry. Please try again.";errorBox.classList.remove("hidden");}
    finally{submit.disabled=false;submit.textContent="Submit Inquiry";}
  });
  function escapeText(value){return String(value).replace(/[&<>"']/g,function(ch){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch];});}
});
