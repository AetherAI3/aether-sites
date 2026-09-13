import { SERVICES, WINDOWS, shopDay, addDays, formatDay, validateRequest, buildRequest } from './request.js';
const form=document.querySelector('#booking-form');
if(form){
  const fields=document.querySelector('#booking-fields'),date=form.elements.date,error=document.querySelector('#form-error'),result=document.querySelector('#request-result'),text=document.querySelector('#request-text'),sms=document.querySelector('#text-request');
  const refreshDates=()=>{const today=shopDay();date.min=addDays(today,1);date.max=addDays(today,90);};
  function summarize(){
    document.querySelector('#summary-service').textContent=SERVICES[form.elements.service.value]||'Choose a service';
    document.querySelector('#summary-day').textContent=date.value&&/^\d{4}-\d{2}-\d{2}$/.test(date.value)?formatDay(date.value):'Choose a day';
    document.querySelector('#summary-window').textContent=WINDOWS[form.elements.window.value]||'Choose a preference';
  }
  function invalidate(){result.hidden=true;sms.removeAttribute('href');text.value='';error.textContent='';summarize();}
  form.addEventListener('input',invalidate);form.addEventListener('change',invalidate);
  document.querySelectorAll('[data-service]').forEach(link=>link.addEventListener('click',()=>{form.elements.service.value=link.dataset.service;invalidate();}));
  form.addEventListener('submit',event=>{
    event.preventDefault();refreshDates();
    const checked=validateRequest(Object.fromEntries(new FormData(form)));
    if(checked.error){result.hidden=true;error.textContent=checked.error;document.getElementById(checked.field).focus();return;}
    error.textContent='';text.value=buildRequest(checked.data);sms.href='sms:+13477256349?body='+encodeURIComponent(text.value);result.hidden=false;document.querySelector('#copy-status').textContent='Review and send it in your messaging app. The shop will confirm availability.';text.focus();
  });
  document.querySelector('#copy-request').addEventListener('click',async()=>{
    const status=document.querySelector('#copy-status');
    try{if(!navigator.clipboard?.writeText)throw new Error('unavailable');await navigator.clipboard.writeText(text.value);status.textContent='Copied. Paste it into a message to Mach Detail; nothing has been sent yet.';}
    catch{text.focus();text.select();status.textContent='Select and copy the request above, then send it to the shop.';}
  });
  window.addEventListener('pageshow',refreshDates);
  refreshDates();summarize();fields.disabled=false;document.querySelector('#form-unavailable').hidden=true;
}
