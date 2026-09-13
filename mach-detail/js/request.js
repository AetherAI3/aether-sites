// Shared, dependency-free request validation. Preferences are not availability.
export const SHOP_ZONE = 'America/New_York';
export const SERVICES = Object.freeze({standard:'Interior & exterior detail',correction:'Paint correction',ceramic:'Ceramic protection',advice:'Help choosing a service'});
export const WINDOWS = Object.freeze({flexible:'Flexible',morning:'Morning',afternoon:'Afternoon'});
export function shopDay(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US',{timeZone:SHOP_ZONE,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  const get = type => parts.find(p => p.type === type).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
export function addDays(day, days) { const date=new Date(`${day}T12:00:00Z`);date.setUTCDate(date.getUTCDate()+days);return date.toISOString().slice(0,10); }
export function formatDay(day) { return new Intl.DateTimeFormat('en-US',{weekday:'short',month:'short',day:'numeric',timeZone:'UTC'}).format(new Date(`${day}T12:00:00Z`)); }
export function validateRequest(input, now = new Date()) {
  const data = Object.fromEntries(['name','vehicle','service','date','window','notes'].map(key=>[key,typeof input[key]==='string'?input[key].trim():'']));
  if (!data.name || data.name.length>80 || /[\r\n\x00-\x1f]/.test(data.name)) return {error:'Enter your name (up to 80 characters).',field:'customer-name'};
  if (!data.vehicle || data.vehicle.length>100 || /[\r\n\x00-\x1f]/.test(data.vehicle)) return {error:'Enter the year, make, and model (up to 100 characters).',field:'vehicle'};
  if (!Object.hasOwn(SERVICES,data.service)) return {error:'Choose a service.',field:'service'};
  if (!Object.hasOwn(WINDOWS,data.window)) return {error:'Choose an arrival preference.',field:'arrival-window'};
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) return {error:'Choose a valid preferred date.',field:'preferred-day'};
  const date=new Date(`${data.date}T12:00:00Z`);
  if (!Number.isFinite(date.valueOf()) || date.toISOString().slice(0,10)!==data.date) return {error:'Choose a valid preferred date.',field:'preferred-day'};
  const today=shopDay(now);
  if(data.date<=today || data.date>addDays(today,90)) return {error:'Choose a day from tomorrow through the next 90 days. For today, call the shop.',field:'preferred-day'};
  if(date.getUTCDay()===0) return {error:'The supplied hours list Sunday as closed. Choose Monday–Saturday.',field:'preferred-day'};
  if(data.notes.length>600 || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(data.notes)) return {error:'Keep the note to 600 characters.',field:'notes'};
  return {data};
}
export function buildRequest(data) {
  return `Hi Mach Detail, I’d like to ask about an appointment.\n\nName: ${data.name}\nVehicle: ${data.vehicle}\nService: ${SERVICES[data.service]}\nPreferred day: ${formatDay(data.date)} (${data.date})\nArrival preference: ${WINDOWS[data.window]}${data.date && new Date(data.date+'T12:00:00Z').getUTCDay()===6?' (Saturday hours: 9am–2pm)':''}${data.notes?'\nNotes: '+data.notes:''}\n\nPlease confirm availability, pricing, and the right service for my vehicle.`;
}
