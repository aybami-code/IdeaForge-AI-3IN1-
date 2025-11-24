// script.js (module)
// Main app logic: renders header/footer, handles UI interactions,
// calls the AI (placeholder), and fills the tabs with results.
//
// NOTES:
// - To enable OpenAI calls, set window.OPENAI_API_KEY = "sk-...";
//   or modify callOpenAI() to fetch with your server.
// - This file uses only front-end code and handles errors gracefully.

import { renderHeader } from './header.js';
import { renderFooter } from './footer.js';

renderHeader();
renderFooter();

const userInput = document.getElementById('userInput');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const themeToggle = document.getElementById('themeToggle');

const tabs = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.tab-panel');

let lastGenerated = { niche: '', idea: '', mvp: '' };

// TAB SWITCHING
tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabs.forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('aria-selected', b === btn); });
    panels.forEach(p => {
      if (p.id === target) {
        p.hidden = false;
        p.classList.add('fade-in');
        p.classList.add('active');
      } else {
        p.hidden = true;
        p.classList.remove('fade-in');
        p.classList.remove('active');
      }
    });
  });
});

// THEME TOGGLE
themeToggle.addEventListener('click', () => {
  const body = document.body;
  const isLight = body.classList.toggle('theme-light');
  themeToggle.setAttribute('aria-pressed', String(isLight));
});

// COPY LAST RESULT
copyBtn.addEventListener('click', async () => {
  const combined = `Niche:\n${lastGenerated.niche}\n\nIdea:\n${lastGenerated.idea}\n\nMVP:\n${lastGenerated.mvp}`;
  try {
    await navigator.clipboard.writeText(combined);
    showToast('Copied result to clipboard');
    confettiBurst();
  } catch (e) {
    showToast('Copy failed');
  }
});

// GENERATE HANDLER
generateBtn.addEventListener('click', async () => {
  const prompt = (userInput.value || '').trim();
  if (!prompt) {
    userInput.focus();
    showToast('Please enter a niche or market to analyze');
    return;
  }

  setGenerating(true);
  try {
    // call the AI generator (placeholder)
    const response = await generateAll(prompt);
    // populate tabs progressively
    fillPanel('niche', response.niche);
    fillPanel('idea', response.idea);
    fillPanel('mvp', response.mvp);

    lastGenerated = response;
    // switch to first tab
    document.querySelector('.tab-btn[data-tab="niche"]').click();
    confettiBurst();
  } catch (err) {
    console.error(err);
    showToast('Generation failed. See console for details');
  } finally {
    setGenerating(false);
  }
});

function fillPanel(id, content) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'result-wrapper';
  wrapper.innerHTML = contentToHTML(content);
  el.appendChild(wrapper);
  // graceful reveal animation
  wrapper.classList.add('fade-in');
}

function contentToHTML(content){
  // expects content sections as markdown-like object or simple string
  // If content is plain text, escape and wrap in <pre>
  if (!content) return '<div style="color:var(--muted)">No content</div>';

  if (typeof content === 'string') {
    const escaped = escapeHtml(content);
    // convert simple headings to bold lines for readability
    return `<pre style="white-space:pre-wrap;font-family:inherit">${escaped}</pre>`;
  }

  // If content is structured object, render nicely (not used by placeholder)
  return `<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(JSON.stringify(content, null, 2))}</pre>`;
}

function escapeHtml(s){
  return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

// ----- UI helpers -----
function setGenerating(val){
  generateBtn.disabled = val;
  if (val) generateBtn.textContent = 'Generating…';
  else generateBtn.textContent = 'Generate';
}

function showToast(msg){
  // minimal toast
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.position='fixed';
  t.style.bottom='20px';
  t.style.left='50%';
  t.style.transform='translateX(-50%)';
  t.style.background='rgba(0,0,0,0.7)';
  t.style.color='white';
  t.style.padding='10px 14px';
  t.style.borderRadius='8px';
  t.style.zIndex=9999;
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 2600);
}

// ----- Simple confetti burst (respects reduced-motion) -----
function confettiBurst(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // small DOM-based confetti (keeps simple and small)
  const colors = ['#6E5BFF','#00C4FF','#22C55E','#FFD166'];
  const count = 12;
  for (let i=0;i<count;i++){
    const el = document.createElement('div');
    el.style.position='fixed';
    el.style.left = `${50 + (Math.random()-0.5)*20}%`;
    el.style.top = '40%';
    el.style.width='8px';
    el.style.height='12px';
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.borderRadius='2px';
    el.style.zIndex='9999';
    el.style.transform = `translateY(0) rotate(${Math.random()*360}deg)`;
    document.body.appendChild(el);
    // animate
    el.animate([
      { transform: 'translateY(0) scale(1)', opacity:1 },
      { transform: `translateY(${120 + Math.random()*80}px) translateX(${(Math.random()-0.5)*200}px) scale(0.8)`, opacity:0 }
    ], { duration: 900 + Math.random()*300, easing: 'cubic-bezier(.2,.9,.3,1)'});
    setTimeout(()=> el.remove(), 1500);
  }
}

// ----- AI call (placeholder) -----
// This function returns an object: {niche: string, idea: string, mvp: string}
// Replace with your own AI or wire OpenAI key on server for security.
async function generateAll(userText){
  // Basic local pseudo-generator fallback (so UI works without API)
  // It intentionally provides structured, non-repetitive results when offline.
  // If you want real LLM output, replace this implementation with callOpenAI() below.

  // Quick local deterministic pseudo-generation (for demo)
  const niche = `Niche suggestion for "${userText}"\n\n1) Micro-niche: ${userText} for freelance designers\n - Why: Frequent need for instant templates and workflow.\n - Pain points: time-to-first-draft, messy handoffs.`;

  const idea = `Product idea: "Sketch-to-Site TinyKit"\n\nDescription: A one-page tool that generates landing page HTML/Tailwind sections for micro-SaaS ideas. Target: indie makers & contractors.\nUnique angle: Export-ready bundles and copy templates.\nRevenue: one-time license + paid templates.`;

  const mvp = `MVP Plan (14 days)\n\nDay 1-2: Finalize features (inputs, output templates), basic UI\nDay 3-6: Implement generator logic (local templates + simple rules)\nDay 7-9: Add export to .html, demo pages\nDay 10-12: Polish UI, animations, accessibility\nDay 13-14: Create listing materials, demo GIF\n\nCore features:\n- Input prompt -> generate 3 variations\n- Export HTML bundle\n- Copy-to-clipboard and license modal\n\nTech: Vanilla JS, Tailwind (optional), static hosting\nValidation: Post on IndieMaker and Maker threads.`;

  // Add small randomization to avoid feeling repetitive:
  const stamp = `\n\n(Generated ${new Date().toLocaleString()})`;
  return {
    niche: niche + stamp,
    idea: idea + stamp,
    mvp: mvp + stamp
  };
}

/* --------------------------
  Optional: callOpenAI()
  If you want real AI results, uncomment and adapt below,
  and make sure your key is stored server-side or as window.OPENAI_API_KEY (not recommended).
---------------------------- */

/*
async function callOpenAI(promptText){
  const apiKey = window.OPENAI_API_KEY || ''; // <-- better set via server or env
  if (!apiKey) throw new Error('OpenAI API key not set. Set window.OPENAI_API_KEY or use a server proxy.');

  const body = {
    model: "gpt-4o-mini", // replace with preferred model
    messages: [
      { role: "system", content: "You are IdeaForge AI..." },
      { role: "user", content: promptText }
    ],
    max_tokens: 800,
    temperature: 0.95,
    top_p: 0.9,
    n: 1
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error('OpenAI error: ' + errText);
  }
  const json = await res.json();
  return json.choices[0].message.content;
}
*/