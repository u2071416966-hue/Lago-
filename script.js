// =============================================
// VARIABLES GLOBALES
// =============================================
let mapAdmin, mapClient, clientMarker;
let mapInitialized = false;
const TOURS_LAT = 47.3941, TOURS_LNG = 0.6848;
window.currentUser = null;
window.currentDriver = null;
window.pendingDriverSignup = null;
window.etaInt = null;
let currentDeliveryDriver = null;

const avatarsStandard = [
  "https://api.dicebear.com/7.x/notionists/svg?seed=Mimi",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Toby",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Coco",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Loki",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Buster"
];
const avatarsPremium = [
  "https://api.dicebear.com/7.x/micah/svg?seed=King&backgroundColor=000000",
  "https://api.dicebear.com/7.x/micah/svg?seed=Queen&backgroundColor=b91c1c",
  "https://api.dicebear.com/7.x/micah/svg?seed=Jack&backgroundColor=1d4ed8"
];

let reglages = {
  theme:"dark", adminTheme:"dark", isPremium:false, cagnotte:0, cagnotteSpent:0,
  historiqueCommandes:[], moisCoussinGratuit:null,
  caTotal:0, totalOrders:0, users:[], driverApplications:[],
  promoCodeStr:"FREROT", promoValue:5, promoConfig:{code:"FREROT", percent:20, target:"all", active:true}, easterPromoUnlocked:false, easterPromoUsed:false, adminActionLog:[],
  welcomeText:"On vous livre un vrai lit, tout de suite.", taxeNuit:false, weatherSurge:false,
  avatarUrl:avatarsStandard[0],
  prixSolo:20, ruptureSolo:false, prixDuo:35, ruptureDuo:false,
  prixGonflable:10, ruptureGonflable:false, prixBebe:25, ruptureBebe:false,
  options:{
    opt1:{active:true,name:"☁️ Coussin",price:5,desc:"Oreiller ergonomique hyper moelleux."},
    opt2:{active:true,name:"✨ Draps propres",price:8,desc:"Parure complète lavée et repassée."},
    opt3:{active:true,name:"🧸 Grosse Couette",price:12,desc:"Couette épaisse et bien chaude."},
    opt4:{active:true,name:"🛠️ Installation",price:5,desc:"Le coursier gonfle et prépare le lit."},
    opt5:{active:true,name:"🤫 Pack Nuit",price:5,desc:"Masque de nuit et boules Quies."}
  },
  referrals:[], referralClaimed:false, savedCards:[], favorites:[], claimedPromotionIds:[], activeRewardPromo:null, paypalEmail:'', deliverySpeedMultiplier:1
};

let cart=[], selectedMattress=null, promoActive=false;
let currentCagnotteDeduction=0, currentTip=0, cartDistance=0.5;
let drivers=[], fakeUsers=[];
let botInterval=null, currentClientRating=0;
window.currentOpenDriverId=null; window.currentOpenUserId=null;
let pendingPaymentCallback=null, currentPaymentAmount=0;
let logoutInProgress=false;
const APP_VERSION='V43 amélioration matelas, wallet et aide';
const APP_STORAGE_KEY='lagoUberV20_session';
const LEGACY_STORAGE_KEY='lagoUberV20';
const CLIENT_TABS=['home','orders','profile'];
const CARD_DESIGNS=[
  {id:'classic',name:'Bleu Lago',desc:'Le design Lago classique, simple et propre.'},
  {id:'aurora',name:'Aurora',desc:'Turquoise premium avec reflet lumineux.'},
  {id:'obsidian',name:'Obsidian',desc:'Noir graphite ultra sobre.'},
  {id:'sunset',name:'Sunset',desc:'Dégradé chaud orange et rose.'},
  {id:'frost',name:'Frozen Glass',desc:'Version glacée translucide façon Lago+.'},
  {id:'ruby',name:'Ruby Pulse',desc:'Rouge rubis avec accents profonds.'},
  {id:'emerald',name:'Emerald',desc:'Vert intense inspiré des pierres précieuses.'},
  {id:'amethyst',name:'Amethyst',desc:'Violet premium avec halo doux.'},
  {id:'titanium',name:'Titanium',desc:'Métallique gris moderne et net.'},
  {id:'cobalt',name:'Cobalt',desc:'Bleu électrique très marqué.'},
  {id:'rosegold',name:'Rose Gold',desc:'Rose premium avec finition dorée.'},
  {id:'midnight',name:'Midnight',desc:'Bleu nuit sombre et élégant.'},
  {id:'coral',name:'Coral Bloom',desc:'Corail lumineux et solaire.'},
  {id:'ocean',name:'Deep Ocean',desc:'Bleus marins en couches profondes.'},
  {id:'forest',name:'Forest',desc:'Vert forêt sobre avec relief sombre.'},
  {id:'plasma',name:'Plasma',desc:'Dégradé néon rose-violet très vif.'},
  {id:'goldleaf',name:'Gold Leaf',desc:'Or satiné façon carte prestige.'},
  {id:'lavender',name:'Lavender',desc:'Lavande pastel très douce.'},
  {id:'mint',name:'Mint',desc:'Menthe claire fraîche et légère.'},
  {id:'cherry',name:'Cherry Pop',desc:'Rouge cerise très franc.'},
  {id:'sandstorm',name:'Sandstorm',desc:'Sable doré avec contraste chaud.'},
  {id:'polar',name:'Polar Night',desc:'Bleu polaire et noir givré.'},
  {id:'ember',name:'Ember',desc:'Braises rouge-orange lumineuses.'},
  {id:'lagoon',name:'Lagoon',desc:'Lagon turquoise et vert d’eau.'},
  {id:'velvet',name:'Velvet Plum',desc:'Prune velours luxueuse.'},
  {id:'onyxred',name:'Onyx Red',desc:'Noir intense traversé de rouge.'},
  {id:'starlight',name:'Starlight',desc:'Bleu nuit parsemé d’éclats lumineux.'},
  {id:'citrus',name:'Citrus',desc:'Jaune agrume énergique.'},
  {id:'indigo',name:'Indigo',desc:'Bleu-violet profond et net.'},
  {id:'skyline',name:'Skyline',desc:'Bleu ciel moderne avec lignes urbaines.'},
  {id:'graphite',name:'Graphite',desc:'Graphite mat discret et premium.'},
  {id:'pearl',name:'Pearl',desc:'Blanc nacré raffiné.'},
  {id:'neonwave',name:'Neon Wave',desc:'Rubans néon bleus et roses.'},
  {id:'moka',name:'Moka',desc:'Brun moka avec reflet caramel.'},
  {id:'glacier',name:'Glacier',desc:'Blanc glacé bleu très propre.'},
  {id:'sakura',name:'Sakura',desc:'Rose tendre inspiré des pétales.'},
  {id:'copper',name:'Copper',desc:'Cuivre chaleureux légèrement brillant.'},
  {id:'matrix',name:'Matrix',desc:'Vert techno sur fond sombre.'},
  {id:'royal',name:'Royal Blue',desc:'Bleu royal avec relief chic.'},
  {id:'bubblegum',name:'Bubblegum',desc:'Rose pop plein d’énergie.'},
  {id:'volt',name:'Volt',desc:'Jaune électrique futuriste.'},
  {id:'dune',name:'Dune',desc:'Beige désert adouci.'},
  {id:'eclipse',name:'Eclipse',desc:'Noir et halo lunaire.'},
  {id:'monaco',name:'Monaco Red',desc:'Rouge sport chic.'},
  {id:'pixel',name:'Pixel Grid',desc:'Motif numérique discret et moderne.'},
  {id:'tropical',name:'Tropical',desc:'Dégradé exotique vert-bleu-jaune.'},
  {id:'crimson',name:'Crimson',desc:'Rouge bordeaux profond.'},
  {id:'smoke',name:'Smoke',desc:'Gris fumée moderne et minimal.'},
  {id:'prism',name:'Prism',desc:'Reflets multicolores premium.'},
  {id:'arctic',name:'Arctic Blue',desc:'Bleu arctique lumineux et net.'}
];
let currentCardDesign='classic';
let editingSavedCardIndex=-1;
let currentClientTab='home';
let deliveryInProgress=false;
let deliveryMiniVisible=false;
let deliveryFinishTimer=null;
let deliveryStageTimer=null;
let lastCATrendBase=null;
let lastOrderSummary=null;
let clientNavDragActive=false;
let clientNavDragIndex=0;


const DRIVER_INITIAL_COLORS=['#007aff','#34c759','#ff9500','#ff3b30','#af52de','#5856d6','#ff2d55','#00c7be','#8e8e93','#bf5af2','#30d158','#ffd60a'];
const DRIVER_INITIAL_LETTERS='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
function driverInitialColor(letter){
  let code=(letter||'L').toUpperCase().charCodeAt(0)-65;
  return DRIVER_INITIAL_COLORS[Math.max(0,code)%DRIVER_INITIAL_COLORS.length];
}
function driverInitialAvatar(letter){
  letter=(letter||'L').toUpperCase().replace(/[^A-Z]/g,'').charAt(0)||'L';
  const color=driverInitialColor(letter);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${color}"/><stop offset="1" stop-color="#0b1220"/></linearGradient></defs><rect width="120" height="120" rx="60" fill="url(#g)"/><text x="60" y="74" text-anchor="middle" font-size="52" font-family="Arial, sans-serif" font-weight="900" fill="white">${letter}</text></svg>`;
  return 'data:image/svg+xml;utf8,'+encodeURIComponent(svg);
}
function getDriverInitialFromName(name){ return (name||'L').trim().toUpperCase().replace(/[^A-Z]/g,'').charAt(0)||'L'; }
const DEFAULT_DRIVER_PHOTO=driverInitialAvatar('L');

// État carte paiement
let selectedSavedCardIndex=-1;
let showingNewCardForm=true;


function lockRubberBandScroll(){
  const scrollables=['clientApp','adminApp','driverApp'].map(id=>document.getElementById(id)).filter(Boolean);
  scrollables.forEach(el=>{
    let startY=0;
    el.addEventListener('touchstart',e=>{ if(e.touches&&e.touches.length) startY=e.touches[0].clientY; },{passive:true});
    el.addEventListener('touchmove',e=>{
      if(!e.touches||!e.touches.length) return;
      const y=e.touches[0].clientY;
      const atTop=el.scrollTop<=0;
      const atBottom=el.scrollTop+el.clientHeight>=el.scrollHeight-1;
      if((atTop && y>startY) || (atBottom && y<startY)) e.preventDefault();
    },{passive:false});
  });
}

// =============================================
// INIT DOM
// =============================================
document.addEventListener("DOMContentLoaded", function() {
  initAvatarsUI();
  initCardInputListeners();
  initLiquidGlassNav();
  renderCardDesignPicker();
  startSimpleIntro();
  lockRubberBandScroll();
});

setInterval(() => {
  let el = document.getElementById('viewerCount');
  if(el) el.innerText = Math.floor(Math.random()*(130-45+1))+45;
}, 3500);

// =============================================
// LISTENERS CARTE BANCAIRE
// =============================================
function initCardInputListeners() {
  let numEl = document.getElementById('cardNumber');
  let holderEl = document.getElementById('cardHolder');
  let expiryEl = document.getElementById('cardExpiry');
  let cvvEl = document.getElementById('cardCVV');

  numEl.addEventListener('input', function() {
    let raw = this.value.replace(/\D/g,'').substring(0,16);
    let groups = [];
    for(let i=0;i<raw.length;i+=4) groups.push(raw.substring(i,i+4));
    this.value = groups.join(' ');
    updatePaymentCardPreview();
  });

  holderEl.addEventListener('input', function() {
    this.value = this.value.toUpperCase();
    updatePaymentCardPreview();
  });

  expiryEl.addEventListener('keydown', function(e) {
    if(e.key==='Backspace') return;
    if(!/\d/.test(e.key)&&e.key!=='Tab'&&e.key!=='ArrowLeft'&&e.key!=='ArrowRight') e.preventDefault();
  });

  expiryEl.addEventListener('input', function() {
    let raw = this.value.replace(/\D/g,'').substring(0,4);
    this.value = raw.length>=3 ? raw.substring(0,2)+'/'+raw.substring(2) : raw;
    updatePaymentCardPreview();
  });

  cvvEl.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g,'').substring(0,3);
    updatePaymentCardPreview();
  });

  [numEl, holderEl, expiryEl].forEach(el=>el.addEventListener('focus', ()=>setPaymentCardFace('front')));
  cvvEl.addEventListener('focus', ()=>setPaymentCardFace('back'));
}

// =============================================
// CARTES SAUVEGARDÉES DANS LE PANNEAU PAIEMENT

// =============================================
// CARTES SAUVEGARDÉES DANS LE PANNEAU PAIEMENT
// =============================================
function renderSavedCardsInPayment() {
  let zone = document.getElementById('savedCardsPayZone');
  let list = document.getElementById('savedCardsPayList');
  if(!reglages.savedCards||reglages.savedCards.length===0) {
    zone.style.display='none';
    showNewCardForm(true);
    updatePaymentCardPreview();
    return;
  }
  zone.style.display='block';
  list.innerHTML = reglages.savedCards.map((c,i) => `
    <div class="saved-card-select-item ${selectedSavedCardIndex===i?'selected-card':''}" onclick="selectSavedCard(${i})">
      ${savedCardMiniHtml(c).replace('<div class="saved-card-mini',`<div onclick="openSavedCardDesignPicker(${i},event)" title="Changer le design" class="saved-card-mini`)}
      <div class="saved-card-info">
        <div class="saved-card-name">${c.type} •••• ${c.last4}</div>
        <div class="saved-card-sub">${c.holder} — Exp. ${c.expiry}${c.design?` • ${getCardDesignName(c.design)}`:''}</div>
      </div>
      ${selectedSavedCardIndex===i?'<div class="saved-card-check">✓</div>':''}
    </div>`).join('');
  if(selectedSavedCardIndex>=0) showNewCardForm(false);
  else showNewCardForm(true);
  updatePaymentCardPreview();
}

window.selectSavedCard = function(index) {
  selectedSavedCardIndex = selectedSavedCardIndex===index ? -1 : index;
  showNewCardForm(selectedSavedCardIndex<0);
  if(selectedSavedCardIndex>=0 && reglages.savedCards[selectedSavedCardIndex]?.design){
    currentCardDesign = normalizeCardDesignId(reglages.savedCards[selectedSavedCardIndex].design);
  }
  renderSavedCardsInPayment();
};

function showNewCardForm(show) {
  document.getElementById('newCardForm').style.display = show?'block':'none';
  let toggle = document.getElementById('toggleNewCardBtn');
  if(reglages.savedCards&&reglages.savedCards.length>0) {
    toggle.innerText = show?'✕ Annuler nouvelle carte':'➕ Utiliser une nouvelle carte';
  }
  showingNewCardForm = show;
  if(show && window.currentUser && window.currentUser.role!=='admin') currentCardDesign = window.currentUser.selectedCardDesign || currentCardDesign || 'classic';
  updatePaymentCardPreview();
}

window.toggleNewCardForm = function() {
  if(showingNewCardForm) {
    selectedSavedCardIndex = reglages.savedCards.length>0?0:-1;
    showNewCardForm(false);
  } else {
    selectedSavedCardIndex = -1;
    showNewCardForm(true);
  }
  renderSavedCardsInPayment();
};

// =============================================
// CARTE 3D & DESIGNS
// =============================================
function getCardDesignName(id){
  let d=CARD_DESIGNS.find(x=>x.id===id);
  return d?d.name:'Bleu Lago';
}
function normalizeCardDesignId(id){
  return CARD_DESIGNS.some(d=>d.id===id) ? id : 'classic';
}
function savedCardMiniHtml(card){
  let design=normalizeCardDesignId(card&&card.design);
  let last4=(card&&card.last4)?card.last4:'0000';
  return `<div class="saved-card-mini ${design}"><span>•••• ${last4}</span></div>`;
}
function getCurrentCardType(rawNumber){
  let num=(rawNumber||'').replace(/\D/g,'');
  if(num.startsWith('4')) return 'Visa';
  if(num.startsWith('5')) return 'Mastercard';
  if(num.startsWith('3')) return 'Amex';
  return 'CB';
}
function applyCardDesignClass(designId){
  let scene=document.getElementById('cardDisplayScene');
  if(!scene) return;
  scene.className='card-display card-scene card-design-'+normalizeCardDesignId(designId);
}
function getPreviewCardData(){
  if(selectedSavedCardIndex>=0 && reglages.savedCards && reglages.savedCards[selectedSavedCardIndex]){
    let c=reglages.savedCards[selectedSavedCardIndex];
    return {
      number:`•••• •••• •••• ${c.last4}`,
      holder:c.holder || 'VOTRE NOM',
      expiry:c.expiry || 'MM/AA',
      cvv:'•••',
      last4:c.last4 || '0000',
      type:c.type || 'CB',
      design:normalizeCardDesignId(c.design || currentCardDesign)
    };
  }
  let raw=(document.getElementById('cardNumber')?.value || '').replace(/\D/g,'').substring(0,16);
  let padded=raw.padEnd(16,'•');
  let dg=[];
  for(let i=0;i<padded.length;i+=4) dg.push(padded.substring(i,i+4));
  let holder=(document.getElementById('cardHolder')?.value || '').trim().toUpperCase() || 'VOTRE NOM';
  let expiry=(document.getElementById('cardExpiry')?.value || '').trim() || 'MM/AA';
  let cvv=(document.getElementById('cardCVV')?.value || '').trim();
  return {
    number:dg.join(' '),
    holder,
    expiry,
    cvv: cvv ? cvv.padEnd(3,'•') : '•••',
    last4: raw ? raw.slice(-4).padStart(4,'0') : '0000',
    type: getCurrentCardType(raw),
    design: currentCardDesign || 'classic'
  };
}
function updatePaymentCardPreview(){
  let data=getPreviewCardData();
  currentCardDesign=normalizeCardDesignId(data.design || currentCardDesign);
  applyCardDesignClass(currentCardDesign);
  let n=document.getElementById('cardNumberDisplay'); if(n) n.innerText=data.number;
  let h=document.getElementById('cardHolderDisplay'); if(h) h.innerText=data.holder;
  let ex=document.getElementById('cardExpiryDisplay'); if(ex) ex.innerText=data.expiry;
  let cvv=document.getElementById('cardCvvDisplay'); if(cvv) cvv.innerText=data.cvv;
  let l4=document.getElementById('cardLast4Display'); if(l4) l4.innerText=data.last4;
  let brand=document.getElementById('cardBrandDisplay'); if(brand) brand.innerText=data.type;
  let backType=document.getElementById('cardBackTypeDisplay'); if(backType) backType.innerText=data.type;
  let btn=document.getElementById('cardDesignBtn'); if(btn) btn.style.display=reglages.isPremium?'flex':'none';
}
function setPaymentCardFace(face){
  let card=document.getElementById('paymentCard3D');
  if(!card) return;
  card.classList.toggle('is-flipped', face==='back');
}
window.togglePaymentCardFlip=function(e){
  if(e && e.target && e.target.closest && e.target.closest('.card-display-controls')) return;
  let card=document.getElementById('paymentCard3D');
  if(!card) return;
  card.classList.toggle('is-flipped');
};
window.openCardDesignPicker=function(e){
  if(e) e.stopPropagation();
  editingSavedCardIndex=-1;
  if(!reglages.isPremium) return alert('Les designs de carte sont réservés aux membres Lago+ 👑');
  renderCardDesignPicker();
  document.getElementById('cardDesignModal').classList.add('show');
};
window.openSavedCardDesignPicker=function(index,e){
  if(e) e.stopPropagation();
  if(!reglages.isPremium) return alert('Les designs de carte sont réservés aux membres Lago+ 👑');
  editingSavedCardIndex=index;
  if(reglages.savedCards&&reglages.savedCards[index]) currentCardDesign=normalizeCardDesignId(reglages.savedCards[index].design);
  renderCardDesignPicker();
  document.getElementById('cardDesignModal').classList.add('show');
};
window.closeCardDesignPicker=function(){
  editingSavedCardIndex=-1;
  document.getElementById('cardDesignModal').classList.remove('show');
};
window.selectCardDesign=function(id){
  let design=normalizeCardDesignId(id);
  if(editingSavedCardIndex>=0 && reglages.savedCards && reglages.savedCards[editingSavedCardIndex]){
    reglages.savedCards[editingSavedCardIndex].design=design;
    renderSavedCards();
  } else {
    currentCardDesign=design;
    if(window.currentUser && window.currentUser.role!=='admin') window.currentUser.selectedCardDesign=design;
    updatePaymentCardPreview();
  }
  renderCardDesignPicker();
  saveAll();
  closeCardDesignPicker();
};

function getCardDesignCategory(id){
  const light=['frost','lavender','mint','goldleaf','pearl','glacier','sakura','dune','citrus','volt'];
  const dark=['obsidian','midnight','polar','onyxred','graphite','matrix','eclipse','smoke','starlight'];
  const premium=['rosegold','goldleaf','prism','titanium','royal','frost','glacier','pearl','amethyst','velvet'];
  const fun=['plasma','neonwave','pixel','bubblegum','tropical','citrus','sakura','volt','coral','sunset'];
  if(light.includes(id)) return 'clair';
  if(dark.includes(id)) return 'sombre';
  if(premium.includes(id)) return 'premium';
  if(fun.includes(id)) return 'fun';
  return 'classique';
}
let currentCardDesignCategory='all';
window.filterCardDesignCategory=function(cat){ currentCardDesignCategory=cat||'all'; renderCardDesignPicker(); };
function renderCardDesignPicker(){
  let list=document.getElementById('cardDesignList');
  if(!list) return;
  let selected=(editingSavedCardIndex>=0&&reglages.savedCards&&reglages.savedCards[editingSavedCardIndex])?normalizeCardDesignId(reglages.savedCards[editingSavedCardIndex].design):currentCardDesign;
  let cats=[['all','Tous'],['classique','Classiques'],['premium','Premium'],['sombre','Sombres'],['clair','Clairs'],['fun','Fun']];
  let filtered=CARD_DESIGNS.filter(d=>currentCardDesignCategory==='all'||getCardDesignCategory(d.id)===currentCardDesignCategory);
  list.innerHTML=`<div class="card-category-row">${cats.map(c=>`<button class="card-cat-btn ${currentCardDesignCategory===c[0]?'active':''}" onclick="filterCardDesignCategory('${c[0]}')">${c[1]}</button>`).join('')}</div>`+
    filtered.map(d=>`<div class="card-design-item ${selected===d.id?'selected':''}" onclick="selectCardDesign('${d.id}')"><div class="card-design-preview ${d.id}"></div><div class="card-design-copy"><strong>${d.name}</strong><span>${d.desc}</span></div>${selected===d.id?'<div class="card-design-check">✓</div>':''}</div>`).join('');
  renderClientStats();
}

document.addEventListener('click', function(e){
  let modal=document.getElementById('cardDesignModal');
  if(modal && e.target===modal) closeCardDesignPicker();
});

window.openLagoPlusModal=function(){
  if(!reglages.isPremium) return;
  let bal=document.getElementById('lagoPlusBalance');
  if(bal) bal.innerText=(reglages.cagnotte||0).toFixed(2);
  let stats=document.getElementById('lagoPlusStats');
  if(stats){
    let orders=(reglages.historiqueCommandes||[]).length;
    let saved=Math.round(((reglages.historiqueCommandes||[]).reduce((a,c)=>a+(Number(c.prix)||0),0)*0.15)*100)/100;
    stats.innerHTML=`<div><strong>${orders}</strong><span>commandes</span></div><div><strong>${saved.toFixed(2)}€</strong><span>économies estimées</span></div><div><strong>${(reglages.cagnotteSpent||0).toFixed(2)}€</strong><span>cagnotte utilisée</span></div>`;
  }
  document.getElementById('lagoPlusModal').classList.add('active');
};
window.closeLagoPlusModal=function(){ document.getElementById('lagoPlusModal').classList.remove('active'); };

function promoTargetLabel(t){ return t==='all'?'Tous les matelas':t; }
function promoUsageLabel(){
  normalizePromoConfig();
  let limit=Number(reglages.promoConfig.usageLimit||999);
  let used=Number(reglages.promoConfig.usageCount||0);
  if(limit>=999) return 'Illimité';
  return `${Math.max(0,limit-used)}/${limit} utilisations restantes`;
}
function syncPromoAdminUI(){
  normalizePromoConfig();
if(!Array.isArray(reglages.adminActionLog)) reglages.adminActionLog=[];
  let code=document.getElementById('adminPromoCodeStr'); if(code) code.value=reglages.promoConfig.code;
  let val=document.getElementById('adminPromoValue'); if(val) val.value=reglages.promoConfig.percent;
  let prev=document.getElementById('adminPromoPreview');
  if(prev) prev.innerText=`${reglages.promoConfig.active?'✅':'⛔'} ${reglages.promoConfig.code} • -${reglages.promoConfig.percent}% • ${promoTargetLabel(reglages.promoConfig.target)} • ${promoUsageLabel()}`;
}
window.openPromoBuilder=function(){
  normalizePromoConfig();
  document.getElementById('promoBuilderCode').value=reglages.promoConfig.code;
  let pct=String(reglages.promoConfig.percent);
  let select=document.getElementById('promoBuilderValue');
  let has=[...select.options].some(o=>o.value===pct);
  select.value=has?pct:'custom';
  document.getElementById('promoBuilderCustom').style.display=has?'none':'block';
  document.getElementById('promoBuilderCustom').value=has?'':reglages.promoConfig.percent;
  document.getElementById('promoBuilderTarget').value=reglages.promoConfig.target;
  let usageSel=document.getElementById('promoBuilderUsage');
  if(usageSel){
    let lim=String(reglages.promoConfig.usageLimit||999);
    let usageHas=[...usageSel.options].some(o=>o.value===lim);
    usageSel.value=usageHas?lim:'custom';
    let custom=document.getElementById('promoBuilderUsageCustom');
    custom.style.display=usageHas?'none':'block';
    custom.value=usageHas?'':(reglages.promoConfig.usageLimit||1);
  }
  document.getElementById('promoBuilderActive').value=String(reglages.promoConfig.active);
  document.getElementById('promoBuilderModal').classList.add('active');
};
window.closePromoBuilder=function(){ document.getElementById('promoBuilderModal').classList.remove('active'); };
window.togglePromoCustom=function(){ document.getElementById('promoBuilderCustom').style.display=document.getElementById('promoBuilderValue').value==='custom'?'block':'none'; };
window.togglePromoUsageCustom=function(){ let el=document.getElementById('promoBuilderUsageCustom'); if(el) el.style.display=document.getElementById('promoBuilderUsage').value==='custom'?'block':'none'; };
window.savePromoBuilder=function(){
  let code=(document.getElementById('promoBuilderCode').value||'FREROT').trim().toUpperCase();
  let raw=document.getElementById('promoBuilderValue').value;
  let percent=raw==='custom'?Number(document.getElementById('promoBuilderCustom').value):Number(raw);
  let usageRaw=document.getElementById('promoBuilderUsage')?document.getElementById('promoBuilderUsage').value:'999';
  let usageLimit=usageRaw==='custom'?Number(document.getElementById('promoBuilderUsageCustom').value):Number(usageRaw);
  percent=Math.max(1,Math.min(100,percent||20));
  usageLimit=Math.max(1,Math.min(999,usageLimit||1));
  reglages.promoConfig={code,percent,target:document.getElementById('promoBuilderTarget').value,active:document.getElementById('promoBuilderActive').value==='true',usageLimit,usageCount:0};
  reglages.promoCodeStr=code; reglages.promoValue=percent;
  addAdminActionLog(`Promo ${code} sauvegardée`,0);
  syncPromoAdminUI(); closePromoBuilder(); saveAll(); updateCart();
};
function registerPromoUsageIfNeeded(){
  if(!promoActive || !reglages.promoConfig || !reglages.promoConfig.active) return;
  if(computePromoDiscount()<=0) return;
  normalizePromoConfig();
  reglages.promoConfig.usageCount=(Number(reglages.promoConfig.usageCount)||0)+1;
  if(reglages.promoConfig.usageLimit<999 && reglages.promoConfig.usageCount>reglages.promoConfig.usageLimit) reglages.promoConfig.usageCount=reglages.promoConfig.usageLimit;
  syncPromoAdminUI();
}
function computePromoDiscount(){
  if(!promoActive || !reglages.promoConfig || !reglages.promoConfig.active) return 0;
  let target=reglages.promoConfig.target||'all';
  let base=0;
  cart.forEach(c=>{ if(target==='all'||c.name===target){ let bp=(c.basePrice!=null)?Number(c.basePrice):(Number(c.price||0)-((c.options||[]).reduce((a,o)=>a+Number(o.price||0),0))); base+=Math.max(0,bp)*Number(c.qty||1); } });
  if(base<=0) return 0;
  return Math.round(base*(Number(reglages.promoConfig.percent)||0)/100*100)/100;
}
function computeEasterPromoDiscount(){
  if(!reglages.easterPromoUnlocked || reglages.easterPromoUsed) return 0;
  let base=0;
  cart.forEach(c=>{ let bp=(c.basePrice!=null)?Number(c.basePrice):(Number(c.price||0)-((c.options||[]).reduce((a,o)=>a+Number(o.price||0),0))); base+=Math.max(0,bp)*Number(c.qty||1); });
  return Math.round(base*0.10*100)/100;
}
function registerEasterPromoUsageIfNeeded(){
  if(computeEasterPromoDiscount()>0){
    reglages.easterPromoUsed=true;
    reglages.easterPromoUnlocked=false;
  }
}


// =============================================
// NAV GLASS DRAG
// =============================================
function updateClientNavIndicator(){
  let nav=document.getElementById('clientNav');
  if(!nav) return;
  let buttons=[...nav.querySelectorAll('.navBtn')];
  let idx=buttons.findIndex(b=>b.classList.contains('active'));
  if(idx<0) idx=0;
  clientNavDragIndex=idx;
  let indicator=document.getElementById('clientNavIndicator');
  if(indicator) indicator.style.transform=`translateX(${idx*100}%)`;
}
function applyClientTabByIndex(index){
  let nav=document.getElementById('clientNav');
  if(!nav) return;
  let buttons=[...nav.querySelectorAll('.navBtn')];
  index=Math.max(0,Math.min(buttons.length-1,index));
  if(CLIENT_TABS[index]!==currentClientTab){
    switchClientTab(CLIENT_TABS[index], buttons[index]);
  } else {
    buttons.forEach((b,i)=>b.classList.toggle('active',i===index));
    updateClientNavIndicator();
  }
}
function getClientNavIndexFromX(x){
  let nav=document.getElementById('clientNav');
  if(!nav) return 0;
  let rect=nav.getBoundingClientRect();
  let rel=Math.min(rect.width-1, Math.max(0, x-rect.left));
  return Math.max(0, Math.min(2, Math.floor((rel/rect.width)*3)));
}
function initLiquidGlassNav(){
  let nav=document.getElementById('clientNav');
  if(!nav) return;
  updateClientNavIndicator();
  nav.addEventListener('pointerdown', e=>{
    if(reglages.theme!=='glass') return;
    clientNavDragActive=true;
    nav.classList.add('dragging');
    applyClientTabByIndex(getClientNavIndexFromX(e.clientX));
  });
  window.addEventListener('pointermove', e=>{
    if(!clientNavDragActive || reglages.theme!=='glass') return;
    applyClientTabByIndex(getClientNavIndexFromX(e.clientX));
  });
  window.addEventListener('pointerup', ()=>{
    if(!clientNavDragActive) return;
    clientNavDragActive=false;
    nav.classList.remove('dragging');
    updateClientNavIndicator();
  });
};


// =============================================
// DONNÉES FAKE

// =============================================
// DONNÉES FAKE
// =============================================
function initFakeData() {
  const prenoms=["Karim","Mouloud","Cédric","Yanis","Mamadou","Sofiane","Lucas","Enzo","Hugo","Idriss","Thomas","Marie","Léa","Sarah","Antoine","Julien"];
  const emails=["gmail.com","yahoo.fr","hotmail.com","outlook.fr"];
  const bios=["Aime rouler vite et la drill.","Toujours à l'heure, sourire en prime.","Ancien pilote de karting.","Connaît Tours comme sa poche.","Le boss de la livraison de nuit.","Pro du créneau en 2 secondes.","Ne dort jamais."];
  for(let i=0;i<150;i++){
    let name=prenoms[Math.floor(Math.random()*prenoms.length)].toLowerCase();
    let isFakeVip=i<5;
    let ava=isFakeVip?avatarsPremium[Math.floor(Math.random()*avatarsPremium.length)]:avatarsStandard[Math.floor(Math.random()*avatarsStandard.length)];
    fakeUsers.push({id:i,email:`${name}${Math.floor(Math.random()*99)}@${emails[Math.floor(Math.random()*emails.length)]}`,password:"123",isVip:isFakeVip,vipSource:isFakeVip?'purchased':null,orders:0,signupDate:`0${Math.floor(Math.random()*9)+1}/01/2026`,banni:false,historique:[],theme:"dark",avatarUrl:ava,cagnotte:0,cagnotteSpent:0,moisCoussinGratuit:null,referrals:[],referralClaimed:false,savedCards:[],selectedCardDesign:'classic'});
  }
  fakeUsers.push({id:999,email:"client@gmail.com",password:"123",isVip:false,vipSource:null,orders:0,signupDate:"12/01/2026",banni:false,historique:[],theme:"dark",avatarUrl:avatarsStandard[0],cagnotte:0,cagnotteSpent:0,moisCoussinGratuit:null,referrals:[],referralClaimed:false,savedCards:[],selectedCardDesign:'classic'});
  for(let i=0;i<100;i++){
    let isActive=i<30;
    drivers.push({id:i,name:prenoms[i%prenoms.length]+" "+String.fromCharCode(65+(i%26))+".",bio:bios[i%bios.length],rating:isActive?5.0:0,votes:isActive?1:0,isPro:false,fired:false,photo:`https://randomuser.me/api/portraits/men/${(i%99)+1}.jpg`,hireDate:isActive?"01/01/2026":null,totalOrders:0,status:isActive?"En attente":"Non recruté",tips:0,earnings:0,comments:[],lat:TOURS_LAT-0.02+Math.random()*0.04,lng:TOURS_LNG-0.03+Math.random()*0.06});
  }
  reglages.caTotal=2500; reglages.totalOrders=85;
}

function initDefaultDrivers() {
  const prenoms=["Karim","Mouloud","Cédric","Yanis","Mamadou","Sofiane","Lucas","Enzo","Hugo","Idriss","Thomas","Marie","Léa","Sarah","Antoine","Julien"];
  const bios=["Aime rouler vite et la drill.","Toujours à l'heure, sourire en prime.","Ancien pilote de karting.","Connaît Tours comme sa poche.","Le boss de la livraison de nuit.","Pro du créneau en 2 secondes.","Ne dort jamais."];
  drivers=[];
  for(let i=0;i<100;i++){
    let isActive=i<30;
    drivers.push({id:i,name:prenoms[i%prenoms.length]+" "+String.fromCharCode(65+(i%26))+".",bio:bios[i%bios.length],rating:isActive?5.0:0,votes:isActive?1:0,isPro:false,fired:false,photo:`https://randomuser.me/api/portraits/men/${(i%99)+1}.jpg`,hireDate:isActive?"01/01/2026":null,totalOrders:0,status:isActive?"En attente":"Non recruté",tips:0,earnings:0,comments:[],lat:TOURS_LAT-0.02+Math.random()*0.04,lng:TOURS_LNG-0.03+Math.random()*0.06});
  }
}


function buildFakeDriverForm(d){
  const vehicles=['Voiture','Scooter','Vélo','À pied'];
  const avail=['Soir','Week-end','Tous les jours','Après les cours','Vacances seulement'];
  const areas=['Centre-ville','Autour de Tours','Petits trajets','Longs trajets','Peu importe'];
  const exp=['Débutant motivé','Déjà livreur','Habitué des trajets en ville','Ancien coursier'];
  let idx=(d.id||0);
  let parts=(d.name||'Candidat Lago').split(' ');
  return {
    id:'fake-'+idx,
    email:d.email||`candidat${idx}@lago-recrutement.fr`,
    photo:d.photo||driverInitialAvatar(parts[0]?.charAt(0)||'L'),
    firstName:parts[0]||'Candidat',
    lastName:parts[1]||'Lago',
    age:18+(idx%19),
    city:['Tours','Joué-lès-Tours','Saint-Cyr','La Riche','Chambray'][idx%5],
    phone:`07 ${String(10+idx%80)} ${String(20+idx%70)} ${String(30+idx%60)} ${String(40+idx%50)}`,
    experience:exp[idx%exp.length],
    vehicle:vehicles[idx%vehicles.length],
    availability:avail[idx%avail.length],
    area:areas[idx%areas.length],
    heavy:['Oui, sans problème','Oui, avec aide si besoin','Plutôt les petits lits'][idx%3],
    motivation:d.bio||'Je suis motivé, ponctuel et disponible pour livrer les clients Lago rapidement.',
    notes:'Profil disponible pour recrutement.',
    createdAt:'Aujourd’hui'
  };
}

function seedBusinessHistoryIfNeeded(){
  if(reglages._seededBusinessHistory) return;
  if(!Array.isArray(fakeUsers) || !Array.isArray(drivers)) return;
  const items=["Le Solo","Le Duo","Matelas Gonflable","Lit Parapluie"];
  const amounts=[24.99,39.99,18.99,29.99,44.99,34.99];
  const comments=["Livraison nickel.","Très rapide, merci !","Livreur sympa.","Commande propre.","Parfait pour la soirée.","Service sérieux."];
  let totalCA=0, totalOrders=0;
  let activeDrivers=drivers.filter(d=>!d.fired && d.status!=="Non recruté");
  fakeUsers.filter(u=>u.id<999).slice(0,85).forEach((u,idx)=>{
    let nb=idx<25?2:1;
    if(!Array.isArray(u.historique)) u.historique=[];
    for(let j=0;j<nb;j++){
      let prix=amounts[(idx+j)%amounts.length];
      let item=items[(idx+j)%items.length];
      let date=`${String(1+((idx+j)%24)).padStart(2,'0')}/05/2026`;
      u.historique.push({id:Date.now()+idx*10+j,date,prix,items:item,status:"Terminée"});
      u.orders=(u.orders||0)+1;
      totalOrders++;
      totalCA+=Math.round((prix*0.6+2.99+4.99)*100)/100;
      let d=activeDrivers[(idx+j)%Math.max(activeDrivers.length,1)];
      if(d){
        d.totalOrders=(d.totalOrders||0)+1;
        d.earnings=(Number(d.earnings)||0)+Math.round(prix*0.2*100)/100;
        d.tips=(Number(d.tips)||0)+((idx+j)%4===0?2:0);
        let stars=4+((idx+j)%2);
        if(!Array.isArray(d.comments)) d.comments=[];
        d.comments.push({date,email:u.email,rating:stars,text:comments[(idx+j)%comments.length]});
        d.votes=(d.votes||0)+1;
        let oldRating=Number(d.rating)||5;
        d.rating=Math.round(((oldRating*(d.votes-1))+stars)/d.votes*10)/10;
      }
    }
    if(idx%18===0 && !u.isVip){ u.isVip=true; u.vipSource='purchased'; totalCA+=59.99; }
  });
  reglages.caTotal=Math.max(2500,Math.round(totalCA*100)/100);
  reglages.totalOrders=Math.max(85,totalOrders);
  reglages._seededBusinessHistory=true;
}
function getDebugTargetUser(){
  if(window.currentUser && window.currentUser.role!=='admin') return window.currentUser;
  return fakeUsers.find(u=>u.email==='client@gmail.com') || fakeUsers.find(u=>u.id===999) || fakeUsers[0];
}
function syncSessionFromTargetUser(u){
  if(!u) return;
  if(window.currentUser && window.currentUser.role!=='admin' && window.currentUser.email===u.email){
    reglages.isPremium=!!u.isVip;
    reglages.historiqueCommandes=Array.isArray(u.historique)?u.historique:[];
    reglages.savedCards=Array.isArray(u.savedCards)?u.savedCards:[];
    reglages.cagnotte=Number(u.cagnotte)||0;
    reglages.cagnotteSpent=Number(u.cagnotteSpent)||0;
    reglages.avatarUrl=u.avatarUrl||reglages.avatarUrl;
  }
}
function ensureDriverDataConsistency(){
  if(!Array.isArray(reglages.driverApplications)) reglages.driverApplications=[];
  drivers.forEach((d,i)=>{
    if(!d.photo) d.photo=driverInitialAvatar((d.name||'L').charAt(0));
    if(!d.email) d.email=`driver${d.id||i}@lago.fr`;
    if(!d.password) d.password='123';
    if(!d.status) d.status=i<12?'En attente':'Non recruté';
    if(!d.fakeForm) d.fakeForm=buildFakeDriverForm(d);
  });
}

try {
  try{ localStorage.removeItem(LEGACY_STORAGE_KEY); }catch(_e){}
  let save=sessionStorage.getItem(APP_STORAGE_KEY);
  if(save){
    reglages=JSON.parse(save);
    if(!reglages.savedCards) reglages.savedCards=[];
    if(reglages.users&&reglages.users.length>0) fakeUsers=reglages.users;
    else { initFakeData(); reglages.users=fakeUsers; }
    if(Array.isArray(reglages.drivers)&&reglages.drivers.length>0) drivers=reglages.drivers;
    else if(drivers.length===0) initDefaultDrivers();
  } else { initFakeData(); reglages.users=fakeUsers; reglages.drivers=drivers; }
} catch(e) { initFakeData(); reglages.users=fakeUsers; reglages.drivers=drivers; }
if(drivers.length===0) initDefaultDrivers();
reglages.drivers=drivers;
if(!Array.isArray(reglages.driverApplications)) reglages.driverApplications=[];
if(typeof reglages.driverRecruitmentClosed!=='boolean') reglages.driverRecruitmentClosed=false;
ensureDriverDataConsistency();
seedBusinessHistoryIfNeeded();

function normalizeUsersCards() {
  if(Array.isArray(reglages.savedCards)) reglages.savedCards.forEach(c=>{ if(!c.design) c.design='classic'; c.design=normalizeCardDesignId(c.design); });
  if(!Array.isArray(fakeUsers)) return;
  fakeUsers.forEach(u=>{
    if(!Array.isArray(u.savedCards)) u.savedCards=[];
    u.savedCards.forEach(c=>{ if(!c.design) c.design='classic'; c.design=normalizeCardDesignId(c.design); });
    if(!u.selectedCardDesign) u.selectedCardDesign='classic';
  });
}
normalizeUsersCards();
function normalizePromoConfig(){
  if(!reglages.promoConfig){
    reglages.promoConfig={code:reglages.promoCodeStr||"FREROT",percent:20,target:"all",active:true,usageLimit:999,usageCount:0};
  }
  reglages.promoConfig.code=(reglages.promoConfig.code||reglages.promoCodeStr||"FREROT").toUpperCase();
  reglages.promoConfig.percent=Math.max(1,Math.min(100,Number(reglages.promoConfig.percent)||20));
  reglages.promoConfig.target=reglages.promoConfig.target||"all";
  reglages.promoConfig.active=reglages.promoConfig.active!==false;
  reglages.promoConfig.usageLimit=Math.max(1,Math.min(999,Number(reglages.promoConfig.usageLimit)||999));
  reglages.promoConfig.usageCount=Math.max(0,Number(reglages.promoConfig.usageCount)||0);
  reglages.promoCodeStr=reglages.promoConfig.code;
  reglages.promoValue=reglages.promoConfig.percent;
  if(typeof reglages.easterPromoUnlocked!=="boolean") reglages.easterPromoUnlocked=false;
  if(typeof reglages.easterPromoUsed!=="boolean") reglages.easterPromoUsed=false;
}
normalizePromoConfig();
function normalizeAllData(){
  normalizeUsersCards();
  normalizePromoConfig();
  ensureDriverDataConsistency();
  seedBusinessHistoryIfNeeded();
  if(!Array.isArray(reglages.historiqueCommandes)) reglages.historiqueCommandes=[];
  if(!Array.isArray(reglages.adminActionLog)) reglages.adminActionLog=[];
  if(!Array.isArray(reglages.driverApplications)) reglages.driverApplications=[];
  reglages.theme=reglages.theme||'dark';
  reglages.avatarUrl=reglages.avatarUrl||avatarsStandard[0];
  return true;
}
normalizeAllData();

function saveAll() {
  if(window.currentUser&&window.currentUser.role!=="admin") {
    let u=fakeUsers.find(x=>x.email===window.currentUser.email);
    if(u){u.isVip=reglages.isPremium;u.theme=reglages.theme;u.cagnotte=reglages.cagnotte;u.historique=reglages.historiqueCommandes;u.avatarUrl=reglages.avatarUrl;u.referrals=reglages.referrals;u.referralClaimed=reglages.referralClaimed;u.cagnotteSpent=reglages.cagnotteSpent;u.savedCards=Array.isArray(reglages.savedCards)?reglages.savedCards:[];u.selectedCardDesign=currentCardDesign||'classic';}
  }
  reglages.selectedCardDesign=currentCardDesign||'classic';
  reglages.users=fakeUsers;
  reglages.drivers=drivers;
  sessionStorage.setItem(APP_STORAGE_KEY,JSON.stringify(reglages));
}

// =============================================
// ===== FIX #1 : DÉCONNEXION =================
// logOut() est appelé en onclick direct sur les deux boutons
// Elle remet tout à zéro et affiche l'écran de connexion

function cleanupDeliveryTimers(){
  if(deliveryStageTimer){ clearTimeout(deliveryStageTimer); deliveryStageTimer=null; }
  if(deliveryFinishTimer){ clearTimeout(deliveryFinishTimer); deliveryFinishTimer=null; }
  if(window.etaInt){ clearInterval(window.etaInt); window.etaInt=null; }
}
function resetUiState(){
  cleanupDeliveryTimers();
  deliveryInProgress=false; deliveryMiniVisible=false;
  hideDeliveryMiniBubble();
  ['paymentOverlay','processingOverlay','paySuccessOverlay','gpsModal','debugModal','cardDesignModal','lagoPlusModal','orderSummaryModal','driverRecruitmentModal','driverCandidateModal'].forEach(id=>{
    let el=document.getElementById(id);
    if(el){ el.classList.remove('show','active'); if(id==='gpsModal') el.style.display='none'; }
  });
  pendingPaymentCallback=null; selectedSavedCardIndex=-1; showingNewCardForm=true;
}
// =============================================
window.logOut = function(force=false) {
  if(logoutInProgress) return;
  logoutInProgress=true;
  try {
    stopBot();
    if(!force) saveAll();
    resetUiState();
    if(mapInitialized && mapAdmin) { try{ mapAdmin.remove(); }catch(_e){} mapAdmin=null; mapInitialized=false; }
    if(mapClient) { try{ mapClient.remove(); }catch(_e){} mapClient=null; }

    window.currentUser=null;
    window.currentDriver=null;
    currentDeliveryDriver=null;
    pendingPaymentCallback=null;
    selectedSavedCardIndex=-1;
    showingNewCardForm=true;
    currentCardDesign='classic';
    cart=[]; selectedMattress=null; promoActive=false; currentTip=0; currentClientRating=0; currentCagnotteDeduction=0;

    document.body.className='';
    ['paymentOverlay','processingOverlay','paySuccessOverlay','gpsModal','debugModal'].forEach(id=>{
      let el=document.getElementById(id);
      if(el){ el.classList.remove('show','active'); if(id==='gpsModal') el.style.display='none'; }
    });

    let client=document.getElementById('clientApp'); if(client) client.style.display='none';
    let admin=document.getElementById('adminApp'); if(admin) admin.style.display='none';
    let driverApp=document.getElementById('driverApp'); if(driverApp) driverApp.style.display='none';

    let email=document.getElementById('loginEmail'); if(email) email.value='';
    let pass=document.getElementById('loginPassword'); if(pass) pass.value='';

    let nav=document.getElementById('clientNav'); if(nav) nav.style.display='flex';
    if(client){
      client.querySelectorAll('section').forEach(s=>s.classList.remove('active'));
      let home=document.getElementById('home'); if(home) home.classList.add('active');
      client.querySelectorAll('.navBtn').forEach((b,i)=>b.classList.toggle('active',i===0));
    }
    if(admin){
      admin.querySelectorAll('section').forEach(s=>s.classList.remove('active'));
      let st=document.getElementById('admSettings'); if(st) st.classList.add('active');
      admin.querySelectorAll('.navBtn').forEach((b,i)=>b.classList.toggle('active',i===0));
    }
    currentClientTab='home';
    updateClientNavIndicator();

    let auth=document.getElementById('authScreen');
    if(auth){
      auth.style.opacity='0';
      auth.style.display='flex';
      setTimeout(()=>{ auth.style.opacity='1'; logoutInProgress=false; },60);
    } else logoutInProgress=false;
  } catch(err) {
    console.error('Erreur logout', err);
    logoutInProgress=false;
    location.reload();
  }
};

window.forceAdminLogout=function(e){
  if(e){ e.preventDefault(); e.stopPropagation(); }
  window.logOut(true);
  return false;
};



function addAdminActionLog(label, amount=0){
  if(!Array.isArray(reglages.adminActionLog)) reglages.adminActionLog=[];
  let now=new Date();
  let hh=String(now.getHours()).padStart(2,'0');
  let mm=String(now.getMinutes()).padStart(2,'0');
  reglages.adminActionLog.unshift({time:`${hh}:${mm}`,label,amount:Number(amount)||0});
  reglages.adminActionLog=reglages.adminActionLog.slice(0,12);
  renderDebugActionLog();
}
function renderDebugActionLog(){
  let box=document.getElementById('debugActionLog');
  if(!box) return;
  let log=Array.isArray(reglages.adminActionLog)?reglages.adminActionLog:[];
  if(log.length===0){ box.innerHTML='<div class="debug-log-empty">Aucune action patron pour le moment.</div>'; return; }
  box.innerHTML=log.map(a=>{
    let cls=a.amount<0?'loss':(a.amount>0?'gain':'neutral');
    let sign=a.amount>0?`↗ +${a.amount.toFixed(2)} €`:(a.amount<0?`↘ ${a.amount.toFixed(2)} €`:'•');
    return `<div class="debug-log-row ${cls}"><span>${a.time} — ${a.label}</span><strong>${sign}</strong></div>`;
  }).join('');
}

// =============================================
// DEBUG DISCRET PATRON
// =============================================
window.openDebugPanel=function(e){
  if(e){ e.preventDefault(); e.stopPropagation(); }
  debugRefreshStatus();
  document.getElementById('debugModal').classList.add('active');
};
window.closeDebugPanel=function(){ document.getElementById('debugModal').classList.remove('active'); };
window.debugRefreshStatus=function(){
  let el=document.getElementById('debugStatus'); if(!el) return;
  let user=window.currentUser?window.currentUser.email:(window.currentDriver?window.currentDriver.email:'aucun');
  let cards=Array.isArray(reglages.savedCards)?reglages.savedCards.length:0;
  let promo=reglages.promoConfig?`${reglages.promoConfig.code} • ${reglages.promoConfig.usageLimit>=999?'∞':Math.max(0,reglages.promoConfig.usageLimit-reglages.promoConfig.usageCount)} restantes`:'aucune';
  let candidates=(drivers||[]).filter(d=>d.status==='Non recruté').length;
  el.innerHTML=`<b>Version :</b> ${APP_VERSION}<br><b>Utilisateur :</b> ${user}<br><b>Lago+ :</b> ${reglages.isPremium?'oui':'non'}<br><b>Thème :</b> ${reglages.theme}<br><b>Panier :</b> ${cart.length} élément(s)<br><b>Paiement :</b> ${pendingPaymentCallback?'en attente':'repos'}<br><b>Livraison :</b> ${deliveryInProgress?'en cours':'aucune'}<br><b>Promo :</b> ${promo}<br><b>Cartes session :</b> ${cards}<br><b>Recrutements :</b> ${candidates} candidat(s)<br><b>Livreurs :</b> ${drivers.filter(d=>!d.fired&&d.status!=="Non recruté").length} actifs`;
  renderDebugActionLog();
};
window.interneClearCart=function(){
  if(!confirm('Vider le panier ?')) return;
  cart=[]; selectedMattress=null; promoActive=false; currentTip=0; currentCagnotteDeduction=0;
  document.querySelectorAll('.mattress,.option,.tip-btn').forEach(el=>el.classList.remove('selected'));
  updateCart(); debugRefreshStatus();
};
window.debugAddTestCard=function(){
  let u=getDebugTargetUser();
  if(!u) return alert('Aucun client disponible.');
  if(!Array.isArray(u.savedCards)) u.savedCards=[];
  let design=CARD_DESIGNS[Math.floor(Math.random()*CARD_DESIGNS.length)].id;
  u.savedCards.push({type:'Visa',last4:String(Math.floor(1000+Math.random()*9000)),holder:'CLIENT LAGO',expiry:'12/29',design});
  syncSessionFromTargetUser(u);
  normalizeAllData(); renderSavedCards(); saveAll(); debugRefreshStatus();
  alert(`Carte ajoutée sur ${u.email}`);
};
window.debugAddTestOrder=function(){
  let u=getDebugTargetUser();
  if(!u) return alert('Aucun client disponible.');
  if(!Array.isArray(u.historique)) u.historique=[];
  let price=39.99;
  u.historique.push({id:Date.now(),date:new Date().toLocaleDateString('fr-FR'),prix:price,items:'Commande',status:'Terminée'});
  u.orders=(u.orders||0)+1;
  reglages.caTotal=Math.round(((Number(reglages.caTotal)||0)+(price*0.6)+2.99+4.99)*100)/100;
  reglages.totalOrders=(Number(reglages.totalOrders)||0)+1;
  let d=getAvailableDriver(!!u.isVip);
  if(d){
    d.totalOrders=(d.totalOrders||0)+1;
    d.earnings=(Number(d.earnings)||0)+Math.round(price*0.2*100)/100;
    d.votes=(d.votes||0)+1;
    d.rating=Math.round((((Number(d.rating)||5)*(d.votes-1))+5)/d.votes*10)/10;
    if(!Array.isArray(d.comments)) d.comments=[];
    d.comments.push({date:new Date().toLocaleDateString('fr-FR'),email:u.email,rating:5,text:'Commande validée.'});
  }
  syncSessionFromTargetUser(u);
  mettreAJourHistorique(); renderClientStats(); updateAdminStats(); renderAdminUsers(); renderAdminDrivers(); saveAll(); debugRefreshStatus();
  alert(`Commande ajoutée sur ${u.email}`);
};
window.debugToggleVip=function(){
  let u=getDebugTargetUser();
  if(!u) return alert('Aucun client disponible.');
  u.isVip=!u.isVip; u.vipSource=u.isVip?'interne':null;
  if(u.isVip) reglages.caTotal=Math.round(((Number(reglages.caTotal)||0)+59.99)*100)/100;
  syncSessionFromTargetUser(u);
  appliquerAvatarEtPremium(); appliquerThemeEtPremium(); mettreAJourVitrine(); updateCart(); updateAdminStats(); renderAdminUsers(); saveAll(); debugRefreshStatus();
  alert(`Lago+ ${u.isVip?'activé':'désactivé'} pour ${u.email}`);
};
window.debugResetSession=function(){ if(!confirm('Remettre la session à zéro ?')) return; 
  try{ sessionStorage.removeItem(APP_STORAGE_KEY); localStorage.removeItem(LEGACY_STORAGE_KEY); }catch(_e){}
  location.reload();
};

// =============================================
// AUTH
// =============================================
window.openGooglePopup = function() { document.getElementById('googlePopupOverlay').classList.add('show'); };
window.closeGooglePopup = function(e,force=false) { if(force||e.target.id==='googlePopupOverlay') document.getElementById('googlePopupOverlay').classList.remove('show'); };
window.loginSuccess = function(email) { closeGooglePopup(null,true); setTimeout(()=>doLogin(email),300); };

window.openDriverUberPopup = function() { document.getElementById('driverUberPopupOverlay').classList.add('show'); };
window.closeDriverUberPopup = function(e,force=false) { if(force||e.target.id==='driverUberPopupOverlay') document.getElementById('driverUberPopupOverlay').classList.remove('show'); };
window.driverUberLoginSuccess = function() {
  closeDriverUberPopup(null,true);
  setTimeout(()=>{
    const email='livreur.uber@lago.app';
    let d=findDriverByEmail(email);
    if(!d){
      const newId=Math.max(0,...drivers.map(x=>x.id||0))+1;
      d={id:newId,name:'Livreur Uber',email,password:'uber',bio:'Compte livreur vierge connecté avec Uber.',rating:5.0,votes:1,isPro:false,fired:false,photo:driverInitialAvatar('L'),hireDate:new Date().toLocaleDateString('fr-FR'),totalOrders:0,status:'En attente',tips:0,earnings:0,comments:[],lat:TOURS_LAT,lng:TOURS_LNG};
      drivers.push(d);
      let app=findDriverApplication(email);
      if(!app){
        getDriverApplications().push({id:Date.now(),email,password:'uber',firstName:'Livreur',lastName:'Uber',city:'Tours',vehicle:'Compte Uber',availability:'Flexible',status:'accepted',driverId:newId,photo:d.photo,createdAt:new Date().toLocaleDateString('fr-FR')});
      }
      saveAll();
    }
    doDriverLogin(d);
  },300);
};

window.handleLoginManual = function() {
  let email=document.getElementById('loginEmail').value.trim().toLowerCase();
  let pwd=document.getElementById('loginPassword').value;
  if(!email) return alert("Entrez un email !");
  if(email==="boss@lago.app") { doLogin(email); return; }
  if(!pwd) return alert("Entrez un mot de passe !");
  if(pwd.length<3) return alert("Mot de passe trop court : mets au moins 3 caractères.");
  let existing=fakeUsers.find(u=>u.email===email);
  if(existing&&existing.password!==pwd) return alert("Mot de passe incorrect.");
  document.getElementById('captchaModal').style.display='flex';
  document.getElementById('fakeCaptchaCheck').checked=false;
  document.getElementById('fakeCaptchaCheck').onchange=function(){
    if(this.checked){
      setTimeout(()=>{
        document.getElementById('captchaModal').style.display='none';
        if(!existing){
          fakeUsers.unshift({id:fakeUsers.length+1000,email,password:pwd,isVip:false,vipSource:null,orders:0,signupDate:new Date().toLocaleDateString('fr-FR'),banni:false,historique:[],theme:"dark",avatarUrl:avatarsStandard[0],cagnotte:0,cagnotteSpent:0,moisCoussinGratuit:null,referrals:[],referralClaimed:false,savedCards:[],selectedCardDesign:'classic'});
          reglages.users=fakeUsers; sessionStorage.setItem(APP_STORAGE_KEY,JSON.stringify(reglages));
        }
        doLogin(email);
      },600);
    }
  };
};

function doLogin(email) {
  let auth=document.getElementById('authScreen');
  auth.style.opacity='0';
  setTimeout(()=>{
    auth.style.display='none';
    auth.style.opacity='1';
    if(email==="boss@lago.app"){
      window.currentUser={email:"boss@lago.app",role:"admin"};
      document.getElementById('adminApp').style.display='block';
      reglages.theme=reglages.adminTheme||"dark";
      reglages.savedCards=[];
      currentCardDesign='classic';
      document.getElementById('adminThemeSelect').value=reglages.theme;
      appliquerThemeGlobal(reglages.theme);
      mettreAJourVitrineAdmin(); renderAdminDrivers(); updateAdminStats(); renderAdminUsers(); startBot();
    } else {
      let u=fakeUsers.find(x=>x.email===email);
      window.currentUser=u;
      reglages.isPremium=u.isVip; reglages.theme=u.theme||"dark"; reglages.cagnotte=u.cagnotte||0;
      reglages.cagnotteSpent=u.cagnotteSpent||0; reglages.historiqueCommandes=u.historique||[];
      reglages.referrals=u.referrals||[]; reglages.referralClaimed=u.referralClaimed||false;
      reglages.avatarUrl=u.avatarUrl||avatarsStandard[0];
      reglages.savedCards=Array.isArray(u.savedCards)?u.savedCards:[];
      reglages.savedCards.forEach(c=>{ if(!c.design) c.design='classic'; });
      currentCardDesign=u.selectedCardDesign||'classic';
      reglages.selectedCardDesign=currentCardDesign;
      document.getElementById('clientApp').style.display='block';
      document.getElementById('clientEmailDisplay').innerText=email;
      cartDistance=(Math.random()*(6.5-0.5)+0.5).toFixed(1);
      mettreAJourVitrine(); appliquerAvatarEtPremium(); appliquerThemeEtPremium();
      mettreAJourHistorique(); renderReferrals(); updateCart(); updateClientNavIndicator(); updatePaymentCardPreview(); startBot();
    }
  },300);
}


// =============================================
// AUTH LIVREUR / CANDIDATURES
// =============================================
function getDriverApplications(){
  if(!Array.isArray(reglages.driverApplications)) reglages.driverApplications=[];
  return reglages.driverApplications;
}
function normalizeDriverEmail(email){ return (email||'').trim().toLowerCase(); }
function findDriverApplication(email){ return getDriverApplications().find(a=>normalizeDriverEmail(a.email)===normalizeDriverEmail(email)); }
function findDriverByEmail(email){ return drivers.find(d=>normalizeDriverEmail(d.email)===normalizeDriverEmail(email)); }

window.showDriverAuth=function(){
  let box=document.getElementById('authFlipBox');
  if(box) box.classList.add('driver-mode');
  showDriverChoice();
};
window.resetDriverAuth=function(){
  let box=document.getElementById('authFlipBox');
  if(box) box.classList.remove('driver-mode');
  showDriverChoice();
};
window.showDriverChoice=function(){
  ['driverChoicePanel','driverLoginPanel','driverRegisterPanel'].forEach(id=>{let el=document.getElementById(id); if(el) el.classList.remove('active');});
  document.getElementById('driverChoicePanel').classList.add('active');
};
window.showDriverLogin=function(){
  ['driverChoicePanel','driverLoginPanel','driverRegisterPanel'].forEach(id=>document.getElementById(id).classList.remove('active'));
  document.getElementById('driverLoginPanel').classList.add('active');
};
window.showDriverRegister=function(){
  if(reglages.driverRecruitmentClosed) return alert('Nous ne recrutons pas pour le moment.');
  ['driverChoicePanel','driverLoginPanel','driverRegisterPanel'].forEach(id=>document.getElementById(id).classList.remove('active'));
  document.getElementById('driverRegisterPanel').classList.add('active');
};
window.submitDriverLogin=function(){
  let email=normalizeDriverEmail(document.getElementById('driverLoginEmail').value);
  let pwd=document.getElementById('driverLoginPassword').value;
  if(!email||!pwd) return alert('Entre ton email et ton mot de passe.');
  let app=findDriverApplication(email);
  let driver=findDriverByEmail(email);
  if(app && app.password!==pwd) return alert('Mot de passe incorrect.');
  if(driver && driver.password!==pwd) return alert('Mot de passe incorrect.');
  if(app && app.status==='refused') return alert('Votre demande a été refusée.');
  if(app && app.status==='pending') return alert('Votre candidature est encore en attente.');
  if((app&&app.status==='accepted') || driver){
    let d=driver || drivers.find(x=>x.id===app.driverId);
    if(!d) return alert('Compte livreur introuvable.');
    doDriverLogin(d);
    return;
  }
  alert("Aucun compte livreur accepté avec cette adresse.");
};
window.startDriverSignup=function(){
  if(reglages.driverRecruitmentClosed) return alert('Nous ne recrutons pas pour le moment.');
  let email=normalizeDriverEmail(document.getElementById('driverRegisterEmail').value);
  let pwd=document.getElementById('driverRegisterPassword').value;
  if(!email) return alert('Entre une adresse mail.');
  if(!pwd||pwd.length<3) return alert('Mot de passe trop court : mets au moins 3 caractères.');
  if(findDriverApplication(email)||findDriverByEmail(email)) return alert('Une candidature existe déjà avec cette adresse mail.');
  window.pendingDriverSignup={email,password:pwd,initial:'L',photo:driverInitialAvatar('L')};
  document.getElementById('driverCandidatePhoto').src=window.pendingDriverSignup.photo;
  document.getElementById('driverFirstName').value='';
  document.getElementById('driverFirstName').oninput=function(){ updateDriverCandidateInitialFromName(); };
  document.getElementById('driverLastName').value='';
  document.getElementById('driverAge').value='';
  document.getElementById('driverCity').value='';
  document.getElementById('driverPhone').value='';
  document.getElementById('driverExperience').value='';
  document.getElementById('driverVehicle').value='';
  document.getElementById('driverAvailability').value='';
  document.getElementById('driverArea').value='';
  document.getElementById('driverHeavy').value='';
  document.getElementById('driverMotivation').value='';
  document.getElementById('driverNotes').value='';
  renderDriverPhotoChoices();
  document.getElementById('driverRecruitStep1').classList.add('active');
  document.getElementById('driverRecruitStep2').classList.remove('active');
  document.getElementById('driverRecruitDone').classList.remove('active');
  document.getElementById('driverRecruitModal').classList.add('active');
};
window.renderDriverPhotoChoices=function(){
  let grid=document.getElementById('driverPhotoChoices');
  if(!grid) return;
  let selected=(window.pendingDriverSignup&&window.pendingDriverSignup.initial)||'L';
  grid.innerHTML=DRIVER_INITIAL_LETTERS.map(letter=>`<button type="button" class="driver-letter-choice ${selected===letter?'selected':''}" style="background:${driverInitialColor(letter)}" onclick="selectDriverCandidateLetter('${letter}')">${letter}</button>`).join('');
};
window.toggleDriverPhotoChoices=function(){
  let grid=document.getElementById('driverPhotoChoices');
  if(!grid) return;
  renderDriverPhotoChoices();
  grid.classList.toggle('show');
};
window.selectDriverCandidateLetter=function(letter){
  letter=getDriverInitialFromName(letter);
  if(window.pendingDriverSignup){ window.pendingDriverSignup.initial=letter; window.pendingDriverSignup.photo=driverInitialAvatar(letter); }
  document.getElementById('driverCandidatePhoto').src=driverInitialAvatar(letter);
  renderDriverPhotoChoices();
};
window.updateDriverCandidateInitialFromName=function(){
  if(!window.pendingDriverSignup) return;
  let letter=getDriverInitialFromName(document.getElementById('driverFirstName').value);
  if(letter && (!window.pendingDriverSignup.initial || window.pendingDriverSignup.initial==='L')) selectDriverCandidateLetter(letter);
};
window.chooseDriverCandidatePhoto=function(){ toggleDriverPhotoChoices(); };
window.nextDriverRecruitStep=function(){
  if(!document.getElementById('driverFirstName').value.trim()) return alert('Mets ton prénom.');
  if(!document.getElementById('driverCity').value.trim()) return alert('Mets ta ville.');
  if(!document.getElementById('driverAge').value.trim()) return alert('Mets ton âge.');
  document.getElementById('driverRecruitProgress').style.width='100%';
  document.getElementById('driverRecruitStep1').classList.remove('active');
  document.getElementById('driverRecruitStep2').classList.add('active');
};
window.prevDriverRecruitStep=function(){
  document.getElementById('driverRecruitProgress').style.width='50%';
  document.getElementById('driverRecruitStep2').classList.remove('active');
  document.getElementById('driverRecruitStep1').classList.add('active');
};
window.submitDriverRecruitment=function(){
  if(!window.pendingDriverSignup) return alert('Session candidature expirée.');
  let vehicle=document.getElementById('driverVehicle').value;
  let availability=document.getElementById('driverAvailability').value;
  if(!vehicle) return alert('Choisis ton véhicule.');
  if(!availability) return alert('Choisis tes disponibilités.');
  if(!document.getElementById('driverArea').value) return alert('Choisis ta zone préférée.');
  if(!document.getElementById('driverHeavy').value) return alert('Dis-nous si tu peux porter un matelas.');
  let app={
    id:Date.now(),
    email:window.pendingDriverSignup.email,
    password:window.pendingDriverSignup.password,
    photo:window.pendingDriverSignup.photo||driverInitialAvatar(window.pendingDriverSignup.initial||'L'),
    initial:window.pendingDriverSignup.initial||getDriverInitialFromName(document.getElementById('driverFirstName').value),
    firstName:document.getElementById('driverFirstName').value.trim(),
    lastName:document.getElementById('driverLastName').value.trim(),
    age:document.getElementById('driverAge').value.trim(),
    city:document.getElementById('driverCity').value.trim(),
    vehicle,
    availability,
    phone:document.getElementById('driverPhone').value.trim(),
    experience:document.getElementById('driverExperience').value,
    area:document.getElementById('driverArea').value,
    heavy:document.getElementById('driverHeavy').value,
    motivation:document.getElementById('driverMotivation').value.trim(),
    notes:document.getElementById('driverNotes').value.trim(),
    status:'pending',
    createdAt:new Date().toLocaleDateString('fr-FR')
  };
  getDriverApplications().unshift(app);
  addAdminActionLog(`Nouvelle candidature livreur : ${app.firstName||app.email}`,0);
  saveAll();
  document.getElementById('driverRecruitStep2').classList.remove('active');
  document.getElementById('driverRecruitDone').classList.add('active');
};
window.closeDriverRecruitment=function(backToClient=false){
  document.getElementById('driverRecruitModal').classList.remove('active');
  window.pendingDriverSignup=null;
  if(backToClient){ resetDriverAuth(); document.getElementById('driverRegisterEmail').value=''; document.getElementById('driverRegisterPassword').value=''; }
};
function doDriverLogin(driver){
  let auth=document.getElementById('authScreen');
  auth.style.opacity='0';
  setTimeout(()=>{
    auth.style.display='none'; auth.style.opacity='1';
    document.getElementById('clientApp').style.display='none';
    document.getElementById('adminApp').style.display='none';
    document.getElementById('driverApp').style.display='block';
    window.currentUser={email:driver.email,role:'driver'};
    window.currentDriver=driver;
    appliquerThemeGlobal(reglages.theme||'dark');
    renderDriverApp();
  },250);
}
function renderDriverApp(){
  let d=window.currentDriver;
  if(!d) return;
  document.getElementById('driverAppName').innerText=d.name||'Livreur';
  document.getElementById('driverAppAvatar').src=d.photo||DEFAULT_DRIVER_PHOTO;
  document.getElementById('driverProfileAvatar').src=d.photo||DEFAULT_DRIVER_PHOTO;
  document.getElementById('driverProfileName').innerText=d.name||'Livreur Lago';
  document.getElementById('driverProfileEmail').innerText=d.email||'';
  document.getElementById('driverProfileInfo').innerHTML=`<b>Statut :</b> ${d.status||'En attente'}<br><b>Courses :</b> ${d.totalOrders||0}<br><b>Gains :</b> ${(d.earnings||0).toFixed(2)} €<br><b>Pourboires :</b> ${d.tips||0} €`;
}
window.switchDriverAppTab=function(tabId,btn){
  document.querySelectorAll('#driverApp section').forEach(s=>s.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  document.querySelectorAll('#driverNav .navBtn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
};

// =============================================
// NAVIGATION CLIENT
// =============================================
window.switchClientTab = function(tabId,btn) {
  currentClientTab=tabId;
  document.getElementById('clientApp').querySelectorAll('section').forEach(s=>s.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  document.getElementById('clientNav').querySelectorAll('.navBtn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  document.getElementById('clientApp').scrollTo(0,0);
  let vb=document.querySelector('.fake-viewers');
  if(vb) vb.style.display=(tabId==='home')?'block':'none';
  if(tabId==='orders') updateCart();
  if(tabId==='profile'){ renderSavedCards(); renderClientStats(); }
  updateClientNavIndicator();
};

// =============================================
// AVATARS
// =============================================
function initAvatarsUI() {
  document.getElementById('standardAvatarsGrid').innerHTML=avatarsStandard.map(url=>`<img src="${url}" class="avatar-img-btn" onclick="selectAvatar('${url}')">`).join('');
  document.getElementById('premiumAvatarsGrid').innerHTML=avatarsPremium.map(url=>`<div style="position:relative;"><img src="${url}" class="avatar-img-btn premium-avatar-btn" onclick="selectAvatar('${url}',true)"><div class="avatar-lock">🔒</div></div>`).join('');
}
window.selectAvatar=function(url,isPrem=false){
  if(isPrem&&!reglages.isPremium) return alert("Cet avatar est réservé aux membres Lago+ !");
  reglages.avatarUrl=url; appliquerAvatarEtPremium();
  document.getElementById('avatarModal').classList.remove('active'); saveAll();
};
function appliquerAvatarEtPremium(){
  if(!reglages.isPremium&&avatarsPremium.includes(reglages.avatarUrl)) reglages.avatarUrl=avatarsStandard[0];
  document.getElementById('userAvatarImg').src=reglages.avatarUrl;
  document.querySelectorAll('.avatar-lock').forEach(el=>el.style.display=reglages.isPremium?'none':'flex');
  if(reglages.isPremium){
    document.getElementById('premiumBlockFalse').style.display='none';
    document.getElementById('premiumBlockTrue').style.display='block';
    document.getElementById('cagnotteDisplay').innerText=reglages.cagnotte.toFixed(2);
    ['optNeon','optBlack','optGlass'].forEach(id=>document.getElementById(id).disabled=false);
  } else {
    document.getElementById('premiumBlockFalse').style.display='block';
    document.getElementById('premiumBlockTrue').style.display='none';
    ['optNeon','optBlack','optGlass'].forEach(id=>document.getElementById(id).disabled=true);
  }
}

// =============================================
// CGU
// =============================================
let currentTosPage=1;
window.openTos=()=>{ document.getElementById('tosModal').style.display='flex'; currentTosPage=1; renderTosPage(); };
window.closeTos=()=>{ document.getElementById('tosModal').style.display='none'; };
window.nextTos=()=>{ if(currentTosPage<60){ currentTosPage++; renderTosPage(); } };
window.prevTos=()=>{ if(currentTosPage>1){ currentTosPage--; renderTosPage(); } };
function renderTosPage(){
  document.getElementById('tosPageNum').innerText=currentTosPage;
  let article=1000+currentTosPage;
  let text=`<h2 style="color:var(--accent-blue);">Chapitre ${currentTosPage} - Dispositions légales</h2><p>Conformément à l'article ${article} du Code de la Consommation fictif de Lago, l'utilisateur accepte les présentes conditions sans réserve.</p>`;
  for(let i=0;i<6;i++){
    let code=`LAGO-${String(currentTosPage).padStart(2,'0')}-${i+1}`;
    text+=`<p style="margin-bottom:10px;"><b>Alinéa ${currentTosPage}.${i+1} :</b> Le prestataire Lago applique la clause ${code} pour garantir une livraison de lit claire, drôle et stable. Les conditions restent identiques à chaque ouverture de cette page.</p>`;
  }
  if(currentTosPage===60 && !reglages.easterPromoUnlocked && !reglages.easterPromoUsed){
    text+=`<div class="easter-bed-secret" onclick="claimEasterPromo()" title="Petit bonus Lago"><div class="easter-bed-icon"><span></span></div><small>Un détail s'est glissé ici.</small></div>`;
  }
  document.getElementById('tosText').innerHTML=text;
  document.getElementById('tosText').scrollTop=0;
}
window.claimEasterPromo=function(){
  if(reglages.easterPromoUsed) return;
  reglages.easterPromoUnlocked=true;
  saveAll();
  renderTosPage();
  updateCart();
  alert("Bonus Lago trouvé : -10% sur votre prochaine commande.");
};

// =============================================
// CARTES SAUVEGARDÉES (PROFIL)
// =============================================
function renderSavedCards(){
  let container=document.getElementById('savedCardsList');
  if(!reglages.savedCards||reglages.savedCards.length===0){
    container.innerHTML='<p style="color:var(--text-dim);font-size:12px;">Aucune carte enregistrée.</p>'; renderClientStats(); return;
  }
  container.innerHTML=reglages.savedCards.map((c,i)=>`
    <div class="saved-card-item">
      <div style="display:flex;align-items:center;gap:15px;">
        ${savedCardMiniHtml(c).replace('<div class="saved-card-mini',`<div onclick="openSavedCardDesignPicker(${i},event)" title="Changer le design" class="saved-card-mini`)}
        <div>
          <div style="color:white;font-weight:bold;">${c.type} •••• ${c.last4}</div>
          <div style="color:var(--text-dim);font-size:10px;">Expire le ${c.expiry} — ${c.holder}${c.design?` • ${getCardDesignName(c.design)}`:''}</div>
        </div>
      </div>
      <button onclick="deleteSavedCard(${i})" style="background:var(--accent-red);color:white;border:none;padding:5px 10px;border-radius:5px;font-size:10px;cursor:pointer;width:auto;margin:0;">Supprimer</button>
    </div>`).join('');
}
window.deleteSavedCard=(i)=>{ if(!confirm('Supprimer cette carte ?')) return; reglages.savedCards.splice(i,1); renderSavedCards(); renderClientStats(); saveAll(); };


function renderClientStats(){
  let box=document.getElementById('clientStatsBox');
  if(box) box.innerHTML='';
}

// =============================================
// PARRAINAGE
// =============================================
window.renderReferrals=function(){
  let list=document.getElementById('referralList'); list.innerHTML="";
  if(!reglages.referrals) reglages.referrals=[];
  reglages.referrals.forEach(r=>{
    list.innerHTML+=`<div style="background:rgba(255,255,255,0.05);padding:8px 12px;border-radius:10px;display:flex;justify-content:space-between;align-items:center;"><span style="font-size:12px;color:white;">${r}</span><span style="background:var(--accent-green);color:white;padding:2px 6px;border-radius:5px;font-weight:bold;font-size:10px;">+ 5€</span></div>`;
  });
  if(reglages.referrals.length>=3){
    document.getElementById('referralInputZone').style.display='none';
    if(reglages.referralClaimed) list.innerHTML+=`<div style="text-align:center;color:var(--accent-green);font-weight:bold;font-size:12px;margin-top:5px;">✅ Cagnotte de 15€ créditée !</div>`;
    else list.innerHTML+=`<div style="text-align:center;color:var(--accent-gold);font-weight:bold;font-size:12px;margin-top:5px;">⏳ 15€ en attente. Devenez VIP pour débloquer !</div>`;
  } else document.getElementById('referralInputZone').style.display='flex';
};

window.addReferral=function(){
  let email=document.getElementById('referralEmail').value.trim();
  if(!email||!email.includes('@')) return alert("Adresse email invalide.");
  if(email.toLowerCase()===window.currentUser.email.toLowerCase()) return alert("Tu ne peux pas te parrainer toi-même !");
  if(reglages.referrals.includes(email)) return alert("Cet ami a déjà été parrainé !");
  if(reglages.referrals.length>=3) return alert("Limite de 3 parrainages atteinte.");
  reglages.referrals.push(email); document.getElementById('referralEmail').value=''; renderReferrals();
  if(reglages.referrals.length<3) alert("🎉 Ami parrainé ! (+5€ en attente)");
  else {
    if(reglages.isPremium&&!reglages.referralClaimed){ reglages.cagnotte+=15; reglages.referralClaimed=true; appliquerAvatarEtPremium(); renderReferrals(); alert("🎉 15€ ajoutés à votre cagnotte VIP !"); }
    else if(!reglages.isPremium) document.getElementById('referralNotVipModal').classList.add('active');
  }
  saveAll();
};
window.openReferralAd=function(){ document.getElementById('referralNotVipModal').classList.remove('active'); document.getElementById('referralAdModal').classList.add('active'); };

// =============================================
// CARTE ADMIN
// =============================================
function initAdminMap(){
  if(mapInitialized) return;
  mapAdmin=L.map('adminMap').setView([TOURS_LAT,TOURS_LNG],13);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{attribution:'Lago Maps'}).addTo(mapAdmin);
  mapInitialized=true; drawMapMarkers();
}
function drawMapMarkers(){
  if(!mapInitialized||!mapAdmin) return;
  mapAdmin.eachLayer(layer=>{ if(layer instanceof L.Marker) layer.remove(); });
  drivers.filter(d=>!d.fired&&d.status!=="Non recruté").forEach(d=>{
    let cl=d.isPro?'pin-pro':'pin-standard';
    let icon=L.divIcon({className:'custom-pin',html:`<div class="pin-wrapper ${cl}"><img src="${d.photo}" class="driver-photo-pin" style="width:34px;height:34px;"></div>`,iconSize:[34,42],iconAnchor:[17,42]});
    d.leafletMarker=L.marker([d.lat,d.lng],{icon}).addTo(mapAdmin);
  });
}
window.switchAdminTab=function(tabId,btn){
  document.getElementById('adminApp').querySelectorAll('section').forEach(s=>s.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  document.getElementById('adminNav').querySelectorAll('.navBtn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  document.getElementById('adminApp').scrollTo(0,0);
  if(tabId==='admDrivers'){ if(!mapInitialized) initAdminMap(); setTimeout(()=>mapAdmin&&mapAdmin.invalidateSize(),200); }
};
function animateMarker(marker,sLat,sLng,eLat,eLng,dur){
  let start=performance.now();
  function step(t){ let p=Math.min((t-start)/dur,1); marker.setLatLng([sLat+(eLat-sLat)*p,sLng+(eLng-sLng)*p]); if(p<1) requestAnimationFrame(step); }
  requestAnimationFrame(step);
}
window.getAvailableDriver=function(isVipClient){
  let available=drivers.filter(d=>!d.fired&&d.status!=="Non recruté"&&d.status!=="En livraison 🛵");
  if(available.length===0) return null;
  if(isVipClient){ let pros=available.filter(d=>d.isPro); if(pros.length>0) return pros[Math.floor(Math.random()*pros.length)]; }
  return available[Math.floor(Math.random()*available.length)];
};

// =============================================
// BOT
// =============================================
function startBot(){
  if(botInterval) clearInterval(botInterval);
  botInterval=setInterval(()=>{
    let activeUsers=fakeUsers.filter(u=>!u.banni&&u.id<999);
    if(activeUsers.length===0) return;
    let usr=activeUsers[Math.floor(Math.random()*activeUsers.length)];
    drivers.filter(d=>!d.fired&&d.status!=="Non recruté").forEach(d=>{ if(d.status==="En livraison 🛵") d.status="En attente"; });
    let items=["Le Duo","Le Solo","Lit Parapluie","Le Gonflable"]; let prices=[reglages.prixDuo,reglages.prixSolo,reglages.prixBebe,reglages.prixGonflable];
    let idx=Math.floor(Math.random()*items.length); let price=Number(prices[idx]);
    let isNewVip=!usr.isVip&&Math.random()>0.88;
    if(isNewVip){ usr.isVip=true; usr.vipSource='purchased'; }
    let cutPatron=(price*0.6)+(isNewVip?59.99:0); let totalDisplayPrice=price+(isNewVip?59.99:0);
    reglages.caTotal+=cutPatron; reglages.totalOrders++; usr.orders++;
    let d2=new Date();
    usr.historique.push({id:Date.now()+Math.random(),date:d2.toLocaleDateString('fr-FR')+" à "+d2.getHours()+"h"+(d2.getMinutes()<10?'0':'')+d2.getMinutes(),prix:totalDisplayPrice,items:items[idx],status:"Terminée"});
    updateAdminStats();
    let botTip=Math.random()>0.5?[1,2,5][Math.floor(Math.random()*3)]:0;
    let assignedD=getAvailableDriver(usr.isVip);
    if(assignedD){
      assignedD.status="En livraison 🛵"; assignedD.totalOrders++; assignedD.earnings+=price*0.2;
      if(botTip>0) assignedD.tips+=botTip;
      if(mapInitialized&&assignedD.leafletMarker){
        let nLat=TOURS_LAT-0.02+Math.random()*0.04,nLng=TOURS_LNG-0.03+Math.random()*0.06;
        animateMarker(assignedD.leafletMarker,assignedD.lat,assignedD.lng,nLat,nLng,7500);
        assignedD.lat=nLat; assignedD.lng=nLng;
      }
      if(Math.random()>0.1){
        let coms=["Rapide et efficace !","Livreur super sympa.","Parfait, je recommande.","Lit au top.","Impeccable."];
        let stars=Math.floor(Math.random()*(5-3+1))+3;
        assignedD.comments.push({date:new Date().toLocaleDateString('fr-FR'),email:usr.email,rating:stars,text:coms[Math.floor(Math.random()*coms.length)]});
        let tp=(assignedD.rating*assignedD.votes)+stars; assignedD.votes++; assignedD.rating=Math.round((tp/assignedD.votes)*10)/10;
      }
      if(window.currentOpenDriverId===assignedD.id) openDriverModal(assignedD.id);
    }
    drivers.filter(d=>!d.fired&&d.status!=="Non recruté").forEach(d=>{
      if(d.status!=="En livraison 🛵"){ let r=Math.random(); if(r<0.7) d.status="En attente"; else if(r<0.9) d.status="En pause ☕"; else d.status="Retard ⚠️"; }
    });
    renderAdminDrivers();
    renderAdminUsers();
    if(window.currentOpenUserId===usr.id){ openUserModal(usr.id); }
    let notif=document.createElement('div'); notif.className='admin-toast';
    notif.innerHTML=`🔔 <b>${usr.email.split('@')[0]}</b> a commandé <b>${items[idx]}</b> (+${totalDisplayPrice.toFixed(2)}€)<br><span style="font-size:11px;">🛵 Livré par: <b>${assignedD?assignedD.name:'Inconnu'}</b></span>${botTip>0?`<br><span style="color:var(--accent-green);font-size:11px;">💰 Pourboire +${botTip}€</span>`:''}${isNewVip?`<br><span style="color:var(--accent-gold);font-size:11px;">👑 Abonnement VIP inclus !</span>`:''}`;
    let toastBox=document.getElementById('adminToastContainer');
    if(toastBox && document.getElementById('adminApp').style.display==='block'){
      toastBox.appendChild(notif);
      setTimeout(()=>{ notif.style.opacity='0'; setTimeout(()=>notif.remove(),400); },5000);
    }
    if(window.currentUser && window.currentUser.role!=='admin' && window.currentUser.email===usr.email){
      reglages.historiqueCommandes=usr.historique||[]; reglages.isPremium=!!usr.isVip; mettreAJourHistorique(); appliquerAvatarEtPremium(); mettreAJourVitrine(); updateCart();
    }
    saveAll();
  },8000);
}
function stopBot(){ clearInterval(botInterval); botInterval=null; }

// =============================================
// MODALS ADMIN
// =============================================
window.openDriverModal=function(id){
  window.currentOpenDriverId=id; window.currentOpenUserId=null;
  let d=drivers.find(x=>x.id===id);
  let commentsHTML=d.comments.length>0?d.comments.map(c=>{
    let fu=fakeUsers.find(u=>u.email===c.email); let ava=fu?fu.avatarUrl:avatarsStandard[0];
    return `<div style="text-align:left;background:rgba(0,0,0,0.2);border-radius:10px;padding:10px;margin-bottom:8px;"><div style="font-size:11px;color:var(--text-dim);margin-bottom:4px;display:flex;justify-content:space-between;"><span><img src="${ava}" style="width:15px;height:15px;border-radius:50%;vertical-align:middle;margin-right:5px;">${c.email}</span><span>${c.date}</span></div><div style="color:var(--accent-gold);font-size:12px;">${'✱'.repeat(c.rating)}</div><div style="font-size:13px;font-style:italic;">"${c.text}"</div></div>`;
  }).join(''):"<p style='color:var(--text-dim);font-size:12px;'>Aucun avis.</p>";
  document.getElementById('adminModalContent').innerHTML=`<img src="${d.photo}" class="modal-avatar-large"><h3 style="margin:0;">${d.name}${d.isPro?' 👑':''}</h3><div style="color:var(--accent-gold);font-weight:bold;margin-bottom:15px;">★ ${d.rating} (${d.votes} avis)</div><div style="text-align:left;font-size:14px;color:var(--text-dim);background:var(--glass-bg);padding:15px;border-radius:15px;margin-bottom:15px;"><p style="margin-top:0;"><b>Embauche :</b> ${d.hireDate}</p><p><b>Courses :</b> ${d.totalOrders}</p><p><b>Gains (20%) :</b> ${d.earnings.toFixed(2)} €</p><p><b>Pourboires :</b> <span style="color:var(--accent-green);">${d.tips} €</span></p><p style="margin-bottom:0;"><b>Statut :</b> ${d.status==='En livraison 🛵'?'<span style="color:var(--accent-blue);font-weight:bold;">'+d.status+'</span>':d.status}</p></div><h4 style="color:white;margin-top:0;">Historique des Avis</h4><div style="max-height:150px;overflow-y:auto;">${commentsHTML}</div>`;
  document.getElementById('adminModal').classList.add('active');
};
window.toggleUserVip=function(id){
  let u=fakeUsers.find(x=>x.id===id);
  if(u.isVip&&u.vipSource==='purchased') return alert("VIP ACHETÉ : Impossible de retirer (CGU).");
  u.isVip=!u.isVip; u.vipSource=u.isVip?'gifted':null;
  if(window.currentUser&&window.currentUser.id===u.id) reglages.isPremium=u.isVip;
  openUserModal(id); renderAdminUsers();
};
window.openUserModal=function(id){
  window.currentOpenDriverId=null; window.currentOpenUserId=id;
  let u=fakeUsers.find(x=>x.id===id);
  let histHTML=u.historique.length>0?u.historique.map(h=>`<div style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;justify-content:space-between;"><div><div style="font-weight:bold;font-size:12px;color:white;">${h.date}</div><div style="color:var(--text-dim);font-size:11px;">${h.items}</div></div><div style="color:var(--accent-green);font-weight:bold;">${parseFloat(h.prix).toFixed(2)}€</div></div>`).reverse().join(''):"<p style='color:var(--text-dim);font-size:12px;'>Aucune commande.</p>";
  let btnHtml=u.isVip?(u.vipSource==='purchased'?`<button disabled style="padding:4px 8px;background:gray;color:#fff;border-radius:5px;border:none;font-size:10px;">ACHETÉ</button>`:`<button onclick="toggleUserVip(${u.id})" style="padding:4px 8px;background:var(--accent-red);color:#fff;border-radius:5px;border:none;font-size:10px;cursor:pointer;">RETIRER VIP</button>`):`<button onclick="toggleUserVip(${u.id})" style="padding:4px 8px;background:var(--accent-gold);color:#000;border-radius:5px;border:none;font-size:10px;cursor:pointer;">OFFRIR VIP</button>`;
  document.getElementById('adminModalContent').innerHTML=`<img src="${u.avatarUrl}" class="modal-avatar-large"><h3 style="margin:0;font-size:18px;word-break:break-all;">${u.email}</h3><div style="color:${u.isVip?'var(--accent-gold)':'var(--text-dim)'};font-weight:bold;margin-bottom:15px;display:flex;align-items:center;justify-content:center;gap:10px;">${u.isVip?'👑 Membre VIP':'Client Standard'} ${btnHtml}</div><div style="text-align:left;font-size:14px;color:var(--text-dim);background:var(--glass-bg);padding:15px;border-radius:15px;margin-bottom:15px;"><p style="margin-top:0;"><b>Inscription :</b> ${u.signupDate}</p><p><b>Commandes :</b> ${u.orders}</p><p style="margin-bottom:0;"><b>État :</b> ${u.banni?'<span style="color:var(--accent-red);font-weight:bold;">BANNI</span>':'<span style="color:var(--accent-green);font-weight:bold;">Actif</span>'}</p></div><h4 style="color:white;margin-top:0;text-align:left;">Historique</h4><div style="max-height:150px;overflow-y:auto;text-align:left;">${histHTML}</div>`;
  document.getElementById('adminModal').classList.add('active');
};
window.closeAdminModal=function(){ window.currentOpenDriverId=null; window.currentOpenUserId=null; document.getElementById('adminModal').classList.remove('active'); };
window.banUser=function(id){ if(confirm("Bannir ce client ?")){ fakeUsers.find(u=>u.id===id).banni=true; renderAdminUsers(); } };

// =============================================
// THÈME
// =============================================
function initLiquidGlassFollower(){
  if(document.querySelector('.liquid-cursor')) return;
  const bubble=document.createElement('div');
  bubble.className='liquid-cursor';
  document.body.appendChild(bubble);
  const move=(x,y)=>{
    document.documentElement.style.setProperty('--glass-x', x+'px');
    document.documentElement.style.setProperty('--glass-y', y+'px');
  };
  window.addEventListener('pointermove', e=>move(e.clientX,e.clientY), {passive:true});
  window.addEventListener('touchmove', e=>{
    if(e.touches&&e.touches[0]) move(e.touches[0].clientX,e.touches[0].clientY);
  }, {passive:true});
}

function appliquerThemeGlobal(themeName){
  document.body.className='';
  if(reglages.weatherSurge) document.body.classList.add('rain-mode');
  if(themeName==='light') document.body.classList.add('theme-day');
  else if(themeName==='neon') document.body.classList.add('theme-neon');
  else if(themeName==='black') document.body.classList.add('theme-black');
  else if(themeName==='glass') document.body.classList.add('theme-glass');
  updateClientNavIndicator();
}
document.getElementById('adminThemeSelect').addEventListener('change',e=>{ reglages.theme=e.target.value; reglages.adminTheme=e.target.value; appliquerThemeGlobal(reglages.theme); saveAll(); });
function appliquerThemeEtPremium(){ appliquerThemeGlobal(reglages.theme); document.getElementById('userThemeSelect').value=reglages.theme; updatePaymentCardPreview(); }
document.getElementById('userThemeSelect').addEventListener('change',e=>{ reglages.theme=e.target.value; appliquerThemeEtPremium(); saveAll(); });

// =============================================
// VIP
// =============================================
document.getElementById('buyPremiumBtn').onclick=()=>{
  document.getElementById('vipConfirmModal').classList.add('active');
  document.getElementById('vipStep1').style.display='block';
  document.getElementById('vipStep2').style.display='none';
};
window.vipGoStep2=function(){ document.getElementById('vipStep1').style.display='none'; document.getElementById('vipStep2').style.display='block'; };
window.closeVipModal=function(){ document.getElementById('vipConfirmModal').classList.remove('active'); };
window.confirmVipPurchase=function(){
  closeVipModal(); document.getElementById('referralAdModal').classList.remove('active');
  openPaymentModal(59.99,()=>{
    reglages.isPremium=true;
    let bonus=15;
    if(reglages.referrals&&reglages.referrals.length===3&&!reglages.referralClaimed){ bonus+=15; reglages.referralClaimed=true; }
    reglages.cagnotte+=bonus; reglages.cagnotteSpent=0; reglages.caTotal+=59.99;
    if(window.currentUser) window.currentUser.vipSource='purchased';
    addAdminActionLog("Achat Lago+",59.99);
    appliquerAvatarEtPremium(); appliquerThemeEtPremium(); mettreAJourVitrine(); updateCart(); updateAdminStats(); renderReferrals(); saveAll();
    alert(`Bienvenue dans le club VIP Lago+ 👑 ! ${bonus}€ ajoutés à ta cagnotte !`);
  });
};
window.refundVip=function(){
  let spent=reglages.cagnotteSpent||0; let cushion=0;
  if(reglages.moisCoussinGratuit===new Date().getMonth()) cushion=5;
  let refund=Math.max(0,59.99-spent-cushion);
  let msg=`Voulez-vous annuler votre abonnement VIP ?\n\nPrix payé : 59.99€\nCagnotte utilisée : ${spent.toFixed(2)}€${cushion>0?'\nCoussin gratuit : 5.00€':''}\n\nMontant remboursé : ${refund.toFixed(2)}€`;
  if(confirm(msg)){
    reglages.isPremium=false; reglages.cagnotte=0; reglages.cagnotteSpent=0; reglages.moisCoussinGratuit=null;
    reglages.caTotal=Math.max(0,reglages.caTotal-refund);
    if(window.currentUser) window.currentUser.vipSource=null;
    if(["neon","black","glass"].includes(reglages.theme)) reglages.theme="dark";
    addAdminActionLog("Remboursement Lago+",-refund);
    updateAdminStats(); appliquerAvatarEtPremium(); appliquerThemeEtPremium(); updateCart(); mettreAJourVitrine();
    alert(`Abonnement annulé. Remboursement : ${refund.toFixed(2)}€.`); saveAll();
  }
};

// =============================================
// COMMANDES PROGRAMMÉES
// =============================================
window.cancelOrder=function(orderId){
  let order=reglages.historiqueCommandes.find(o=>o.id===orderId);
  if(!order||order.status!=="En cours") return;
  let now=new Date(); let[h,m]=order.scheduledTime.split(':');
  let target=new Date(); target.setHours(parseInt(h),parseInt(m),0,0);
  if(target<now) target.setDate(target.getDate()+1);
  if(target-now<3600000) return alert("❌ Annulation impossible à moins d'une heure de la livraison.");
  if(confirm(`Voulez-vous annuler votre livraison à ${order.scheduledTime} ? Remboursement : ${order.prix.toFixed(2)}€.`)){
    order.status="Annulée";
    if(order.cagnotteUsed>0){ reglages.cagnotte+=order.cagnotteUsed; reglages.cagnotteSpent=Math.max(0,reglages.cagnotteSpent-order.cagnotteUsed); }
    reglages.caTotal-=order.prix; reglages.totalOrders--; updateAdminStats();
    mettreAJourHistorique(); updateCart(); saveAll(); alert("✅ Commande annulée et remboursée.");
  }
};

// =============================================
// VITRINE
// =============================================
function mettreAJourHistorique(){
  let div=document.getElementById('historiqueDetails');
  if(reglages.historiqueCommandes.length===0){ div.innerHTML="<p style='color:var(--text-dim)'>Aucune commande pour le moment.</p>"; return; }
  div.innerHTML="";
  [...reglages.historiqueCommandes].reverse().forEach(h=>{
    let badge="",extraClass="",onclickAttr="";
    if(h.status==="En cours"){ badge=`<div class="status-badge status-encours">⏳ EN COURS (${h.scheduledTime}) - Cliquer pour annuler</div>`; extraClass="programmable"; onclickAttr=`onclick="cancelOrder(${h.id})"`; }
    else if(h.status==="Annulée") badge=`<div class="status-badge status-annule">❌ ANNULÉE</div>`;
    else badge=`<div class="status-badge status-termine">✓ TERMINÉE</div>`;
    div.innerHTML+=`<div class="history-card ${extraClass}" ${onclickAttr}><div style="flex:1;"><div style="font-weight:bold;font-size:13px;color:white;">${h.date}</div><div style="color:var(--text-dim);font-size:11px;margin-top:2px;">${h.items}</div>${badge}</div><div style="color:var(--accent-green);font-weight:bold;font-size:14px;text-align:right;">${h.status==="Annulée"?`<strike style="color:var(--text-dim)">${h.prix.toFixed(2)}€</strike>`:`${h.prix.toFixed(2)}€`}</div></div>`;
  });
}

function mettreAJourVitrine(){
  document.getElementById('welcomeTextDisplay').innerText=reglages.welcomeText;
  document.getElementById('adminWelcomeText').value=reglages.welcomeText;
  document.getElementById('adminTaxeNuit').checked=reglages.taxeNuit;
  document.getElementById('adminPromoCodeStr').value=reglages.promoCodeStr||"FREROT";
  document.getElementById('adminPromoValue').value=reglages.promoValue||5;
  syncPromoAdminUI();
  function updateMatelas(baseName,prix,rupture){
    let div=document.getElementById('matelas'+baseName); if(!div) return;
    div.dataset.price=prix;
    document.getElementById('prix'+baseName+'Text').innerText=prix+" €";
    document.getElementById('adminPrix'+baseName).value=prix;
    document.getElementById('adminRupture'+baseName).checked=rupture;
    if(rupture){ div.classList.add('out-of-stock'); div.querySelector('.rupture-badge').style.display="block"; }
    else{ div.classList.remove('out-of-stock'); div.querySelector('.rupture-badge').style.display="none"; }
  }
  updateMatelas('Solo',reglages.prixSolo,reglages.ruptureSolo);
  updateMatelas('Duo',reglages.prixDuo,reglages.ruptureDuo);
  updateMatelas('Gonflable',reglages.prixGonflable,reglages.ruptureGonflable);
  updateMatelas('Bebe',reglages.prixBebe,reglages.ruptureBebe);
  let containerOpts=document.querySelector('.options:not(.tip-options)');
  containerOpts.innerHTML="";
  let adminOptList=document.getElementById('adminOptionsList'); adminOptList.innerHTML="";
  let currentMonth=new Date().getMonth();
  for(let key in reglages.options){
    let opt=reglages.options[key];
    if(opt.active){
      let estGratuit=(reglages.isPremium&&opt.name==="☁️ Coussin"&&reglages.moisCoussinGratuit!==currentMonth);
      let prixAff=estGratuit?"0€ 🎁":`+${opt.price}€`;
      let div=document.createElement('div'); div.className="option";
      div.dataset.name=opt.name; div.dataset.price=estGratuit?0:opt.price; div.dataset.desc=opt.desc;
      div.innerHTML=`${opt.name} <span style="${estGratuit?'color:var(--accent-gold);':''}">${prixAff}</span>`;
      containerOpts.appendChild(div);
    }
    adminOptList.innerHTML+=`<div class="admin-opt-row"><input type="checkbox" id="admAct_${key}" ${opt.active?'checked':''}><input type="text" id="admName_${key}" value="${opt.name}"><input type="number" id="admPrice_${key}" value="${opt.price}"> €</div>`;
  }
  attacherEvenementsClics(); updateCart();
}

function attacherEvenementsClics(){
  document.querySelectorAll('.mattress').forEach(m=>{
    m.onclick=()=>{
      if(m.classList.contains('out-of-stock')) return;
      if(m.classList.contains('selected')){
        m.classList.remove('selected');
        selectedMattress=null;
        updateCart();
        return;
      }
      document.querySelectorAll('.mattress').forEach(x=>x.classList.remove('selected'));
      m.classList.add('selected'); selectedMattress=m;
      updateCart();
    };
  });
  document.querySelectorAll('.options:not(.tip-options) .option').forEach(o=>{
    let timerAppui; let isLongPress=false;
    o.oncontextmenu=e=>e.preventDefault();
    o.addEventListener('touchstart',()=>{ isLongPress=false; timerAppui=setTimeout(()=>{ isLongPress=true; document.getElementById('bubbleTitle').innerText=o.dataset.name; document.getElementById('bubbleDesc').innerText=o.dataset.desc; prepareBubbleFavorite(o.dataset.name,o.dataset.desc,Number(o.dataset.price||0)); document.getElementById('infoBubble').style.display="block"; },500); },{passive:true});
    o.addEventListener('touchmove',()=>clearTimeout(timerAppui),{passive:true});
    o.addEventListener('touchend',e=>{ clearTimeout(timerAppui); if(isLongPress) e.preventDefault(); });
    o.addEventListener('click',()=>{ if(!isLongPress) o.classList.toggle('selected'); });
  });
}

let customTipPreviousTip=0;
let customTipPreviousSelected=null;
function restoreTipSelection(){
  document.querySelectorAll('.tip-btn').forEach(b=>b.classList.remove('selected'));
  if(customTipPreviousSelected){
    let oldBtn=document.querySelector(`.tip-btn[data-val="${customTipPreviousSelected}"]`);
    if(oldBtn) oldBtn.classList.add('selected');
  }
  currentTip=customTipPreviousTip;
  updateCart();
}
window.openCustomTipModal=function(){
  customTipPreviousTip=currentTip;
  let selected=document.querySelector('.tip-btn.selected');
  customTipPreviousSelected=selected?selected.dataset.val:null;
  document.getElementById('customTipInput').value="";
  document.getElementById('customTipModal').classList.add('active');
};
window.closeCustomTipModal=function(){
  restoreTipSelection();
  document.getElementById('customTipModal').classList.remove('active');
};
window.validerCustomTip=function(){
  let val=parseFloat(document.getElementById('customTipInput').value);
  if(!isNaN(val)&&val>=0.10){
    currentTip=Math.round(val*100)/100;
    document.querySelectorAll('.tip-btn').forEach(b=>b.classList.remove('selected'));
    let customBtn=document.querySelector('.tip-btn[data-val="custom"]');
    if(customBtn) customBtn.classList.add('selected');
    updateCart();
    document.getElementById('customTipModal').classList.remove('active');
  }
  else { alert("Montant minimum: 0.10€"); restoreTipSelection(); document.getElementById('customTipModal').classList.remove('active'); }
};
document.querySelectorAll('.tip-btn').forEach(btn=>{
  btn.onclick=()=>{
    if(btn.dataset.val==="custom") { openCustomTipModal(); return; }
    currentTip=Number(btn.dataset.val); updateCart();
    document.querySelectorAll('.tip-btn').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
  };
});
document.getElementById('closeBubble').onclick=()=>{ document.getElementById('infoBubble').style.display="none"; let b=document.getElementById('bubbleFavoriteBtn'); if(b) b.style.display='none'; };
window.toggleWeather=function(){
  reglages.weatherSurge=document.getElementById('adminWeatherToggle').checked;
  if(reglages.weatherSurge) document.body.classList.add('rain-mode');
  else document.body.classList.remove('rain-mode');
  addAdminActionLog(`Surtaxe météo ${reglages.weatherSurge?'activée':'désactivée'}`,0);
  updateCart(); saveAll();
};

document.getElementById('saveAdminBtn').onclick=()=>{
  reglages.welcomeText=document.getElementById('adminWelcomeText').value;
  reglages.taxeNuit=document.getElementById('adminTaxeNuit').checked;
  reglages.prixSolo=Math.max(0,Number(document.getElementById('adminPrixSolo').value)||0);
  reglages.ruptureSolo=document.getElementById('adminRuptureSolo').checked;
  reglages.prixDuo=Math.max(0,Number(document.getElementById('adminPrixDuo').value)||0);
  reglages.ruptureDuo=document.getElementById('adminRuptureDuo').checked;
  reglages.prixGonflable=Math.max(0,Number(document.getElementById('adminPrixGonflable').value)||0);
  reglages.ruptureGonflable=document.getElementById('adminRuptureGonflable').checked;
  reglages.prixBebe=Math.max(0,Number(document.getElementById('adminPrixBebe').value)||0);
  reglages.ruptureBebe=document.getElementById('adminRuptureBebe').checked;
  if(!reglages.promoConfig) normalizePromoConfig();
  reglages.promoCodeStr=reglages.promoConfig.code;
  reglages.promoValue=reglages.promoConfig.percent;
  for(let key in reglages.options){
    reglages.options[key].active=document.getElementById('admAct_'+key).checked;
    reglages.options[key].name=document.getElementById('admName_'+key).value;
    reglages.options[key].price=Math.max(0,Number(document.getElementById('admPrice_'+key).value)||0);
  }
  addAdminActionLog("Réglages vitrine sauvegardés",0);
  mettreAJourVitrine(); saveAll(); alert("Réglages sauvegardés ! 💾");
};

function mettreAJourVitrineAdmin(){
  document.getElementById('adminTaxeNuit').checked=reglages.taxeNuit;
  document.getElementById('adminWeatherToggle').checked=reglages.weatherSurge;
  if(reglages.weatherSurge) document.body.classList.add('rain-mode');
  else document.body.classList.remove('rain-mode');
}

// =============================================
// PANIER
// =============================================
document.getElementById('addToCart').onclick=()=>{
  if(!selectedMattress) return alert("Choisis un matelas d'abord !");
  let item={name:selectedMattress.dataset.name,basePrice:Number(selectedMattress.dataset.price),price:Number(selectedMattress.dataset.price),options:[],qty:1};
  document.querySelectorAll('.options:not(.tip-options) .option.selected').forEach(o=>{
    item.options.push({name:o.dataset.name,price:Number(o.dataset.price)});
    item.price+=Number(o.dataset.price);
  });
  let optStr=JSON.stringify(item.options);
  let existing=cart.find(c=>c.name===item.name&&JSON.stringify(c.options)===optStr);
  if(existing) existing.qty++;
  else cart.push(item);
  updateCart(); alert("C'est dans le panier ! 🛒");
  document.querySelectorAll('.mattress,.options:not(.tip-options) .option').forEach(el=>el.classList.remove('selected'));
  selectedMattress=null;
};

document.getElementById('applyPromo').onclick=()=>{
  normalizePromoConfig();
  let entered=document.getElementById('promoInput').value.trim().toUpperCase();
  if(!reglages.promoConfig.active) return alert("Aucun code promo actif pour le moment.");
  if(reglages.promoConfig.usageLimit<999 && (reglages.promoConfig.usageCount||0)>=reglages.promoConfig.usageLimit) return alert("Ce code promo a déjà atteint sa limite d'utilisation.");
  if(entered===reglages.promoConfig.code){
    promoActive=true; updateCart();
    let msg=document.getElementById('promoMessage');
    let disc=computePromoDiscount();
    if(disc>0){ msg.innerText=`Code appliqué : -${disc.toFixed(2)} €`; msg.style.display="block"; }
    else { promoActive=false; msg.style.display="none"; alert("Ce code ne s'applique pas à ce matelas."); }
  } else alert("Code invalide !");
};
document.getElementById('useCagnotteCheck').addEventListener('change',updateCart);
window.removeFromCart=function(index){ cart.splice(index,1); updateCart(); };
window.toggleScheduleInput=function(){
  let mode=document.getElementById('deliveryModeSelect').value;
  let input=document.getElementById('scheduledTimeInput');
  if(mode==='later'){ input.style.display='block'; document.getElementById('tipSection').style.display='none'; }
  else{ input.style.display='none'; document.getElementById('tipSection').style.display='block'; }
};

function getMattressDemandCount(name){
  let count=0;
  (fakeUsers||[]).forEach(u=>{
    (u.historique||[]).forEach(h=>{ if((h.items||'').includes(name)) count++; });
  });
  (reglages.historiqueCommandes||[]).forEach(h=>{ if((h.items||'').includes(name)) count++; });
  cart.forEach(c=>{ if(c.name===name) count+=c.qty; });
  return count;
}
function updateMattressDemandPills(){
  document.querySelectorAll('.demand-pill').forEach(el=>{
    let name=el.dataset.mattress;
    let count=getMattressDemandCount(name);
    if(count>=18) el.innerText='Très commandé aujourd’hui';
    else if(count>=10) el.innerText='Populaire ce soir';
    else if(count>=5) el.innerText='Demandé en ce moment';
    else el.innerText='Disponible maintenant';
  });
}
function updateCart(){
  updateMattressDemandPills();
  document.getElementById('cartCount').textContent=cart.reduce((acc,c)=>acc+c.qty,0);
  let list=document.getElementById('cartList'); let sousTotalLitsOptions=0;
  list.innerHTML=""; currentCagnotteDeduction=0;
  if(cart.length===0){
    promoActive=false;
    let pm=document.getElementById('promoMessage');
    if(reglages.easterPromoUnlocked && !reglages.easterPromoUsed){ pm.innerText="Bonus Lago trouvé : -10% sur votre prochaine commande."; pm.style.display="block"; }
    else { pm.style.display="none"; document.getElementById('promoInput').value=""; }
    list.innerHTML="<p style='color:var(--text-dim)'>Panier vide.</p>";
    document.getElementById('factureDetails').style.display="none";
    document.getElementById('scheduleSection').style.display="none";
    document.getElementById('tipSection').style.display="none";
    document.getElementById('totalPrice').textContent="0.00"; return;
  }
  document.getElementById('scheduleSection').style.display="block";
  if(document.getElementById('deliveryModeSelect').value==='now') document.getElementById('tipSection').style.display="block";
  cart.forEach((c,index)=>{
    let lp=c.price*c.qty; sousTotalLitsOptions+=lp;
    let opts=c.options.map(o=>`<small style="color:var(--text-dim);display:block;">+ ${o.name}</small>`).join('');
    list.innerHTML+=`<div class="cartItem" style="border-bottom:1px solid var(--glass-border);align-items:center;"><div style="display:flex;align-items:center;"><button class="remove-btn" onclick="removeFromCart(${index})">−</button><div><span style="font-weight:bold;">${c.name}${c.qty>1?` <span style="color:var(--accent-blue);">x${c.qty}</span>`:''}</span>${opts}</div></div><span style="font-weight:700;">${lp.toFixed(2)} €</span></div>`;
  });
  document.getElementById('factureDetails').style.display="block";
  document.getElementById('sousTotalDisplay').innerText=sousTotalLitsOptions.toFixed(2)+" €";
  document.getElementById('cartDistanceDisplay').innerText=cartDistance;
  let fraisLivraison=4.99;
  if(reglages.isPremium&&cartDistance<=3.0){ fraisLivraison=0; document.getElementById('fraisLivraisonDisplay').innerHTML=`<strike style="color:var(--text-dim);">4.99 €</strike> <span style="color:var(--accent-green);font-weight:bold;">OFFERT</span>`; }
  else document.getElementById('fraisLivraisonDisplay').innerText="4.99 €";
  let total=sousTotalLitsOptions+fraisLivraison+2.99;
  let dynDiv=document.getElementById('dynamicTaxesAndDiscounts'); dynDiv.innerHTML="";
  if(reglages.isPremium){ let disc=Math.round(sousTotalLitsOptions*0.15*100)/100; document.getElementById('premiumDiscountRow').style.display="flex"; document.getElementById('premiumDiscountDisplay').innerText="-"+disc.toFixed(2)+" €"; total-=disc; }
  else document.getElementById('premiumDiscountRow').style.display="none";
  if(reglages.taxeNuit){ let t=Math.round(sousTotalLitsOptions*0.20*100)/100; dynDiv.innerHTML+=`<div class="cartItem" style="color:var(--accent-blue);margin-top:10px;"><span>🌙 Surtaxe de Nuit (20%)</span><span>+ ${t.toFixed(2)} €</span></div>`; total+=t; }
  if(reglages.weatherSurge){ let s=Math.round(sousTotalLitsOptions*0.25*100)/100; dynDiv.innerHTML+=`<div class="cartItem" style="color:var(--accent-blue);margin-top:5px;"><span>🌧️ Forte demande (+25%)</span><span>+ ${s.toFixed(2)} €</span></div>`; total+=s; }
  if(promoActive){ let pv=computePromoDiscount(); if(pv>0){ total-=pv; dynDiv.innerHTML+=`<div class="cartItem discount" style="margin-top:10px;"><span>Promo ${reglages.promoConfig.code} (-${reglages.promoConfig.percent}%)</span><span>-${pv.toFixed(2)} €</span></div>`; let msg=document.getElementById('promoMessage'); if(msg){ msg.innerText=`Code appliqué : -${pv.toFixed(2)} €`; msg.style.display="block"; } } else { promoActive=false; document.getElementById('promoMessage').style.display="none"; } }
  let easterDisc=computeEasterPromoDiscount();
  if(easterDisc>0){ total-=easterDisc; dynDiv.innerHTML+=`<div class="cartItem discount easter-discount" style="margin-top:10px;"><span>Bonus Lago (-10%)</span><span>-${easterDisc.toFixed(2)} €</span></div>`; let msg=document.getElementById('promoMessage'); if(msg){ msg.innerText=`Bonus Lago appliqué : -${easterDisc.toFixed(2)} €`; msg.style.display="block"; } }
  total=Math.round(Math.max(0,total)*100)/100;
  let divCag=document.getElementById('useCagnotteDiv'); let checkCag=document.getElementById('useCagnotteCheck');
  if(reglages.isPremium&&reglages.cagnotte>0){
    divCag.style.display="block"; document.getElementById('cagnotteDispoCart').innerText=reglages.cagnotte.toFixed(2);
    if(checkCag.checked){ currentCagnotteDeduction=Math.min(total,reglages.cagnotte); total-=currentCagnotteDeduction; dynDiv.innerHTML+=`<div class="cartItem" style="color:var(--accent-gold);font-weight:bold;margin-top:10px;"><span>💰 Cagnotte</span><span>-${currentCagnotteDeduction.toFixed(2)} €</span></div>`; }
  } else{ divCag.style.display="none"; checkCag.checked=false; }
  if(currentTip>0&&document.getElementById('deliveryModeSelect').value==='now'){ dynDiv.innerHTML+=`<div class="cartItem" style="color:var(--accent-green);font-weight:bold;margin-top:10px;"><span>🙏 Pourboire Livreur</span><span>+${currentTip.toFixed(2)} €</span></div>`; total+=currentTip; }
  document.getElementById('totalPrice').textContent=total.toFixed(2);
}

// =============================================
// AVIS
// =============================================
document.querySelectorAll('#starContainer .star').forEach(s=>{
  s.onclick=()=>{
    currentClientRating=parseInt(s.dataset.val);
    document.querySelectorAll('#starContainer .star').forEach(st=>st.classList.toggle('active',parseInt(st.dataset.val)<=currentClientRating));
  };
});
document.getElementById('submitReviewBtn').onclick=function(){
  this.disabled=true;
  let text=document.getElementById('commentInput').value;
  if(currentDeliveryDriver&&currentClientRating>0){
    currentDeliveryDriver.comments.push({date:new Date().toLocaleDateString('fr-FR'),email:document.getElementById('clientEmailDisplay').innerText,rating:currentClientRating,text});
    let tp=(currentDeliveryDriver.rating*currentDeliveryDriver.votes)+currentClientRating;
    currentDeliveryDriver.votes++; currentDeliveryDriver.rating=Math.round((tp/currentDeliveryDriver.votes)*10)/10;
    renderAdminDrivers();
  }
  document.getElementById('merciAvis').style.display='block';
  this.style.display='none'; document.getElementById('commentInput').style.display='none';
  saveAll();
};
window.showBioModal=function(){
  if(!currentDeliveryDriver) return;
  document.getElementById('bioPhoto').src=currentDeliveryDriver.photo;
  document.getElementById('bioName').innerText=currentDeliveryDriver.name;
  document.getElementById('bioRating').innerText=currentDeliveryDriver.rating;
  document.getElementById('bioText').innerText=currentDeliveryDriver.bio||"Toujours prêt à livrer.";
  document.getElementById('bioCourses').innerText=currentDeliveryDriver.totalOrders;
  document.getElementById('driverBioModal').classList.add('active');
};
window.toggleChat=function(){ let cz=document.getElementById('chatZone'); cz.style.display=cz.style.display==='block'?'none':'block'; };
window.sendChatMessage=function(){
  let input=document.getElementById('chatInput'); let msg=input.value.trim(); if(!msg) return;
  let hist=document.getElementById('chatHistory'); let myAvatar=reglages.avatarUrl||avatarsStandard[0];
  hist.innerHTML+=`<div class="chat-row client"><img src="${myAvatar}" class="chat-avatar"><div class="chat-msg chat-msg-client">${msg}</div></div>`;
  input.value=''; hist.scrollTop=hist.scrollHeight;
  let dAvatar=currentDeliveryDriver?currentDeliveryDriver.photo:"https://randomuser.me/api/portraits/men/1.jpg";
  let typingId='typing'+Date.now();
  hist.innerHTML+=`<div class="chat-row driver" id="${typingId}"><img src="${dAvatar}" class="chat-avatar"><div class="chat-msg chat-msg-driver">•••</div></div>`;
  hist.scrollTop=hist.scrollHeight;
  setTimeout(()=>{
    let low=msg.toLowerCase();
    let replies=["J'arrive dans 2 min !","Je suis bloqué au feu, mais j'avance.","Je cherche une place, j'arrive.","Descendez s'il vous plaît !","Ok c'est noté !","J'ai votre lit à l'arrière.","Je tourne dans votre rue.","Je fais au plus vite, promis.","Je vous appelle si je ne trouve pas l'entrée."];
    let rep=low.includes('code')||low.includes('porte')?"Ok, je note le code/la porte.":(low.includes('retard')||low.includes('temps')?"Je vous tiens au courant, j'arrive dès que possible.":replies[Math.floor(Math.random()*replies.length)]);
    let row=document.getElementById(typingId); if(row) row.outerHTML=`<div class="chat-row driver"><img src="${dAvatar}" class="chat-avatar"><div class="chat-msg chat-msg-driver">${rep}</div></div>`;
    hist.scrollTop=hist.scrollHeight;
  },1200+Math.random()*1800);
};

// =============================================
// ===== FIX #2 : PAIEMENT ===================
// L'enregistrement de la carte se fait UNIQUEMENT
// au moment du clic sur "Payer", pas avant.
// La case à cocher est juste une préférence.
// Le popup "remplacer ?" apparaît seulement à ce moment.
// =============================================
window.openPaymentModal=function(amount,onSuccess){
  currentPaymentAmount=amount; pendingPaymentCallback=onSuccess;
  document.getElementById('payAmountDisplay').innerText=amount.toFixed(2)+' €';
  document.getElementById('cardPayAmount').innerText=amount.toFixed(2);
  // Reset visuel carte
  document.getElementById('cardNumberDisplay').innerText='•••• •••• •••• ••••';
  document.getElementById('cardHolderDisplay').innerText='VOTRE NOM';
  let expiryDisplay=document.getElementById('cardExpiryDisplay'); if(expiryDisplay) expiryDisplay.innerText='MM/AA';
  let cvvDisplay=document.getElementById('cardCvvDisplay'); if(cvvDisplay) cvvDisplay.innerText='•••';
  let l4=document.getElementById('cardLast4Display'); if(l4) l4.innerText='0000';
  let brand=document.getElementById('cardBrandDisplay'); if(brand) brand.innerText='CB';
  let backType=document.getElementById('cardBackTypeDisplay'); if(backType) backType.innerText='CB';
  setPaymentCardFace('front');
  // Reset champs
  ['cardNumber','cardHolder','cardExpiry','cardCVV','paypalEmail','paypalPassword'].forEach(id=>{
    let el=document.getElementById(id); if(el) el.value='';
  });
  document.getElementById('saveCardCheck').checked=false; // Toujours décoché à l'ouverture
  // Reset tabs
  document.querySelectorAll('.pay-tab').forEach((t,i)=>t.classList.toggle('active',i===0));
  document.querySelectorAll('.pay-panel').forEach((p,i)=>p.classList.toggle('active',i===0));
  // Cartes sauvegardées : sélectionner la première par défaut si elle existe
  selectedSavedCardIndex=reglages.savedCards&&reglages.savedCards.length>0?0:-1;
  showingNewCardForm=selectedSavedCardIndex<0;
  renderSavedCardsInPayment();
  updatePaymentCardPreview();
  let payContent=document.querySelector('#paymentSheet .pay-content'); if(payContent) payContent.scrollTop=0;
  document.getElementById('paymentOverlay').classList.add('show');
};
window.closePayment=()=>document.getElementById('paymentOverlay').classList.remove('show');
window.switchPayTab=(tab,btn)=>{
  document.querySelectorAll('.pay-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.pay-panel').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active'); document.getElementById('panel-'+tab).classList.add('active');
};

function shakeInput(id,msg){
  let el=document.getElementById(id);
  el.style.borderColor='#ff3b30'; el.style.animation='shake 0.4s ease';
  setTimeout(()=>{ el.style.borderColor=''; el.style.animation=''; },1000);
  alert(msg);
}
function showProcessing(text,sub){
  document.getElementById('processingSpinner').style.borderTopColor='#007aff';
  document.getElementById('processingText').innerText=text;
  document.getElementById('processingSub').innerText=sub;
  document.getElementById('processingOverlay').classList.add('show');
}
function hideProcessing(){ document.getElementById('processingOverlay').classList.remove('show'); }
function showPaymentSuccess(amount){
  document.getElementById('successAmount').innerText=amount.toFixed(2)+' €';
  document.getElementById('paySuccessOverlay').classList.add('show');
  setTimeout(()=>{
    document.getElementById('paySuccessOverlay').classList.remove('show');
    if(pendingPaymentCallback){ pendingPaymentCallback(); pendingPaymentCallback=null; }
  },2800);
}

// Lancement du vrai traitement de paiement (après validation)
function lancerTraitementPaiement(){
  closePayment();
  showProcessing('Vérification 3D Secure…','Connexion à votre banque');
  setTimeout(()=>{ document.getElementById('processingText').innerText='Autorisation bancaire…'; document.getElementById('processingSub').innerText='Veuillez patienter'; },1200);
  setTimeout(()=>{ document.getElementById('processingText').innerText='Paiement accepté ✓'; document.getElementById('processingSpinner').style.borderTopColor='#30d158'; },2400);
  setTimeout(()=>{ hideProcessing(); showPaymentSuccess(currentPaymentAmount); },3000);
}

window.processCardPayment=function(){
  // CAS 1 : Carte sauvegardée sélectionnée → payer directement
  if(selectedSavedCardIndex>=0&&reglages.savedCards&&reglages.savedCards[selectedSavedCardIndex]){
    currentCardDesign=reglages.savedCards[selectedSavedCardIndex].design||currentCardDesign||'classic';
    lancerTraitementPaiement();
    return;
  }
  // CAS 2 : Nouvelle carte → valider les champs
  let num=document.getElementById('cardNumber').value.replace(/\s/g,'');
  let holder=document.getElementById('cardHolder').value.trim();
  let exp=document.getElementById('cardExpiry').value;
  let cvv=document.getElementById('cardCVV').value;
  if(num.length<16) return shakeInput('cardNumber','Numéro de carte invalide (16 chiffres)');
  if(!holder) return shakeInput('cardHolder','Entrez le nom du titulaire');
  if(exp.length<5) return shakeInput('cardExpiry',"Date d'expiration invalide (MM/AA)");
  if(cvv.length<3) return shakeInput('cardCVV','Code CVV invalide (3 chiffres)');

  // ===== ENREGISTREMENT : seulement ici, au moment du clic sur Payer =====
  if(document.getElementById('saveCardCheck').checked){
    if(!reglages.savedCards) reglages.savedCards=[];
    let type=num.startsWith('4')?'Visa':(num.startsWith('5')?'Mastercard':'CB');
    let newCard={type,last4:num.slice(-4),holder:holder.toUpperCase(),expiry:exp,design:normalizeCardDesignId(currentCardDesign)};
    if(reglages.savedCards.length>0){
      // Popup de remplacement seulement ici
      let existing=reglages.savedCards[reglages.savedCards.length-1];
      let replace=confirm(`Vous avez déjà une carte enregistrée (${existing.type} •••• ${existing.last4}).\n\nVoulez-vous la remplacer par la nouvelle carte ${type} •••• ${num.slice(-4)} ?\n\n• OK = remplacer\n• Annuler = ajouter en plus`);
      if(replace) reglages.savedCards=[newCard];
      else reglages.savedCards.push(newCard);
    } else {
      reglages.savedCards.push(newCard);
    }
    saveAll();
  }

  lancerTraitementPaiement();
};

window.processPayPalPayment=()=>{
  let email=document.getElementById('paypalEmail').value;
  let pass=document.getElementById('paypalPassword').value;
  if(!email||!email.includes('@')) return shakeInput('paypalEmail','Email invalide');
  if(!pass||pass.length<6) return shakeInput('paypalPassword','Mot de passe incorrect');
  closePayment();
  showProcessing('Connexion à PayPal…','Vérification des identifiants');
  document.getElementById('processingSpinner').style.borderTopColor='#009cde';
  setTimeout(()=>document.getElementById('processingText').innerText='Compte vérifié ✓',1500);
  setTimeout(()=>document.getElementById('processingText').innerText='Autorisation du paiement…',2200);
  setTimeout(()=>{ hideProcessing(); showPaymentSuccess(currentPaymentAmount); },3200);
};

// =============================================
// RÉSUMÉ & MINI SUIVI LIVRAISON
// =============================================
function buildOrderSummary(finalPrice,resumeItems,driverName){
  return {items:resumeItems,total:finalPrice,driver:driverName||'En recherche',distance:cartDistance,tip:currentTip,promo:promoActive?computePromoDiscount():0,cagnotte:currentCagnotteDeduction,mode:document.getElementById('deliveryModeSelect').value};
}
function renderOrderSummary(){
  let box=document.getElementById('orderSummaryContent'); if(!box) return;
  let s=lastOrderSummary;
  if(!s){ box.innerHTML='<p style="color:var(--text-dim);">Aucune commande récente.</p>'; return; }
  box.innerHTML=`<div class="row"><span>Articles</span><strong>${s.items}</strong></div><div class="row"><span>Livreur</span><strong>${s.driver}</strong></div><div class="row"><span>Distance</span><strong>${s.distance} km</strong></div><div class="row"><span>Promo</span><strong>-${(s.promo||0).toFixed(2)} €</strong></div><div class="row"><span>Cagnotte</span><strong>-${(s.cagnotte||0).toFixed(2)} €</strong></div><div class="row"><span>Pourboire</span><strong>${(s.tip||0).toFixed(2)} €</strong></div><div class="row"><span>Total payé</span><strong>${s.total.toFixed(2)} €</strong></div>`;
}
window.openOrderSummaryModal=function(){ renderOrderSummary(); document.getElementById('orderSummaryModal').classList.add('active'); };
window.closeOrderSummaryModal=function(){ document.getElementById('orderSummaryModal').classList.remove('active'); };
function showDeliveryMiniBubble(driver,etaText='Recherche…'){
  let b=document.getElementById('deliveryMiniBubble'); if(!b) return;
  if(driver){ document.getElementById('miniDriverPhoto').src=driver.photo; document.getElementById('miniDriverName').innerText=driver.name; }
  document.getElementById('miniEtaText').innerText=etaText;
  if(deliveryMiniVisible) b.classList.add('show');
}
function hideDeliveryMiniBubble(){ deliveryMiniVisible=false; let b=document.getElementById('deliveryMiniBubble'); if(b) b.classList.remove('show'); }
window.expandDeliveryTracking=function(){
  if(!deliveryInProgress) return;
  document.getElementById('clientApp').querySelectorAll('section').forEach(s=>s.classList.remove('active'));
  document.getElementById('tracking').classList.add('active');
  document.getElementById('clientNav').style.display='none';
  hideDeliveryMiniBubble();
};
window.minimizeDeliveryTracking=function(){
  if(!deliveryInProgress) return;
  document.getElementById('tracking').classList.remove('active');
  document.getElementById('clientNav').style.display='flex';
  deliveryMiniVisible=true;
  switchClientTab('home',document.querySelectorAll('#clientNav .navBtn')[0]);
  showDeliveryMiniBubble(currentDeliveryDriver,'En cours…');
};

// =============================================
// BOUTON PAYER (commande)
// =============================================
document.getElementById('payBtn').onclick=()=>{
  if(deliveryInProgress) return alert("Une livraison est déjà en cours. Tu peux préparer ton panier, mais attends la fin pour repayer.");
  if(cart.length===0) return alert("Ton panier est vide !");
  for(let item of cart){
    if(item.name==="Le Solo"&&reglages.ruptureSolo) return alert("Désolé, Le Solo vient de tomber en rupture !");
    if(item.name==="Le Duo"&&reglages.ruptureDuo) return alert("Désolé, Le Duo vient de tomber en rupture !");
    if(item.name==="Matelas Gonflable"&&reglages.ruptureGonflable) return alert("Désolé, le Gonflable vient de tomber en rupture !");
    if(item.name==="Lit Parapluie"&&reglages.ruptureBebe) return alert("Désolé, le Lit Parapluie vient de tomber en rupture !");
  }
  let deliveryMode=document.getElementById('deliveryModeSelect').value;
  let scheduledTime=document.getElementById('scheduledTimeInput').value;
  if(deliveryMode==='later'&&!scheduledTime) return alert("Veuillez choisir une heure de livraison !");
  let finalPrice=Number(document.getElementById('totalPrice').textContent);

  openPaymentModal(finalPrice,()=>{
    let totalSansTip=Math.round((finalPrice-currentTip)*100)/100;
    let resumeItems=cart.map(c=>`${c.name}${c.qty>1?' (x'+c.qty+')':''}`).join(', ');
    let sousTotalLits=cart.reduce((acc,c)=>acc+(c.price*c.qty),0);
    let cutDriver=sousTotalLits*0.4;
    let cutPatron=(sousTotalLits*0.6)+(reglages.isPremium&&cartDistance<=3.0?0:4.99)+2.99;
    if(promoActive) cutPatron-=computePromoDiscount();
    cutPatron-=computeEasterPromoDiscount();
    if(reglages.isPremium) cutPatron-=Math.round(sousTotalLits*0.15*100)/100;
    if(reglages.taxeNuit) cutPatron+=Math.round(sousTotalLits*0.20*100)/100;
    if(reglages.weatherSurge) cutPatron+=Math.round(sousTotalLits*0.25*100)/100;
    if(currentCagnotteDeduction>0) cutPatron-=currentCagnotteDeduction;

    if(deliveryMode==='later'){
      if(currentCagnotteDeduction>0){ reglages.cagnotte-=currentCagnotteDeduction; reglages.cagnotteSpent=(reglages.cagnotteSpent||0)+currentCagnotteDeduction; }
      let d2=new Date(); let dateStr=d2.toLocaleDateString('fr-FR');
      reglages.historiqueCommandes.push({id:Date.now(),date:dateStr,scheduledTime,prix:finalPrice,items:resumeItems,status:"En cours",cagnotteUsed:currentCagnotteDeduction});
      reglages.caTotal+=Math.max(0,cutPatron); reglages.totalOrders++;
      registerPromoUsageIfNeeded(); registerEasterPromoUsageIfNeeded();
      updateAdminStats(); cart=[]; promoActive=false; currentTip=0;
      document.querySelectorAll('.tip-btn').forEach(b=>b.classList.remove('selected'));
      document.getElementById('promoMessage').style.display="none"; document.getElementById('promoInput').value="";
      document.getElementById('useCagnotteCheck').checked=false;
      mettreAJourVitrine(); updateCart(); mettreAJourHistorique(); saveAll();
      alert(`✅ Livraison programmée pour ${scheduledTime} !`);
      switchClientTab('profile',document.querySelectorAll('.navBtn')[2]); return;
    }

    // Livraison immédiate
    document.getElementById('clientApp').querySelectorAll('section').forEach(s=>s.classList.remove('active'));
    document.getElementById('clientNav').style.display='none';
    document.getElementById('tracking').classList.add('active');
    let bar=document.getElementById('progressBar'); let truck=document.getElementById('truckIcon');
    let title=document.getElementById('trackTitle'); let desc=document.getElementById('trackDesc');
    let backBtn=document.getElementById('backHomeBtn'); let cashDiv=document.getElementById('cashbackPopup');
    let showGps=document.getElementById('showGpsBtn'); let showChat=document.getElementById('showChatBtn');
    const realDeliveryMinutes=computeRealisticDeliveryMinutes(cartDistance); const deliveryFactor=Math.max(0.01,Number(reglages.deliverySpeedMultiplier)||1); const totalDeliveryMs=Math.max(7000,Math.round(realDeliveryMinutes*60*1000*deliveryFactor)); const stageDeliveryMs=Math.max(1200,Math.round(Math.min(120000, Math.max(60000, (60000 + (cartDistance*12000))))*deliveryFactor)); bar.style.width="5%"; truck.style.left="0%"; truck.innerText="🚚"; truck.style.opacity="1";
    title.innerText="Commande validée !"; desc.innerText=`Recherche d'un livreur disponible... Temps estimé : ${realDeliveryMinutes} min`; 
    backBtn.style.display="block"; backBtn.innerText="Réduire la commande"; cashDiv.style.display="none"; showGps.style.display="none"; showChat.style.display="none";
    let summaryBtn=document.getElementById("trackingSummaryBtn"); if(summaryBtn) summaryBtn.style.display="block";
    document.getElementById('chatZone').style.display="none"; document.getElementById('chatHistory').innerHTML="";
    document.getElementById('ratingDiv').style.display="none"; document.getElementById('merciAvis').style.display="none";
    document.querySelectorAll('#starContainer .star').forEach(st=>st.classList.remove('active'));
    document.getElementById('submitReviewBtn').style.display='block'; document.getElementById('submitReviewBtn').disabled=false;
    document.getElementById('commentInput').style.display='block'; document.getElementById('commentInput').value="";
    currentClientRating=0;
    currentDeliveryDriver=getAvailableDriver(reglages.isPremium);
    if(!currentDeliveryDriver){ alert("Aucun livreur disponible !"); return; }
    let nomAff=currentDeliveryDriver.name+(currentDeliveryDriver.isPro?' 👑':'');
    document.getElementById('livreurName').innerText=nomAff;
    document.getElementById('rateLivreurName').innerText=nomAff;
    document.getElementById('livreurNote').innerText="★ "+currentDeliveryDriver.rating;
    document.getElementById('clientLivreurPhoto').src=currentDeliveryDriver.photo;
    document.getElementById('clientLivreurPhoto').style.display="block";
    document.getElementById('driverProfile').style.display="flex";
    deliveryInProgress=true;
    lastOrderSummary=buildOrderSummary(finalPrice,resumeItems,nomAff);
    showDeliveryMiniBubble(currentDeliveryDriver,'Recherche…');
    currentDeliveryDriver.earnings+=cutDriver;
    if(currentTip>0) currentDeliveryDriver.tips+=currentTip;
    currentDeliveryDriver.totalOrders++;
    cleanupDeliveryTimers();
    deliveryStageTimer=setTimeout(()=>{
      bar.style.width="50%"; truck.style.left="45%";
      title.innerText="En route 🛵"; desc.innerText=currentDeliveryDriver.name+" slalome entre les voitures !";
      showGps.style.display="inline-block"; showChat.style.display="inline-block";
      showDeliveryMiniBubble(currentDeliveryDriver,`En route • ~${Math.max(5,Math.round(realDeliveryMinutes*0.7))} min`);
      initGPSDelivery(currentDeliveryDriver); openClientGPS();
    },stageDeliveryMs);
    deliveryFinishTimer=setTimeout(()=>{
      bar.style.width="100%"; truck.style.left="90%"; truck.style.opacity="0";
      setTimeout(()=>{ truck.innerText="✅"; truck.style.opacity="1"; },500);
      title.innerText="Il est là ! 🚨"; desc.innerText="Descends vite chercher ton lit !";
      deliveryFinishTimer=null; deliveryStageTimer=null; expandDeliveryTracking(); deliveryInProgress=false; hideDeliveryMiniBubble(); document.getElementById('clientNav').style.display='none';
      backBtn.innerText="Retour à l'accueil"; backBtn.style.display="block"; let summaryBtn2=document.getElementById("trackingSummaryBtn"); if(summaryBtn2) summaryBtn2.style.display="block"; document.getElementById('ratingDiv').style.display="block";
      showGps.style.display="none"; showChat.style.display="none";
      document.getElementById('chatZone').style.display="none"; document.getElementById('gpsModal').style.display="none";
      if(window.etaInt) clearInterval(window.etaInt);
      if(currentCagnotteDeduction>0){ reglages.cagnotte-=currentCagnotteDeduction; reglages.cagnotteSpent=(reglages.cagnotteSpent||0)+currentCagnotteDeduction; }
      if(cart.some(c=>c.options.some(o=>o.name==="☁️ Coussin"&&o.price===0))) reglages.moisCoussinGratuit=new Date().getMonth();
      if(reglages.isPremium&&totalSansTip>0){
        let gain=(Math.random()*(5-2)+2).toFixed(2); reglages.cagnotte+=parseFloat(gain);
        document.getElementById('cashbackWon').innerText=gain; cashDiv.style.display="block";
        appliquerAvatarEtPremium(); appliquerThemeEtPremium();
      }
      let d3=new Date(); let ds=d3.toLocaleDateString('fr-FR')+" à "+d3.getHours()+"h"+(d3.getMinutes()<10?'0':'')+d3.getMinutes();
      reglages.historiqueCommandes.push({id:Date.now(),date:ds,prix:finalPrice,items:resumeItems,status:"Terminée"});
      mettreAJourHistorique(); reglages.caTotal+=Math.max(0,cutPatron); reglages.totalOrders++;
      addAdminActionLog("Commande terminée",Math.max(0,cutPatron));
      registerPromoUsageIfNeeded(); registerEasterPromoUsageIfNeeded();
      updateAdminStats(); cart=[]; promoActive=false; currentTip=0;
      document.querySelectorAll('.tip-btn').forEach(b=>b.classList.remove('selected'));
      document.getElementById('promoMessage').style.display="none"; document.getElementById('promoInput').value="";
      document.getElementById('useCagnotteCheck').checked=false;
      mettreAJourVitrine(); updateCart(); saveAll();
    },totalDeliveryMs);
  });
};

document.getElementById('backHomeBtn').onclick=()=>{
  if(deliveryInProgress){ minimizeDeliveryTracking(); return; }
  document.getElementById('tracking').classList.remove('active');
  document.getElementById('home').classList.add('active');
  document.getElementById('clientNav').style.display='flex';
  document.getElementById('driverProfile').style.display="none";
  let summaryBtn=document.getElementById("trackingSummaryBtn"); if(summaryBtn) summaryBtn.style.display="none";
  document.getElementById('chatHistory').innerHTML="";
  if(window.etaInt) clearInterval(window.etaInt);
  document.getElementById('clientNav').querySelectorAll('.navBtn').forEach((b,i)=>b.classList.toggle('active',i===0));
  currentClientTab='home';
  updateClientNavIndicator();
};

// =============================================
// ADMIN DRIVERS
// =============================================
window.switchDriverTab=function(type,btn){
  document.querySelectorAll('.admin-tab-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tabActifs').style.display=type==='actifs'?'block':'none';
  document.getElementById('tabRecrutement').style.display=type==='recrutement'?'block':'none';
  let map=document.getElementById('adminMap'); if(map) map.style.display=type==='recrutement'?'none':'block';
  renderAdminDrivers();
};
function updateDriverRecruitmentUI(){
  let btn=document.getElementById('adminRecruitToggleBtn');
  let hint=document.getElementById('adminRecruitHint');
  let registerBtn=document.getElementById('driverRegisterChoiceBtn');
  let closed=!!reglages.driverRecruitmentClosed;
  if(btn){ btn.innerText=closed?'Réouvrir les recrutements':'Arrêter les recrutements'; btn.style.background=closed?'var(--accent-green)':'var(--accent-red)'; }
  if(hint){ hint.innerText=closed?'Recrutements fermés : les candidats ne peuvent plus s’inscrire.':'Candidatures reçues + profils disponibles.'; }
  if(registerBtn){ registerBtn.classList.toggle('disabled',closed); registerBtn.innerText=closed?'Inscriptions fermées':'S’inscrire'; }
}
window.toggleDriverRecruitments=function(){
  reglages.driverRecruitmentClosed=!reglages.driverRecruitmentClosed;
  addAdminActionLog(`Recrutements livreurs ${reglages.driverRecruitmentClosed?'fermés':'ouverts'}`,0);
  updateDriverRecruitmentUI(); saveAll(); renderAdminDrivers();
};
window.togglePro=function(id){ let d=drivers.find(x=>x.id===id); d.isPro=!d.isPro; addAdminActionLog(`${d.name} ${d.isPro?'passé PRO':'repassé STANDARD'}`,0); renderAdminDrivers(); saveAll(); };
window.renderAdminDrivers=function(){
  let listActifs=document.getElementById('adminDriverList');
  let searchStr=(document.getElementById('adminDriverSearch')||{value:''}).value.toLowerCase();
  let listRecruts=document.getElementById('adminRecruitList');
  let actifs=drivers.filter(d=>!d.fired&&d.status!=="Non recruté"&&d.status!=="Refusé"&&d.name.toLowerCase().includes(searchStr));
  let recruts=drivers.filter(d=>!d.fired&&d.status==="Non recruté"&&d.name.toLowerCase().includes(searchStr));
  let applications=getDriverApplications().filter(a=>a.status==='pending');
  updateDriverRecruitmentUI();
  document.getElementById('countActifs').innerText=actifs.length;
  document.getElementById('countRecruts').innerText=recruts.length+applications.length;
  listActifs.innerHTML=actifs.map(d=>`<div class="driver-card-admin" onclick="openDriverModal(${d.id})"><div style="display:flex;align-items:center;gap:10px;"><img src="${d.photo}" class="driver-avatar"><div><strong>${d.name}${d.isPro?' 👑':''}</strong> <span style="background:rgba(34,197,94,0.2);color:var(--accent-green);padding:2px 6px;border-radius:5px;font-size:10px;">💰 ${d.tips}€</span><br><small style="color:var(--text-dim);">⭐ ${d.rating} • ${d.totalOrders} courses • ${d.status==='En livraison 🛵'?'<span style="color:var(--accent-blue);font-weight:bold;">'+d.status+'</span>':d.status}</small></div></div><div style="display:flex;gap:5px;" onclick="event.stopPropagation()"><button onclick="togglePro(${d.id})" style="padding:6px;margin:0;width:auto;font-size:10px;background:${d.isPro?'var(--text-dim)':'var(--accent-blue)'};color:#fff;border-radius:8px;">${d.isPro?'STANDARD':'PRO'}</button><button onclick="fireDriver(${d.id})" style="padding:6px;margin:0;width:auto;font-size:10px;background:var(--accent-red);color:#fff;border-radius:8px;">VIRER</button></div></div>`).join('');
  let appsHTML=applications.map(a=>`<div class="driver-card-admin driver-application-card" onclick="openDriverApplicationModal(${a.id})"><div style="display:flex;align-items:center;gap:10px;"><img src="${a.photo||DEFAULT_DRIVER_PHOTO}" class="driver-avatar"><div><strong>${a.firstName||'Candidat'} ${a.lastName||''}</strong> <span class="driver-application-status">Formulaire</span><br><small style="color:var(--text-dim);">${a.city||'Ville inconnue'} • ${a.vehicle||'véhicule ?'} • ${a.email}</small></div></div><button onclick="event.stopPropagation();openDriverApplicationModal(${a.id})" style="padding:6px 12px;margin:0;width:auto;font-size:11px;background:var(--accent-blue);color:#000;border-radius:8px;font-weight:bold;">Voir</button></div>`).join('');
  let poolHTML=recruts.map(d=>`<div class="driver-card-admin driver-fake-form-card" onclick="openDriverPoolApplicationModal(${d.id})"><div style="display:flex;align-items:center;gap:10px;"><img src="${d.photo}" class="driver-avatar" style="opacity:0.9;"><div><strong>${d.name}</strong> <span class="driver-application-status">Formulaire</span><br><small style="color:var(--text-dim);">${(d.fakeForm&&d.fakeForm.city)||'Tours'} • ${(d.fakeForm&&d.fakeForm.vehicle)||'Véhicule ?'}</small></div></div><button onclick="event.stopPropagation();openDriverPoolApplicationModal(${d.id})" style="padding:6px 12px;margin:0;width:auto;font-size:11px;background:var(--accent-blue);color:#000;border-radius:8px;font-weight:bold;">Voir formulaire</button></div>`).join('');
  listRecruts.innerHTML=(appsHTML||'')+(poolHTML||'');
  drawMapMarkers();
};

window.openDriverApplicationModal=function(id){
  let a=getDriverApplications().find(x=>x.id===id);
  if(!a) return alert('Candidature introuvable.');
  document.getElementById('adminModalContent').innerHTML=`
    <img src="${a.photo||DEFAULT_DRIVER_PHOTO}" class="modal-avatar-large">
    <h3 style="margin:0;">${a.firstName||'Candidat'} ${a.lastName||''}</h3>
    <div style="color:var(--accent-blue);font-weight:bold;margin-bottom:15px;">Candidature livreur</div>
    <div class="driver-form-mini">
      <b>Email :</b> ${a.email}<br>
      <b>Âge :</b> ${a.age||'Non renseigné'}<br>
      <b>Ville :</b> ${a.city||'Non renseignée'}<br>
      <b>Téléphone/pseudo :</b> ${a.phone||'Non renseigné'}<br>
      <b>Expérience :</b> ${a.experience||'Non renseignée'}<br>
      <b>Véhicule :</b> ${a.vehicle||'Non renseigné'}<br>
      <b>Disponibilités :</b> ${a.availability||'Non renseignées'}<br>
      <b>Zone :</b> ${a.area||'Non renseignée'}<br>
      <b>Port de matelas :</b> ${a.heavy||'Non renseigné'}<br>
      <b>Date :</b> ${a.createdAt||'Aujourd’hui'}
    </div>
    <h4 style="color:white;text-align:left;">Formulaire</h4>
    <div class="driver-form-mini"><b>Motivation :</b><br>${(a.motivation||'Aucune motivation écrite.').replace(/</g,'&lt;')}<br><br><b>Infos en plus :</b><br>${(a.notes||'Aucune note.').replace(/</g,'&lt;')}</div>
    <div style="display:flex;gap:10px;margin-top:12px;">
      <button onclick="acceptDriverApplication(${a.id})" style="background:var(--accent-green);color:white;">Recruter</button>
      <button onclick="refuseDriverApplication(${a.id})" style="background:var(--accent-red);color:white;">Refuser</button>
    </div>`;
  document.getElementById('adminModal').classList.add('active');
};
window.acceptDriverApplication=function(id){
  let a=getDriverApplications().find(x=>x.id===id);
  if(!a) return;
  if(a.status==='accepted') return alert('Déjà recruté.');
  let newId=Math.max(0,...drivers.map(d=>d.id||0))+1;
  let name=((a.firstName||'Livreur')+' '+(a.lastName||'Lago')).trim();
  let d={id:newId,name,email:a.email,password:a.password,bio:a.motivation||'Nouveau livreur Lago.',rating:5.0,votes:1,isPro:false,fired:false,photo:a.photo||DEFAULT_DRIVER_PHOTO,hireDate:new Date().toLocaleDateString('fr-FR'),totalOrders:0,status:'En attente',tips:0,earnings:0,comments:[],lat:TOURS_LAT-0.02+Math.random()*0.04,lng:TOURS_LNG-0.03+Math.random()*0.06,applicationId:a.id,vehicle:a.vehicle,availability:a.availability,city:a.city,area:a.area,experience:a.experience,phone:a.phone,heavy:a.heavy};
  drivers.push(d);
  a.status='accepted'; a.driverId=newId; a.reviewedAt=new Date().toLocaleDateString('fr-FR');
  addAdminActionLog(`${name} recruté via formulaire`,0);
  closeAdminModal(); renderAdminDrivers(); saveAll();
};
window.refuseDriverApplication=function(id){
  let a=getDriverApplications().find(x=>x.id===id);
  if(!a) return;
  if(confirm('Refuser cette candidature ?')){
    a.status='refused'; a.reviewedAt=new Date().toLocaleDateString('fr-FR');
    addAdminActionLog(`Candidature refusée : ${a.email}`,0);
    closeAdminModal(); renderAdminDrivers(); saveAll();
  }
};

window.openDriverPoolApplicationModal=function(id){
  let d=drivers.find(x=>x.id===id);
  if(!d) return alert('Livreur introuvable.');
  if(!d.fakeForm) d.fakeForm=buildFakeDriverForm(d);
  let a=d.fakeForm;
  document.getElementById('adminModalContent').innerHTML=`
    <img src="${a.photo||d.photo||DEFAULT_DRIVER_PHOTO}" class="modal-avatar-large">
    <h3 style="margin:0;">${a.firstName||d.name||'Candidat'} ${a.lastName||''}</h3>
    <div style="color:var(--accent-blue);font-weight:bold;margin-bottom:15px;">Formulaire de recrutement</div>
    <div class="driver-form-mini">
      <b>Email :</b> ${a.email||d.email||'Non renseigné'}<br>
      <b>Âge :</b> ${a.age||'Non renseigné'}<br>
      <b>Ville :</b> ${a.city||'Non renseignée'}<br>
      <b>Téléphone/pseudo :</b> ${a.phone||'Non renseigné'}<br>
      <b>Expérience :</b> ${a.experience||'Non renseignée'}<br>
      <b>Véhicule :</b> ${a.vehicle||'Non renseigné'}<br>
      <b>Disponibilités :</b> ${a.availability||'Non renseignées'}<br>
      <b>Zone :</b> ${a.area||'Non renseignée'}<br>
      <b>Port de matelas :</b> ${a.heavy||'Non renseigné'}<br>
      <b>Date :</b> ${a.createdAt||'Aujourd’hui'}
    </div>
    <h4 style="color:white;text-align:left;">Réponses du formulaire</h4>
    <div class="driver-form-mini"><b>Motivation :</b><br>${String(a.motivation||d.bio||'Motivé pour rejoindre Lago.').replace(/</g,'&lt;')}<br><br><b>Infos en plus :</b><br>${String(a.notes||'Aucune note.').replace(/</g,'&lt;')}</div>
    <div style="display:flex;gap:10px;margin-top:12px;">
      <button onclick="hireDriverFromPool(${d.id})" style="background:var(--accent-green);color:white;">Recruter</button>
      <button onclick="refuseDriverFromPool(${d.id})" style="background:var(--accent-red);color:white;">Refuser</button>
    </div>`;
  document.getElementById('adminModal').classList.add('active');
};
window.hireDriverFromPool=function(id){
  let d=drivers.find(x=>x.id===id);
  if(!d) return;
  d.status='En attente';
  d.fired=false;
  d.hireDate=new Date().toLocaleDateString('fr-FR');
  d.totalOrders=0; d.tips=0; d.earnings=0; d.rating=5.0; d.votes=1; d.comments=[];
  addAdminActionLog(`${d.name} recruté depuis formulaire`,0);
  closeAdminModal(); renderAdminDrivers(); saveAll();
};
window.refuseDriverFromPool=function(id){
  let d=drivers.find(x=>x.id===id);
  if(!d) return;
  if(confirm('Refuser ce formulaire ?')){
    d.status='Refusé';
    addAdminActionLog(`Formulaire refusé : ${d.name}`,0);
    closeAdminModal(); renderAdminDrivers(); saveAll();
  }
};

window.fireDriver=function(id){ if(confirm("Licencier définitivement ce livreur ?")){ let d=drivers.find(x=>x.id===id); d.fired=true; d.status="Viré"; addAdminActionLog(`${d.name} viré`,0); renderAdminDrivers(); saveAll(); } };
window.hireDriver=function(id){ let d=drivers.find(x=>x.id===id); d.status="En attente"; d.totalOrders=0; d.tips=0; d.earnings=0; d.rating=5.0; d.votes=1; d.comments=[]; addAdminActionLog(`${d.name} recruté`,0); renderAdminDrivers(); saveAll(); };
window.renderAdminUsers=function(){
  let list=document.getElementById('adminUserList');
  let searchStr=(document.getElementById('adminUserSearch')||{value:''}).value.toLowerCase();
  document.getElementById('countUsersAdmin').innerText=fakeUsers.length;
  let filtered=fakeUsers.filter(u=>u.email.toLowerCase().includes(searchStr));
  list.innerHTML=filtered.map(u=>`<div style="font-size:12px;padding:8px 5px;border-bottom:1px solid var(--glass-border);display:flex;justify-content:space-between;align-items:center;cursor:pointer;" onclick="openUserModal(${u.id})"><div style="display:flex;align-items:center;gap:10px;"><img src="${u.avatarUrl}" style="width:30px;height:30px;border-radius:50%;object-fit:cover;border:2px solid ${u.isVip?'var(--accent-gold)':'var(--glass-border)'}"><span>${u.email}<br><small style="color:var(--text-dim);">${u.orders} commandes</small></span></div><div style="display:flex;align-items:center;gap:10px;"><span style="color:${u.isVip?'var(--accent-gold)':'var(--text-dim)'};font-weight:bold;">${u.isVip?'👑 VIP':'Client'}</span>${!u.banni?`<button style="background:var(--accent-red);color:white;border:none;border-radius:4px;padding:2px 6px;font-size:10px;cursor:pointer;" onclick="event.stopPropagation();banUser(${u.id})">❌</button>`:'<span style="color:var(--accent-red);font-size:10px;font-weight:bold;">BANNI</span>'}</div></div>`).join('');
};
function updateAdminStats(){
  let ca=Number(reglages.caTotal)||0;
  document.getElementById('statsCATotal').innerText=ca.toFixed(2)+" €";
  document.getElementById('statsTotalOrders').innerText=(reglages.totalOrders||0);
  let trend=document.getElementById('statsTrendIndicator');
  if(lastCATrendBase===null || typeof lastCATrendBase==='undefined') lastCATrendBase=ca;
  if(trend){
    let base=lastCATrendBase;
    let diff=Math.round((ca-base)*100)/100;
    trend.className='stats-trend '+(diff<0?'loss':(diff>0?'gain':'neutral'));
    trend.innerText=(diff<0?`↘ ${diff.toFixed(2)} €`:(diff>0?`↗ +${diff.toFixed(2)} €`:'→ 0.00 €'))+' depuis l’ouverture';
  }
}

// =============================================
// GPS LIVRAISON
// =============================================
function initGPSDelivery(driver){
  if(mapClient){ mapClient.remove(); mapClient=null; }
  mapClient=L.map('clientMap',{zoomControl:false}).setView([TOURS_LAT,TOURS_LNG],14);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(mapClient);
  if(window.etaInt) clearInterval(window.etaInt);
  let sLat=driver.lat,sLng=driver.lng;
  let eLat=sLat+(Math.random()*0.02-0.01),eLng=sLng+(Math.random()*0.02-0.01);
  let line=L.polyline([[sLat,sLng],[eLat,eLng]],{color:'var(--accent-blue)',weight:4,dashArray:'10, 10'}).addTo(mapClient);
  mapClient.fitBounds(line.getBounds(),{padding:[50,50]});
  let icon=L.divIcon({className:'driver-marker-icon-client',html:'🛵',iconSize:[30,30]});
  clientMarker=L.marker([sLat,sLng],{icon}).addTo(mapClient);
  animateMarker(clientMarker,sLat,sLng,eLat,eLng,25000);
  let timeLeft=Math.floor(cartDistance*4)+10;
  document.getElementById('etaTimer').innerText=timeLeft;
  window.etaInt=setInterval(()=>{
    timeLeft--; if(timeLeft<=0){ clearInterval(window.etaInt); document.getElementById('etaTimer').innerText=0; }
    else document.getElementById('etaTimer').innerText=timeLeft;
  },60000);
}
window.openClientGPS=function(){
  document.getElementById('gpsModal').style.display='flex';
  if(mapClient) setTimeout(()=>mapClient.invalidateSize(),200);
};


// Intro Lago simple, épurée, sans thème saisonnier
function startSimpleIntro(){}

// =============================================
// V28 — Anti rebond iPhone / haut toujours collé
// =============================================
(function(){
  let startY = 0;
  let activeScrollable = null;

  function isScrollable(el){
    if(!el || el === document || el === window) return false;
    let style = window.getComputedStyle(el);
    let canScroll = /(auto|scroll)/.test(style.overflowY);
    return canScroll && el.scrollHeight > el.clientHeight + 1;
  }

  function getScrollableFrom(target){
    let el = target;
    while(el && el !== document.body){
      if(isScrollable(el)) return el;
      el = el.parentElement;
    }
    return document.querySelector('.app-wrapper[style*="block"]') ||
           document.querySelector('#clientApp[style*="block"]') ||
           document.querySelector('#adminApp[style*="block"]') ||
           document.querySelector('#driverApp[style*="block"]') ||
           document.querySelector('.app-wrapper');
  }

  document.addEventListener('touchstart', function(e){
    if(!e.touches || !e.touches.length) return;
    startY = e.touches[0].clientY;
    activeScrollable = getScrollableFrom(e.target);
  }, {passive:true});

  document.addEventListener('touchmove', function(e){
    if(!e.touches || !e.touches.length) return;
    const y = e.touches[0].clientY;
    const deltaY = y - startY;
    const scroller = activeScrollable || getScrollableFrom(e.target);
    if(!scroller){
      e.preventDefault();
      return;
    }

    const atTop = scroller.scrollTop <= 0;
    const atBottom = Math.ceil(scroller.scrollTop + scroller.clientHeight) >= scroller.scrollHeight;

    // Tirer vers le bas quand on est déjà en haut : interdit.
    if(atTop && deltaY > 0){
      scroller.scrollTop = 0;
      e.preventDefault();
      return;
    }

    // Pousser vers le haut quand on est déjà en bas : interdit aussi.
    if(atBottom && deltaY < 0){
      scroller.scrollTop = scroller.scrollHeight;
      e.preventDefault();
    }
  }, {passive:false});

  window.addEventListener('scroll', function(){
    if(window.scrollY !== 0) window.scrollTo(0,0);
  }, {passive:false});
})();

// =============================================
// V29 — verrouillage de la barre client en bas
// =============================================
(function(){
  function pinClientNav(){
    const nav=document.getElementById('clientNav');
    const app=document.getElementById('clientApp');
    if(!nav || !app || nav.style.display==='none' || getComputedStyle(app).display==='none') return;
    nav.style.transform='translateZ(0)';
    const bottomGap=25;
    const targetBottom=(window.innerHeight||document.documentElement.clientHeight)-bottomGap;
    const rect=nav.getBoundingClientRect();
    const diff=targetBottom-rect.bottom;
    if(Math.abs(diff)>2){
      nav.style.transform=`translateY(${diff}px) translateZ(0)`;
    }
  }
  window.pinClientNav=pinClientNav;
  function bind(){
    const app=document.getElementById('clientApp');
    if(app && !app.dataset.navPinned){
      app.dataset.navPinned='1';
      app.addEventListener('scroll',()=>requestAnimationFrame(pinClientNav),{passive:true});
      app.addEventListener('touchmove',()=>requestAnimationFrame(pinClientNav),{passive:true});
    }
    window.addEventListener('resize',()=>requestAnimationFrame(pinClientNav),{passive:true});
    window.addEventListener('orientationchange',()=>setTimeout(pinClientNav,150),{passive:true});
    setInterval(pinClientNav,700);
    setTimeout(pinClientNav,100);
    setTimeout(pinClientNav,600);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind);
  else bind();
  const oldSwitch=window.switchClientTab;
  if(typeof oldSwitch==='function'){
    window.switchClientTab=function(tabId,btn){
      oldSwitch(tabId,btn);
      setTimeout(pinClientNav,30);
      setTimeout(pinClientNav,220);
    };
  }
})();


// =============================================
// V35 — ajouts propres depuis base V32
// =============================================
const LAGO_FIXED_PROMOTIONS=[
  {id:'sleep15',icon:'🌙',title:'-15% sur votre prochaine nuit',desc:'Valable dès 25€ d’achat sur les lits.',min:25,percent:15,expire:'Expire bientôt'},
  {id:'duo10',icon:'🛏️',title:'-10% sur Le Duo',desc:'Une offre simple sur le modèle deux places.',min:20,percent:10,target:'Le Duo',expire:'Cette semaine'},
  {id:'baby20',icon:'🍼',title:'-20% famille',desc:'Valable sur le lit parapluie.',min:20,percent:20,target:'Lit Parapluie',expire:'Expire bientôt'}
];
function ensureV35Data(){
  if(!Array.isArray(reglages.favorites)) reglages.favorites=[];
  if(!Array.isArray(reglages.claimedPromotionIds)) reglages.claimedPromotionIds=[];
  if(typeof reglages.paypalEmail!=='string') reglages.paypalEmail='';
  if(typeof reglages.activeRewardPromo!=='string') reglages.activeRewardPromo=reglages.activeRewardPromo||null;
  if(!reglages.deliverySpeedMultiplier || isNaN(reglages.deliverySpeedMultiplier)) reglages.deliverySpeedMultiplier=1;
  const speed=document.getElementById('debugDeliverySpeed'); if(speed) speed.value=String(reglages.deliverySpeedMultiplier);
}
function computeRealisticDeliveryMinutes(distance){
  let d=Math.max(0.5,Number(distance)||0.5);
  return Math.max(20,Math.min(38,Math.round(18+d*4.5)));
}
window.debugSetDeliverySpeed=function(){
  let v=parseFloat(document.getElementById('debugDeliverySpeed').value);
  reglages.deliverySpeedMultiplier=isNaN(v)?1:v;
  saveAll(); debugRefreshStatus();
};
function openClientPage(pageId){
  document.getElementById('clientApp').querySelectorAll('section').forEach(s=>s.classList.remove('active'));
  let page=document.getElementById(pageId); if(page) page.classList.add('active');
  document.getElementById('clientApp').scrollTo(0,0);
  document.querySelectorAll('#clientNav .navBtn').forEach(b=>b.classList.remove('active'));
  let vb=document.querySelector('.fake-viewers'); if(vb) vb.style.display='none';
  if(pageId==='promotionsPage') renderClientPromotions();
  if(pageId==='favoritesPage') renderFavoritesPage();
  if(pageId==='walletPage') renderWalletPage();
  if(pageId==='commandsPage') renderCommandsPage();
  updateClientNavIndicator();
}
window.openClientPage=openClientPage;
window.closeClientPageTo=function(tab){
  if(tab==='home') switchClientTab('home',document.querySelectorAll('.navBtn')[0]);
  else if(tab==='profile') switchClientTab('profile',document.querySelectorAll('.navBtn')[2]);
  else switchClientTab('home',document.querySelectorAll('.navBtn')[0]);
};
function isFavoriteOption(name){return (reglages.favorites||[]).some(f=>f.name===name);}
function prepareBubbleFavorite(name,desc,price){
  ensureV35Data();
  let btn=document.getElementById('bubbleFavoriteBtn'); if(!btn) return;
  btn.style.display='block';
  btn.textContent=isFavoriteOption(name)?'♥ Retirer des favoris':'♡ Ajouter aux favoris';
  btn.onclick=function(){
    let idx=reglages.favorites.findIndex(f=>f.name===name);
    if(idx>=0) reglages.favorites.splice(idx,1);
    else reglages.favorites.unshift({type:'option',name,desc,price});
    saveAll();
    prepareBubbleFavorite(name,desc,price);
  };
}
function renderFavoritesPage(){
  ensureV35Data();
  const box=document.getElementById('clientFavoritesList');
  if(!box) return;
  if(!reglages.favorites.length){box.innerHTML='<div class="empty-clean">Aucun favori pour le moment. Faites un appui long sur une option pour l’ajouter.</div>';return;}
  box.innerHTML=reglages.favorites.map((f,i)=>`<div class="favorite-clean-card"><h4>${f.name}</h4><p>${f.desc||'Option favorite'}${f.price?` • ${Number(f.price).toFixed(2)}€`:''}</p><div class="wallet-actions-clean"><button class="secondary" onclick="removeFavoriteV35(${i})">Retirer</button></div></div>`).join('');
}
window.removeFavoriteV35=function(i){reglages.favorites.splice(i,1);saveAll();renderFavoritesPage();};
function rewardPromoDiscount(){
  const promo=LAGO_FIXED_PROMOTIONS.find(p=>p.id===reglages.activeRewardPromo);
  if(!promo) return 0;
  let base=0;
  cart.forEach(c=>{ if(!promo.target || c.name===promo.target) base+=(Number(c.price)||0)*(Number(c.qty)||1); });
  if(base<Number(promo.min||0)) return 0;
  return Math.round(base*(Number(promo.percent)||0)/100*100)/100;
}
function renderClientPromotions(){
  ensureV35Data();
  const box=document.getElementById('clientPromoList'); if(!box) return;
  box.innerHTML=LAGO_FIXED_PROMOTIONS.map(p=>{
    const claimed=reglages.claimedPromotionIds.includes(p.id);
    return `<div class="promo-clean-card"><div class="promo-clean-icon">${p.icon}</div><div class="promo-clean-main"><h4>${p.title}</h4><p>${p.desc}</p><p class="promo-expire">${p.expire}</p></div><button class="${claimed?'claimed':''}" onclick="claimFixedPromotion('${p.id}')">${claimed?'Reçue':'Recevoir'}</button></div>`;
  }).join('');
}
window.claimFixedPromotion=function(id){
  ensureV35Data();
  if(!reglages.claimedPromotionIds.includes(id)) reglages.claimedPromotionIds.push(id);
  reglages.activeRewardPromo=id;
  saveAll(); renderClientPromotions(); updateCart(); alert('Promotion reçue. Elle s’appliquera automatiquement dans votre panier.');
};
function renderWalletPage(){
  ensureV35Data();
  const box=document.getElementById('walletPageContent'); if(!box) return;
  const cards=reglages.savedCards||[];
  let html=cards.length?cards.map((c,i)=>`<div class="wallet-clean-card"><h4>${c.type} •••• ${c.last4}</h4><p>${c.holder} • Exp. ${c.expiry}${c.design?` • ${getCardDesignName(c.design)}`:''}</p><div class="wallet-actions-clean"><button class="secondary" onclick="deleteSavedCard(${i});renderWalletPage();">Supprimer</button></div></div>`).join(''):'<div class="empty-clean">Aucune carte enregistrée.</div>';
  html+=`<div class="wallet-clean-card"><h4>PayPal</h4><p>${reglages.paypalEmail||'Aucun compte PayPal enregistré.'}</p><div class="wallet-actions-clean"><button onclick="addPaypalWallet()">${reglages.paypalEmail?'Modifier PayPal':'Ajouter PayPal'}</button><button class="secondary" onclick="openPaymentModal(0,function(){renderWalletPage();})">Ajouter une carte</button></div></div>`;
  box.innerHTML=html;
}
window.addPaypalWallet=function(){let mail=prompt('Adresse PayPal :',reglages.paypalEmail||''); if(mail===null)return; mail=mail.trim(); if(mail&&!mail.includes('@'))return alert('Adresse invalide.'); reglages.paypalEmail=mail; saveAll(); renderWalletPage();};
function renderCommandsPage(){
  const box=document.getElementById('commandsPageContent'); if(!box) return;
  const hist=reglages.historiqueCommandes||[];
  if(!hist.length){box.innerHTML='<div class="empty-clean">Aucune commande pour le moment.</div>';return;}
  box.innerHTML=[...hist].reverse().map(h=>`<div class="command-clean-card"><div><h4>${h.items||'Commande Lago'}</h4><p>${h.date}${h.status?` • ${h.status}`:''}</p></div><div class="command-price">${Number(h.prix||0).toFixed(2)}€</div></div>`).join('');
}
// Extension calcul panier pour offres reçues
const _v35UpdateCart=window.updateCart||updateCart;
window.updateCart=function(){
  _v35UpdateCart();
  try{
    const disc=rewardPromoDiscount();
    const old=document.getElementById('rewardPromoRow'); if(old) old.remove();
    const oldBanner=document.getElementById('rewardPromoBanner'); if(oldBanner) oldBanner.remove();
    if(disc>0){
      const dyn=document.getElementById('dynamicTaxesAndDiscounts');
      const row=document.createElement('div'); row.id='rewardPromoRow'; row.className='cartItem discount'; row.style.marginTop='10px';
      const p=LAGO_FIXED_PROMOTIONS.find(x=>x.id===reglages.activeRewardPromo);
      row.innerHTML=`<span>Offre reçue (${p.title})</span><span>-${disc.toFixed(2)} €</span>`;
      dyn.appendChild(row);
      const totalEl=document.getElementById('totalPrice');
      totalEl.textContent=Math.max(0,parseFloat(totalEl.textContent||'0')-disc).toFixed(2);
      const fact=document.getElementById('factureDetails');
      if(fact){let ban=document.createElement('div');ban.id='rewardPromoBanner';ban.className='auto-promo-banner';ban.textContent='Promotion reçue appliquée automatiquement.';fact.parentElement.insertBefore(ban,fact);}
    }
  }catch(e){console.warn(e);}
};
// Consommer la promo reçue après paiement réussi
const _v35OpenPayment=window.openPaymentModal;
if(typeof _v35OpenPayment==='function'){
  window.openPaymentModal=function(amount,cb){
    _v35OpenPayment(amount,function(){
      if(typeof cb==='function') cb();
      if(rewardPromoDiscount()>0){reglages.claimedPromotionIds=reglages.claimedPromotionIds.filter(id=>id!==reglages.activeRewardPromo);reglages.activeRewardPromo=null;}
      saveAll();
    });
  };
}
// Debug status enrichi temps
const _v35DebugRefresh=window.debugRefreshStatus;
window.debugRefreshStatus=function(){_v35DebugRefresh(); let el=document.getElementById('debugStatus'); if(el) el.innerHTML+=`<br><b>Temps livraison :</b> ${reglages.deliverySpeedMultiplier==1?'réel':'accéléré x'+(1/reglages.deliverySpeedMultiplier).toFixed(0)}`;};
// Bootstrap
(function(){
  const boot=()=>{ensureV35Data(); renderClientPromotions(); if(typeof renderClientStats==='function') renderClientStats(); saveAll();};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();

// =============================================
// V36 — ajustements demandés
// =============================================
const LAGO_PROMO_LIBRARY = [
  {id:'promo01',icon:'🛏️',title:'-10% sur Le Solo',desc:'Valable sur le lit une place pour les petites urgences.',min:15,percent:10,target:'Le Solo',expire:'Expire bientôt'},
  {id:'promo02',icon:'🌙',title:'-15% sur votre prochaine nuit',desc:'Valable dès 25€ d’achat sur tous les lits.',min:25,percent:15,expire:'Cette semaine'},
  {id:'promo03',icon:'👨‍👩‍👧',title:'-20% famille',desc:'Offre spéciale sur le lit parapluie.',min:20,percent:20,target:'Lit Parapluie',expire:'Expire bientôt'},
  {id:'promo04',icon:'🔥',title:'-12% sur Le Duo',desc:'Le deux places devient encore plus rentable.',min:20,percent:12,target:'Le Duo',expire:'Aujourd’hui'},
  {id:'promo05',icon:'🧊',title:'Livraison offerte VIP',desc:'Livraison gratuite sur les paniers supérieurs à 30€.',min:30,percent:8,expire:'Cette semaine'},
  {id:'promo06',icon:'🎁',title:'-8% sur les options confort',desc:'À utiliser avec au moins un matelas dans le panier.',min:18,percent:8,expire:'Expire bientôt'},
  {id:'promo07',icon:'💤',title:'Pack nuit malin',desc:'-5% sur toute commande passée après 22h.',min:18,percent:5,expire:'Ce soir'},
  {id:'promo08',icon:'⚡',title:'Livraison express',desc:'-10% dès 30€ sur les commandes prioritaires.',min:30,percent:10,expire:'Cette semaine'},
  {id:'promo09',icon:'🍼',title:'Bébé bien installé',desc:'-18% sur le lit parapluie et ses accessoires.',min:20,percent:18,target:'Lit Parapluie',expire:'Expire bientôt'},
  {id:'promo10',icon:'🏡',title:'Première commande',desc:'-10% sur la première vraie commande Lago.',min:15,percent:10,expire:'En ce moment'},
  {id:'promo11',icon:'🧸',title:'Nuit cocooning',desc:'-7% sur un lit + coussin + draps.',min:25,percent:7,expire:'Ce week-end'},
  {id:'promo12',icon:'💎',title:'Client premium du soir',desc:'-14% dès 40€ sur tout le panier.',min:40,percent:14,expire:'Ce soir'},
  {id:'promo13',icon:'🚀',title:'Commande urgente',desc:'-9% sur les commandes livrées rapidement.',min:25,percent:9,expire:'Aujourd’hui'},
  {id:'promo14',icon:'🏨',title:'Confort hôtel',desc:'-11% sur Le Duo avec draps propres.',min:30,percent:11,target:'Le Duo',expire:'Cette semaine'},
  {id:'promo15',icon:'🛒',title:'Panier malin',desc:'-6% dès 20€ sur tout le panier.',min:20,percent:6,expire:'Toujours disponible'},
  {id:'promo16',icon:'🌧️',title:'Semaine pluvieuse',desc:'-10% pour se mettre à l’abri toute la nuit.',min:22,percent:10,expire:'Cette semaine'},
  {id:'promo17',icon:'🎉',title:'Offre découverte Lago+',desc:'-13% sur votre prochain achat matelas.',min:25,percent:13,expire:'Expire bientôt'},
  {id:'promo18',icon:'📦',title:'Gros panier',desc:'-15% dès 50€ sur tout le panier.',min:50,percent:15,expire:'Cette semaine'},
  {id:'promo19',icon:'🪄',title:'Pack installation',desc:'-8% si vous ajoutez Installation.',min:20,percent:8,expire:'En ce moment'},
  {id:'promo20',icon:'🛵',title:'Livraison locale',desc:'-5% si votre distance est courte.',min:15,percent:5,expire:'Toujours disponible'},
  {id:'promo21',icon:'🌟',title:'Top client',desc:'-10% sur n’importe quel matelas.',min:15,percent:10,expire:'Cette semaine'},
  {id:'promo22',icon:'🍀',title:'Chance du jour',desc:'-7% sur la totalité du panier.',min:18,percent:7,expire:'Aujourd’hui'},
  {id:'promo23',icon:'🧾',title:'Ticket allégé',desc:'-9% dès 28€ sur tout le panier.',min:28,percent:9,expire:'Cette semaine'},
  {id:'promo24',icon:'👑',title:'Duo royal',desc:'-16% sur Le Duo pour les grandes nuits.',min:25,percent:16,target:'Le Duo',expire:'Expire bientôt'},
  {id:'promo25',icon:'🫶',title:'Client fidèle',desc:'-6% sur une nouvelle commande.',min:20,percent:6,expire:'En ce moment'},
  {id:'promo26',icon:'🛌',title:'Nuit légère',desc:'-10% sur Le Gonflable.',min:10,percent:10,target:'Matelas Gonflable',expire:'Cette semaine'},
  {id:'promo27',icon:'🏷️',title:'Petit prix',desc:'-5€ équivalent en réduction sur un panier de 35€.',min:35,percent:14,expire:'Expire bientôt'},
  {id:'promo28',icon:'📲',title:'Offre mobile',desc:'-8% sur toute commande passée depuis l’accueil.',min:20,percent:8,expire:'Toujours disponible'},
  {id:'promo29',icon:'✨',title:'Pack draps',desc:'-9% si Draps propres est sélectionné.',min:20,percent:9,expire:'Aujourd’hui'},
  {id:'promo30',icon:'💼',title:'Pro de la nuit',desc:'-11% sur les commandes supérieures à 30€.',min:30,percent:11,expire:'Cette semaine'},
  {id:'promo31',icon:'🧡',title:'Coup de cœur',desc:'-10% sur le produit que vous adorez.',min:18,percent:10,expire:'Expire bientôt'},
  {id:'promo32',icon:'🎈',title:'Week-end chill',desc:'-7% sur tout le panier du week-end.',min:18,percent:7,expire:'Week-end'},
  {id:'promo33',icon:'🥇',title:'Best-seller Le Duo',desc:'-14% sur le lit préféré des clients.',min:25,percent:14,target:'Le Duo',expire:'Aujourd’hui'},
  {id:'promo34',icon:'🕒',title:'Happy hour',desc:'-6% pendant les heures creuses.',min:15,percent:6,expire:'Ce soir'},
  {id:'promo35',icon:'🎊',title:'Offre spéciale Lago',desc:'-12% dès 24€ sur tout le panier.',min:24,percent:12,expire:'Cette semaine'},
  {id:'promo36',icon:'🧽',title:'Confort propre',desc:'-8% avec les draps et la grosse couette.',min:25,percent:8,expire:'Toujours disponible'},
  {id:'promo37',icon:'🤝',title:'Client invité',desc:'-10% sur une commande découverte.',min:15,percent:10,expire:'Expire bientôt'},
  {id:'promo38',icon:'🛏',title:'Solo malin',desc:'-11% sur Le Solo en soirée.',min:15,percent:11,target:'Le Solo',expire:'Ce soir'},
  {id:'promo39',icon:'🪙',title:'Budget zen',desc:'-5% sur tout le panier.',min:15,percent:5,expire:'Toujours disponible'},
  {id:'promo40',icon:'🌈',title:'Multi-options',desc:'-9% si vous prenez au moins deux options.',min:18,percent:9,expire:'Cette semaine'},
  {id:'promo41',icon:'📍',title:'Quartier voisin',desc:'-6% pour les petites distances.',min:15,percent:6,expire:'En ce moment'},
  {id:'promo42',icon:'💫',title:'Nuit premium',desc:'-13% dès 38€.',min:38,percent:13,expire:'Expire bientôt'},
  {id:'promo43',icon:'🧒',title:'Pack famille',desc:'-15% sur les commandes avec Lit Parapluie.',min:20,percent:15,target:'Lit Parapluie',expire:'Cette semaine'},
  {id:'promo44',icon:'🧑‍🎓',title:'Étudiant',desc:'-7% sur un panier dès 18€.',min:18,percent:7,expire:'Toujours disponible'},
  {id:'promo45',icon:'🍀',title:'Réduction surprise',desc:'-12% sur votre prochain panier.',min:25,percent:12,expire:'Aujourd’hui'},
  {id:'promo46',icon:'🪩',title:'Nuit de fête',desc:'-10% sur les commandes tardives.',min:20,percent:10,expire:'Ce soir'},
  {id:'promo47',icon:'🧷',title:'Secours rapide',desc:'-9% sur le matelas gonflable.',min:10,percent:9,target:'Matelas Gonflable',expire:'Expire bientôt'},
  {id:'promo48',icon:'🎯',title:'Offre ciblée Solo',desc:'-8% sur Le Solo.',min:15,percent:8,target:'Le Solo',expire:'Cette semaine'},
  {id:'promo49',icon:'🎀',title:'Pack douceur',desc:'-10% avec Couette + Coussin.',min:20,percent:10,expire:'En ce moment'},
  {id:'promo50',icon:'🛰️',title:'Lago Boost',desc:'-15% dès 45€ sur tout le panier.',min:45,percent:15,expire:'Expire bientôt'}
];
const V36_DEFAULT_VISIBLE_PROMOS = ['promo02','promo04','promo10','promo18','promo24','promo43'];
const V36_MATTRESS_META = {
  'Le Solo':{desc:'Matelas 1 place avec vrai matelas confort. Idéal pour dépanner proprement.',price:()=>Number(reglages.prixSolo||20)},
  'Le Duo':{desc:'Le grand classique 2 places, confortable et best-seller.',price:()=>Number(reglages.prixDuo||35)},
  'Matelas Gonflable':{desc:'Version rapide et économique pour un dépannage.',price:()=>Number(reglages.prixGonflable||10)},
  'Lit Parapluie':{desc:'Solution bébé / famille avec petit matelas.',price:()=>Number(reglages.prixBebe||25)}
};
function ensureV36Data(){
  ensureV35Data();
  if(!Array.isArray(reglages.adminVisiblePromoIds) || !reglages.adminVisiblePromoIds.length) reglages.adminVisiblePromoIds=[...V36_DEFAULT_VISIBLE_PROMOS];
  reglages.adminVisiblePromoIds = reglages.adminVisiblePromoIds.filter(id=>LAGO_PROMO_LIBRARY.some(p=>p.id===id));
  if(!reglages.adminVisiblePromoIds.length) reglages.adminVisiblePromoIds=[...V36_DEFAULT_VISIBLE_PROMOS];
  if(!Array.isArray(reglages.favorites)) reglages.favorites=[];
  if(!Array.isArray(reglages.claimedPromotionIds)) reglages.claimedPromotionIds=[];
}
function getPromotionById(id){ return LAGO_PROMO_LIBRARY.find(p=>p.id===id) || null; }
function getVisiblePromotions(){
  ensureV36Data();
  return reglages.adminVisiblePromoIds.map(getPromotionById).filter(Boolean);
}
function updatePromoBellCount(){
  const span=document.querySelector('#promoBellBtn span');
  if(span){ const n=getVisiblePromotions().length; span.textContent=String(Math.min(n,99)); }
}
function updateProfileHelpButton(){
  const btn=document.getElementById('profileHelpBtn');
  if(!btn) return;
  const shouldShow=currentClientTab==='profile' && !document.getElementById('helpPage')?.classList.contains('active') && document.getElementById('profile')?.classList.contains('active');
  btn.style.display=shouldShow?'flex':'none';
}
function findFavoriteIndex(name){ return (reglages.favorites||[]).findIndex(f=>f.name===name); }
function isFavoriteAny(name){ return findFavoriteIndex(name)>=0; }
function prepareBubbleFavorite(name,desc,price,type='option'){
  ensureV36Data();
  let btn=document.getElementById('bubbleFavoriteBtn'); if(!btn) return;
  btn.style.display='block';
  btn.textContent=isFavoriteAny(name)?'♥ Retirer des favoris':'♡ Ajouter aux favoris';
  btn.onclick=function(){
    let idx=findFavoriteIndex(name);
    if(idx>=0) reglages.favorites.splice(idx,1);
    else reglages.favorites.unshift({type,name,desc,price});
    saveAll();
    prepareBubbleFavorite(name,desc,price,type);
    if(document.getElementById('favoritesPage')?.classList.contains('active')) renderFavoritesPage();
  };
}
function showInfoFavorite(title,desc,price,type){
  document.getElementById('bubbleTitle').innerText=title;
  document.getElementById('bubbleDesc').innerText=desc;
  prepareBubbleFavorite(title,desc,price,type);
  document.getElementById('infoBubble').style.display='block';
}
function bindV36MattressLongPress(){
  document.querySelectorAll('.mattress').forEach(m=>{
    if(m.dataset.v36Bound==='1') return;
    m.dataset.v36Bound='1';
    let timer=null, longPress=false;
    const meta=()=>V36_MATTRESS_META[m.dataset.name] || {desc:'Matelas Lago',price:()=>Number(m.dataset.price||0)};
    const start=()=>{ longPress=false; clearTimeout(timer); timer=setTimeout(()=>{ longPress=true; showInfoFavorite(m.dataset.name, meta().desc, meta().price(), 'mattress'); },520); };
    const cancel=()=>clearTimeout(timer);
    m.addEventListener('touchstart',start,{passive:true});
    m.addEventListener('touchmove',cancel,{passive:true});
    m.addEventListener('touchend',e=>{ cancel(); if(longPress) e.preventDefault(); },{passive:false});
    m.addEventListener('contextmenu',e=>{ e.preventDefault(); showInfoFavorite(m.dataset.name, meta().desc, meta().price(), 'mattress'); });
  });
}
const _v36OldAttach = attacherEvenementsClics;
attacherEvenementsClics = function(){ _v36OldAttach(); bindV36MattressLongPress(); };
const _v36BaseSwitch = window.switchClientTab;
window.switchClientTab=function(tabId,btn){ _v36BaseSwitch(tabId,btn); updateProfileHelpButton(); };
const _v36BaseOpenPage = window.openClientPage;
window.openClientPage=function(pageId){ _v36BaseOpenPage(pageId); if(pageId==='helpPage') initHelpChat(); updateProfileHelpButton(); };
window.closeClientPageTo=function(tab){
  if(tab==='profile') window.switchClientTab('profile',document.querySelectorAll('.navBtn')[2]);
  else if(tab==='orders') window.switchClientTab('orders',document.querySelectorAll('.navBtn')[1]);
  else window.switchClientTab('home',document.querySelectorAll('.navBtn')[0]);
  updateProfileHelpButton();
};
function renderFavoritesPage(){
  ensureV36Data();
  const box=document.getElementById('clientFavoritesList'); if(!box) return;
  if(!reglages.favorites.length){box.innerHTML='<div class="empty-clean">Aucun favori pour le moment. Faites un appui long sur un matelas ou une option pour l’ajouter.</div>';return;}
  box.innerHTML=reglages.favorites.map((f,i)=>{
    const badge=f.type==='mattress'?'🛏️ Matelas':'✨ Option';
    const priceTxt=(f.price || f.price===0)?` • ${Number(f.price).toFixed(2)}€`:'';
    return `<div class="favorite-clean-card"><div class="favorite-type-pill">${badge}</div><h4>${f.name}</h4><p>${f.desc||'Favori Lago'}${priceTxt}</p><div class="wallet-actions-clean"><button onclick="useFavoriteItem(${i})">Utiliser</button><button class="secondary" onclick="removeFavoriteV36(${i})">Retirer</button></div></div>`;
  }).join('');
}
window.removeFavoriteV36=function(i){ reglages.favorites.splice(i,1); saveAll(); renderFavoritesPage(); };
window.useFavoriteItem=function(i){
  const fav=(reglages.favorites||[])[i]; if(!fav) return;
  if(fav.type==='mattress'){
    window.switchClientTab('home',document.querySelectorAll('.navBtn')[0]);
    document.querySelectorAll('.mattress').forEach(x=>x.classList.remove('selected'));
    const target=[...document.querySelectorAll('.mattress')].find(x=>x.dataset.name===fav.name);
    if(target){ target.classList.add('selected'); selectedMattress=target; updateCart(); }
    closeClientPageTo('home');
    alert('Matelas favori sélectionné.');
    return;
  }
  const opt=[...document.querySelectorAll('.options:not(.tip-options) .option')].find(x=>x.dataset.name===fav.name);
  if(opt){ window.switchClientTab('home',document.querySelectorAll('.navBtn')[0]); opt.classList.add('selected'); updateCart(); closeClientPageTo('home'); alert('Option favorite préparée.'); }
};
function rewardPromoDiscount(){
  const promo=getPromotionById(reglages.activeRewardPromo);
  if(!promo) return 0;
  let base=0;
  cart.forEach(c=>{ if(!promo.target || c.name===promo.target) base+=(Number(c.price)||0)*(Number(c.qty)||1); });
  if(base<Number(promo.min||0)) return 0;
  return Math.round(base*(Number(promo.percent)||0)/100*100)/100;
}
function renderClientPromotions(){
  ensureV36Data(); updatePromoBellCount();
  const box=document.getElementById('clientPromoList'); if(!box) return;
  const list=getVisiblePromotions();
  box.innerHTML=list.map(p=>{
    const claimed=(reglages.claimedPromotionIds||[]).includes(p.id);
    return `<div class="promo-clean-card"><div class="promo-clean-icon">${p.icon}</div><div class="promo-clean-main"><h4>${p.title}</h4><p>${p.desc}</p><p class="promo-expire">${p.expire} • Dès ${Number(p.min||0).toFixed(0)}€</p></div><button class="${claimed?'claimed':''}" onclick="claimFixedPromotion('${p.id}')">${claimed?'Reçue':'Recevoir'}</button></div>`;
  }).join('') || '<div class="empty-clean">Aucune promotion visible pour le moment.</div>';
}
window.claimFixedPromotion=function(id){
  ensureV36Data();
  if(!(reglages.claimedPromotionIds||[]).includes(id)) reglages.claimedPromotionIds.push(id);
  reglages.activeRewardPromo=id;
  saveAll(); renderClientPromotions(); updateCart(); alert('Promotion reçue. Elle sera appliquée automatiquement dans votre panier.');
};
function renderWalletPage(){
  ensureV36Data();
  const box=document.getElementById('walletPageContent'); if(!box) return;
  const cards=reglages.savedCards||[];
  let html='';
  if(cards.length){
    html+=`<div class="wallet-mini-stack">`+cards.map((c,i)=>`<div class="wallet-clean-card"><div class="wallet-visual-card">${savedCardMiniHtml(c)}<div><h4>${c.type} •••• ${c.last4}</h4><p>${c.holder} • Exp. ${c.expiry}${c.design?` • ${getCardDesignName(c.design)}`:''}</p></div></div><div class="wallet-actions-clean"><button onclick="editSavedCard(${i});setTimeout(()=>renderWalletPage(),120)">Modifier</button><button class="secondary" onclick="deleteSavedCard(${i});renderWalletPage();">Supprimer</button></div></div>`).join('')+`</div>`;
  } else html+='<div class="empty-clean">Aucune carte enregistrée pour le moment.</div>';
  html+=`<div class="wallet-paypal-pill"><div><strong>PayPal</strong><span>${reglages.paypalEmail||'Aucun compte connecté.'}</span></div><button onclick="addPaypalWallet()">${reglages.paypalEmail?'Connecté':'Connecter'}</button></div>`;
  html+=`<div class="wallet-actions-clean" style="margin-top:14px;"><button onclick="openPaymentModal(0,function(){renderWalletPage();})">＋ Ajouter une carte</button><button class="secondary" onclick="addPaypalWallet()">Connecter son PayPal</button></div>`;
  box.innerHTML=html;
}
window.addPaypalWallet=function(){
  let mail=prompt('Adresse PayPal :',reglages.paypalEmail||'');
  if(mail===null) return;
  mail=mail.trim();
  if(mail && !mail.includes('@')) return alert('Adresse invalide.');
  reglages.paypalEmail=mail;
  saveAll(); renderWalletPage();
};
function deriveCommandDetails(order){
  if(Array.isArray(order.details) && order.details.length) return order.details;
  const raw=(order.items||'Commande Lago').split(',').map(s=>s.trim()).filter(Boolean);
  if(!raw.length) return ['Commande Lago'];
  return raw;
}
function openCommandDetailModalFromOrder(order){
  if(!order) return;
  const modal=document.getElementById('commandDetailModal'); if(!modal) return;
  document.getElementById('commandDetailTitle').textContent='Détail de la commande';
  document.getElementById('commandDetailMeta').textContent=`${order.date||''}${order.status?` • ${order.status}`:''}${order.prix||order.prix===0?` • ${Number(order.prix).toFixed(2)}€`:''}`;
  const items=deriveCommandDetails(order);
  document.getElementById('commandDetailItems').innerHTML=items.map((it,idx)=>`<div class="command-detail-item"><span>${idx+1}. ${it}</span><strong>Ajouté</strong></div>`).join('');
  modal.classList.add('active');
}
window.closeCommandDetailModal=function(){ document.getElementById('commandDetailModal')?.classList.remove('active'); };
function bindCommandCardLongPress(){
  document.querySelectorAll('.command-clean-card').forEach(card=>{
    if(card.dataset.v36Bound==='1') return;
    card.dataset.v36Bound='1';
    const index=Number(card.dataset.orderIndex);
    let t=null,longPress=false;
    const order=(reglages.historiqueCommandes||[])[index];
    const open=()=>openCommandDetailModalFromOrder(order);
    card.addEventListener('click',open);
    card.addEventListener('contextmenu',e=>{e.preventDefault();open();});
    card.addEventListener('touchstart',()=>{ longPress=false; clearTimeout(t); t=setTimeout(()=>{ longPress=true; open(); },520); },{passive:true});
    card.addEventListener('touchmove',()=>clearTimeout(t),{passive:true});
    card.addEventListener('touchend',e=>{ clearTimeout(t); if(longPress) e.preventDefault(); },{passive:false});
  });
}
function renderCommandsPage(){
  const box=document.getElementById('commandsPageContent'); if(!box) return;
  const hist=(reglages.historiqueCommandes||[]).slice().reverse();
  if(!hist.length){ box.innerHTML='<div class="empty-clean">Aucune commande pour le moment.</div>'; return; }
  box.innerHTML=hist.map((h,idx)=>`<div class="command-clean-card" data-order-index="${(reglages.historiqueCommandes||[]).length-1-idx}"><div><h4>${h.items||'Commande Lago'}</h4><p>${h.date}${h.status?` • ${h.status}`:''}</p><small>Appui long pour voir l’historique détaillé</small></div><div class="command-price">${Number(h.prix||0).toFixed(2)}€</div></div>`).join('');
  bindCommandCardLongPress();
}
function getHelpBotAnswer(text){
  const t=(text||'').toLowerCase();
  if(t.includes('livraison') || t.includes('commande')) return 'Je peux vous aider pour votre livraison. Vérifiez d’abord le suivi de commande. Si le délai dépasse l’estimation, nous ouvrons un ticket prioritaire.';
  if(t.includes('paiement') || t.includes('paypal') || t.includes('carte') || t.includes('wallet')) return 'Pour un souci de paiement, vérifiez votre Wallet, reconnectez PayPal ou enregistrez une nouvelle carte. Si un débit échoue, réessayez avec un autre moyen.';
  if(t.includes('premium') || t.includes('lago+')) return 'Lago+ applique automatiquement ses avantages. Si l’abonnement semble inactif, je peux vous guider vers votre espace Premium.';
  if(t.includes('bonjour') || t.includes('salut')) return 'Bonjour 👋 Je suis Lago Care. Dites-moi si votre besoin concerne une commande, un paiement, un remboursement ou Lago+.';
  if(t.includes('rembourse')) return 'Je peux vous aider pour un remboursement. Si la commande est encore en cours et éligible, consultez votre historique. Sinon, contactez le support Lago depuis ce chat.';
  return 'J’ai bien pris votre demande. Je peux vous aider sur : livraison, paiement, Wallet, Lago+, remboursement ou suivi de commande.';
}
function appendHelpChatMessage(role,text){
  const box=document.getElementById('helpChatMessages'); if(!box) return;
  const row=document.createElement('div'); row.className=`help-chat-row ${role}`;
  row.innerHTML=`<div class="help-chat-bubble">${text}</div>`;
  box.appendChild(row); box.scrollTop=box.scrollHeight;
}
function initHelpChat(){
  const box=document.getElementById('helpChatMessages'); if(!box || box.dataset.ready==='1') return;
  box.dataset.ready='1';
  appendHelpChatMessage('bot','Bonjour, je suis Lago Care. Choisissez un sujet ou écrivez votre message.');
}
window.openHelpTopic=function(topic){
  initHelpChat();
  const mapping={
    livraison:'J’ai un problème avec ma livraison.',
    paiement:'J’ai un problème de paiement / Wallet.',
    premium:'J’ai une question sur Lago+.',
    contact:'Je souhaite contacter le support Lago.'
  };
  const msg=mapping[topic]||'J’ai besoin d’aide.';
  appendHelpChatMessage('user',msg);
  setTimeout(()=>appendHelpChatMessage('bot',getHelpBotAnswer(msg)),180);
};
window.sendHelpChat=function(){
  initHelpChat();
  const input=document.getElementById('helpChatInput'); if(!input) return;
  const value=input.value.trim(); if(!value) return;
  input.value=''; appendHelpChatMessage('user',value);
  setTimeout(()=>appendHelpChatMessage('bot',getHelpBotAnswer(value)),220);
};
function renderAdminOffersPreview(){
  ensureV36Data();
  const box=document.getElementById('adminOffersPreview'); if(!box) return;
  const promos=getVisiblePromotions();
  box.innerHTML=promos.map(p=>`<span class="admin-offer-chip">${p.icon} ${p.title}</span>`).join('') || '<span class="admin-offer-chip">Aucune offre sélectionnée</span>';
}
window.openAdminOffersModal=function(){ ensureV36Data(); document.getElementById('adminOffersModal')?.classList.add('active'); renderAdminOfferLibrary(); };
window.closeAdminOffersModal=function(){ document.getElementById('adminOffersModal')?.classList.remove('active'); };
window.renderAdminOfferLibrary=function(){
  ensureV36Data();
  const wrap=document.getElementById('adminOffersLibrary'); if(!wrap) return;
  const query=(document.getElementById('adminOffersSearch')?.value || '').trim().toLowerCase();
  wrap.innerHTML=LAGO_PROMO_LIBRARY.filter(p=>!query || (`${p.title} ${p.desc}`.toLowerCase().includes(query))).map(p=>`<label class="admin-offer-row"><input type="checkbox" value="${p.id}" ${reglages.adminVisiblePromoIds.includes(p.id)?'checked':''}><div><h4>${p.icon} ${p.title}</h4><p>${p.desc}</p><p>Dès ${Number(p.min||0).toFixed(0)}€ • -${p.percent}% ${p.target?`• ${p.target}`:'• Tous les lits'}</p></div></label>`).join('');
};
window.saveAdminOffersSelection=function(){
  const ids=[...document.querySelectorAll('#adminOffersLibrary input[type="checkbox"]:checked')].map(i=>i.value);
  if(!ids.length) return alert('Sélectionnez au moins une offre.');
  reglages.adminVisiblePromoIds=ids.slice(0,12);
  saveAll(); renderAdminOffersPreview(); renderClientPromotions(); updatePromoBellCount(); closeAdminOffersModal(); alert('Offres visibles mises à jour.');
};
const _v36OldSaveAdmin=document.getElementById('saveAdminBtn').onclick;
document.getElementById('saveAdminBtn').onclick=function(){
  if(typeof _v36OldSaveAdmin==='function') _v36OldSaveAdmin();
  renderAdminOffersPreview(); renderClientPromotions(); updatePromoBellCount();
};
const _v36UpdateCartBase = window.updateCart;
window.updateCart=function(){
  _v36UpdateCartBase();
  try{
    const disc=rewardPromoDiscount();
    const old=document.getElementById('rewardPromoRow'); if(old) old.remove();
    const oldBanner=document.getElementById('rewardPromoBanner'); if(oldBanner) oldBanner.remove();
    if(disc>0){
      const dyn=document.getElementById('dynamicTaxesAndDiscounts');
      const row=document.createElement('div'); row.id='rewardPromoRow'; row.className='cartItem discount'; row.style.marginTop='10px';
      const p=getPromotionById(reglages.activeRewardPromo);
      row.innerHTML=`<span>Offre reçue (${p?p.title:'Promotion'})</span><span>-${disc.toFixed(2)} €</span>`;
      dyn.appendChild(row);
      const totalEl=document.getElementById('totalPrice');
      totalEl.textContent=Math.max(0,parseFloat(totalEl.textContent||'0')-disc).toFixed(2);
      const fact=document.getElementById('factureDetails');
      if(fact){let ban=document.createElement('div');ban.id='rewardPromoBanner';ban.className='auto-promo-banner';ban.textContent='Promotion reçue appliquée automatiquement.';fact.parentElement.insertBefore(ban,fact);}    }
  }catch(e){console.warn(e);}
};
// bootstrap v36
(function(){
  const boot=()=>{
    ensureV36Data();
    bindV36MattressLongPress();
    renderAdminOffersPreview();
    renderClientPromotions();
    updatePromoBellCount();
    updateProfileHelpButton();
    initHelpChat();
    saveAll();
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();


// =============================================
// V37 — wallet propre, promo unique, aide fixée, recherche livreur
// =============================================
(function(){
  function loadingDriverAvatar(){
    return "data:image/svg+xml;utf8,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#24354f'/><stop offset='1' stop-color='#3f587e'/></linearGradient></defs><rect width='120' height='120' rx='60' fill='url(#g)'/><circle cx='60' cy='46' r='20' fill='rgba(255,255,255,.78)'/><path d='M28 100c5-17 18-27 32-27s27 10 32 27' fill='rgba(255,255,255,.78)'/><circle cx='44' cy='92' r='4' fill='white'><animate attributeName='opacity' values='0.2;1;0.2' dur='1.1s' repeatCount='indefinite'/></circle><circle cx='60' cy='92' r='4' fill='white'><animate attributeName='opacity' values='0.2;1;0.2' dur='1.1s' begin='0.2s' repeatCount='indefinite'/></circle><circle cx='76' cy='92' r='4' fill='white'><animate attributeName='opacity' values='0.2;1;0.2' dur='1.1s' begin='0.4s' repeatCount='indefinite'/></circle></svg>");
  }
  function setTrackingSearchingState(realMinutes){
    const photo=document.getElementById('clientLivreurPhoto');
    const profile=document.getElementById('driverProfile');
    if(profile) profile.style.display='flex';
    if(photo){
      photo.src=loadingDriverAvatar();
      photo.style.display='block';
      photo.classList.add('driver-searching-avatar');
    }
    const name=document.getElementById('livreurName'); if(name) name.innerText="Recherche d'un livreur";
    const note=document.getElementById('livreurNote'); if(note) note.innerText='';
    const small=profile?profile.querySelector('div[style*="font-size:12px"]'):null; if(small) small.innerText=`Nous cherchons un livreur Lago • délai estimé ${realMinutes} min`;
  }
  function setTrackingAssignedState(driver){
    const photo=document.getElementById('clientLivreurPhoto');
    const profile=document.getElementById('driverProfile');
    if(profile) profile.style.display='flex';
    if(photo){
      photo.src=driver.photo;
      photo.style.display='block';
      photo.classList.remove('driver-searching-avatar');
    }
    const nomAff=driver.name+(driver.isPro?' 👑':'');
    document.getElementById('livreurName').innerText=nomAff;
    document.getElementById('rateLivreurName').innerText=nomAff;
    document.getElementById('livreurNote').innerText='★ '+driver.rating;
    const small=profile?profile.querySelector('div[style*="font-size:12px"]'):null; if(small) small.innerText='En route (Clique sur la photo)';
    return nomAff;
  }
  const _oldMiniBubble=window.showDeliveryMiniBubble;
  window.showDeliveryMiniBubble=function(driver,etaText='Recherche…'){
    let b=document.getElementById('deliveryMiniBubble'); if(!b) return;
    const img=document.getElementById('miniDriverPhoto');
    const name=document.getElementById('miniDriverName');
    if(driver){
      if(img){ img.src=driver.photo; img.classList.remove('driver-searching-avatar'); }
      if(name) name.innerText=driver.name;
    }else{
      if(img){ img.src=loadingDriverAvatar(); img.classList.add('driver-searching-avatar'); }
      if(name) name.innerText="Recherche Lago";
    }
    document.getElementById('miniEtaText').innerText=etaText;
    if(deliveryMiniVisible) b.classList.add('show');
  };
  window.updateProfileHelpButton=function(){
    const btn=document.getElementById('profileHelpBtn');
    if(!btn) return;
    const profileActive=document.getElementById('profile')?.classList.contains('active');
    const helpOpen=document.getElementById('helpPage')?.classList.contains('active');
    btn.style.display=(profileActive && !helpOpen)?'flex':'none';
  };
  window.claimFixedPromotion=function(id){
    ensureV36Data();
    reglages.claimedPromotionIds=[id];
    reglages.activeRewardPromo=id;
    saveAll();
    renderClientPromotions();
    updateCart();
    alert('Promotion reçue. Une seule offre promotionnelle peut être active à la fois.');
  };
  window.renderClientPromotions=function(){
    ensureV36Data();
    const box=document.getElementById('clientPromoList'); if(!box) return;
    const activeId=reglages.activeRewardPromo;
    box.innerHTML=getVisiblePromotions().map(p=>{
      const isActive=activeId===p.id;
      return `<div class="promo-clean-card"><div class="promo-clean-icon">${p.icon}</div><div class="promo-clean-main"><h4>${p.title}</h4><p>${p.desc}</p><p class="promo-expire">${p.expire} • Dès ${Number(p.min||0).toFixed(0)}€</p><p style="font-size:11px;color:var(--text-dim);margin-top:4px;">Une seule offre active à la fois.</p></div><button class="${isActive?'claimed active-promo':''}" onclick="claimFixedPromotion('${p.id}')">${isActive?'Active':'Recevoir'}</button></div>`;
    }).join('');
  };
  window.renderWalletPage=function(){
    ensureV36Data();
    const box=document.getElementById('walletPageContent'); if(!box) return;
    const cards=reglages.savedCards||[];
    const primaryText=cards.length ? `${cards[0].type} •••• ${cards[0].last4}` : (reglages.paypalEmail ? 'PayPal connecté' : 'Aucun moyen enregistré');
    let html=`<div class="wallet-overview-card"><div class="wallet-badge-main">Paiement principal</div><h4 style="margin:10px 0 5px;color:var(--text-main);">${primaryText}</h4><p style="margin:0;color:var(--text-dim);font-size:13px;line-height:1.45;">Tout est rangé proprement : vos cartes d'un côté, PayPal de l'autre.</p><div class="wallet-overview-top"><div class="wallet-overview-stat"><strong>${cards.length}</strong><span>Carte(s) enregistrée(s)</span></div><div class="wallet-overview-stat"><strong>${reglages.paypalEmail?'Connecté':'Non connecté'}</strong><span>PayPal</span></div></div></div>`;
    html+=`<div class="wallet-section-title">Cartes bancaires</div>`;
    if(cards.length){
      html+=`<div class="wallet-card-grid">`+cards.map((c,i)=>`<div class="wallet-card-block"><div class="wallet-card-top">${savedCardMiniHtml(c)}<div class="wallet-card-meta"><h4>${c.type} •••• ${c.last4}</h4><p>${c.holder}</p><p>Expiration ${c.expiry}${c.design?` • ${getCardDesignName(c.design)}`:''}</p></div></div><div class="wallet-card-actions"><button onclick="openPaymentModal(0,function(){renderWalletPage();})">Ajouter une autre carte</button><button class="secondary" onclick="deleteSavedCard(${i});renderWalletPage();">Supprimer</button></div></div>`).join('')+`</div>`;
    } else {
      html+=`<div class="wallet-empty-box"><span class="wallet-empty-icon">💳</span>Aucune carte enregistrée pour le moment.</div>`;
    }
    html+=`<div class="wallet-action-strip"><button onclick="openPaymentModal(0,function(){renderWalletPage();})">＋ Ajouter une carte</button></div>`;
    html+=`<div class="wallet-section-title">PayPal</div><div class="wallet-paypal-box"><div class="wallet-paypal-copy"><strong>Compte PayPal</strong><span>${reglages.paypalEmail || 'Aucun compte PayPal connecté pour le moment.'}</span></div><div class="wallet-card-actions"><button onclick="addPaypalWallet()">${reglages.paypalEmail?'Modifier':'Connecter'}</button>${reglages.paypalEmail?'<button class="secondary" onclick="disconnectPaypalWallet()">Déconnecter</button>':''}</div></div>`;
    box.innerHTML=html;
  };
  window.disconnectPaypalWallet=function(){ if(!reglages.paypalEmail) return; if(confirm('Déconnecter votre compte PayPal ?')){ reglages.paypalEmail=''; saveAll(); renderWalletPage(); } };
  document.getElementById('payBtn').onclick=()=>{
    if(deliveryInProgress) return alert("Une livraison est déjà en cours. Tu peux préparer ton panier, mais attends la fin pour repayer.");
    if(cart.length===0) return alert("Ton panier est vide !");
    for(let item of cart){
      if(item.name==="Le Solo"&&reglages.ruptureSolo) return alert("Désolé, Le Solo vient de tomber en rupture !");
      if(item.name==="Le Duo"&&reglages.ruptureDuo) return alert("Désolé, Le Duo vient de tomber en rupture !");
      if(item.name==="Matelas Gonflable"&&reglages.ruptureGonflable) return alert("Désolé, le Gonflable vient de tomber en rupture !");
      if(item.name==="Lit Parapluie"&&reglages.ruptureBebe) return alert("Désolé, le Lit Parapluie vient de tomber en rupture !");
    }
    let deliveryMode=document.getElementById('deliveryModeSelect').value;
    let scheduledTime=document.getElementById('scheduledTimeInput').value;
    if(deliveryMode==='later'&&!scheduledTime) return alert("Veuillez choisir une heure de livraison !");
    let finalPrice=Number(document.getElementById('totalPrice').textContent);
    openPaymentModal(finalPrice,()=>{
      let totalSansTip=Math.round((finalPrice-currentTip)*100)/100;
      let resumeItems=cart.map(c=>`${c.name}${c.qty>1?' (x'+c.qty+')':''}`).join(', ');
      let sousTotalLits=cart.reduce((acc,c)=>acc+(c.price*c.qty),0);
      let cutDriver=sousTotalLits*0.4;
      let cutPatron=(sousTotalLits*0.6)+(reglages.isPremium&&cartDistance<=3.0?0:4.99)+2.99;
      if(promoActive) cutPatron-=computePromoDiscount();
      cutPatron-=computeEasterPromoDiscount();
      if(reglages.isPremium) cutPatron-=Math.round(sousTotalLits*0.15*100)/100;
      if(reglages.taxeNuit) cutPatron+=Math.round(sousTotalLits*0.20*100)/100;
      if(reglages.weatherSurge) cutPatron+=Math.round(sousTotalLits*0.25*100)/100;
      if(currentCagnotteDeduction>0) cutPatron-=currentCagnotteDeduction;
      if(deliveryMode==='later'){
        if(currentCagnotteDeduction>0){ reglages.cagnotte-=currentCagnotteDeduction; reglages.cagnotteSpent=(reglages.cagnotteSpent||0)+currentCagnotteDeduction; }
        let d2=new Date(); let dateStr=d2.toLocaleDateString('fr-FR');
        reglages.historiqueCommandes.push({id:Date.now(),date:dateStr,scheduledTime,prix:finalPrice,items:resumeItems,status:"En cours",cagnotteUsed:currentCagnotteDeduction});
        reglages.caTotal+=Math.max(0,cutPatron); reglages.totalOrders++;
        registerPromoUsageIfNeeded(); registerEasterPromoUsageIfNeeded();
        updateAdminStats(); cart=[]; promoActive=false; currentTip=0;
        document.querySelectorAll('.tip-btn').forEach(b=>b.classList.remove('selected'));
        document.getElementById('promoMessage').style.display="none"; document.getElementById('promoInput').value="";
        document.getElementById('useCagnotteCheck').checked=false;
        mettreAJourVitrine(); updateCart(); mettreAJourHistorique(); saveAll();
        alert(`✅ Livraison programmée pour ${scheduledTime} !`);
        switchClientTab('profile',document.querySelectorAll('.navBtn')[2]); return;
      }
      document.getElementById('clientApp').querySelectorAll('section').forEach(s=>s.classList.remove('active'));
      document.getElementById('clientNav').style.display='none';
      document.getElementById('tracking').classList.add('active');
      let bar=document.getElementById('progressBar'); let truck=document.getElementById('truckIcon');
      let title=document.getElementById('trackTitle'); let desc=document.getElementById('trackDesc');
      let backBtn=document.getElementById('backHomeBtn'); let cashDiv=document.getElementById('cashbackPopup');
      let showGps=document.getElementById('showGpsBtn'); let showChat=document.getElementById('showChatBtn');
      const realDeliveryMinutes=computeRealisticDeliveryMinutes(cartDistance);
      const deliveryFactor=Math.max(0.01,Number(reglages.deliverySpeedMultiplier)||1);
      const totalDeliveryMs=Math.max(7000,Math.round(realDeliveryMinutes*60*1000*deliveryFactor));
      const stageDeliveryMs=Math.max(1200,Math.round(Math.min(120000, Math.max(60000, (60000 + (cartDistance*12000))))*deliveryFactor));
      bar.style.width="5%"; truck.style.left="0%"; truck.innerText="🚚"; truck.style.opacity="1";
      title.innerText="Commande validée !"; desc.innerText=`Recherche d'un livreur disponible... Temps estimé : ${realDeliveryMinutes} min`;
      backBtn.style.display="block"; backBtn.innerText="Réduire la commande"; cashDiv.style.display="none"; showGps.style.display="none"; showChat.style.display="none";
      let summaryBtn=document.getElementById("trackingSummaryBtn"); if(summaryBtn) summaryBtn.style.display="block";
      document.getElementById('chatZone').style.display="none"; document.getElementById('chatHistory').innerHTML="";
      document.getElementById('ratingDiv').style.display="none"; document.getElementById('merciAvis').style.display="none";
      document.querySelectorAll('#starContainer .star').forEach(st=>st.classList.remove('active'));
      document.getElementById('submitReviewBtn').style.display='block'; document.getElementById('submitReviewBtn').disabled=false;
      document.getElementById('commentInput').style.display='block'; document.getElementById('commentInput').value="";
      currentClientRating=0;
      const matchedDriver=getAvailableDriver(reglages.isPremium);
      if(!matchedDriver){ alert("Aucun livreur disponible !"); return; }
      currentDeliveryDriver=null;
      setTrackingSearchingState(realDeliveryMinutes);
      deliveryInProgress=true;
      lastOrderSummary=buildOrderSummary(finalPrice,resumeItems,'Recherche en cours');
      showDeliveryMiniBubble(null,'Recherche d’un livreur…');
      cleanupDeliveryTimers();
      deliveryStageTimer=setTimeout(()=>{
        currentDeliveryDriver=matchedDriver;
        currentDeliveryDriver.status='En livraison 🛵';
        currentDeliveryDriver.earnings+=cutDriver;
        if(currentTip>0) currentDeliveryDriver.tips+=currentTip;
        currentDeliveryDriver.totalOrders++;
        const nomAff=setTrackingAssignedState(currentDeliveryDriver);
        lastOrderSummary=buildOrderSummary(finalPrice,resumeItems,nomAff);
        bar.style.width="50%"; truck.style.left="45%";
        title.innerText="En route 🛵"; desc.innerText=currentDeliveryDriver.name+" arrive avec votre commande.";
        showGps.style.display="inline-block"; showChat.style.display="inline-block";
        showDeliveryMiniBubble(currentDeliveryDriver,`En route • ~${Math.max(5,Math.round(realDeliveryMinutes*0.7))} min`);
        initGPSDelivery(currentDeliveryDriver); openClientGPS();
        renderAdminDrivers(); saveAll();
      },stageDeliveryMs);
      deliveryFinishTimer=setTimeout(()=>{
        bar.style.width="100%"; truck.style.left="90%"; truck.style.opacity="0";
        setTimeout(()=>{ truck.innerText="✅"; truck.style.opacity="1"; },500);
        title.innerText="Il est là ! 🚨"; desc.innerText="Descends vite chercher ton lit !";
        deliveryFinishTimer=null; deliveryStageTimer=null; expandDeliveryTracking(); deliveryInProgress=false; hideDeliveryMiniBubble(); document.getElementById('clientNav').style.display='none';
        backBtn.innerText="Retour à l'accueil"; backBtn.style.display="block"; let summaryBtn2=document.getElementById("trackingSummaryBtn"); if(summaryBtn2) summaryBtn2.style.display="block"; document.getElementById('ratingDiv').style.display="block";
        showGps.style.display="none"; showChat.style.display="none";
        document.getElementById('chatZone').style.display="none"; document.getElementById('gpsModal').style.display="none";
        if(window.etaInt) clearInterval(window.etaInt);
        if(currentDeliveryDriver) currentDeliveryDriver.status='En attente';
        if(currentCagnotteDeduction>0){ reglages.cagnotte-=currentCagnotteDeduction; reglages.cagnotteSpent=(reglages.cagnotteSpent||0)+currentCagnotteDeduction; }
        if(cart.some(c=>c.options.some(o=>o.name==="☁️ Coussin"&&o.price===0))) reglages.moisCoussinGratuit=new Date().getMonth();
        if(reglages.isPremium&&totalSansTip>0){
          let gain=(Math.random()*(5-2)+2).toFixed(2); reglages.cagnotte+=parseFloat(gain);
          document.getElementById('cashbackWon').innerText=gain; cashDiv.style.display="block";
          appliquerAvatarEtPremium(); appliquerThemeEtPremium();
        }
        let d3=new Date(); let ds=d3.toLocaleDateString('fr-FR')+" à "+d3.getHours()+"h"+(d3.getMinutes()<10?'0':'')+d3.getMinutes();
        reglages.historiqueCommandes.push({id:Date.now(),date:ds,prix:finalPrice,items:resumeItems,status:"Terminée"});
        mettreAJourHistorique(); reglages.caTotal+=Math.max(0,cutPatron); reglages.totalOrders++;
        addAdminActionLog("Commande terminée",Math.max(0,cutPatron));
        registerPromoUsageIfNeeded(); registerEasterPromoUsageIfNeeded();
        updateAdminStats(); cart=[]; promoActive=false; currentTip=0;
        document.querySelectorAll('.tip-btn').forEach(b=>b.classList.remove('selected'));
        document.getElementById('promoMessage').style.display="none"; document.getElementById('promoInput').value="";
        document.getElementById('useCagnotteCheck').checked=false;
        mettreAJourVitrine(); updateCart(); renderAdminDrivers(); saveAll();
      },totalDeliveryMs);
    });
  };
  const boot=()=>{ updateProfileHelpButton(); renderClientPromotions(); saveAll(); };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();

// =============================================
// V37 FINAL — verrouillages propres
// =============================================
(function(){
  // le ? est collé à l'avatar profil, pas au header
  window.updateProfileHelpButton=function(){
    const btn=document.getElementById('profileHelpBtn');
    if(!btn) return;
    const show=!!document.getElementById('profile')?.classList.contains('active') && !document.getElementById('helpPage')?.classList.contains('active');
    btn.classList.toggle('show',show);
  };
  const switchBeforeFinal=window.switchClientTab;
  window.switchClientTab=function(tabId,btn){
    switchBeforeFinal(tabId,btn);
    updateProfileHelpButton();
  };
  const openPageBeforeFinal=window.openClientPage;
  window.openClientPage=function(pageId){
    openPageBeforeFinal(pageId);
    updateProfileHelpButton();
    if(pageId==='walletPage' && typeof renderWalletPage==='function') renderWalletPage();
    if(pageId==='promotionsPage' && typeof renderClientPromotions==='function') renderClientPromotions();
  };
  // remplacer proprement les fonctions globales utilisées par openClientPage
  if(typeof window.renderWalletPage==='function') renderWalletPage=window.renderWalletPage;
  if(typeof window.renderClientPromotions==='function') renderClientPromotions=window.renderClientPromotions;
  
  // une promo reçue désactive le code manuel : pas de cumul
  const promoInput=document.getElementById('promoInput');
  window.claimFixedPromotion=function(id){
    ensureV36Data();
    reglages.claimedPromotionIds=[id];
    reglages.activeRewardPromo=id;
    promoActive=false;
    if(promoInput) promoInput.value='';
    const msg=document.getElementById('promoMessage');
    if(msg){msg.style.display='none';msg.innerText='';}
    saveAll();
    renderClientPromotions();
    updateCart();
    alert('Promotion reçue. Une seule réduction promotionnelle peut être active à la fois.');
  };
  document.getElementById('applyPromo').onclick=function(){
    normalizePromoConfig();
    const entered=document.getElementById('promoInput').value.trim().toUpperCase();
    if(!reglages.promoConfig.active) return alert('Aucun code promo actif pour le moment.');
    if(reglages.promoConfig.usageLimit<999 && (reglages.promoConfig.usageCount||0)>=reglages.promoConfig.usageLimit) return alert("Ce code promo a déjà atteint sa limite d'utilisation.");
    if(entered===reglages.promoConfig.code){
      reglages.activeRewardPromo=null;
      reglages.claimedPromotionIds=[];
      promoActive=true;
      updateCart();
      renderClientPromotions();
      const msg=document.getElementById('promoMessage');
      const disc=computePromoDiscount();
      if(disc>0){ msg.innerText=`Code appliqué : -${disc.toFixed(2)} €`; msg.style.display='block'; }
      else alert('Code valide, mais aucun matelas du panier ne correspond à cette promo.');
      return;
    }
    alert('Code invalide.');
  };
  // recalcul panier sans jamais empiler code promo + offre reçue
  const updateCartCleanBase = (typeof _v35UpdateCart==='function') ? _v35UpdateCart : window.updateCart;
  window.updateCart=function(){
    updateCartCleanBase();
    try{
      const old=document.getElementById('rewardPromoRow'); if(old) old.remove();
      const oldBanner=document.getElementById('rewardPromoBanner'); if(oldBanner) oldBanner.remove();
      if(promoActive) return; // code manuel prioritaire, aucune offre automatique en plus
      const disc=rewardPromoDiscount();
      if(disc>0){
        const dyn=document.getElementById('dynamicTaxesAndDiscounts');
        const p=getPromotionById(reglages.activeRewardPromo);
        const row=document.createElement('div');
        row.id='rewardPromoRow'; row.className='cartItem discount'; row.style.marginTop='10px';
        row.innerHTML=`<span>Offre reçue (${p?p.title:'Promotion'})</span><span>-${disc.toFixed(2)} €</span>`;
        if(dyn) dyn.appendChild(row);
        const totalEl=document.getElementById('totalPrice');
        if(totalEl) totalEl.textContent=Math.max(0,parseFloat(totalEl.textContent||'0')-disc).toFixed(2);
        const fact=document.getElementById('factureDetails');
        if(fact){const ban=document.createElement('div');ban.id='rewardPromoBanner';ban.className='auto-promo-banner';ban.textContent='Promotion reçue appliquée automatiquement. Les autres codes sont désactivés.';fact.parentElement.insertBefore(ban,fact);}
      }
    }catch(e){console.warn(e);}
  };
  const bootFinal=()=>{updateProfileHelpButton(); if(typeof renderWalletPage==='function') renderWalletPage(); if(typeof renderClientPromotions==='function') renderClientPromotions();};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bootFinal); else bootFinal();
})();

// =============================================
// V38 — corrections finales demandées
// =============================================
(function(){
  function v38Ensure(){
    if(typeof ensureV36Data==='function') ensureV36Data();
    if(!Array.isArray(reglages.adminVisiblePromoIds) || !reglages.adminVisiblePromoIds.length){
      reglages.adminVisiblePromoIds=['promo02','promo04','promo10'];
    }
    reglages.adminVisiblePromoIds=reglages.adminVisiblePromoIds.filter(id=>LAGO_PROMO_LIBRARY.some(p=>p.id===id)).slice(0,3);
    if(!Array.isArray(reglages.claimedPromotionIds)) reglages.claimedPromotionIds=[];
    if(!Array.isArray(reglages.favorites)) reglages.favorites=[];
    if(!Array.isArray(reglages.savedCards)) reglages.savedCards=[];
  }
  function v38VisiblePromos(){
    v38Ensure();
    return reglages.adminVisiblePromoIds.slice(0,3).map(id=>LAGO_PROMO_LIBRARY.find(p=>p.id===id)).filter(Boolean);
  }
  function v38UpdateBell(){
    const s=document.querySelector('#promoBellBtn span');
    if(s) s.textContent=String(v38VisiblePromos().length);
  }
  window.renderClientPromotions=function(){
    v38Ensure();
    const box=document.getElementById('clientPromoList'); if(!box) return;
    const activeId=reglages.activeRewardPromo;
    const list=v38VisiblePromos();
    box.innerHTML=list.map(p=>{
      const active=activeId===p.id;
      return `<div class="promo-clean-card"><div class="promo-clean-icon">${p.icon}</div><div class="promo-clean-main"><h4>${p.title}</h4><p>${p.desc}</p><p class="promo-expire">${p.expire} • Dès ${Number(p.min||0).toFixed(0)}€</p><p style="font-size:11px;color:var(--text-dim);margin-top:4px;">Une seule réduction active à la fois.</p></div><button class="${active?'claimed active-promo':''}" onclick="claimFixedPromotion('${p.id}')">${active?'Active':'Recevoir'}</button></div>`;
    }).join('') || '<div class="empty-clean">Aucune offre active.</div>';
    v38UpdateBell();
  };
  window.claimFixedPromotion=function(id){
    v38Ensure();
    reglages.claimedPromotionIds=[id];
    reglages.activeRewardPromo=id;
    promoActive=false;
    const inp=document.getElementById('promoInput'); if(inp) inp.value='';
    const msg=document.getElementById('promoMessage'); if(msg){msg.style.display='none';msg.innerText='';}
    saveAll(); renderClientPromotions(); updateCart();
    alert('Promotion reçue. Une seule réduction peut être active à la fois.');
  };
  window.renderAdminOffersPreview=function(){
    v38Ensure();
    const box=document.getElementById('adminOffersPreview'); if(!box) return;
    box.innerHTML=v38VisiblePromos().map(p=>`<span class="admin-offer-chip">${p.icon} ${p.title}</span>`).join('') || '<span class="admin-offer-chip">Aucune offre</span>';
  };
  window.openAdminOffersModal=function(){ v38Ensure(); document.getElementById('adminOffersModal')?.classList.add('active'); renderAdminOfferLibrary(); };
  window.closeAdminOffersModal=function(){ document.getElementById('adminOffersModal')?.classList.remove('active'); };
  window.toggleAdminOfferSelection=function(id,checked){
    v38Ensure();
    let ids=[...reglages.adminVisiblePromoIds];
    if(checked){
      if(!ids.includes(id)){
        if(ids.length>=3){ alert('Maximum 3 offres visibles dans la cloche.'); renderAdminOfferLibrary(); return; }
        ids.push(id);
      }
    }else ids=ids.filter(x=>x!==id);
    reglages.adminVisiblePromoIds=ids.slice(0,3);
    saveAll(); renderAdminOffersPreview(); renderClientPromotions(); renderAdminOfferLibrary();
  };
  window.renderAdminOfferLibrary=function(){
    v38Ensure();
    const wrap=document.getElementById('adminOffersLibrary'); if(!wrap) return;
    const query=(document.getElementById('adminOffersSearch')?.value||'').trim().toLowerCase();
    const selected=reglages.adminVisiblePromoIds;
    const count=selected.length;
    const rows=LAGO_PROMO_LIBRARY.filter(p=>!query || (`${p.title} ${p.desc}`.toLowerCase().includes(query))).map(p=>{
      const checked=selected.includes(p.id);
      const disabled=!checked && count>=3;
      return `<label class="admin-offer-row ${disabled?'disabled':''}"><input type="checkbox" value="${p.id}" ${checked?'checked':''} ${disabled?'disabled':''} onchange="toggleAdminOfferSelection('${p.id}',this.checked)"><div><h4>${p.icon} ${p.title}</h4><p>${p.desc}</p><p>Dès ${Number(p.min||0).toFixed(0)}€ • -${p.percent}% ${p.target?`• ${p.target}`:'• Tous les lits'}</p></div></label>`;
    }).join('');
    wrap.innerHTML=`<div class="admin-offer-limit">${count}/3 offres sélectionnées</div>${rows}`;
  };
  window.saveAdminOffersSelection=function(){
    v38Ensure(); saveAll(); renderAdminOffersPreview(); renderClientPromotions(); v38UpdateBell(); closeAdminOffersModal(); alert('Offres visibles mises à jour.');
  };

  // Wallet : cartes uniquement, pas PayPal ici, miniatures cliquables pour Lago+
  window.openWalletAddCard=function(){
    if((reglages.savedCards||[]).length>=3){
      const ok=confirm('Vous avez déjà 3 cartes enregistrées. Voulez-vous remplacer une carte ?');
      if(!ok) return;
    }
    openPaymentModal(0,function(){ renderWalletPage(); });
    setTimeout(()=>{ const chk=document.getElementById('saveCardCheck'); if(chk) chk.checked=true; },80);
  };
  window.renderWalletPage=function(){
    v38Ensure();
    const box=document.getElementById('walletPageContent'); if(!box) return;
    const cards=reglages.savedCards||[];
    let html=`<div class="wallet-v38-hero"><h4>Wallet Lago</h4><p>Vos cartes sont rangées ici. Les membres Lago+ peuvent toucher une miniature pour modifier son design.</p></div>`;
    if(cards.length){
      html+=`<div class="wallet-v38-list">`+cards.map((c,i)=>`<div class="wallet-v38-card"><div class="wallet-v38-card-main">${savedCardMiniHtml(c).replace('<div class="saved-card-mini',`<div class="saved-card-mini" onclick="openSavedCardDesignPicker(${i},event)" title="${reglages.isPremium?'Changer le design':'Réservé Lago+'}"`)}<div class="wallet-v38-meta"><h4>${c.type} •••• ${c.last4}</h4><p>${c.holder}</p><p>Expire ${c.expiry}${c.design?` • ${getCardDesignName(c.design)}`:''}</p></div></div><div class="wallet-v38-actions"><button onclick="openSavedCardDesignPicker(${i},event)">${reglages.isPremium?'Modifier la couleur':'Couleur Lago+'}</button><button class="secondary" onclick="deleteSavedCard(${i});renderWalletPage();">Supprimer</button></div></div>`).join('')+`</div>`;
    } else html+=`<div class="wallet-v38-empty">💳 Aucune carte enregistrée.</div>`;
    html+=`<button class="wallet-v38-add" onclick="openWalletAddCard()">＋ Ajouter une carte</button>`;
    box.innerHTML=html;
  };
  const oldSelectCardDesign=window.selectCardDesign;
  window.selectCardDesign=function(id){ oldSelectCardDesign(id); if(document.getElementById('walletPage')?.classList.contains('active')) renderWalletPage(); };

  // Limite à 3 cartes + remplacement ciblé
  window.processCardPayment=function(){
    if(selectedSavedCardIndex>=0&&reglages.savedCards&&reglages.savedCards[selectedSavedCardIndex]){
      currentCardDesign=reglages.savedCards[selectedSavedCardIndex].design||currentCardDesign||'classic';
      lancerTraitementPaiement(); return;
    }
    let num=document.getElementById('cardNumber').value.replace(/\s/g,'');
    let holder=document.getElementById('cardHolder').value.trim();
    let exp=document.getElementById('cardExpiry').value;
    let cvv=document.getElementById('cardCVV').value;
    if(num.length<16) return shakeInput('cardNumber','Numéro de carte invalide (16 chiffres)');
    if(!holder) return shakeInput('cardHolder','Entrez le nom du titulaire');
    if(exp.length<5) return shakeInput('cardExpiry',"Date d'expiration invalide (MM/AA)");
    if(cvv.length<3) return shakeInput('cardCVV','Code CVV invalide (3 chiffres)');
    if(document.getElementById('saveCardCheck').checked){
      if(!reglages.savedCards) reglages.savedCards=[];
      let type=num.startsWith('4')?'Visa':(num.startsWith('5')?'Mastercard':'CB');
      let newCard={type,last4:num.slice(-4),holder:holder.toUpperCase(),expiry:exp,design:normalizeCardDesignId(currentCardDesign)};
      if(reglages.savedCards.length>=3){
        let list=reglages.savedCards.map((c,i)=>`${i+1}. ${c.type} •••• ${c.last4}`).join('\n');
        let choice=prompt(`Vous avez déjà 3 cartes. Quelle carte remplacer ?\n\n${list}\n\nTapez 1, 2 ou 3. Annuler = ne pas enregistrer.`,'1');
        let idx=Number(choice)-1;
        if(choice!==null && idx>=0 && idx<3) reglages.savedCards[idx]=newCard;
      }else reglages.savedCards.push(newCard);
      saveAll();
    }
    lancerTraitementPaiement();
  };

  // Aide poussée : chat agrandi, choix commande, remboursement cagnotte + impact CA
  window.toggleHelpChatExpand=function(){
    const card=document.querySelector('.help-chat-card'); if(!card) return;
    card.classList.toggle('expanded');
    const btn=card.querySelector('.help-expand-btn'); if(btn) btn.textContent=card.classList.contains('expanded')?'↙ Réduire':'↗ Agrandir';
  };
  function safeText(s){ return String(s||'').replace(/[<>&]/g,m=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[m])); }
  window.appendHelpRich=function(html){
    const box=document.getElementById('helpChatMessages'); if(!box) return;
    const row=document.createElement('div'); row.className='help-chat-row bot';
    row.innerHTML=`<div class="help-chat-bubble">${html}</div>`;
    box.appendChild(row); box.scrollTop=box.scrollHeight;
  };
  const oldAppendHelp=window.appendHelpChatMessage;
  function bot(msg){ if(typeof oldAppendHelp==='function') oldAppendHelp('bot',msg); else appendHelpRich(safeText(msg)); }
  function userMsg(msg){ if(typeof oldAppendHelp==='function') oldAppendHelp('user',msg); else { const box=document.getElementById('helpChatMessages'); const row=document.createElement('div'); row.className='help-chat-row user'; row.innerHTML=`<div class="help-chat-bubble">${safeText(msg)}</div>`; box.appendChild(row); } }
  window.openHelpTopic=function(topic){
    if(typeof initHelpChat==='function') initHelpChat();
    if(topic==='livraison'){
      userMsg('J’ai un problème avec une livraison.');
      const hist=(reglages.historiqueCommandes||[]).slice().reverse();
      if(!hist.length){ bot('Je ne trouve aucune commande sur ce compte. Dès qu’une commande sera terminée ou en cours, vous pourrez ouvrir un dossier depuis ici.'); return; }
      appendHelpRich(`Sélectionnez la commande concernée :<div class="help-choice-card">${hist.slice(0,6).map(h=>`<button onclick="selectHelpRefundOrder(${h.id})">🧾 ${safeText(h.items||'Commande Lago')}<br><small>${safeText(h.date||'')} • ${Number(h.prix||0).toFixed(2)}€</small></button>`).join('')}</div>`);
      return;
    }
    if(topic==='paiement') { userMsg('J’ai une question sur mon paiement.'); bot('Pour le paiement, ouvrez Wallet pour gérer vos cartes. Une carte enregistrée peut être supprimée ou personnalisée avec Lago+. Pendant le paiement, vous pouvez utiliser une carte sauvegardée ou en saisir une nouvelle.'); return; }
    if(topic==='premium') { userMsg('J’ai une question sur Lago+.'); bot('Lago+ donne -15% sur les lits, livraison offerte sous 3 km, cashback cagnotte, thèmes premium et designs de cartes. La cagnotte s’utilise dans le panier lorsque le compte Lago+ est actif.'); return; }
    if(topic==='contact') { userMsg('Je souhaite contacter Lago.'); bot('Vous pouvez contacter le service Lago au 06 19 72 04 74. Un conseiller vous demandera votre email client et la commande concernée.'); return; }
  };
  window.selectHelpRefundOrder=function(orderId){
    const order=(reglages.historiqueCommandes||[]).find(o=>String(o.id)===String(orderId)); if(!order) return;
    userMsg(`Commande sélectionnée : ${order.items||'Commande Lago'}`);
    appendHelpRich(`Merci. Quel est le problème ?<div class="help-choice-card"><button onclick="applyHelpRefund(${order.id},'retard')">Le livreur était en retard</button><button onclick="applyHelpRefund(${order.id},'etat')">Le matelas avait un problème</button><button onclick="applyHelpRefund(${order.id},'commande')">Il manquait un élément</button></div><div class="help-photo-row"><div class="help-photo-fake">📷</div><div class="help-photo-fake">🛏️</div><div class="help-photo-fake">🧾</div></div>`);
  };
  window.applyHelpRefund=function(orderId,reason){
    const order=(reglages.historiqueCommandes||[]).find(o=>String(o.id)===String(orderId)); if(!order) return;
    if(order.refunded){ bot('Cette commande a déjà reçu un geste commercial.'); return; }
    const amount=Math.max(2,Math.min(15,Math.round((Number(order.prix||0)*0.25)*100)/100));
    order.refunded=true; order.refundReason=reason; order.refundAmount=amount;
    reglages.cagnotte=(Number(reglages.cagnotte)||0)+amount;
    reglages.caTotal=Math.max(0,(Number(reglages.caTotal)||0)-amount);
    addAdminActionLog(`Remboursement client (${reason})`,-amount);
    updateAdminStats(); renderAdminUsers(); appliquerAvatarEtPremium(); saveAll();
    if(reglages.isPremium) bot(`Dossier accepté. Un geste commercial de ${amount.toFixed(2)}€ vient d’être ajouté à votre cagnotte Lago+.`);
    else bot(`Dossier accepté. ${amount.toFixed(2)}€ sont placés dans votre cagnotte, mais elle sera utilisable après déblocage de Lago+.`);
  };
  window.getHelpBotAnswer=function(text){
    const t=(text||'').toLowerCase();
    if(t.includes('cagnotte')) return 'La cagnotte apparaît dans votre espace Lago+. Elle peut servir dans le panier quand un solde est disponible. Sans Lago+, elle peut être créditée mais reste verrouillée.';
    if(t.includes('rembours')) return 'Pour un remboursement, choisissez “Problème avec une livraison”, sélectionnez la commande concernée, puis indiquez le motif. Si le dossier est accepté, un avoir est crédité dans la cagnotte.';
    if(t.includes('lago+')||t.includes('premium')) return 'Lago+ inclut -15% sur les lits, livraison offerte à proximité, cagnotte cashback, thèmes premium, avatars et designs de cartes. L’abonnement est annuel.';
    if(t.includes('contact')||t.includes('num')) return 'Le service Lago est joignable au 06 19 72 04 74. Préparez votre email client et la commande concernée.';
    if(t.includes('carte')||t.includes('wallet')) return 'Le Wallet sert uniquement à gérer vos cartes enregistrées. Avec Lago+, touchez une carte pour modifier son design.';
    return 'Je comprends. Je peux vous guider sur une livraison, un remboursement, Lago+, la cagnotte ou le Wallet. Donnez-moi simplement le sujet.';
  };
  window.sendHelpChat=function(){
    if(typeof initHelpChat==='function') initHelpChat();
    const input=document.getElementById('helpChatInput'); if(!input) return;
    const value=input.value.trim(); if(!value) return;
    input.value=''; userMsg(value); setTimeout(()=>bot(getHelpBotAnswer(value)),220);
  };

  // Correction achat Lago+ : visible côté patron + événements réalistes
  const oldConfirmVip=window.confirmVipPurchase;
  window.confirmVipPurchase=function(){
    closeVipModal(); document.getElementById('referralAdModal').classList.remove('active');
    openPaymentModal(59.99,()=>{
      reglages.isPremium=true;
      if(window.currentUser){ window.currentUser.isVip=true; window.currentUser.vipSource='purchased'; }
      let u=window.currentUser?fakeUsers.find(x=>x.email===window.currentUser.email):null;
      if(u){ u.isVip=true; u.vipSource='purchased'; }
      let bonus=15;
      if(reglages.referrals&&reglages.referrals.length===3&&!reglages.referralClaimed){ bonus+=15; reglages.referralClaimed=true; }
      reglages.cagnotte+=bonus; reglages.cagnotteSpent=0; reglages.caTotal+=59.99;
      addAdminActionLog('Achat Lago+',59.99);
      appliquerAvatarEtPremium(); appliquerThemeEtPremium(); mettreAJourVitrine(); updateCart(); updateAdminStats(); renderReferrals(); renderAdminUsers(); saveAll();
      alert(`Bienvenue dans le club VIP Lago+ 👑 ! ${bonus}€ ajoutés à ta cagnotte !`);
    });
  };
  function simulateVipOrRefund(){
    if(!fakeUsers || fakeUsers.length<5) return;
    if(Math.random()<0.65){
      const candidates=fakeUsers.filter(u=>!u.isVip && !u.banni);
      if(candidates.length){
        const u=candidates[Math.floor(Math.random()*candidates.length)];
        u.isVip=true; u.vipSource='purchased'; u.cagnotte=(u.cagnotte||0)+15;
        reglages.caTotal=(Number(reglages.caTotal)||0)+59.99;
        addAdminActionLog(`Achat Lago+ — ${u.email}`,59.99);
      }
    }else{
      const candidates=fakeUsers.filter(u=>(u.historique||[]).length && !u.banni);
      if(candidates.length){
        const u=candidates[Math.floor(Math.random()*candidates.length)];
        const refund=Math.round((Math.random()*8+2)*100)/100;
        u.cagnotte=(u.cagnotte||0)+refund;
        reglages.caTotal=Math.max(0,(Number(reglages.caTotal)||0)-refund);
        addAdminActionLog(`Remboursement client — ${u.email}`,-refund);
      }
    }
    updateAdminStats(); renderAdminUsers(); saveAll();
  }
  if(!window.v38BusinessEventsStarted){ window.v38BusinessEventsStarted=true; setInterval(simulateVipOrRefund,65000); }

  const boot=()=>{ v38Ensure(); renderClientPromotions(); renderAdminOffersPreview(); v38UpdateBell(); if(typeof updateProfileHelpButton==='function') updateProfileHelpButton(); saveAll(); };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();

// V38.1 — ouvrir directement le formulaire nouvelle carte depuis Wallet
(function(){
  window.openWalletAddCard=function(){
    if((reglages.savedCards||[]).length>=3){
      const ok=confirm('Vous avez déjà 3 cartes enregistrées. Voulez-vous remplacer une carte ?');
      if(!ok) return;
    }
    openPaymentModal(0,function(){ renderWalletPage(); });
    setTimeout(()=>{
      selectedSavedCardIndex=-1;
      if(typeof showNewCardForm==='function') showNewCardForm(true);
      if(typeof renderSavedCardsInPayment==='function') renderSavedCardsInPayment();
      const chk=document.getElementById('saveCardCheck'); if(chk) chk.checked=true;
    },120);
  };
})();

// V38.2 — Wallet miniature carte corrigée
(function(){
  function clickableMini(c,i){
    return savedCardMiniHtml(c).replace('<div class="saved-card-mini', `<div onclick="openSavedCardDesignPicker(${i},event)" title="${reglages.isPremium?'Changer le design':'Réservé Lago+'}" class="saved-card-mini`);
  }
  window.renderWalletPage=function(){
    if(typeof ensureV36Data==='function') ensureV36Data();
    if(!Array.isArray(reglages.savedCards)) reglages.savedCards=[];
    const box=document.getElementById('walletPageContent'); if(!box) return;
    const cards=reglages.savedCards;
    let html=`<div class="wallet-v38-hero"><h4>Wallet Lago</h4><p>Vos cartes sont rangées ici. Les membres Lago+ peuvent toucher une miniature pour modifier son design.</p></div>`;
    if(cards.length){
      html+=`<div class="wallet-v38-list">`+cards.map((c,i)=>`<div class="wallet-v38-card"><div class="wallet-v38-card-main">${clickableMini(c,i)}<div class="wallet-v38-meta"><h4>${c.type} •••• ${c.last4}</h4><p>${c.holder}</p><p>Expire ${c.expiry}${c.design?` • ${getCardDesignName(c.design)}`:''}</p></div></div><div class="wallet-v38-actions"><button onclick="openSavedCardDesignPicker(${i},event)">${reglages.isPremium?'Modifier la couleur':'Couleur Lago+'}</button><button class="secondary" onclick="deleteSavedCard(${i});renderWalletPage();">Supprimer</button></div></div>`).join('')+`</div>`;
    } else html+=`<div class="wallet-v38-empty">💳 Aucune carte enregistrée.</div>`;
    html+=`<button class="wallet-v38-add" onclick="openWalletAddCard()">＋ Ajouter une carte</button>`;
    box.innerHTML=html;
  };
})();

// =============================================
// V39 — corrections validées (sticky cartes, wallet, promos utilisées, admin modal)
// =============================================
(function(){
  function v39Ensure(){
    if(typeof ensureV36Data==='function') ensureV36Data();
    if(!Array.isArray(reglages.adminVisiblePromoIds)) reglages.adminVisiblePromoIds=[];
    if(!Array.isArray(reglages.usedPromotionIds)) reglages.usedPromotionIds=[];
    if(!Array.isArray(reglages.claimedPromotionIds)) reglages.claimedPromotionIds=[];
    if(reglages.adminVisiblePromoIds.length>3) reglages.adminVisiblePromoIds=reglages.adminVisiblePromoIds.slice(0,3);
  }
  function v39VisiblePromos(){
    v39Ensure();
    const lib=(typeof LAGO_PROMO_LIBRARY!=='undefined')?LAGO_PROMO_LIBRARY:[];
    return reglages.adminVisiblePromoIds.slice(0,3).map(id=>lib.find(p=>p.id===id)).filter(Boolean);
  }
  function v39PromoById(id){
    const lib=(typeof LAGO_PROMO_LIBRARY!=='undefined')?LAGO_PROMO_LIBRARY:[];
    return lib.find(p=>p.id===id)||null;
  }
  function v39UpdateBell(){
    const s=document.querySelector('#promoBellBtn span');
    if(s) s.textContent=String(v39VisiblePromos().length);
  }

  // Bouton ? bien placé : uniquement dans Profil, à droite de l'avatar.
  window.updateProfileHelpButton=function(){
    const btn=document.getElementById('profileHelpBtn');
    if(!btn) return;
    const profileActive=document.getElementById('profile')?.classList.contains('active');
    const helpOpen=document.getElementById('helpPage')?.classList.contains('active');
    btn.style.display=(profileActive && !helpOpen)?'flex':'none';
  };
  const v39Switch=window.switchClientTab;
  window.switchClientTab=function(tabId,btn){
    document.getElementById('adminOffersModal')?.classList.remove('active');
    v39Switch(tabId,btn);
    updateProfileHelpButton();
  };
  const v39OpenPage=window.openClientPage;
  window.openClientPage=function(pageId){
    if(pageId!=='helpPage') document.getElementById('adminOffersModal')?.classList.remove('active');
    v39OpenPage(pageId);
    updateProfileHelpButton();
  };

  // Designs carte : tous les designs sauvegardés peuvent être modifiés depuis Wallet.
  window.openCardDesignPicker=function(e){
    if(e) e.stopPropagation();
    editingSavedCardIndex=-1;
    renderCardDesignPicker();
    document.getElementById('cardDesignModal').classList.add('show');
  };
  window.openSavedCardDesignPicker=function(index,e){
    if(e) e.stopPropagation();
    editingSavedCardIndex=index;
    if(reglages.savedCards&&reglages.savedCards[index]) currentCardDesign=normalizeCardDesignId(reglages.savedCards[index].design);
    renderCardDesignPicker();
    document.getElementById('cardDesignModal').classList.add('show');
  };
  const v39SelectCardDesign=window.selectCardDesign;
  window.selectCardDesign=function(id){
    v39SelectCardDesign(id);
    if(document.getElementById('walletPage')?.classList.contains('active')) renderWalletPage();
  };

  // Wallet V39 : cartes uniquement, sans bloc PayPal, plus clair, miniatures cliquables.
  function v39Mini(c,i){
    return savedCardMiniHtml(c).replace('<div class="saved-card-mini', `<div onclick="openSavedCardDesignPicker(${i},event)" title="Modifier le design" class="saved-card-mini`);
  }
  window.renderWalletPage=function(){
    v39Ensure();
    if(!Array.isArray(reglages.savedCards)) reglages.savedCards=[];
    const box=document.getElementById('walletPageContent'); if(!box) return;
    const cards=reglages.savedCards;
    let html=`<div class="wallet-v39-header"><h4>Wallet Lago</h4><p>Vos cartes enregistrées. Touchez une mini-carte pour modifier son design.</p></div>`;
    if(cards.length){
      html+=`<div class="wallet-v39-list">`+cards.map((c,i)=>`<div class="wallet-v39-card"><div class="wallet-v39-card-main">${v39Mini(c,i)}<div class="wallet-v39-meta"><h4>${c.type||'CB'} •••• ${c.last4||'0000'}</h4><p>${c.holder||'CLIENT LAGO'}</p><p>Expire ${c.expiry||'MM/AA'}${c.design?` • ${getCardDesignName(c.design)}`:''}</p></div></div><div class="wallet-v39-actions"><button onclick="openSavedCardDesignPicker(${i},event)">Modifier le design</button><button class="secondary" onclick="deleteSavedCard(${i});renderWalletPage();">Supprimer</button></div></div>`).join('')+`</div>`;
    }else{
      html+=`<div class="wallet-v39-empty">💳 Aucune carte enregistrée.</div>`;
    }
    html+=`<button class="wallet-v39-add" onclick="openWalletAddCard()">＋ Ajouter une carte</button>`;
    box.innerHTML=html;
  };
  window.openWalletAddCard=function(){
    if((reglages.savedCards||[]).length>=3){
      const ok=confirm('Vous avez déjà 3 cartes enregistrées. Veuillez remplacer une carte pour en ajouter une nouvelle.');
      if(!ok) return;
    }
    openPaymentModal(0,function(){ renderWalletPage(); });
    setTimeout(()=>{
      selectedSavedCardIndex=-1;
      if(typeof showNewCardForm==='function') showNewCardForm(true);
      if(typeof renderSavedCardsInPayment==='function') renderSavedCardsInPayment();
      const chk=document.getElementById('saveCardCheck'); if(chk) chk.checked=true;
    },120);
  };

  // Limite 3 cartes : remplacer une carte si déjà 3.
  window.processCardPayment=function(){
    if(selectedSavedCardIndex>=0&&reglages.savedCards&&reglages.savedCards[selectedSavedCardIndex]){
      currentCardDesign=reglages.savedCards[selectedSavedCardIndex].design||currentCardDesign||'classic';
      lancerTraitementPaiement(); return;
    }
    let num=document.getElementById('cardNumber').value.replace(/\s/g,'');
    let holder=document.getElementById('cardHolder').value.trim();
    let exp=document.getElementById('cardExpiry').value;
    let cvv=document.getElementById('cardCVV').value;
    if(num.length<16) return shakeInput('cardNumber','Numéro de carte invalide (16 chiffres)');
    if(!holder) return shakeInput('cardHolder','Entrez le nom du titulaire');
    if(exp.length<5) return shakeInput('cardExpiry',"Date d'expiration invalide (MM/AA)");
    if(cvv.length<3) return shakeInput('cardCVV','Code CVV invalide (3 chiffres)');
    if(document.getElementById('saveCardCheck').checked){
      if(!Array.isArray(reglages.savedCards)) reglages.savedCards=[];
      let type=num.startsWith('4')?'Visa':(num.startsWith('5')?'Mastercard':'CB');
      let newCard={type,last4:num.slice(-4),holder:holder.toUpperCase(),expiry:exp,design:normalizeCardDesignId(currentCardDesign)};
      if(reglages.savedCards.length>=3){
        let list=reglages.savedCards.map((c,i)=>`${i+1}. ${c.type} •••• ${c.last4}`).join('\n');
        let choice=prompt(`Vous avez déjà 3 cartes. Veuillez choisir la carte à remplacer :\n\n${list}\n\nTapez 1, 2 ou 3.`, '1');
        let idx=Number(choice)-1;
        if(choice===null) return lancerTraitementPaiement();
        if(idx>=0 && idx<3) reglages.savedCards[idx]=newCard;
        else return alert('Choix invalide. Carte non enregistrée.');
      }else reglages.savedCards.push(newCard);
      saveAll();
    }
    lancerTraitementPaiement();
  };

  // Promotions : 3 max, une seule active, et affichage Déjà utilisé.
  window.renderClientPromotions=function(){
    v39Ensure();
    const box=document.getElementById('clientPromoList'); if(!box) return;
    const activeId=reglages.activeRewardPromo;
    const used=reglages.usedPromotionIds||[];
    const list=v39VisiblePromos();
    box.innerHTML=list.map(p=>{
      const isActive=activeId===p.id;
      const isUsed=used.includes(p.id);
      const label=isUsed?'Déjà utilisé':(isActive?'Active':'Recevoir');
      const disabled=isUsed?'disabled':'';
      return `<div class="promo-clean-card"><div class="promo-clean-icon">${p.icon}</div><div class="promo-clean-main"><h4>${p.title}</h4><p>${p.desc}</p><p class="promo-expire">${p.expire} • Dès ${Number(p.min||0).toFixed(0)}€</p><p style="font-size:11px;color:var(--text-dim);margin-top:4px;">Une seule réduction active à la fois.</p></div><button ${disabled} class="${isUsed?'used-promo':(isActive?'claimed active-promo':'')}" onclick="claimFixedPromotion('${p.id}')">${label}</button></div>`;
    }).join('') || '<div class="empty-clean">Aucune offre active.</div>';
    v39UpdateBell();
  };
  window.claimFixedPromotion=function(id){
    v39Ensure();
    if((reglages.usedPromotionIds||[]).includes(id)) return alert('Cette offre a déjà été utilisée.');
    reglages.claimedPromotionIds=[id];
    reglages.activeRewardPromo=id;
    promoActive=false;
    const inp=document.getElementById('promoInput'); if(inp) inp.value='';
    const msg=document.getElementById('promoMessage'); if(msg){msg.style.display='none';msg.innerText='';}
    saveAll(); renderClientPromotions(); updateCart();
    alert('Offre reçue. Une seule réduction peut être active à la fois.');
  };
  const oldOpenPaymentV39=window.openPaymentModal;
  window.openPaymentModal=function(amount,cb){
    oldOpenPaymentV39(amount,function(){
      const id=reglages.activeRewardPromo;
      let disc=0;
      try{ disc=typeof rewardPromoDiscount==='function'?rewardPromoDiscount():0; }catch(_e){}
      if(id && disc>0){
        if(!Array.isArray(reglages.usedPromotionIds)) reglages.usedPromotionIds=[];
        if(!reglages.usedPromotionIds.includes(id)) reglages.usedPromotionIds.push(id);
        reglages.claimedPromotionIds=[];
        reglages.activeRewardPromo=null;
      }
      if(typeof cb==='function') cb();
      saveAll();
    });
  };
  const applyBtn=document.getElementById('applyPromo');
  if(applyBtn){
    const oldApply=applyBtn.onclick;
    applyBtn.onclick=function(){
      reglages.activeRewardPromo=null;
      reglages.claimedPromotionIds=[];
      if(typeof renderClientPromotions==='function') renderClientPromotions();
      if(typeof oldApply==='function') oldApply();
    };
  }
  const oldUpdateCartV39=window.updateCart;
  window.updateCart=function(){
    oldUpdateCartV39();
    const ban=document.getElementById('rewardPromoBanner');
    if(ban) ban.remove();
  };

  // Offres patron : modal global, reste côté patron, max 3.
  window.openAdminOffersModal=function(){
    v39Ensure();
    const modal=document.getElementById('adminOffersModal');
    if(modal && modal.parentElement!==document.body) document.body.appendChild(modal);
    modal?.classList.add('active');
    renderAdminOfferLibrary();
  };
  window.closeAdminOffersModal=function(){ document.getElementById('adminOffersModal')?.classList.remove('active'); };
  window.toggleAdminOfferSelection=function(id,checked){
    v39Ensure();
    let ids=[...reglages.adminVisiblePromoIds];
    if(checked){
      if(!ids.includes(id)){
        if(ids.length>=3){ alert('Maximum 3 offres visibles dans la cloche.'); renderAdminOfferLibrary(); return; }
        ids.push(id);
      }
    }else ids=ids.filter(x=>x!==id);
    reglages.adminVisiblePromoIds=ids.slice(0,3);
    saveAll(); renderAdminOffersPreview(); renderClientPromotions(); renderAdminOfferLibrary(); v39UpdateBell();
  };
  window.renderAdminOfferLibrary=function(){
    v39Ensure();
    const wrap=document.getElementById('adminOffersLibrary'); if(!wrap) return;
    const lib=(typeof LAGO_PROMO_LIBRARY!=='undefined')?LAGO_PROMO_LIBRARY:[];
    const query=(document.getElementById('adminOffersSearch')?.value||'').trim().toLowerCase();
    const selected=reglages.adminVisiblePromoIds;
    const count=selected.length;
    const rows=lib.filter(p=>!query || (`${p.title} ${p.desc}`.toLowerCase().includes(query))).map(p=>{
      const checked=selected.includes(p.id);
      const disabled=!checked && count>=3;
      return `<label class="admin-offer-row ${disabled?'disabled':''}"><input type="checkbox" value="${p.id}" ${checked?'checked':''} ${disabled?'disabled':''} onchange="toggleAdminOfferSelection('${p.id}',this.checked)"><div><h4>${p.icon} ${p.title}</h4><p>${p.desc}</p><p>Dès ${Number(p.min||0).toFixed(0)}€ • -${p.percent}% ${p.target?`• ${p.target}`:'• Tous les lits'}</p></div></label>`;
    }).join('');
    wrap.innerHTML=`<div class="admin-offer-limit">${count}/3 offres sélectionnées</div>${rows}`;
  };
  window.renderAdminOffersPreview=function(){
    v39Ensure();
    const box=document.getElementById('adminOffersPreview'); if(!box) return;
    box.innerHTML=v39VisiblePromos().map(p=>`<span class="admin-offer-chip">${p.icon} ${p.title}</span>`).join('') || '<span class="admin-offer-chip">Aucune offre</span>';
  };
  window.saveAdminOffersSelection=function(){
    v39Ensure(); saveAll(); renderAdminOffersPreview(); renderClientPromotions(); v39UpdateBell(); closeAdminOffersModal(); alert('Offres visibles mises à jour.');
  };

  const boot=()=>{
    v39Ensure();
    // Nettoyage du doublon éventuel dans le DOM.
    const helps=[...document.querySelectorAll('#profileHelpBtn')];
    helps.slice(1).forEach(el=>el.remove());
    const modal=document.getElementById('adminOffersModal'); if(modal && modal.parentElement!==document.body) document.body.appendChild(modal);
    renderClientPromotions(); renderAdminOffersPreview(); v39UpdateBell(); updateProfileHelpButton(); saveAll();
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();


// =============================================
// V41 — bouton aide fixe, ajout carte Wallet sans paiement, historique CA
// =============================================
(function(){
  function forceProfileHelpVisible(){
    const btn=document.getElementById('profileHelpBtn');
    const profile=document.getElementById('profile');
    if(!btn||!profile) return;
    btn.style.display=profile.classList.contains('active')?'flex':'none';
    btn.style.position='absolute';
    btn.style.top='42px';
    btn.style.right='34px';
    btn.style.left='auto';
    btn.style.zIndex='30';
  }
  const _v41Switch=window.switchClientTab;
  window.switchClientTab=function(tabId,btn){
    _v41Switch(tabId,btn);
    setTimeout(forceProfileHelpVisible,20);
    setTimeout(forceProfileHelpVisible,180);
  };
  const _v41OpenClientPage=window.openClientPage;
  window.openClientPage=function(pageId){
    _v41OpenClientPage(pageId);
    setTimeout(forceProfileHelpVisible,20);
  };
  const _v41CloseClientPage=window.closeClientPageTo;
  window.closeClientPageTo=function(tab){
    _v41CloseClientPage(tab);
    setTimeout(forceProfileHelpVisible,20);
  };

  function validateCardFields(){
    const num=(document.getElementById('cardNumber')?.value||'').replace(/\s/g,'');
    const holder=(document.getElementById('cardHolder')?.value||'').trim();
    const exp=document.getElementById('cardExpiry')?.value||'';
    const cvv=document.getElementById('cardCVV')?.value||'';
    if(num.length<16){ shakeInput('cardNumber','Numéro de carte invalide (16 chiffres)'); return null; }
    if(!holder){ shakeInput('cardHolder','Entrez le nom du titulaire'); return null; }
    if(exp.length<5){ shakeInput('cardExpiry',"Date d'expiration invalide (MM/AA)"); return null; }
    if(cvv.length<3){ shakeInput('cardCVV','Code CVV invalide (3 chiffres)'); return null; }
    const type=num.startsWith('4')?'Visa':(num.startsWith('5')?'Mastercard':'CB');
    return {type,last4:num.slice(-4),holder:holder.toUpperCase(),expiry:exp,design:normalizeCardDesignId(currentCardDesign)};
  }
  function addOrReplaceWalletCard(newCard){
    if(!Array.isArray(reglages.savedCards)) reglages.savedCards=[];
    if(reglages.savedCards.length>=3){
      const list=reglages.savedCards.map((c,i)=>`${i+1}. ${c.type} •••• ${c.last4}`).join('\n');
      const choice=prompt(`Vous avez déjà 3 cartes enregistrées.\nVeuillez choisir la carte à remplacer :\n\n${list}\n\nTapez 1, 2 ou 3.`, '1');
      if(choice===null) return false;
      const idx=Number(choice)-1;
      if(idx<0 || idx>2){ alert('Choix invalide. Carte non enregistrée.'); return false; }
      reglages.savedCards[idx]=newCard;
    }else reglages.savedCards.push(newCard);
    saveAll();
    return true;
  }
  const _v41OpenPaymentModal=window.openPaymentModal;
  window.openPaymentModal=function(amount,cb){
    _v41OpenPaymentModal(amount,cb);
    const overlay=document.getElementById('paymentOverlay');
    if(!overlay) return;
    overlay.dataset.mode = Number(amount)===0 ? 'add-card' : 'payment';
    const title=document.querySelector('.pay-title');
    const cardBtn=document.getElementById('cardPayBtn');
    const payAmount=document.getElementById('payAmountDisplay');
    if(Number(amount)===0){
      if(title) title.innerText='Ajouter une carte';
      if(payAmount) payAmount.innerText='';
      if(cardBtn) cardBtn.innerHTML='＋ Ajouter la carte';
      selectedSavedCardIndex=-1;
      showingNewCardForm=true;
      const save=document.getElementById('saveCardCheck'); if(save) save.checked=true;
      showNewCardForm(true);
      renderSavedCardsInPayment();
    }else{
      if(title) title.innerText='Finaliser la commande';
      if(cardBtn) cardBtn.innerHTML='🔒 Payer <span id="cardPayAmount">'+Number(amount).toFixed(2)+'</span> €';
      if(payAmount) payAmount.style.display='';
    }
  };
  const _v41ClosePayment=window.closePayment;
  window.closePayment=function(){
    const overlay=document.getElementById('paymentOverlay');
    if(overlay) delete overlay.dataset.mode;
    _v41ClosePayment();
  };
  const _v41ProcessCard=window.processCardPayment;
  window.processCardPayment=function(){
    const overlay=document.getElementById('paymentOverlay');
    if(overlay && overlay.dataset.mode==='add-card'){
      const card=validateCardFields();
      if(!card) return;
      if(!addOrReplaceWalletCard(card)) return;
      closePayment();
      if(typeof renderWalletPage==='function') renderWalletPage();
      alert('Carte ajoutée au Wallet.');
      if(pendingPaymentCallback){ pendingPaymentCallback(); pendingPaymentCallback=null; }
      return;
    }
    _v41ProcessCard();
  };
  // Wallet : boutons clairs et mini-carte cliquable pour modifier le design.
  window.renderWalletPage=function(){
    const box=document.getElementById('walletPageContent'); if(!box) return;
    if(!Array.isArray(reglages.savedCards)) reglages.savedCards=[];
    let html='<div class="wallet-v39-header"><h4>Mes cartes</h4><p>Ajoutez jusqu’à 3 cartes. Touchez une mini-carte pour modifier son design.</p></div>';
    if(reglages.savedCards.length){
      html+=`<div class="wallet-card-grid">`+reglages.savedCards.map((c,i)=>`<div class="wallet-v39-card"><div class="wallet-card-top"><div onclick="openSavedCardDesignPicker(${i},event)" title="Modifier le design">${savedCardMiniHtml(c)}</div><div class="wallet-card-meta"><h4>${c.type} •••• ${c.last4}</h4><p>${c.holder}</p><p>Expiration ${c.expiry}${c.design?` • ${getCardDesignName(c.design)}`:''}</p></div></div><div class="wallet-card-actions"><button onclick="openSavedCardDesignPicker(${i},event)">Modifier le design</button><button class="secondary" onclick="deleteSavedCard(${i});renderWalletPage();">Supprimer</button></div></div>`).join('')+`</div>`;
    }else html+='<div class="wallet-v39-empty">Aucune carte enregistrée.</div>';
    html+=`<div class="wallet-action-strip"><button onclick="openPaymentModal(0,function(){renderWalletPage();})">＋ Ajouter une carte</button></div>`;
    box.innerHTML=html;
  };

  function collectFinanceEvents(){
    const rows=[];
    const push=(date,label,amount,type,meta='')=>rows.push({date,label,amount:Number(amount)||0,type,meta});
    (reglages.adminActionLog||[]).forEach(a=>push(a.time||'--:--',a.label||'Action patron',a.amount||0,a.amount<0?'loss':(a.amount>0?'gain':'neutral'),'Journal patron'));
    (reglages.historiqueCommandes||[]).forEach(h=>push(h.date||'--',`Commande client : ${h.items||'Commande Lago'}`,h.status==='Annulée'?0:(Number(h.prix)||0),'order',h.status||'Terminée'));
    (fakeUsers||[]).forEach(u=>{
      (u.historique||[]).forEach(h=>push(h.date||u.signupDate||'--',`${u.email} — ${h.items||'Commande'}`,Number(h.prix)||0,'client',h.status||'Commande'));
      if(u.isVip) push(u.signupDate||'--',`${u.email} — abonnement Lago+ actif`,59.99,'premium','Client premium');
    });
    return rows.slice(0,120);
  }
  window.openAdminFinanceHistory=function(filter='all'){
    const rows=collectFinanceEvents();
    const filtered=filter==='all'?rows:rows.filter(r=>r.type===filter || (filter==='loss'&&r.amount<0) || (filter==='gain'&&r.amount>0));
    const gains=rows.filter(r=>r.amount>0).reduce((a,r)=>a+r.amount,0);
    const losses=Math.abs(rows.filter(r=>r.amount<0).reduce((a,r)=>a+r.amount,0));
    const content=`<h3 style="margin-top:0;color:var(--accent-blue);">Historique financier Lago</h3>
      <p style="color:var(--text-dim);font-size:12px;margin-top:-6px;">Commandes, Lago+, remboursements, pertes et actions patron.</p>
      <div class="finance-history-summary"><div>Total entrées<strong style="color:var(--accent-green);">${gains.toFixed(2)}€</strong></div><div>Total pertes<strong style="color:var(--accent-red);">-${losses.toFixed(2)}€</strong></div></div>
      <div class="finance-history-filter"><button onclick="openAdminFinanceHistory('all')">Tout</button><button onclick="openAdminFinanceHistory('order')">Commandes</button><button onclick="openAdminFinanceHistory('premium')">Lago+</button><button onclick="openAdminFinanceHistory('loss')">Pertes</button><button onclick="openAdminFinanceHistory('client')">Clients</button></div>
      <div style="max-height:48vh;overflow:auto;padding-right:4px;">${filtered.map(r=>`<div class="finance-history-row"><div><strong>${r.label}</strong><div class="meta">${r.date} • ${r.meta||r.type}</div></div><div class="${r.amount<0?'loss':(r.amount>0?'gain':'meta')}">${r.amount>0?'+':''}${r.amount.toFixed(2)}€</div></div>`).join('')||'<p style="color:var(--text-dim);">Aucun mouvement.</p>'}</div>`;
    document.getElementById('adminModalContent').innerHTML=content;
    document.getElementById('adminModal').classList.add('active');
  };
  function bindFinanceClick(){
    ['statsCATotal','statsTrendIndicator'].forEach(id=>{
      const el=document.getElementById(id);
      if(el && !el.dataset.v41Finance){
        el.dataset.v41Finance='1';
        el.title='Voir l’historique financier';
        el.addEventListener('click',()=>openAdminFinanceHistory('all'));
      }
    });
  }
  const _v41UpdateStats=window.updateAdminStats;
  window.updateAdminStats=function(){ _v41UpdateStats(); bindFinanceClick(); };
  const boot=()=>{ forceProfileHelpVisible(); bindFinanceClick(); };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();


// =============================================
// V42 — grosse mise à jour : offres Lago+, avatars, Compact, aide plus réaliste
// =============================================
(function(){
  const AV_STANDARD=[
    'https://api.dicebear.com/7.x/notionists/svg?seed=Leo&backgroundColor=f8fafc',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Mila&backgroundColor=e0f2fe',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Noah&backgroundColor=fef3c7',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Ines&backgroundColor=fce7f3',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Eliott&backgroundColor=dcfce7',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Sara&backgroundColor=ede9fe',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Tom&backgroundColor=fee2e2',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Nina&backgroundColor=ccfbf1',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Max&backgroundColor=e5e7eb',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Jade&backgroundColor=dbeafe'
  ];
  const AV_PREMIUM=[
    'https://api.dicebear.com/7.x/micah/svg?seed=GoldKing&backgroundColor=000000',
    'https://api.dicebear.com/7.x/micah/svg?seed=Royal&backgroundColor=1e1b4b',
    'https://api.dicebear.com/7.x/micah/svg?seed=Neon&backgroundColor=0f172a',
    'https://api.dicebear.com/7.x/micah/svg?seed=Glass&backgroundColor=e0f2fe',
    'https://api.dicebear.com/7.x/micah/svg?seed=Ruby&backgroundColor=450a0a',
    'https://api.dicebear.com/7.x/micah/svg?seed=Emerald&backgroundColor=052e16',
    'https://api.dicebear.com/7.x/micah/svg?seed=Platinum&backgroundColor=111827',
    'https://api.dicebear.com/7.x/micah/svg?seed=Violet&backgroundColor=3b0764',
    'https://api.dicebear.com/7.x/micah/svg?seed=OceanVip&backgroundColor=082f49',
    'https://api.dicebear.com/7.x/micah/svg?seed=Diamond&backgroundColor=f8fafc'
  ];
  const PREMIUM_PROMOS=[
    {id:'vip01',icon:'👑',title:'-25€ dès 45€ d’achat',desc:'Offre Lago+ premium sur les gros paniers.',min:45,percent:55,max:25,expire:'Réservé Lago+',premium:true},
    {id:'vip02',icon:'💎',title:'-30% sur Le Duo',desc:'Réduction premium sur le best-seller.',min:30,percent:30,target:'Le Duo',expire:'Réservé Lago+',premium:true},
    {id:'vip03',icon:'🚀',title:'Livraison boostée -20%',desc:'Offre Lago+ pour commandes prioritaires.',min:25,percent:20,expire:'Réservé Lago+',premium:true},
    {id:'vip04',icon:'🌙',title:'Nuit premium -22%',desc:'Dès 35€ sur tout le panier.',min:35,percent:22,expire:'Réservé Lago+',premium:true},
    {id:'vip05',icon:'🛏️',title:'Compact gratuit en option',desc:'Equivalent -10€ dès 40€.',min:40,percent:25,max:10,expire:'Réservé Lago+',premium:true},
    {id:'vip06',icon:'✨',title:'Pack confort -18%',desc:'Réduction premium sur lit + options.',min:30,percent:18,expire:'Réservé Lago+',premium:true},
    {id:'vip07',icon:'🏨',title:'Confort hôtel -24%',desc:'Pour Le Duo avec options confort.',min:45,percent:24,target:'Le Duo',expire:'Réservé Lago+',premium:true},
    {id:'vip08',icon:'🧊',title:'Offre Liquide Glace -16%',desc:'Offre spéciale membres Lago+.',min:28,percent:16,expire:'Réservé Lago+',premium:true},
    {id:'vip09',icon:'💰',title:'Cashback boost -15%',desc:'Réduction directe sur panier premium.',min:35,percent:15,expire:'Réservé Lago+',premium:true},
    {id:'vip10',icon:'🎟️',title:'Ticket VIP -20%',desc:'Dès 50€ d’achat.',min:50,percent:20,expire:'Réservé Lago+',premium:true},
    {id:'vip11',icon:'🍼',title:'Famille VIP -25%',desc:'Sur Lit Parapluie et accessoires.',min:25,percent:25,target:'Lit Parapluie',expire:'Réservé Lago+',premium:true},
    {id:'vip12',icon:'🧸',title:'Cocooning VIP -19%',desc:'Pour un panier avec plusieurs options.',min:32,percent:19,expire:'Réservé Lago+',premium:true},
    {id:'vip13',icon:'⚡',title:'Urgence VIP -17%',desc:'Réduction premium en cas de livraison rapide.',min:25,percent:17,expire:'Réservé Lago+',premium:true},
    {id:'vip14',icon:'🌟',title:'Favori Lago+ -21%',desc:'Sur un matelas premium choisi du jour.',min:30,percent:21,expire:'Réservé Lago+',premium:true},
    {id:'vip15',icon:'🪙',title:'-12€ dès 35€',desc:'Offre premium plafonnée.',min:35,percent:35,max:12,expire:'Réservé Lago+',premium:true},
    {id:'vip16',icon:'🎁',title:'Bonus membre -14%',desc:'Réduction premium simple.',min:20,percent:14,expire:'Réservé Lago+',premium:true},
    {id:'vip17',icon:'🏆',title:'Top membre -28%',desc:'Dès 60€ d’achat.',min:60,percent:28,expire:'Réservé Lago+',premium:true},
    {id:'vip18',icon:'🛌',title:'Gonflable VIP -20%',desc:'Sur Matelas Gonflable.',min:15,percent:20,target:'Matelas Gonflable',expire:'Réservé Lago+',premium:true},
    {id:'vip19',icon:'📦',title:'Panier complet -23%',desc:'Sur les paniers supérieurs à 55€.',min:55,percent:23,expire:'Réservé Lago+',premium:true},
    {id:'vip20',icon:'👑',title:'Royal Lago+ -18%',desc:'Offre premium universelle.',min:30,percent:18,expire:'Réservé Lago+',premium:true},
    {id:'vip21',icon:'🪄',title:'Installation VIP -20%',desc:'Réduction si installation sélectionnée.',min:25,percent:20,expire:'Réservé Lago+',premium:true},
    {id:'vip22',icon:'🌌',title:'Nuit noire -22%',desc:'Offre réservée aux membres Lago+.',min:38,percent:22,expire:'Réservé Lago+',premium:true},
    {id:'vip23',icon:'🧡',title:'Client premium fidèle -15%',desc:'Valable sur tout panier.',min:20,percent:15,expire:'Réservé Lago+',premium:true},
    {id:'vip24',icon:'🛵',title:'Distance courte VIP -16%',desc:'Réduction pour livraisons proches.',min:20,percent:16,expire:'Réservé Lago+',premium:true},
    {id:'vip25',icon:'💫',title:'Privilège Lago -26%',desc:'Dès 70€ d’achat.',min:70,percent:26,expire:'Réservé Lago+',premium:true},
    {id:'vip26',icon:'🎈',title:'Week-end VIP -18%',desc:'Pour vos nuits du week-end.',min:25,percent:18,expire:'Réservé Lago+',premium:true},
    {id:'vip27',icon:'🏅',title:'Duo privilège -25%',desc:'Sur Le Duo.',min:35,percent:25,target:'Le Duo',expire:'Réservé Lago+',premium:true},
    {id:'vip28',icon:'🧽',title:'Draps premium -17%',desc:'Sur panier avec draps propres.',min:25,percent:17,expire:'Réservé Lago+',premium:true},
    {id:'vip29',icon:'🎯',title:'Cible premium -20%',desc:'Offre Lago+ du jour.',min:30,percent:20,expire:'Réservé Lago+',premium:true},
    {id:'vip30',icon:'🛰️',title:'Lago Boost+ -24%',desc:'Dès 58€.',min:58,percent:24,expire:'Réservé Lago+',premium:true},
    {id:'vip31',icon:'🌈',title:'Premium multi-options -18%',desc:'Pour les paniers avec options.',min:30,percent:18,expire:'Réservé Lago+',premium:true},
    {id:'vip32',icon:'🧑‍🎓',title:'Étudiant VIP -16%',desc:'Offre membre Lago+.',min:20,percent:16,expire:'Réservé Lago+',premium:true},
    {id:'vip33',icon:'🥇',title:'Elite -30%',desc:'Dès 80€ sur tout panier.',min:80,percent:30,expire:'Réservé Lago+',premium:true},
    {id:'vip34',icon:'🍀',title:'Chance VIP -19%',desc:'Offre premium surprise.',min:26,percent:19,expire:'Réservé Lago+',premium:true},
    {id:'vip35',icon:'📍',title:'Local VIP -15%',desc:'Réduction spéciale distance proche.',min:18,percent:15,expire:'Réservé Lago+',premium:true},
    {id:'vip36',icon:'💼',title:'Pro VIP -21%',desc:'Pour les gros paniers.',min:45,percent:21,expire:'Réservé Lago+',premium:true},
    {id:'vip37',icon:'🎊',title:'Fête VIP -20%',desc:'Réservé aux membres.',min:30,percent:20,expire:'Réservé Lago+',premium:true},
    {id:'vip38',icon:'🧷',title:'Secours VIP -18%',desc:'Sur le matelas Compact ou Gonflable.',min:10,percent:18,expire:'Réservé Lago+',premium:true},
    {id:'vip39',icon:'🏡',title:'Maison VIP -17%',desc:'Sur tout panier dès 22€.',min:22,percent:17,expire:'Réservé Lago+',premium:true},
    {id:'vip40',icon:'🌧️',title:'Pluie VIP -20%',desc:'Offre premium météo.',min:28,percent:20,expire:'Réservé Lago+',premium:true},
    {id:'vip41',icon:'📲',title:'Mobile VIP -15%',desc:'Réduction membre Lago+.',min:18,percent:15,expire:'Réservé Lago+',premium:true},
    {id:'vip42',icon:'🎀',title:'Douceur VIP -19%',desc:'Couette + coussin recommandés.',min:30,percent:19,expire:'Réservé Lago+',premium:true},
    {id:'vip43',icon:'🪩',title:'After VIP -23%',desc:'Offre tardive Lago+.',min:35,percent:23,expire:'Réservé Lago+',premium:true},
    {id:'vip44',icon:'🧠',title:'Smart VIP -16%',desc:'Réduction intelligente du jour.',min:25,percent:16,expire:'Réservé Lago+',premium:true},
    {id:'vip45',icon:'🛡️',title:'Protection VIP -18%',desc:'Offre premium sécurisée.',min:30,percent:18,expire:'Réservé Lago+',premium:true},
    {id:'vip46',icon:'📈',title:'Boost panier -22%',desc:'Dès 48€.',min:48,percent:22,expire:'Réservé Lago+',premium:true},
    {id:'vip47',icon:'🎆',title:'Grande offre VIP -27%',desc:'Dès 75€.',min:75,percent:27,expire:'Réservé Lago+',premium:true},
    {id:'vip48',icon:'🧊',title:'Frozen VIP -20%',desc:'Offre Lago+ premium.',min:32,percent:20,expire:'Réservé Lago+',premium:true},
    {id:'vip49',icon:'🖤',title:'Black VIP -18%',desc:'Offre sombre et premium.',min:30,percent:18,expire:'Réservé Lago+',premium:true},
    {id:'vip50',icon:'👑',title:'Lago+ Ultimate -25%',desc:'Offre rare dès 65€.',min:65,percent:25,expire:'Réservé Lago+',premium:true}
  ];

  function initV42Data(){
    // avatars
    try{ avatarsStandard.splice(0, avatarsStandard.length, ...AV_STANDARD); avatarsPremium.splice(0, avatarsPremium.length, ...AV_PREMIUM); initAvatarsUI(); }catch(_e){}
    if(!reglages.avatarUrl || reglages.avatarUrl.includes('Mimi')) reglages.avatarUrl=AV_STANDARD[0];
    // compact + prix cohérent
    if(typeof reglages.prixCompact!=='number') reglages.prixCompact=10;
    if(typeof reglages.ruptureCompact!=='boolean') reglages.ruptureCompact=false;
    if(!reglages._v42GonflableAdjusted && Number(reglages.prixGonflable||0)<=10){ reglages.prixGonflable=15; reglages._v42GonflableAdjusted=true; }
    if(!Array.isArray(reglages.adminVisiblePremiumPromoIds)) reglages.adminVisiblePremiumPromoIds=['vip01','vip02','vip03'];
    reglages.adminVisiblePromoIds=(reglages.adminVisiblePromoIds||[]).filter(id=>LAGO_PROMO_LIBRARY.some(p=>p.id===id)).slice(0,3);
    if(!reglages.adminVisiblePromoIds.length) reglages.adminVisiblePromoIds=['promo02','promo04','promo10'];
    reglages.adminVisiblePremiumPromoIds=reglages.adminVisiblePremiumPromoIds.filter(id=>PREMIUM_PROMOS.some(p=>p.id===id)).slice(0,3);
    if(!reglages.adminVisiblePremiumPromoIds.length) reglages.adminVisiblePremiumPromoIds=['vip01','vip02','vip03'];
  }
  function updateCompactDom(){
    initV42Data();
    const gonf=document.getElementById('matelasGonflable'); if(gonf) gonf.dataset.price=reglages.prixGonflable;
    const pt=document.getElementById('prixGonflableText'); if(pt) pt.innerText=reglages.prixGonflable+' €';
    const compact=document.getElementById('matelasCompact');
    if(compact){ compact.dataset.price=reglages.prixCompact; compact.classList.toggle('out-of-stock',!!reglages.ruptureCompact); const rb=compact.querySelector('.rupture-badge'); if(rb) rb.style.display=reglages.ruptureCompact?'block':'none'; }
    const cpt=document.getElementById('prixCompactText'); if(cpt) cpt.innerText=reglages.prixCompact+' €';
    const adminP=document.getElementById('adminPrixCompact'); if(adminP) adminP.value=reglages.prixCompact;
    const adminR=document.getElementById('adminRuptureCompact'); if(adminR) adminR.checked=!!reglages.ruptureCompact;
    const adminG=document.getElementById('adminPrixGonflable'); if(adminG) adminG.value=reglages.prixGonflable;
  }
  const oldMaj=window.mettreAJourVitrine || (typeof mettreAJourVitrine==='function'?mettreAJourVitrine:null);
  if(oldMaj){
    window.mettreAJourVitrine=function(){ oldMaj(); updateCompactDom(); try{ attacherEvenementsClics(); }catch(_e){} };
    try{ mettreAJourVitrine=window.mettreAJourVitrine; }catch(_e){}
  }
  const oldSave=document.getElementById('saveAdminBtn')?.onclick;
  if(document.getElementById('saveAdminBtn')) document.getElementById('saveAdminBtn').onclick=function(){
    if(typeof oldSave==='function') oldSave.call(this);
    const cp=document.getElementById('adminPrixCompact'); if(cp) reglages.prixCompact=Math.max(0,Number(cp.value)||10);
    const cr=document.getElementById('adminRuptureCompact'); if(cr) reglages.ruptureCompact=!!cr.checked;
    updateCompactDom(); saveAll();
  };
  // fake orders include compact
  const oldGetAvail=window.getAvailableDriver;
  // Promotions: normal + premium
  function promoById(id){ return (LAGO_PROMO_LIBRARY.find(p=>p.id===id) || PREMIUM_PROMOS.find(p=>p.id===id) || null); }
  window.v42PromoById=promoById;
  window.renderClientPromotions=function(){
    initV42Data();
    const box=document.getElementById('clientPromoList'); if(!box) return;
    const normal=reglages.adminVisiblePromoIds.slice(0,3).map(promoById).filter(Boolean).map(p=>({...p,premium:false}));
    const premium=reglages.isPremium ? reglages.adminVisiblePremiumPromoIds.slice(0,3).map(promoById).filter(Boolean).map(p=>({...p,premium:true})) : [];
    const card=p=>{
      const used=(reglages.usedPromotionIds||[]).includes(p.id);
      const claimed=(reglages.claimedPromotionIds||[]).includes(p.id) || reglages.activeRewardPromo===p.id;
      const cls=p.premium?'promo-clean-card premium-offer':'promo-clean-card';
      const label=used?'Déjà utilisé':(claimed?'Reçue':'Recevoir');
      return `<div class="${cls}"><div class="promo-clean-icon">${p.icon}</div><div class="promo-clean-main"><h4>${p.title}</h4><p>${p.desc}</p><p class="promo-expire">${p.expire||'En ce moment'} • Dès ${Number(p.min||0).toFixed(0)}€${p.premium?' • Lago+':''}</p></div><button class="${claimed||used?'claimed':''}" onclick="claimFixedPromotion('${p.id}')" ${used?'disabled':''}>${label}</button></div>`;
    };
    box.innerHTML=`<div class="promo-section-label">Offres du moment</div>`+normal.map(card).join('')+(reglages.isPremium?`<div class="promo-section-label gold">👑 Offres Lago+</div>`+premium.map(card).join(''):'');
    const span=document.querySelector('#promoBellBtn span'); if(span) span.textContent=String(normal.length+premium.length);
  };
  window.claimFixedPromotion=function(id){
    initV42Data();
    if((reglages.usedPromotionIds||[]).includes(id)) return alert('Cette offre a déjà été utilisée.');
    const p=promoById(id); if(!p) return;
    if(p.premium && !reglages.isPremium) return alert('Cette offre est réservée aux membres Lago+.');
    reglages.claimedPromotionIds=[id];
    reglages.activeRewardPromo=id;
    promoActive=false;
    const msg=document.getElementById('promoMessage'); if(msg){ msg.textContent='Offre reçue active. Un seul avantage promo à la fois.'; msg.style.display='block'; }
    saveAll(); renderClientPromotions(); updateCart();
  };
  window.rewardPromoDiscount=function(){
    const p=promoById(reglages.activeRewardPromo); if(!p) return 0;
    let base=0;
    cart.forEach(c=>{ if(!p.target || c.name===p.target) base+=(Number(c.price)||0)*(Number(c.qty)||1); });
    if(base<Number(p.min||0)) return 0;
    let disc=Math.round(base*(Number(p.percent)||0)/100*100)/100;
    if(p.max) disc=Math.min(disc,Number(p.max));
    return Math.max(0,disc);
  };
  try{ rewardPromoDiscount=window.rewardPromoDiscount; }catch(_e){}
  // admin offers modal with two categories
  window.renderAdminOffersPreview=function(){
    initV42Data(); const box=document.getElementById('adminOffersPreview'); if(!box) return;
    const n=reglages.adminVisiblePromoIds.map(promoById).filter(Boolean);
    const p=reglages.adminVisiblePremiumPromoIds.map(promoById).filter(Boolean);
    box.innerHTML=`<div style="width:100%;font-size:11px;color:var(--text-dim);font-weight:900;text-transform:uppercase;">Offres normales</div>`+n.map(x=>`<span class="admin-offer-chip">${x.icon} ${x.title}</span>`).join('')+`<div style="width:100%;font-size:11px;color:#facc15;font-weight:900;text-transform:uppercase;margin-top:6px;">Offres premium</div>`+p.map(x=>`<span class="admin-offer-chip premium-chip">${x.icon} ${x.title}</span>`).join('');
  };
  let adminOfferMode='normal';
  window.renderAdminOfferLibrary=function(){
    initV42Data(); const wrap=document.getElementById('adminOffersLibrary'); if(!wrap) return;
    const q=(document.getElementById('adminOffersSearch')?.value||'').toLowerCase();
    const lib=adminOfferMode==='premium'?PREMIUM_PROMOS:LAGO_PROMO_LIBRARY;
    const selected=adminOfferMode==='premium'?reglages.adminVisiblePremiumPromoIds:reglages.adminVisiblePromoIds;
    wrap.innerHTML=`<div class="admin-offers-tabs"><button class="${adminOfferMode==='normal'?'active':''}" onclick="v42SwitchOfferMode('normal')">Offres normales</button><button class="${adminOfferMode==='premium'?'active':''}" onclick="v42SwitchOfferMode('premium')">Offres Premium</button></div>`+
      lib.filter(p=>!q || (`${p.title} ${p.desc}`).toLowerCase().includes(q)).map(p=>`<label class="admin-offer-row ${adminOfferMode==='premium'?'premium-row':''}"><input type="checkbox" value="${p.id}" ${selected.includes(p.id)?'checked':''}><div><h4>${p.icon} ${p.title}</h4><p>${p.desc}</p><p>Dès ${Number(p.min||0).toFixed(0)}€ • -${p.percent}% ${p.target?`• ${p.target}`:'• Tous les lits'}${p.premium?' • Lago+':''}</p></div></label>`).join('');
  };
  window.v42SwitchOfferMode=function(mode){ adminOfferMode=mode; renderAdminOfferLibrary(); };
  window.saveAdminOffersSelection=function(){
    const ids=[...document.querySelectorAll('#adminOffersLibrary input[type="checkbox"]:checked')].map(i=>i.value).slice(0,3);
    if(!ids.length) return alert('Sélectionnez entre 1 et 3 offres.');
    if(adminOfferMode==='premium') reglages.adminVisiblePremiumPromoIds=ids; else reglages.adminVisiblePromoIds=ids;
    saveAll(); renderAdminOffersPreview(); renderClientPromotions(); renderAdminOfferLibrary(); alert('Sélection mise à jour.');
  };
  // bot support richer answers + command link
  function ensureChatOpen(){
    if(typeof initHelpChat==='function') initHelpChat();
  }
  const oldOpenHelpTopic=window.openHelpTopic;
  window.openHelpTopic=function(topic){
    ensureChatOpen();
    if(topic==='livraison'){
      const hist=reglages.historiqueCommandes||[];
      const list=hist.length?`<div class="support-order-choice">${hist.slice().reverse().map((h,idx)=>`<button onclick="requestRefundForOrder(${hist.length-1-idx})">${h.date} — ${h.items||'Commande'} — ${Number(h.prix||0).toFixed(2)}€</button>`).join('')}</div>`:'<div class="support-order-choice"><button>Aucune commande disponible</button></div>';
      appendHelpChatMessage('user','J’ai un problème avec une livraison.');
      appendHelpChatMessage('bot','Choisissez la commande concernée. Nous pouvons analyser le souci et proposer un remboursement en cagnotte si le problème est validé.'+list);
      return;
    }
    if(topic==='premium'){
      appendHelpChatMessage('user','J’ai une question sur Lago+.');
      appendHelpChatMessage('bot','Lago+ ajoute -15% sur les lits, livraison offerte sous 3 km, cagnotte cashback, thèmes premium, avatars premium, designs de cartes et 3 offres exclusives dans la cloche. La cagnotte est utilisable depuis le panier quand Lago+ est actif.');
      return;
    }
    if(topic==='contact'){
      appendHelpChatMessage('user','Je souhaite contacter Lago.');
      appendHelpChatMessage('bot','Service Lago : 06 19 72 04 74. Vous pouvez aussi décrire votre problème ici, je vous répondrai comme un assistant support.');
      return;
    }
    if(oldOpenHelpTopic) oldOpenHelpTopic(topic);
  };
  window.requestRefundForOrder=function(index){
    const h=(reglages.historiqueCommandes||[])[index]; if(!h) return;
    const amount=Math.min(12,Math.max(3,Math.round((Number(h.prix||0)*0.25)*100)/100));
    appendHelpChatMessage('user',`Demande de remboursement pour : ${h.items||'commande'}`);
    if(!reglages.isPremium){
      appendHelpChatMessage('bot',`Votre demande est éligible à ${amount.toFixed(2)}€ en cagnotte, mais la cagnotte est débloquée avec Lago+. Passez Lago+ pour recevoir et utiliser ce crédit.`);
      return;
    }
    reglages.cagnotte=(Number(reglages.cagnotte)||0)+amount;
    h.refundCredit=(Number(h.refundCredit)||0)+amount;
    addAdminActionLog(`Remboursement support ${h.items||'commande'}`,-amount);
    updateAdminStats(); appliquerAvatarEtPremium(); saveAll();
    appendHelpChatMessage('bot',`Remboursement accepté : ${amount.toFixed(2)}€ crédités dans votre cagnotte Lago+. Le patron voit la perte dans son historique financier.`);
  };
  const oldBot=window.getHelpBotAnswer;
  window.getHelpBotAnswer=function(text){
    const t=(text||'').toLowerCase();
    if(t.includes('cagnotte')) return 'La cagnotte Lago+ se crédite avec les achats, certains remboursements support et des avantages premium. Elle s’utilise dans le panier via la case dédiée, uniquement quand Lago+ est actif.';
    if(t.includes('offre')||t.includes('promo')) return 'Les offres normales sont limitées à 3. Avec Lago+, vous avez 3 offres premium supplémentaires dans la cloche. Une seule offre peut être active à la fois.';
    if(t.includes('compact')) return 'Le Compact est le matelas fin 5 cm auto-gonflant : solution de dépannage minimum, moins confortable que le Gonflable mais moins cher.';
    if(t.includes('rembours')) return 'Pour un remboursement, choisissez “Problème avec une livraison”, sélectionnez la commande concernée, puis le support propose un crédit cagnotte si la demande est validée.';
    return oldBot?oldBot(text):'Je suis Lago Care. Je peux vous aider pour livraison, paiement, Lago+, cagnotte, offres et remboursement.';
  };
  // help button smaller transparent
  function styleHelp(){ const b=document.getElementById('profileHelpBtn'); if(b){ b.classList.add('v42-help-btn'); } }
  // boot
  const boot=()=>{ initV42Data(); updateCompactDom(); styleHelp(); renderClientPromotions(); renderAdminOffersPreview(); saveAll(); };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();

/* ===== V43 — matelas dynamiques, aide allégée, wallet robustifié ===== */
(function(){
  function ensureV43Data(){
    if(!Array.isArray(reglages.customMattresses)) reglages.customMattresses=[];
    reglages.customMattresses=reglages.customMattresses.map((m,i)=>({
      id:m.id||('cm_'+Date.now()+'_'+i),
      name:(m.name||'Nouveau matelas').trim(),
      price:Math.max(0,Number(m.price)||10),
      desc:(m.desc||'Matelas personnalisé Lago.').trim(),
      badgeType:m.badgeType||'none',
      rupture:!!m.rupture
    }));
    try{
      if(typeof V36_MATTRESS_META!=='undefined'){
        V36_MATTRESS_META['Le Compact']={desc:'Lit dépannage 5 cm auto-gonflant.',price:()=>Number(reglages.prixCompact||10)};
        reglages.customMattresses.forEach(m=>{ V36_MATTRESS_META[m.name]={desc:m.desc,price:()=>Number(m.price||0)}; });
      }
    }catch(_e){}
  }

  function badgeHtml(type){
    if(type==='hot') return '<div class="badge badge-hot">🔥 Best-Seller</div>';
    if(type==='warn') return '<div class="badge badge-warn">Idéal Dépannage</div>';
    if(type==='blue') return '<div class="badge badge-blue">🍼 Famille</div>';
    return '';
  }

  function ensureCustomMattressModal(){
    if(document.getElementById('customMattressModal')) return;
    const modal=document.createElement('div');
    modal.id='customMattressModal';
    modal.innerHTML=`<div class="custom-mattress-sheet">
      <div class="custom-mattress-head">
        <div><h3>Ajouter un matelas</h3><p>Créez un nouveau matelas visible côté client.</p></div>
        <button type="button" onclick="closeCustomMattressModal()">✕</button>
      </div>
      <div class="custom-mattress-body">
        <label>Nom du matelas</label>
        <input id="customMattressName" type="text" placeholder="Ex. Le Nomade">
        <label>Prix (€)</label>
        <input id="customMattressPrice" type="number" min="0" step="1" placeholder="10">
        <label>Description</label>
        <textarea id="customMattressDesc" placeholder="Ex. Lit dépannage 5 cm auto-gonflant."></textarea>
        <label>Badge</label>
        <select id="customMattressBadge">
          <option value="none">Aucun badge</option>
          <option value="hot">Best-Seller</option>
          <option value="warn">Idéal Dépannage</option>
          <option value="blue">Famille</option>
        </select>
        <label class="custom-mattress-check"><input id="customMattressRupture" type="checkbox"> Rupture de stock</label>
      </div>
      <div class="custom-mattress-actions">
        <button type="button" class="secondary" onclick="closeCustomMattressModal()">Annuler</button>
        <button type="button" onclick="createCustomMattress()">Ajouter le matelas</button>
      </div>
    </div>`;
    document.body.appendChild(modal);
  }

  window.openCustomMattressModal=function(){ ensureCustomMattressModal(); const m=document.getElementById('customMattressModal'); if(!m) return; m.classList.add('show'); };
  window.closeCustomMattressModal=function(){ const m=document.getElementById('customMattressModal'); if(m) m.classList.remove('show'); };

  window.createCustomMattress=function(){
    ensureV43Data();
    const name=(document.getElementById('customMattressName')?.value||'').trim();
    const price=Math.max(0,Number(document.getElementById('customMattressPrice')?.value)||0);
    const desc=(document.getElementById('customMattressDesc')?.value||'').trim();
    const badgeType=document.getElementById('customMattressBadge')?.value||'none';
    const rupture=!!document.getElementById('customMattressRupture')?.checked;
    if(!name) return alert('Donnez un nom au matelas.');
    reglages.customMattresses.push({id:'cm_'+Date.now(),name,price,desc:desc||'Matelas personnalisé Lago.',badgeType,rupture});
    ensureV43Data();
    renderCustomMattressesAdmin();
    renderCustomMattressesClient();
    saveAll();
    closeCustomMattressModal();
    alert('Matelas ajouté ✅');
  };

  function renderCustomMattressesAdmin(){
    ensureV43Data();
    const grid=document.querySelector('#admSettings .admin-grid');
    if(!grid) return;
    let tile=document.getElementById('addCustomMattressAdminTile');
    if(!tile){
      tile=document.createElement('div');
      tile.id='addCustomMattressAdminTile';
      tile.className='admin-custom-add-tile';
      tile.innerHTML='<button type="button" onclick="openCustomMattressModal()">＋<span>Ajouter un matelas</span></button>';
      grid.appendChild(tile);
    }
    let list=document.getElementById('adminCustomMattressList');
    if(!list){
      list=document.createElement('div');
      list.id='adminCustomMattressList';
      list.className='admin-custom-mattress-list';
      grid.parentNode.insertBefore(list, document.querySelector('.admin-promo-feed-box'));
    }
    if(!reglages.customMattresses.length){
      list.innerHTML='<div class="admin-custom-empty">Aucun matelas personnalisé pour le moment.</div>';
      return;
    }
    list.innerHTML=reglages.customMattresses.map((m,i)=>`<div class="admin-custom-row" data-index="${i}">
      <div class="row-top"><strong>${m.name}</strong><button type="button" class="danger" onclick="deleteCustomMattress(${i})">Supprimer</button></div>
      <div class="admin-custom-grid">
        <div><label class="admin-label">Nom</label><input class="admin-input cm-name" value="${escapeHtmlAttr(m.name)}"></div>
        <div><label class="admin-label">Prix (€)</label><input type="number" class="admin-input cm-price" value="${Number(m.price||0)}"></div>
        <div style="grid-column:1/-1"><label class="admin-label">Description</label><input class="admin-input cm-desc" value="${escapeHtmlAttr(m.desc)}"></div>
        <div><label class="admin-label">Badge</label><select class="admin-input cm-badge"><option value="none" ${m.badgeType==='none'?'selected':''}>Aucun</option><option value="hot" ${m.badgeType==='hot'?'selected':''}>Best-Seller</option><option value="warn" ${m.badgeType==='warn'?'selected':''}>Idéal Dépannage</option><option value="blue" ${m.badgeType==='blue'?'selected':''}>Famille</option></select></div>
        <div><label class="admin-label">Statut</label><label class="admin-custom-check"><input type="checkbox" class="cm-rupture" ${m.rupture?'checked':''}> Rupture de stock</label></div>
      </div>
    </div>`).join('');
  }

  function escapeHtmlAttr(str){ return String(str||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function syncCustomMattressesFromAdmin(){
    const rows=[...document.querySelectorAll('#adminCustomMattressList .admin-custom-row')];
    reglages.customMattresses=rows.map((row,i)=>({
      id:reglages.customMattresses[i]?.id || ('cm_'+Date.now()+'_'+i),
      name:(row.querySelector('.cm-name')?.value||'Nouveau matelas').trim(),
      price:Math.max(0,Number(row.querySelector('.cm-price')?.value)||0),
      desc:(row.querySelector('.cm-desc')?.value||'Matelas personnalisé Lago.').trim(),
      badgeType:row.querySelector('.cm-badge')?.value||'none',
      rupture:!!row.querySelector('.cm-rupture')?.checked
    })).filter(m=>m.name);
    ensureV43Data();
  }

  window.deleteCustomMattress=function(index){
    ensureV43Data();
    if(!confirm('Supprimer ce matelas personnalisé ?')) return;
    reglages.customMattresses.splice(index,1);
    // retirer du panier si présent
    cart=cart.filter(item=>!reglages.customMattresses.some(m=>m.name===item.name));
    saveAll();
    renderCustomMattressesAdmin();
    renderCustomMattressesClient();
    if(typeof updateCart==='function') updateCart();
  };

  function renderCustomMattressesClient(){
    ensureV43Data();
    const anchor=document.getElementById('matelasBebe');
    if(!anchor || !anchor.parentNode) return;
    let wrap=document.getElementById('customMattressesContainer');
    if(!wrap){
      wrap=document.createElement('div');
      wrap.id='customMattressesContainer';
      anchor.insertAdjacentElement('afterend', wrap);
    }
    wrap.innerHTML=reglages.customMattresses.map(m=>`<div class="mattress ${m.rupture?'out-of-stock':''}" data-name="${escapeHtmlAttr(m.name)}" data-price="${Number(m.price||0)}">${badgeHtml(m.badgeType)}<div style="display:flex;justify-content:space-between;align-items:center;"><span><strong>${m.name}</strong><br><small style="color:var(--text-dim)">${m.desc}</small></span><span style="font-weight:800;">${Number(m.price||0)} €</span></div><div class="rupture-badge" style="display:${m.rupture?'block':'none'};color:var(--accent-red);font-size:12px;font-weight:bold;margin-top:5px;">Rupture de stock</div></div>`).join('');
    try{ attacherEvenementsClics(); }catch(_e){}
  }

  function includeCustomMattressesInMeta(){
    try{
      if(typeof V36_MATTRESS_META!=='undefined'){
        V36_MATTRESS_META['Le Compact']={desc:'Lit dépannage 5 cm auto-gonflant.',price:()=>Number(reglages.prixCompact||10)};
        (reglages.customMattresses||[]).forEach(m=>{ V36_MATTRESS_META[m.name]={desc:m.desc,price:()=>Number(m.price||0)}; });
      }
    }catch(_e){}
  }

  // robustifier Wallet : annulation propre et bouton réutilisable
  const v43OpenPayment=window.openPaymentModal;
  window.openPaymentModal=function(amount,cb){
    const overlay=document.getElementById('paymentOverlay');
    if(overlay){ overlay.classList.remove('show'); delete overlay.dataset.mode; }
    v43OpenPayment(amount,cb);
    if(overlay && Number(amount)===0){
      overlay.dataset.mode='add-card';
      overlay.style.pointerEvents='auto';
      const btn=document.getElementById('cardPayBtn');
      if(btn) btn.textContent='Ajouter la carte';
    }
  };
  const v43ClosePayment=window.closePayment;
  window.closePayment=function(){
    const overlay=document.getElementById('paymentOverlay');
    const wasAdd=!!(overlay && overlay.dataset.mode==='add-card');
    if(overlay){
      overlay.classList.remove('show');
      overlay.style.pointerEvents='none';
      delete overlay.dataset.mode;
      setTimeout(()=>{ if(overlay) overlay.style.pointerEvents=''; },40);
    }
    try{ v43ClosePayment(); }catch(_e){}
    try{ showingNewCardForm=false; selectedSavedCardIndex=-1; }catch(_e){}
    if(wasAdd){
      try{ pendingPaymentCallback=null; }catch(_e){}
      setTimeout(()=>{ try{ renderWalletPage(); }catch(_e){} },60);
    }
  };

  // style / position du bouton aide, plus petit et plus naturel.
  function applyHelpButtonStyle(){
    const btn=document.getElementById('profileHelpBtn');
    if(!btn) return;
    btn.classList.add('v43-help-btn');
    btn.textContent='?';
    btn.style.setProperty('top','54px','important');
    btn.style.setProperty('right','18px','important');
    btn.style.setProperty('width','26px','important');
    btn.style.setProperty('height','26px','important');
    btn.style.setProperty('font-size','16px','important');
    btn.style.setProperty('background','rgba(255,255,255,.16)','important');
    btn.style.setProperty('color','rgba(255,255,255,.88)','important');
    btn.style.setProperty('border','1px solid rgba(255,255,255,.34)','important');
    btn.style.setProperty('box-shadow','0 8px 18px rgba(0,0,0,.18)','important');
    btn.style.setProperty('backdrop-filter','blur(12px)','important');
    btn.style.setProperty('-webkit-backdrop-filter','blur(12px)','important');
  }
  const v43UpdateHelp=window.updateProfileHelpButton;
  window.updateProfileHelpButton=function(){ if(typeof v43UpdateHelp==='function') v43UpdateHelp(); applyHelpButtonStyle(); };

  // intégrer les matelas custom dans les commandes simulées si possible
  const v43NotifOrder=window.generateFakeOrderNotification;
  // patch léger : rien si la fonction n'existe pas.

  // Au save admin : récupérer les matelas custom.
  const prevMettreAJourVitrineV44=window.mettreAJourVitrine || (typeof mettreAJourVitrine==='function'?mettreAJourVitrine:null);
  if(prevMettreAJourVitrineV44){
    window.mettreAJourVitrine=function(){
      const res=prevMettreAJourVitrineV44.apply(this,arguments);
      ensureV44Data();
      syncHomeLabels();
      injectBuiltinStockInputs();
      applyBuiltinStockStatesToDom();
      refreshBuiltinAdminInputs();
      return res;
    };
    try{ mettreAJourVitrine=window.mettreAJourVitrine; }catch(_e){}
  }

  const saveBtn=document.getElementById('saveAdminBtn');
  const oldSave=saveBtn?.onclick;
  if(saveBtn) saveBtn.onclick=function(){
    if(typeof oldSave==='function') oldSave.call(this);
    syncCustomMattressesFromAdmin();
    includeCustomMattressesInMeta();
    renderCustomMattressesAdmin();
    renderCustomMattressesClient();
    saveAll();
  };

  // Boot principal
  function bootV43(){
    ensureV43Data();
    ensureCustomMattressModal();
    includeCustomMattressesInMeta();
    renderCustomMattressesAdmin();
    renderCustomMattressesClient();
    applyHelpButtonStyle();
    saveAll();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bootV43); else bootV43();
})();


/* ===== V44 — wallet cliquable, stocks, matelas custom compacts, promos clean ===== */
(function(){
  const BUILTIN_KEYS=['Solo','Duo','Gonflable','Compact','Bebe'];
  const BUILTIN_DEFAULT_STOCK={Solo:60,Duo:40,Gonflable:25,Compact:30,Bebe:20};
  const BUILTIN_NAME_TO_KEY={
    'Le Solo':'Solo',
    'Le Duo':'Duo',
    'Le Gonflable':'Gonflable',
    'Matelas Gonflable':'Gonflable',
    'Le Compact':'Compact',
    'Lit Parapluie':'Bebe'
  };
  const BUILTIN_DOM_ID={Solo:'Solo',Duo:'Duo',Gonflable:'Gonflable',Compact:'Compact',Bebe:'Bebe'};

  function ensureV44Data(){
    BUILTIN_KEYS.forEach(key=>{
      const stockKey='stock'+key;
      const manualKey='manualRupture'+key;
      const ruptureKey='rupture'+key;
      if(typeof reglages[stockKey]!=='number' || isNaN(reglages[stockKey])) reglages[stockKey]=BUILTIN_DEFAULT_STOCK[key];
      if(typeof reglages[manualKey]!=='boolean') reglages[manualKey]=!!reglages[ruptureKey];
      reglages[ruptureKey]=!!reglages[manualKey] || Number(reglages[stockKey])<=0;
    });
    if(!Array.isArray(reglages.customMattresses)) reglages.customMattresses=[];
    reglages.customMattresses=reglages.customMattresses.map((m,idx)=>{
      const mm={...m};
      if(typeof mm.stock!=='number' || isNaN(mm.stock)) mm.stock=10;
      if(typeof mm.manualRupture!=='boolean') mm.manualRupture=!!mm.rupture;
      mm.rupture=!!mm.manualRupture || Number(mm.stock)<=0;
      if(!mm.id) mm.id='cm_'+Date.now()+'_'+idx;
      return mm;
    });
  }

  function syncHomeLabels(){
    const homeTitle=document.querySelector('#home .card h3');
    if(homeTitle) homeTitle.textContent="Besoin d'un matelas ?";
    const homeSub=document.querySelector('#home .card h4');
    if(homeSub) homeSub.textContent='Nos matelas (livrés en 30 min)';
  }

  function injectBuiltinStockInputs(){
    const mapping=[
      {key:'Solo', input:'adminPrixSolo'},
      {key:'Duo', input:'adminPrixDuo'},
      {key:'Gonflable', input:'adminPrixGonflable'},
      {key:'Compact', input:'adminPrixCompact'},
      {key:'Bebe', input:'adminPrixBebe'}
    ];
    mapping.forEach(({key,input})=>{
      const priceInput=document.getElementById(input);
      if(!priceInput) return;
      const container=priceInput.closest('div');
      if(!container || container.querySelector('.admin-stock-wrap')) return;
      const label=document.createElement('label');
      label.className='admin-label admin-stock-wrap';
      label.innerHTML='Stock disponible';
      const stockInput=document.createElement('input');
      stockInput.type='number';
      stockInput.min='0';
      stockInput.step='1';
      stockInput.id='adminStock'+key;
      stockInput.className='admin-input admin-stock-input';
      const ruptureLabel=container.querySelector('label[style], label:not(.admin-label)');
      container.insertBefore(label, ruptureLabel || null);
      container.insertBefore(stockInput, ruptureLabel || null);
    });
  }

  function refreshBuiltinAdminInputs(){
    BUILTIN_KEYS.forEach(key=>{
      const stock=document.getElementById('adminStock'+key);
      if(stock) stock.value=Number(reglages['stock'+key]||0);
      const chk=document.getElementById('adminRupture'+key);
      if(chk) chk.checked=!!reglages['manualRupture'+key];
    });
  }

  function applyBuiltinStockStatesToDom(){
    BUILTIN_KEYS.forEach(key=>{
      const rupture=!!reglages['rupture'+key];
      const stock=Number(reglages['stock'+key]||0);
      const domId=BUILTIN_DOM_ID[key];
      const item=document.getElementById('matelas'+domId);
      if(item){
        item.classList.toggle('out-of-stock',rupture);
        const rb=item.querySelector('.rupture-badge');
        if(rb) rb.style.display=rupture?'block':'none';
        item.dataset.stock=String(stock);
      }
    });
  }

  function saveBuiltinStockInputs(){
    BUILTIN_KEYS.forEach(key=>{
      const stockEl=document.getElementById('adminStock'+key);
      const chk=document.getElementById('adminRupture'+key);
      if(stockEl) reglages['stock'+key]=Math.max(0, parseInt(stockEl.value||'0',10)||0);
      if(chk) reglages['manualRupture'+key]=!!chk.checked;
      reglages['rupture'+key]=!!reglages['manualRupture'+key] || Number(reglages['stock'+key])<=0;
    });
  }

  function badgeLabel(type){
    if(type==='hot') return '🔥 Best-Seller';
    if(type==='warn') return 'Idéal dépannage';
    if(type==='blue') return '🍼 Famille';
    return 'Aucun badge';
  }
  function badgeHtmlV44(type){
    if(type==='hot') return '<div class="badge badge-hot">🔥 Best-Seller</div>';
    if(type==='warn') return '<div class="badge badge-warn">Idéal Dépannage</div>';
    if(type==='blue') return '<div class="badge badge-blue">🍼 Famille</div>';
    return '';
  }

  function ensureCustomModalFields(){
    const body=document.querySelector('#customMattressModal .custom-mattress-body');
    if(!body || document.getElementById('customMattressStock')) return;
    const ruptureLabel=document.querySelector('#customMattressModal .custom-mattress-check');
    const label=document.createElement('label');
    label.textContent='Stock disponible';
    const input=document.createElement('input');
    input.id='customMattressStock';
    input.type='number';
    input.min='0';
    input.step='1';
    input.placeholder='10';
    body.insertBefore(label, ruptureLabel || null);
    body.insertBefore(input, ruptureLabel || null);
  }

  const prevCreateCustomMattress=window.createCustomMattress;
  window.createCustomMattress=function(){
    ensureV44Data();
    const name=(document.getElementById('customMattressName')?.value||'').trim();
    const price=Math.max(0,Number(document.getElementById('customMattressPrice')?.value)||0);
    const desc=(document.getElementById('customMattressDesc')?.value||'').trim();
    const badgeType=document.getElementById('customMattressBadge')?.value||'none';
    const stock=Math.max(0,parseInt(document.getElementById('customMattressStock')?.value||'10',10)||0);
    const manualRupture=!!document.getElementById('customMattressRupture')?.checked;
    if(!name) return alert('Donnez un nom au matelas.');
    reglages.customMattresses.push({
      id:'cm_'+Date.now(),
      name,
      price,
      desc:desc||'Matelas personnalisé Lago.',
      badgeType,
      stock,
      manualRupture,
      rupture:manualRupture || stock<=0
    });
    closeCustomMattressModal();
    renderCustomMattressesAdmin();
    renderCustomMattressesClient();
    saveAll();
    alert('Matelas ajouté ✅');
  };

  window.renderCustomMattressesAdmin=function(){
    ensureV44Data();
    const grid=document.querySelector('#admSettings .admin-grid');
    if(!grid) return;

    document.querySelectorAll('.admin-custom-row, .admin-custom-empty').forEach(el=>el.remove());
    const legacyList=document.getElementById('adminCustomMattressList');
    if(legacyList) legacyList.remove();

    const oldTiles=[...grid.querySelectorAll('.admin-custom-item, #addCustomMattressAdminTile')];
    oldTiles.forEach(el=>el.remove());

    reglages.customMattresses.forEach((m,i)=>{
      const tile=document.createElement('div');
      tile.className='admin-custom-item';
      tile.dataset.index=String(i);
      tile.innerHTML=`
        <div class="admin-custom-item-head">
          <strong>${m.name}</strong>
          <button type="button" class="danger" onclick="deleteCustomMattress(${i})">✕</button>
        </div>
        <div class="admin-custom-item-desc">${m.desc||'Matelas personnalisé Lago.'}</div>
        <div class="admin-custom-item-badge">${badgeLabel(m.badgeType)}</div>
        <label class="admin-label">Prix (€)</label>
        <input type="number" class="admin-input cm-price-compact" value="${Number(m.price||0)}">
        <label class="admin-label">Stock disponible</label>
        <input type="number" class="admin-input cm-stock-compact" value="${Number(m.stock||0)}" min="0" step="1">
        <label class="admin-custom-check"><input type="checkbox" class="cm-rupture-compact" ${m.manualRupture?'checked':''}> Rupture manuelle</label>
      `;
      grid.appendChild(tile);
    });

    const addTile=document.createElement('div');
    addTile.id='addCustomMattressAdminTile';
    addTile.className='admin-custom-add-tile';
    addTile.innerHTML='<button type="button" onclick="openCustomMattressModal()">＋<span>Ajouter un matelas</span></button>';
    grid.appendChild(addTile);
  };

  window.syncCustomMattressesFromAdmin=function(){
    ensureV44Data();
    const tiles=[...document.querySelectorAll('#admSettings .admin-grid .admin-custom-item')];
    reglages.customMattresses=reglages.customMattresses.map((m,i)=>{
      const tile=tiles[i];
      if(!tile) return m;
      const price=Math.max(0,Number(tile.querySelector('.cm-price-compact')?.value)||0);
      const stock=Math.max(0,parseInt(tile.querySelector('.cm-stock-compact')?.value||'0',10)||0);
      const manualRupture=!!tile.querySelector('.cm-rupture-compact')?.checked;
      return {...m, price, stock, manualRupture, rupture:manualRupture || stock<=0};
    });
  };

  window.renderCustomMattressesClient=function(){
    ensureV44Data();
    const anchor=document.getElementById('matelasBebe');
    if(!anchor || !anchor.parentNode) return;
    let wrap=document.getElementById('customMattressesContainer');
    if(!wrap){
      wrap=document.createElement('div');
      wrap.id='customMattressesContainer';
      anchor.insertAdjacentElement('afterend', wrap);
    }
    wrap.innerHTML=reglages.customMattresses.map(m=>`<div class="mattress ${m.rupture?'out-of-stock':''}" data-name="${String(m.name).replace(/"/g,'&quot;')}" data-price="${Number(m.price||0)}">${badgeHtmlV44(m.badgeType)}<div style="display:flex;justify-content:space-between;align-items:center;"><span><strong>${m.name}</strong><br><small style="color:var(--text-dim)">${m.desc||'Matelas personnalisé Lago.'}</small></span><span style="font-weight:800;">${Number(m.price||0)} €</span></div><div class="rupture-badge" style="display:${m.rupture?'block':'none'};color:var(--accent-red);font-size:12px;font-weight:bold;margin-top:5px;">Rupture de stock</div></div>`).join('');
    try{ attacherEvenementsClics(); }catch(_e){}
  };

  const prevDeleteCustomMattress=window.deleteCustomMattress;
  window.deleteCustomMattress=function(index){
    ensureV44Data();
    const target=reglages.customMattresses[index];
    if(!target) return;
    if(!confirm('Supprimer ce matelas personnalisé ?')) return;
    reglages.customMattresses.splice(index,1);
    if(typeof cart!=='undefined' && Array.isArray(cart)) cart=cart.filter(item=>item.name!==target.name);
    renderCustomMattressesAdmin();
    renderCustomMattressesClient();
    if(typeof updateCart==='function') updateCart();
    saveAll();
  };

  function forceResetPaymentOverlay(){
    const overlay=document.getElementById('paymentOverlay');
    if(!overlay) return;
    overlay.classList.remove('show');
    overlay.style.pointerEvents='none';
    overlay.style.visibility='hidden';
    delete overlay.dataset.mode;
    const title=document.querySelector('#paymentOverlay .pay-title');
    if(title) title.textContent='Ajouter une carte';
  }

  function setupAddCardOverlay(){
    const overlay=document.getElementById('paymentOverlay');
    if(!overlay) return;
    overlay.dataset.mode='add-card';
    overlay.style.pointerEvents='auto';
    overlay.style.visibility='visible';
    const title=document.querySelector('#paymentOverlay .pay-title');
    if(title) title.textContent='Ajouter une carte';
    const btn=document.getElementById('cardPayBtn');
    if(btn) btn.textContent='Ajouter la carte';
    const amount=document.getElementById('payAmountDisplay');
    if(amount) amount.style.display='none';
    try{ selectedSavedCardIndex=-1; }catch(_e){}
    try{ if(typeof showNewCardForm==='function') showNewCardForm(true); }catch(_e){}
    try{ if(typeof renderSavedCardsInPayment==='function') renderSavedCardsInPayment(); }catch(_e){}
    const save=document.getElementById('saveCardCheck');
    if(save) save.checked=true;
  }

  window.openWalletAddCard=function(){
    ensureV44Data();
    forceResetPaymentOverlay();
    if((reglages.savedCards||[]).length>=3){
      const ok=confirm('Vous avez déjà 3 cartes enregistrées. Veuillez remplacer une carte pour en ajouter une nouvelle.');
      if(!ok) return;
    }
    window.openPaymentModal(0,function(){ if(typeof renderWalletPage==='function') renderWalletPage(); });
    setTimeout(setupAddCardOverlay,70);
    setTimeout(setupAddCardOverlay,180);
  };

  window.renderWalletPage=function(){
    ensureV44Data();
    const box=document.getElementById('walletPageContent'); if(!box) return;
    if(!Array.isArray(reglages.savedCards)) reglages.savedCards=[];
    const cards=reglages.savedCards;
    let html='<div class="wallet-v39-header"><h4>Mes cartes</h4><p>Ajoutez jusqu’à 3 cartes. Touchez une mini-carte pour modifier son design.</p></div>';
    html+=cards.length
      ? `<div class="wallet-v39-list">`+cards.map((c,i)=>`<div class="wallet-v39-card"><div class="wallet-v39-card-main">${savedCardMiniHtml(c).replace('<div class="saved-card-mini', `<div onclick="openSavedCardDesignPicker(${i},event)" title="Modifier le design" class="saved-card-mini`)}<div class="wallet-v39-meta"><h4>${c.type||'CB'} •••• ${c.last4||'0000'}</h4><p>${c.holder||'CLIENT LAGO'}</p><p>Expiration ${c.expiry||'MM/AA'}${c.design?` • ${getCardDesignName(c.design)}`:''}</p></div></div><div class="wallet-v39-actions"><button onclick="openSavedCardDesignPicker(${i},event)">Modifier le design</button><button class="secondary" onclick="deleteSavedCard(${i});renderWalletPage();">Supprimer</button></div></div>`).join('')+'</div>'
      : '<div class="wallet-v39-empty">Aucune carte enregistrée.</div>';
    html+=`<div class="wallet-action-strip wallet-action-strip-v44"><button id="walletAddCardBtn" class="wallet-v39-add" type="button">＋ Ajouter une carte</button></div>`;
    box.innerHTML=html;
    const addBtn=document.getElementById('walletAddCardBtn');
    if(addBtn){
      addBtn.onclick=(e)=>{ e.preventDefault(); e.stopPropagation(); openWalletAddCard(); return false; };
      addBtn.addEventListener('touchend',function(e){ e.preventDefault(); e.stopPropagation(); openWalletAddCard(); },{passive:false});
    }
    setTimeout(()=>{
      const overlay=document.getElementById('paymentOverlay');
      if(overlay && !overlay.classList.contains('show')){ overlay.style.pointerEvents='none'; overlay.style.visibility='hidden'; }
    },40);
  };

  const prevClosePaymentV44=window.closePayment;
  window.closePayment=function(){
    try{ prevClosePaymentV44(); }catch(_e){}
    const overlay=document.getElementById('paymentOverlay');
    if(overlay){
      overlay.classList.remove('show');
      overlay.style.pointerEvents='none';
      overlay.style.visibility='hidden';
      delete overlay.dataset.mode;
    }
    setTimeout(()=>{ if(overlay){ overlay.style.pointerEvents=''; overlay.style.visibility=''; } },80);
  };

  function refreshAdminOfferBox(){
    const box=document.getElementById('adminOffersPreview');
    if(box) box.classList.add('admin-offers-preview-v44');
  }

  function getOfferLib(){ return (typeof LAGO_PROMO_LIBRARY!=='undefined')?LAGO_PROMO_LIBRARY:[]; }
  function getPremiumLib(){ return (typeof PREMIUM_PROMOS!=='undefined')?PREMIUM_PROMOS:[]; }
  function getOfferById(id){ return getOfferLib().find(p=>p.id===id) || getPremiumLib().find(p=>p.id===id) || null; }
  window.v44OfferMode=window.v44OfferMode||'normal';

  window.renderAdminOffersPreview=function(){
    ensureV44Data();
    const box=document.getElementById('adminOffersPreview'); if(!box) return;
    const normal=(reglages.adminVisiblePromoIds||[]).slice(0,3).map(getOfferById).filter(Boolean);
    const premium=(reglages.adminVisiblePremiumPromoIds||[]).slice(0,3).map(getOfferById).filter(Boolean);
    const chip=(offer,prem)=>`<span class="admin-offer-chip ${prem?'premium-chip':''}">${offer.icon||'🎁'} ${offer.title}</span>`;
    box.innerHTML=`<div class="admin-offers-preview-mini"><div class="mini-col"><div class="mini-title">Offres normales</div><div class="mini-chips">${normal.map(o=>chip(o,false)).join('')||'<span class="mini-empty">Aucune offre</span>'}</div></div><div class="mini-col"><div class="mini-title premium">Offres premium</div><div class="mini-chips">${premium.map(o=>chip(o,true)).join('')||'<span class="mini-empty">Aucune offre</span>'}</div></div></div>`;
    refreshAdminOfferBox();
  };

  window.v42SwitchOfferMode=function(mode){ window.v44OfferMode=mode; renderAdminOfferLibrary(); };
  window.renderAdminOfferLibrary=function(){
    const wrap=document.getElementById('adminOffersLibrary'); if(!wrap) return;
    const query=(document.getElementById('adminOffersSearch')?.value||'').trim().toLowerCase();
    const premium=window.v44OfferMode==='premium';
    const lib=(premium?getPremiumLib():getOfferLib()).filter(o=>!query || (`${o.title} ${o.desc}`).toLowerCase().includes(query));
    const selected=premium?(reglages.adminVisiblePremiumPromoIds||[]):(reglages.adminVisiblePromoIds||[]);
    const count=selected.length;
    wrap.innerHTML=`<div class="admin-offers-tabs v44"><button class="${!premium?'active':''}" type="button" onclick="v42SwitchOfferMode('normal')">Offres normales</button><button class="${premium?'active':''}" type="button" onclick="v42SwitchOfferMode('premium')">Offres premium</button></div><div class="admin-offer-limit">${count}/3 offres sélectionnées</div><div class="admin-offer-scroll">${lib.map(o=>{ const checked=selected.includes(o.id); const disabled=!checked && count>=3; return `<label class="admin-offer-row ${premium?'premium-row':''} ${disabled?'disabled':''}"><input type="checkbox" value="${o.id}" ${checked?'checked':''} ${disabled?'disabled':''}><div><h4>${o.icon||'🎁'} ${o.title}</h4><p>${o.desc||''}</p><p>Dès ${Number(o.min||0).toFixed(0)}€ • -${o.percent||0}% ${o.target?`• ${o.target}`:'• Tous les matelas'}${premium?' • Lago+':''}</p></div></label>`; }).join('')}</div>`;
  };
  window.saveAdminOffersSelection=function(){
    const checked=[...document.querySelectorAll('#adminOffersLibrary input[type="checkbox"]:checked')].map(el=>el.value).slice(0,3);
    if(!checked.length) return alert('Sélectionnez entre 1 et 3 offres.');
    if(window.v44OfferMode==='premium') reglages.adminVisiblePremiumPromoIds=checked;
    else reglages.adminVisiblePromoIds=checked;
    saveAll(); renderAdminOffersPreview(); renderClientPromotions(); renderAdminOfferLibrary(); alert('Sélection mise à jour.');
  };

  function decrementStockFromSnapshot(snapshot){
    ensureV44Data();
    (snapshot||[]).forEach(item=>{
      const key=BUILTIN_NAME_TO_KEY[item.name];
      const qty=Math.max(1,Number(item.qty)||1);
      if(key){
        reglages['stock'+key]=Math.max(0, Number(reglages['stock'+key]||0)-qty);
        reglages['rupture'+key]=!!reglages['manualRupture'+key] || Number(reglages['stock'+key])<=0;
        return;
      }
      const cm=(reglages.customMattresses||[]).find(m=>m.name===item.name);
      if(cm){
        cm.stock=Math.max(0, Number(cm.stock||0)-qty);
        cm.rupture=!!cm.manualRupture || Number(cm.stock)<=0;
      }
    });
    applyBuiltinStockStatesToDom();
    renderCustomMattressesAdmin();
    renderCustomMattressesClient();
  }

  const prevOpenPaymentV44=window.openPaymentModal;
  window.openPaymentModal=function(amount,cb){
    if(Number(amount)>0 && typeof cart!=='undefined' && Array.isArray(cart) && cart.length){
      const snapshot=cart.map(item=>({name:item.name, qty:item.qty||1}));
      return prevOpenPaymentV44(amount,function(){
        decrementStockFromSnapshot(snapshot);
        if(typeof cb==='function') cb();
        try{ if(typeof mettreAJourVitrine==='function') mettreAJourVitrine(); }catch(_e){}
        saveAll();
      });
    }
    return prevOpenPaymentV44(amount,cb);
  };

  const saveBtn=document.getElementById('saveAdminBtn');
  const prevSaveAdmin=saveBtn?.onclick;
  if(saveBtn) saveBtn.onclick=function(){
    if(typeof prevSaveAdmin==='function') prevSaveAdmin.call(this);
    ensureV44Data();
    injectBuiltinStockInputs();
    saveBuiltinStockInputs();
    if(typeof syncCustomMattressesFromAdmin==='function') syncCustomMattressesFromAdmin();
    applyBuiltinStockStatesToDom();
    refreshBuiltinAdminInputs();
    renderCustomMattressesAdmin();
    renderCustomMattressesClient();
    if(typeof mettreAJourVitrine==='function') mettreAJourVitrine();
    saveAll();
  };

  function bootV44(){
    ensureV44Data();
    syncHomeLabels();
    injectBuiltinStockInputs();
    ensureCustomModalFields();
    refreshBuiltinAdminInputs();
    applyBuiltinStockStatesToDom();
    if(typeof renderWalletPage==='function') renderWalletPage();
    if(typeof renderCustomMattressesAdmin==='function') renderCustomMattressesAdmin();
    if(typeof renderCustomMattressesClient==='function') renderCustomMattressesClient();
    if(typeof renderAdminOffersPreview==='function') renderAdminOffersPreview();
    refreshAdminOfferBox();
    saveAll();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bootV44); else bootV44();
})();

/* ===== V46 — reprise propre depuis V44 : wallet indépendant, offres premium, custom matelas simple, CA stable ===== */
(function(){
  const V46_PREMIUM_PROMOS = Array.from({length:50},(_,i)=>{
    const n=i+1;
    const icons=['👑','💎','🚀','🌙','🛏️','⚡','🎁','🏆','✨','🧊'];
    const titles=[
      '-25€ dès 45€ d’achat','-30% sur Le Duo','Livraison boostée -20%','Pack nuit VIP','Confort premium -22%',
      'Offre Lago+ royale','Soirée VIP -18%','Matelas premium deal','Réduction membre fidèle','Boost confort Lago+'
    ];
    const title=titles[i%titles.length] + (i>=10?` #${n}`:'');
    return {id:'vip'+String(n).padStart(2,'0'),icon:icons[i%icons.length],title,desc:'Offre réservée aux membres Lago+.',min:25+(i%8)*5,percent:15+(i%16),premium:true,expire:'Réservé Lago+'};
  });
  const V46_NORMAL_FALLBACK = [
    {id:'promo02',icon:'🌙',title:'-15% sur votre prochaine nuit',desc:'Valable dès 25€ d’achat.',min:25,percent:15,expire:'Cette semaine'},
    {id:'promo04',icon:'🔥',title:'-12% sur Le Duo',desc:'Le deux places devient encore plus rentable.',min:20,percent:12,target:'Le Duo',expire:'Aujourd’hui'},
    {id:'promo10',icon:'🏡',title:'Première commande',desc:'Offre découverte Lago.',min:15,percent:10,expire:'En ce moment'}
  ];
  let v46OfferMode='normal';
  let v46EditingCustomIndex=null;

  function normalOffers(){
    try{ if(typeof LAGO_PROMO_LIBRARY!=='undefined' && Array.isArray(LAGO_PROMO_LIBRARY) && LAGO_PROMO_LIBRARY.length) return LAGO_PROMO_LIBRARY; }catch(e){}
    return V46_NORMAL_FALLBACK;
  }
  function premiumOffers(){ return V46_PREMIUM_PROMOS; }
  function promoById46(id){ return normalOffers().find(p=>p.id===id) || premiumOffers().find(p=>p.id===id) || null; }
  function ensureV46(){
    if(!Array.isArray(reglages.adminVisiblePromoIds) || !reglages.adminVisiblePromoIds.length) reglages.adminVisiblePromoIds=['promo02','promo04','promo10'];
    if(!Array.isArray(reglages.adminVisiblePremiumPromoIds) || !reglages.adminVisiblePremiumPromoIds.length) reglages.adminVisiblePremiumPromoIds=['vip01','vip02','vip03'];
    reglages.adminVisiblePromoIds=reglages.adminVisiblePromoIds.filter(id=>normalOffers().some(p=>p.id===id)).slice(0,3);
    if(!reglages.adminVisiblePromoIds.length) reglages.adminVisiblePromoIds=['promo02','promo04','promo10'];
    reglages.adminVisiblePremiumPromoIds=reglages.adminVisiblePremiumPromoIds.filter(id=>premiumOffers().some(p=>p.id===id)).slice(0,3);
    if(!reglages.adminVisiblePremiumPromoIds.length) reglages.adminVisiblePremiumPromoIds=['vip01','vip02','vip03'];
    if(!Array.isArray(reglages.customMattresses)) reglages.customMattresses=[];
    reglages.customMattresses=reglages.customMattresses.map((m,i)=>({
      id:m.id||('cm_'+Date.now()+'_'+i),
      name:m.name||('Matelas '+(i+1)),
      price:Math.max(0,Number(m.price)||0),
      desc:m.desc||'Matelas personnalisé Lago.',
      badgeType:m.badgeType||'none',
      stock:Math.max(0,parseInt(m.stock??10,10)||0),
      rupture:!!m.rupture
    }));
  }
  function badgeHtml46(type){
    if(type==='hot') return '<div class="badge badge-hot">🔥 Best-Seller</div>';
    if(type==='warn') return '<div class="badge badge-warn">Idéal Dépannage</div>';
    if(type==='blue') return '<div class="badge badge-blue">🍼 Famille</div>';
    return '';
  }
  function badgeLabel46(type){
    if(type==='hot') return 'Best-Seller';
    if(type==='warn') return 'Idéal dépannage';
    if(type==='blue') return 'Famille';
    return 'Aucun';
  }

  // WALLET : modal indépendant, aucune interférence avec le paiement commande.
  function ensureWalletCardModal(){
    if(document.getElementById('v46WalletCardModal')) return;
    const modal=document.createElement('div');
    modal.id='v46WalletCardModal';
    modal.innerHTML=`<div class="v46-wallet-sheet">
      <button class="v46-wallet-close" type="button" onclick="closeV46WalletCardModal()">✕</button>
      <h3>Ajouter une carte</h3>
      <p>Enregistrez une carte dans votre Wallet Lago.</p>
      <input id="v46CardNumber" inputmode="numeric" placeholder="Numéro de carte" maxlength="19">
      <input id="v46CardHolder" placeholder="Nom du titulaire">
      <div class="v46-wallet-row"><input id="v46CardExpiry" placeholder="MM/AA" maxlength="5"><input id="v46CardCVV" inputmode="numeric" placeholder="CVV" maxlength="4"></div>
      <button class="v46-wallet-submit" type="button" onclick="saveV46WalletCard()">Ajouter la carte</button>
    </div>`;
    document.body.appendChild(modal);
    const num=modal.querySelector('#v46CardNumber');
    const exp=modal.querySelector('#v46CardExpiry');
    num.addEventListener('input',()=>{ let v=num.value.replace(/\D/g,'').slice(0,16); num.value=v.replace(/(.{4})/g,'$1 ').trim(); });
    exp.addEventListener('input',()=>{ let v=exp.value.replace(/\D/g,'').slice(0,4); if(v.length>2) v=v.slice(0,2)+'/'+v.slice(2); exp.value=v; });
  }
  window.openWalletAddCard=function(){
    ensureV46(); ensureWalletCardModal();
    if((reglages.savedCards||[]).length>=3){
      const ok=confirm('Vous avez déjà 3 cartes enregistrées. Voulez-vous remplacer une carte ?');
      if(!ok) return;
    }
    ['v46CardNumber','v46CardHolder','v46CardExpiry','v46CardCVV'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
    document.getElementById('v46WalletCardModal').classList.add('show');
  };
  window.closeV46WalletCardModal=function(){ document.getElementById('v46WalletCardModal')?.classList.remove('show'); };
  window.saveV46WalletCard=function(){
    if(!Array.isArray(reglages.savedCards)) reglages.savedCards=[];
    const num=(document.getElementById('v46CardNumber')?.value||'').replace(/\D/g,'');
    const holder=(document.getElementById('v46CardHolder')?.value||'').trim();
    const expiry=(document.getElementById('v46CardExpiry')?.value||'').trim();
    const cvv=(document.getElementById('v46CardCVV')?.value||'').trim();
    if(num.length<16) return alert('Numéro de carte invalide.');
    if(!holder) return alert('Entrez le nom du titulaire.');
    if(expiry.length<5) return alert('Date invalide.');
    if(cvv.length<3) return alert('CVV invalide.');
    const card={type:num.startsWith('4')?'Visa':(num.startsWith('5')?'Mastercard':'CB'),last4:num.slice(-4),holder:holder.toUpperCase(),expiry,design:typeof normalizeCardDesignId==='function'?normalizeCardDesignId(currentCardDesign):'classic'};
    if(reglages.savedCards.length>=3){
      const list=reglages.savedCards.map((c,i)=>`${i+1}. ${c.type} •••• ${c.last4}`).join('\n');
      const choice=prompt(`Choisissez la carte à remplacer :\n\n${list}\n\nTapez 1, 2 ou 3.`, '1');
      if(choice===null) return;
      const idx=Number(choice)-1;
      if(idx<0||idx>2) return alert('Choix invalide.');
      reglages.savedCards[idx]=card;
    } else reglages.savedCards.push(card);
    saveAll(); closeV46WalletCardModal(); renderWalletPage();
  };
  window.renderWalletPage=function(){
    ensureV46();
    const box=document.getElementById('walletPageContent'); if(!box) return;
    const cards=reglages.savedCards||[];
    let html='<div class="wallet-v39-header"><h4>Mes cartes</h4><p>Ajoutez jusqu’à 3 cartes. Touchez une mini-carte pour modifier son design.</p></div>';
    html+=cards.length?'<div class="wallet-v39-list">'+cards.map((c,i)=>`<div class="wallet-v39-card"><div class="wallet-v39-card-main">${savedCardMiniHtml(c).replace('<div class="saved-card-mini',`<div onclick="openSavedCardDesignPicker(${i},event)" class="saved-card-mini`)}<div class="wallet-v39-meta"><h4>${c.type} •••• ${c.last4}</h4><p>${c.holder}</p><p>Expiration ${c.expiry}${c.design?` • ${getCardDesignName(c.design)}`:''}</p></div></div><div class="wallet-v39-actions"><button onclick="openSavedCardDesignPicker(${i},event)">Modifier le design</button><button class="secondary" onclick="deleteSavedCard(${i});renderWalletPage();">Supprimer</button></div></div>`).join('')+'</div>':'<div class="wallet-v39-empty">Aucune carte enregistrée.</div>';
    html+=`<div class="wallet-action-strip"><button class="wallet-v39-add" type="button" onclick="openWalletAddCard()">＋ Ajouter une carte</button></div>`;
    box.innerHTML=html;
  };

  // OFFRES : preview compacte, 3 normales + 3 premium, 50 premium dans le sélecteur.
  window.renderAdminOffersPreview=function(){
    ensureV46();
    const box=document.getElementById('adminOffersPreview'); if(!box) return;
    const chips=(ids,premium)=>ids.map(id=>promoById46(id)).filter(Boolean).map(o=>`<span class="admin-offer-chip ${premium?'premium-chip':''}">${o.icon} ${o.title}</span>`).join('') || '<span class="v46-empty-offer">Aucune offre</span>';
    box.classList.add('v46-offer-box');
    box.innerHTML=`<div class="v46-offer-line"><b>Normales</b><div>${chips(reglages.adminVisiblePromoIds,false)}</div></div><div class="v46-offer-line premium"><b>Premium</b><div>${chips(reglages.adminVisiblePremiumPromoIds,true)}</div></div><button type="button" class="v46-offer-btn" onclick="openAdminOffersModal()">Voir / choisir parmi 50 offres</button>`;
  };
  window.renderAdminOfferLibrary=function(){
    ensureV46();
    const wrap=document.getElementById('adminOffersLibrary'); if(!wrap) return;
    const q=(document.getElementById('adminOffersSearch')?.value||'').toLowerCase();
    const premium=v46OfferMode==='premium';
    const lib=(premium?premiumOffers():normalOffers()).filter(o=>!q||(`${o.title} ${o.desc}`).toLowerCase().includes(q));
    const selected=premium?reglages.adminVisiblePremiumPromoIds:reglages.adminVisiblePromoIds;
    wrap.innerHTML=`<div class="admin-offers-tabs v46"><button class="${!premium?'active':''}" onclick="v46SwitchOfferMode('normal')" type="button">Offres normales</button><button class="${premium?'active':''}" onclick="v46SwitchOfferMode('premium')" type="button">Offres premium</button></div><div class="v46-offer-count">${selected.length}/3 sélectionnées</div><div class="v46-offer-scroll">${lib.map(o=>{const checked=selected.includes(o.id); const disabled=!checked&&selected.length>=3; return `<label class="admin-offer-row ${premium?'premium-row':''} ${disabled?'disabled':''}"><input type="checkbox" value="${o.id}" ${checked?'checked':''} ${disabled?'disabled':''}><div><h4>${o.icon} ${o.title}</h4><p>${o.desc}</p><p>Dès ${Number(o.min||0).toFixed(0)}€ • -${o.percent||0}%${premium?' • Lago+':''}</p></div></label>`;}).join('')}</div>`;
  };
  window.v46SwitchOfferMode=function(mode){ v46OfferMode=mode; renderAdminOfferLibrary(); };
  window.saveAdminOffersSelection=function(){
    const ids=[...document.querySelectorAll('#adminOffersLibrary input[type="checkbox"]:checked')].map(i=>i.value).slice(0,3);
    if(!ids.length) return alert('Sélectionnez au moins une offre.');
    if(v46OfferMode==='premium') reglages.adminVisiblePremiumPromoIds=ids; else reglages.adminVisiblePromoIds=ids;
    saveAll(); renderAdminOffersPreview(); renderAdminOfferLibrary(); renderClientPromotions();
  };
  window.renderClientPromotions=function(){
    ensureV46();
    const box=document.getElementById('clientPromoList'); if(!box) return;
    const normal=reglages.adminVisiblePromoIds.map(id=>promoById46(id)).filter(Boolean).slice(0,3).map(p=>({...p,premium:false}));
    const prem=reglages.isPremium?reglages.adminVisiblePremiumPromoIds.map(id=>promoById46(id)).filter(Boolean).slice(0,3).map(p=>({...p,premium:true})):[];
    const card=p=>{const used=(reglages.usedPromotionIds||[]).includes(p.id); const claimed=reglages.activeRewardPromo===p.id || (reglages.claimedPromotionIds||[]).includes(p.id); return `<div class="promo-clean-card ${p.premium?'premium-offer':''}"><div class="promo-clean-icon">${p.icon}</div><div class="promo-clean-main"><h4>${p.title}</h4><p>${p.desc}</p><p class="promo-expire">${p.expire||'En ce moment'} • Dès ${Number(p.min||0).toFixed(0)}€</p></div><button class="${used?'used-promo':''}" onclick="claimFixedPromotion('${p.id}')">${used?'Déjà utilisé':(claimed?'Reçue':'Recevoir')}</button></div>`;};
    box.innerHTML=[...normal,...prem].map(card).join('') || '<div class="empty-clean">Aucune promotion visible.</div>';
    const span=document.querySelector('#promoBellBtn span'); if(span) span.textContent=String(normal.length+prem.length);
  };
  window.claimFixedPromotion=function(id){
    const p=promoById46(id); if(!p) return;
    if(p.premium&&!reglages.isPremium) return alert('Offre réservée aux membres Lago+.');
    if((reglages.usedPromotionIds||[]).includes(id)) return alert('Cette offre a déjà été utilisée.');
    reglages.claimedPromotionIds=[id]; reglages.activeRewardPromo=id; promoActive=false; saveAll(); renderClientPromotions(); updateCart();
  };
  window.rewardPromoDiscount=function(){
    const p=promoById46(reglages.activeRewardPromo); if(!p) return 0;
    let base=0; cart.forEach(c=>{ if(!p.target||c.name===p.target) base+=(Number(c.price)||0)*(Number(c.qty)||1); });
    if(base<Number(p.min||0)) return 0;
    return Math.round(base*(Number(p.percent)||0)/100*100)/100;
  };
  try{ rewardPromoDiscount=window.rewardPromoDiscount; }catch(e){}

  // MATELAS CUSTOM : affichage patron identique aux autres cases, modification par bulle.
  function openCustomEditor(index=null){
    if(typeof ensureCustomMattressModal==='function') ensureCustomMattressModal();
    const modal=document.getElementById('customMattressModal'); if(!modal) return;
    const m=index===null?null:reglages.customMattresses[index];
    modal.dataset.editIndex=index===null?'':String(index);
    const title=modal.querySelector('.custom-mattress-head h3'); if(title) title.textContent=m?'Modifier le matelas':'Ajouter un matelas';
    const btn=modal.querySelector('.custom-mattress-actions button:last-child'); if(btn) btn.textContent=m?'Enregistrer':'Ajouter le matelas';
    document.getElementById('customMattressName').value=m?.name||'';
    document.getElementById('customMattressPrice').value=m?Number(m.price||0):'';
    document.getElementById('customMattressDesc').value=m?.desc||'';
    document.getElementById('customMattressBadge').value=m?.badgeType||'none';
    if(document.getElementById('customMattressStock')) document.getElementById('customMattressStock').value=m?Number(m.stock||0):10;
    document.getElementById('customMattressRupture').checked=!!m?.rupture;
    modal.classList.add('show');
  }
  window.openCustomMattressModal=function(index){ openCustomEditor(typeof index==='number'?index:null); };
  window.createCustomMattress=function(){
    ensureV46();
    const modal=document.getElementById('customMattressModal');
    const idxRaw=modal?.dataset.editIndex||'';
    const idx=idxRaw===''?null:Number(idxRaw);
    const data={
      id:idx===null?'cm_'+Date.now():reglages.customMattresses[idx].id,
      name:(document.getElementById('customMattressName').value||'').trim(),
      price:Math.max(0,Number(document.getElementById('customMattressPrice').value)||0),
      desc:(document.getElementById('customMattressDesc').value||'').trim()||'Matelas personnalisé Lago.',
      badgeType:document.getElementById('customMattressBadge').value||'none',
      stock:Math.max(0,parseInt(document.getElementById('customMattressStock')?.value||'10',10)||0),
      rupture:!!document.getElementById('customMattressRupture').checked
    };
    if(!data.name) return alert('Donnez un nom au matelas.');
    if(idx===null) reglages.customMattresses.push(data); else reglages.customMattresses[idx]=data;
    modal?.classList.remove('show'); saveAll(); renderCustomMattressesAdmin(); renderCustomMattressesClient();
  };
  window.renderCustomMattressesAdmin=function(){
    ensureV46();
    const grid=document.querySelector('#admSettings .admin-grid'); if(!grid) return;
    grid.querySelectorAll('.admin-custom-row,#adminCustomMattressList,.admin-custom-item,#addCustomMattressAdminTile,.v46-custom-price-tile').forEach(e=>e.remove());
    reglages.customMattresses.forEach((m,i)=>{
      const tile=document.createElement('div');
      tile.className='v46-custom-price-tile';
      tile.innerHTML=`<label class="admin-label">Prix ${m.name.toUpperCase()} (€)</label><input type="number" class="admin-input v46-cm-price" value="${Number(m.price||0)}"><label class="admin-label">Stock disponible</label><input type="number" class="admin-input v46-cm-stock" value="${Number(m.stock||0)}"><label class="v46-rupture-line"><input type="checkbox" class="v46-cm-rupture" ${m.rupture?'checked':''}> Rupture</label><button type="button" class="v46-small-edit" onclick="openCustomMattressModal(${i})">Modifier infos</button>`;
      grid.appendChild(tile);
    });
    const add=document.createElement('div'); add.id='addCustomMattressAdminTile'; add.className='admin-custom-add-tile v46-add-mattress'; add.innerHTML='<button type="button" onclick="openCustomMattressModal()">＋<span>Ajouter un matelas</span></button>'; grid.appendChild(add);
  };
  window.syncCustomMattressesFromAdmin=function(){
    const tiles=[...document.querySelectorAll('.v46-custom-price-tile')];
    tiles.forEach((tile,i)=>{ if(!reglages.customMattresses[i]) return; reglages.customMattresses[i].price=Math.max(0,Number(tile.querySelector('.v46-cm-price').value)||0); reglages.customMattresses[i].stock=Math.max(0,parseInt(tile.querySelector('.v46-cm-stock').value||'0',10)||0); reglages.customMattresses[i].rupture=!!tile.querySelector('.v46-cm-rupture').checked || reglages.customMattresses[i].stock<=0; });
  };
  window.renderCustomMattressesClient=function(){
    ensureV46();
    const anchor=document.getElementById('matelasBebe'); if(!anchor) return;
    let wrap=document.getElementById('customMattressesContainer'); if(!wrap){wrap=document.createElement('div'); wrap.id='customMattressesContainer'; anchor.insertAdjacentElement('afterend',wrap);}
    wrap.innerHTML=reglages.customMattresses.map(m=>`<div class="mattress ${m.rupture?'out-of-stock':''}" data-name="${String(m.name).replace(/"/g,'&quot;')}" data-price="${Number(m.price||0)}">${badgeHtml46(m.badgeType)}<div style="display:flex;justify-content:space-between;align-items:center;"><span><strong>${m.name}</strong><br><small style="color:var(--text-dim)">${m.desc}</small></span><span style="font-weight:800;">${Number(m.price||0)} €</span></div><div class="rupture-badge" style="display:${m.rupture?'block':'none'};color:var(--accent-red);font-size:12px;font-weight:bold;margin-top:5px;">Rupture de stock</div></div>`).join('');
    try{attacherEvenementsClics();}catch(e){}
  };

  // CA : modal canalisée, filtres fixes, pas de prix dans Commandes.
  function financeRows(){
    const rows=[]; const push=(date,label,amount,type,meta='')=>rows.push({date,label,amount:Number(amount)||0,type,meta});
    (reglages.adminActionLog||[]).forEach(a=>push(a.time||'--:--',a.label||'Action patron',a.amount||0,a.amount<0?'loss':'action','Journal patron'));
    (reglages.historiqueCommandes||[]).forEach(h=>push(h.date||'--',h.items||'Commande Lago',Number(h.prix)||0,'order',h.status||'Terminée'));
    (typeof fakeUsers!=='undefined'?fakeUsers:[]).forEach(u=>{ (u.historique||[]).forEach(h=>push(h.date||'--',`${u.email} — ${h.items||'Commande'}`,Number(h.prix)||0,'order',h.status||'Commande')); if(u.isVip) push(u.signupDate||'--',`${u.email} — abonnement Lago+ actif`,59.99,'premium','Client premium'); });
    return rows.slice(0,120);
  }
  window.openAdminFinanceHistory=function(filter='all'){
    const rows=financeRows(); const filtered=filter==='all'?rows:rows.filter(r=>filter==='loss'?r.amount<0:r.type===filter);
    const gains=rows.filter(r=>r.amount>0).reduce((a,r)=>a+r.amount,0); const losses=Math.abs(rows.filter(r=>r.amount<0).reduce((a,r)=>a+r.amount,0));
    const showAmount=filter!=='order';
    const content=`<div class="v46-finance"><h3>Historique financier Lago</h3><p>Commandes, Lago+, remboursements et actions patron.</p><div class="finance-history-summary"><div>Total entrées<strong style="color:var(--accent-green);">${gains.toFixed(2)}€</strong></div><div>Total pertes<strong style="color:var(--accent-red);">-${losses.toFixed(2)}€</strong></div></div><div class="finance-history-filter v46"><button onclick="openAdminFinanceHistory('all')">Tout</button><button onclick="openAdminFinanceHistory('order')">Commandes</button><button onclick="openAdminFinanceHistory('premium')">Lago+</button><button onclick="openAdminFinanceHistory('loss')">Pertes</button></div><div class="v46-finance-list">${filtered.map(r=>`<div class="finance-history-row"><div><strong>${r.label}</strong><div class="meta">${r.date} • ${r.meta}</div></div>${showAmount?`<div class="${r.amount<0?'loss':'gain'}">${r.amount>0?'+':''}${r.amount.toFixed(2)}€</div>`:''}</div>`).join('')||'<p style="color:var(--text-dim);">Aucun mouvement.</p>'}</div></div>`;
    document.getElementById('adminModalContent').innerHTML=content; document.getElementById('adminModal').classList.add('active');
  };

  const oldSaveBtn=document.getElementById('saveAdminBtn')?.onclick;
  if(document.getElementById('saveAdminBtn')) document.getElementById('saveAdminBtn').onclick=function(){ if(typeof oldSaveBtn==='function') oldSaveBtn.call(this); if(typeof syncCustomMattressesFromAdmin==='function') syncCustomMattressesFromAdmin(); saveAll(); renderCustomMattressesAdmin(); renderCustomMattressesClient(); renderAdminOffersPreview(); };

  function bootV46(){ ensureV46(); renderWalletPage(); renderAdminOffersPreview(); renderCustomMattressesAdmin(); renderCustomMattressesClient(); renderClientPromotions(); saveAll(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bootV46); else bootV46();
})();


/* ===== V47 — promos visuelles, wallet 3D restauré, avatars synchronisés, matelas custom réparés ===== */
(function(){
  const V47_STANDARD_AVATARS=[
    'https://api.dicebear.com/7.x/notionists/svg?seed=Eliott&backgroundColor=dcfce7',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Jade&backgroundColor=dbeafe',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Leo&backgroundColor=f8fafc',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Mila&backgroundColor=e0f2fe',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Noah&backgroundColor=fef3c7',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Ines&backgroundColor=fce7f3',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Sara&backgroundColor=ede9fe',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Tom&backgroundColor=fee2e2',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Nina&backgroundColor=ccfbf1',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Max&backgroundColor=e5e7eb'
  ];
  const V47_PREMIUM_AVATARS=[
    'https://api.dicebear.com/7.x/micah/svg?seed=GoldKing&backgroundColor=000000',
    'https://api.dicebear.com/7.x/micah/svg?seed=Royal&backgroundColor=1e1b4b',
    'https://api.dicebear.com/7.x/micah/svg?seed=Neon&backgroundColor=0f172a',
    'https://api.dicebear.com/7.x/micah/svg?seed=Glass&backgroundColor=e0f2fe',
    'https://api.dicebear.com/7.x/micah/svg?seed=Ruby&backgroundColor=450a0a',
    'https://api.dicebear.com/7.x/micah/svg?seed=Emerald&backgroundColor=052e16',
    'https://api.dicebear.com/7.x/micah/svg?seed=Platinum&backgroundColor=111827',
    'https://api.dicebear.com/7.x/micah/svg?seed=Violet&backgroundColor=3b0764',
    'https://api.dicebear.com/7.x/micah/svg?seed=OceanVip&backgroundColor=082f49',
    'https://api.dicebear.com/7.x/micah/svg?seed=Diamond&backgroundColor=f8fafc'
  ];
  const V47_PREMIUM_PROMOS=Array.from({length:50},(_,i)=>{
    const n=i+1;
    const icons=['👑','💎','🚀','🌙','🛏️','⚡','🎁','🏆','✨','🧊'];
    const titles=[
      '-25€ dès 45€ d’achat','-30% sur Le Duo','Livraison boostée -20%','Pack nuit VIP','Confort premium -22%',
      'Offre Lago+ royale','Soirée VIP -18%','Matelas premium deal','Réduction membre fidèle','Boost confort Lago+'
    ];
    return {
      id:'vip'+String(n).padStart(2,'0'),
      icon:icons[i%icons.length],
      title:titles[i%titles.length]+(i>=10?` #${n}`:''),
      desc:'Offre réservée aux membres Lago+.',
      min:25+(i%8)*5,
      percent:15+(i%16),
      premium:true,
      expire:'Réservé Lago+'
    };
  });
  const V47_NORMAL_FALLBACK=[
    {id:'promo02',icon:'🌙',title:'-15% sur votre prochaine nuit',desc:'Valable dès 25€ d’achat sur tous les lits.',min:25,percent:15,expire:'Cette semaine'},
    {id:'promo04',icon:'🔥',title:'-12% sur Le Duo',desc:'Le deux places devient encore plus rentable.',min:20,percent:12,target:'Le Duo',expire:'Aujourd’hui'},
    {id:'promo10',icon:'🏡',title:'Première commande',desc:'Offre découverte Lago.',min:15,percent:10,expire:'En ce moment'}
  ];

  function normalOffersV47(){
    try{
      if(typeof LAGO_PROMO_LIBRARY!=='undefined' && Array.isArray(LAGO_PROMO_LIBRARY) && LAGO_PROMO_LIBRARY.length) return LAGO_PROMO_LIBRARY;
    }catch(_e){}
    return V47_NORMAL_FALLBACK;
  }
  function premiumOffersV47(){ return V47_PREMIUM_PROMOS; }
  function promoByIdV47(id){ return normalOffersV47().find(p=>p.id===id) || premiumOffersV47().find(p=>p.id===id) || null; }

  function syncAvatarPoolsV47(){
    try{
      avatarsStandard.splice(0, avatarsStandard.length, ...V47_STANDARD_AVATARS);
      avatarsPremium.splice(0, avatarsPremium.length, ...V47_PREMIUM_AVATARS);
      if(typeof initAvatarsUI==='function') initAvatarsUI();
    }catch(_e){}
  }
  function isLegacyAvatarV47(url){
    if(!url) return true;
    return !V47_STANDARD_AVATARS.includes(url) && !V47_PREMIUM_AVATARS.includes(url);
  }
  function pickAvatarV47(index,isPremium){
    const pool=isPremium?V47_PREMIUM_AVATARS:V47_STANDARD_AVATARS;
    return pool[Math.abs(index)%pool.length];
  }
  function migrateAvatarsV47(){
    syncAvatarPoolsV47();
    if(Array.isArray(fakeUsers)){
      fakeUsers.forEach((u,idx)=>{
        if(isLegacyAvatarV47(u.avatarUrl)) u.avatarUrl=pickAvatarV47(idx,!!u.isVip);
      });
    }
    const activeUser=(window.currentUser && window.currentUser.role!=='admin') ? fakeUsers.find(u=>u.email===window.currentUser.email) : null;
    if(activeUser && isLegacyAvatarV47(activeUser.avatarUrl)) activeUser.avatarUrl=pickAvatarV47(0,!!activeUser.isVip);
    if(!reglages.avatarUrl || isLegacyAvatarV47(reglages.avatarUrl)) reglages.avatarUrl=(activeUser && activeUser.avatarUrl) || pickAvatarV47(0,false);
    if(activeUser) reglages.avatarUrl=activeUser.avatarUrl||reglages.avatarUrl;
    if(typeof appliquerAvatarEtPremium==='function') appliquerAvatarEtPremium();
  }

  function ensureWalletOverlayV47(){
    const overlay=document.getElementById('paymentOverlay');
    if(!overlay) return;
    overlay.dataset.mode='add-card';
    overlay.classList.add('show');
    overlay.style.pointerEvents='auto';
    overlay.style.visibility='visible';
    const title=document.querySelector('.pay-title');
    const amount=document.getElementById('payAmountDisplay');
    const btn=document.getElementById('cardPayBtn');
    if(title) title.textContent='Ajouter une carte';
    if(amount){ amount.textContent=''; amount.style.display='none'; }
    if(btn) btn.innerHTML='＋ Ajouter la carte';
    try{ selectedSavedCardIndex=-1; }catch(_e){}
    try{ showingNewCardForm=true; }catch(_e){}
    try{ if(typeof showNewCardForm==='function') showNewCardForm(true); }catch(_e){}
    try{ if(typeof renderSavedCardsInPayment==='function') renderSavedCardsInPayment(); }catch(_e){}
    const saveCard=document.getElementById('saveCardCheck');
    if(saveCard) saveCard.checked=true;
    ['cardNumber','cardHolder','cardExpiry','cardCVV'].forEach(id=>{
      const el=document.getElementById(id);
      if(el){
        el.value='';
        try{ el.dispatchEvent(new Event('input',{bubbles:true})); }catch(_e){}
      }
    });
    try{ if(typeof updatePaymentCardPreview==='function') updatePaymentCardPreview(); }catch(_e){}
  }

  window.openWalletAddCard=function(){
    if(typeof openPaymentModal==='function') openPaymentModal(0,function(){ if(typeof renderWalletPage==='function') renderWalletPage(); });
    setTimeout(ensureWalletOverlayV47,40);
    setTimeout(ensureWalletOverlayV47,180);
  };

  window.renderWalletPage=function(){
    const box=document.getElementById('walletPageContent');
    if(!box) return;
    if(!Array.isArray(reglages.savedCards)) reglages.savedCards=[];
    const cards=reglages.savedCards;
    let html=`<div class="wallet-v47-hero"><div><h4>Wallet Lago</h4><p>Ajoutez jusqu’à 3 cartes. Touchez une mini-carte pour modifier son design. Le bouton ci-dessous rouvre la belle carte 3D Lago.</p></div><div class="wallet-v47-hero-mini">${savedCardMiniHtml({type:'Lago',last4:'2408',holder:'CLIENT LAGO',expiry:'06/29',design:normalizeCardDesignId(currentCardDesign||reglages.selectedCardDesign||'aurora')})}</div></div>`;
    if(cards.length){
      html+=`<div class="wallet-v39-list">`+cards.map((c,i)=>`<div class="wallet-v39-card"><div class="wallet-v39-card-main">${savedCardMiniHtml(c).replace('<div class="saved-card-mini',`<div onclick="openSavedCardDesignPicker(${i},event)" title="Modifier le design" class="saved-card-mini`)}<div class="wallet-v39-meta"><h4>${c.type||'CB'} •••• ${c.last4||'0000'}</h4><p>${c.holder||'CLIENT LAGO'}</p><p>Expiration ${c.expiry||'MM/AA'}${c.design?` • ${getCardDesignName(c.design)}`:''}</p></div></div><div class="wallet-v39-actions"><button onclick="openSavedCardDesignPicker(${i},event)">Modifier le design</button><button class="secondary" onclick="deleteSavedCard(${i});renderWalletPage();">Supprimer</button></div></div>`).join('')+`</div>`;
    } else {
      html+=`<div class="wallet-v39-empty wallet-v47-empty">Aucune carte enregistrée pour le moment.</div>`;
    }
    html+=`<div class="wallet-action-strip"><button class="wallet-v39-add wallet-v47-add" type="button" onclick="openWalletAddCard()">＋ Ajouter une carte</button></div>`;
    box.innerHTML=html;
  };

  window.renderClientPromotions=function(){
    const box=document.getElementById('clientPromoList');
    if(!box) return;
    const normal=(reglages.adminVisiblePromoIds||[]).map(id=>promoByIdV47(id)).filter(Boolean).slice(0,3).map(p=>({...p,premium:false}));
    const premium=reglages.isPremium?(reglages.adminVisiblePremiumPromoIds||[]).map(id=>promoByIdV47(id)).filter(Boolean).slice(0,3).map(p=>({...p,premium:true})):[];
    const renderCard=(p,idx)=>{
      const used=(reglages.usedPromotionIds||[]).includes(p.id);
      const claimed=reglages.activeRewardPromo===p.id || (reglages.claimedPromotionIds||[]).includes(p.id);
      const buttonLabel=used?'Déjà utilisée':(claimed?'Reçue':'Recevoir');
      const buttonClass=used?'used-promo':(claimed?'claimed-promo':'');
      return `<article class="promo-showcase-card ${p.premium?'premium-offer':''}"><div class="promo-showcase-top"><div class="promo-showcase-badge">${p.premium?'Lago+':'Promo'}</div><div class="promo-showcase-chip">${p.expire||'En ce moment'}</div></div><div class="promo-showcase-body"><div class="promo-showcase-icon">${p.icon||'🎁'}</div><div class="promo-showcase-copy"><h4>${p.title}</h4><p>${p.desc||'Offre valable sur votre prochaine commande.'}</p><div class="promo-showcase-meta"><span>Dès ${Number(p.min||0).toFixed(0)}€</span><span>-${Number(p.percent||0)}%</span>${p.target?`<span>${p.target}</span>`:''}</div></div></div><button class="promo-showcase-btn ${buttonClass}" onclick="claimFixedPromotion('${p.id}')">${buttonLabel}</button></article>`;
    };
    const normalSection=normal.length?`<div class="promo-showcase-section"><div class="promo-showcase-section-title">Offres du moment</div><div class="promo-showcase-list">${normal.map(renderCard).join('')}</div></div>`:'';
    const premiumSection=premium.length?`<div class="promo-showcase-section premium"><div class="promo-showcase-section-title">Offres premium</div><div class="promo-showcase-list">${premium.map(renderCard).join('')}</div></div>`:'';
    box.innerHTML=normalSection+premiumSection || '<div class="empty-clean">Aucune promotion visible.</div>';
    const bell=document.querySelector('#promoBellBtn span');
    if(bell) bell.textContent=String(normal.length+premium.length);
  };

  function ensureCustomDataV47(){
    if(!Array.isArray(reglages.customMattresses)) reglages.customMattresses=[];
    reglages.customMattresses=reglages.customMattresses.map((m,i)=>({
      id:m.id||('cm_'+Date.now()+'_'+i),
      name:(m.name||('Matelas '+(i+1))).trim(),
      price:Math.max(0,Number(m.price)||0),
      desc:(m.desc||'Matelas personnalisé Lago.').trim(),
      badgeType:m.badgeType||'none',
      stock:Math.max(0,parseInt(m.stock??10,10)||0),
      manualRupture:typeof m.manualRupture==='boolean'?m.manualRupture:!!m.rupture,
      rupture:!!m.manualRupture || !!m.rupture || Math.max(0,parseInt(m.stock??10,10)||0)<=0
    }));
  }
  function badgeHtmlV47(type){
    if(type==='hot') return '<div class="badge badge-hot">🔥 Best-Seller</div>';
    if(type==='warn') return '<div class="badge badge-warn">Idéal Dépannage</div>';
    if(type==='blue') return '<div class="badge badge-blue">🍼 Famille</div>';
    return '';
  }
  function customMattressMarkupV47(m){
    return `<div class="mattress ${m.rupture?'out-of-stock':''}" data-name="${String(m.name).replace(/"/g,'&quot;')}" data-price="${Number(m.price||0)}">${badgeHtmlV47(m.badgeType)}<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;"><span><strong>${m.name}</strong><br><small style="color:var(--text-dim)">${m.desc||'Matelas personnalisé Lago.'}</small></span><span style="font-weight:800;white-space:nowrap;">${Number(m.price||0)} €</span></div><div class="rupture-badge" style="display:${m.rupture?'block':'none'};color:var(--accent-red);font-size:12px;font-weight:bold;margin-top:5px;">Rupture de stock</div></div>`;
  }

  window.createCustomMattress=function(){
    ensureCustomDataV47();
    const modal=document.getElementById('customMattressModal');
    const rawIndex=modal?.dataset.editIndex||'';
    const editIndex=rawIndex===''?null:Number(rawIndex);
    const stock=Math.max(0,parseInt(document.getElementById('customMattressStock')?.value||'10',10)||0);
    const manualRupture=!!document.getElementById('customMattressRupture')?.checked;
    const data={
      id:editIndex===null?('cm_'+Date.now()):reglages.customMattresses[editIndex]?.id,
      name:(document.getElementById('customMattressName')?.value||'').trim(),
      price:Math.max(0,Number(document.getElementById('customMattressPrice')?.value)||0),
      desc:(document.getElementById('customMattressDesc')?.value||'').trim()||'Matelas personnalisé Lago.',
      badgeType:document.getElementById('customMattressBadge')?.value||'none',
      stock,
      manualRupture,
      rupture:manualRupture || stock<=0
    };
    if(!data.name) return alert('Donnez un nom au matelas.');
    if(editIndex===null) reglages.customMattresses.push(data);
    else reglages.customMattresses[editIndex]=data;
    modal?.classList.remove('show');
    if(modal) delete modal.dataset.editIndex;
    window.renderCustomMattressesAdmin();
    window.renderCustomMattressesClient();
    try{ if(typeof mettreAJourVitrine==='function') mettreAJourVitrine(); }catch(_e){}
    saveAll();
  };

  window.renderCustomMattressesAdmin=function(){
    ensureCustomDataV47();
    const grid=document.querySelector('#admSettings .admin-grid');
    if(!grid) return;
    grid.querySelectorAll('.v46-custom-price-tile,.v47-custom-tile,.admin-custom-item,.admin-custom-row,#adminCustomMattressList,#addCustomMattressAdminTile,#v47AddMattressTile,.admin-custom-empty').forEach(el=>el.remove());
    reglages.customMattresses.forEach((m,i)=>{
      const tile=document.createElement('div');
      tile.className='v47-custom-tile';
      tile.dataset.index=String(i);
      tile.innerHTML=`<div class="v47-custom-tile-head"><strong>${m.name}</strong><button type="button" class="danger" onclick="deleteCustomMattress(${i})">✕</button></div><div class="v47-custom-tile-desc">${m.desc||'Matelas personnalisé Lago.'}</div><label class="admin-label">Prix ${m.name.toUpperCase()} (€)</label><input type="number" class="admin-input v47-cm-price" value="${Number(m.price||0)}"><label class="admin-label">Stock disponible</label><input type="number" min="0" step="1" class="admin-input v47-cm-stock" value="${Number(m.stock||0)}"><label class="v47-rupture-line"><input type="checkbox" class="v47-cm-rupture" ${m.manualRupture?'checked':''}> Rupture</label><button type="button" class="v47-edit-btn" onclick="openCustomMattressModal(${i})">Modifier infos</button>`;
      grid.appendChild(tile);
    });
    const addTile=document.createElement('div');
    addTile.id='v47AddMattressTile';
    addTile.className='v47-admin-add-tile';
    addTile.innerHTML='<button type="button" onclick="openCustomMattressModal()">＋<span>Ajouter un matelas</span></button>';
    grid.appendChild(addTile);
  };

  window.syncCustomMattressesFromAdmin=function(){
    ensureCustomDataV47();
    const tiles=[...document.querySelectorAll('#admSettings .admin-grid .v47-custom-tile')];
    reglages.customMattresses=reglages.customMattresses.map((m,i)=>{
      const tile=tiles[i];
      if(!tile) return m;
      const price=Math.max(0,Number(tile.querySelector('.v47-cm-price')?.value)||0);
      const stock=Math.max(0,parseInt(tile.querySelector('.v47-cm-stock')?.value||'0',10)||0);
      const manualRupture=!!tile.querySelector('.v47-cm-rupture')?.checked;
      return {...m,price,stock,manualRupture,rupture:manualRupture || stock<=0};
    });
  };

  window.deleteCustomMattress=function(index){
    ensureCustomDataV47();
    const target=reglages.customMattresses[index];
    if(!target) return;
    if(!confirm('Supprimer ce matelas personnalisé ?')) return;
    reglages.customMattresses.splice(index,1);
    if(Array.isArray(cart)) cart=cart.filter(item=>item.name!==target.name);
    window.renderCustomMattressesAdmin();
    window.renderCustomMattressesClient();
    try{ if(typeof updateCart==='function') updateCart(); }catch(_e){}
    try{ if(typeof mettreAJourVitrine==='function') mettreAJourVitrine(); }catch(_e){}
    saveAll();
  };

  window.renderCustomMattressesClient=function(){
    ensureCustomDataV47();
    const anchor=document.getElementById('matelasBebe');
    if(!anchor || !anchor.parentNode) return;
    let wrap=document.getElementById('customMattressesContainer');
    if(!wrap){
      wrap=document.createElement('div');
      wrap.id='customMattressesContainer';
      anchor.insertAdjacentElement('afterend',wrap);
    }
    wrap.innerHTML=reglages.customMattresses.map(customMattressMarkupV47).join('');
    try{ if(typeof attacherEvenementsClics==='function') attacherEvenementsClics(); }catch(_e){}
  };

  const prevSaveAdminV47=document.getElementById('saveAdminBtn')?.onclick;
  if(document.getElementById('saveAdminBtn')){
    document.getElementById('saveAdminBtn').onclick=function(){
      if(typeof prevSaveAdminV47==='function') prevSaveAdminV47.call(this);
      if(typeof syncCustomMattressesFromAdmin==='function') syncCustomMattressesFromAdmin();
      try{ if(typeof mettreAJourVitrine==='function') mettreAJourVitrine(); }catch(_e){}
      saveAll();
      renderCustomMattressesAdmin();
      renderCustomMattressesClient();
      renderClientPromotions();
    };
  }

  function bootV47(){
    migrateAvatarsV47();
    ensureCustomDataV47();
    if(typeof renderWalletPage==='function') renderWalletPage();
    if(typeof renderClientPromotions==='function') renderClientPromotions();
    if(typeof renderCustomMattressesAdmin==='function') renderCustomMattressesAdmin();
    if(typeof renderCustomMattressesClient==='function') renderCustomMattressesClient();
    saveAll();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bootV47); else bootV47();
})();

/* ===== V51 — vrai hotfix des taps principaux ===== */
(function(){
  function isVisibleOverlayOpen(){
    return !!document.querySelector('#googlePopupOverlay.show,#driverUberPopupOverlay.show,#paymentOverlay.show,#processingOverlay.show,#paySuccessOverlay.show,#v46WalletCardModal.show,#customMattressModal.show,.detail-modal.active');
  }
  function clearInactiveOverlayStyles(){
    ['googlePopupOverlay','driverUberPopupOverlay','paymentOverlay','processingOverlay','paySuccessOverlay','v46WalletCardModal','customMattressModal'].forEach(id=>{
      const el=document.getElementById(id); if(!el) return;
      const active=el.classList.contains('show') || el.classList.contains('active');
      if(!active){
        el.style.pointerEvents='none';
      }else{
        el.style.pointerEvents='auto';
      }
    });
    document.querySelectorAll('.detail-modal').forEach(el=>{
      el.style.pointerEvents=el.classList.contains('active')?'auto':'none';
    });
  }
  function v51SelectMattress(m){
    if(!m || m.classList.contains('out-of-stock')) return;
    if(m.classList.contains('selected')){
      m.classList.remove('selected');
      selectedMattress=null;
    }else{
      document.querySelectorAll('.mattress').forEach(x=>x.classList.remove('selected'));
      m.classList.add('selected');
      selectedMattress=m;
    }
    try{ updateCart(); }catch(_e){}
  }
  function v51ToggleOption(o){
    if(!o) return;
    o.classList.toggle('selected');
    try{ updateCart(); }catch(_e){}
  }
  function v51AddToCart(){
    if(!selectedMattress) return alert("Choisis un matelas d'abord !");
    let item={name:selectedMattress.dataset.name,basePrice:Number(selectedMattress.dataset.price),price:Number(selectedMattress.dataset.price),options:[],qty:1};
    document.querySelectorAll('.options:not(.tip-options) .option.selected').forEach(o=>{
      item.options.push({name:o.dataset.name,price:Number(o.dataset.price)});
      item.price+=Number(o.dataset.price);
    });
    let optStr=JSON.stringify(item.options);
    let existing=cart.find(c=>c.name===item.name&&JSON.stringify(c.options)===optStr);
    if(existing) existing.qty++;
    else cart.push(item);
    try{ updateCart(); }catch(_e){}
    document.querySelectorAll('.mattress,.options:not(.tip-options) .option').forEach(el=>el.classList.remove('selected'));
    selectedMattress=null;
    alert("C'est dans le panier ! 🛒");
  }
  function v51Checkout(){
    if(typeof deliveryInProgress!=='undefined' && deliveryInProgress) return alert("Une livraison est déjà en cours. Tu peux préparer ton panier, mais attends la fin pour repayer.");
    if(!Array.isArray(cart) || cart.length===0) return alert('Ton panier est vide !');
    for(let item of cart){
      if(item.name==='Le Solo'&&reglages.ruptureSolo) return alert('Désolé, Le Solo vient de tomber en rupture !');
      if(item.name==='Le Duo'&&reglages.ruptureDuo) return alert('Désolé, Le Duo vient de tomber en rupture !');
      if((item.name==='Matelas Gonflable'||item.name==='Le Gonflable')&&reglages.ruptureGonflable) return alert('Désolé, le Gonflable vient de tomber en rupture !');
      if(item.name==='Lit Parapluie'&&reglages.ruptureBebe) return alert('Désolé, le Lit Parapluie vient de tomber en rupture !');
      const cm=(reglages.customMattresses||[]).find(m=>m.name===item.name);
      if(cm && cm.rupture) return alert(`Désolé, ${cm.name} vient de tomber en rupture !`);
    }
    const deliveryMode=document.getElementById('deliveryModeSelect')?.value;
    const scheduledTime=document.getElementById('scheduledTimeInput')?.value;
    if(deliveryMode==='later'&&!scheduledTime) return alert('Veuillez choisir une heure de livraison !');
    const finalPrice=Number(document.getElementById('totalPrice')?.textContent)||0;
    openPaymentModal(finalPrice,()=>{
      const totalSansTip=Math.round((finalPrice-currentTip)*100)/100;
      const resumeItems=cart.map(c=>`${c.name}${c.qty>1?' (x'+c.qty+')':''}`).join(', ');
      const sousTotalLits=cart.reduce((acc,c)=>acc+(c.price*c.qty),0);
      const cutDriver=sousTotalLits*0.4;
      const cutPatron=(sousTotalLits*0.6)+(reglages.isPremium&&cartDistance<=3.0?0:4.99)+2.99;
      const driver=currentDeliveryDriver || (drivers||[]).find(d=>!d.fired&&d.status!=='Non recruté') || (drivers||[])[0];
      const order={id:Date.now(),date:new Date().toLocaleString('fr-FR'),prix:finalPrice,items:resumeItems,status:'Terminée'};
      reglages.historiqueCommandes.push(order);
      reglages.caTotal=Math.round(((Number(reglages.caTotal)||0)+cutPatron)*100)/100;
      reglages.totalOrders=(Number(reglages.totalOrders)||0)+1;
      if(driver){
        driver.totalOrders=(Number(driver.totalOrders)||0)+1;
        driver.earnings=Math.round(((Number(driver.earnings)||0)+cutDriver+currentTip)*100)/100;
      }
      if(reglages.isPremium){ reglages.cagnotte=Math.round(((Number(reglages.cagnotte)||0)+Math.random()*1.4+0.25)*100)/100; }
      if(currentCagnotteDeduction>0){ reglages.cagnotte=Math.max(0,Math.round((reglages.cagnotte-currentCagnotteDeduction)*100)/100); reglages.cagnotteSpent=(Number(reglages.cagnotteSpent)||0)+currentCagnotteDeduction; }
      if(typeof startDeliveryFlow==='function'){
        try{ startDeliveryFlow(resumeItems,finalPrice); }catch(_e){}
      }
      cart=[]; currentTip=0; promoActive=false; currentCagnotteDeduction=0;
      try{ updateCart(); renderCommandsPage?.(); saveAll(); }catch(_e){ saveAll(); }
    });
  }

  function installV51Handlers(){
    clearInactiveOverlayStyles();
    const add=document.getElementById('addToCart'); if(add) add.onclick=v51AddToCart;
    const pay=document.getElementById('payBtn'); if(pay) pay.onclick=v51Checkout;
    const cag=document.querySelector('.cagnotte-click-zone'); if(cag) cag.onclick=function(){ openLagoPlusModal(); };
    if(typeof attacherEvenementsClics==='function'){
      window.attacherEvenementsClics=function(){
        document.querySelectorAll('.mattress').forEach(m=>{ m.onclick=function(e){ e.preventDefault(); v51SelectMattress(m); }; });
        document.querySelectorAll('.options:not(.tip-options) .option').forEach(o=>{
          o.oncontextmenu=e=>e.preventDefault();
          o.onclick=function(e){ e.preventDefault(); v51ToggleOption(o); };
          let timer=null, long=false;
          o.ontouchstart=function(){ long=false; timer=setTimeout(()=>{ long=true; try{ document.getElementById('bubbleTitle').innerText=o.dataset.name; document.getElementById('bubbleDesc').innerText=o.dataset.desc; prepareBubbleFavorite(o.dataset.name,o.dataset.desc,Number(o.dataset.price||0)); document.getElementById('infoBubble').style.display='block'; }catch(_e){} },500); };
          o.ontouchmove=function(){ clearTimeout(timer); };
          o.ontouchend=function(e){ clearTimeout(timer); if(long) e.preventDefault(); };
        });
      };
      window.attacherEvenementsClics();
    }
  }

  document.addEventListener('click',function(e){
    const m=e.target.closest && e.target.closest('.mattress');
    if(m && !e.target.closest('.detail-modal,.modal-card,#paymentOverlay,#googlePopupOverlay,#driverUberPopupOverlay')){ e.preventDefault(); e.stopImmediatePropagation(); v51SelectMattress(m); return; }
    const o=e.target.closest && e.target.closest('.options:not(.tip-options) .option');
    if(o){ e.preventDefault(); e.stopImmediatePropagation(); v51ToggleOption(o); return; }
    if(e.target.closest && e.target.closest('#addToCart')){ e.preventDefault(); e.stopImmediatePropagation(); v51AddToCart(); return; }
    if(e.target.closest && e.target.closest('#payBtn')){ e.preventDefault(); e.stopImmediatePropagation(); v51Checkout(); return; }
    if(e.target.closest && e.target.closest('.cagnotte-click-zone')){ e.preventDefault(); e.stopImmediatePropagation(); openLagoPlusModal(); return; }
  },true);

  const oldOpenPayment=window.openPaymentModal;
  window.openPaymentModal=function(amount,cb){
    clearInactiveOverlayStyles();
    if(typeof oldOpenPayment==='function') oldOpenPayment(amount,cb);
    setTimeout(()=>{
      const overlay=document.getElementById('paymentOverlay');
      if(overlay && overlay.classList.contains('show')) overlay.style.pointerEvents='auto';
    },20);
  };
  const oldClosePayment=window.closePayment;
  window.closePayment=function(){
    if(typeof oldClosePayment==='function') oldClosePayment();
    const overlay=document.getElementById('paymentOverlay');
    if(overlay){ overlay.classList.remove('show'); overlay.style.pointerEvents='none'; delete overlay.dataset.mode; }
    setTimeout(clearInactiveOverlayStyles,20);
  };

  const oldMettre=window.mettreAJourVitrine || (typeof mettreAJourVitrine==='function'?mettreAJourVitrine:null);
  if(oldMettre){
    window.mettreAJourVitrine=function(){ const r=oldMettre.apply(this,arguments); setTimeout(installV51Handlers,0); return r; };
    try{ mettreAJourVitrine=window.mettreAJourVitrine; }catch(_e){}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',installV51Handlers); else installV51Handlers();
  setTimeout(installV51Handlers,200);
  setTimeout(installV51Handlers,800);
})();


/* ===== V52 — finitions finales matelas perso / offres ===== */
(function(){
  function v52SyncMattressMeta(){
    try{
      if(typeof V36_MATTRESS_META!=='undefined' && Array.isArray(reglages.customMattresses)){
        reglages.customMattresses.forEach(m=>{
          V36_MATTRESS_META[m.name]={desc:(m.desc||'Matelas personnalisé Lago.').trim(),price:()=>Number(m.price||0)};
        });
      }
    }catch(_e){}
  }

  window.renderCustomMattressesAdmin=function(){
    if(!Array.isArray(reglages.customMattresses)) reglages.customMattresses=[];
    const settings=document.getElementById('admSettings');
    settings?.querySelectorAll('.admin-custom-empty,.admin-custom-mattress-list,#adminCustomMattressList').forEach(el=>el.remove());
    const grid=document.querySelector('#admSettings .admin-grid');
    if(!grid) return;
    grid.querySelectorAll('.v47-custom-tile,.v52-custom-tile,.v46-custom-price-tile,.admin-custom-item,.admin-custom-row,#v47AddMattressTile,#addCustomMattressAdminTile,.admin-custom-empty').forEach(el=>el.remove());
    reglages.customMattresses.forEach((m,i)=>{
      const tile=document.createElement('div');
      tile.className='v52-custom-tile';
      tile.dataset.index=String(i);
      tile.title=m.name;
      tile.innerHTML=`<label class="admin-label">Prix ${String(m.name||'MATELAS').toUpperCase()} (€)</label>
        <input type="number" class="admin-input v52-cm-price" value="${Number(m.price||0)}">
        <label class="admin-label">Stock disponible</label>
        <input type="number" min="0" step="1" class="admin-input v52-cm-stock" value="${Number(m.stock||0)}">
        <label class="v52-custom-rupture"><input type="checkbox" class="v52-cm-rupture" ${m.manualRupture?'checked':''}> Rupture</label>`;
      grid.appendChild(tile);
    });
    const addTile=document.createElement('div');
    addTile.id='v47AddMattressTile';
    addTile.className='v47-admin-add-tile';
    addTile.innerHTML='<button type="button" onclick="openCustomMattressModal()">＋<span>Ajouter un matelas</span></button>';
    grid.appendChild(addTile);
  };

  window.syncCustomMattressesFromAdmin=function(){
    if(!Array.isArray(reglages.customMattresses)) return;
    const tiles=[...document.querySelectorAll('#admSettings .admin-grid .v52-custom-tile')];
    reglages.customMattresses=reglages.customMattresses.map((m,i)=>{
      const tile=tiles[i];
      if(!tile) return m;
      const price=Math.max(0,Number(tile.querySelector('.v52-cm-price')?.value)||0);
      const stock=Math.max(0,parseInt(tile.querySelector('.v52-cm-stock')?.value||'0',10)||0);
      const manualRupture=!!tile.querySelector('.v52-cm-rupture')?.checked;
      return {...m,price,stock,manualRupture,rupture:manualRupture || stock<=0};
    });
    v52SyncMattressMeta();
  };

  const oldCreateCustomMattress=window.createCustomMattress;
  window.createCustomMattress=function(){
    const res=oldCreateCustomMattress?.apply(this,arguments);
    v52SyncMattressMeta();
    try{ renderCustomMattressesAdmin(); }catch(_e){}
    try{ renderCustomMattressesClient(); }catch(_e){}
    return res;
  };

  const oldDeleteCustomMattress=window.deleteCustomMattress;
  window.deleteCustomMattress=function(index){
    const r=oldDeleteCustomMattress?.apply(this,arguments);
    v52SyncMattressMeta();
    const settings=document.getElementById('admSettings');
    settings?.querySelectorAll('.admin-custom-empty,.admin-custom-mattress-list,#adminCustomMattressList').forEach(el=>el.remove());
    return r;
  };

  const oldRenderClient=window.renderCustomMattressesClient;
  window.renderCustomMattressesClient=function(){
    const r=oldRenderClient?.apply(this,arguments);
    v52SyncMattressMeta();
    try{ if(typeof bindV36MattressLongPress==='function') bindV36MattressLongPress(); }catch(_e){}
    return r;
  };

  const oldOpenCustomModal=window.openCustomMattressModal;
  window.openCustomMattressModal=function(index){
    const r=oldOpenCustomModal?.apply(this,arguments);
    const modal=document.getElementById('customMattressModal');
    if(modal){
      modal.scrollTop=0;
      const sheet=modal.querySelector('.custom-mattress-sheet');
      if(sheet) sheet.scrollTop=0;
      modal.style.pointerEvents='auto';
    }
    return r;
  };
  const oldCloseCustomModal=window.closeCustomMattressModal;
  window.closeCustomMattressModal=function(){
    const r=oldCloseCustomModal?.apply(this,arguments);
    const modal=document.getElementById('customMattressModal');
    if(modal) modal.style.pointerEvents='none';
    return r;
  };

  const oldAttach=window.attacherEvenementsClics;
  window.attacherEvenementsClics=function(){
    oldAttach?.apply(this,arguments);
    try{ if(typeof bindV36MattressLongPress==='function') bindV36MattressLongPress(); }catch(_e){}
  };

  function cleanupAdminGhosts(){
    const settings=document.getElementById('admSettings');
    settings?.querySelectorAll('.admin-custom-empty,.admin-custom-mattress-list,#adminCustomMattressList').forEach(el=>el.remove());
  }

  function bootV52(){
    v52SyncMattressMeta();
    cleanupAdminGhosts();
    try{ renderCustomMattressesAdmin(); }catch(_e){}
    try{ renderCustomMattressesClient(); }catch(_e){}
    try{ if(typeof renderAdminOffersPreview==='function') renderAdminOffersPreview(); }catch(_e){}
    try{ if(typeof bindV36MattressLongPress==='function') bindV36MattressLongPress(); }catch(_e){}
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bootV52); else bootV52();
  setTimeout(bootV52,150);
  setTimeout(bootV52,700);
})();

/* ===== V53 — retour livraison après paiement + Wallet sans ajout carte ===== */
(function(){
  function v53CleanupPaymentLayers(){
    ['paymentOverlay','processingOverlay','paySuccessOverlay'].forEach(id=>{
      const el=document.getElementById(id);
      if(!el) return;
      if(!el.classList.contains('show')) el.style.pointerEvents='none';
      else el.style.pointerEvents='auto';
    });
  }

  function v53PickDriver(){
    let d=null;
    try{ d=getAvailableDriver(reglages.isPremium); }catch(_e){}
    if(!d && Array.isArray(drivers)) d=drivers.find(x=>!x.fired && x.status!=='Non recruté') || drivers[0];
    return d;
  }

  window.startDeliveryFlow=function(resumeItems,finalPrice){
    const tracking=document.getElementById('tracking');
    if(!tracking) return;
    const nav=document.getElementById('clientNav');
    document.getElementById('clientApp')?.querySelectorAll('section').forEach(s=>s.classList.remove('active'));
    tracking.classList.add('active');
    if(nav) nav.style.display='none';

    const bar=document.getElementById('progressBar');
    const truck=document.getElementById('truckIcon');
    const title=document.getElementById('trackTitle');
    const desc=document.getElementById('trackDesc');
    const backBtn=document.getElementById('backHomeBtn');
    const cashDiv=document.getElementById('cashbackPopup');
    const showGps=document.getElementById('showGpsBtn');
    const showChat=document.getElementById('showChatBtn');
    const driverProfile=document.getElementById('driverProfile');
    const photo=document.getElementById('clientLivreurPhoto');

    if(bar) bar.style.width='5%';
    if(truck){ truck.style.left='0%'; truck.innerText='🚚'; truck.style.opacity='1'; }
    if(title) title.innerText='Commande validée !';
    const realMinutes = (typeof computeRealisticDeliveryMinutes==='function') ? computeRealisticDeliveryMinutes(cartDistance||2.4) : Math.max(20,Math.round(18+(Number(cartDistance)||2)*4));
    if(desc) desc.innerText=`Recherche d’un livreur disponible… Temps estimé : ${realMinutes} min`;
    if(backBtn){ backBtn.style.display='block'; backBtn.innerText='Réduire la commande'; }
    if(cashDiv) cashDiv.style.display='none';
    if(showGps) showGps.style.display='none';
    if(showChat) showChat.style.display='none';
    document.getElementById('trackingSummaryBtn')?.style.setProperty('display','block');
    const chatZone=document.getElementById('chatZone'); if(chatZone) chatZone.style.display='none';
    const chatHistory=document.getElementById('chatHistory'); if(chatHistory) chatHistory.innerHTML='';
    const rating=document.getElementById('ratingDiv'); if(rating) rating.style.display='none';
    const merci=document.getElementById('merciAvis'); if(merci) merci.style.display='none';
    document.querySelectorAll('#starContainer .star').forEach(st=>st.classList.remove('active'));
    const comment=document.getElementById('commentInput'); if(comment){ comment.style.display='block'; comment.value=''; }
    const submit=document.getElementById('submitReviewBtn'); if(submit){ submit.style.display='block'; submit.disabled=false; }
    if(driverProfile) driverProfile.style.display='flex';
    if(photo){
      photo.style.display='block';
      photo.classList.add('driver-searching-avatar');
      photo.src='https://api.dicebear.com/7.x/shapes/svg?seed=lago-search&backgroundColor=38bdf8';
    }
    const lname=document.getElementById('livreurName'); if(lname) lname.innerText='Recherche d’un livreur';
    const lnote=document.getElementById('livreurNote'); if(lnote) lnote.innerText='⏳';
    document.getElementById('rateLivreurName') && (document.getElementById('rateLivreurName').innerText='votre livreur');

    deliveryInProgress=true;
    deliveryMiniVisible=true;
    currentDeliveryDriver=null;
    try{ lastOrderSummary=buildOrderSummary(finalPrice,resumeItems,'Recherche en cours'); }catch(_e){ lastOrderSummary={items:resumeItems,total:finalPrice,driver:'Recherche en cours',distance:cartDistance,tip:currentTip}; }
    try{ showDeliveryMiniBubble(null,'Recherche d’un livreur…'); }catch(_e){}
    try{ cleanupDeliveryTimers(); }catch(_e){}

    const chosenDriver=v53PickDriver();
    const factor=Math.max(0.01,Number(reglages.deliverySpeedMultiplier)||1);
    const searchMs=Math.max(2500,Math.round(Math.min(120000,60000+(Number(cartDistance)||2)*12000)*factor));
    const totalMs=Math.max(searchMs+4500,Math.round(realMinutes*60*1000*factor));

    deliveryStageTimer=setTimeout(()=>{
      currentDeliveryDriver=chosenDriver;
      if(currentDeliveryDriver){
        currentDeliveryDriver.status='En livraison 🛵';
        currentDeliveryDriver.totalOrders=(Number(currentDeliveryDriver.totalOrders)||0)+1;
        const nomAff=currentDeliveryDriver.name+(currentDeliveryDriver.isPro?' 👑':'');
        if(lname) lname.innerText=nomAff;
        if(document.getElementById('rateLivreurName')) document.getElementById('rateLivreurName').innerText=nomAff;
        if(lnote) lnote.innerText='★ '+(currentDeliveryDriver.rating||5);
        if(photo){ photo.src=currentDeliveryDriver.photo; photo.classList.remove('driver-searching-avatar'); }
        try{ lastOrderSummary=buildOrderSummary(finalPrice,resumeItems,nomAff); }catch(_e){}
      }else{
        if(lname) lname.innerText='Livreur Lago';
        if(lnote) lnote.innerText='★ 5.0';
      }
      if(bar) bar.style.width='50%';
      if(truck) truck.style.left='45%';
      if(title) title.innerText='En route 🛵';
      if(desc) desc.innerText=(currentDeliveryDriver?.name||'Votre livreur')+' arrive avec votre commande.';
      if(showGps) showGps.style.display='inline-block';
      if(showChat) showChat.style.display='inline-block';
      try{ showDeliveryMiniBubble(currentDeliveryDriver,`En route • ~${Math.max(5,Math.round(realMinutes*0.7))} min`); }catch(_e){}
      try{ if(currentDeliveryDriver){ initGPSDelivery(currentDeliveryDriver); openClientGPS(); } }catch(_e){}
      try{ renderAdminDrivers(); saveAll(); }catch(_e){}
    },searchMs);

    deliveryFinishTimer=setTimeout(()=>{
      if(bar) bar.style.width='100%';
      if(truck){ truck.style.left='90%'; truck.style.opacity='0'; setTimeout(()=>{truck.innerText='✅'; truck.style.opacity='1';},450); }
      if(title) title.innerText='Il est là ! 🚨';
      if(desc) desc.innerText='Descends vite chercher ton matelas !';
      deliveryInProgress=false;
      try{ hideDeliveryMiniBubble(); }catch(_e){}
      if(nav) nav.style.display='none';
      if(backBtn){ backBtn.innerText="Retour à l'accueil"; backBtn.style.display='block'; }
      if(rating) rating.style.display='block';
      if(showGps) showGps.style.display='none';
      if(showChat) showChat.style.display='none';
      if(chatZone) chatZone.style.display='none';
      const gps=document.getElementById('gpsModal'); if(gps) gps.style.display='none';
      if(window.etaInt) clearInterval(window.etaInt);
      if(currentDeliveryDriver) currentDeliveryDriver.status='En attente';
      try{ mettreAJourHistorique(); updateAdminStats(); renderAdminDrivers(); renderAdminUsers(); saveAll(); }catch(_e){ try{ saveAll(); }catch(_e2){} }
    },totalMs);
  };

  function v53Checkout(){
    if(deliveryInProgress) return alert('Une livraison est déjà en cours. Tu peux préparer ton panier, mais attends la fin pour repayer.');
    if(!Array.isArray(cart) || cart.length===0) return alert('Ton panier est vide !');
    for(const item of cart){
      if(item.name==='Le Solo'&&reglages.ruptureSolo) return alert('Désolé, Le Solo vient de tomber en rupture !');
      if(item.name==='Le Duo'&&reglages.ruptureDuo) return alert('Désolé, Le Duo vient de tomber en rupture !');
      if((item.name==='Matelas Gonflable'||item.name==='Le Gonflable')&&reglages.ruptureGonflable) return alert('Désolé, le Gonflable vient de tomber en rupture !');
      if(item.name==='Lit Parapluie'&&reglages.ruptureBebe) return alert('Désolé, le Lit Parapluie vient de tomber en rupture !');
      const cm=(reglages.customMattresses||[]).find(m=>m.name===item.name);
      if(cm && cm.rupture) return alert(`Désolé, ${cm.name} vient de tomber en rupture !`);
    }
    const mode=document.getElementById('deliveryModeSelect')?.value||'now';
    const scheduled=document.getElementById('scheduledTimeInput')?.value||'';
    if(mode==='later'&&!scheduled) return alert('Veuillez choisir une heure de livraison !');
    const finalPrice=Number(document.getElementById('totalPrice')?.textContent)||0;
    const cartSnapshot=cart.map(c=>({name:c.name,qty:c.qty||1,price:c.price,options:(c.options||[]).map(o=>({...o}))}));
    openPaymentModal(finalPrice,()=>{
      const resumeItems=cartSnapshot.map(c=>`${c.name}${c.qty>1?' (x'+c.qty+')':''}`).join(', ');
      const sousTotalLits=cartSnapshot.reduce((acc,c)=>acc+(Number(c.price)||0)*(Number(c.qty)||1),0);
      let cutPatron=(sousTotalLits*0.6)+(reglages.isPremium&&cartDistance<=3.0?0:4.99)+2.99;
      try{ if(promoActive) cutPatron-=computePromoDiscount(); }catch(_e){}
      try{ cutPatron-=computeEasterPromoDiscount(); }catch(_e){}
      if(reglages.isPremium) cutPatron-=Math.round(sousTotalLits*0.15*100)/100;
      if(reglages.taxeNuit) cutPatron+=Math.round(sousTotalLits*0.20*100)/100;
      if(reglages.weatherSurge) cutPatron+=Math.round(sousTotalLits*0.25*100)/100;
      if(currentCagnotteDeduction>0) cutPatron-=currentCagnotteDeduction;
      const dateStr=new Date().toLocaleDateString('fr-FR');
      if(currentCagnotteDeduction>0){ reglages.cagnotte=Math.max(0,(Number(reglages.cagnotte)||0)-currentCagnotteDeduction); reglages.cagnotteSpent=(Number(reglages.cagnotteSpent)||0)+currentCagnotteDeduction; }
      reglages.historiqueCommandes.push({id:Date.now(),date:dateStr,scheduledTime:mode==='later'?scheduled:'',prix:finalPrice,items:resumeItems,status:mode==='later'?'En cours':'Terminée',cagnotteUsed:currentCagnotteDeduction});
      reglages.caTotal=Math.round(((Number(reglages.caTotal)||0)+Math.max(0,cutPatron))*100)/100;
      reglages.totalOrders=(Number(reglages.totalOrders)||0)+1;
      try{ registerPromoUsageIfNeeded(); registerEasterPromoUsageIfNeeded(); }catch(_e){}
      if(mode==='later'){
        cart=[]; promoActive=false; currentTip=0; currentCagnotteDeduction=0;
        document.querySelectorAll('.tip-btn').forEach(b=>b.classList.remove('selected'));
        const promoMsg=document.getElementById('promoMessage'); if(promoMsg) promoMsg.style.display='none';
        const promoInput=document.getElementById('promoInput'); if(promoInput) promoInput.value='';
        const cag=document.getElementById('useCagnotteCheck'); if(cag) cag.checked=false;
        try{ mettreAJourVitrine(); updateCart(); mettreAJourHistorique(); saveAll(); }catch(_e){ saveAll(); }
        alert(`✅ Livraison programmée pour ${scheduled} !`);
        switchClientTab('profile',document.querySelectorAll('.navBtn')[2]);
        return;
      }
      startDeliveryFlow(resumeItems,finalPrice);
      cart=[]; promoActive=false; currentTip=0; currentCagnotteDeduction=0;
      document.querySelectorAll('.tip-btn').forEach(b=>b.classList.remove('selected'));
      const promoMsg=document.getElementById('promoMessage'); if(promoMsg) promoMsg.style.display='none';
      const promoInput=document.getElementById('promoInput'); if(promoInput) promoInput.value='';
      const cag=document.getElementById('useCagnotteCheck'); if(cag) cag.checked=false;
      try{ updateCart(); saveAll(); }catch(_e){ saveAll(); }
    });
  }

  window.renderWalletPage=function(){
    const box=document.getElementById('walletPageContent'); if(!box) return;
    if(!Array.isArray(reglages.savedCards)) reglages.savedCards=[];
    const cards=reglages.savedCards;
    let html='<div class="wallet-v39-header"><h4>Mes cartes</h4><p>Vos cartes enregistrées apparaissent ici. Pour enregistrer une carte, cochez “Enregistrer cette carte” pendant un paiement.</p></div>';
    html+=cards.length?'<div class="wallet-v39-list">'+cards.map((c,i)=>`<div class="wallet-v39-card"><div class="wallet-v39-card-main">${savedCardMiniHtml(c).replace('<div class="saved-card-mini',`<div onclick="openSavedCardDesignPicker(${i},event)" class="saved-card-mini`)}<div class="wallet-v39-meta"><h4>${c.type||'CB'} •••• ${c.last4||'0000'}</h4><p>${c.holder||'CLIENT LAGO'}</p><p>Expiration ${c.expiry||'MM/AA'}${c.design?` • ${getCardDesignName(c.design)}`:''}</p></div></div><div class="wallet-v39-actions"><button onclick="openSavedCardDesignPicker(${i},event)">Modifier le design</button><button class="secondary" onclick="deleteSavedCard(${i});renderWalletPage();">Supprimer</button></div></div>`).join('')+'</div>':'<div class="wallet-v39-empty">Aucune carte enregistrée.</div>';
    box.innerHTML=html;
  };

  function installV53(){
    v53CleanupPaymentLayers();
    const pay=document.getElementById('payBtn');
    if(pay) pay.onclick=v53Checkout;
    document.querySelectorAll('#walletPageContent .wallet-v39-add,.wallet-action-strip').forEach(el=>el.remove());
    if(document.getElementById('walletPage')?.classList.contains('active')) renderWalletPage();
  }
  document.addEventListener('click',function(e){
    if(e.target.closest && e.target.closest('#payBtn')){ e.preventDefault(); e.stopImmediatePropagation(); v53Checkout(); }
  },true);
  const oldMettreV53=window.mettreAJourVitrine || (typeof mettreAJourVitrine==='function'?mettreAJourVitrine:null);
  if(oldMettreV53){
    window.mettreAJourVitrine=function(){ const r=oldMettreV53.apply(this,arguments); setTimeout(installV53,0); return r; };
    try{ mettreAJourVitrine=window.mettreAJourVitrine; }catch(_e){}
  }
  const oldCloseV53=window.closePayment;
  window.closePayment=function(){ if(typeof oldCloseV53==='function') oldCloseV53(); setTimeout(v53CleanupPaymentLayers,20); };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',installV53); else installV53();
  setTimeout(installV53,250);
  setTimeout(installV53,900);
})();


/* ===== V54 — livraison plus courte, Lago+ cartes, favoris paniers, avatars spéciaux, maintenance ===== */
(function(){
  const SPECIAL_AVATARS=[
    {id:'orders10',label:'10 commandes',need:'Débloqué après 10 commandes',url:'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Lago10&backgroundColor=fef3c7'},
    {id:'orders20',label:'20 commandes',need:'Débloqué après 20 commandes',url:'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Lago20&backgroundColor=dbeafe'},
    {id:'cagnotte50',label:'Cagnotte 50€',need:'Débloqué avec 50€ en cagnotte Lago+',url:'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=LagoCash50&backgroundColor=dcfce7'}
  ];
  function ensureV54Data(){
    if(!Array.isArray(reglages.favoriteCarts)) reglages.favoriteCarts=[];
    if(typeof reglages.maintenanceActive!=='boolean') reglages.maintenanceActive=false;
    reglages.maintenanceMessage=reglages.maintenanceMessage||'Lago est en mise à jour. On revient très vite.';
  }
  function orderCountV54(){return Math.max(Number(reglages.totalOrders)||0,(reglages.historiqueCommandes||[]).length);}
  function specialUnlocked(a){
    if(a.id==='orders10') return orderCountV54()>=10;
    if(a.id==='orders20') return orderCountV54()>=20;
    if(a.id==='cagnotte50') return !!reglages.isPremium && Number(reglages.cagnotte||0)>=50;
    return false;
  }

  // Carte : design strictement réservé Lago+
  const prevOpenDesignV54=window.openSavedCardDesignPicker;
  window.openSavedCardDesignPicker=function(index,e){
    if(e){e.preventDefault(); e.stopPropagation();}
    if(!reglages.isPremium) return alert('Le design des cartes est réservé aux membres Lago+.');
    return prevOpenDesignV54?.call(this,index,e);
  };
  window.renderWalletPage=function(){
    const box=document.getElementById('walletPageContent'); if(!box) return;
    if(!Array.isArray(reglages.savedCards)) reglages.savedCards=[];
    const cards=reglages.savedCards;
    let html='<div class="wallet-v39-header"><h4>Mes cartes enregistrées</h4><p>Vos cartes enregistrées apparaissent ici. Pour enregistrer une carte, cochez “Enregistrer cette carte” pendant un paiement.</p></div>';
    if(cards.length){
      html+='<div class="wallet-v39-list">'+cards.map((c,i)=>{
        const mini=reglages.isPremium ? savedCardMiniHtml(c).replace('<div class="saved-card-mini',`<div onclick="openSavedCardDesignPicker(${i},event)" class="saved-card-mini`) : savedCardMiniHtml(c);
        const designBtn=reglages.isPremium ? `<button class="premium-only-btn" onclick="openSavedCardDesignPicker(${i},event)">Modifier le design</button>` : '';
        return `<div class="wallet-v39-card"><div class="wallet-v39-card-main">${mini}<div class="wallet-v39-meta"><h4>${c.type||'CB'} •••• ${c.last4||'0000'}</h4><p>${c.holder||'CLIENT LAGO'}</p><p>Expiration ${c.expiry||'MM/AA'}${c.design?` • ${getCardDesignName(c.design)}`:''}</p>${!reglages.isPremium?'<small style="color:var(--text-dim);">Design modifiable avec Lago+</small>':''}</div></div><div class="wallet-v39-actions">${designBtn}<button class="secondary" onclick="deleteSavedCard(${i});renderWalletPage();">Supprimer</button></div></div>`;
      }).join('')+'</div>';
    }else html+='<div class="wallet-v39-empty">Aucune carte enregistrée.</div>';
    box.innerHTML=html;
  };

  // Quantités panier + favoris paniers
  window.incCartQtyV54=function(i){ if(cart[i]){cart[i].qty=(Number(cart[i].qty)||1)+1; updateCart(); saveAll();} };
  window.decCartQtyV54=function(i){ if(!cart[i]) return; cart[i].qty=(Number(cart[i].qty)||1)-1; if(cart[i].qty<=0) cart.splice(i,1); updateCart(); saveAll(); };
  function renderCartRowsV54(){
    const list=document.getElementById('cartList'); if(!list || !Array.isArray(cart) || !cart.length) return;
    list.innerHTML='';
    cart.forEach((c,index)=>{
      const qty=Number(c.qty)||1;
      const options=c.options||[];
      const lp=(Number(c.price)||0)*qty;
      const opts=options.map(o=>`<small style="color:var(--text-dim);display:block;">+ ${o.name}</small>`).join('');
      const note=(qty>1&&options.length)?`<div class="cart-qty-note">${qty}× avec les mêmes options. Pour un exemplaire sans option, ajoutez-le séparément.</div>`:'';
      list.innerHTML+=`<div class="cartItem" style="border-bottom:1px solid var(--glass-border);align-items:center;"><div style="display:flex;align-items:flex-start;gap:10px;"><button class="remove-btn" onclick="decCartQtyV54(${index})">−</button><div><span style="font-weight:bold;">${c.name}${qty>1?` <span style="color:var(--accent-blue);">x${qty}</span>`:''}</span>${opts}<div class="cart-qty-controls"><button onclick="decCartQtyV54(${index})">−</button><strong>${qty}</strong><button onclick="incCartQtyV54(${index})">＋</button></div>${note}</div></div><span style="font-weight:700;">${lp.toFixed(2)} €</span></div>`;
    });
    list.innerHTML+=`<button class="cart-favorite-save" onclick="saveCurrentCartFavoriteV54()">♡ Enregistrer ce panier en favori</button>`;
  }
  const prevUpdateCartV54=window.updateCart || updateCart;
  window.updateCart=function(){
    const r=prevUpdateCartV54.apply(this,arguments);
    try{renderCartRowsV54();}catch(e){console.warn(e);}
    return r;
  };
  window.saveCurrentCartFavoriteV54=function(){
    ensureV54Data();
    if(!cart.length) return alert('Votre panier est vide.');
    if(reglages.favoriteCarts.length>=10) return alert('Maximum 10 paniers favoris. Supprimez-en un avant d’en ajouter un autre.');
    const name=prompt('Nom du panier favori :',`Panier Lago ${reglages.favoriteCarts.length+1}`);
    if(name===null) return;
    const snapshot=cart.map(c=>({name:c.name,basePrice:c.basePrice,price:c.price,qty:c.qty||1,options:(c.options||[]).map(o=>({...o}))}));
    const total=Number(document.getElementById('totalPrice')?.textContent)||snapshot.reduce((a,c)=>a+c.price*(c.qty||1),0);
    reglages.favoriteCarts.unshift({id:Date.now(),name:(name.trim()||'Panier Lago'),items:snapshot,total,created:new Date().toLocaleDateString('fr-FR')});
    saveAll(); alert('Panier ajouté aux favoris.');
  };

  // Favoris = paniers favoris, plus favoris matelas/options.
  window.prepareBubbleFavorite=function(name,desc,price,type='option'){
    const btn=document.getElementById('bubbleFavoriteBtn');
    if(btn) btn.style.display='none';
  };
  window.renderFavoritesPage=function(){
    ensureV54Data();
    const box=document.getElementById('clientFavoritesList'); if(!box) return;
    const favs=reglages.favoriteCarts||[];
    if(!favs.length){box.innerHTML='<div class="empty-clean">Aucun panier favori pour le moment. Prépare un panier puis enregistre-le depuis l’onglet Panier.</div>';return;}
    box.innerHTML=favs.map((f,i)=>{
      const items=(f.items||[]).map(it=>`${it.name}${it.qty>1?' x'+it.qty:''}${(it.options||[]).length?' avec '+it.options.map(o=>o.name).join(', '):''}`).join(' • ');
      return `<div class="favorite-cart-card"><h4>${f.name}</h4><p>${items}</p><p>${f.created||''} • env. ${Number(f.total||0).toFixed(2)}€</p><div class="wallet-actions-clean"><button onclick="loadFavoriteCartV54(${i})">Commander</button><button class="secondary" onclick="removeFavoriteCartV54(${i})">Retirer</button></div></div>`;
    }).join('');
  };
  window.loadFavoriteCartV54=function(i){
    ensureV54Data(); const f=reglages.favoriteCarts[i]; if(!f) return;
    cart=(f.items||[]).map(c=>({name:c.name,basePrice:c.basePrice,price:c.price,qty:c.qty||1,options:(c.options||[]).map(o=>({...o}))}));
    updateCart(); closeClientPageTo('orders'); saveAll();
  };
  window.removeFavoriteCartV54=function(i){ensureV54Data();reglages.favoriteCarts.splice(i,1);saveAll();renderFavoritesPage();};

  // Avatars spéciaux
  const oldInitAvatarsV54=window.initAvatarsUI || initAvatarsUI;
  window.initAvatarsUI=function(){
    oldInitAvatarsV54?.apply(this,arguments);
    const modal=document.querySelector('#avatarModal .modal-card');
    if(!modal) return;
    let sec=document.getElementById('specialAvatarsSection');
    if(!sec){
      sec=document.createElement('div'); sec.id='specialAvatarsSection'; sec.className='special-avatar-section';
      const before=modal.querySelector('button[onclick*="avatarModal"]') || null;
      modal.insertBefore(sec,before);
    }
    sec.innerHTML=`<h4>Avatars spéciaux</h4><p>Déblocages secrets selon votre activité Lago.</p><div class="special-avatar-grid">${SPECIAL_AVATARS.map(a=>{const ok=specialUnlocked(a);return `<div class="special-avatar-card ${ok?'':'locked'}"><img src="${a.url}"><button onclick="selectSpecialAvatarV54('${a.id}')">${ok?a.label:'🔒 '+a.label}</button><small style="display:block;color:var(--text-dim);font-size:10px;margin-top:6px;">${a.need}</small></div>`;}).join('')}</div>`;
  };
  window.selectSpecialAvatarV54=function(id){const a=SPECIAL_AVATARS.find(x=>x.id===id); if(!a) return; if(!specialUnlocked(a)) return alert(a.need); reglages.avatarUrl=a.url; appliquerAvatarEtPremium(); document.getElementById('avatarModal').classList.remove('active'); saveAll();};
  const oldApplyAvatarV54=window.appliquerAvatarEtPremium || appliquerAvatarEtPremium;
  window.appliquerAvatarEtPremium=function(){ oldApplyAvatarV54.apply(this,arguments); try{window.initAvatarsUI();}catch(_e){} };

  // Commandes : deux bulles Commandes / Remboursements-Crédits
  let commandsTabV54='orders';
  window.switchCommandsTabV54=function(tab){commandsTabV54=tab;renderCommandsPage();};
  window.renderCommandsPage=function(){
    const box=document.getElementById('commandsPageContent'); if(!box) return;
    const hist=(reglages.historiqueCommandes||[]).slice().reverse();
    const refunds=(reglages.refundHistory||reglages.refunds||[]).slice().reverse();
    let html=`<div class="commands-tabs-v54"><button class="${commandsTabV54==='orders'?'active':''}" onclick="switchCommandsTabV54('orders')">Commandes</button><button class="${commandsTabV54==='refunds'?'active':''}" onclick="switchCommandsTabV54('refunds')">Remboursements / crédit</button></div>`;
    if(commandsTabV54==='refunds'){
      if(!refunds.length){ html+='<div class="empty-clean">Aucun remboursement ou crédit pour le moment.</div>'; box.innerHTML=html; return; }
      html+=refunds.map(r=>`<div class="refund-clean-card"><h4>${r.title||r.reason||'Crédit Lago'}</h4><p>${r.date||''} • ${r.status||'Crédité'} ${r.amount?`• ${Number(r.amount).toFixed(2)}€`:''}</p></div>`).join('');
      box.innerHTML=html; return;
    }
    if(!hist.length){ box.innerHTML=html+'<div class="empty-clean">Aucune commande pour le moment.</div>'; return; }
    html+=hist.map((h,idx)=>`<div class="command-clean-card" data-order-index="${(reglages.historiqueCommandes||[]).length-1-idx}"><div><h4>${h.items||'Commande Lago'}</h4><p>${h.date}${h.status?` • ${h.status}`:''}</p><small>Appui long pour voir l’historique détaillé</small></div><div class="command-price">${Number(h.prix||0).toFixed(2)}€</div></div>`).join('');
    box.innerHTML=html; try{bindCommandCardLongPress();}catch(_e){}
  };

  // Maintenance Lago côté patron / client
  function ensureMaintenanceOverlay(){
    if(document.getElementById('maintenanceOverlayV54')) return;
    const el=document.createElement('div'); el.id='maintenanceOverlayV54';
    el.innerHTML='<div class="maintenance-card-v54"><h2>Lago</h2><p id="maintenanceMsgV54"></p><div class="small">Service temporairement indisponible.</div></div>';
    document.body.appendChild(el);
  }
  window.saveMaintenanceSettings=function(){
    ensureV54Data();
    reglages.maintenanceActive=!!document.getElementById('adminMaintenanceToggle')?.checked;
    reglages.maintenanceMessage=(document.getElementById('adminMaintenanceMessage')?.value||'Lago est en mise à jour. On revient très vite.').trim();
    saveAll(); applyMaintenanceV54(); alert(reglages.maintenanceActive?'Lago est en pause côté client.':'Maintenance désactivée.');
  };
  function syncMaintenanceAdmin(){
    const t=document.getElementById('adminMaintenanceToggle'); if(t) t.checked=!!reglages.maintenanceActive;
    const m=document.getElementById('adminMaintenanceMessage'); if(m) m.value=reglages.maintenanceMessage||'';
  }
  window.applyMaintenanceV54=function(){
    ensureMaintenanceOverlay();
    const overlay=document.getElementById('maintenanceOverlayV54');
    const msg=document.getElementById('maintenanceMsgV54');
    const isClient=window.currentUser && window.currentUser.role!=='admin';
    if(msg) msg.textContent=reglages.maintenanceMessage||'Lago est en mise à jour. On revient très vite.';
    overlay.classList.toggle('show',!!reglages.maintenanceActive && !!isClient);
  };

  // Livraison : mode normal affiché et réel 5-10 min recherche, 10-20 min livraison, express/debug conservé par multiplicateur.
  window.computeRealisticDeliveryMinutes=function(distance){
    const d=Math.max(0,Number(distance)||2.4);
    return Math.max(10,Math.min(20,Math.round(10+d*3+Math.random()*3)));
  };
  const prevStartDeliveryV54=window.startDeliveryFlow;
  window.startDeliveryFlow=function(resumeItems,finalPrice){
    const tracking=document.getElementById('tracking');
    if(!tracking || typeof prevStartDeliveryV54!=='function') return prevStartDeliveryV54?.(resumeItems,finalPrice);
    // Reprise du flow V53 avec temps normal raccourci.
    const nav=document.getElementById('clientNav');
    document.getElementById('clientApp')?.querySelectorAll('section').forEach(s=>s.classList.remove('active'));
    tracking.classList.add('active'); if(nav) nav.style.display='none';
    const bar=document.getElementById('progressBar'), truck=document.getElementById('truckIcon'), title=document.getElementById('trackTitle'), desc=document.getElementById('trackDesc'), backBtn=document.getElementById('backHomeBtn');
    const showGps=document.getElementById('showGpsBtn'), showChat=document.getElementById('showChatBtn'), driverProfile=document.getElementById('driverProfile'), photo=document.getElementById('clientLivreurPhoto');
    const cashDiv=document.getElementById('cashbackPopup');
    if(bar) bar.style.width='5%'; if(truck){truck.style.left='0%';truck.innerText='🚚';truck.style.opacity='1';}
    if(title) title.innerText='Commande validée !';
    const dist=Number(cartDistance)||2.4;
    const realMinutes=computeRealisticDeliveryMinutes(dist);
    const searchMinutes=Math.max(5,Math.min(10,Math.round(5+dist*1.4+Math.random()*2)));
    if(desc) desc.innerText=`Recherche d’un livreur disponible… Recherche estimée : ${searchMinutes} min • livraison ${realMinutes} min`;
    if(backBtn){backBtn.style.display='block';backBtn.innerText='Réduire la commande';}
    if(cashDiv) cashDiv.style.display='none'; if(showGps) showGps.style.display='none'; if(showChat) showChat.style.display='none';
    document.getElementById('trackingSummaryBtn')?.style.setProperty('display','block');
    const chatZone=document.getElementById('chatZone'); if(chatZone) chatZone.style.display='none';
    const chatHistory=document.getElementById('chatHistory'); if(chatHistory) chatHistory.innerHTML='';
    const rating=document.getElementById('ratingDiv'); if(rating) rating.style.display='none';
    const merci=document.getElementById('merciAvis'); if(merci) merci.style.display='none';
    document.querySelectorAll('#starContainer .star').forEach(st=>st.classList.remove('active'));
    const comment=document.getElementById('commentInput'); if(comment){comment.style.display='block';comment.value='';}
    const submit=document.getElementById('submitReviewBtn'); if(submit){submit.style.display='block';submit.disabled=false;}
    if(driverProfile) driverProfile.style.display='flex';
    if(photo){photo.style.display='block';photo.classList.add('driver-searching-avatar');photo.src='https://api.dicebear.com/7.x/shapes/svg?seed=lago-search&backgroundColor=38bdf8';}
    const lname=document.getElementById('livreurName'); if(lname) lname.innerText='Recherche d’un livreur';
    const lnote=document.getElementById('livreurNote'); if(lnote) lnote.innerText='⏳';
    document.getElementById('rateLivreurName') && (document.getElementById('rateLivreurName').innerText='votre livreur');
    deliveryInProgress=true; deliveryMiniVisible=true; currentDeliveryDriver=null;
    try{ lastOrderSummary=buildOrderSummary(finalPrice,resumeItems,'Recherche en cours'); }catch(_e){ lastOrderSummary={items:resumeItems,total:finalPrice,driver:'Recherche en cours',distance:cartDistance,tip:currentTip}; }
    try{ showDeliveryMiniBubble(null,'Recherche d’un livreur…'); }catch(_e){}
    try{ cleanupDeliveryTimers(); }catch(_e){}
    let chosenDriver=null; try{ chosenDriver=getAvailableDriver(reglages.isPremium); }catch(_e){}
    if(!chosenDriver && Array.isArray(drivers)) chosenDriver=drivers.find(x=>!x.fired&&x.status!=='Non recruté')||drivers[0];
    const factor=Math.max(0.01,Number(reglages.deliverySpeedMultiplier)||1);
    const searchMs=Math.round(searchMinutes*60*1000*factor);
    const totalMs=Math.round(realMinutes*60*1000*factor);
    deliveryStageTimer=setTimeout(()=>{
      currentDeliveryDriver=chosenDriver;
      if(currentDeliveryDriver){currentDeliveryDriver.status='En livraison 🛵';currentDeliveryDriver.totalOrders=(Number(currentDeliveryDriver.totalOrders)||0)+1;const nom=currentDeliveryDriver.name+(currentDeliveryDriver.isPro?' 👑':'');if(lname) lname.innerText=nom;if(document.getElementById('rateLivreurName')) document.getElementById('rateLivreurName').innerText=nom;if(lnote) lnote.innerText='★ '+(currentDeliveryDriver.rating||5);if(photo){photo.src=currentDeliveryDriver.photo;photo.classList.remove('driver-searching-avatar');}try{lastOrderSummary=buildOrderSummary(finalPrice,resumeItems,nom);}catch(_e){}}
      if(bar) bar.style.width='50%'; if(truck) truck.style.left='45%'; if(title) title.innerText='En route 🛵'; if(desc) desc.innerText=(currentDeliveryDriver?.name||'Votre livreur')+' arrive avec votre commande.'; if(showGps) showGps.style.display='inline-block'; if(showChat) showChat.style.display='inline-block';
      try{ showDeliveryMiniBubble(currentDeliveryDriver,`En route • ~${Math.max(5,Math.round(realMinutes*.7))} min`); }catch(_e){}
      try{ if(currentDeliveryDriver){initGPSDelivery(currentDeliveryDriver);openClientGPS();} }catch(_e){}
      try{ renderAdminDrivers(); saveAll(); }catch(_e){}
    },searchMs);
    deliveryFinishTimer=setTimeout(()=>{
      if(bar) bar.style.width='100%'; if(truck){truck.style.left='90%';truck.style.opacity='0';setTimeout(()=>{truck.innerText='✅';truck.style.opacity='1';},450);} if(title) title.innerText='Il est là ! 🚨'; if(desc) desc.innerText='Descends vite chercher ton matelas !';
      deliveryInProgress=false; try{hideDeliveryMiniBubble();}catch(_e){} if(nav) nav.style.display='none'; if(backBtn){backBtn.innerText="Retour à l'accueil";backBtn.style.display='block';} if(rating) rating.style.display='block'; if(showGps) showGps.style.display='none'; if(showChat) showChat.style.display='none'; if(chatZone) chatZone.style.display='none'; const gps=document.getElementById('gpsModal'); if(gps) gps.style.display='none'; if(window.etaInt) clearInterval(window.etaInt); if(currentDeliveryDriver) currentDeliveryDriver.status='En attente';
      try{mettreAJourHistorique();updateAdminStats();renderAdminDrivers();renderAdminUsers();saveAll();}catch(_e){try{saveAll();}catch(_e2){}}
    },Math.max(searchMs+120000*factor,totalMs));
  };

  // Boot
  function bootV54(){
    ensureV54Data(); syncMaintenanceAdmin(); applyMaintenanceV54(); try{initAvatarsUI();}catch(_e){} try{renderWalletPage();}catch(_e){} try{updateCart();}catch(_e){} try{if(document.getElementById('favoritesPage')?.classList.contains('active'))renderFavoritesPage();}catch(_e){}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bootV54); else bootV54();
  setTimeout(bootV54,250); setTimeout(bootV54,900);
})();

/* ===== V55 — avatars stables, favoris propres, maintenance réelle ===== */
(function(){
  const V55_SHARED_KEY='lagoUberV20_shared';
  const V55_SPECIAL_AVATARS=[
    {id:'orders10',label:'10 commandes',need:'Débloqué après 10 commandes',url:'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Lago10&backgroundColor=fef3c7'},
    {id:'orders20',label:'20 commandes',need:'Débloqué après 20 commandes',url:'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Lago20&backgroundColor=dbeafe'},
    {id:'cagnotte50',label:'Cagnotte 50€',need:'Débloqué avec 50€ en cagnotte Lago+',url:'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=LagoCash50&backgroundColor=dcfce7'}
  ];

  function v55ReadShared(){
    try{
      const raw=localStorage.getItem(V55_SHARED_KEY);
      if(!raw) return;
      const data=JSON.parse(raw);
      if(typeof data.maintenanceActive==='boolean') reglages.maintenanceActive=data.maintenanceActive;
      if(typeof data.maintenanceMessage==='string' && data.maintenanceMessage.trim()) reglages.maintenanceMessage=data.maintenanceMessage.trim();
    }catch(_e){}
  }
  function v55WriteShared(){
    try{
      localStorage.setItem(V55_SHARED_KEY, JSON.stringify({
        maintenanceActive:!!reglages.maintenanceActive,
        maintenanceMessage:reglages.maintenanceMessage||'Lago est en mise à jour. On revient très vite.',
        savedAt:Date.now()
      }));
    }catch(_e){}
  }

  const oldSaveAllV55 = window.saveAll || saveAll;
  window.saveAll = function(){
    const r = oldSaveAllV55.apply(this, arguments);
    v55WriteShared();
    return r;
  };

  function v55PersonalOrderCount(){
    const histLen=Array.isArray(reglages.historiqueCommandes)?reglages.historiqueCommandes.length:0;
    if(window.currentUser && window.currentUser.role!=='admin'){
      const u=fakeUsers.find(x=>x.email===window.currentUser.email) || window.currentUser;
      const orders=Number(u.orders)||0;
      const userHist=Array.isArray(u.historique)?u.historique.length:0;
      return Math.max(orders,userHist,histLen);
    }
    return histLen;
  }
  function v55SpecialUnlocked(a){
    if(a.id==='orders10') return v55PersonalOrderCount()>=10;
    if(a.id==='orders20') return v55PersonalOrderCount()>=20;
    if(a.id==='cagnotte50') return !!reglages.isPremium && Number(reglages.cagnotte||0)>=50;
    return false;
  }
  function v55RenderSpecialAvatarSection(){
    const modal=document.getElementById('avatarModal');
    const card=modal?.querySelector('.modal-card');
    const premiumGrid=document.getElementById('premiumAvatarsGrid');
    if(!card || !premiumGrid) return;
    let sec=document.getElementById('specialAvatarsSection');
    if(!sec){
      sec=document.createElement('div');
      sec.id='specialAvatarsSection';
      sec.className='special-avatar-section';
    }
    sec.innerHTML=`<h4>Pack spéciaux</h4><p>Déblocages secrets selon ton activité sur Lago.</p><div class="special-avatar-grid">${V55_SPECIAL_AVATARS.map(a=>{const ok=v55SpecialUnlocked(a); return `<div class="special-avatar-card ${ok?'':'locked'}"><img src="${a.url}" alt="${a.label}"><button type="button" ${ok?'':'disabled'} onclick="selectSpecialAvatarV55('${a.id}')">${ok?a.label:'🔒 '+a.label}</button><small style="display:block;color:var(--text-dim);font-size:10px;margin-top:6px;line-height:1.35;">${a.need}</small></div>`;}).join('')}</div>`;
    premiumGrid.insertAdjacentElement('afterend', sec);
  }
  const oldInitAvatarsV55 = window.initAvatarsUI || initAvatarsUI;
  window.initAvatarsUI = function(){
    oldInitAvatarsV55?.apply(this, arguments);
    v55RenderSpecialAvatarSection();
  };
  window.selectSpecialAvatarV55 = function(id){
    const a=V55_SPECIAL_AVATARS.find(x=>x.id===id);
    if(!a) return;
    if(!v55SpecialUnlocked(a)) return alert(a.need);
    reglages.avatarUrl=a.url;
    try{ appliquerAvatarEtPremium(); }catch(_e){}
    const modal=document.getElementById('avatarModal');
    if(modal) modal.classList.remove('active');
    saveAll();
  };

  function v55ResetAvatarModal(){
    const modal=document.getElementById('avatarModal');
    const card=modal?.querySelector('.modal-card');
    if(card) card.scrollTop=0;
  }
  function v55WatchAvatarModal(){
    const modal=document.getElementById('avatarModal');
    if(!modal || modal.dataset.v55Watch==='1') return;
    modal.dataset.v55Watch='1';
    const obs=new MutationObserver(()=>{ if(modal.classList.contains('active')){ v55ResetAvatarModal(); v55RenderSpecialAvatarSection(); } });
    obs.observe(modal,{attributes:true,attributeFilter:['class']});
  }

  function v55SnapshotCart(source){
    return (source||[]).map(c=>({
      name:c.name,
      basePrice:Number(c.basePrice||0),
      price:Number(c.price||0),
      qty:Number(c.qty||1),
      options:(c.options||[]).map(o=>({name:o.name,price:Number(o.price||0)}))
    }));
  }
  function v55NormalizeItem(item){
    return JSON.stringify({
      name:item.name,
      basePrice:Number(item.basePrice||0),
      price:Number(item.price||0),
      qty:Number(item.qty||1),
      options:(item.options||[]).map(o=>({name:o.name,price:Number(o.price||0)})).sort((a,b)=>String(a.name).localeCompare(String(b.name)))
    });
  }
  function v55FindMatchingFavoriteIndex(){
    const cur=v55SnapshotCart(cart).map(v55NormalizeItem).sort();
    return (reglages.favoriteCarts||[]).findIndex(f=>{
      const items=v55SnapshotCart(f.items||[]).map(v55NormalizeItem).sort();
      return cur.length===items.length && cur.every((x,i)=>x===items[i]);
    });
  }

  window.saveCurrentCartFavoriteV55 = function(){
    if(!Array.isArray(reglages.favoriteCarts)) reglages.favoriteCarts=[];
    if(!cart.length) return alert('Votre panier est vide.');
    if(v55FindMatchingFavoriteIndex()>=0) return alert('Ce panier est déjà enregistré dans vos favoris.');
    if(reglages.favoriteCarts.length>=10) return alert('Maximum 10 paniers favoris. Supprimez-en un avant d’en ajouter un autre.');
    const name=prompt('Nom du panier favori :',`Panier Lago ${reglages.favoriteCarts.length+1}`);
    if(name===null) return;
    const snapshot=v55SnapshotCart(cart);
    const total=Number(document.getElementById('totalPrice')?.textContent)||snapshot.reduce((acc,c)=>acc+(Number(c.price)||0)*(Number(c.qty)||1),0);
    reglages.favoriteCarts.unshift({id:Date.now(),name:(name.trim()||'Panier Lago'),items:snapshot,total,created:new Date().toLocaleDateString('fr-FR')});
    saveAll();
    try{ renderFavoritesPage(); }catch(_e){}
    try{ updateCart(); }catch(_e){}
    alert('Panier ajouté aux favoris.');
  };

  const oldLoadFavoriteV55 = window.loadFavoriteCartV54;
  if(typeof oldLoadFavoriteV55==='function'){
    window.loadFavoriteCartV54 = function(i){
      oldLoadFavoriteV55(i);
      try{ updateCart(); }catch(_e){}
    };
  }

  function v55RenderFavoriteButton(){
    const payBtn=document.getElementById('payBtn');
    if(!payBtn) return;
    payBtn.textContent='💳 PASSER AU PAIEMENT';
    let btn=document.getElementById('cartFavoriteSaveBtnV55');
    if(!btn){
      btn=document.createElement('button');
      btn.id='cartFavoriteSaveBtnV55';
      btn.className='cart-favorite-save v55';
      btn.type='button';
      btn.textContent='♡ Enregistrer ce panier en favori';
      btn.onclick=window.saveCurrentCartFavoriteV55;
    }
    payBtn.parentNode.insertBefore(btn,payBtn);
    const shouldShow=Array.isArray(cart) && cart.length>0 && v55FindMatchingFavoriteIndex()<0;
    btn.style.display=shouldShow?'block':'none';
  }

  function v55RenderCartRows(){
    const list=document.getElementById('cartList');
    if(!list) return;
    if(!Array.isArray(cart) || !cart.length){
      list.innerHTML='<p style="color:var(--text-dim)">Votre panier est vide.</p>';
      v55RenderFavoriteButton();
      const btn=document.getElementById('cartFavoriteSaveBtnV55'); if(btn) btn.style.display='none';
      return;
    }
    list.innerHTML = cart.map((c,index)=>{
      const qty=Math.max(1,Number(c.qty)||1);
      const options=(c.options||[]).map(o=>o.name).join(' • ');
      const linePrice=((Number(c.price)||0)*qty).toFixed(2);
      return `<div class="cartItem v55-clean-row"><div class="v55-cart-main"><button type="button" class="v55-cart-remove" onclick="decCartQtyV54(${index})">−</button><div class="v55-cart-copy"><div class="v55-cart-title"><span>${c.name}</span>${qty>1?`<span class="v55-cart-qty-chip">x${qty}</span>`:''}</div>${options?`<div class="v55-cart-options">${options}</div>`:''}${qty>1 && options ? `<div class="v55-cart-note">${qty} exemplaires avec les mêmes options.</div>`:''}</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;"><div style="font-weight:800;white-space:nowrap;">${linePrice} €</div><div class="v55-cart-stepper"><button type="button" onclick="decCartQtyV54(${index})">−</button><strong>${qty}</strong><button type="button" onclick="incCartQtyV54(${index})">+</button></div></div></div>`;
    }).join('');
    v55RenderFavoriteButton();
  }
  const oldUpdateCartV55 = window.updateCart || updateCart;
  window.updateCart = function(){
    const r = oldUpdateCartV55.apply(this, arguments);
    try{ v55RenderCartRows(); }catch(_e){}
    return r;
  };

  function v55EnsureMaintenanceOverlay(){
    let overlay=document.getElementById('maintenanceOverlayV54');
    if(!overlay){
      overlay=document.createElement('div');
      overlay.id='maintenanceOverlayV54';
      overlay.innerHTML='<div class="maintenance-card-v54"><h2>Lago</h2><p id="maintenanceMsgV54"></p><div class="small">Service temporairement indisponible.</div></div>';
      document.body.appendChild(overlay);
    }
    return overlay;
  }
  window.applyMaintenanceV55 = function(){
    v55ReadShared();
    const overlay=v55EnsureMaintenanceOverlay();
    const msg=document.getElementById('maintenanceMsgV54');
    const isClient=!!(window.currentUser && window.currentUser.role!=='admin');
    if(msg) msg.textContent=reglages.maintenanceMessage||'Lago est en mise à jour. On revient très vite.';
    const active=!!reglages.maintenanceActive && isClient;
    overlay.classList.toggle('show',active);
    overlay.style.pointerEvents=active?'auto':'none';
    const app=document.getElementById('clientApp');
    if(app) app.classList.toggle('maintenance-blocked',active);
  };
  window.saveMaintenanceSettings = function(){
    reglages.maintenanceActive=!!document.getElementById('adminMaintenanceToggle')?.checked;
    reglages.maintenanceMessage=(document.getElementById('adminMaintenanceMessage')?.value||'Lago est en mise à jour. On revient très vite.').trim() || 'Lago est en mise à jour. On revient très vite.';
    saveAll();
    window.applyMaintenanceV55();
    alert(reglages.maintenanceActive?'Lago est maintenant en pause côté client.':'Maintenance désactivée.');
  };

  const oldDoLoginV55 = window.doLogin;
  if(typeof oldDoLoginV55==='function'){
    window.doLogin = function(email){
      const r=oldDoLoginV55.apply(this,arguments);
      setTimeout(()=>{
        v55ReadShared();
        try{ window.applyMaintenanceV55(); }catch(_e){}
        try{ window.initAvatarsUI(); }catch(_e){}
        try{ window.updateCart(); }catch(_e){}
      },420);
      return r;
    };
  }
  const oldLogOutV55 = window.logOut;
  if(typeof oldLogOutV55==='function'){
    window.logOut = function(){
      const r=oldLogOutV55.apply(this,arguments);
      setTimeout(()=>{ try{ window.applyMaintenanceV55(); }catch(_e){} },80);
      return r;
    };
  }

  window.addEventListener('storage', function(e){
    if(e.key===V55_SHARED_KEY){
      v55ReadShared();
      try{ window.applyMaintenanceV55(); }catch(_e){}
    }
  });

  function bootV55(){
    v55ReadShared();
    try{ window.initAvatarsUI(); }catch(_e){}
    try{ v55WatchAvatarModal(); }catch(_e){}
    try{ window.updateCart(); }catch(_e){}
    try{ window.applyMaintenanceV55(); }catch(_e){}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bootV55); else bootV55();
  setTimeout(bootV55,180);
  setTimeout(bootV55,800);
})();


/* ===== V59 — checkout final propre, maps, planification et suivi sync ===== */
(function(){
  const TOURS_CENTER={lat:47.3941,lng:0.6848};
  const KNOWN_ADDRESSES={
    '14 rue du grand cèdre|37550 saint-avertin':{lat:47.3656,lng:0.7390},
    '86 bd jean jaurès|joué-lès-tours':{lat:47.3524,lng:0.6636},
    '55 quai paul bert|tours':{lat:47.3947,lng:0.7056},
    'st cyr equatop|saint-cyr-sur-loire':{lat:47.4096,lng:0.6745},
    "9 rue de l'abbaye|37460 villeloin-coulangé":{lat:47.1467,lng:1.2158},
    '14 rue du grand cèdre|saint-avertin':{lat:47.3656,lng:0.7390}
  };
  function money(n){return (Number(n)||0).toFixed(2)+' €';}
  function safe(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function ensureV58(){
    if(!Array.isArray(reglages.savedAddresses)) reglages.savedAddresses=[];
    if(!reglages.checkoutAddress) reglages.checkoutAddress=null;
    if(typeof reglages.checkoutPhone!=='string') reglages.checkoutPhone='';
    if(!reglages.deliveryMeetPoint) reglages.deliveryMeetPoint='door';
    if(typeof reglages.deliveryInstructions!=='string') reglages.deliveryInstructions='';
    if(!reglages.checkoutDeliveryMode) reglages.checkoutDeliveryMode='standard';
    if(typeof reglages.checkoutScheduledTime!=='string') reglages.checkoutScheduledTime='';
    if(typeof reglages.checkoutScheduleDay!=='string') reglages.checkoutScheduleDay='Aujourd’hui';
    if(typeof reglages.checkoutMapCollapsed!=='boolean') reglages.checkoutMapCollapsed=false;
    if(typeof reglages.v58MapEditorTarget!=='string') reglages.v58MapEditorTarget='destination';
    if(typeof reglages.v58LastScheduleSlot!=='string') reglages.v58LastScheduleSlot='12:00–12:30';
    if(typeof reglages.v58LastScheduleDate!=='string') reglages.v58LastScheduleDate='Aujourd’hui';
  }
  function addr(){ ensureV58(); return reglages.checkoutAddress || reglages.savedAddresses[0] || null; }
  function addressString(a){ return a ? `${a.street||''} ${a.city||''}`.trim() : ''; }
  function normalizeKey(street,city){ return `${String(street||'').trim().toLowerCase()}|${String(city||'').trim().toLowerCase()}`; }
  async function geocodeAddressV58(a){
    if(!a) return TOURS_CENTER;
    if(Number.isFinite(a.lat) && Number.isFinite(a.lng)) return {lat:Number(a.lat),lng:Number(a.lng)};
    const known=KNOWN_ADDRESSES[normalizeKey(a.street,a.city)] || KNOWN_ADDRESSES[normalizeKey(a.label||a.street,a.city)];
    if(known){ a.lat=known.lat; a.lng=known.lng; saveAll(); return known; }
    try{
      const q=encodeURIComponent(`${a.street||''}, ${a.city||''}, France`);
      const r=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${q}`);
      const j=await r.json();
      if(Array.isArray(j) && j[0]){
        a.lat=Number(j[0].lat); a.lng=Number(j[0].lon); saveAll(); return {lat:a.lat,lng:a.lng};
      }
    }catch(_e){}
    a.lat=TOURS_CENTER.lat; a.lng=TOURS_CENTER.lng; saveAll();
    return TOURS_CENTER;
  }
  function getAddrCoords(a){
    if(a && Number.isFinite(a.lat) && Number.isFinite(a.lng)) return {lat:Number(a.lat),lng:Number(a.lng)};
    return TOURS_CENTER;
  }
  function getPinStore(a){ if(!a) return null; if(!a.pins || typeof a.pins!=='object') a.pins={}; return a.pins; }
  function getTargetCoords(target){
    const a=addr();
    if(!a) return getAddrCoords(null);
    const pins=getPinStore(a);
    if(pins && pins[target] && Number.isFinite(pins[target].lat) && Number.isFinite(pins[target].lng)) return {lat:Number(pins[target].lat),lng:Number(pins[target].lng)};
    return getAddrCoords(a);
  }
  function setTargetCoords(target,latlng){
    const a=addr(); if(!a) return;
    const pins=getPinStore(a);
    pins[target]={lat:latlng.lat,lng:latlng.lng};
    if(target==='destination'){ a.lat=latlng.lat; a.lng=latlng.lng; }
    reglages.checkoutAddress=a; saveAll();
  }
  function subtotal(){ return (cart||[]).reduce((a,c)=>a+(Number(c.price)||0)*(Number(c.qty)||1),0); }
  function promoByIdCheckout(id){
    try{ if(typeof promoById==='function'){ const p=promoById(id); if(p) return p; } }catch(_e){}
    try{ return (LAGO_PROMO_LIBRARY.find(p=>p.id===id) || (typeof PREMIUM_PROMOS!=='undefined'?PREMIUM_PROMOS.find(p=>p.id===id):null) || null); }catch(_e){ return null; }
  }
  function promoValue(){
    try{ if(promoActive) return Math.max(0,Number(computePromoDiscount())||0); }catch(_e){}
    try{ return Math.max(0,Number(rewardPromoDiscount())||0); }catch(_e){}
    return 0;
  }
  function lagoPlusSaving(){
    if(!reglages.isPremium) return 0;
    return Math.round(subtotal()*0.15*100)/100 + ((Number(cartDistance)||9)<=3 ? 4.99 : 0);
  }
  function deliveryFee(){ return reglages.isPremium && Number(cartDistance||9)<=3 ? 0 : 4.99; }
  function priorityFee(){ return reglages.checkoutDeliveryMode==='priority' ? 2.99 : 0; }
  function checkoutTotal(){
    return Math.max(0, subtotal() + deliveryFee() + 2.99 + priorityFee() + (Number(currentTip)||0) - promoValue() - lagoPlusSaving() - (Number(currentCagnotteDeduction)||0));
  }
  function getVisiblePromos(){
    const normal=(reglages.adminVisiblePromoIds||[]).slice(0,3).map(promoByIdCheckout).filter(Boolean).map(p=>({...p,premium:!!p.premium}));
    const premium=reglages.isPremium ? (reglages.adminVisiblePremiumPromoIds||[]).slice(0,3).map(promoByIdCheckout).filter(Boolean).map(p=>({...p,premium:true})) : [];
    return [...normal,...premium];
  }
  function ensurePages(){
    const app=document.getElementById('clientApp'); if(!app) return;
    const main=app.querySelector('main')||app;
    ['checkoutV58','addressesV58','deliveryOptionsV58','scheduleV58'].forEach(id=>{
      if(!document.getElementById(id)){
        const sec=document.createElement('section'); sec.id=id; sec.className='v58-full-page'; main.appendChild(sec);
      }
    });
    if(!document.getElementById('v58MapEditorOverlay')){
      const div=document.createElement('div');
      div.id='v58MapEditorOverlay';
      div.className='v58-map-editor-overlay';
      div.innerHTML=`<div class="v58-map-editor-shell"><div class="v58-map-editor-map" id="v58MapEditorMap"></div><button type="button" class="v58-map-editor-close" onclick="closeMapEditorV58()">×</button><button type="button" class="v58-map-editor-recenter" onclick="recenterMapEditorV58()">↻</button><div class="v58-map-editor-pin"></div><div class="v58-map-editor-sheet"><h3>Modifiez les repères</h3><div class="v58-map-targets"><button type="button" id="v58TargetBtn-destination" onclick="switchMapTargetV58('destination')"><span>⌖</span><b>Destination</b></button><button type="button" id="v58TargetBtn-entry" onclick="switchMapTargetV58('entry')"><span>↪</span><b>Entrée</b></button><button type="button" id="v58TargetBtn-parking" onclick="switchMapTargetV58('parking')"><span>P</span><b>Parking</b></button></div><p id="v58MapTargetHelp">Déplacez la carte pour placer le repère.</p><button type="button" class="v58-map-editor-ok" onclick="confirmMapEditorV58()">OK</button></div></div>`;
      document.body.appendChild(div);
    }
  }
  function showPage(id){
    ensurePages();
    document.getElementById('clientApp')?.querySelectorAll('section').forEach(s=>s.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
    const nav=document.getElementById('clientNav'); if(nav) nav.style.display='none';
  }
  function backToCart(){
    document.getElementById('clientApp')?.querySelectorAll('section').forEach(s=>s.classList.remove('active'));
    document.getElementById('orders')?.classList.add('active');
    const nav=document.getElementById('clientNav'); if(nav) nav.style.display='flex';
    try{ updateCart(); }catch(_e){}
  }
  window.closeCheckoutV58=backToCart;

  window.openCheckoutV58=function(){
    if(deliveryInProgress) return alert('Une livraison est déjà en cours.');
    if(!Array.isArray(cart)||!cart.length) return alert('Ton panier est vide !');
    ensureV58(); ensurePages();
    renderCheckoutV58(); showPage('checkoutV58');
    setTimeout(()=>{ geocodeAddressV58(addr()).then(()=>{ try{ refreshMiniMapV58(); renderCheckoutV58(); }catch(_e){} }); },50);
  };

  function mapHtml(){
    const a=addr(); const label=a?`${a.street}`:'Adresse non renseignée';
    return `<div class="v58-map-shell"><div class="v58-map ${reglages.checkoutMapCollapsed?'collapsed':''}" id="checkoutMapWrapV58" onclick="openMapEditorV58()"><div id="checkoutMapLeafletV58" class="v58-map-leaflet"></div><div class="v58-pin"></div><button type="button" class="v58-map-edit" onclick="event.stopPropagation();openMapEditorV58()">Modifier le repère</button><button type="button" class="v58-map-collapse" onclick="toggleMapCollapseV58(event)">${reglages.checkoutMapCollapsed?'↓':'↑'}</button><div class="v58-map-label">${safe(label)}</div></div></div>`;
  }
  window.toggleMapCollapseV58=function(e){ e?.stopPropagation(); ensureV58(); reglages.checkoutMapCollapsed=!reglages.checkoutMapCollapsed; saveAll(); renderCheckoutV58(); };

  let checkoutMiniMapV58=null, checkoutMiniTileV58=null, mapEditorV58=null, mapEditorTileV58=null, mapEditorCurrentTarget='destination';
  function buildLeafletMap(id, center, zoom){
    const map=L.map(id,{zoomControl:false,attributionControl:false,scrollWheelZoom:false,dragging:true,tap:true});
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:19}).addTo(map);
    return map.setView([center.lat,center.lng], zoom||16);
  }
  function refreshMiniMapV58(){
    const holder=document.getElementById('checkoutMapLeafletV58'); if(!holder) return;
    const c=getTargetCoords('destination');
    if(!checkoutMiniMapV58){
      checkoutMiniMapV58=buildLeafletMap('checkoutMapLeafletV58',c,16);
      checkoutMiniMapV58.dragging.disable(); checkoutMiniMapV58.touchZoom.disable(); checkoutMiniMapV58.doubleClickZoom.disable(); checkoutMiniMapV58.boxZoom.disable(); checkoutMiniMapV58.keyboard.disable();
    }else{ checkoutMiniMapV58.setView([c.lat,c.lng],16,{animate:false}); setTimeout(()=>checkoutMiniMapV58.invalidateSize(),30); }
  }
  function scheduleLabel(){ return reglages.checkoutScheduledTime ? `${reglages.checkoutScheduleDay||'Aujourd’hui'} • ${reglages.checkoutScheduledTime}` : 'Choisir une heure'; }
  function renderCheckoutV58(){
    ensureV58(); ensurePages(); const box=document.getElementById('checkoutV58'); if(!box) return;
    if(checkoutMiniMapV58){ try{ checkoutMiniMapV58.remove(); }catch(_e){} checkoutMiniMapV58=null; }
    const a=addr(); const sub=subtotal(), promo=promoValue(), lago=lagoPlusSaving(), del=deliveryFee(), prio=priorityFee(), service=2.99, total=checkoutTotal();
    const tva=Math.max(0,total-(total/1.2));
    const items=(cart||[]).map(c=>`${safe(c.name)}${(Number(c.qty)||1)>1?' x'+(Number(c.qty)||1):''}${(c.options||[]).length?' + '+c.options.map(o=>safe(o.name)).join(', '):''}`).join(' • ');
    const promos=getVisiblePromos(); const active=reglages.activeRewardPromo;
    box.innerHTML=`
      <div class="v58-top"><button type="button" onclick="closeCheckoutV58()">←</button><h2>Paiement</h2><span></span></div>
      <div class="v58-scroll">
        ${mapHtml()}
        <div class="v58-info-list">
          <button type="button" class="v58-row" onclick="openAddressesV58()"><span class="v58-ico">⌖</span><div><b>${a?safe(a.street):'Ajouter une adresse de livraison'}</b><small>${a?safe(a.city):'Aucune adresse enregistrée'}</small></div><em>›</em></button>
          <button type="button" class="v58-row" onclick="openDeliveryOptionsV58()"><span class="v58-ico">☻</span><div><b>${meetLabelV58()}</b><small>${reglages.deliveryInstructions?safe(reglages.deliveryInstructions):'Instructions pour le coursier'}</small></div><em>›</em></button>
          <button type="button" class="v58-row" onclick="editPhoneV58()"><span class="v58-ico">☎</span><div><b>${reglages.checkoutPhone?safe(reglages.checkoutPhone):'Ajouter un numéro'}</b><small>Contact livraison</small></div><em>›</em></button>
        </div>
        <h3 class="v58-block-title">Délai de livraison</h3>
        <div class="v58-delivery-grid">
          <button type="button" class="${reglages.checkoutDeliveryMode==='priority'?'active':''}" onclick="setCheckoutDeliveryV58('priority')"><b>⚡ Prioritaire</b><small>+2,99 € • plus rapide</small></button>
          <button type="button" class="${reglages.checkoutDeliveryMode==='standard'?'active':''}" onclick="setCheckoutDeliveryV58('standard')"><b>Standard</b><small>5-10 min recherche</small></button>
          <button type="button" class="${reglages.checkoutDeliveryMode==='scheduled'?'active':''}" onclick="setCheckoutDeliveryV58('scheduled')"><b>Planifier</b><small>${safe(scheduleLabel())}</small></button>
        </div>
        <button type="button" class="v58-order-summary v58-clickable" onclick="openOrderSummaryModal()"><h3>Récapitulatif de la commande</h3><div class="v58-order-line"><div class="v58-shop-dot">L</div><div><b>Lago</b><small>${items||'Panier Lago'}</small></div><em>›</em></div></button>
        <div class="v58-promos"><button type="button" class="v58-promo-head" onclick="togglePromosV58()"><span>🏷️</span><div><b>${promo>0?'1 promotion appliquée':'Promotions'}</b><small>${promos.length} promotions disponibles${promo>0?' • -'+money(promo):''}</small></div><em>›</em></button><div id="v58PromoList" class="v58-promo-list">${promos.map(p=>`<button type="button" class="${active===p.id?'active':''}" onclick="applyCheckoutPromoV58('${p.id}')"><span>${p.icon||'🎁'}</span><div><b>${safe(p.title)}${p.premium?' • Lago+':''}</b><small>${safe(p.desc||'Offre Lago')}</small></div></button>`).join('')||'<small>Aucune promotion visible.</small>'}</div></div>
        <div class="v58-price"><div><span>Sous-total</span><b>${money(sub)}</b></div>${promo>0?`<div class="discount"><span>Promotion</span><b>-${money(promo)}</b></div>`:''}${lago>0?`<div class="discount gold"><span>Avantage Lago+</span><b>-${money(lago)}</b></div>`:''}<div><span>Frais de service</span><b>${money(service)}</b></div><div><span>Frais de livraison</span><b>${money(del)}</b></div>${prio>0?`<div><span>Livraison prioritaire</span><b>${money(prio)}</b></div>`:''}<div><span>TVA incluse</span><b>${money(tva)}</b></div><div class="total"><span>Total</span><b>${money(total)}</b></div></div>
        <div class="v58-saving ${reglages.isPremium?'gold':''}"><b>${reglages.isPremium?'Avec Lago+, vous économisez':'Avec les promotions, vous économisez'}</b><strong>${money(reglages.isPremium?lago:promo)}</strong></div>
        <div class="v58-legal"><b>Contrat sur les services Lago</b><br>En cliquant sur le bouton pour passer votre commande, vous acceptez le contrat sur les services de livraison avec Lago SAS (RCS 912 456 781).<br><br>Vous renoncez à votre droit de rétractation pour les services de livraison une fois la commande confirmée. Assistance Lago : 01 84 25 68 42.</div>
      </div>
      <div class="v58-bottom"><button type="button" onclick="submitCheckoutV58()">Commander et payer</button></div>`;
    setTimeout(refreshMiniMapV58,30);
  }
  function meetLabelV58(){ return {door:'Rendez-vous devant ma porte',outside:"Rendez-vous à l’extérieur",parking:'Rendez-vous sur le parking le plus proche',leave:'Laisser sur place'}[reglages.deliveryMeetPoint]||'Rendez-vous devant ma porte'; }

  window.setCheckoutDeliveryV58=function(mode){
    ensureV58();
    if(mode==='scheduled') return openScheduleV58();
    reglages.checkoutDeliveryMode=mode; saveAll(); renderCheckoutV58();
  };
  window.editPhoneV58=function(){ ensureV58(); const p=prompt('Numéro de téléphone :',reglages.checkoutPhone||''); if(p!==null){ reglages.checkoutPhone=p.trim(); saveAll(); renderCheckoutV58(); } };
  window.togglePromosV58=function(){ document.getElementById('v58PromoList')?.classList.toggle('show'); };
  window.applyCheckoutPromoV58=function(id){ if(reglages.activeRewardPromo===id){ reglages.activeRewardPromo=null; reglages.claimedPromotionIds=[]; } else { try{ claimFixedPromotion(id); }catch(_e){ reglages.activeRewardPromo=id; reglages.claimedPromotionIds=[id]; promoActive=false; } } saveAll(); try{ updateCart(); }catch(_e){} renderCheckoutV58(); };

  window.openAddressesV58=function(){ ensureV58(); renderAddressesV58(); showPage('addressesV58'); };
  function renderAddressesV58(){
    const box=document.getElementById('addressesV58'); if(!box) return;
    box.innerHTML=`<div class="v58-top"><button onclick="renderCheckoutV58();showPage('checkoutV58')">←</button><h2>Mes adresses</h2><span></span></div><div class="v58-scroll"><button class="v58-add-address" onclick="addAddressV58()">＋ Ajouter une nouvelle adresse</button><h3 class="v58-block-title">Mon adresse</h3><div class="v58-address-list">${(reglages.savedAddresses||[]).map((a,i)=>`<button type="button" onclick="selectAddressV58(${i})"><span>⌖</span><div><b>${safe(a.label||a.street)}</b><small>${safe(a.street)}<br>${safe(a.city)}</small></div><em onclick="event.stopPropagation();editAddressV58(${i})">✎</em></button>`).join('')||'<div class="v58-empty">Aucune adresse. Ajoute ta première adresse.</div>'}</div></div>`;
  }
  window.addAddressV58=async function(){
    const street=prompt('Adresse :',addr()?.street||''); if(!street) return;
    const city=prompt('Ville / code postal :',addr()?.city||''); if(city===null) return;
    const label=prompt('Nom de l’adresse :','Domicile')||street;
    const a={label:label.trim(),street:street.trim(),city:city.trim()}; reglages.savedAddresses.unshift(a); reglages.checkoutAddress=a; await geocodeAddressV58(a); saveAll(); renderAddressesV58();
  };
  window.editAddressV58=async function(i){ const a=reglages.savedAddresses[i]; if(!a) return; const street=prompt('Adresse :',a.street); if(!street) return; const city=prompt('Ville / code postal :',a.city); if(city===null) return; const label=prompt('Nom :',a.label||'Adresse')||street; reglages.savedAddresses[i]={...a,label:label.trim(),street:street.trim(),city:city.trim()}; reglages.checkoutAddress=reglages.savedAddresses[i]; await geocodeAddressV58(reglages.savedAddresses[i]); saveAll(); renderAddressesV58(); };
  window.selectAddressV58=async function(i){ const a=reglages.savedAddresses[i]; if(!a) return; reglages.checkoutAddress=a; await geocodeAddressV58(a); saveAll(); renderCheckoutV58(); showPage('checkoutV58'); };

  window.openDeliveryOptionsV58=function(){ renderDeliveryOptionsV58(); showPage('deliveryOptionsV58'); };
  function renderDeliveryOptionsV58(){
    const a=addr(); const box=document.getElementById('deliveryOptionsV58'); if(!box) return;
    box.innerHTML=`<div class="v58-top"><button onclick="renderCheckoutV58();showPage('checkoutV58')">←</button><h2>Options de livraison</h2><span></span></div><div class="v58-scroll"><p class="v58-delivery-to">Livraison à ${safe(a?a.street:'votre adresse')} • <u>Ajouter un appartement/une suite</u></p><div class="v58-meet-card"><h3>Donnez-le moi</h3>${['door','outside','parking'].map(k=>`<button type="button" class="${reglages.deliveryMeetPoint===k?'active':''}" onclick="setMeetV58('${k}')"><span>${{door:'Rendez-vous devant ma porte',outside:"Rendez-vous à l’extérieur",parking:'Rendez-vous sur le parking le plus proche'}[k]}</span><b></b></button>`).join('')}</div><div class="v58-meet-card"><h3>Laisser sur place</h3><button type="button" class="${reglages.deliveryMeetPoint==='leave'?'active':''}" onclick="setMeetV58('leave')"><span>Laisser sur place</span><b></b></button></div><h3 class="v58-block-title">Instructions pour le coursier</h3><textarea id="v58InstructionsInput" class="v58-instructions" placeholder="Ex. Code porte, étage, immeuble, appelez-moi...">${safe(reglages.deliveryInstructions)}</textarea><button class="v58-add-photo">📷 Ajoutez des photos</button></div><div class="v58-bottom"><button onclick="saveDeliveryOptionsV58()">Mettre à jour</button></div>`;
  }
  window.setMeetV58=function(k){ reglages.deliveryMeetPoint=k; renderDeliveryOptionsV58(); };
  window.saveDeliveryOptionsV58=function(){ reglages.deliveryInstructions=(document.getElementById('v58InstructionsInput')?.value||'').trim(); saveAll(); renderCheckoutV58(); showPage('checkoutV58'); };

  window.openScheduleV58=function(){ ensureV58(); renderScheduleV58(); showPage('scheduleV58'); };
  function futureDateLabel(offset){
    const d=new Date(); d.setDate(d.getDate()+offset);
    const days=['dim.','lun.','mar.','mer.','jeu.','ven.','sam.'];
    return {title:offset===0?'Aujourd’hui':offset===1?'Demain':days[d.getDay()], sub:`${d.getDate()} ${['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'][d.getMonth()]}`};
  }
  function renderScheduleV58(){
    const box=document.getElementById('scheduleV58'); if(!box) return;
    const days=[0,1,2].map(futureDateLabel);
    const slots=['12:00–12:30','12:15–12:45','12:30–13:00','12:45–13:15','13:00–13:30','13:15–13:45'];
    box.innerHTML=`<div class="v58-top"><button onclick="renderCheckoutV58();showPage('checkoutV58')">×</button><h2>Planifier</h2><span></span></div><div class="v58-scroll"><div class="v58-schedule-head"><h1>Planifier une livraison</h1><p>Lago ouvre à 11:00.</p></div><div class="v58-schedule-days">${days.map(d=>`<button type="button" class="${reglages.v58LastScheduleDate===d.title?'active':''}" onclick="selectScheduleDayV58('${safe(d.title)}')"><b>${d.title}</b><small>${d.sub}</small></button>`).join('')}</div><div class="v58-schedule-slots">${slots.map(s=>`<button type="button" class="${reglages.v58LastScheduleSlot===s?'active':''}" onclick="selectScheduleSlotV58('${s}')"><span>${s}</span><b></b></button>`).join('')}</div><div class="v58-schedule-actions"><button type="button" class="primary" onclick="confirmScheduleV58()">Planifier</button><button type="button" class="secondary" onclick="renderCheckoutV58();showPage('checkoutV58')">Annuler</button></div></div>`;
  }
  window.selectScheduleDayV58=function(v){ reglages.v58LastScheduleDate=v; renderScheduleV58(); };
  window.selectScheduleSlotV58=function(v){ reglages.v58LastScheduleSlot=v; renderScheduleV58(); };
  window.confirmScheduleV58=function(){ ensureV58(); reglages.checkoutDeliveryMode='scheduled'; reglages.checkoutScheduleDay=reglages.v58LastScheduleDate||'Aujourd’hui'; reglages.checkoutScheduledTime=reglages.v58LastScheduleSlot||'12:00–12:30'; saveAll(); renderCheckoutV58(); showPage('checkoutV58'); };

  window.openMapEditorV58=async function(){
    ensureV58(); ensurePages();
    await geocodeAddressV58(addr());
    const overlay=document.getElementById('v58MapEditorOverlay'); if(!overlay) return;
    overlay.classList.add('show');
    mapEditorCurrentTarget=reglages.v58MapEditorTarget||'destination';
    const c=getTargetCoords(mapEditorCurrentTarget);
    if(!mapEditorV58){
      mapEditorV58=buildLeafletMap('v58MapEditorMap',c,18);
      mapEditorV58.scrollWheelZoom.enable();
    }else{ mapEditorV58.setView([c.lat,c.lng],18,{animate:false}); setTimeout(()=>mapEditorV58.invalidateSize(),20); }
    switchMapTargetV58(mapEditorCurrentTarget);
  };
  window.closeMapEditorV58=function(){ document.getElementById('v58MapEditorOverlay')?.classList.remove('show'); };
  window.switchMapTargetV58=function(target){
    mapEditorCurrentTarget=target; reglages.v58MapEditorTarget=target; saveAll();
    ['destination','entry','parking'].forEach(k=>document.getElementById(`v58TargetBtn-${k}`)?.classList.toggle('active',k===target));
    const help={destination:"Déplacez le repère à l’endroit où le coursier doit déposer votre commande.",entry:"Placez l’entrée exacte de l’immeuble ou du portail.",parking:"Placez le parking ou la zone de stationnement la plus proche."}[target]||'Déplacez la carte pour placer le repère.';
    const helpEl=document.getElementById('v58MapTargetHelp'); if(helpEl) helpEl.textContent=help;
    const c=getTargetCoords(target); if(mapEditorV58) mapEditorV58.setView([c.lat,c.lng],18,{animate:false});
  };
  window.recenterMapEditorV58=function(){ const c=getAddrCoords(addr()); if(mapEditorV58) mapEditorV58.setView([c.lat,c.lng],18,{animate:true}); };
  window.confirmMapEditorV58=function(){ if(!mapEditorV58) return; const c=mapEditorV58.getCenter(); setTargetCoords(mapEditorCurrentTarget,{lat:c.lat,lng:c.lng}); closeMapEditorV58(); renderCheckoutV58(); };

  function validateCheckout(){
    if(!addr()) return alert('Ajoute une adresse de livraison.');
    if(!reglages.checkoutPhone) return alert('Ajoute ton numéro de téléphone.');
    if(reglages.checkoutDeliveryMode==='scheduled' && !reglages.checkoutScheduledTime) return alert('Choisis une heure pour la livraison planifiée.');
    return true;
  }
  window.submitCheckoutV58=function(){
    if(!validateCheckout()) return;
    const amount=checkoutTotal();
    const dist=Number(cartDistance)||2.4;
    const realMinutes=computeRealisticDeliveryMinutes(dist);
    const searchMinutes=Math.max(5,Math.min(10,Math.round(5+dist*1.4+Math.random()*2)));
    window.v58CurrentDeliveryTimings={searchMs:Math.round(searchMinutes*60*1000*Math.max(.01,Number(reglages.deliverySpeedMultiplier)||1)),routeMs:Math.round(Math.max(2,realMinutes)*60*1000*Math.max(.01,Number(reglages.deliverySpeedMultiplier)||1)),searchMinutes,realMinutes};
    openPaymentModal(amount,()=>completeCheckoutV58(amount));
  };
  function completeCheckoutV58(finalPrice){
    const snapshot=(cart||[]).map(c=>({name:c.name,qty:Number(c.qty)||1,price:Number(c.price)||0,options:(c.options||[]).map(o=>({...o}))}));
    const resumeItems=snapshot.map(c=>`${c.name}${c.qty>1?' (x'+c.qty+')':''}`).join(', ');
    const sub=snapshot.reduce((a,c)=>a+c.price*c.qty,0);
    const cutPatron=Math.max(0,(sub*0.6)+deliveryFee()+2.99+priorityFee()-promoValue()-lagoPlusSaving());
    reglages.historiqueCommandes.push({id:Date.now(),date:new Date().toLocaleString('fr-FR'),prix:finalPrice,items:resumeItems,status:reglages.checkoutDeliveryMode==='scheduled'?'Programmée':'Terminée',address:addr()?.street,deliveryMode:reglages.checkoutDeliveryMode,meetPoint:meetLabelV58()});
    reglages.caTotal=Math.round(((Number(reglages.caTotal)||0)+cutPatron)*100)/100;
    reglages.totalOrders=(Number(reglages.totalOrders)||0)+1;
    try{ registerPromoUsageIfNeeded(); registerEasterPromoUsageIfNeeded(); }catch(_e){}
    if(reglages.checkoutDeliveryMode==='scheduled'){
      cart=[]; promoActive=false; currentTip=0; currentCagnotteDeduction=0; saveAll(); updateCart(); alert(`✅ Livraison planifiée pour ${reglages.checkoutScheduleDay||'Aujourd’hui'} • ${reglages.checkoutScheduledTime}.`); closeCheckoutV58(); return;
    }
    startDeliveryFlow(resumeItems,finalPrice);
    showDeliveryStepsV58();
    cart=[]; promoActive=false; currentTip=0; currentCagnotteDeduction=0;
    try{ updateCart(); saveAll(); }catch(_e){ saveAll(); }
  }

  let v58StageTimers=[]; let v58Observer=null;
  function setDeliveryStageV58(n){
    const box=document.getElementById('deliveryStepsV58'); if(!box) return;
    box.querySelectorAll('div').forEach((d,i)=>d.classList.toggle('active',i<=n));
  }
  function clearStageTimersV58(){ v58StageTimers.forEach(clearTimeout); v58StageTimers=[]; }
  function showDeliveryStepsV58(){
    const tracking=document.getElementById('tracking'); if(!tracking) return;
    let box=document.getElementById('deliveryStepsV58');
    if(!box){ box=document.createElement('div'); box.id='deliveryStepsV58'; box.className='v58-delivery-steps'; const desc=document.getElementById('trackDesc'); desc?.insertAdjacentElement('afterend',box); }
    const steps=['Recherche livreur','Livreur trouvé','Matelas récupéré','En route vers vous','Arrivé'];
    box.innerHTML=steps.map((s,i)=>`<div class="${i===0?'active':''}"><span>${i+1}</span><b>${s}</b></div>`).join('');
    clearStageTimersV58();
    const title=document.getElementById('trackTitle'); const desc=document.getElementById('trackDesc');
    const updateFromState=()=>{
      const t=(title?.innerText||'').toLowerCase(); const d=(desc?.innerText||'').toLowerCase();
      if(t.includes('il est là') || d.includes('descends vite')){ clearStageTimersV58(); setDeliveryStageV58(4); return; }
      if(t.includes('en route')){
        setDeliveryStageV58(1);
        if(!box.dataset.routeTimers){
          box.dataset.routeTimers='1';
          const timings=window.v58CurrentDeliveryTimings||{};
          const routeMs=Math.max(8000, Number(timings.routeMs)||240000);
          v58StageTimers.push(setTimeout(()=>setDeliveryStageV58(2),Math.round(routeMs*0.18)));
          v58StageTimers.push(setTimeout(()=>setDeliveryStageV58(3),Math.round(routeMs*0.55)));
        }
        return;
      }
      box.dataset.routeTimers='';
      setDeliveryStageV58(0);
    };
    updateFromState();
    if(v58Observer) try{ v58Observer.disconnect(); }catch(_e){}
    v58Observer=new MutationObserver(updateFromState);
    if(title) v58Observer.observe(title,{childList:true,subtree:true,characterData:true});
    if(desc) v58Observer.observe(desc,{childList:true,subtree:true,characterData:true});
  }
  const oldStartV58=window.startDeliveryFlow;
  if(typeof oldStartV58==='function') window.startDeliveryFlow=function(){ const r=oldStartV58.apply(this,arguments); setTimeout(showDeliveryStepsV58,120); return r; };

  function installRatingV58(){
    const rating=document.getElementById('ratingDiv'); if(!rating || document.getElementById('v58RatingDetails')) return;
    const extra=document.createElement('div'); extra.id='v58RatingDetails'; extra.className='v58-rating-details';
    extra.innerHTML=['Service','Temps','Propreté','État du matelas'].map(k=>`<div><span>${k}</span><div class="v58-mini-stars" data-rate="${k}">${[1,2,3,4,5].map(n=>`<button type="button" data-val="${n}">★</button>`).join('')}</div></div>`).join('');
    document.getElementById('commentInput')?.insertAdjacentElement('beforebegin',extra);
    extra.querySelectorAll('.v58-mini-stars button').forEach(b=>b.onclick=function(){ const p=this.parentElement; p.dataset.value=this.dataset.val; p.querySelectorAll('button').forEach(x=>x.classList.toggle('on',Number(x.dataset.val)<=Number(this.dataset.val))); });
  }

  function installCheckoutButton(){
    ensurePages(); ensureV58();
    const old=document.getElementById('payBtn');
    if(old){ old.style.display='none'; old.setAttribute('aria-hidden','true'); }
    let btn=document.getElementById('v58CheckoutBtn');
    if(!btn && old){ btn=document.createElement('button'); btn.id='v58CheckoutBtn'; btn.className='v58-checkout-open'; btn.type='button'; btn.textContent='Passer au paiement'; old.parentNode.insertBefore(btn,old); }
    if(btn) btn.onclick=function(e){ e.preventDefault(); e.stopPropagation(); openCheckoutV58(); };
  }
  const oldUpdateCartV58=window.updateCart || updateCart;
  window.updateCart=function(){ const r=oldUpdateCartV58.apply(this,arguments); try{ installCheckoutButton(); }catch(_e){} return r; };
  function boot(){ ensurePages(); ensureV58(); installCheckoutButton(); installRatingV58(); try{ updateCart(); }catch(_e){} }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
  setTimeout(boot,250); setTimeout(boot,900);
})();

/* ===== V60 — corrections carte / maintenance / résumé / planification ===== */
(function(){
  function safeV60(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function ensureV60Modal(){
    if(document.getElementById('v60CartSummaryModal')) return;
    const m=document.createElement('div');
    m.id='v60CartSummaryModal';
    m.className='v60-modal';
    m.innerHTML=`<div class="v60-modal-card"><button type="button" class="v60-modal-x" onclick="closeCartSummaryV60()">×</button><h2>Récapitulatif du panier</h2><div id="v60CartSummaryBody"></div><button type="button" class="v60-modal-primary" onclick="closeCartSummaryV60()">OK</button></div>`;
    document.body.appendChild(m);
  }
  window.closeCartSummaryV60=function(){document.getElementById('v60CartSummaryModal')?.classList.remove('show');};
  window.openCartSummaryV60=function(){
    ensureV60Modal();
    const body=document.getElementById('v60CartSummaryBody');
    const items=(Array.isArray(cart)?cart:[]);
    if(!items.length){ body.innerHTML='<p class="v60-empty">Ton panier est vide.</p>'; }
    else{
      body.innerHTML=items.map(c=>{
        const qty=Number(c.qty)||1;
        const opts=(c.options||[]).map(o=>`<li>${safeV60(o.name)} <b>${Number(o.price||0).toFixed(2)} €</b></li>`).join('');
        return `<div class="v60-summary-item"><div class="v60-summary-top"><strong>${safeV60(c.name)}${qty>1?' x'+qty:''}</strong><b>${((Number(c.price)||0)*qty).toFixed(2)} €</b></div>${opts?`<ul>${opts}</ul>`:'<small>Aucune option</small>'}</div>`;
      }).join('');
    }
    document.getElementById('v60CartSummaryModal')?.classList.add('show');
  };
  const oldOrderSummaryV60=window.openOrderSummaryModal;
  window.openOrderSummaryModal=function(){
    if(document.getElementById('checkoutV58')?.classList.contains('active')) return window.openCartSummaryV60();
    return oldOrderSummaryV60?.apply(this,arguments);
  };

  function forceCheckoutBack(){
    try{ renderCheckoutV58?.(); }catch(_e){}
    try{
      document.getElementById('clientApp')?.querySelectorAll('section').forEach(s=>s.classList.remove('active'));
      document.getElementById('checkoutV58')?.classList.add('active');
      const nav=document.getElementById('clientNav'); if(nav) nav.style.display='none';
    }catch(_e){}
  }
  window.backToCheckoutV60=forceCheckoutBack;

  const oldRenderDeliveryOptionsV60=window.openDeliveryOptionsV58;
  window.openDeliveryOptionsV58=function(){
    oldRenderDeliveryOptionsV60?.apply(this,arguments);
    setTimeout(()=>{
      const page=document.getElementById('deliveryOptionsV58');
      const topBtn=page?.querySelector('.v58-top button');
      if(topBtn) topBtn.setAttribute('onclick','backToCheckoutV60()');
      const bottom=page?.querySelector('.v58-bottom');
      if(bottom && !document.getElementById('v60DeliveryBackBtn')){
        const b=document.createElement('button');
        b.id='v60DeliveryBackBtn';
        b.type='button';
        b.className='v60-secondary-bottom';
        b.textContent='Retour';
        b.onclick=forceCheckoutBack;
        bottom.appendChild(b);
      }
    },40);
  };

  const oldOpenScheduleV60=window.openScheduleV58;
  window.openScheduleV58=function(){
    oldOpenScheduleV60?.apply(this,arguments);
    setTimeout(()=>{
      const page=document.getElementById('scheduleV58');
      const topBtn=page?.querySelector('.v58-top button');
      if(topBtn) topBtn.setAttribute('onclick','backToCheckoutV60()');
      page?.querySelectorAll('.v58-schedule-actions .secondary').forEach(b=>{ b.onclick=forceCheckoutBack; b.setAttribute('onclick','backToCheckoutV60()'); });
    },40);
  };

  function latLngForAddressV60(a){
    if(!a) return {lat:47.3941,lng:0.6848};
    const text=((a.street||'')+' '+(a.city||'')).toLowerCase();
    if(Number.isFinite(a.lat)&&Number.isFinite(a.lng)) return {lat:Number(a.lat),lng:Number(a.lng)};
    if(text.includes('grand cèdre')||text.includes('grand cedre')) return {lat:47.3656,lng:0.7390};
    if(text.includes('jean jaurès')||text.includes('jean jaures')) return {lat:47.3524,lng:0.6636};
    if(text.includes('quai paul bert')) return {lat:47.3947,lng:0.7056};
    if(text.includes('saint-cyr')||text.includes('st cyr')) return {lat:47.4096,lng:0.6745};
    if(text.includes('saint-avertin')) return {lat:47.3656,lng:0.7390};
    if(text.includes('joué')||text.includes('joue')) return {lat:47.3524,lng:0.6636};
    if(text.includes('tours')) return {lat:47.3941,lng:0.6848};
    return {lat:47.3941,lng:0.6848};
  }

  const oldAddAddressV60=window.addAddressV58;
  window.addAddressV58=async function(){
    const before=(reglages.savedAddresses||[]).length;
    await oldAddAddressV60?.apply(this,arguments);
    const a=reglages.checkoutAddress || (reglages.savedAddresses||[])[0];
    if(a && (!Number.isFinite(a.lat)||!Number.isFinite(a.lng))){ const c=latLngForAddressV60(a); a.lat=c.lat; a.lng=c.lng; reglages.checkoutAddress=a; saveAll(); }
    try{ renderAddressesV58?.(); }catch(_e){}
  };
  const oldSelectAddressV60=window.selectAddressV58;
  window.selectAddressV58=async function(i){
    const a=(reglages.savedAddresses||[])[i];
    if(a){ const c=latLngForAddressV60(a); a.lat=c.lat; a.lng=c.lng; reglages.checkoutAddress=a; saveAll(); }
    return oldSelectAddressV60?.apply(this,arguments);
  };
  const oldEditAddressV60=window.editAddressV58;
  window.editAddressV58=async function(i){
    await oldEditAddressV60?.apply(this,arguments);
    const a=(reglages.savedAddresses||[])[i] || reglages.checkoutAddress;
    if(a){ const c=latLngForAddressV60(a); a.lat=c.lat; a.lng=c.lng; reglages.checkoutAddress=a; saveAll(); }
    try{ renderAddressesV58?.(); }catch(_e){}
  };

  function rebuildMaintenanceOverlayV60(){
    let overlay=document.getElementById('maintenanceOverlayV54');
    if(!overlay){ overlay=document.createElement('div'); overlay.id='maintenanceOverlayV54'; document.body.appendChild(overlay); }
    overlay.innerHTML=`<div class="maintenance-card-v54 v60-maint-card"><button type="button" class="v60-maint-close" onclick="maintenanceLogoutV60()">×</button><h2>Lago</h2><p id="maintenanceMsgV54"></p><div class="small">Le service client est temporairement indisponible.</div><button type="button" onclick="maintenanceLogoutV60()" class="v60-maint-login">Retour connexion</button></div>`;
  }
  window.maintenanceLogoutV60=function(){
    const overlay=document.getElementById('maintenanceOverlayV54');
    if(overlay) overlay.classList.remove('show');
    try{ window.currentUser=null; }catch(_e){}
    ['clientApp','adminApp','driverApp'].forEach(id=>{ const el=document.getElementById(id); if(el) el.style.display='none'; });
    const auth=document.getElementById('authScreen'); if(auth){ auth.style.display='flex'; auth.style.opacity='1'; }
  };
  window.applyMaintenanceV55=function(){
    rebuildMaintenanceOverlayV60();
    const overlay=document.getElementById('maintenanceOverlayV54');
    const msg=document.getElementById('maintenanceMsgV54');
    const isClient=!!(window.currentUser && window.currentUser.role!=='admin');
    if(msg) msg.textContent=reglages.maintenanceMessage||'Lago est en mise à jour. On revient très vite.';
    overlay.classList.toggle('show',!!reglages.maintenanceActive && isClient);
    overlay.style.pointerEvents=(!!reglages.maintenanceActive && isClient)?'auto':'none';
  };
  window.applyMaintenanceV54=window.applyMaintenanceV55;
  const oldSaveMaintV60=window.saveMaintenanceSettings;
  window.saveMaintenanceSettings=function(){
    if(document.getElementById('adminMaintenanceToggle')) reglages.maintenanceActive=!!document.getElementById('adminMaintenanceToggle').checked;
    if(document.getElementById('adminMaintenanceMessage')) reglages.maintenanceMessage=(document.getElementById('adminMaintenanceMessage').value||'Lago est en maintenance. On revient vite.').trim();
    try{ saveAll(); }catch(_e){}
    window.applyMaintenanceV55();
    alert(reglages.maintenanceActive?'Maintenance activée côté clients. Patron et livreurs restent accessibles.':'Maintenance désactivée.');
  };

  // Stabilisation de la carte plein écran : on corrige les tailles après ouverture.
  const oldOpenMapEditorV60=window.openMapEditorV58;
  window.openMapEditorV58=async function(){
    await oldOpenMapEditorV60?.apply(this,arguments);
    setTimeout(()=>{
      try{
        const mapEl=document.getElementById('v58MapEditorMap');
        if(mapEl) mapEl.style.pointerEvents='auto';
        if(window.mapEditorV58?.invalidateSize) window.mapEditorV58.invalidateSize();
      }catch(_e){}
    },120);
  };

  function bootV60(){
    ensureV60Modal();
    rebuildMaintenanceOverlayV60();
    try{ window.applyMaintenanceV55(); }catch(_e){}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bootV60); else bootV60();
  setTimeout(bootV60,300); setTimeout(bootV60,900);
})();

/* ===== V61 — checkout UX fix : map persistante, promos Lago+, pages téléphone/adresse ===== */
(function(){
  const TOURS={lat:47.3941,lng:0.6848};
  const KNOWN={
    'grand cèdre':{lat:47.3656,lng:0.7390},'grand cedre':{lat:47.3656,lng:0.7390},
    'saint-avertin':{lat:47.3656,lng:0.7390},'jean jaurès':{lat:47.3524,lng:0.6636},'jean jaures':{lat:47.3524,lng:0.6636},
    'joué':{lat:47.3524,lng:0.6636},'joue':{lat:47.3524,lng:0.6636},'quai paul bert':{lat:47.3947,lng:0.7056},
    'saint-cyr':{lat:47.4096,lng:0.6745},'st cyr':{lat:47.4096,lng:0.6745},'tours':TOURS
  };
  let miniMap=null, editorMap=null, activeTarget='destination';
  function safe(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function money(n){return (Number(n)||0).toFixed(2)+' €';}
  function ensure(){
    if(!Array.isArray(reglages.savedAddresses)) reglages.savedAddresses=[];
    if(!reglages.checkoutAddress) reglages.checkoutAddress=null;
    if(typeof reglages.checkoutPhone!=='string') reglages.checkoutPhone='';
    if(!reglages.deliveryMeetPoint) reglages.deliveryMeetPoint='door';
    if(typeof reglages.deliveryInstructions!=='string') reglages.deliveryInstructions='';
    if(!reglages.checkoutDeliveryMode) reglages.checkoutDeliveryMode='standard';
    if(typeof reglages.checkoutScheduledTime!=='string') reglages.checkoutScheduledTime='';
    if(typeof reglages.checkoutScheduleDay!=='string') reglages.checkoutScheduleDay='Aujourd’hui';
    if(!Array.isArray(reglages.adminVisiblePremiumPromoIds)) reglages.adminVisiblePremiumPromoIds=['vip01','vip02','vip03'];
  }
  function addr(){ensure(); return reglages.checkoutAddress || reglages.savedAddresses[0] || null;}
  function coordsFor(a){
    if(a && Number.isFinite(a.lat) && Number.isFinite(a.lng)) return {lat:Number(a.lat),lng:Number(a.lng)};
    const txt=((a?.street||'')+' '+(a?.city||'')+' '+(a?.label||'')).toLowerCase();
    for(const k in KNOWN){ if(txt.includes(k)) return KNOWN[k]; }
    return TOURS;
  }
  function normalizeAddress(a){
    if(!a) return null;
    const c=coordsFor(a); a.lat=c.lat; a.lng=c.lng;
    if(!a.pins) a.pins={};
    if(!a.pins.destination) a.pins.destination={lat:c.lat,lng:c.lng};
    reglages.checkoutAddress=a;
    return a;
  }
  function pin(target){
    const a=normalizeAddress(addr());
    if(!a) return TOURS;
    if(!a.pins) a.pins={};
    if(!a.pins[target]) a.pins[target]={lat:a.lat,lng:a.lng};
    return {lat:Number(a.pins[target].lat),lng:Number(a.pins[target].lng)};
  }
  function setPin(target,c){
    const a=normalizeAddress(addr()); if(!a) return;
    if(!a.pins) a.pins={};
    a.pins[target]={lat:c.lat,lng:c.lng};
    if(target==='destination'){ a.lat=c.lat; a.lng=c.lng; }
    reglages.checkoutAddress=a; saveAll();
  }
  function subtotal(){return (cart||[]).reduce((a,c)=>a+(Number(c.price)||0)*(Number(c.qty)||1),0);}
  function promoByIdAny(id){
    try{ if(typeof window.v42PromoById==='function'){ const p=window.v42PromoById(id); if(p) return p; } }catch(_e){}
    try{ if(typeof getPromotionById==='function'){ const p=getPromotionById(id); if(p) return p; } }catch(_e){}
    try{ if(typeof LAGO_PROMO_LIBRARY!=='undefined') return LAGO_PROMO_LIBRARY.find(p=>p.id===id)||null; }catch(_e){}
    const prem={
      vip01:{id:'vip01',icon:'👑',title:'-25€ dès 45€ d’achat',desc:'Offre premium Lago+.',percent:55,premium:true},
      vip02:{id:'vip02',icon:'💎',title:'-30% sur Le Duo',desc:'Réduction premium sur Le Duo.',percent:30,premium:true},
      vip03:{id:'vip03',icon:'🚀',title:'Livraison boostée -20%',desc:'Offre livraison Lago+.',percent:20,premium:true}
    };
    return prem[id]||null;
  }
  function promos(){
    ensure();
    const normal=(reglages.adminVisiblePromoIds||['promo02','promo04','promo10']).slice(0,3).map(promoByIdAny).filter(Boolean).map(p=>({...p,premium:false}));
    const premium=reglages.isPremium ? (reglages.adminVisiblePremiumPromoIds||['vip01','vip02','vip03']).slice(0,3).map(promoByIdAny).filter(Boolean).map(p=>({...p,premium:true})) : [];
    return normal.concat(premium);
  }
  function promoVal(){try{if(promoActive)return Math.max(0,Number(computePromoDiscount())||0);}catch(_e){} try{return Math.max(0,Number(rewardPromoDiscount())||0);}catch(_e){} return 0;}
  function lagoSave(){return reglages.isPremium ? Math.round(subtotal()*0.15*100)/100 + ((Number(cartDistance)||9)<=3?4.99:0) : 0;}
  function deliveryFee(){return reglages.isPremium&&Number(cartDistance||9)<=3?0:4.99;}
  function prioFee(){return reglages.checkoutDeliveryMode==='priority'?2.99:0;}
  function total(){return Math.max(0,subtotal()+deliveryFee()+2.99+prioFee()+(Number(currentTip)||0)-promoVal()-lagoSave()-(Number(currentCagnotteDeduction)||0));}
  function meet(){return {door:'Rendez-vous devant ma porte',outside:'Rendez-vous à l’extérieur',parking:'Rendez-vous sur le parking le plus proche',leave:'Laisser sur place'}[reglages.deliveryMeetPoint]||'Rendez-vous devant ma porte';}
  function scheduleLabel(){return reglages.checkoutScheduledTime?`${reglages.checkoutScheduleDay||'Aujourd’hui'} • ${reglages.checkoutScheduledTime}`:'Choisir une heure';}
  function ensurePages(){
    const app=document.getElementById('clientApp'); if(!app)return;
    const main=app.querySelector('main')||app;
    ['checkoutV58','addressesV58','deliveryOptionsV58','scheduleV58','phoneV61','addressFormV61'].forEach(id=>{ if(!document.getElementById(id)){ const s=document.createElement('section'); s.id=id; s.className='v58-full-page'; main.appendChild(s); }});
    if(!document.getElementById('v61MapEditor')){
      const o=document.createElement('div'); o.id='v61MapEditor'; o.className='v61-map-editor';
      o.innerHTML=`<div id="v61MapCanvas" class="v61-map-canvas"></div><button class="v61-map-x" onclick="closeMapEditorV61()">×</button><button class="v61-map-recenter" onclick="recenterMapV61()">↻</button><div class="v61-map-center-pin"></div><div class="v61-map-sheet"><h2>Modifiez les repères</h2><div class="v61-map-targets"><button id="v61Target-destination" onclick="switchMapTargetV61('destination')"><span>⌖</span><b>Destination</b></button><button id="v61Target-entry" onclick="switchMapTargetV61('entry')"><span>↪</span><b>Entrée</b></button><button id="v61Target-parking" onclick="switchMapTargetV61('parking')"><span>P</span><b>Parking</b></button></div><p id="v61MapHelp">Déplacez la carte sous le repère puis validez.</p><button class="v61-map-ok" onclick="confirmMapEditorV61()">OK</button></div>`;
      document.body.appendChild(o);
    }
  }
  function setCheckoutMode(on){ const app=document.getElementById('clientApp'); if(app) app.classList.toggle('v61-checkout-mode',!!on); }
  function show(id){ensurePages(); document.getElementById('clientApp')?.querySelectorAll('section').forEach(s=>s.classList.remove('active')); document.getElementById(id)?.classList.add('active'); const nav=document.getElementById('clientNav'); if(nav)nav.style.display='none'; setCheckoutMode(['checkoutV58','addressesV58','deliveryOptionsV58','scheduleV58','phoneV61','addressFormV61'].includes(id));}
  function backCart(){document.getElementById('clientApp')?.querySelectorAll('section').forEach(s=>s.classList.remove('active')); document.getElementById('orders')?.classList.add('active'); const nav=document.getElementById('clientNav'); if(nav)nav.style.display='flex'; setCheckoutMode(false); try{updateCart();}catch(_e){}}
  window.closeCheckoutV58=backCart;
  function createMap(id,c,z,interactive=true){
    const m=L.map(id,{zoomControl:false,attributionControl:false,dragging:interactive,tap:interactive,scrollWheelZoom:false,doubleClickZoom:interactive,boxZoom:false,keyboard:false});
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:19}).addTo(m);
    m.setView([c.lat,c.lng],z||16); return m;
  }
  function refreshMini(){
    const el=document.getElementById('checkoutMapLeafletV58'); if(!el||typeof L==='undefined')return;
    const c=pin('destination');
    if(miniMap){try{miniMap.remove();}catch(_e){} miniMap=null;}
    miniMap=createMap('checkoutMapLeafletV58',c,16,false); setTimeout(()=>miniMap.invalidateSize(),60);
  }
  function mapHtml(){const a=addr(); return `<div class="v58-map-shell"><div class="v58-map ${reglages.checkoutMapCollapsed?'collapsed':''}" onclick="openMapEditorV61()"><div id="checkoutMapLeafletV58" class="v58-map-leaflet"></div><div class="v58-pin"></div><button type="button" class="v58-map-edit" onclick="event.stopPropagation();openMapEditorV61()">Modifier le repère</button><button type="button" class="v58-map-collapse" onclick="event.stopPropagation();toggleMapCollapseV61()">${reglages.checkoutMapCollapsed?'↓':'↑'}</button><div class="v58-map-label">${a?safe(a.street):'Adresse non renseignée'}</div></div></div>`;}
  window.toggleMapCollapseV61=function(){reglages.checkoutMapCollapsed=!reglages.checkoutMapCollapsed; saveAll(); renderCheckoutV58();};
  window.renderCheckoutV58=function(){
    ensure(); ensurePages(); const box=document.getElementById('checkoutV58'); if(!box)return;
    const a=normalizeAddress(addr()); const sub=subtotal(), pv=promoVal(), ls=lagoSave(), del=deliveryFee(), pf=prioFee(), service=2.99, tt=total(), tva=Math.max(0,tt-(tt/1.2));
    const items=(cart||[]).map(c=>`${safe(c.name)}${(Number(c.qty)||1)>1?' x'+(Number(c.qty)||1):''}${(c.options||[]).length?' + '+c.options.map(o=>safe(o.name)).join(', '):''}`).join(' • ');
    const ps=promos(), active=reglages.activeRewardPromo;
    box.innerHTML=`<div class="v58-top"><button type="button" onclick="closeCheckoutV58()">←</button><h2>Paiement</h2><span></span></div><div class="v58-scroll">${mapHtml()}<div class="v58-info-list"><button type="button" class="v58-row" onclick="openAddressesV58()"><span class="v58-ico">⌖</span><div><b>${a?safe(a.street):'Ajouter une adresse de livraison'}</b><small>${a?safe(a.city):'Aucune adresse enregistrée'}</small></div><em>›</em></button><button type="button" class="v58-row" onclick="openDeliveryOptionsV58()"><span class="v58-ico">☻</span><div><b>${meet()}</b><small>${reglages.deliveryInstructions?safe(reglages.deliveryInstructions):'Instructions pour le coursier'}</small></div><em>›</em></button><button type="button" class="v58-row" onclick="openPhoneV61()"><span class="v58-ico">☎</span><div><b>${reglages.checkoutPhone?safe(reglages.checkoutPhone):'Ajouter un numéro'}</b><small>Contact livraison</small></div><em>›</em></button></div><h3 class="v58-block-title">Délai de livraison</h3><div class="v58-delivery-grid"><button type="button" class="${reglages.checkoutDeliveryMode==='priority'?'active':''}" onclick="setCheckoutDeliveryV58('priority')"><b>⚡ Prioritaire</b><small>+2,99 € • plus rapide</small></button><button type="button" class="${reglages.checkoutDeliveryMode==='standard'?'active':''}" onclick="setCheckoutDeliveryV58('standard')"><b>Standard</b><small>5-10 min recherche</small></button><button type="button" class="${reglages.checkoutDeliveryMode==='scheduled'?'active':''}" onclick="setCheckoutDeliveryV58('scheduled')"><b>Planifier</b><small>${safe(scheduleLabel())}</small></button></div><button type="button" class="v58-order-summary v58-clickable" onclick="openCartSummaryV60?.()"><h3>Récapitulatif de la commande</h3><div class="v58-order-line"><div class="v58-shop-dot">L</div><div><b>Lago</b><small>${items||'Panier Lago'}</small></div><em>›</em></div></button><div class="v58-promos"><button type="button" class="v58-promo-head" onclick="togglePromosV58()"><span>🏷️</span><div><b>${pv>0?'1 promotion appliquée':'Promotions'}</b><small>${ps.length} promotions disponibles${pv>0?' • -'+money(pv):''}</small></div><em>›</em></button><div id="v58PromoList" class="v58-promo-list">${ps.map(p=>`<button type="button" class="${active===p.id?'active':''}" onclick="applyCheckoutPromoV58('${p.id}')"><span>${p.icon||'🎁'}</span><div><b>${safe(p.title)}${p.premium?' • Lago+':''}</b><small>${safe(p.desc||'Offre Lago')}</small></div></button>`).join('')||'<small>Aucune promotion visible.</small>'}</div></div><div class="v58-price"><div><span>Sous-total</span><b>${money(sub)}</b></div>${pv>0?`<div class="discount"><span>Promotion</span><b>-${money(pv)}</b></div>`:''}${ls>0?`<div class="discount gold"><span>Avantage Lago+</span><b>-${money(ls)}</b></div>`:''}<div><span>Frais de service</span><b>${money(service)}</b></div><div><span>Frais de livraison</span><b>${money(del)}</b></div>${pf>0?`<div><span>Livraison prioritaire</span><b>${money(pf)}</b></div>`:''}<div><span>TVA incluse</span><b>${money(tva)}</b></div><div class="total"><span>Total</span><b>${money(tt)}</b></div></div><div class="v58-saving ${reglages.isPremium?'gold':''}"><b>${reglages.isPremium?'Avec Lago+, vous économisez':'Avec les promotions, vous économisez'}</b><strong>${money(reglages.isPremium?ls:pv)}</strong></div><div class="v58-legal"><b>Contrat sur les services Lago</b><br>En cliquant sur le bouton pour passer votre commande, vous acceptez le contrat sur les services de livraison avec Lago SAS (RCS 912 456 781). Assistance Lago : 01 84 25 68 42.</div></div><div class="v58-bottom"><button type="button" onclick="submitCheckoutV58()">Commander et payer</button></div>`;
    setTimeout(refreshMini,80);
  };
  window.openCheckoutV58=function(){ if(deliveryInProgress)return alert('Une livraison est déjà en cours.'); if(!Array.isArray(cart)||!cart.length)return alert('Ton panier est vide !'); ensure(); renderCheckoutV58(); show('checkoutV58'); };
  window.setCheckoutDeliveryV58=function(mode){ if(mode==='scheduled') return openScheduleV58(); reglages.checkoutDeliveryMode=mode; saveAll(); renderCheckoutV58(); };
  window.togglePromosV58=function(){document.getElementById('v58PromoList')?.classList.toggle('show');};
  window.applyCheckoutPromoV58=function(id){ if(reglages.activeRewardPromo===id){reglages.activeRewardPromo=null; reglages.claimedPromotionIds=[];} else {try{claimFixedPromotion(id);}catch(_e){reglages.activeRewardPromo=id; reglages.claimedPromotionIds=[id]; promoActive=false;}} saveAll(); try{updateCart();}catch(_e){} renderCheckoutV58();};
  window.openPhoneV61=function(){ensure(); ensurePages(); const box=document.getElementById('phoneV61'); box.innerHTML=`<div class="v61-light-page"><button class="v61-light-x" onclick="renderCheckoutV58();showCheckoutV61()">×</button><h4>Compte Lago</h4><h1>Numéro de téléphone</h1><p>Utilisez ce numéro pour recevoir des notifications et suivre votre livraison.</p><label>Numéro de téléphone</label><div class="v61-phone-input"><button>🇫🇷⌄</button><input id="v61PhoneInput" inputmode="tel" placeholder="+33 6 19 72 04 74" value="${safe(reglages.checkoutPhone)}"></div><small>Un code de vérification sera envoyé à ce numéro.</small><button class="v61-black-btn" onclick="savePhoneV61()">Mettre à jour</button></div>`; show('phoneV61');};
  window.showCheckoutV61=function(){show('checkoutV58');};
  window.savePhoneV61=function(){reglages.checkoutPhone=(document.getElementById('v61PhoneInput')?.value||'').trim(); saveAll(); renderCheckoutV58(); show('checkoutV58');};
  window.openAddressesV58=function(){ensure(); ensurePages(); const box=document.getElementById('addressesV58'); const list=(reglages.savedAddresses||[]).map((a,i)=>`<button type="button" class="v61-address-row" onclick="selectAddressV58(${i})"><span>⌖</span><div><b>${safe(a.label||a.street)}</b><small>${safe(a.street)}<br>${safe(a.city)}</small></div><em onclick="event.stopPropagation();openAddressFormV61(${i})">✎</em></button>`).join('')||'<div class="v58-empty">Aucune adresse. Ajoute ta première adresse.</div>'; box.innerHTML=`<div class="v58-top"><button onclick="renderCheckoutV58();showCheckoutV61()">←</button><h2>Mes adresses</h2><span></span></div><div class="v58-scroll"><button class="v61-add-address" onclick="openAddressFormV61()">＋ Ajouter une nouvelle adresse</button><h3 class="v58-block-title">Mon adresse</h3><div class="v61-address-card">${list}</div></div>`; show('addressesV58');};
  window.openAddressFormV61=function(i){ensure(); ensurePages(); const a=Number.isInteger(i)?reglages.savedAddresses[i]:{}; const box=document.getElementById('addressFormV61'); box.dataset.editIndex=Number.isInteger(i)?String(i):''; box.innerHTML=`<div class="v58-top"><button onclick="openAddressesV58()">←</button><h2>${Number.isInteger(i)?'Modifier':'Nouvelle adresse'}</h2><span></span></div><div class="v58-scroll"><div class="v61-form-card"><label>Nom de l’adresse</label><input id="v61AddrLabel" placeholder="Domicile" value="${safe(a.label||'')}"><label>Adresse</label><input id="v61AddrStreet" placeholder="14 Rue du Grand Cèdre" value="${safe(a.street||'')}"><label>Ville / code postal</label><input id="v61AddrCity" placeholder="37550 Saint-Avertin" value="${safe(a.city||'')}"><label>Complément</label><input id="v61AddrExtra" placeholder="Bâtiment, étage, digicode..." value="${safe(a.extra||'')}"><button class="v61-black-btn" onclick="saveAddressFormV61()">Enregistrer l’adresse</button></div></div>`; show('addressFormV61');};
  window.saveAddressFormV61=function(){const box=document.getElementById('addressFormV61'); const i=box.dataset.editIndex===''?null:parseInt(box.dataset.editIndex,10); const a={label:(document.getElementById('v61AddrLabel').value||'Adresse').trim(),street:(document.getElementById('v61AddrStreet').value||'').trim(),city:(document.getElementById('v61AddrCity').value||'').trim(),extra:(document.getElementById('v61AddrExtra').value||'').trim()}; if(!a.street)return alert('Ajoute une adresse.'); normalizeAddress(a); if(i===null||Number.isNaN(i)) reglages.savedAddresses.unshift(a); else reglages.savedAddresses[i]=a; reglages.checkoutAddress=a; saveAll(); openAddressesV58();};
  window.addAddressV58=function(){openAddressFormV61();};
  window.editAddressV58=function(i){openAddressFormV61(i);};
  window.selectAddressV58=function(i){const a=reglages.savedAddresses[i]; if(!a)return; normalizeAddress(a); reglages.checkoutAddress=a; saveAll(); renderCheckoutV58(); show('checkoutV58');};
  window.openDeliveryOptionsV58=function(){ensure(); const a=addr(); const box=document.getElementById('deliveryOptionsV58'); box.innerHTML=`<div class="v58-top"><button onclick="renderCheckoutV58();showCheckoutV61()">←</button><h2>Options de livraison</h2><span></span></div><div class="v58-scroll"><p class="v58-delivery-to">Livraison à ${safe(a?a.street:'votre adresse')} • <u>Ajouter un appartement/une suite</u></p><div class="v58-meet-card"><h3>Donnez-le moi</h3>${['door','outside','parking'].map(k=>`<button type="button" class="${reglages.deliveryMeetPoint===k?'active':''}" onclick="setMeetV58('${k}')"><span>${{door:'Rendez-vous devant ma porte',outside:'Rendez-vous à l’extérieur',parking:'Rendez-vous sur le parking le plus proche'}[k]}</span><b></b></button>`).join('')}</div><div class="v58-meet-card"><h3>Laisser sur place</h3><button type="button" class="${reglages.deliveryMeetPoint==='leave'?'active':''}" onclick="setMeetV58('leave')"><span>Laisser sur place</span><b></b></button></div><h3 class="v58-block-title">Instructions pour le coursier</h3><textarea id="v58InstructionsInput" class="v58-instructions" placeholder="Ex. Code porte, étage, immeuble, appelez-moi...">${safe(reglages.deliveryInstructions)}</textarea><button class="v58-add-photo">📷 Ajoutez des photos</button></div><div class="v58-bottom"><button onclick="saveDeliveryOptionsV58()">Mettre à jour</button><button type="button" class="v60-secondary-bottom" onclick="renderCheckoutV58();showCheckoutV61()">Retour</button></div>`; show('deliveryOptionsV58');};
  window.setMeetV58=function(k){reglages.deliveryMeetPoint=k; saveAll(); openDeliveryOptionsV58();};
  window.saveDeliveryOptionsV58=function(){reglages.deliveryInstructions=(document.getElementById('v58InstructionsInput')?.value||'').trim(); saveAll(); renderCheckoutV58(); show('checkoutV58');};
  window.openScheduleV58=function(){ensure(); const box=document.getElementById('scheduleV58'); const slots=['12:00–12:30','12:15–12:45','12:30–13:00','12:45–13:15','13:00–13:30','13:15–13:45']; const days=['Aujourd’hui','Demain','Après-demain']; box.innerHTML=`<div class="v58-top"><button onclick="renderCheckoutV58();showCheckoutV61()">×</button><h2>Planifier</h2><span></span></div><div class="v58-scroll"><div class="v58-schedule-head"><h1>Planifier une livraison</h1><p>Lago ouvre à 11:00.</p></div><div class="v58-schedule-days">${days.map((d,i)=>`<button class="${reglages.checkoutScheduleDay===d?'active':''}" onclick="selectScheduleDayV61('${d}')"><b>${d}</b><small>${i===0?'Aujourd’hui':i===1?'Demain':'Après-demain'}</small></button>`).join('')}</div><div class="v58-schedule-slots">${slots.map(s=>`<button class="${reglages.checkoutScheduledTime===s?'active':''}" onclick="selectScheduleSlotV61('${s}')"><span>${s}</span><b></b></button>`).join('')}</div><div class="v58-schedule-actions"><button class="primary" onclick="confirmScheduleV61()">Planifier</button><button class="secondary" onclick="renderCheckoutV58();showCheckoutV61()">Annuler</button></div></div>`; show('scheduleV58');};
  window.selectScheduleDayV61=function(d){reglages.checkoutScheduleDay=d; openScheduleV58();};
  window.selectScheduleSlotV61=function(s){reglages.checkoutScheduledTime=s; openScheduleV58();};
  window.confirmScheduleV61=function(){reglages.checkoutDeliveryMode='scheduled'; if(!reglages.checkoutScheduledTime)reglages.checkoutScheduledTime='12:00–12:30'; saveAll(); renderCheckoutV58(); show('checkoutV58');};
  window.openMapEditorV61=function(){ensure(); normalizeAddress(addr()); const o=document.getElementById('v61MapEditor'); o.classList.add('show'); activeTarget=reglages.v58MapEditorTarget||'destination'; const c=pin(activeTarget); setTimeout(()=>{ if(editorMap){try{editorMap.remove();}catch(_e){} editorMap=null;} editorMap=createMap('v61MapCanvas',c,18,true); editorMap.on('moveend',()=>{const cc=editorMap.getCenter(); setPin(activeTarget,{lat:cc.lat,lng:cc.lng});}); switchMapTargetV61(activeTarget);},50);};
  window.closeMapEditorV61=function(){document.getElementById('v61MapEditor')?.classList.remove('show');};
  window.switchMapTargetV61=function(t){activeTarget=t; reglages.v58MapEditorTarget=t; saveAll(); ['destination','entry','parking'].forEach(k=>document.getElementById('v61Target-'+k)?.classList.toggle('active',k===t)); const c=pin(t); if(editorMap)editorMap.setView([c.lat,c.lng],18,{animate:false}); const help={destination:'Déplacez le repère à l’endroit où le coursier doit déposer votre commande.',entry:'Placez l’entrée exacte de l’immeuble ou du portail.',parking:'Placez le parking ou la zone de stationnement la plus proche.'}[t]; const h=document.getElementById('v61MapHelp'); if(h)h.textContent=help;};
  window.recenterMapV61=function(){const c=coordsFor(addr()); if(editorMap)editorMap.setView([c.lat,c.lng],18,{animate:true});};
  window.confirmMapEditorV61=function(){ if(editorMap){ const c=editorMap.getCenter(); setPin(activeTarget,{lat:c.lat,lng:c.lng}); } closeMapEditorV61(); renderCheckoutV58(); };
  window.submitCheckoutV58=function(){if(!addr())return alert('Ajoute une adresse de livraison.'); if(!reglages.checkoutPhone)return alert('Ajoute ton numéro de téléphone.'); if(reglages.checkoutDeliveryMode==='scheduled'&&!reglages.checkoutScheduledTime)return alert('Choisis une heure pour la livraison planifiée.'); const amount=total(); openPaymentModal(amount,()=>{ const snapshot=(cart||[]).map(c=>({name:c.name,qty:Number(c.qty)||1,price:Number(c.price)||0,options:(c.options||[]).map(o=>({...o}))})); const resumeItems=snapshot.map(c=>`${c.name}${c.qty>1?' (x'+c.qty+')':''}`).join(', '); reglages.historiqueCommandes.push({id:Date.now(),date:new Date().toLocaleString('fr-FR'),prix:amount,items:resumeItems,status:reglages.checkoutDeliveryMode==='scheduled'?'Programmée':'Terminée',address:addr()?.street,deliveryMode:reglages.checkoutDeliveryMode,meetPoint:meet()}); reglages.totalOrders=(Number(reglages.totalOrders)||0)+1; if(reglages.checkoutDeliveryMode==='scheduled'){ cart=[]; promoActive=false; currentTip=0; currentCagnotteDeduction=0; saveAll(); updateCart(); alert(`✅ Livraison planifiée pour ${scheduleLabel()}.`); closeCheckoutV58(); return;} startDeliveryFlow(resumeItems,amount); cart=[]; promoActive=false; currentTip=0; currentCagnotteDeduction=0; updateCart(); saveAll(); });};
  const oldUpdate=window.updateCart||updateCart;
  window.updateCart=function(){const r=oldUpdate.apply(this,arguments); const old=document.getElementById('payBtn'); if(old){old.style.display='none';} let b=document.getElementById('v58CheckoutBtn'); if(!b&&old){b=document.createElement('button'); b.id='v58CheckoutBtn'; b.className='v58-checkout-open'; b.type='button'; b.textContent='Passer au paiement'; old.parentNode.insertBefore(b,old);} if(b)b.onclick=(e)=>{e.preventDefault();openCheckoutV58();}; return r;};
  function boot(){ensurePages(); ensure(); try{updateCart();}catch(_e){} }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot); else boot(); setTimeout(boot,300); setTimeout(boot,900);
})();

/* ===== V62 — priorité x4, téléphone/adresse DA Lago, ville séparée, reset carte Lago+ ===== */
(function(){
  function v62Safe(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function v62Money(n){return (Number(n)||0).toFixed(2)+' €';}
  function v62Ensure(){
    if(!Array.isArray(reglages.savedAddresses)) reglages.savedAddresses=[];
    if(!reglages.checkoutAddress) reglages.checkoutAddress=null;
    if(typeof reglages.checkoutPhone!=='string') reglages.checkoutPhone='';
    if(!reglages.checkoutDeliveryMode) reglages.checkoutDeliveryMode='standard';
    if(!reglages.deliveryMeetPoint) reglages.deliveryMeetPoint='door';
  }
  function v62Addr(){v62Ensure(); return reglages.checkoutAddress || reglages.savedAddresses[0] || null;}
  function v62SplitCity(a){
    const raw=String(a?.city||'').trim();
    if(a && !a.postalCode && raw){
      const m=raw.match(/^(\d{4,5})\s+(.+)$/);
      if(m){ a.postalCode=m[1]; a.city=m[2]; }
    }
    return a;
  }
  function v62CityLine(a){
    if(!a) return '';
    v62SplitCity(a);
    return `${a.postalCode||''} ${a.city||''}`.trim() || a.city || '';
  }
  function v62KnownCoords(a){
    const txt=((a?.street||'')+' '+(a?.postalCode||'')+' '+(a?.city||'')+' '+(a?.label||'')).toLowerCase();
    if(txt.includes('grand cèdre')||txt.includes('grand cedre')||txt.includes('saint-avertin')) return {lat:47.3656,lng:0.7390};
    if(txt.includes('jean jaurès')||txt.includes('jean jaures')||txt.includes('joué')||txt.includes('joue')) return {lat:47.3524,lng:0.6636};
    if(txt.includes('quai paul bert')) return {lat:47.3947,lng:0.7056};
    if(txt.includes('saint-cyr')||txt.includes('st cyr')) return {lat:47.4096,lng:0.6745};
    if(txt.includes('tours')) return {lat:47.3941,lng:0.6848};
    return {lat:47.3941,lng:0.6848};
  }
  async function v62Geocode(a){
    if(!a) return {lat:47.3941,lng:0.6848};
    v62SplitCity(a);
    try{
      const q=encodeURIComponent(`${a.street||''}, ${a.postalCode||''} ${a.city||''}, France`);
      const r=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${q}`);
      const j=await r.json();
      if(Array.isArray(j) && j[0]) return {lat:Number(j[0].lat),lng:Number(j[0].lon)};
    }catch(_e){}
    return v62KnownCoords(a);
  }
  async function v62ApplyCoords(a, forceResetPins=true){
    const c=await v62Geocode(a);
    a.lat=c.lat; a.lng=c.lng;
    if(!a.pins || forceResetPins) a.pins={};
    a.pins.destination={lat:c.lat,lng:c.lng};
    if(!a.pins.entry) a.pins.entry={lat:c.lat,lng:c.lng};
    if(!a.pins.parking) a.pins.parking={lat:c.lat,lng:c.lng};
    reglages.checkoutAddress=a;
    return a;
  }
  function v62Show(id){
    document.getElementById('clientApp')?.querySelectorAll('section').forEach(s=>s.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
    const nav=document.getElementById('clientNav'); if(nav) nav.style.display='none';
    document.getElementById('clientApp')?.classList.add('v61-checkout-mode');
  }
  function v62EnsurePages(){
    const app=document.getElementById('clientApp'); if(!app) return;
    const main=app.querySelector('main')||app;
    ['phoneV61','addressFormV61','addressesV58'].forEach(id=>{ if(!document.getElementById(id)){ const s=document.createElement('section'); s.id=id; s.className='v58-full-page'; main.appendChild(s); }});
  }

  window.openPhoneV61=function(){
    v62Ensure(); v62EnsurePages();
    const box=document.getElementById('phoneV61'); if(!box) return;
    box.innerHTML=`<div class="v62-checkout-page v62-phone-page">
      <div class="v62-top"><button type="button" onclick="renderCheckoutV58();showCheckoutV61?.()">←</button><h2>Numéro</h2><span></span></div>
      <div class="v62-hero-card"><div class="v62-kicker">Compte Lago</div><h1>Numéro de téléphone</h1><p>Utilise ce numéro pour recevoir les notifications et suivre ta livraison.</p></div>
      <div class="v62-form-card"><label>Numéro de téléphone</label><div class="v62-phone-field"><button type="button">🇫🇷 <span>+33</span></button><input id="v61PhoneInput" inputmode="tel" placeholder="6 19 72 04 74" value="${v62Safe(reglages.checkoutPhone.replace(/^\+33\s*/,''))}"></div><small>Un code de vérification sera simulé pour ce numéro.</small></div>
      <div class="v62-bottom"><button type="button" onclick="savePhoneV61()">Mettre à jour</button></div>
    </div>`;
    v62Show('phoneV61');
  };
  window.savePhoneV61=function(){
    let val=(document.getElementById('v61PhoneInput')?.value||'').trim();
    if(val && !val.startsWith('+')) val='+33 '+val.replace(/^0/,'');
    reglages.checkoutPhone=val;
    saveAll();
    try{renderCheckoutV58();}catch(_e){}
    v62Show('checkoutV58');
  };

  window.openAddressFormV61=function(i){
    v62Ensure(); v62EnsurePages();
    const isEdit=Number.isInteger(i);
    const a=isEdit?{...reglages.savedAddresses[i]}:{};
    v62SplitCity(a);
    const box=document.getElementById('addressFormV61'); if(!box) return;
    box.dataset.editIndex=isEdit?String(i):'';
    box.innerHTML=`<div class="v62-checkout-page v62-address-page">
      <div class="v62-top"><button type="button" onclick="openAddressesV58()">←</button><h2>${isEdit?'Modifier':'Nouvelle adresse'}</h2><span></span></div>
      <div class="v62-hero-card"><div class="v62-kicker">Livraison Lago</div><h1>${isEdit?'Modifier l’adresse':'Ajouter une adresse'}</h1><p>Renseigne l’adresse complète pour placer le repère au bon endroit.</p></div>
      <div class="v62-form-card">
        <label>Nom de l’adresse</label><input id="v61AddrLabel" placeholder="Domicile" value="${v62Safe(a.label||'')}">
        <label>Adresse</label><input id="v61AddrStreet" placeholder="14 Rue du Grand Cèdre" value="${v62Safe(a.street||'')}">
        <div class="v62-two-cols"><div><label>Code postal</label><input id="v61AddrPostal" inputmode="numeric" placeholder="37550" value="${v62Safe(a.postalCode||'')}"></div><div><label>Ville</label><input id="v61AddrCity" placeholder="Saint-Avertin" value="${v62Safe(a.city||'')}"></div></div>
        <label>Complément</label><input id="v61AddrExtra" placeholder="Bâtiment, étage, digicode..." value="${v62Safe(a.extra||'')}">
        <div class="v62-address-note">Le repère Destination sera placé automatiquement sur cette adresse.</div>
      </div>
      <div class="v62-bottom"><button type="button" onclick="saveAddressFormV61()">Enregistrer l’adresse</button></div>
    </div>`;
    v62Show('addressFormV61');
  };
  window.saveAddressFormV61=async function(){
    const box=document.getElementById('addressFormV61');
    const i=box?.dataset.editIndex===''?null:parseInt(box?.dataset.editIndex||'',10);
    const a={
      label:(document.getElementById('v61AddrLabel')?.value||'Adresse').trim(),
      street:(document.getElementById('v61AddrStreet')?.value||'').trim(),
      postalCode:(document.getElementById('v61AddrPostal')?.value||'').trim(),
      city:(document.getElementById('v61AddrCity')?.value||'').trim(),
      extra:(document.getElementById('v61AddrExtra')?.value||'').trim()
    };
    if(!a.street) return alert('Ajoute une adresse.');
    if(!a.city) return alert('Ajoute la ville.');
    a.cityLine=v62CityLine(a);
    await v62ApplyCoords(a,true);
    if(i===null || Number.isNaN(i)) reglages.savedAddresses.unshift(a); else reglages.savedAddresses[i]=a;
    reglages.checkoutAddress=a;
    saveAll();
    try{openAddressesV58();}catch(_e){try{renderCheckoutV58(); v62Show('checkoutV58');}catch(_e2){}}
  };

  const oldOpenAddressesV62=window.openAddressesV58;
  window.openAddressesV58=function(){
    v62Ensure(); v62EnsurePages();
    const box=document.getElementById('addressesV58');
    if(!box) return oldOpenAddressesV62?.();
    const list=(reglages.savedAddresses||[]).map((a,i)=>{v62SplitCity(a);return `<button type="button" class="v61-address-row" onclick="selectAddressV58(${i})"><span>⌖</span><div><b>${v62Safe(a.label||a.street)}</b><small>${v62Safe(a.street)}<br>${v62Safe(v62CityLine(a))}</small></div><em onclick="event.stopPropagation();openAddressFormV61(${i})">✎</em></button>`;}).join('')||'<div class="v58-empty">Aucune adresse. Ajoute ta première adresse.</div>';
    box.innerHTML=`<div class="v58-top"><button onclick="renderCheckoutV58();showCheckoutV61?.()">←</button><h2>Mes adresses</h2><span></span></div><div class="v58-scroll"><button class="v61-add-address" onclick="openAddressFormV61()">＋ Ajouter une nouvelle adresse</button><h3 class="v58-block-title">Mon adresse</h3><div class="v61-address-card">${list}</div></div>`;
    v62Show('addressesV58');
  };
  window.selectAddressV58=async function(i){
    const a=reglages.savedAddresses[i]; if(!a) return;
    await v62ApplyCoords(a,false);
    reglages.checkoutAddress=a;
    saveAll();
    try{renderCheckoutV58();}catch(_e){}
    v62Show('checkoutV58');
  };

  function v62Subtotal(){return (cart||[]).reduce((a,c)=>a+(Number(c.price)||0)*(Number(c.qty)||1),0);}
  function v62Promo(){try{if(promoActive)return Math.max(0,Number(computePromoDiscount())||0);}catch(_e){} try{return Math.max(0,Number(rewardPromoDiscount())||0);}catch(_e){} return 0;}
  function v62LagoSave(){return reglages.isPremium ? Math.round(v62Subtotal()*0.15*100)/100 + ((Number(cartDistance)||9)<=3?4.99:0) : 0;}
  function v62DeliveryFee(){return reglages.isPremium&&Number(cartDistance||9)<=3?0:4.99;}
  function v62PriorityFee(){return reglages.checkoutDeliveryMode==='priority'?2.99:0;}
  function v62Total(){return Math.max(0,v62Subtotal()+v62DeliveryFee()+2.99+v62PriorityFee()+(Number(currentTip)||0)-v62Promo()-v62LagoSave()-(Number(currentCagnotteDeduction)||0));}
  function v62Meet(){return {door:'Rendez-vous devant ma porte',outside:'Rendez-vous à l’extérieur',parking:'Rendez-vous sur le parking le plus proche',leave:'Laisser sur place'}[reglages.deliveryMeetPoint]||'Rendez-vous devant ma porte';}
  window.submitCheckoutV58=function(){
    v62Ensure();
    if(!v62Addr())return alert('Ajoute une adresse de livraison.');
    if(!reglages.checkoutPhone)return alert('Ajoute ton numéro de téléphone.');
    if(reglages.checkoutDeliveryMode==='scheduled'&&!reglages.checkoutScheduledTime)return alert('Choisis une heure pour la livraison planifiée.');
    const amount=v62Total();
    openPaymentModal(amount,()=>{
      const snapshot=(cart||[]).map(c=>({name:c.name,qty:Number(c.qty)||1,price:Number(c.price)||0,options:(c.options||[]).map(o=>({...o}))}));
      const resumeItems=snapshot.map(c=>`${c.name}${c.qty>1?' (x'+c.qty+')':''}`).join(', ');
      reglages.historiqueCommandes.push({id:Date.now(),date:new Date().toLocaleString('fr-FR'),prix:amount,items:resumeItems,status:reglages.checkoutDeliveryMode==='scheduled'?'Programmée':'Terminée',address:v62Addr()?.street,deliveryMode:reglages.checkoutDeliveryMode,meetPoint:v62Meet()});
      reglages.totalOrders=(Number(reglages.totalOrders)||0)+1;
      if(reglages.checkoutDeliveryMode==='scheduled'){
        cart=[]; promoActive=false; currentTip=0; currentCagnotteDeduction=0; saveAll(); updateCart(); alert(`✅ Livraison planifiée pour ${reglages.checkoutScheduleDay||'Aujourd’hui'} • ${reglages.checkoutScheduledTime}.`); closeCheckoutV58(); return;
      }
      const oldMult=Number(reglages.deliverySpeedMultiplier)||1;
      if(reglages.checkoutDeliveryMode==='priority') reglages.deliverySpeedMultiplier=0.25;
      startDeliveryFlow(resumeItems,amount);
      reglages.deliverySpeedMultiplier=oldMult;
      cart=[]; promoActive=false; currentTip=0; currentCagnotteDeduction=0; updateCart(); saveAll();
    });
  };

  function v62ResetCardDesignIfNoPremium(){
    try{
      if(reglages.isPremium) return;
      currentCardDesign='classic';
      reglages.selectedCardDesign='classic';
      if(Array.isArray(reglages.savedCards)) reglages.savedCards.forEach(c=>c.design='classic');
      if(window.currentUser && window.currentUser.role!=='admin'){
        window.currentUser.selectedCardDesign='classic';
        if(Array.isArray(window.currentUser.savedCards)) window.currentUser.savedCards.forEach(c=>c.design='classic');
      }
      const u=window.currentUser&&fakeUsers.find(x=>x.email===window.currentUser.email);
      if(u){u.selectedCardDesign='classic'; if(Array.isArray(u.savedCards)) u.savedCards.forEach(c=>c.design='classic');}
      try{ updatePaymentCardPreview(); }catch(_e){}
    }catch(_e){}
  }
  const oldSaveV62=window.saveAll || saveAll;
  window.saveAll=function(){ v62ResetCardDesignIfNoPremium(); return oldSaveV62.apply(this,arguments); };
  const oldAppliquerPremiumV62=window.appliquerThemeEtPremium;
  if(typeof oldAppliquerPremiumV62==='function') window.appliquerThemeEtPremium=function(){ const r=oldAppliquerPremiumV62.apply(this,arguments); v62ResetCardDesignIfNoPremium(); return r; };
  setTimeout(v62ResetCardDesignIfNoPremium,500);
})();

/* ===== V63 — adresse type bâtiment, panier clean, pourboire après notation, cagnotte/rating ===== */
(function(){
  function s63(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function show63(id){document.getElementById('clientApp')?.querySelectorAll('section').forEach(x=>x.classList.remove('active'));document.getElementById(id)?.classList.add('active');const nav=document.getElementById('clientNav');if(nav)nav.style.display='none';}
  function ensurePage63(id){const app=document.getElementById('clientApp');if(!app)return null;let el=document.getElementById(id);if(!el){el=document.createElement('section');el.id=id;el.className='v58-full-page';(app.querySelector('main')||app).appendChild(el);}return el;}
  function addr63(){return reglages.checkoutAddress || (Array.isArray(reglages.savedAddresses)?reglages.savedAddresses[0]:null) || null;}
  function splitCity63(a){if(!a)return; if(!a.postalCode && a.city){const m=String(a.city).match(/^(\d{4,5})\s+(.+)$/); if(m){a.postalCode=m[1];a.cityName=m[2];}} if(!a.cityName)a.cityName=String(a.city||'Tours').replace(/^\d{4,5}\s+/, '')||'Tours'; if(!a.postalCode)a.postalCode='37000'; a.city=(a.postalCode+' '+a.cityName).trim();}
  function known63(a){
    const key=(String(a?.street||'')+' '+String(a?.postalCode||'')+' '+String(a?.cityName||a?.city||'')).toLowerCase();
    if(key.includes('grand cèdre')||key.includes('grand cedre')) return {lat:47.3656,lng:0.7390};
    if(key.includes('quai paul bert')) return {lat:47.3947,lng:0.7056};
    if(key.includes('jean jaurès')||key.includes('jean jaures')) return {lat:47.3524,lng:0.6636};
    if(key.includes('tours')) return {lat:47.3941,lng:0.6848};
    if(key.includes('saint-avertin')) return {lat:47.3656,lng:0.7390};
    return {lat:47.3941,lng:0.6848};
  }
  function normalizeAddr63(a){if(!a)return; splitCity63(a); const c=known63(a); if(!Number.isFinite(a.lat)||!Number.isFinite(a.lng)){a.lat=c.lat;a.lng=c.lng;} if(!a.pins)a.pins={}; if(!a.pins.destination)a.pins.destination={lat:a.lat,lng:a.lng};}
  function typeLabel63(t){return {home:'Maison',apartment:'Appartement',office:'Bureau',other:'Autre'}[t||'home']||'Maison';}
  function typeIcon63(t){return {home:'🏠',apartment:'🏢',office:'💼',other:'📍'}[t||'home']||'🏠';}

  window.openAddressTypePanelV63=function(){
    let overlay=document.getElementById('addressTypePanelV63');
    if(!overlay){overlay=document.createElement('div');overlay.id='addressTypePanelV63';overlay.className='v63-bottom-panel';document.body.appendChild(overlay);} 
    const current=document.getElementById('v63BuildingType')?.value||'home';
    overlay.innerHTML=`<div class="v63-panel-backdrop" onclick="closeAddressTypePanelV63()"></div><div class="v63-panel-sheet"><h2>Choisissez le type de bâtiment</h2><p>Aidez les coursiers à vous trouver.</p>${['home','apartment','office','other'].map(k=>`<button class="${current===k?'active':''}" onclick="selectAddressTypeV63('${k}')"><span>${typeIcon63(k)}</span><b>${typeLabel63(k)}</b><em>✓</em></button>`).join('')}</div>`;
    overlay.classList.add('show');
  };
  window.closeAddressTypePanelV63=function(){document.getElementById('addressTypePanelV63')?.classList.remove('show');};
  window.selectAddressTypeV63=function(t){const el=document.getElementById('v63BuildingType'); if(el)el.value=t; const btn=document.getElementById('v63BuildingTypeBtn'); if(btn)btn.innerHTML=`<span>${typeIcon63(t)}</span><b>${typeLabel63(t)}</b><em>⌄</em>`; const comp=document.getElementById('v63ComplementWrap'); if(comp)comp.style.display=(t==='home')?'none':'block'; closeAddressTypePanelV63();};

  window.openAddressFormV61=function(i){
    ensurePage63('addressFormV61');
    const edit=Number.isInteger(i); const a=edit?reglages.savedAddresses[i]:{}; if(a)splitCity63(a);
    const type=a?.buildingType||'home'; const box=document.getElementById('addressFormV61'); box.dataset.editIndex=edit?String(i):'';
    box.innerHTML=`<div class="v58-top"><button onclick="openAddressesV58()">←</button><h2>${edit?'Modifier':'Nouvelle adresse'}</h2><span></span></div><div class="v58-scroll"><div class="v63-form-card"><label>Type de bâtiment</label><input type="hidden" id="v63BuildingType" value="${s63(type)}"><button type="button" id="v63BuildingTypeBtn" class="v63-type-select" onclick="openAddressTypePanelV63()"><span>${typeIcon63(type)}</span><b>${typeLabel63(type)}</b><em>⌄</em></button><label>Nom de l’adresse</label><input id="v61AddrLabel" placeholder="Maison Tours" value="${s63(a?.label||'')}"><label>Adresse</label><input id="v61AddrStreet" placeholder="55 Quai Paul Bert" value="${s63(a?.street||'')}"><div class="v62-two-cols"><div><label>Code postal</label><input id="v61AddrPostal" inputmode="numeric" placeholder="37000" value="${s63(a?.postalCode||'')}"></div><div><label>Ville</label><input id="v61AddrCityName" placeholder="Tours" value="${s63(a?.cityName||'')}"></div></div><div id="v63ComplementWrap" style="display:${type==='home'?'none':'block'}"><label>Complément</label><input id="v61AddrExtra" placeholder="Étage, bâtiment, digicode..." value="${s63(a?.extra||'')}"></div><div class="v62-address-note">Le repère Destination sera placé automatiquement sur cette adresse.</div></div></div><div class="v62-bottom"><button onclick="saveAddressFormV61()">Enregistrer l’adresse</button></div>`;
    show63('addressFormV61');
  };
  window.saveAddressFormV61=function(){
    const box=document.getElementById('addressFormV61'); const raw=box?.dataset.editIndex; const idx=raw===''?null:parseInt(raw,10);
    const type=document.getElementById('v63BuildingType')?.value||'home';
    const a={buildingType:type,label:(document.getElementById('v61AddrLabel')?.value||typeLabel63(type)).trim(),street:(document.getElementById('v61AddrStreet')?.value||'').trim(),postalCode:(document.getElementById('v61AddrPostal')?.value||'').trim(),cityName:(document.getElementById('v61AddrCityName')?.value||'').trim(),extra:type==='home'?'':(document.getElementById('v61AddrExtra')?.value||'').trim()};
    if(!a.street)return alert('Ajoute une adresse.'); if(!a.cityName)return alert('Ajoute la ville.');
    normalizeAddr63(a);
    if(idx===null||Number.isNaN(idx)) reglages.savedAddresses.unshift(a); else reglages.savedAddresses[idx]=a;
    reglages.checkoutAddress=a; saveAll(); try{openAddressesV58();}catch(_e){try{renderCheckoutV58();show63('checkoutV58');}catch(_e2){}}
  };

  const oldOpenDelivery63=window.openDeliveryOptionsV58;
  window.openDeliveryOptionsV58=function(){
    if(typeof oldOpenDelivery63==='function') oldOpenDelivery63();
    setTimeout(()=>{
      const b=document.querySelector('#deliveryOptionsV58 .v58-add-photo');
      if(b){b.type='button';b.onclick=function(e){e.preventDefault(); let inp=document.getElementById('v63PhotoInput'); if(!inp){inp=document.createElement('input');inp.id='v63PhotoInput';inp.type='file';inp.accept='image/*';inp.setAttribute('capture','environment');inp.style.display='none';document.body.appendChild(inp);inp.onchange=function(){ if(inp.files&&inp.files[0]){ b.textContent='✅ Photo ajoutée'; b.classList.add('v63-photo-added'); } };} inp.click();};}
    },60);
  };

  function money63(n){return (Number(n)||0).toFixed(2)+' €';}
  function checkoutSavingText63(){
    const cagn=Number(currentCagnotteDeduction)||0;
    const base=reglages.isPremium?'Avec Lago+, vous économisez':'Avec les promotions, vous économisez';
    const extra=cagn>0?` dont ${money63(cagn)} de cagnotte`:'';
    return {label:base+extra, amount:(reglages.isPremium?((Number(currentCagnotteDeduction)||0)):0)};
  }
  const oldRenderCheckout63=window.renderCheckoutV58;
  window.renderCheckoutV58=function(){
    if(typeof oldRenderCheckout63==='function') oldRenderCheckout63();
    setTimeout(()=>{
      document.getElementById('clientApp')?.classList.add('v61-checkout-mode');
      document.querySelectorAll('#checkoutV58 .v58-map-edit').forEach(x=>x.textContent='Modifier');
      const sav=document.querySelector('#checkoutV58 .v58-saving');
      if(sav && currentCagnotteDeduction>0){ const data=checkoutSavingText63(); const label=sav.querySelector('b'); if(label)label.textContent=data.label; const st=sav.querySelector('strong'); if(st)st.textContent=money63((reglages.isPremium?Number(currentCagnotteDeduction)||0:0) + (Number(st?.textContent?.replace(/[^0-9.]/g,''))||0)); }
    },50);
  };

  // Panier: on enlève le vieux choix date/pourboire, maintenant tout passe dans le checkout et après livraison.
  function cleanOldCartDelivery63(){const s=document.getElementById('scheduleSection'); if(s)s.style.display='none'; const t=document.getElementById('tipSection'); if(t)t.style.display='none'; try{currentTip=0;}catch(_e){} }
  const oldUpdateCart63=window.updateCart;
  if(typeof oldUpdateCart63==='function') window.updateCart=function(){const r=oldUpdateCart63.apply(this,arguments); cleanOldCartDelivery63(); return r;};
  cleanOldCartDelivery63();

  // Pourboire après livraison + note moyenne verrouillée.
  let chosenTip63=0;
  function installPostDeliveryTip63(){
    const rating=document.getElementById('ratingDiv'); if(!rating || document.getElementById('v63PostTipBox')) return;
    const box=document.createElement('div'); box.id='v63PostTipBox'; box.className='v63-post-tip';
    box.innerHTML=`<h4>💰 Laisser un pourboire au livreur ?</h4><div class="v63-tip-row">${[1,2,5].map(v=>`<button type="button" data-tip="${v}">${v}€</button>`).join('')}<button type="button" data-tip="custom">Custom</button></div>`;
    const submit=document.getElementById('submitReviewBtn'); submit?.insertAdjacentElement('beforebegin',box);
    box.querySelectorAll('button').forEach(btn=>btn.onclick=function(){
      let val=this.dataset.tip==='custom'?prompt('Montant du pourboire :','2'):this.dataset.tip; val=parseFloat(String(val).replace(',','.'))||0; chosenTip63=Math.max(0,Math.round(val*100)/100);
      box.querySelectorAll('button').forEach(b=>b.classList.remove('active')); if(chosenTip63>0)this.classList.add('active');
    });
  }
  function collectAverageRating63(){
    const vals=[]; if(Number(currentClientRating)>0) vals.push(Number(currentClientRating));
    document.querySelectorAll('.v58-mini-stars').forEach(g=>{const v=Number(g.dataset.value||0); if(v>0)vals.push(v);});
    return vals.length?Math.round((vals.reduce((a,b)=>a+b,0)/vals.length)*10)/10:0;
  }
  function lockRating63(){
    document.querySelectorAll('#ratingDiv .star,#v58RatingDetails button,#v63PostTipBox button').forEach(el=>{el.style.pointerEvents='none';el.disabled=true;});
    const c=document.getElementById('commentInput'); if(c)c.disabled=true;
  }
  function finalizeReview63(avg,text){
    if(currentDeliveryDriver&&avg>0){
      if(!Array.isArray(currentDeliveryDriver.comments))currentDeliveryDriver.comments=[];
      currentDeliveryDriver.comments.push({date:new Date().toLocaleDateString('fr-FR'),email:document.getElementById('clientEmailDisplay')?.innerText||'client',rating:avg,text:text||'',details:'Moyenne détaillée'});
      const oldVotes=Number(currentDeliveryDriver.votes)||0; const oldRating=Number(currentDeliveryDriver.rating)||5;
      currentDeliveryDriver.votes=oldVotes+1; currentDeliveryDriver.rating=Math.round(((oldRating*oldVotes)+avg)/currentDeliveryDriver.votes*10)/10;
      currentDeliveryDriver.tips=(Number(currentDeliveryDriver.tips)||0)+chosenTip63;
      try{renderAdminDrivers();}catch(_e){}
    }
    document.getElementById('merciAvis').style.display='block';
    const sub=document.getElementById('submitReviewBtn'); if(sub){sub.style.display='none';sub.disabled=true;}
    lockRating63(); saveAll();
  }
  function installReviewOverride63(){
    installPostDeliveryTip63();
    const sub=document.getElementById('submitReviewBtn'); if(!sub || sub.dataset.v63==='1') return; sub.dataset.v63='1';
    sub.onclick=function(){
      const avg=collectAverageRating63(); if(avg<=0)return alert('Mets au moins une note.');
      const text=document.getElementById('commentInput')?.value||''; this.disabled=true;
      if(chosenTip63>0 && typeof openPaymentModal==='function'){
        openPaymentModal(chosenTip63,()=>finalizeReview63(avg,text));
      }else finalizeReview63(avg,text);
    };
  }

  // Code livraison, message auto livreur, retard cohérent patron.
  let stageObserver63=null, lateTimer63=null;
  function deliveryCode63(){const digits=String(reglages.checkoutPhone||'').replace(/\D/g,''); return digits.slice(-2)||'00';}
  function addDriverMessage63(text){
    const chat=document.getElementById('chatHistory'); if(!chat)return;
    const row=document.createElement('div'); row.className='chat-msg driver'; row.innerHTML=`<b>Livreur</b><br>${s63(text)}`; chat.appendChild(row); chat.scrollTop=chat.scrollHeight;
  }
  function installDeliveryObserver63(){
    const title=document.getElementById('trackTitle'), desc=document.getElementById('trackDesc'); if(!title||!desc)return;
    let code=document.getElementById('v63DeliveryCode');
    if(!code){ code=document.createElement('div'); code.id='v63DeliveryCode'; code.className='v63-delivery-code'; desc.insertAdjacentElement('afterend',code); }
    code.textContent='Code livraison : '+deliveryCode63();
    if(stageObserver63)try{stageObserver63.disconnect();}catch(_e){}
    let sentBottom=false;
    const read=()=>{
      const tx=(title.innerText+' '+desc.innerText).toLowerCase();
      if((tx.includes('il est là')||tx.includes('descends'))&&!sentBottom){sentBottom=true; addDriverMessage63('Je suis en bas.');}
    };
    stageObserver63=new MutationObserver(read); stageObserver63.observe(title,{childList:true,subtree:true,characterData:true}); stageObserver63.observe(desc,{childList:true,subtree:true,characterData:true}); read();
    clearTimeout(lateTimer63);
    lateTimer63=setTimeout(()=>{ if(deliveryInProgress && currentDeliveryDriver){ currentDeliveryDriver.status='En retard'; addDriverMessage63('Je suis en retard, j’arrive dès que possible.'); try{renderAdminDrivers();saveAll();}catch(_e){} } }, Math.max(90000, (Number(window.v58CurrentDeliveryTimings?.searchMs)||60000)+(Number(window.v58CurrentDeliveryTimings?.routeMs)||240000)*0.65));
  }
  const oldStart63=window.startDeliveryFlow;
  if(typeof oldStart63==='function')window.startDeliveryFlow=function(){const r=oldStart63.apply(this,arguments); setTimeout(()=>{installReviewOverride63(); installDeliveryObserver63();},500); return r;};

  // Cagnotte: cashback Lago+ après commande, cagnotte utilisée visible dans économies du checkout.
  const oldSubmit63=window.submitCheckoutV58;
  if(typeof oldSubmit63==='function')window.submitCheckoutV58=function(){
    const before=Number(reglages.cagnotte)||0;
    const used=Number(currentCagnotteDeduction)||0;
    const r=oldSubmit63.apply(this,arguments);
    setTimeout(()=>{ if(reglages.isPremium && (Number(reglages.totalOrders)||0)>0){ const gain=Math.round(((Math.random()*1.2)+0.30)*100)/100; reglages.cagnotte=Math.round(((Number(reglages.cagnotte)||0)+gain)*100)/100; saveAll(); } },1200);
    return r;
  };

  // Faux clients: avatars cohérents avec commandes/VIP.
  const specialUrls63=['https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Lago10&backgroundColor=fef3c7','https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Lago20&backgroundColor=dbeafe','https://api.dicebear.com/7.x/bottts-neutral/svg?seed=LagoCash50&backgroundColor=dcfce7'];
  function normalizeFakeAvatars63(){
    if(!Array.isArray(fakeUsers))return;
    fakeUsers.forEach((u,i)=>{ if(u.email===window.currentUser?.email)return; const orders=Number(u.orders)||Number(u.historique?.length)||0; if(orders>=20 && i%7===0)u.avatarUrl=specialUrls63[1]; else if(orders>=10 && i%5===0)u.avatarUrl=specialUrls63[0]; else if(u.isVip && avatarsPremium.length)u.avatarUrl=avatarsPremium[i%avatarsPremium.length]; else if(avatarsStandard.length)u.avatarUrl=avatarsStandard[i%avatarsStandard.length]; });
  }
  const oldRenderUsers63=window.renderAdminUsers;
  if(typeof oldRenderUsers63==='function')window.renderAdminUsers=function(){normalizeFakeAvatars63(); return oldRenderUsers63.apply(this,arguments);};
  const oldSaveAll63=window.saveAll||saveAll;
  window.saveAll=function(){normalizeFakeAvatars63(); return oldSaveAll63.apply(this,arguments);};

  function boot63(){
    cleanOldCartDelivery63(); installPostDeliveryTip63(); installReviewOverride63(); normalizeFakeAvatars63();
    document.querySelectorAll('.v61-map-recenter,.v58-map-editor-recenter').forEach(x=>x.style.display='none');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot63); else boot63();
  setTimeout(boot63,400); setTimeout(boot63,1200);
})();


/* ===== V64 — finances checkout, adresse simplifiée, stats séparées ===== */
(function(){
  function fmt64(n){ return (Number(n)||0).toFixed(2)+' €'; }
  function clean64(s){ return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function ensureFinance64(){
    ['revenuePriorityFees','revenueServiceFees','revenueDeliveryFees'].forEach(k=>{ if(typeof reglages[k]!=='number') reglages[k]=0; });
  }
  function getDeliveryFee64(){ return (reglages.isPremium && Number(cartDistance||9)<=3) ? 0 : 4.99; }
  function getPriorityFee64(){ return reglages.checkoutDeliveryMode==='priority' ? 2.99 : 0; }

  function patchCheckoutPrice64(){
    const price=document.querySelector('#checkoutV58 .v58-price');
    if(!price) return;
    // Enlever TVA.
    [...price.children].forEach(row=>{
      const label=row.querySelector('span')?.textContent?.toLowerCase()||'';
      if(label.includes('tva')) row.remove();
    });
    // Afficher la cagnotte utilisée dans le détail total, pas seulement dans la bulle.
    const cagn=Number(currentCagnotteDeduction)||0;
    if(cagn>0 && !price.querySelector('.v64-cagnotte-line')){
      const total=price.querySelector('.total');
      const row=document.createElement('div');
      row.className='discount gold v64-cagnotte-line';
      row.innerHTML=`<span>Cagnotte utilisée</span><b>-${fmt64(cagn)}</b>`;
      if(total) price.insertBefore(row,total); else price.appendChild(row);
    }
    const sav=document.querySelector('#checkoutV58 .v58-saving');
    if(sav){
      const cagnLine=cagn>0 ? ` dont ${fmt64(cagn)} de cagnotte` : '';
      const b=sav.querySelector('b');
      if(b) b.textContent=(reglages.isPremium?'Avec Lago+, vous économisez':'Avec les promotions, vous économisez')+cagnLine;
    }
  }
  const oldRenderCheckout64=window.renderCheckoutV58;
  if(typeof oldRenderCheckout64==='function'){
    window.renderCheckoutV58=function(){
      const r=oldRenderCheckout64.apply(this,arguments);
      setTimeout(patchCheckoutPrice64,70);
      return r;
    };
  }

  // Nouvelle adresse : suppression du champ inutile “Nom de l’adresse”.
  function typeLabel64(t){return {home:'Maison',apartment:'Appartement',office:'Bureau',other:'Autre'}[t||'home']||'Maison';}
  function typeIcon64(t){return {home:'🏠',apartment:'🏢',office:'💼',other:'📍'}[t||'home']||'🏠';}
  function show64(id){document.getElementById('clientApp')?.querySelectorAll('section').forEach(x=>x.classList.remove('active'));document.getElementById(id)?.classList.add('active');const nav=document.getElementById('clientNav');if(nav)nav.style.display='none';}
  function ensurePage64(id){const app=document.getElementById('clientApp');if(!app)return null;let el=document.getElementById(id);if(!el){el=document.createElement('section');el.id=id;el.className='v58-full-page';(app.querySelector('main')||app).appendChild(el);}return el;}
  function splitCity64(a){if(!a)return; if(!a.postalCode && a.city){const m=String(a.city).match(/^(\d{4,5})\s+(.+)$/); if(m){a.postalCode=m[1];a.cityName=m[2];}} if(!a.cityName)a.cityName=String(a.city||'Tours').replace(/^\d{4,5}\s+/, '')||'Tours'; if(!a.postalCode)a.postalCode='37000'; a.city=(a.postalCode+' '+a.cityName).trim();}
  function normalizeAddr64(a){ if(!a)return; splitCity64(a); const key=(a.street+' '+a.postalCode+' '+a.cityName).toLowerCase(); let c={lat:47.3941,lng:0.6848}; if(key.includes('grand cèdre')||key.includes('grand cedre')) c={lat:47.3656,lng:0.7390}; else if(key.includes('jean jaurès')||key.includes('jean jaures')) c={lat:47.3524,lng:0.6636}; else if(key.includes('quai paul bert')) c={lat:47.3947,lng:0.7056}; else if(key.includes('saint-avertin')) c={lat:47.3656,lng:0.7390}; a.lat=c.lat; a.lng=c.lng; if(!a.pins)a.pins={}; a.pins.destination={lat:a.lat,lng:a.lng}; }
  window.openAddressFormV61=function(i){
    ensurePage64('addressFormV61');
    const edit=Number.isInteger(i); const a=edit?reglages.savedAddresses[i]:{}; if(a)splitCity64(a);
    const type=a?.buildingType||'home'; const box=document.getElementById('addressFormV61'); box.dataset.editIndex=edit?String(i):'';
    box.innerHTML=`<div class="v58-top"><button onclick="openAddressesV58()">←</button><h2>${edit?'Modifier':'Nouvelle adresse'}</h2><span></span></div><div class="v58-scroll"><div class="v63-form-card v64-address-card"><label>Type de bâtiment</label><input type="hidden" id="v63BuildingType" value="${clean64(type)}"><button type="button" id="v63BuildingTypeBtn" class="v63-type-select" onclick="openAddressTypePanelV63()"><span>${typeIcon64(type)}</span><b>${typeLabel64(type)}</b><em>⌄</em></button><label>Adresse</label><input id="v61AddrStreet" placeholder="55 Quai Paul Bert" value="${clean64(a?.street||'')}"><div class="v62-two-cols"><div><label>Code postal</label><input id="v61AddrPostal" inputmode="numeric" placeholder="37000" value="${clean64(a?.postalCode||'')}"></div><div><label>Ville</label><input id="v61AddrCityName" placeholder="Tours" value="${clean64(a?.cityName||'')}"></div></div><div id="v63ComplementWrap" style="display:${type==='home'?'none':'block'}"><label>Complément</label><input id="v61AddrExtra" placeholder="Étage, bâtiment, digicode..." value="${clean64(a?.extra||'')}"></div><div class="v62-address-note">Le repère Destination sera placé automatiquement sur cette adresse.</div></div></div><div class="v62-bottom"><button onclick="saveAddressFormV61()">Enregistrer l’adresse</button></div>`;
    show64('addressFormV61');
  };
  window.saveAddressFormV61=function(){
    const box=document.getElementById('addressFormV61'); const raw=box?.dataset.editIndex; const idx=raw===''?null:parseInt(raw,10);
    const type=document.getElementById('v63BuildingType')?.value||'home';
    const street=(document.getElementById('v61AddrStreet')?.value||'').trim();
    const postal=(document.getElementById('v61AddrPostal')?.value||'').trim();
    const city=(document.getElementById('v61AddrCityName')?.value||'').trim();
    const a={buildingType:type,label:typeLabel64(type),street,postalCode:postal,cityName:city,extra:type==='home'?'':(document.getElementById('v61AddrExtra')?.value||'').trim()};
    if(!a.street)return alert('Ajoute une adresse.'); if(!a.cityName)return alert('Ajoute la ville.');
    normalizeAddr64(a);
    if(idx===null||Number.isNaN(idx)) reglages.savedAddresses.unshift(a); else reglages.savedAddresses[idx]=a;
    reglages.checkoutAddress=a; saveAll(); try{openAddressesV58();}catch(_e){try{renderCheckoutV58();show64('checkoutV58');}catch(_e2){}}
  };

  // Statistiques patron : séparation frais de service / livraison / prioritaire.
  function ensureAdminFinancePanel64(){
    const stats=document.getElementById('admStats'); if(!stats || document.getElementById('adminFinanceBreakdown64')) return;
    const ref=document.getElementById('statsCATotal')?.closest('div');
    if(!ref) return;
    const box=document.createElement('div');
    box.id='adminFinanceBreakdown64';
    box.className='v64-finance-box';
    box.innerHTML=`<h4>💶 Détail des revenus livraison</h4><div><span>Livraisons prioritaires</span><b id="v64PriorityRevenue">0.00 €</b></div><div><span>Frais de service</span><b id="v64ServiceRevenue">0.00 €</b></div><div><span>Frais de livraison</span><b id="v64DeliveryRevenue">0.00 €</b></div><small>Part livreur réglée à 20% sur la commande, le reste reste côté Lago.</small>`;
    ref.insertAdjacentElement('afterend',box);
  }
  function refreshAdminFinance64(){
    ensureFinance64(); ensureAdminFinancePanel64();
    const set=(id,v)=>{const el=document.getElementById(id); if(el) el.textContent=fmt64(v);};
    set('v64PriorityRevenue',reglages.revenuePriorityFees);
    set('v64ServiceRevenue',reglages.revenueServiceFees);
    set('v64DeliveryRevenue',reglages.revenueDeliveryFees);
  }
  const oldUpdateStats64=window.updateAdminStats;
  if(typeof oldUpdateStats64==='function') window.updateAdminStats=function(){ const r=oldUpdateStats64.apply(this,arguments); refreshAdminFinance64(); return r; };
  const oldStartDelivery64=window.startDeliveryFlow;
  if(typeof oldStartDelivery64==='function') window.startDeliveryFlow=function(){
    ensureFinance64();
    reglages.revenueServiceFees=Math.round((reglages.revenueServiceFees+2.99)*100)/100;
    reglages.revenueDeliveryFees=Math.round((reglages.revenueDeliveryFees+getDeliveryFee64())*100)/100;
    reglages.revenuePriorityFees=Math.round((reglages.revenuePriorityFees+getPriorityFee64())*100)/100;
    saveAll();
    const r=oldStartDelivery64.apply(this,arguments);
    setTimeout(refreshAdminFinance64,200);
    return r;
  };

  function boot64(){ patchCheckoutPrice64(); refreshAdminFinance64(); }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot64); else boot64();
  setTimeout(boot64,500); setTimeout(boot64,1400);
})();

/* ===== V77 — base V64 stable : thèmes Premium, maintenance, patron dynamique sans polluer le client ===== */
(function(){
  const V77_THEME_OPTIONS=[
    ['dark','🌙 Nuit',false],['light','☀️ Jour',false],
    ['neon','👑 Néon Bleu',true],['black','👑 Pitch Black',true],['glass','👑 Liquide Glace',true],
    ['aurora','👑 Aurore Lago',true],['titanium','👑 Titanium',true],['emerald','👑 Émeraude',true],['sakura','👑 Sakura',true],
    ['northern','👑 Aurore Boréale',true],['luxenight','👑 Luxe Minuit',true],['oceanglass','👑 Océan Glass',true],['sunsetvelvet','👑 Sunset Velvet',true],['forestgold','👑 Forest Gold',true],['champagne','👑 Champagne',true]
  ];
  const PREMIUM_THEME_IDS=new Set(V77_THEME_OPTIONS.filter(t=>t[2]).map(t=>t[0]));
  const THEME_CLASS_MAP={
    light:'theme-day',neon:'theme-neon',black:'theme-black',glass:'theme-glass',
    aurora:'theme-aurora',titanium:'theme-titanium',emerald:'theme-emerald',sakura:'theme-sakura',
    northern:'theme-northern',luxenight:'theme-luxenight',oceanglass:'theme-oceanglass',sunsetvelvet:'theme-sunsetvelvet',forestgold:'theme-forestgold',champagne:'theme-champagne'
  };
  const THEME_CLASSES=Object.values(THEME_CLASS_MAP).concat(['theme-day','theme-neon','theme-black','theme-glass']);
  function money(n){return (Number(n)||0).toFixed(2)+' €';}
  function safe(s){return String(s??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));}
  function premiumActive(){ return !!reglages.isPremium; }
  function isHumanUser(u){ return !!u && (Number(u.id)>=999 || u.email===window.currentUser?.email); }
  function isFakeClient(u){ return !!u && Number(u.id)<999 && u.role!=='admin'; }

  function fillThemeSelect(selectId, includeAdmin){
    const sel=document.getElementById(selectId); if(!sel) return;
    const val=sel.value || reglages.theme || 'dark';
    sel.innerHTML=V77_THEME_OPTIONS.map(([id,label,prem])=>`<option value="${id}" ${prem&&!premiumActive()&&!includeAdmin?'disabled':''}>${label}</option>`).join('');
    sel.value=V77_THEME_OPTIONS.some(t=>t[0]===val)?val:'dark';
  }
  function enforcePremiumTheme(){
    if(!premiumActive() && PREMIUM_THEME_IDS.has(reglages.theme)) reglages.theme='dark';
    if(!premiumActive() && PREMIUM_THEME_IDS.has(reglages.adminTheme)) reglages.adminTheme='dark';
  }
  appliquerThemeGlobal=function(themeName){
    themeName=themeName||'dark';
    document.body.classList.remove(...THEME_CLASSES);
    if(reglages.weatherSurge) document.body.classList.add('rain-mode'); else document.body.classList.remove('rain-mode');
    const cls=THEME_CLASS_MAP[themeName]; if(cls) document.body.classList.add(cls);
    try{ updateClientNavIndicator(); }catch(_e){}
  };
  appliquerThemeEtPremium=function(){
    enforcePremiumTheme(); fillThemeSelect('userThemeSelect',false); fillThemeSelect('adminThemeSelect',true);
    const u=document.getElementById('userThemeSelect'); if(u) u.value=reglages.theme||'dark';
    const a=document.getElementById('adminThemeSelect'); if(a) a.value=reglages.adminTheme||reglages.theme||'dark';
    appliquerThemeGlobal(reglages.theme||'dark');
    try{ updatePaymentCardPreview(); }catch(_e){}
  };

  function ensurePremiumCore(){
    if(!Array.isArray(reglages.referrals)) reglages.referrals=[];
    if(typeof reglages.referralClaimed!=='boolean') reglages.referralClaimed=false;
    if(typeof reglages.cagnotte!=='number' || isNaN(reglages.cagnotte)) reglages.cagnotte=0;
    if(premiumActive() && reglages.vipBaseBonusApplied!==true){
      reglages.cagnotte=Math.max(Number(reglages.cagnotte)||0,15);
      reglages.vipBaseBonusApplied=true;
    }
    if(premiumActive() && reglages.referrals.length>=3 && !reglages.referralClaimed){
      reglages.cagnotte=Math.round(((Number(reglages.cagnotte)||0)+15)*100)/100;
      reglages.referralClaimed=true;
    }
    if(!premiumActive()){
      reglages.vipBaseBonusApplied=false;
      enforcePremiumTheme();
      try{ if(Array.isArray(avatarsPremium) && avatarsPremium.includes(reglages.avatarUrl)) reglages.avatarUrl=avatarsStandard[0]; }catch(_e){}
    }
  }
  const oldAvatarApply77=window.appliquerAvatarEtPremium || appliquerAvatarEtPremium;
  appliquerAvatarEtPremium=function(){
    ensurePremiumCore();
    try{ oldAvatarApply77(); }catch(_e){}
    document.querySelectorAll('.premium-avatar-btn').forEach(img=>{img.style.opacity=premiumActive()?'1':'.45'; img.style.filter=premiumActive()?'none':'grayscale(.65)';});
    document.querySelectorAll('.avatar-lock').forEach(l=>l.style.display=premiumActive()?'none':'flex');
    const cag=document.getElementById('cagnotteDisplay'); if(cag)cag.textContent=(Number(reglages.cagnotte)||0).toFixed(2);
    appliquerThemeEtPremium();
  };
  window.selectAvatar=function(url,isPrem){
    ensurePremiumCore();
    if(isPrem && !premiumActive()) return alert('Cet avatar est réservé aux membres Lago+ 👑');
    reglages.avatarUrl=url;
    const im=document.getElementById('userAvatarImg'); if(im) im.src=url;
    document.getElementById('avatarModal')?.classList.remove('active');
    saveAll();
  };
  const oldShowAvatars77=window.showAvatarModal;
  window.showAvatarModal=function(){
    if(typeof oldShowAvatars77==='function') oldShowAvatars77();
    setTimeout(()=>{ try{appliquerAvatarEtPremium();}catch(_e){} },50);
  };

  const oldConfirmVip77=window.confirmVipPurchase;
  window.confirmVipPurchase=function(){
    try{ closeVipModal(); document.getElementById('referralAdModal')?.classList.remove('active'); }catch(_e){}
    openPaymentModal(59.99,()=>{
      reglages.isPremium=true;
      reglages.vipBaseBonusApplied=true;
      reglages.cagnotte=Math.max(Number(reglages.cagnotte)||0,15);
      if(Array.isArray(reglages.referrals)&&reglages.referrals.length>=3&&!reglages.referralClaimed){reglages.cagnotte=Math.round((reglages.cagnotte+15)*100)/100; reglages.referralClaimed=true;}
      reglages.caTotal=Math.round(((Number(reglages.caTotal)||0)+59.99)*100)/100;
      if(window.currentUser) window.currentUser.vipSource='purchased';
      try{addAdminActionLog('Achat Lago+',59.99);}catch(_e){}
      appliquerAvatarEtPremium(); mettreAJourVitrine(); updateCart(); updateAdminStats(); renderReferrals(); saveAll();
      alert(`Bienvenue dans Lago+ 👑 ! Cagnotte disponible : ${money(reglages.cagnotte)}`);
    });
  };
  const oldAddReferral77=window.addReferral;
  window.addReferral=function(){
    if(typeof oldAddReferral77==='function') oldAddReferral77();
    ensurePremiumCore();
    try{ renderReferrals(); appliquerAvatarEtPremium(); saveAll(); }catch(_e){}
  };
  const oldRefund77=window.refundVip;
  window.refundVip=function(){
    if(typeof oldRefund77==='function') oldRefund77();
    if(!reglages.isPremium){reglages.vipBaseBonusApplied=false; enforcePremiumTheme(); appliquerAvatarEtPremium(); saveAll();}
  };

  function productList(){
    const list=[];
    const add=(name,price,key,rupt)=>{ if(!rupt && Number(price)>0) list.push({name,price:Number(price),key}); };
    add('Le Solo',reglages.prixSolo,'Solo',reglages.ruptureSolo||reglages.stockSolo<=0);
    add('Le Duo',reglages.prixDuo,'Duo',reglages.ruptureDuo||reglages.stockDuo<=0);
    add('Le Gonflable',reglages.prixGonflable,'Gonflable',reglages.ruptureGonflable||reglages.stockGonflable<=0);
    add('Le Compact',reglages.prixCompact||10,'Compact',reglages.ruptureCompact||reglages.stockCompact<=0);
    add('Lit Parapluie',reglages.prixBebe,'Bebe',reglages.ruptureBebe||reglages.stockBebe<=0);
    (reglages.customMattresses||[]).forEach(m=>{ if(!m.rupture && Number(m.price)>0 && Number(m.stock||1)>0) list.push({name:m.name,price:Number(m.price),customId:m.id}); });
    return list.length?list:[{name:'Le Solo',price:Number(reglages.prixSolo)||20,key:'Solo'}];
  }
  function decrementProduct(p,qty){
    qty=Math.max(1,Number(qty)||1);
    if(p.customId){
      const m=(reglages.customMattresses||[]).find(x=>x.id===p.customId || x.name===p.name); if(m){m.stock=Math.max(0,Number(m.stock||0)-qty); m.rupture=!!m.manualRupture||m.stock<=0;}
    }else if(p.key){
      const s='stock'+p.key, r='rupture'+p.key, man='manualRupture'+p.key;
      if(typeof reglages[s]!=='number') reglages[s]=10;
      reglages[s]=Math.max(0,Number(reglages[s]||0)-qty); reglages[r]=!!reglages[man]||reglages[s]<=0;
    }
    try{mettreAJourVitrine();}catch(_e){}
  }
  function ensureFinance(){
    if(!Array.isArray(reglages.businessOrders)) reglages.businessOrders=[];
    ['revenuePriorityFees','revenueServiceFees','revenueDeliveryFees','revenueMattress','revenuePremium','driverPayoutTotal','peakHourRevenue'].forEach(k=>{if(typeof reglages[k]!=='number'||isNaN(reglages[k]))reglages[k]=0;});
  }
  function recordOrder(o){
    ensureFinance();
    reglages.businessOrders.unshift(o);
    reglages.businessOrders=reglages.businessOrders.slice(0,120);
    reglages.revenueMattress=Math.round((reglages.revenueMattress+Number(o.itemsTotal||0))*100)/100;
    reglages.revenueServiceFees=Math.round((reglages.revenueServiceFees+Number(o.serviceFee||0))*100)/100;
    reglages.revenueDeliveryFees=Math.round((reglages.revenueDeliveryFees+Number(o.deliveryFee||0))*100)/100;
    reglages.revenuePriorityFees=Math.round((reglages.revenuePriorityFees+Number(o.priorityFee||0))*100)/100;
    reglages.peakHourRevenue=Math.round((reglages.peakHourRevenue+Number(o.peakFee||0))*100)/100;
    reglages.driverPayoutTotal=Math.round((reglages.driverPayoutTotal+Number(o.driverPay||0))*100)/100;
  }
  function updateFinancePanel(){
    ensureFinance();
    const set=(id,v)=>{const el=document.getElementById(id); if(el)el.textContent=money(v);};
    set('v64PriorityRevenue',reglages.revenuePriorityFees);
    set('v64ServiceRevenue',reglages.revenueServiceFees);
    set('v64DeliveryRevenue',reglages.revenueDeliveryFees);
  }
  const oldStats77=window.updateAdminStats || updateAdminStats;
  window.updateAdminStats=function(){const r=oldStats77.apply(this,arguments); updateFinancePanel(); return r;};

  function adminOrdersModal(){
    const overlay=document.createElement('div'); overlay.className='modal active'; overlay.id='v77OrdersModal';
    const orders=(reglages.businessOrders||[]).slice(0,50);
    overlay.innerHTML=`<div class="modal-content"><button class="modal-close" onclick="this.closest('.modal').remove()">×</button><h3>Commandes</h3><p style="color:var(--text-dim);font-size:13px">Touchez une commande pour voir le détail.</p><div style="display:flex;flex-direction:column;gap:10px;max-height:55vh;overflow:auto">${orders.length?orders.map((o,i)=>`<div class="history-card" onclick="openBusinessOrderV77(${i})"><b>${safe(o.item)}${o.qty>1?' x'+o.qty:''}</b><br><small>${safe(o.client)} • ${safe(o.date)}</small></div>`).join(''):'<p style="color:var(--text-dim)">Aucune commande patron pour le moment.</p>'}</div></div>`;
    document.body.appendChild(overlay);
  }
  window.openBusinessOrderV77=function(i){
    const o=(reglages.businessOrders||[])[i]; if(!o)return;
    const ov=document.createElement('div'); ov.className='modal active';
    ov.innerHTML=`<div class="modal-content"><button class="modal-close" onclick="this.closest('.modal').remove()">×</button><h3>Détail commande</h3><div style="text-align:left;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:18px;padding:15px;line-height:1.8"><b>Client :</b> ${safe(o.client)}<br><b>Matelas :</b> ${safe(o.item)}${o.qty>1?' x'+o.qty:''}<br><b>Date :</b> ${safe(o.date)}<br><b>Livreur :</b> ${safe(o.driver||'Non assigné')}<br><hr style="border-color:var(--glass-border)"><b>Matelas/options :</b> ${money(o.itemsTotal)}<br><b>Frais de service :</b> ${money(o.serviceFee)}<br><b>Frais livraison :</b> ${money(o.deliveryFee)}<br><b>Prioritaire :</b> ${money(o.priorityFee)}<br><b>Part livreur 20% :</b> ${money(o.driverPay)}<br><b>Total :</b> ${money(o.total)}</div></div>`;
    document.body.appendChild(ov);
  };
  function bindOrdersButtons(){
    document.querySelectorAll('[onclick*="openFinanceModal"],#adminFinanceBreakdown64').forEach(el=>{ if(el.dataset.v77bind)return; el.dataset.v77bind='1'; el.addEventListener('dblclick',adminOrdersModal); });
  }

  function runFakeOrder(){
    const clients=fakeUsers.filter(u=>isFakeClient(u)&&!u.banni); if(!clients.length)return;
    const usr=clients[Math.floor(Math.random()*clients.length)];
    const p=productList()[Math.floor(Math.random()*productList().length)];
    const priority=Math.random()<0.22, peak=!!reglages.peakHourActive;
    const serviceFee=2.99, deliveryFee=4.99, priorityFee=priority?2.99:0, peakFee=peak?Math.round(p.price*.12*100)/100:0;
    const driverPay=Math.round(p.price*.20*100)/100;
    const total=Math.round((p.price+serviceFee+deliveryFee+priorityFee+peakFee)*100)/100;
    const d=getAvailableDriver(!!usr.isVip);
    const date=new Date().toLocaleDateString('fr-FR')+' '+new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
    decrementProduct(p,1);
    usr.orders=(Number(usr.orders)||0)+1; if(!Array.isArray(usr.historique))usr.historique=[];
    usr.historique.unshift({id:Date.now()+Math.random(),date,prix:total,items:p.name,status:'Terminée',fake:true});
    if(d){d.totalOrders=(Number(d.totalOrders)||0)+1; d.earnings=Math.round((Number(d.earnings||0)+driverPay)*100)/100; d.status='En livraison 🛵';}
    reglages.caTotal=Math.round((Number(reglages.caTotal||0)+Math.max(0,total-driverPay))*100)/100;
    reglages.totalOrders=(Number(reglages.totalOrders)||0)+1;
    recordOrder({id:Date.now(),client:usr.email,item:p.name,qty:1,date,total,itemsTotal:p.price,serviceFee,deliveryFee,priorityFee,peakFee,driverPay,driver:d?d.name:''});
    const toastBox=document.getElementById('adminToastContainer');
    if(toastBox && document.getElementById('adminApp')?.style.display==='block'){
      const notif=document.createElement('div'); notif.className='admin-toast'; notif.innerHTML=`🔔 <b>${usr.email.split('@')[0]}</b> a commandé <b>${safe(p.name)}</b> (+${money(total)})${d?`<br><span style="font-size:11px">🛵 Livré par: <b>${safe(d.name)}</b></span>`:''}`;
      toastBox.appendChild(notif); setTimeout(()=>{notif.style.opacity='0'; setTimeout(()=>notif.remove(),400);},5000);
    }
    try{renderAdminDrivers();renderAdminUsers();updateAdminStats();saveAll();}catch(_e){try{saveAll();}catch(_e2){}}
  }
  startBot=function(){
    if(botInterval) clearInterval(botInterval);
    botInterval=setInterval(runFakeOrder,8000);
  };
  window.startBot=startBot;

  function installMaintenance(){
    let ov=document.getElementById('maintenanceOverlayV54'); if(!ov){ov=document.createElement('div');ov.id='maintenanceOverlayV54';document.body.appendChild(ov);} 
    ov.innerHTML=`<div class="maintenance-card-v77"><h2>Lago</h2><p id="maintenanceMsgV54"></p><button type="button" onclick="maintenanceLogoutV77()">Retour connexion</button></div>`;
  }
  window.maintenanceLogoutV77=function(){try{logOut();}catch(_e){location.reload();}};
  window.applyMaintenanceV54=function(){
    installMaintenance();
    const msg=document.getElementById('maintenanceMsgV54'); if(msg)msg.textContent=reglages.maintenanceMessage||'Lago est en maintenance. On revient vite.';
    const isClient=!!window.currentUser && window.currentUser.role!=='admin' && document.getElementById('clientApp')?.style.display==='block';
    document.getElementById('maintenanceOverlayV54')?.classList.toggle('show',!!reglages.maintenanceActive && isClient);
  };
  window.saveMaintenanceSettings=function(){
    const t=document.getElementById('adminMaintenanceToggle'), m=document.getElementById('adminMaintenanceMessage');
    if(t)reglages.maintenanceActive=!!t.checked;
    if(m)reglages.maintenanceMessage=(m.value||'Lago est en maintenance. On revient vite.').trim();
    saveAll(); applyMaintenanceV54(); alert(reglages.maintenanceActive?'Maintenance activée côté client.':'Maintenance désactivée.');
  };
  function syncMaintenanceInputs(){const t=document.getElementById('adminMaintenanceToggle'); if(t)t.checked=!!reglages.maintenanceActive; const m=document.getElementById('adminMaintenanceMessage'); if(m)m.value=reglages.maintenanceMessage||'';}

  const oldSave77=window.saveAll||saveAll;
  saveAll=function(){
    ensurePremiumCore(); enforcePremiumTheme();
    if(window.currentUser && window.currentUser.role!=='admin'){
      const u=fakeUsers.find(x=>x.email===window.currentUser.email);
      if(u){u.isVip=!!reglages.isPremium;u.theme=reglages.theme;u.cagnotte=reglages.cagnotte;u.avatarUrl=reglages.avatarUrl;u.referrals=reglages.referrals;u.referralClaimed=reglages.referralClaimed;u.cagnotteSpent=reglages.cagnotteSpent;u.savedCards=Array.isArray(reglages.savedCards)?reglages.savedCards:[];u.selectedCardDesign=currentCardDesign||'classic'; if(!isFakeClient(u))u.historique=reglages.historiqueCommandes;}
    }
    return oldSave77.apply(this,arguments);
  };

  function boot(){
    ensurePremiumCore(); fillThemeSelect('userThemeSelect',false); fillThemeSelect('adminThemeSelect',true); appliquerAvatarEtPremium(); appliquerThemeEtPremium(); syncMaintenanceInputs(); installMaintenance(); applyMaintenanceV54(); updateFinancePanel(); bindOrdersButtons();
    const userSel=document.getElementById('userThemeSelect'); if(userSel && !userSel.dataset.v77){userSel.dataset.v77='1'; userSel.addEventListener('change',e=>{ if(PREMIUM_THEME_IDS.has(e.target.value)&&!premiumActive()){e.target.value='dark';return alert('Ce thème est réservé aux membres Lago+ 👑');} reglages.theme=e.target.value; appliquerThemeEtPremium(); saveAll(); });}
    const adminSel=document.getElementById('adminThemeSelect'); if(adminSel && !adminSel.dataset.v77){adminSel.dataset.v77='1'; adminSel.addEventListener('change',e=>{reglages.adminTheme=e.target.value;reglages.theme=e.target.value;appliquerThemeGlobal(e.target.value);saveAll();});}
    try{startBot();}catch(_e){}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot); else boot();
  setTimeout(boot,400); setTimeout(boot,1400); setInterval(()=>{try{applyMaintenanceV54();updateFinancePanel();}catch(_e){}},3000);
})();

/* ===== V78 — finitions stabilité : notifs détaillées, maintenance alerte, thème client persistant, mini suivi masqué ===== */
(function(){
  const V78='v78';
  function safe(s){return String(s??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));}
  function money(n){return (Number(n)||0).toFixed(2)+' €';}
  function isClientUser(){return !!(window.currentUser && window.currentUser.role!=='admin' && window.currentUser.role!=='driver');}
  function prefKey(email){return 'lago_client_prefs_v78_'+String(email||'').toLowerCase();}
  function premiumActive(){return !!reglages.isPremium || !!window.currentUser?.isVip;}
  const premiumThemes=new Set(['neon','black','glass','aurora','titanium','emerald','sakura','northern','luxenight','oceanglass','sunsetvelvet','forestgold','champagne']);

  function findUserByEmail(email){try{return (fakeUsers||[]).find(u=>String(u.email).toLowerCase()===String(email).toLowerCase());}catch(_e){return null;}}
  function saveClientPrefsV78(){
    if(!isClientUser()) return;
    const email=window.currentUser.email;
    const data={
      theme:reglages.theme||'dark',
      avatarUrl:reglages.avatarUrl||window.currentUser.avatarUrl||'',
      isVip:!!reglages.isPremium,
      cagnotte:Number(reglages.cagnotte)||0,
      referrals:Array.isArray(reglages.referrals)?reglages.referrals:[],
      referralClaimed:!!reglages.referralClaimed,
      savedAt:Date.now()
    };
    try{localStorage.setItem(prefKey(email),JSON.stringify(data));}catch(_e){}
    const u=findUserByEmail(email);
    if(u){
      u.theme=data.theme; u.avatarUrl=data.avatarUrl; u.isVip=data.isVip; u.cagnotte=data.cagnotte; u.referrals=data.referrals; u.referralClaimed=data.referralClaimed;
      if(!Array.isArray(u.historique)) u.historique=[];
    }
  }
  function restoreClientPrefsV78(){
    if(!isClientUser()) return;
    const email=window.currentUser.email;
    let data=null; try{data=JSON.parse(localStorage.getItem(prefKey(email))||'null');}catch(_e){}
    const u=findUserByEmail(email);
    if(data){
      if(data.theme) reglages.theme=data.theme;
      if(data.avatarUrl) reglages.avatarUrl=data.avatarUrl;
      if(typeof data.isVip==='boolean') reglages.isPremium=data.isVip;
      if(typeof data.cagnotte==='number') reglages.cagnotte=data.cagnotte;
      if(Array.isArray(data.referrals)) reglages.referrals=data.referrals;
      if(typeof data.referralClaimed==='boolean') reglages.referralClaimed=data.referralClaimed;
    }else if(u){
      reglages.theme=u.theme||reglages.theme||'dark';
      reglages.avatarUrl=u.avatarUrl||reglages.avatarUrl;
      reglages.isPremium=!!u.isVip;
      reglages.cagnotte=Number(u.cagnotte)||0;
      reglages.referrals=Array.isArray(u.referrals)?u.referrals:[];
      reglages.referralClaimed=!!u.referralClaimed;
    }
    if(!premiumActive() && premiumThemes.has(reglages.theme)) reglages.theme='dark';
    if(u){u.theme=reglages.theme; u.avatarUrl=reglages.avatarUrl; u.isVip=!!reglages.isPremium; u.cagnotte=Number(reglages.cagnotte)||0; u.referrals=reglages.referrals||[]; u.referralClaimed=!!reglages.referralClaimed;}
    try{appliquerThemeGlobal(reglages.theme||'dark');}catch(_e){}
    try{appliquerThemeEtPremium();}catch(_e){}
    try{appliquerAvatarEtPremium();}catch(_e){}
  }

  const oldSaveAllV78=window.saveAll||saveAll;
  window.saveAll=saveAll=function(){
    try{saveClientPrefsV78();}catch(_e){}
    return oldSaveAllV78.apply(this,arguments);
  };
  const oldDoLoginV78=window.doLogin||doLogin;
  window.doLogin=doLogin=function(email){
    const r=oldDoLoginV78.apply(this,arguments);
    setTimeout(()=>{try{restoreClientPrefsV78(); saveClientPrefsV78();}catch(_e){}},380);
    setTimeout(()=>{try{restoreClientPrefsV78();}catch(_e){}},900);
    return r;
  };
  const oldLogOutV78=window.logOut||logOut;
  window.logOut=function(){try{saveClientPrefsV78();}catch(_e){} return oldLogOutV78.apply(this,arguments);};

  // Le suivi réduit ne doit apparaître QUE si le client réduit lui-même la commande.
  const oldShowMiniV78=window.showDeliveryMiniBubble||showDeliveryMiniBubble;
  window.showDeliveryMiniBubble=showDeliveryMiniBubble=function(driver,etaText){
    if(!deliveryMiniVisible){
      const b=document.getElementById('deliveryMiniBubble'); if(b)b.classList.remove('show');
      return;
    }
    return oldShowMiniV78.apply(this,arguments);
  };
  const oldStartDeliveryV78=window.startDeliveryFlow;
  if(typeof oldStartDeliveryV78==='function') window.startDeliveryFlow=function(){
    const r=oldStartDeliveryV78.apply(this,arguments);
    deliveryMiniVisible=false;
    try{hideDeliveryMiniBubble();}catch(_e){const b=document.getElementById('deliveryMiniBubble'); if(b)b.classList.remove('show');}
    return r;
  };
  const oldMinimizeV78=window.minimizeDeliveryTracking;
  window.minimizeDeliveryTracking=function(){
    deliveryMiniVisible=true;
    if(typeof oldMinimizeV78==='function') return oldMinimizeV78.apply(this,arguments);
  };

  // Maintenance : retour à un vrai écran d'alerte rouge, plus visible.
  function installMaintenanceV78(){
    let ov=document.getElementById('maintenanceOverlayV54');
    if(!ov){ov=document.createElement('div'); ov.id='maintenanceOverlayV54'; document.body.appendChild(ov);} 
    ov.innerHTML=`<div class="maintenance-card-v78"><div class="maint-alarm-v78">🚨</div><h2>Lago en maintenance</h2><p id="maintenanceMsgV54"></p><div class="small">Le service revient très vite. Merci pour votre patience.</div><button type="button" onclick="maintenanceLogoutV78()">Retour connexion</button></div>`;
  }
  window.maintenanceLogoutV78=function(){try{window.currentUser=null; window.currentDriver=null; document.getElementById('clientApp')&&(document.getElementById('clientApp').style.display='none'); document.getElementById('adminApp')&&(document.getElementById('adminApp').style.display='none'); document.getElementById('authScreen')&&(document.getElementById('authScreen').style.display='flex'); document.getElementById('maintenanceOverlayV54')?.classList.remove('show');}catch(_e){try{logOut(true);}catch(_e2){location.reload();}}};
  window.applyMaintenanceV54=function(){
    installMaintenanceV78();
    const msg=document.getElementById('maintenanceMsgV54');
    if(msg) msg.textContent=reglages.maintenanceMessage||'Lago est en mise à jour. On revient très vite.';
    const isClient=!!window.currentUser && window.currentUser.role!=='admin' && document.getElementById('clientApp')?.style.display==='block';
    const ov=document.getElementById('maintenanceOverlayV54');
    if(ov){ov.classList.toggle('show',!!reglages.maintenanceActive && isClient); ov.style.pointerEvents=(!!reglages.maintenanceActive&&isClient)?'auto':'none';}
  };

  // Générateur patron propre : notifs détaillées + matelas dynamiques + historique patron séparé.
  function productsV78(){
    const out=[];
    const add=(name,price,key,rupt)=>{ if(!rupt && Number(price)>0) out.push({name,price:Number(price),key}); };
    add('Le Solo',reglages.prixSolo,'Solo',reglages.ruptureSolo||reglages.stockSolo<=0);
    add('Le Duo',reglages.prixDuo,'Duo',reglages.ruptureDuo||reglages.stockDuo<=0);
    add('Le Gonflable',reglages.prixGonflable,'Gonflable',reglages.ruptureGonflable||reglages.stockGonflable<=0);
    add('Le Compact',reglages.prixCompact||10,'Compact',reglages.ruptureCompact||reglages.stockCompact<=0);
    add('Lit Parapluie',reglages.prixBebe,'Bebe',reglages.ruptureBebe||reglages.stockBebe<=0);
    (reglages.customMattresses||[]).forEach(m=>{ if(!m.rupture && Number(m.stock||1)>0 && Number(m.price)>0) out.push({name:m.name,price:Number(m.price),customId:m.id}); });
    return out.length?out:[{name:'Le Solo',price:Number(reglages.prixSolo)||20,key:'Solo'}];
  }
  function decrementV78(p){
    if(p.customId){const m=(reglages.customMattresses||[]).find(x=>x.id===p.customId||x.name===p.name); if(m){m.stock=Math.max(0,Number(m.stock||0)-1); m.rupture=!!m.manualRupture||m.stock<=0;}}
    else if(p.key){const s='stock'+p.key,r='rupture'+p.key,man='manualRupture'+p.key; if(typeof reglages[s]!=='number')reglages[s]=10; reglages[s]=Math.max(0,Number(reglages[s]||0)-1); reglages[r]=!!reglages[man]||reglages[s]<=0;}
    try{mettreAJourVitrine();mettreAJourVitrineAdmin();}catch(_e){}
  }
  function ensureFinanceV78(){if(!Array.isArray(reglages.businessOrders))reglages.businessOrders=[];['revenuePriorityFees','revenueServiceFees','revenueDeliveryFees','revenueMattress','driverPayoutTotal'].forEach(k=>{if(typeof reglages[k]!=='number'||isNaN(reglages[k]))reglages[k]=0;});}
  function recordFinanceV78(o){
    ensureFinanceV78(); reglages.businessOrders.unshift(o); reglages.businessOrders=reglages.businessOrders.slice(0,160);
    reglages.revenueMattress=Math.round((reglages.revenueMattress+o.itemsTotal)*100)/100;
    reglages.revenueServiceFees=Math.round((reglages.revenueServiceFees+o.serviceFee)*100)/100;
    reglages.revenueDeliveryFees=Math.round((reglages.revenueDeliveryFees+o.deliveryFee)*100)/100;
    reglages.revenuePriorityFees=Math.round((reglages.revenuePriorityFees+o.priorityFee)*100)/100;
    reglages.driverPayoutTotal=Math.round((reglages.driverPayoutTotal+o.driverPay)*100)/100;
    reglages.caTotal=Math.round((Number(reglages.caTotal||0)+Math.max(0,o.total-o.driverPay))*100)/100;
    reglages.totalOrders=(Number(reglages.totalOrders)||0)+1;
  }
  function setFinancePanelV78(){
    const set=(id,v)=>{const el=document.getElementById(id); if(el)el.textContent=money(v);};
    set('v64PriorityRevenue',reglages.revenuePriorityFees||0); set('v64ServiceRevenue',reglages.revenueServiceFees||0); set('v64DeliveryRevenue',reglages.revenueDeliveryFees||0);
  }
  function fakeClientV78(){
    const list=(fakeUsers||[]).filter(u=>Number(u.id)<999 && !u.banni);
    return list[Math.floor(Math.random()*list.length)]||null;
  }
  function randomDriverV78(vip){try{return getAvailableDriver(vip);}catch(_e){return (drivers||[]).find(d=>!d.fired&&d.status!=='Non recruté')||(drivers||[])[0];}}
  function runFakeOrderV78(){
    const u=fakeClientV78(); if(!u)return;
    const products=productsV78(); const p=products[Math.floor(Math.random()*products.length)];
    const priority=Math.random()<.25, serviceFee=2.99, deliveryFee=4.99, priorityFee=priority?2.99:0;
    const total=Math.round((p.price+serviceFee+deliveryFee+priorityFee)*100)/100;
    const driverPay=Math.round(p.price*.20*100)/100;
    const d=randomDriverV78(!!u.isVip);
    const date=new Date().toLocaleDateString('fr-FR')+' '+new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
    decrementV78(p);
    u.orders=(Number(u.orders)||0)+1; if(!Array.isArray(u.historique))u.historique=[];
    u.historique.unshift({id:Date.now()+Math.random(),date,prix:total,items:p.name,status:'Terminée',fake:true});
    if(d){d.totalOrders=(Number(d.totalOrders)||0)+1; d.earnings=Math.round((Number(d.earnings||0)+driverPay)*100)/100; d.status='En livraison 🛵';}
    const order={id:Date.now(),client:u.email,item:p.name,qty:1,date,total,itemsTotal:p.price,serviceFee,deliveryFee,priorityFee,driverPay,driver:d?d.name:'Non assigné',stockAfter:p.key?reglages['stock'+p.key]:undefined};
    recordFinanceV78(order);
    const toastBox=document.getElementById('adminToastContainer');
    if(toastBox && document.getElementById('adminApp')?.style.display==='block'){
      const notif=document.createElement('div'); notif.className='admin-toast v78-detailed-toast';
      notif.innerHTML=`<div class="toast-title">🔔 <b>${safe(u.email.split('@')[0])}</b> a commandé <b>${safe(p.name)}</b> <span>(+${money(total)})</span></div><div class="toast-lines"><span>🛵 Livré par : <b>${safe(d?d.name:'En attente')}</b></span><span>📦 Produit : ${money(p.price)} • Service : ${money(serviceFee)} • Livraison : ${money(deliveryFee)}</span>${priority?`<span>⚡ Livraison prioritaire : +${money(priorityFee)}</span>`:''}<span>💼 Part livreur : ${money(driverPay)} • Lago : ${money(Math.max(0,total-driverPay))}</span></div>`;
      toastBox.appendChild(notif); setTimeout(()=>{notif.style.opacity='0';setTimeout(()=>notif.remove(),450);},7000);
    }
    try{renderAdminDrivers();renderAdminUsers();updateAdminStats();setFinancePanelV78();saveAll();}catch(_e){try{saveAll();}catch(_e2){}}
  }
  window.startBot=function(){ if(botInterval)clearInterval(botInterval); botInterval=setInterval(runFakeOrderV78,8500); };

  // Boot doux.
  function bootV78(){
    try{restoreClientPrefsV78();}catch(_e){}
    try{installMaintenanceV78();applyMaintenanceV54();}catch(_e){}
    try{setFinancePanelV78();}catch(_e){}
    try{if(window.currentUser&&window.currentUser.role==='admin')startBot();}catch(_e){}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootV78); else bootV78();
  setTimeout(bootV78,500); setTimeout(bootV78,1500); setInterval(()=>{try{applyMaintenanceV54(); if(isClientUser())saveClientPrefsV78();}catch(_e){}},4000);
})();

/* ===== V79 — reset session total + maintenance simple stable ===== */
(function(){
  function q(id){return document.getElementById(id);} 
  function clearAllLagoStorage(){
    try{
      const keys=[];
      for(let i=0;i<localStorage.length;i++) keys.push(localStorage.key(i));
      keys.filter(k=>/^lago/i.test(k)||/lagoUber/i.test(k)||/^lago_client_prefs/i.test(k)).forEach(k=>localStorage.removeItem(k));
    }catch(_e){}
    try{
      const keys=[];
      for(let i=0;i<sessionStorage.length;i++) keys.push(sessionStorage.key(i));
      keys.filter(k=>/^lago/i.test(k)||/lagoUber/i.test(k)||/^lago_client_prefs/i.test(k)).forEach(k=>sessionStorage.removeItem(k));
    }catch(_e){}
    try{sessionStorage.removeItem(APP_STORAGE_KEY);localStorage.removeItem(LEGACY_STORAGE_KEY);}catch(_e){}
  }

  // Bouton debug : quand on demande “Réinitialiser la session”, on repart vraiment à zéro.
  window.debugResetSession=function(){
    if(!confirm('Tout réinitialiser ? Comptes clients, patron, stats, thèmes, commandes, cartes et réglages seront remis à zéro.')) return;
    clearAllLagoStorage();
    try{window.currentUser=null;window.currentDriver=null;}catch(_e){}
    try{location.replace(location.pathname+'?reset='+Date.now());}catch(_e){location.reload();}
  };
  window.resetLagoSessionHard=window.debugResetSession;

  function maintenanceMessage(){
    return (reglages&&reglages.maintenanceMessage&&String(reglages.maintenanceMessage).trim()) || 'Lago est en mise à jour. On revient très vite.';
  }
  function isClientVisible(){
    try{return !!window.currentUser && window.currentUser.role!=='admin' && window.currentUser.role!=='driver' && q('clientApp') && q('clientApp').style.display!=='none';}catch(_e){return false;}
  }
  function ensureMaintenanceV79(){
    let ov=q('maintenanceOverlayV54');
    if(!ov){ov=document.createElement('div');ov.id='maintenanceOverlayV54';document.body.appendChild(ov);} 
    ov.className='maintenance-overlay-v79';
    ov.innerHTML=`
      <div class="maintenance-card-v79">
        <div class="maintenance-top-v79"><span class="maintenance-dot-v79">!</span><span>Maintenance Lago</span></div>
        <h2>Lago revient bientôt</h2>
        <p id="maintenanceMsgV54"></p>
        <div class="maintenance-note-v79">Le service est temporairement mis en pause pour une mise à jour.</div>
        <button type="button" class="maintenance-btn-v79" onclick="maintenanceLogoutV79()">Retour connexion</button>
      </div>`;
    return ov;
  }
  window.maintenanceLogoutV79=function(){
    try{saveAll&&saveAll();}catch(_e){}
    try{window.currentUser=null;window.currentDriver=null;}catch(_e){}
    ['clientApp','adminApp','driverApp'].forEach(id=>{const el=q(id); if(el)el.style.display='none';});
    const auth=q('authScreen'); if(auth)auth.style.display='flex';
    const ov=q('maintenanceOverlayV54'); if(ov){ov.classList.remove('show');ov.style.pointerEvents='none';}
  };
  window.maintenanceLogoutV60=window.maintenanceLogoutV78=window.maintenanceLogoutV79;

  window.applyMaintenanceV79=function(){
    const ov=ensureMaintenanceV79();
    const msg=q('maintenanceMsgV54'); if(msg)msg.textContent=maintenanceMessage();
    const active=!!(reglages&&reglages.maintenanceActive) && isClientVisible();
    ov.classList.toggle('show',active);
    ov.style.pointerEvents=active?'auto':'none';
    return active;
  };
  window.applyMaintenanceV54=window.applyMaintenanceV55=window.applyMaintenanceV79;

  const oldSaveMaint=window.saveMaintenanceSettings;
  window.saveMaintenanceSettings=function(){
    const t=q('adminMaintenanceToggle'), m=q('adminMaintenanceMessage');
    if(t)reglages.maintenanceActive=!!t.checked;
    if(m)reglages.maintenanceMessage=(m.value||'Lago est en mise à jour. On revient très vite.').trim() || 'Lago est en mise à jour. On revient très vite.';
    try{saveAll();}catch(_e){try{oldSaveMaint&&oldSaveMaint();}catch(_e2){}}
    try{window.applyMaintenanceV79();}catch(_e){}
    alert(reglages.maintenanceActive?'Maintenance activée côté client.':'Maintenance désactivée.');
  };

  function bootV79(){try{ensureMaintenanceV79();window.applyMaintenanceV79();}catch(_e){}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootV79); else bootV79();
  setTimeout(bootV79,300); setTimeout(bootV79,1200); setInterval(()=>{try{window.applyMaintenanceV79();}catch(_e){}},1500);
})();

/* ===== V80 — thème général Coupe du monde côté patron (appliqué à tous les clients) ===== */
(function(){
  const EVENT_THEME_OPTIONS=[
    ['none','Aucun thème général'],
    ['worldcup-france','🏆 Coupe du monde France'],
    ['worldcup-global','⚽ Coupe du monde général']
  ];
  let pendingGeneralClientTheme=null;

  function ensureEventThemeConfig(){
    if(!reglages || typeof reglages!=='object') return;
    if(!reglages.generalClientTheme) reglages.generalClientTheme='none';
  }

  function getClientApp(){ return document.getElementById('clientApp'); }
  function isClientSession(){ return !!(window.currentUser && window.currentUser.role!=='admin' && window.currentUser.role!=='driver'); }

  function themeHintText(v){
    if(v==='worldcup-france') return 'Version France : ambiance plus claire, coq, fond stade officiel et accents bleu-blanc-rouge.';
    if(v==='worldcup-global') return 'Version générale : ambiance bleu nuit et or, ballon, fond stade officiel et contours dorés.';
    return 'Désactivé : les clients retrouvent uniquement leur thème personnel habituel.';
  }

  function updateGeneralThemeHint(v){
    const hint=document.getElementById('adminGeneralThemeHint');
    if(hint) hint.textContent=themeHintText(v);
  }

  function installAdminGlobalThemeBox(){
    if(document.getElementById('adminGlobalThemeBoxV80')) return;
    const adminThemeBox=document.getElementById('adminThemeSelect')?.closest('div[style*="margin-top:25px"]');
    if(!adminThemeBox) return;
    const box=document.createElement('div');
    box.id='adminGlobalThemeBoxV80';
    box.className='admin-global-theme-box';
    box.innerHTML=`
      <h4>🌍 Thème général</h4>
      <p>Applique un thème événement à <strong>tous les comptes clients</strong>. Le choix reste sélectionné tant que tu n'as pas cliqué sur le bouton d'application.</p>
      <select id="adminGeneralThemeSelect" class="admin-general-theme-select">
        ${EVENT_THEME_OPTIONS.map(([id,label])=>`<option value="${id}">${label}</option>`).join('')}
      </select>
      <div class="admin-general-theme-actions">
        <button type="button" id="adminGeneralThemeSaveBtn">Appliquer à tous les clients</button>
        <div id="adminGeneralThemeHint" class="admin-general-theme-hint">Deux thèmes disponibles : France et Coupe du monde générale.</div>
      </div>`;
    adminThemeBox.insertAdjacentElement('afterend',box);

    const sel=box.querySelector('#adminGeneralThemeSelect');
    const btn=box.querySelector('#adminGeneralThemeSaveBtn');
    if(sel){
      sel.addEventListener('change',()=>{
        pendingGeneralClientTheme=sel.value;
        updateGeneralThemeHint(sel.value);
      });
    }
    if(btn){
      btn.addEventListener('click',()=>{
        ensureEventThemeConfig();
        const v=(pendingGeneralClientTheme ?? sel?.value) || 'none';
        reglages.generalClientTheme=v;
        pendingGeneralClientTheme=null;
        applyClientGlobalThemeV80();
        syncAdminGlobalThemeUI();
        try{ saveAll(); }catch(_e){}
        alert(v==='none' ? 'Thème général désactivé.' : 'Thème général appliqué à tous les comptes clients.');
      });
    }
  }

  function syncAdminGlobalThemeUI(){
    ensureEventThemeConfig();
    const sel=document.getElementById('adminGeneralThemeSelect');
    if(sel){
      const nextValue=(pendingGeneralClientTheme!==null ? pendingGeneralClientTheme : (reglages.generalClientTheme || 'none'));
      if(sel.value!==nextValue) sel.value=nextValue;
      updateGeneralThemeHint(nextValue);
    }
  }

  function setEventThemeLabel(theme){
    const title=document.getElementById('lagoTitle');
    if(title) title.setAttribute('data-event-theme',theme||'none');
  }

  function reinforceClientAvatar(){
    try{
      // V82 : on protège seulement la photo principale si le thème événement la rend invisible,
      // sans forcer le sélecteur d'avatars. Comme ça tu peux toujours modifier ta photo.
      const el=document.getElementById('userAvatarImg');
      if(el){
        el.style.visibility='visible';
        el.style.opacity='1';
        el.style.filter='none';
      }
    }catch(_e){}
  }

  function applyClientGlobalThemeV80(){
    ensureEventThemeConfig();
    const app=getClientApp();
    if(!app) return;
    app.classList.remove('event-theme-france','event-theme-worldcup');
    document.body.classList.remove('body-event-theme-france','body-event-theme-worldcup');
    setEventThemeLabel('none');

    const mode=reglages.generalClientTheme || 'none';
    if(mode==='worldcup-france'){
      app.classList.add('event-theme-france');
      document.body.classList.add('body-event-theme-france');
      setEventThemeLabel('france');
    }else if(mode==='worldcup-global'){
      app.classList.add('event-theme-worldcup');
      document.body.classList.add('body-event-theme-worldcup');
      setEventThemeLabel('global');
    }
    reinforceClientAvatar();
  }

  const oldDoLoginV80=window.doLogin || doLogin;
  window.doLogin=doLogin=function(email){
    const r=oldDoLoginV80.apply(this,arguments);
    setTimeout(()=>{ try{ applyClientGlobalThemeV80(); reinforceClientAvatar(); }catch(_e){} },120);
    setTimeout(()=>{ try{ applyClientGlobalThemeV80(); reinforceClientAvatar(); }catch(_e){} },600);
    return r;
  };

  const oldSwitchClientTabV80=window.switchClientTab || switchClientTab;
  if(typeof oldSwitchClientTabV80==='function'){
    window.switchClientTab=switchClientTab=function(){
      const r=oldSwitchClientTabV80.apply(this,arguments);
      try{ applyClientGlobalThemeV80(); reinforceClientAvatar(); }catch(_e){}
      return r;
    };
  }

  const oldLogOutV80=window.logOut;
  if(typeof oldLogOutV80==='function'){
    window.logOut=function(){
      const r=oldLogOutV80.apply(this,arguments);
      try{
        pendingGeneralClientTheme=null;
        const app=getClientApp();
        if(app) app.classList.remove('event-theme-france','event-theme-worldcup');
        document.body.classList.remove('body-event-theme-france','body-event-theme-worldcup');
      }catch(_e){}
      return r;
    };
  }

  function bootV80(){
    ensureEventThemeConfig();
    installAdminGlobalThemeBox();
    syncAdminGlobalThemeUI();
    applyClientGlobalThemeV80();
    reinforceClientAvatar();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bootV80); else bootV80();
  setTimeout(bootV80,300);
  setTimeout(bootV80,1200);
  setInterval(()=>{ try{ syncAdminGlobalThemeUI(); applyClientGlobalThemeV80(); reinforceClientAvatar(); }catch(_e){} },2500);
})();


/* ===== V82 — thème général : verrouillage thème individuel + avatars modifiables ===== */
(function(){
  function globalEventActive(){
    try{return !!(reglages && reglages.generalClientTheme && reglages.generalClientTheme!=='none');}catch(_e){return false;}
  }
  function isClient(){
    try{return !!(window.currentUser && window.currentUser.role!=='admin' && window.currentUser.role!=='driver');}catch(_e){return false;}
  }
  function showThemeLockedBubble(){
    const msg='Désolé, thème individuel momentanément indisponible.';
    let b=document.getElementById('v82ThemeLockBubble');
    if(!b){
      b=document.createElement('div');
      b.id='v82ThemeLockBubble';
      b.className='v82-theme-lock-bubble';
      document.body.appendChild(b);
    }
    b.textContent=msg;
    b.classList.add('show');
    clearTimeout(window.__v82ThemeBubbleTimer);
    window.__v82ThemeBubbleTimer=setTimeout(()=>b.classList.remove('show'),2200);
  }
  function guardUserThemeSelect(){
    const sel=document.getElementById('userThemeSelect');
    if(!sel || sel.dataset.v82ThemeGuard==='1') return;
    sel.dataset.v82ThemeGuard='1';
    const stop=function(e){
      if(globalEventActive() && isClient()){
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation) e.stopImmediatePropagation();
        try{sel.blur();}catch(_e){}
        showThemeLockedBubble();
        return false;
      }
    };
    ['pointerdown','touchstart','mousedown','click','focus'].forEach(ev=>sel.addEventListener(ev,stop,true));
    sel.addEventListener('change',function(e){
      if(globalEventActive() && isClient()){
        e.preventDefault();
        e.stopPropagation();
        showThemeLockedBubble();
        try{sel.value=reglages.theme||'dark';}catch(_e){}
        return false;
      }
    },true);
  }
  function boot(){
    guardUserThemeSelect();
    const app=document.getElementById('clientApp');
    if(app){
      app.classList.toggle('event-theme-locked-personal',globalEventActive()&&isClient());
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot); else boot();
  setTimeout(boot,300); setTimeout(boot,1200); setInterval(boot,2500);
})();

/* ===== V83 — Coupe du monde : thème perso neutralisé, login propre, avatars premium immédiats ===== */
(function(){
  const PERSONAL_THEME_CLASSES=['theme-day','theme-neon','theme-black','theme-glass','rain-mode'];
  function eventActive(){
    try{return !!(reglages && reglages.generalClientTheme && reglages.generalClientTheme!=='none');}catch(_e){return false;}
  }
  function isClient(){
    try{return !!(window.currentUser && window.currentUser.role!=='admin' && window.currentUser.role!=='driver');}catch(_e){return false;}
  }
  function stripPersonalThemeClasses(){
    try{PERSONAL_THEME_CLASSES.forEach(c=>document.body.classList.remove(c));}catch(_e){}
  }
  function forceEventNightBase(){
    if(eventActive() && isClient()){
      stripPersonalThemeClasses();
      const app=document.getElementById('clientApp');
      if(app){
        app.classList.remove('theme-day','theme-neon','theme-black','theme-glass');
      }
    }
  }
  const oldApplyThemeGlobal83=window.appliquerThemeGlobal || (typeof appliquerThemeGlobal==='function'?appliquerThemeGlobal:null);
  if(typeof oldApplyThemeGlobal83==='function'){
    window.appliquerThemeGlobal=appliquerThemeGlobal=function(themeName){
      if(eventActive() && isClient()){
        stripPersonalThemeClasses();
        try{updateClientNavIndicator();}catch(_e){}
        return;
      }
      return oldApplyThemeGlobal83.apply(this,arguments);
    };
  }
  const oldApplyClientEvent83=window.applyClientGlobalThemeV80;
  // applyClientGlobalThemeV80 est dans une closure, donc on renforce par observation + hooks publics.
  function refreshEventMode(){
    try{
      if(eventActive() && isClient()){
        forceEventNightBase();
        const app=document.getElementById('clientApp');
        if(app){
          app.classList.toggle('event-theme-france',reglages.generalClientTheme==='worldcup-france');
          app.classList.toggle('event-theme-worldcup',reglages.generalClientTheme==='worldcup-global');
        }
        document.body.classList.toggle('body-event-theme-france',reglages.generalClientTheme==='worldcup-france');
        document.body.classList.toggle('body-event-theme-worldcup',reglages.generalClientTheme==='worldcup-global');
      }
    }catch(_e){}
  }
  const oldApplyThemePremium83=window.appliquerThemeEtPremium || (typeof appliquerThemeEtPremium==='function'?appliquerThemeEtPremium:null);
  if(typeof oldApplyThemePremium83==='function'){
    window.appliquerThemeEtPremium=appliquerThemeEtPremium=function(){
      if(eventActive() && isClient()){
        forceEventNightBase();
        refreshEventMode();
        try{document.getElementById('userThemeSelect').value=reglages.theme||'dark';}catch(_e){}
        return;
      }
      return oldApplyThemePremium83.apply(this,arguments);
    };
  }
  const oldLogout83=window.logOut;
  if(typeof oldLogout83==='function'){
    window.logOut=function(){
      const r=oldLogout83.apply(this,arguments);
      try{
        stripPersonalThemeClasses();
        document.body.classList.remove('body-event-theme-france','body-event-theme-worldcup');
        const app=document.getElementById('clientApp');
        if(app) app.classList.remove('event-theme-france','event-theme-worldcup');
        const auth=document.getElementById('authScreen');
        if(auth){auth.classList.remove('theme-day','theme-neon','theme-black','theme-glass');}
      }catch(_e){}
      return r;
    };
  }
  function syncPremiumUnlockedNow(){
    try{
      if(!reglages.isPremium && window.currentUser?.isVip) reglages.isPremium=true;
      document.querySelectorAll('.avatar-lock').forEach(el=>el.style.display=reglages.isPremium?'none':'flex');
      document.querySelectorAll('.premium-avatar-btn').forEach(img=>{img.style.opacity=reglages.isPremium?'1':'.45';img.style.filter=reglages.isPremium?'none':'grayscale(.65)';});
      if(typeof initAvatarsUI==='function') initAvatarsUI();
      if(typeof appliquerAvatarEtPremium==='function') appliquerAvatarEtPremium();
      document.querySelectorAll('.avatar-lock').forEach(el=>el.style.display=reglages.isPremium?'none':'flex');
      document.querySelectorAll('.premium-avatar-btn').forEach(img=>{img.style.opacity=reglages.isPremium?'1':'.45';img.style.filter=reglages.isPremium?'none':'grayscale(.65)';});
    }catch(_e){}
  }
  const oldConfirm83=window.confirmVipPurchase;
  if(typeof oldConfirm83==='function'){
    window.confirmVipPurchase=function(){
      try{ closeVipModal(); document.getElementById('referralAdModal')?.classList.remove('active'); }catch(_e){}
      openPaymentModal(59.99,()=>{
        reglages.isPremium=true;
        reglages.vipBaseBonusApplied=true;
        reglages.cagnotte=Math.max(Number(reglages.cagnotte)||0,15);
        if(Array.isArray(reglages.referrals)&&reglages.referrals.length>=3&&!reglages.referralClaimed){reglages.cagnotte=Math.round((Number(reglages.cagnotte)+15)*100)/100; reglages.referralClaimed=true;}
        reglages.caTotal=Math.round(((Number(reglages.caTotal)||0)+59.99)*100)/100;
        if(window.currentUser){
          window.currentUser.isVip=true;
          window.currentUser.vipSource='purchased';
          window.currentUser.cagnotte=reglages.cagnotte;
          window.currentUser.theme=reglages.theme;
        }
        try{addAdminActionLog('Achat Lago+',59.99);}catch(_e){}
        syncPremiumUnlockedNow();
        try{mettreAJourVitrine();}catch(_e){}
        try{updateCart();}catch(_e){}
        try{updateAdminStats();}catch(_e){}
        try{renderReferrals();}catch(_e){}
        try{saveAll();}catch(_e){}
        setTimeout(syncPremiumUnlockedNow,80);
        setTimeout(syncPremiumUnlockedNow,350);
        alert(`Bienvenue dans Lago+ 👑 ! Cagnotte disponible : ${typeof money==='function'?money(reglages.cagnotte):(Number(reglages.cagnotte).toFixed(2)+' €')}`);
      });
    };
  }
  function boot(){refreshEventMode(); syncPremiumUnlockedNow();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot); else boot();
  setTimeout(boot,300); setTimeout(boot,1200); setInterval(refreshEventMode,1200);
})();

/* ===== V84 — sélection de thème client avec vrais aperçus image ===== */
(function(){
  const THEME_STUDIO_ITEMS=[
    {id:'dark',name:'Nuit',emoji:'🌙',premium:false,color:'linear-gradient(180deg,#111827,#030712)',preview:'theme-previews/dark.png',desc:'Système sombre'},
    {id:'light',name:'Jour',emoji:'☀️',premium:false,color:'linear-gradient(180deg,#ffffff,#dbeafe)',preview:'theme-previews/light.png',desc:'Clair et propre'},
    {id:'neon',name:'Néon Bleu',emoji:'💎',premium:true,color:'linear-gradient(180deg,#071c3c,#0ea5e9)',preview:'theme-previews/neon.png',desc:'Bleu électrique Lago+'},
    {id:'black',name:'Pitch Black',emoji:'⚫',premium:true,color:'linear-gradient(180deg,#050505,#171717)',preview:'theme-previews/black.png',desc:'Noir profond'},
    {id:'glass',name:'Liquide Glace',emoji:'🧊',premium:true,color:'linear-gradient(180deg,#ecfeff,#67e8f9)',preview:'theme-previews/glass.jpg',desc:'Glace transparente'},
    {id:'aurora',name:'Aurore Lago',emoji:'🌅',premium:true,color:'linear-gradient(180deg,#fb7185,#7c3aed)',preview:'theme-previews/aurora.png',desc:'Dégradé premium'},
    {id:'titanium',name:'Titanium',emoji:'🪩',premium:true,color:'linear-gradient(180deg,#9ca3af,#111827)',preview:'theme-previews/titanium.png',desc:'Métal sobre'},
    {id:'emerald',name:'Émeraude',emoji:'💚',premium:true,color:'linear-gradient(180deg,#064e3b,#22c55e)',preview:'theme-previews/emerald.jpg',desc:'Vert profond'},
    {id:'sakura',name:'Sakura',emoji:'🌸',premium:true,color:'linear-gradient(180deg,#f9a8d4,#fff1f2)',preview:'theme-previews/sakura.jpg',desc:'Rose doux'},
    {id:'northern',name:'Aurore Boréale',emoji:'🌌',premium:true,color:'linear-gradient(180deg,#0f172a,#22d3ee,#8b5cf6)',preview:'theme-previews/northern.png',desc:'Ciel boréal'},
    {id:'luxenight',name:'Luxe Minuit',emoji:'🌙',premium:true,color:'linear-gradient(180deg,#020617,#d4af37)',preview:'theme-previews/luxenight.png',desc:'Noir & or'},
    {id:'oceanglass',name:'Océan Glass',emoji:'🌊',premium:true,color:'linear-gradient(180deg,#0e7490,#0891b2)',preview:'theme-previews/oceanglass.png',desc:'Océan moderne'},
    {id:'sunsetvelvet',name:'Sunset Velvet',emoji:'🌇',premium:true,color:'linear-gradient(180deg,#f97316,#be185d)',preview:'theme-previews/sunsetvelvet.png',desc:'Velours coucher soleil'},
    {id:'forestgold',name:'Forest Gold',emoji:'🌲',premium:true,color:'linear-gradient(180deg,#052e16,#a3e635)',preview:'theme-previews/forestgold.png',desc:'Forêt premium'},
    {id:'champagne',name:'Champagne',emoji:'🥂',premium:true,color:'linear-gradient(180deg,#fef3c7,#d4af37)',preview:'theme-previews/champagne.png',desc:'Doré élégant'}
  ];
  let selectedThemeStudioId=null;

  function premiumActive(){return !!(reglages && reglages.isPremium);}
  function eventActive(){return !!(reglages && reglages.generalClientTheme && reglages.generalClientTheme!=='none');}
  function safe(s){return String(s??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));}
  function currentTheme(){return (reglages && reglages.theme) || 'dark';}
  function itemById(id){return THEME_STUDIO_ITEMS.find(t=>t.id===id)||THEME_STUDIO_ITEMS[0];}
  function showThemeLockedBubbleV84(){
    const msg='Désolé, thème individuel momentanément indisponible.';
    let b=document.getElementById('v82ThemeLockBubble')||document.getElementById('v84ThemeToast');
    if(!b){b=document.createElement('div');b.id='v84ThemeToast';b.className='v82-theme-lock-bubble';document.body.appendChild(b);}
    b.textContent=msg;b.classList.add('show');clearTimeout(window.__v84ThemeToast);window.__v84ThemeToast=setTimeout(()=>b.classList.remove('show'),2300);
  }
  function showPremiumThemeToast(){
    let b=document.getElementById('v84ThemeToast');
    if(!b){b=document.createElement('div');b.id='v84ThemeToast';b.className='v82-theme-lock-bubble';document.body.appendChild(b);}
    b.textContent='Ce thème est réservé aux membres Lago+ 👑';b.classList.add('show');clearTimeout(window.__v84ThemeToast);window.__v84ThemeToast=setTimeout(()=>b.classList.remove('show'),2300);
  }

  function ensureThemeStudioPage(){
    if(document.getElementById('themeStudioPageV84')) return;
    const page=document.createElement('section');
    page.id='themeStudioPageV84';
    page.className='theme-studio-v84';
    page.innerHTML=`
      <div class="theme-studio-v84-header">
        <button type="button" onclick="closeThemeStudioV84()" aria-label="Retour">‹</button>
        <h2>Thèmes de l'application</h2>
        <span>•••</span>
      </div>
      <div class="theme-studio-v84-preview-wrap">
        <img id="themeStudioPreviewImgV84" class="theme-studio-v84-preview" src="" alt="Aperçu du thème Lago">
        <div id="themeStudioLockedOverlayV84" class="theme-studio-v84-lock-overlay"><b>🔒 Lago+</b><small>Abonnement requis</small></div>
      </div>
      <div class="theme-studio-v84-picker" id="themeStudioPickerV84"></div>
      <div class="theme-studio-v84-meta">
        <h3 id="themeStudioNameV84">Nuit</h3>
        <p id="themeStudioDescV84">Système sombre</p>
      </div>
      <button type="button" id="themeStudioApplyBtnV84" class="theme-studio-v84-apply" onclick="applyThemeStudioV84()">Appliquer le thème</button>
    `;
    document.body.appendChild(page);
  }
  function renderThemeStudioPicker(){
    const picker=document.getElementById('themeStudioPickerV84');
    if(!picker) return;
    picker.innerHTML=THEME_STUDIO_ITEMS.map(t=>{
      const locked=t.premium&&!premiumActive();
      const mark=t.id==='light'?'☀️':(t.id==='dark'?'🌙':'');
      return `<button type="button" class="theme-studio-v84-dot ${t.id===selectedThemeStudioId?'active':''} ${locked?'locked':''}" onclick="selectThemeStudioV84('${t.id}')" title="${safe(t.name)}"><span style="background:${safe(t.color)}"></span>${mark?`<b>${mark}</b>`:''}${locked?'<em>🔒</em>':''}</button>`;
    }).join('');
  }
  function updateThemeStudioPreview(){
    const item=itemById(selectedThemeStudioId||currentTheme());
    selectedThemeStudioId=item.id;
    const img=document.getElementById('themeStudioPreviewImgV84');
    const name=document.getElementById('themeStudioNameV84');
    const desc=document.getElementById('themeStudioDescV84');
    const lock=document.getElementById('themeStudioLockedOverlayV84');
    const btn=document.getElementById('themeStudioApplyBtnV84');
    const locked=item.premium&&!premiumActive();
    if(img) img.src=item.preview;
    if(name) name.textContent=(item.premium?'👑 ':'')+item.name;
    if(desc) desc.textContent=locked?'Disponible avec Lago+':item.desc;
    if(lock) lock.classList.toggle('show',locked);
    if(btn){
      btn.textContent=locked?'Réservé Lago+':'Appliquer le thème';
      btn.classList.toggle('locked',locked);
    }
    renderThemeStudioPicker();
  }

  window.openThemeStudioV84=function(){
    if(eventActive()) return showThemeLockedBubbleV84();
    ensureThemeStudioPage();
    selectedThemeStudioId=currentTheme();
    if(!THEME_STUDIO_ITEMS.some(t=>t.id===selectedThemeStudioId)) selectedThemeStudioId='dark';
    renderThemeStudioPicker();
    updateThemeStudioPreview();
    const page=document.getElementById('themeStudioPageV84');
    page?.classList.add('active');
  };
  window.closeThemeStudioV84=function(){
    document.getElementById('themeStudioPageV84')?.classList.remove('active');
  };
  window.selectThemeStudioV84=function(id){
    selectedThemeStudioId=id;
    updateThemeStudioPreview();
  };
  window.applyThemeStudioV84=function(){
    const item=itemById(selectedThemeStudioId||currentTheme());
    if(item.premium&&!premiumActive()) return showPremiumThemeToast();
    reglages.theme=item.id;
    const sel=document.getElementById('userThemeSelect');
    if(sel) sel.value=item.id;
    try{appliquerThemeEtPremium();}catch(_e){try{appliquerThemeGlobal(item.id);}catch(_e2){}}
    try{saveAll();}catch(_e){}
    closeThemeStudioV84();
  };

  function installThemeButton(){
    const sel=document.getElementById('userThemeSelect');
    if(!sel) return;
    const row=sel.closest('div');
    if(!row || document.getElementById('themeStudioOpenBtnV84')) return;
    sel.style.display='none';
    const btn=document.createElement('button');
    btn.type='button';
    btn.id='themeStudioOpenBtnV84';
    btn.className='theme-studio-open-v84';
    btn.textContent='Choisir un thème';
    btn.onclick=function(e){e.preventDefault();e.stopPropagation();openThemeStudioV84();};
    row.appendChild(btn);
  }
  function syncButtonLabel(){
    const btn=document.getElementById('themeStudioOpenBtnV84');
    if(!btn) return;
    const item=itemById(currentTheme());
    btn.innerHTML=`<span>${item.emoji}</span> ${safe(item.name)}`;
    if(eventActive()) btn.innerHTML='<span>🏆</span> Thème événement actif';
  }
  function boot(){
    installThemeButton();
    ensureThemeStudioPage();
    syncButtonLabel();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
  setTimeout(boot,300);setTimeout(boot,1200);setInterval(()=>{try{installThemeButton();syncButtonLabel();}catch(_e){}},2000);
})();

/* ===== V87 — theme studio: sauvegarde exacte par compte + stop fallback Champagne ===== */
(function(){
  const VALID_CLIENT_THEMES=new Set(['dark','light','neon','black','glass','aurora','titanium','emerald','sakura','northern','luxenight','oceanglass','sunsetvelvet','forestgold','champagne']);
  const DEFAULT_THEME='dark';
  function isClient(){try{return !!(window.currentUser && window.currentUser.role!=='admin' && window.currentUser.role!=='driver');}catch(_e){return false;}}
  function emailKey(){return String(window.currentUser?.email||'').toLowerCase();}
  function key(){return 'lago_client_selected_theme_v87_'+emailKey();}
  function eventActive(){try{return !!(reglages && reglages.generalClientTheme && reglages.generalClientTheme!=='none');}catch(_e){return false;}}
  function premiumActive(){try{return !!(reglages.isPremium || window.currentUser?.isVip);}catch(_e){return false;}}
  function isPremiumTheme(t){return !['dark','light'].includes(t);}
  function cleanTheme(t){t=String(t||DEFAULT_THEME);return VALID_CLIENT_THEMES.has(t)?t:DEFAULT_THEME;}
  function persistTheme(t){
    if(!isClient())return;
    t=cleanTheme(t);
    if(isPremiumTheme(t)&&!premiumActive()) t=DEFAULT_THEME;
    try{localStorage.setItem(key(),t);}catch(_e){}
    try{window.currentUser.theme=t;}catch(_e){}
    try{const u=(fakeUsers||[]).find(x=>String(x.email).toLowerCase()===emailKey()); if(u)u.theme=t;}catch(_e){}
    try{reglages.theme=t;}catch(_e){}
  }
  function readTheme(){
    if(!isClient()) return cleanTheme(reglages?.theme);
    let t=null;
    try{t=localStorage.getItem(key());}catch(_e){}
    if(!t){try{t=(fakeUsers||[]).find(x=>String(x.email).toLowerCase()===emailKey())?.theme;}catch(_e){}}
    if(!t){try{t=window.currentUser?.theme;}catch(_e){}}
    t=cleanTheme(t||reglages?.theme||DEFAULT_THEME);
    if(isPremiumTheme(t)&&!premiumActive()) t=DEFAULT_THEME;
    return t;
  }
  function applySavedTheme(){
    if(!isClient()) return;
    const t=readTheme();
    reglages.theme=t;
    if(window.currentUser) window.currentUser.theme=t;
    const sel=document.getElementById('userThemeSelect'); if(sel) sel.value=t;
    if(!eventActive()){
      try{appliquerThemeGlobal(t);}catch(_e){}
      try{updateClientNavIndicator();}catch(_e){}
    }
  }
  const oldApplyStudio=window.applyThemeStudioV84;
  window.applyThemeStudioV84=function(){
    const before=reglages?.theme||DEFAULT_THEME;
    if(typeof oldApplyStudio==='function') oldApplyStudio.apply(this,arguments);
    setTimeout(()=>{try{persistTheme(reglages.theme||before); applySavedTheme();}catch(_e){}},30);
    setTimeout(()=>{try{persistTheme(reglages.theme||before); applySavedTheme();}catch(_e){}},220);
  };
  const oldSelectStudio=window.selectThemeStudioV84;
  window.selectThemeStudioV84=function(id){
    if(typeof oldSelectStudio==='function') return oldSelectStudio.apply(this,arguments);
  };
  const oldDoLogin=window.doLogin||doLogin;
  window.doLogin=doLogin=function(){
    const r=oldDoLogin.apply(this,arguments);
    setTimeout(()=>{try{applySavedTheme();}catch(_e){}},180);
    setTimeout(()=>{try{applySavedTheme();}catch(_e){}},650);
    setTimeout(()=>{try{applySavedTheme();}catch(_e){}},1300);
    return r;
  };
  const oldLogOut=window.logOut;
  if(typeof oldLogOut==='function'){
    window.logOut=function(){
      try{if(isClient()) persistTheme(reglages.theme||readTheme());}catch(_e){}
      return oldLogOut.apply(this,arguments);
    };
  }
  const oldSave=window.saveAll||saveAll;
  window.saveAll=saveAll=function(){
    try{if(isClient()) persistTheme(reglages.theme||readTheme());}catch(_e){}
    return oldSave.apply(this,arguments);
  };
  // Évite qu'une valeur résiduelle du sélecteur caché (souvent Champagne) écrase le vrai choix.
  setInterval(()=>{try{if(isClient()&&!eventActive()) applySavedTheme();}catch(_e){}},3500);
})();



/* ===== V88 — theme studio finition UI + anti-flash Champagne ===== */
(function(){
  const VALID=new Set(['dark','light','neon','black','glass','aurora','titanium','emerald','sakura','northern','luxenight','oceanglass','sunsetvelvet','forestgold','champagne']);
  const COLORS={
    dark:'linear-gradient(180deg,#070707,#111827)',
    light:'linear-gradient(180deg,#f8fbff,#dbeafe)',
    neon:'linear-gradient(180deg,#031a35,#075985,#0ea5e9)',
    black:'linear-gradient(180deg,#000,#101010)',
    glass:'linear-gradient(180deg,#e8ffff,#6ee7f9)',
    aurora:'linear-gradient(180deg,#4c1d95,#be185d,#fb7185)',
    titanium:'linear-gradient(180deg,#0f172a,#64748b,#111827)',
    emerald:'linear-gradient(180deg,#011f17,#064e3b,#22c55e)',
    sakura:'linear-gradient(180deg,#fff1f8,#f9a8d4,#831843)',
    northern:'linear-gradient(180deg,#020617,#0f766e,#7c3aed)',
    luxenight:'linear-gradient(180deg,#020617,#18181b,#d4af37)',
    oceanglass:'linear-gradient(180deg,#041f2b,#0e7490,#67e8f9)',
    sunsetvelvet:'linear-gradient(180deg,#3b0a22,#be185d,#f97316)',
    forestgold:'linear-gradient(180deg,#02140b,#14532d,#a3e635)',
    champagne:'linear-gradient(180deg,#16100a,#5a3f19,#d4af37)'
  };
  const NAME_TO_ID={
    'nuit':'dark','jour':'light','néon bleu':'neon','neon bleu':'neon','pitch black':'black',
    'liquide glace':'glass','aurore lago':'aurora','titanium':'titanium','émeraude':'emerald','emeraude':'emerald',
    'sakura':'sakura','aurore boréale':'northern','aurore boreale':'northern','luxe minuit':'luxenight',
    'océan glass':'oceanglass','ocean glass':'oceanglass','sunset velvet':'sunsetvelvet','forest gold':'forestgold','champagne':'champagne'
  };
  function isClient(){try{return !!(window.currentUser && window.currentUser.role!=='admin' && window.currentUser.role!=='driver');}catch(_e){return false;}}
  function emailOf(x){return String(x||window.currentUser?.email||'').toLowerCase();}
  function finalKey(email){return 'lago_client_theme_v88_final_'+emailOf(email);}
  function eventActive(){try{return !!(reglages && reglages.generalClientTheme && reglages.generalClientTheme!=='none');}catch(_e){return false;}}
  function premiumActive(){try{return !!(reglages.isPremium || window.currentUser?.isVip);}catch(_e){return false;}}
  function clean(t){
    t=String(t||'dark');
    if(!VALID.has(t)) t='dark';
    if(!premiumActive() && !['dark','light'].includes(t)) t='dark';
    return t;
  }
  function idFromStudio(){
    const img=document.getElementById('themeStudioPreviewImgV84');
    const src=String(img?.getAttribute('src')||'');
    const base=(src.split('/').pop()||'').split('.')[0];
    const fileMap={dark:'dark',light:'light',neon:'neon',black:'black',glass:'glass',aurora:'aurora',titanium:'titanium',emerald:'emerald',sakura:'sakura',northern:'northern',luxenight:'luxenight',oceanglass:'oceanglass',sunsetvelvet:'sunsetvelvet',forestgold:'forestgold',champagne:'champagne'};
    if(fileMap[base]) return fileMap[base];
    let n=String(document.getElementById('themeStudioNameV84')?.textContent||'').replace('👑','').trim().toLowerCase();
    return NAME_TO_ID[n]||clean(reglages?.theme);
  }
  function storeTheme(t,email){
    if(!emailOf(email) && !isClient()) return;
    t=clean(t);
    try{localStorage.setItem(finalKey(email),t);}catch(_e){}
    try{ if(isClient()) window.currentUser.theme=t; }catch(_e){}
    try{
      const u=(fakeUsers||[]).find(x=>String(x.email).toLowerCase()===emailOf(email));
      if(u) u.theme=t;
    }catch(_e){}
    try{ if(isClient()) reglages.theme=t; }catch(_e){}
  }
  function readTheme(email){
    let t=null;
    try{t=localStorage.getItem(finalKey(email));}catch(_e){}
    if(!t){try{t=(fakeUsers||[]).find(x=>String(x.email).toLowerCase()===emailOf(email))?.theme;}catch(_e){}}
    if(!t){try{t=window.currentUser?.theme;}catch(_e){}}
    if(!t){try{t=reglages?.theme;}catch(_e){}}
    return clean(t);
  }
  function applyTheme(t){
    t=clean(t);
    try{reglages.theme=t;}catch(_e){}
    try{if(window.currentUser) window.currentUser.theme=t;}catch(_e){}
    const sel=document.getElementById('userThemeSelect');
    if(sel) sel.value=t;
    if(!eventActive()){
      try{appliquerThemeGlobal(t);}catch(_e){}
      try{updateClientNavIndicator();}catch(_e){}
    }
  }
  function restoreTheme(email){
    if(!isClient() && !email) return;
    const t=readTheme(email);
    applyTheme(t);
  }
  function polishStudio(){
    const page=document.getElementById('themeStudioPageV84');
    if(!page) return;
    const id=idFromStudio();
    page.dataset.theme=id;
    page.style.background=COLORS[id]||COLORS.dark;
    const dots=page.querySelector('.theme-studio-v84-header span');
    if(dots) dots.style.display='none';
    const img=document.getElementById('themeStudioPreviewImgV84');
    if(img){
      img.style.objectPosition=(id==='dark')?'center 34%':'center 38%';
    }
  }
  const oldOpen=window.openThemeStudioV84;
  window.openThemeStudioV84=function(){
    const r=oldOpen?.apply(this,arguments);
    setTimeout(polishStudio,30);
    setTimeout(polishStudio,150);
    return r;
  };
  const oldSelect=window.selectThemeStudioV84;
  window.selectThemeStudioV84=function(id){
    const r=oldSelect?.apply(this,arguments);
    setTimeout(polishStudio,20);
    return r;
  };
  const oldApply=window.applyThemeStudioV84;
  window.applyThemeStudioV84=function(){
    const chosen=idFromStudio();
    const r=oldApply?.apply(this,arguments);
    setTimeout(()=>{try{storeTheme(chosen);applyTheme(chosen);}catch(_e){}},10);
    setTimeout(()=>{try{storeTheme(chosen);applyTheme(chosen);}catch(_e){}},160);
    return r;
  };
  const oldDoLogin=window.doLogin||doLogin;
  window.doLogin=doLogin=function(email){
    const wanted=readTheme(email);
    try{reglages.theme=wanted;}catch(_e){}
    const r=oldDoLogin.apply(this,arguments);
    setTimeout(()=>{try{storeTheme(wanted,email);restoreTheme(email);}catch(_e){}},0);
    setTimeout(()=>{try{storeTheme(wanted,email);restoreTheme(email);}catch(_e){}},120);
    setTimeout(()=>{try{restoreTheme(email);}catch(_e){}},500);
    return r;
  };
  const oldLogOut=window.logOut;
  if(typeof oldLogOut==='function'){
    window.logOut=function(){
      try{ if(isClient()) storeTheme(reglages.theme||readTheme()); }catch(_e){}
      const r=oldLogOut.apply(this,arguments);
      try{ document.body.classList.remove('theme-glass','theme-day','theme-neon','theme-black','theme-aurora','theme-titanium','theme-emerald','theme-sakura','theme-northern','theme-luxenight','theme-oceanglass','theme-sunsetvelvet','theme-forestgold','theme-champagne'); }catch(_e){}
      return r;
    };
  }
  const oldSave=window.saveAll||saveAll;
  window.saveAll=saveAll=function(){
    try{ if(isClient()) storeTheme(reglages.theme||readTheme()); }catch(_e){}
    return oldSave.apply(this,arguments);
  };
  setInterval(()=>{try{ if(isClient() && !eventActive()) restoreTheme(); polishStudio(); }catch(_e){}},1800);
  setTimeout(polishStudio,400);
})();

/* ===== V89 — theme studio final: base nuit fixe + anti-flash Champagne ===== */
(function(){
  const VALID=new Set(['dark','light','neon','black','glass','aurora','titanium','emerald','sakura','northern','luxenight','oceanglass','sunsetvelvet','forestgold','champagne']);
  const PREMIUM=new Set(['neon','black','glass','aurora','titanium','emerald','sakura','northern','luxenight','oceanglass','sunsetvelvet','forestgold','champagne']);
  function isClient(){try{return !!(window.currentUser && window.currentUser.role!=='admin' && window.currentUser.role!=='driver');}catch(_e){return false;}}
  function email(){return String(window.currentUser?.email||'').toLowerCase();}
  function key(e=email()){return 'lago_client_theme_v89_locked_'+String(e||'').toLowerCase();}
  function premium(){try{return !!(reglages?.isPremium || window.currentUser?.isVip);}catch(_e){return false;}}
  function clean(t){t=String(t||'dark'); if(!VALID.has(t)) t='dark'; if(PREMIUM.has(t)&&!premium()) t='dark'; return t;}
  function eventActive(){try{return !!(reglages && reglages.generalClientTheme && reglages.generalClientTheme!=='none');}catch(_e){return false;}}
  function readStored(e=email()){
    let t=null;
    try{t=localStorage.getItem(key(e));}catch(_e){}
    if(!t){try{t=localStorage.getItem('lago_client_theme_v88_final_'+String(e||'').toLowerCase());}catch(_e){}}
    if(!t){try{t=localStorage.getItem('lago_client_selected_theme_v87_'+String(e||'').toLowerCase());}catch(_e){}}
    if(!t){try{t=(fakeUsers||[]).find(u=>String(u.email).toLowerCase()===String(e||'').toLowerCase())?.theme;}catch(_e){}}
    if(!t && String(e||'').toLowerCase()===email()){try{t=window.currentUser?.theme||reglages?.theme;}catch(_e){}}
    return clean(t);
  }
  function store(t,e=email()){
    t=clean(t);
    if(!e) return t;
    try{localStorage.setItem(key(e),t);}catch(_e){}
    try{localStorage.setItem('lago_client_theme_v88_final_'+String(e).toLowerCase(),t);}catch(_e){}
    try{localStorage.setItem('lago_client_selected_theme_v87_'+String(e).toLowerCase(),t);}catch(_e){}
    try{const u=(fakeUsers||[]).find(x=>String(x.email).toLowerCase()===String(e).toLowerCase()); if(u)u.theme=t;}catch(_e){}
    if(String(e).toLowerCase()===email()){
      try{window.currentUser.theme=t;}catch(_e){}
      try{reglages.theme=t;}catch(_e){}
    }
    return t;
  }
  function selectedFromStudio(){
    try{
      const img=document.getElementById('themeStudioPreviewImgV84');
      const base=(String(img?.getAttribute('src')||'').split('/').pop()||'').split('.')[0];
      const map={dark:'dark',light:'light',neon:'neon',black:'black',glass:'glass',aurora:'aurora',titanium:'titanium',emerald:'emerald',sakura:'sakura',northern:'northern',luxenight:'luxenight',oceanglass:'oceanglass',sunsetvelvet:'sunsetvelvet',forestgold:'forestgold',champagne:'champagne'};
      if(map[base]) return clean(map[base]);
    }catch(_e){}
    return clean(reglages?.theme);
  }
  function apply(t){
    if(!isClient()) return;
    t=clean(t);
    try{reglages.theme=t;}catch(_e){}
    try{window.currentUser.theme=t;}catch(_e){}
    try{const sel=document.getElementById('userThemeSelect'); if(sel)sel.value=t;}catch(_e){}
    if(!eventActive()){
      try{window.__v89ApplyingTheme=t; appliquerThemeGlobal(t);}catch(_e){}
      try{updateClientNavIndicator();}catch(_e){}
      setTimeout(()=>{try{window.__v89ApplyingTheme=null;}catch(_e){}},80);
    }
  }
  function stabilize(e=email(),times=10){
    const t=readStored(e);
    store(t,e);
    for(let i=0;i<times;i++) setTimeout(()=>apply(t),i*90);
  }

  const oldGlobal=window.appliquerThemeGlobal || (typeof appliquerThemeGlobal==='function'?appliquerThemeGlobal:null);
  if(typeof oldGlobal==='function'){
    window.appliquerThemeGlobal=appliquerThemeGlobal=function(t){
      try{
        if(isClient() && !eventActive()){
          const intended=readStored();
          if(String(t)==='champagne' && intended!=='champagne' && !window.__v89ApplyingTheme) t=intended;
        }
      }catch(_e){}
      return oldGlobal.apply(this,arguments.length?[t]:arguments);
    };
  }

  const oldApply=window.applyThemeStudioV84;
  window.applyThemeStudioV84=function(){
    const chosen=selectedFromStudio();
    store(chosen);
    try{window.__v89ApplyingTheme=chosen;}catch(_e){}
    const r=oldApply?.apply(this,arguments);
    setTimeout(()=>{store(chosen);apply(chosen);},20);
    setTimeout(()=>{store(chosen);apply(chosen);},180);
    setTimeout(()=>{try{window.__v89ApplyingTheme=null;}catch(_e){}},260);
    return r;
  };
  const oldDoLogin=window.doLogin||doLogin;
  window.doLogin=doLogin=function(emailArg){
    const e=String(emailArg||arguments[0]||'').toLowerCase();
    const wanted=readStored(e);
    try{reglages.theme=wanted;}catch(_e){}
    const r=oldDoLogin.apply(this,arguments);
    setTimeout(()=>stabilize(e,16),0);
    setTimeout(()=>stabilize(e,12),500);
    return r;
  };
  const oldLogOut=window.logOut;
  if(typeof oldLogOut==='function'){
    window.logOut=function(){
      try{if(isClient()) store(reglages?.theme||readStored());}catch(_e){}
      return oldLogOut.apply(this,arguments);
    };
  }
  const oldSave=window.saveAll||saveAll;
  window.saveAll=saveAll=function(){
    try{if(isClient()) store(reglages?.theme||readStored());}catch(_e){}
    return oldSave.apply(this,arguments);
  };
  function polish(){
    const page=document.getElementById('themeStudioPageV84');
    if(!page) return;
    page.style.background='#080808';
    page.classList.add('v89-base-night');
    const img=document.getElementById('themeStudioPreviewImgV84');
    const id=selectedFromStudio();
    if(img) img.style.objectPosition=(id==='dark')?'center 50%':'center 38%';
  }
  const oldOpen=window.openThemeStudioV84;
  window.openThemeStudioV84=function(){const r=oldOpen?.apply(this,arguments);setTimeout(polish,20);setTimeout(polish,160);return r;};
  const oldSelect=window.selectThemeStudioV84;
  window.selectThemeStudioV84=function(){const r=oldSelect?.apply(this,arguments);setTimeout(polish,20);return r;};
  setInterval(()=>{try{if(isClient()&&!eventActive()) stabilize(email(),1); polish();}catch(_e){}},1200);
})();
