// footer.js
// Footer component. Lightweight and accessible.

export function renderFooter(rootId = 'footer-root') {
  const root = document.getElementById(rootId);
  if (!root) return;

  root.innerHTML = `
    <footer class="card" style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
      <div style="color:var(--muted);font-size:13px">© ${new Date().getFullYear()} IdeaForge — Built for indie makers</div>
      <div style="display:flex;gap:12px;align-items:center">
        <a href="#" style="color:var(--muted);text-decoration:none;font-size:13px">Terms</a>
        <a href="#" style="color:var(--muted);text-decoration:none;font-size:13px">Privacy</a>
      </div>
    </footer>
  `;
}