const nextButton = document.querySelector('.next-btn');
const video = document.querySelector('.hero-video');


const movieList = ['Vids/hero-1.mp4','Vids/hero-2.mp4','Vids/hero-3.mp4','Vids/hero-4.mp4',]

let index = 0;
nextButton.addEventListener('click', function(){

  index += 1
  video.src = movieList[index];

  if(index === 3){
    index = -1;
  }
})


// PRODUCT SECTION

// ---- Demo data for packages ----
    const packs = [
      { id: 'p05', label: '💎 05 Diamonds', diamonds: 5, price: 15, tag: 'Popular' },
      { id: 'p42', label: '💎 42 Diamonds', diamonds: 42, price: 78, tag: 'Value' },
      { id: 'p88', label: '💎 88 Diamonds', diamonds: 88, price: 144 },
      { id: 'p105', label: '💎 105 Diamonds', diamonds: 105, price: 179, tag: 'Best Seller' },
      { id: 'p218', label: '💎 218 Diamonds', diamonds: 218, price: 326 },
      { id: 'pPass', label: '🎫 Starlight Pass', diamonds: 720, price: 720 }
    ];

    const el = {
      userId: document.getElementById('userId'),
      regionId: document.getElementById('regionId'),
      validateBtn: document.getElementById('validateBtn'),
      validationMsg: document.getElementById('validationMsg'),
      packages: document.getElementById('packages'),
      payBtn: document.getElementById('payBtn'),
      resetBtn: document.getElementById('resetBtn'),
      payments: document.getElementById('payments'),

      // summary ids

      sumPlayer: document.getElementById('sumPlayer'),
      sumRegion: document.getElementById('sumRegion'),
      sumPack: document.getElementById('sumPack'),
      sumPrice: document.getElementById('sumPrice'),
      sumFee: document.getElementById('sumFee'),
      sumTotal: document.getElementById('sumTotal'),
      // steps for state highlighting
      step1: document.getElementById('step-1'),
      step2: document.getElementById('step-2'),
      step3: document.getElementById('step-3'),
      step4: document.getElementById('step-4'),
    };

    let state = {
      validated: false,
      selectedPack: null,
      paymentMethod: null,
    };

    // Render packages
    function renderPackages(){
      el.packages.innerHTML = packs.map(p => `
        <div class="pack" data-pack="${p.id}">
          ${p.tag ? `<span class="tag">${p.tag}</span>` : ''}
          <h4>${p.label}</h4>
          <div class="price">₹${p.price}</div>
        </div>
      `).join('');

      // Add click events
      [...el.packages.querySelectorAll('.pack')].forEach(card => {
        card.addEventListener('click', () => {
          selectPack(card.dataset.pack);
        });
      });
    }

    function formatINR(n){
      return '₹' + (Math.round(n)).toLocaleString('en-IN');
    }

    // Calculate fee = 2% + ₹5 (demo)
    function calcFee(price){
      return Math.round(price * 0.02) + 5;
    }

    function updateSummary(){
      const uid = el.userId.value.trim() || '—';
      const rid = el.regionId.value.trim() || '—';
      el.sumPlayer.textContent = uid;
      el.sumRegion.textContent = rid;

      if(state.selectedPack){
        el.sumPack.textContent = state.selectedPack.label;
        el.sumPrice.textContent = formatINR(state.selectedPack.price);
        const fee = calcFee(state.selectedPack.price);
        el.sumFee.textContent = formatINR(fee);
        el.sumTotal.textContent = formatINR(state.selectedPack.price + fee);
        // Step highlight
        el.step2.classList.add('active');
        el.step3.classList.add('active');
      } else {
        el.sumPack.textContent = 'Select a pack';
        el.sumPrice.textContent = '₹0';
        el.sumFee.textContent = '₹0';
        el.sumTotal.textContent = '₹0';
        el.step3.classList.remove('active');
      }

      // Enable pay button only when ready
      const canPay = state.validated && state.selectedPack && state.paymentMethod;
      el.payBtn.disabled = !canPay;
    }

    function selectPack(packId){
      // visual
      [...el.packages.children].forEach(c => c.classList.remove('active'));
      const picked = packs.find(p => p.id === packId) || null;
      const card = el.packages.querySelector(`[data-pack="${packId}"]`);
      if(card) card.classList.add('active');
      state.selectedPack = picked;
      updateSummary();
    }

    // Validate action
    el.validateBtn.addEventListener('click', () => {
      const uid = el.userId.value.trim();
      const rid = el.regionId.value.trim();
      if(!uid || !rid){
        state.validated = false;
        el.validationMsg.innerHTML = '<span class="err">Enter both User ID and Region ID to validate ❌</span>';
        el.step1.classList.add('active');
        updateSummary();
        return;
      }
      // Demo: Mark as validated
      state.validated = true;
      el.validationMsg.innerHTML = '<span class="ok">Validated ✔️</span> Player ready for top‑up.';
      // Move highlight to next step
      el.step1.classList.add('active');
      el.step2.classList.add('active');
      updateSummary();
    });

    // Payment select
    el.payments.addEventListener('click', (e) => {
      const card = e.target.closest('.paycard');
      if(!card) return;
      [...el.payments.children].forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.paymentMethod = card.dataset.method; // 'wallet' or 'upi'
      el.step4.classList.add('active');
      updateSummary();
    });

    // Proceed to Pay (demo)
    el.payBtn.addEventListener('click', () => {
      const { selectedPack, paymentMethod } = state;
      const msg = `Paying ${formatINR(selectedPack.price)} + fees via ${paymentMethod === 'wallet' ? 'Fuel Wallet' : 'UPI App'} for ${selectedPack.label}\nUser: ${el.userId.value.trim()} | Region: ${el.regionId.value.trim()}`;
      alert(msg);
    });

    // Reset
    el.resetBtn.addEventListener('click', () => {
      state = { validated:false, selectedPack:null, paymentMethod:null };
      el.userId.value = '';
      el.regionId.value = '';
      el.validationMsg.textContent = 'Not validated yet.';
      [...el.packages.children].forEach(c => c.classList.remove('active'));
      [...el.payments.children].forEach(c => c.classList.remove('active'));
      el.step1.classList.add('active');
      el.step2.classList.remove('active');
      el.step3.classList.remove('active');
      el.step4.classList.remove('active');
      updateSummary();
    });

    // Init
    renderPackages();
    // Auto-select first pack to satisfy your specific request
    selectPack('p100');
    updateSummary();