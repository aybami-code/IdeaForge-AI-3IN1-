// header.js
// Simple component that renders header into a container element.
// Exported as module to be imported in script.js

export function renderHeader(rootId = 'header-root') {
  const root = document.getElementById(rootId);
  if (!root) return;

  root.innerHTML = `
    <header class="card" style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:44px;height:44px;border-radius:10px;background:linear-gradient(90deg,var(--primary),#5B7BFD); display:flex;align-items:center;justify-content:center;font-weight:700;color:white">IF</div>
        <div>
          <div style="font-weight:700">IdeaForge</div>
          <div style="font-size:12px;color:var(--muted)">Niche • Idea • MVP</div>
        </div>
      </div>
      <nav aria-label="top navigation">
        <a href="#" style="color:var(--muted);text-decoration:none;margin-right:12px">Docs</a>
        <a href="#" style="color:var(--muted);text-decoration:none">About</a>
      </nav>
    </header>
  `;
}