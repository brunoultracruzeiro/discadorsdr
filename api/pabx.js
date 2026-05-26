<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GFB — Power Dialer</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#080a0f;--bg2:#0c0f16;--panel:#0f1319;--panel2:#131820;
  --border:#1a2232;--border2:#1f2a3d;
  --green:#00e87a;--green-glow:rgba(0,232,122,.15);
  --blue:#1d6fff;--blue2:#4d93ff;--orange:#ff8c00;
  --red:#ff3355;--yellow:#ffd600;--purple:#8b5cf6;
  --text:#e8f0fa;--text2:#7a94b0;--text3:#3d5470;
  --mono:'DM Mono',monospace;--sans:'Outfit',sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;overflow:hidden}
body{background:var(--bg);color:var(--text);font-family:var(--sans);font-size:14px}
body::after{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.03'/%3E%3C/svg%3E");pointer-events:none;z-index:9999;opacity:.4}

/* ── LAYOUT FULL-SCREEN ── */
.app{display:flex;flex-direction:column;height:100vh;max-width:680px;margin:0 auto}

/* ── TOPBAR ── */
.topbar{display:flex;align-items:center;justify-content:space-between;padding:10px 20px;background:var(--bg2);border-bottom:1px solid var(--border);flex-shrink:0;gap:8px}
.tb-left{display:flex;align-items:center;gap:10px}
.tb-logo{width:28px;height:28px;background:var(--green);border-radius:7px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:11px;color:#000;box-shadow:0 0 14px var(--green-glow);flex-shrink:0}
.sdr-sel{display:flex;align-items:center;gap:6px;background:var(--panel);border:1px solid var(--border2);border-radius:7px;padding:4px 9px;cursor:pointer;flex-shrink:0}
.sdr-av{width:20px;height:20px;border-radius:5px;background:linear-gradient(135deg,var(--blue),var(--green));display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;flex-shrink:0}
.sdr-nm{font-size:11px;font-weight:600}
.ss{display:flex;gap:8px}
.ss-item{font-family:var(--mono);font-size:10px;color:var(--text3)}
.ss-item b{color:var(--text2)}
.tb-right{display:flex;align-items:center;gap:6px;flex-shrink:0}
.pill{display:flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;border:1px solid var(--border2);cursor:pointer;transition:.2s;background:var(--panel)}
.pill-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;transition:.3s}
.pill-lbl{font-family:var(--mono);font-size:10px;font-weight:700;color:var(--text3)}
.pill.pok{border-color:var(--green);background:rgba(0,232,122,.07)}
.pill.pok .pill-dot{background:var(--green);box-shadow:0 0 5px var(--green-glow)}
.pill.pok .pill-lbl{color:var(--green)}
.pill.perr .pill-dot{background:var(--red)}
.pill.perr .pill-lbl{color:var(--red)}
.pill.pcall .pill-dot{background:var(--yellow);animation:pb .7s infinite}
.pill.pcall .pill-lbl{color:var(--yellow)}
.pill.pcon .pill-dot{background:var(--orange);animation:pb .4s infinite}
.pill.pcon .pill-lbl{color:var(--orange)}
.pill.pon{border-color:var(--green);background:rgba(0,232,122,.07)}
.pill.pon .pill-dot{background:var(--green);box-shadow:0 0 5px var(--green-glow)}
.pill.pon .pill-lbl{color:var(--green)}
.tbtn{background:var(--panel);border:1px solid var(--border2);color:var(--text2);padding:4px 10px;border-radius:7px;font-family:var(--sans);font-size:11px;font-weight:600;cursor:pointer;transition:.15s}
.tbtn:hover{border-color:var(--green);color:var(--green)}
@keyframes pb{0%,100%{opacity:1}50%{opacity:.3}}

/* ── PROGRESS BAR ── */
.progress-bar{padding:8px 20px;background:var(--panel);border-bottom:1px solid var(--border);flex-shrink:0;display:flex;align-items:center;gap:12px}
.pb-track{flex:1;height:4px;background:var(--border2);border-radius:2px;overflow:hidden}
.pb-fill{height:100%;background:var(--green);border-radius:2px;transition:width .4s ease}
.pb-text{font-family:var(--mono);font-size:10px;color:var(--text3);white-space:nowrap}
.pb-text b{color:var(--green)}

/* ── MAIN CONTENT ── */
.main{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:14px}

/* ── SYNC SCREEN ── */
.sync-screen{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:40px 20px}
.sync-icon{font-size:48px;opacity:.6;animation:spin 1.5s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.sync-title{font-size:18px;font-weight:800;color:var(--text2)}
.sync-sub{font-size:12px;color:var(--text3);text-align:center;max-width:280px;line-height:1.6}
.sync-progress{width:100%;max-width:280px;height:4px;background:var(--border2);border-radius:2px;overflow:hidden}
.sync-progress-fill{height:100%;background:var(--green);border-radius:2px;animation:loading 1.5s ease-in-out infinite}
@keyframes loading{0%{width:0;margin-left:0}50%{width:60%;margin-left:20%}100%{width:0;margin-left:100%}}

/* ── EMPTY STATE ── */
.state-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:var(--text3);padding:40px}
.btn-start{background:var(--green);color:#000;border:none;padding:13px 28px;border-radius:10px;font-family:var(--sans);font-size:15px;font-weight:800;cursor:pointer;box-shadow:0 0 28px var(--green-glow);transition:.2s}
.btn-start:hover{transform:translateY(-2px);box-shadow:0 0 40px rgba(0,232,122,.3)}

/* ── AUDIO NOTICE ── */
.audio-notice{background:rgba(29,111,255,.07);border:1px solid rgba(29,111,255,.2);border-radius:10px;padding:12px 14px;flex-shrink:0}
.an-title{font-size:11px;font-weight:700;color:var(--blue2);margin-bottom:4px;display:flex;align-items:center;gap:6px}
.an-text{font-size:11px;color:var(--text2);line-height:1.6}
.an-text b{color:var(--text)}

/* ── LEAD HERO ── */
.lead-hero{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:20px 22px;position:relative;overflow:hidden;flex-shrink:0}
.lead-hero::after{content:'';position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,rgba(0,232,122,.08),transparent 70%)}
.lh-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px}
.lh-name{font-size:28px;font-weight:900;line-height:1.1;letter-spacing:-.5px}
.att-box{background:var(--panel2);border:1px solid var(--border2);border-radius:9px;padding:8px 14px;text-align:center;flex-shrink:0}
.att-num{font-size:26px;font-weight:900;font-family:var(--mono);color:var(--green);line-height:1}
.att-lbl{font-size:8px;letter-spacing:1.5px;color:var(--text3);margin-top:1px}
.lh-co{font-size:13px;color:var(--text2);margin-bottom:12px}
.lh-row{display:flex;align-items:center;gap:8px;font-size:13px;margin-bottom:6px}
.lh-ico{width:24px;height:24px;border-radius:5px;background:var(--panel2);display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0}
.lh-val{font-weight:700}
.lh-lbl{color:var(--text3);font-size:11px}
.lh-footer{display:flex;align-items:center;justify-content:space-between;margin-top:10px}
.lh-stg{font-size:9px;padding:3px 10px;border-radius:20px;border:1px solid rgba(29,111,255,.4);color:var(--blue2);background:rgba(29,111,255,.08);font-family:var(--mono)}
.rd-lnk{font-family:var(--mono);font-size:9px;color:var(--text3);text-decoration:none;display:flex;align-items:center;gap:4px;background:var(--panel2);border:1px solid var(--border);border-radius:5px;padding:3px 8px;transition:.15s}
.rd-lnk:hover{color:var(--blue2);border-color:var(--blue2)}

/* ── CALL CONTROLS ── */
.call-controls{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:16px;position:relative;overflow:hidden;flex-shrink:0}
.cc-idle,.cc-calling,.cc-ended{display:none;flex-direction:column;gap:10px}

/* PABX bar */
.pabx-bar{display:flex;align-items:center;justify-content:space-between;border-radius:9px;padding:9px 14px;transition:.3s}
.pb-dialing{background:rgba(255,140,0,.07);border:1px solid rgba(255,140,0,.2)}
.pb-calling{background:rgba(0,232,122,.06);border:1px solid rgba(0,232,122,.2)}
.pb-err{background:rgba(255,51,85,.05);border:1px solid rgba(255,51,85,.15)}
.pb-tel{background:rgba(77,147,255,.06);border:1px solid rgba(77,147,255,.2)}
.pb-l{display:flex;align-items:center;gap:8px}
.pb-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.pd-dialing{background:var(--orange);animation:pb .4s infinite}
.pd-calling{background:var(--green);animation:pb .9s infinite}
.pd-err{background:var(--red)}
.pd-tel{background:var(--blue2)}
.pb-info{font-family:var(--mono);font-size:10px;font-weight:600}
.pb-sub{font-family:var(--mono);font-size:9px;color:var(--text3)}
.pb-dest{font-family:var(--mono);font-size:10px;color:var(--text3)}

/* Big call button */
.big-call-btn{background:var(--green);color:#000;border:none;padding:16px;border-radius:12px;font-family:var(--sans);font-size:16px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 0 36px var(--green-glow);transition:.2s}
.big-call-btn:hover{transform:translateY(-1px);box-shadow:0 0 50px rgba(0,232,122,.4)}
.big-call-btn:disabled{background:var(--border2);color:var(--text3);cursor:not-allowed;box-shadow:none;transform:none}
.skip-row{display:flex;gap:7px}

/* Timer */
.timer-bar{display:flex;align-items:center;justify-content:space-between;background:var(--panel2);border-radius:9px;padding:10px 16px}
.timer-display{font-family:var(--mono);font-size:28px;font-weight:700;color:var(--yellow)}
.timer-status{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--text2)}
.live-dot{width:7px;height:7px;border-radius:50%;background:var(--red);animation:pb .8s infinite;flex-shrink:0}

/* Result buttons */
.result-hint{font-size:10px;text-align:center;color:var(--text3);font-family:var(--mono)}
.result-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.result-btn{background:var(--panel2);border:1.5px solid var(--border2);color:var(--text2);padding:14px 8px;border-radius:10px;font-family:var(--sans);font-size:13px;font-weight:700;cursor:pointer;transition:.2s;text-align:center;line-height:1.4}
.result-btn:hover{transform:translateY(-1px);background:var(--bg2)}
.result-btn small{font-size:9px;opacity:.6;display:block;margin-top:2px}
.r-agendou{border-color:var(--green)!important;background:rgba(0,232,122,.1)!important;color:var(--green)!important}
.r-nao{border-color:var(--yellow)!important;background:rgba(255,214,0,.07)!important;color:var(--yellow)!important}
.r-remarcar{border-color:var(--blue2)!important;background:rgba(77,147,255,.08)!important;color:var(--blue2)!important}
.r-desq{border-color:var(--red)!important;background:rgba(255,51,85,.08)!important;color:var(--red)!important}
.r-contato{border-color:var(--purple)!important;background:rgba(139,92,246,.08)!important;color:var(--purple)!important}
.r-postal{border-color:var(--orange)!important;background:rgba(255,140,0,.08)!important;color:var(--orange)!important}
.enc-btn{background:rgba(255,51,85,.07);border:1.5px solid rgba(255,51,85,.25);color:var(--red);padding:10px;border-radius:9px;font-family:var(--sans);font-size:12px;font-weight:700;cursor:pointer;transition:.2s;display:flex;align-items:center;justify-content:center;gap:6px}
.enc-btn:hover{background:rgba(255,51,85,.16)}

/* Ended */
.ended-sum{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--panel2);border-radius:9px}
.ended-act{display:flex;gap:7px}
.btn-nxt{flex:1;background:linear-gradient(135deg,var(--blue),var(--blue2));color:#fff;border:none;padding:12px;border-radius:9px;font-family:var(--sans);font-size:13px;font-weight:800;cursor:pointer}
.btn-nxt:hover{opacity:.9}
.btn-recall{background:var(--panel2);border:1px solid var(--border2);color:var(--text2);padding:12px 14px;border-radius:9px;font-family:var(--sans);font-size:12px;font-weight:700;cursor:pointer;transition:.15s}
.btn-recall:hover{border-color:var(--green);color:var(--green)}
.ended-result-prompt{font-size:10px;text-align:center;color:var(--text3);font-family:var(--mono);margin-bottom:5px}

/* ── COUNTDOWN OVERLAY ── */
.cd-overlay{position:fixed;inset:0;background:rgba(8,10,15,.96);display:none;flex-direction:column;align-items:center;justify-content:center;gap:12px;z-index:100;backdrop-filter:blur(4px)}
.cd-badge{font-size:12px;font-weight:700;padding:5px 16px;border-radius:20px;border:1px solid;font-family:var(--mono)}
.cd-lbl{font-size:11px;color:var(--text3);letter-spacing:2px;text-transform:uppercase;font-family:var(--mono)}
.cd-num{font-size:100px;font-weight:900;font-family:var(--mono);color:var(--green);line-height:1;animation:cdp 1s ease infinite}
@keyframes cdp{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.06);opacity:.65}}
.cd-next{background:var(--panel2);border:1px solid var(--border2);border-radius:10px;padding:12px 20px;text-align:center;min-width:220px}
.cd-next-lbl{font-size:8px;color:var(--text3);letter-spacing:2px;text-transform:uppercase;font-family:var(--mono);margin-bottom:4px}
.cd-next-name{font-size:16px;font-weight:800}
.cd-next-co{font-size:11px;color:var(--text2);margin-top:2px}
.cd-cancel{background:transparent;border:1px solid var(--border2);color:var(--text3);padding:7px 18px;border-radius:7px;font-family:var(--sans);font-size:12px;cursor:pointer;transition:.15s}
.cd-cancel:hover{border-color:var(--red);color:var(--red)}

/* ── MODALS ── */
.modal-bg{display:none;position:fixed;inset:0;z-index:500;background:rgba(8,10,15,.87);backdrop-filter:blur(8px);align-items:center;justify-content:center}
.modal-bg.on{display:flex}
.modal{background:var(--panel);border:1px solid var(--border2);border-radius:15px;padding:24px;width:460px;max-width:94vw;max-height:92vh;overflow-y:auto}
.modal-title{font-size:17px;font-weight:800;margin-bottom:4px}
.modal-sub{font-size:12px;color:var(--text2);margin-bottom:16px}
.fg{margin-bottom:11px}
.flbl{font-family:var(--mono);font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);display:block;margin-bottom:5px}
.fi{width:100%;background:var(--bg);border:1px solid var(--border2);border-radius:7px;padding:8px 12px;color:var(--text);font-family:var(--mono);font-size:12px;outline:none;transition:.15s}
.fi:focus{border-color:var(--green)}
.fi-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.modal-btn{width:100%;background:var(--green);color:#000;border:none;padding:11px;border-radius:9px;font-family:var(--sans);font-weight:800;font-size:13px;cursor:pointer;margin-top:4px}
.modal-cancel{width:100%;background:transparent;border:1px solid var(--border2);color:var(--text2);padding:9px;border-radius:9px;font-family:var(--sans);font-weight:600;font-size:12px;cursor:pointer;margin-top:7px}
.sec-lbl{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--text3);font-family:var(--mono);margin:14px 0 8px;display:flex;align-items:center;gap:8px}
.sec-lbl::after{content:'';flex:1;height:1px;background:var(--border)}
.info-box{border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;margin-bottom:12px}
.info-box.blue{background:rgba(29,111,255,.06);border:1px solid rgba(29,111,255,.15);color:var(--text2)}
.info-box.orange{background:rgba(255,140,0,.06);border:1px solid rgba(255,140,0,.2);color:var(--text2)}
.info-box code{background:var(--panel2);padding:1px 5px;border-radius:3px;font-family:var(--mono);font-size:10px;color:var(--yellow)}
.test-btn{background:rgba(29,111,255,.1);border:1px solid rgba(29,111,255,.25);color:var(--blue2);padding:8px;border-radius:7px;font-family:var(--sans);font-size:11px;font-weight:700;cursor:pointer;width:100%;transition:.15s}
.test-btn:hover{background:rgba(29,111,255,.2)}

::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}

.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%) translateY(8px);z-index:999;background:var(--panel);border:1px solid var(--border2);border-radius:9px;padding:9px 18px;font-size:12px;font-weight:600;opacity:0;transition:.3s;pointer-events:none;white-space:nowrap}
.toast.on{opacity:1;transform:translateX(-50%) translateY(0)}
.toast.ok{border-color:rgba(0,232,122,.4);color:var(--green)}
.toast.err{border-color:rgba(255,51,85,.4);color:var(--red)}
.toast.warn{border-color:rgba(255,214,0,.4);color:var(--yellow)}
</style>
</head>
<body>

<!-- COUNTDOWN (full screen) -->
<div class="cd-overlay" id="cd-overlay">
  <div class="cd-badge" id="cd-badge">—</div>
  <div class="cd-lbl">próxima ligação em</div>
  <div class="cd-num" id="cd-num">3</div>
  <div class="cd-next">
    <div class="cd-next-lbl">Próximo lead</div>
    <div class="cd-next-name" id="cd-next-name">—</div>
    <div class="cd-next-co" id="cd-next-co">—</div>
  </div>
  <button class="cd-cancel" onclick="cancelCountdown()">✕ Cancelar</button>
</div>

<div class="app">

  <!-- TOPBAR -->
  <div class="topbar">
    <div class="tb-left">
      <div class="tb-logo">G</div>
      <div class="sdr-sel" onclick="openSettings()">
        <div class="sdr-av" id="sdr-av">?</div>
        <div class="sdr-nm" id="sdr-nm">Configurar</div>
        <span style="color:var(--text3);font-size:9px;margin-left:2px">▾</span>
      </div>
      <div class="ss">
        <div class="ss-item">📞 <b id="ss-calls">0</b></div>
        <div class="ss-item">⏱ <b id="ss-time">00:00</b></div>
        <div class="ss-item">📅 <b id="ss-sched">0</b></div>
      </div>
    </div>
    <div class="tb-right">
      <div class="pill" id="pabx-pill" onclick="testPabx()" title="Status PABX">
        <div class="pill-dot" id="pabx-dot"></div>
        <span class="pill-lbl" id="pabx-lbl">PABX</span>
      </div>
      <div class="pill pon" id="auto-pill" onclick="togglePD()">
        <div class="pill-dot" style="background:var(--green);box-shadow:0 0 5px var(--green-glow)"></div>
        <span class="pill-lbl" id="auto-lbl" style="color:var(--green)">⚡ AUTO</span>
      </div>
      <button class="tbtn" onclick="openAddLead()">＋</button>
    </div>
  </div>

  <!-- PROGRESS BAR -->
  <div class="progress-bar" id="progress-bar" style="display:none">
    <div class="pb-track"><div class="pb-fill" id="pb-fill" style="width:0%"></div></div>
    <div class="pb-text"><b id="pb-done">0</b>/<span id="pb-total">0</span> leads</div>
  </div>

  <!-- MAIN -->
  <div class="main" id="main-area">

    <!-- SYNC SCREEN -->
    <div class="sync-screen" id="sync-screen" style="display:none">
      <div class="sync-icon">🔄</div>
      <div class="sync-title" id="sync-title">Carregando leads...</div>
      <div class="sync-sub" id="sync-sub">Buscando deals do RD Station CRM</div>
      <div class="sync-progress"><div class="sync-progress-fill"></div></div>
    </div>

    <!-- EMPTY STATE -->
    <div class="state-empty" id="state-empty">
      <div style="font-size:48px;opacity:.3">📞</div>
      <div style="font-size:18px;font-weight:700;color:var(--text2)">Pronto para discagem</div>
      <div style="font-size:12px;color:var(--text3);text-align:center;max-width:260px;line-height:1.6" id="empty-sub">Configure o RD Station nas ⚙ configurações para carregar os leads automaticamente.</div>
      <button class="btn-start" onclick="startAutoQueue()">▶ Iniciar Fila</button>
      <button class="tbtn" style="margin-top:-4px" onclick="openSettings()">⚙ Configurações</button>
    </div>

    <!-- CALL SCREEN -->
    <div id="call-screen" style="display:none;flex-direction:column;gap:14px">

      <!-- Audio notice (só aparece uma vez) -->
      <div class="audio-notice" id="audio-notice" style="display:none">
        <div class="an-title">🎧 Áudio via softphone</div>
        <div class="an-text">O PABX liga para o <b>ramal <span id="notice-ramal">201</span></b>. Abra o <b>Zoiper</b> (ou outro softphone) registrado nesse ramal para ouvir e falar. O browser só envia o comando de discagem.</div>
      </div>

      <!-- Lead hero -->
      <div class="lead-hero">
        <div class="lh-top">
          <div>
            <div class="lh-name" id="ch-name">—</div>
            <div class="lh-co" id="ch-co">—</div>
          </div>
          <div class="att-box">
            <div class="att-num" id="ch-att">1</div>
            <div class="att-lbl">TENTATIVA</div>
          </div>
        </div>
        <div class="lh-row">
          <div class="lh-ico">📱</div>
          <span class="lh-val" id="ch-phone">—</span>
          <span class="lh-lbl">celular</span>
        </div>
        <div class="lh-footer">
          <span class="lh-stg" id="ch-stg">—</span>
          <a class="rd-lnk" id="ch-rd" href="#" target="_blank">🔗 RD Station</a>
        </div>
      </div>

      <!-- Controls -->
      <div class="call-controls">

        <!-- IDLE -->
        <div class="cc-idle" id="cc-idle">
          <button class="big-call-btn" id="btn-call" onclick="startCall()">
            <span style="font-size:20px">📞</span>
            <span>Ligar via PABX — <span id="cc-prev" style="font-family:var(--mono)">—</span></span>
          </button>
          <div class="skip-row">
            <button class="tbtn" style="flex:1;padding:8px" onclick="skipLead()">⏭ Pular lead</button>
            <button class="tbtn" style="flex:1;padding:8px" onclick="markNoPhone()">📵 Sem telefone</button>
          </div>
        </div>

        <!-- CALLING -->
        <div class="cc-calling" id="cc-calling">
          <div class="pabx-bar pb-dialing" id="pabx-bar">
            <div class="pb-l">
              <div class="pb-dot pd-dialing" id="pb-dot"></div>
              <div>
                <div class="pb-info" id="pb-info">Discando via PABX...</div>
                <div class="pb-sub">Ramal <span id="pb-ramal">201</span></div>
              </div>
            </div>
            <div class="pb-dest" id="pb-dest">—</div>
          </div>
          <div class="timer-bar">
            <div>
              <div class="timer-display" id="timer-display">00:00</div>
              <div style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:1px">duração</div>
            </div>
            <div style="text-align:right">
              <div class="timer-status"><div class="live-dot"></div>Em ligação</div>
              <div style="font-family:var(--mono);font-size:9px;color:var(--text3);margin-top:3px" id="call-phone">—</div>
            </div>
          </div>
          <div class="result-hint">👇 Toque no resultado — encerra e avança automaticamente</div>
          <div class="result-grid">
            <button class="result-btn" onclick="endWithResult('Agendou','r-agendou',this)">📅 Agendou<small>Reunião marcada</small></button>
            <button class="result-btn" onclick="endWithResult('Não Atendeu','r-nao',this)">❌ Não Atendeu<small>Sem resposta</small></button>
            <button class="result-btn" onclick="endWithResult('Remarcar','r-remarcar',this)">🔄 Remarcar<small>Ligar de novo</small></button>
            <button class="result-btn" onclick="endWithResult('Desqualificado','r-desq',this)">🚫 Desqualificado<small>Fora do perfil</small></button>
            <button class="result-btn" onclick="endWithResult('Contato Feito','r-contato',this)">✅ Contato Feito<small>Falou, sem ag.</small></button>
            <button class="result-btn" onclick="endWithResult('Caixa Postal','r-postal',this)">📬 Caixa Postal<small>Voicemail</small></button>
          </div>
          <button class="enc-btn" onclick="endNoResult()">⏹ Encerrar</button>
        </div>

        <!-- ENDED -->
        <div class="cc-ended" id="cc-ended">
          <div class="ended-sum">
            <div><div style="font-size:10px;color:var(--text3);margin-bottom:2px">Resultado</div><div style="font-size:15px;font-weight:700" id="ended-res">—</div></div>
            <div style="text-align:right"><div style="font-size:10px;color:var(--text3);margin-bottom:2px">Duração</div><div style="font-family:var(--mono);font-size:14px;font-weight:700" id="ended-dur">—</div></div>
          </div>
          <div id="ended-result-area" style="display:none">
            <div class="ended-result-prompt">Selecione o resultado:</div>
            <div class="result-grid">
              <button class="result-btn" onclick="setEndedResult('Agendou','r-agendou',this)">📅 Agendou</button>
              <button class="result-btn" onclick="setEndedResult('Não Atendeu','r-nao',this)">❌ Não Atendeu</button>
              <button class="result-btn" onclick="setEndedResult('Remarcar','r-remarcar',this)">🔄 Remarcar</button>
              <button class="result-btn" onclick="setEndedResult('Desqualificado','r-desq',this)">🚫 Desqualificado</button>
              <button class="result-btn" onclick="setEndedResult('Contato Feito','r-contato',this)">✅ Contato</button>
              <button class="result-btn" onclick="setEndedResult('Caixa Postal','r-postal',this)">📬 Postal</button>
            </div>
          </div>
          <div class="ended-act">
            <button class="btn-nxt" onclick="nextLead()">▶ Próximo Lead</button>
            <button class="btn-recall" onclick="reCall()">↩ Religar</button>
          </div>
        </div>

      </div>
    </div>

  </div>
</div>

<!-- CONFIG MODAL -->
<div class="modal-bg" id="cfg-modal">
  <div class="modal">
    <div class="modal-title">⚙ Configurações</div>
    <div class="modal-sub">SDR, PABX e RD Station</div>

    <div class="info-box orange">
      🎧 <b>Áudio:</b> Instale o <b>Zoiper</b> (gratuito) no celular ou PC e registre no ramal configurado abaixo. O browser só envia o comando — o áudio passa pelo softphone.
    </div>

    <div class="sec-lbl">SDR & Discagem</div>
    <div class="fg fi-row">
      <div><label class="flbl">Seu Nome (SDR)</label><input type="text" class="fi" id="cfg-name" placeholder="Ex: Marcelo"></div>
      <div><label class="flbl">Ramal de Origem</label><input type="number" class="fi" id="cfg-ramal" placeholder="201"></div>
    </div>
    <div class="fg fi-row">
      <div><label class="flbl">Delay Auto-Avanço (s)</label><input type="number" class="fi" id="cfg-delay" min="1" max="15" placeholder="3"></div>
      <div><label class="flbl">Proxy PABX (URL Vercel)</label><input type="text" class="fi" id="cfg-proxy" placeholder="https://discadorsdr.vercel.app/api/pabx"></div>
    </div>
    <button class="test-btn" onclick="testPabx()">🔌 Testar conexão PABX</button>

    <div class="sec-lbl">RD Station CRM</div>
    <div class="info-box blue">
      Os leads são carregados <b>automaticamente</b> ao abrir a página. Configure o token e pipeline abaixo.
    </div>
    <div class="fg fi-row">
      <div><label class="flbl">Token RD Station</label><input type="password" class="fi" id="cfg-rd" placeholder="Token pessoal"></div>
      <div><label class="flbl">Pipeline ID</label><input type="text" class="fi" id="cfg-pipe" placeholder="694aabf0..."></div>
    </div>
    <div class="fg">
      <label class="flbl">Etapas para discar (separadas por vírgula)</label>
      <input type="text" class="fi" id="cfg-stages" placeholder="Sem Contato/Lead, Entrar em Contato, Remarcar Reunião">
    </div>
    <button class="test-btn" style="margin-bottom:4px" onclick="syncRD()">🔄 Sincronizar leads agora</button>

    <button class="modal-btn" onclick="saveCfg()">💾 Salvar configurações</button>
    <button class="modal-cancel" onclick="closeCfg()">Cancelar</button>
  </div>
</div>

<!-- ADD LEAD MODAL -->
<div class="modal-bg" id="add-modal">
  <div class="modal">
    <div class="modal-title">＋ Adicionar Lead</div>
    <div class="fg"><label class="flbl">Nome</label><input type="text" class="fi" id="al-name" placeholder="Nome completo"></div>
    <div class="fg"><label class="flbl">Telefone</label><input type="text" class="fi" id="al-phone" placeholder="5561999999999"></div>
    <div class="fg"><label class="flbl">Academia / Empresa</label><input type="text" class="fi" id="al-co" placeholder="Nome da academia"></div>
    <div class="fg"><label class="flbl">Etapa</label>
      <select class="fi" id="al-stg">
        <option value="Sem Contato/Lead">Sem Contato/Lead</option>
        <option value="Entrar em Contato">Entrar em Contato</option>
        <option value="Remarcar Reunião">Remarcar Reunião</option>
      </select>
    </div>
    <button class="modal-btn" onclick="addLead()">Adicionar à Fila</button>
    <button class="modal-cancel" onclick="closeAdd()">Cancelar</button>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
// ══ STATE ══
const LS={get:(k,d='')=>{try{return localStorage.getItem('gfb_'+k)||d}catch{return d}},set:(k,v)=>{try{localStorage.setItem('gfb_'+k,v)}catch{}}};
let cfg={
  name:LS.get('sdr_name'),
  rdToken:LS.get('rd_token'),
  pipeId:LS.get('pipe_id','694aabf03f1ed8001d44a46b'),
  delay:parseInt(LS.get('delay','3'))||3,
  ramal:parseInt(LS.get('ramal','201'))||201,
  proxy:LS.get('proxy',''),
  stages:LS.get('stages','Sem Contato/Lead,Entrar em Contato,Remarcar Reunião')
};
let leads=[],curIdx=-1,callState='idle';
let timerInt=null,sessInt=null,callStart=null,cdInt=null,pabxPollInt=null;
let sessStart=Date.now(),sessCalls=0,sessSched=0,selResult='',lastDur=0;
let powerDialer=true,pabxCallFound=false,audioNoticeSeen=LS.get('audio_seen',false);

const BADGE={
  'Agendou':'color:var(--green);border-color:var(--green);background:rgba(0,232,122,.1)',
  'Não Atendeu':'color:var(--yellow);border-color:var(--yellow);background:rgba(255,214,0,.07)',
  'Remarcar':'color:var(--blue2);border-color:var(--blue2);background:rgba(77,147,255,.07)',
  'Desqualificado':'color:var(--red);border-color:var(--red);background:rgba(255,51,85,.07)',
  'Contato Feito':'color:var(--purple);border-color:var(--purple);background:rgba(139,92,246,.07)',
  'Caixa Postal':'color:var(--orange);border-color:var(--orange);background:rgba(255,140,0,.07)'
};

// ══ PABX ══
const PABX_BASE='https://pabx2.integravoip.com.br/suite/api';
const PABX_TOKEN='be6e3c68-9013-4701-b09e-e828466f9238';
const PABX_USR='gestao-fitness-brasil-api';

function getProxy(){
  if(cfg.proxy)return cfg.proxy;
  if(window.location.protocol!=='file:'&&!['localhost','127.0.0.1'].includes(window.location.hostname))
    return window.location.origin+'/api/pabx';
  return null;
}

async function pabxFetch(ep,opts={}){
  const proxy=getProxy();
  if(proxy){
    const body=opts.body?JSON.parse(opts.body):undefined;
    const r=await fetch(proxy,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({endpoint:ep,method:opts.method||'GET',body})});
    const t=await r.text();try{return JSON.parse(t);}catch{return{raw:t};}
  }else{
    const h={'accept':'application/json','usuario':PABX_USR,'token':PABX_TOKEN};
    if(opts.method==='POST')h['Content-Type']='application/json';
    const r=await fetch(PABX_BASE+ep,{...opts,headers:h});
    const t=await r.text();try{return JSON.parse(t);}catch{return{raw:t};}
  }
}

async function pabxDial(phone,ramal){
  return pabxFetch('/discar_numero',{method:'POST',body:JSON.stringify({dados:{numero_ramal_origem:parseInt(ramal),numero_destino:String(phone)}})});
}
async function pabxOnline(){return pabxFetch('/listar_chamadas_online');}

function fmtPABX(p){let c=p.replace(/\D/g,'');if(c.startsWith('55')&&c.length>=12)c=c.slice(2);return c;}

function setPabxSt(st,info=''){
  const pill=document.getElementById('pabx-pill');
  const dot=document.getElementById('pabx-dot');
  const lbl=document.getElementById('pabx-lbl');
  if(!pill)return;
  pill.className='pill';
  const map={ok:{cls:'pok',lbl:'PABX ✓',dc:'var(--green)'},err:{cls:'perr',lbl:'PABX ✗',dc:'var(--red)'},calling:{cls:'pcall',lbl:'📞 PABX',dc:'var(--yellow)'},dialing:{cls:'pcon',lbl:'Discando',dc:'var(--orange)'}};
  const s=map[st]||{cls:'',lbl:'PABX',dc:'var(--text3)'};
  pill.classList.add(s.cls);dot.style.background=s.dc;lbl.textContent=s.lbl;lbl.style.color=s.dc;
  // bar
  const bar=document.getElementById('pabx-bar');
  const pdot=document.getElementById('pb-dot');
  const pi=document.getElementById('pb-info');
  if(!bar)return;
  bar.className='pabx-bar';
  if(st==='dialing'){bar.classList.add('pb-dialing');pdot.className='pb-dot pd-dialing';if(pi)pi.textContent=info||'Discando via PABX...';}
  else if(st==='calling'){bar.classList.add('pb-calling');pdot.className='pb-dot pd-calling';if(pi)pi.textContent=info||'Chamada ativa';}
  else if(st==='err'){bar.classList.add('pb-err');pdot.className='pb-dot pd-err';if(pi)pi.textContent='Erro — usando tel: fallback';}
  else if(st==='tel'){bar.classList.add('pb-tel');pdot.className='pb-dot pd-tel';if(pi)pi.textContent='Discagem manual (tel:)';}
}

async function testPabx(){
  setPabxSt('dialing','Testando...');
  toast('🔌 Testando PABX...','ok');
  try{
    const d=await pabxOnline();
    if(d.raw&&typeof d.raw==='string'&&d.raw.includes('html'))throw new Error('Resposta HTML — proxy não encontrado');
    setPabxSt('ok');
    toast('✅ PABX conectado!','ok');
  }catch(e){
    setPabxSt('err');
    const cors=e.message.includes('Failed to fetch')||e.message.includes('NetworkError');
    toast(cors?'⚠ Configure o Proxy URL nas configurações':'❌ PABX: '+e.message.slice(0,60),'err');
  }
}

function startPabxPoll(){
  pabxCallFound=false;const ramal=cfg.ramal||201;
  pabxPollInt=setInterval(async()=>{
    if(callState!=='calling'){clearInterval(pabxPollInt);return;}
    try{
      const d=await pabxOnline();
      const arr=extractArr(d);
      const my=arr.find(c=>String(c.ramal_origem)==String(ramal)||String(c.numero_ramal_origem)==String(ramal)||String(c.ramal)==String(ramal));
      if(my){
        pabxCallFound=true;
        const dest=my.numero_destino||my.destino||'—';
        setPabxSt('calling',`Ramal ${ramal} → ${dest}`);
        const el=document.getElementById('pb-dest');if(el)el.textContent=dest;
      }else if(pabxCallFound&&callState==='calling'){
        pabxCallFound=false;clearInterval(pabxPollInt);setPabxSt('ok');
        toast('📵 Chamada encerrada pelo PABX','ok');
        endNoResult();
      }
    }catch(e){}
  },3000);
}
function stopPabxPoll(){clearInterval(pabxPollInt);pabxCallFound=false;}
function extractArr(d){if(Array.isArray(d))return d;for(const k of['dados','data','chamadas','result']){if(d&&Array.isArray(d[k]))return d[k];}return[];}

// ══ RD STATION — chamada direta (sem proxy) ══
async function syncRD(){
  if(!cfg.rdToken){toast('Configure o Token RD Station nas ⚙ configurações','warn');openSettings();return;}
  showSync('Buscando leads no RD Station...','Conectando ao CRM...');
  try{
    // RD Station CRM API suporta CORS com token
    const stages=cfg.stages.split(',').map(s=>s.trim()).filter(Boolean);
    let allDeals=[];let page=1;let total=0;

    do{
      const url=`https://crm.rdstation.com/api/v1/deals?token=${cfg.rdToken}&deal_pipeline_id=${cfg.pipeId}&limit=200&page=${page}`;
      const r=await fetch(url);
      if(!r.ok)throw new Error('RD Station: HTTP '+r.status+' — verifique o token e pipeline ID');
      const data=await r.json();
      const deals=data.deals||[];
      total=data.total||deals.length;
      allDeals=[...allDeals,...deals];
      showSync(`Carregando leads... (${allDeals.length}/${total})`,`Página ${page}`);
      page++;
      if(deals.length<200)break;
    }while(allDeals.length<total&&page<=10);

    // Filtra pelas etapas configuradas (se tiver filtro)
    const filtered=stages.length>0
      ? allDeals.filter(d=>stages.some(s=>d.deal_stage?.name?.toLowerCase().includes(s.toLowerCase())||s.toLowerCase().includes(d.deal_stage?.name?.toLowerCase())))
      : allDeals;

    leads=filtered.map(d=>({
      id:d._id||d.id,
      name:d.contacts?.[0]?.name||d.name||'Lead',
      company:d.organization?.name||'',
      phone:d.contacts?.[0]?.phones?.[0]?.phone||d.contacts?.[0]?.mobile_phone||'',
      stage:d.deal_stage?.name||'Sem Contato/Lead',
      attempts:0,called:false,
      dealId:d._id||d.id,
      notes:''
    })).filter(l=>l.phone); // só leads com telefone

    LS.set('leads',JSON.stringify(leads));
    hideSync();
    updateProgress();
    toast(`✅ ${leads.length} leads carregados do RD Station`,'ok');
    if(leads.length>0)setTimeout(()=>startAutoQueue(),800);
    else{document.getElementById('state-empty').style.display='flex';document.getElementById('empty-sub').textContent=`Nenhum lead com telefone nas etapas: ${cfg.stages}`;}
  }catch(e){
    hideSync();
    document.getElementById('state-empty').style.display='flex';
    toast('❌ RD Station: '+e.message,'err');
    console.error('[RD]',e);
  }
}

function showSync(title,sub){
  document.getElementById('state-empty').style.display='none';
  document.getElementById('call-screen').style.display='none';
  const s=document.getElementById('sync-screen');s.style.display='flex';
  document.getElementById('sync-title').textContent=title;
  document.getElementById('sync-sub').textContent=sub;
}
function hideSync(){document.getElementById('sync-screen').style.display='none';}

// ══ QUEUE ══
function updateProgress(){
  const done=leads.filter(l=>l.called).length,total=leads.length;
  const bar=document.getElementById('progress-bar');
  if(total>0){bar.style.display='flex';document.getElementById('pb-fill').style.width=((done/total)*100)+'%';document.getElementById('pb-done').textContent=done;document.getElementById('pb-total').textContent=total;}
  else bar.style.display='none';
}
function fmtPhone(p){const c=p.replace(/\D/g,'');if(c.length===13)return`+${c.slice(0,2)} (${c.slice(2,4)}) ${c.slice(4,9)}-${c.slice(9)}`;if(c.length===11)return`(${c.slice(0,2)}) ${c.slice(2,7)}-${c.slice(7)}`;return p;}

// ══ LEAD SELECTION ══
function selectLead(idx){
  if(callState==='calling'){toast('Encerre a ligação primeiro','err');return;}
  curIdx=idx;const l=leads[idx];
  document.getElementById('state-empty').style.display='none';
  document.getElementById('call-screen').style.display='flex';
  document.getElementById('ch-name').textContent=l.name;
  document.getElementById('ch-co').textContent=l.company||'—';
  document.getElementById('ch-stg').textContent=l.stage;
  document.getElementById('ch-phone').textContent=l.phone?fmtPhone(l.phone):'Sem telefone';
  document.getElementById('ch-att').textContent=l.attempts+1;
  document.getElementById('ch-rd').href=l.dealId?`https://crm.rdstation.com/app/deals/${l.dealId}`:'#';
  document.getElementById('cc-prev').textContent=l.phone?fmtPhone(l.phone):'sem número';
  document.getElementById('call-phone').textContent=l.phone?fmtPhone(l.phone):'—';
  document.getElementById('pb-dest').textContent=l.phone?fmtPABX(l.phone):'—';
  document.getElementById('pb-ramal').textContent=cfg.ramal||201;
  setUI('idle');selResult='';
  document.querySelectorAll('.result-btn').forEach(b=>b.className='result-btn');
  // Mostra notice de áudio apenas uma vez
  if(!audioNoticeSeen){document.getElementById('audio-notice').style.display='block';document.getElementById('notice-ramal').textContent=cfg.ramal||201;}
}

// ══ CALL FLOW ══
async function startCall(){
  const l=leads[curIdx];if(!l)return;
  if(!l.phone){toast('Lead sem telefone','err');return;}
  const btn=document.getElementById('btn-call');
  btn.disabled=true;btn.innerHTML='<span style="font-size:18px">⏳</span><span>Discando via PABX...</span>';
  const phone=fmtPABX(l.phone),ramal=cfg.ramal||201;
  setPabxSt('dialing',`Discando ${phone}...`);
  // Esconde notice de áudio
  if(!audioNoticeSeen){LS.set('audio_seen','1');audioNoticeSeen=true;}
  try{
    const res=await pabxDial(phone,ramal);
    console.log('[PABX] →',res);
    const isErr=res.status==='error'||res.erro||res.error||(res.raw&&typeof res.status==='number'&&res.status>=400);
    if(isErr)throw new Error(res.message||res.mensagem||String(res.raw||'Erro PABX').slice(0,100));
    callState='calling';callStart=Date.now();l.attempts++;LS.set('leads',JSON.stringify(leads));
    setUI('calling');startTimer();startPabxPoll();
    setPabxSt('calling',`Ramal ${ramal} → ${phone}`);
    toast('✅ Discando... ramal '+ramal,'ok');
  }catch(e){
    console.error('[PABX]',e);
    const cors=e.message.includes('Failed to fetch')||e.message.includes('NetworkError');
    btn.disabled=false;
    btn.innerHTML=`<span style="font-size:18px">📞</span><span>Ligar — <span id="cc-prev" style="font-family:var(--mono)">${fmtPhone(l.phone)}</span></span>`;
    setPabxSt(cors?'err':'err');
    if(cors){
      // Fallback silencioso: tel:
      const a=document.createElement('a');a.href='tel:'+phone;a.click();
      callState='calling';callStart=Date.now();l.attempts++;LS.set('leads',JSON.stringify(leads));
      setUI('calling');startTimer();setPabxSt('tel','Fallback tel:');
      toast('⚠ PABX offline — discagem manual ativada','warn');
    }else{toast('❌ PABX: '+e.message.slice(0,80),'err');}
  }
}

function endWithResult(label,cls,btn){
  if(callState!=='calling')return;
  selResult=label;
  document.querySelectorAll('.result-btn').forEach(b=>b.className='result-btn');
  btn.className='result-btn '+cls;
  finalizeCall(label);
}
function endNoResult(){if(callState!=='calling')return;selResult='';finalizeCall('');}

function finalizeCall(label){
  callState='ended';stopTimer();stopPabxPoll();
  const dur=Math.floor((Date.now()-callStart)/1000);lastDur=dur;
  const l=leads[curIdx];l.called=true;
  if(label)updateStage(curIdx,label);
  LS.set('leads',JSON.stringify(leads));
  sessCalls++;document.getElementById('ss-calls').textContent=sessCalls;
  if(label==='Agendou'){sessSched++;document.getElementById('ss-sched').textContent=sessSched;}
  updateProgress();setPabxSt('ok');
  // Reset btn
  const nxt=leads[curIdx+1];const btn=document.getElementById('btn-call');
  if(btn){btn.disabled=false;btn.innerHTML=`<span style="font-size:18px">📞</span><span>Ligar via PABX — <span id="cc-prev" style="font-family:var(--mono)">${nxt?fmtPhone(nxt.phone||''):'—'}</span></span>`;}
  if(powerDialer&&label){startCountdown(label);}
  else{document.getElementById('ended-res').textContent=label||'—';document.getElementById('ended-dur').textContent=fmtTime(dur);document.getElementById('ended-result-area').style.display=!label?'block':'none';setUI('ended');}
}

function setEndedResult(label,cls,btn){
  selResult=label;document.querySelectorAll('#ended-result-area .result-btn').forEach(b=>b.className='result-btn');btn.className='result-btn '+cls;
  document.getElementById('ended-res').textContent=label;document.getElementById('ended-result-area').style.display='none';
  updateStage(curIdx,label);LS.set('leads',JSON.stringify(leads));
  if(powerDialer){setUI('idle');startCountdown(label);}
}

function updateStage(idx,r){const l=leads[idx];if(!l)return;const m={'Agendou':'Reunião Agendada','Remarcar':'Remarcar Reunião','Contato Feito':'Contato Feito','Desqualificado':'Acompanhamento','Caixa Postal':'Entrar em Contato'};if(m[r])l.stage=m[r];else if(r==='Não Atendeu'&&l.stage==='Sem Contato/Lead')l.stage='Entrar em Contato';}
function setUI(s){document.getElementById('cc-idle').style.display=s==='idle'?'flex':'none';document.getElementById('cc-calling').style.display=s==='calling'?'flex':'none';document.getElementById('cc-ended').style.display=s==='ended'?'flex':'none';}

// ══ COUNTDOWN ══
function startCountdown(label){
  let count=cfg.delay||3;
  const ni=curIdx+1,nl=ni<leads.length?leads[ni]:null;
  const badge=document.getElementById('cd-badge');badge.textContent=label;badge.style.cssText=BADGE[label]||'';
  document.getElementById('cd-num').textContent=count;
  document.getElementById('cd-next-name').textContent=nl?nl.name:'✅ Fim da fila';
  document.getElementById('cd-next-co').textContent=nl?(nl.company||''):'Todos concluídos!';
  document.getElementById('cd-overlay').style.display='flex';
  cdInt=setInterval(()=>{count--;document.getElementById('cd-num').textContent=count;if(count<=0){clearInterval(cdInt);document.getElementById('cd-overlay').style.display='none';autoNext();}},1000);
}
function cancelCountdown(){
  clearInterval(cdInt);document.getElementById('cd-overlay').style.display='none';
  document.getElementById('ended-res').textContent=selResult||'—';
  document.getElementById('ended-dur').textContent=fmtTime(lastDur);
  document.getElementById('ended-result-area').style.display=!selResult?'block':'none';
  setUI('ended');
}
function autoNext(){
  const ni=curIdx+1;
  if(ni<leads.length){callState='idle';selectLead(ni);setTimeout(()=>startCall(),500);}
  else{callState='idle';curIdx=-1;document.getElementById('call-screen').style.display='none';document.getElementById('state-empty').style.display='flex';document.getElementById('empty-sub').textContent='Fila concluída! Sincronize novamente para atualizar os leads.';toast('🎉 Fila concluída! '+sessCalls+' lig · '+sessSched+' agend','ok');}
}

// ══ NAVIGATION ══
function nextLead(){callState='idle';const ni=curIdx+1;if(ni<leads.length)selectLead(ni);else{curIdx=-1;document.getElementById('call-screen').style.display='none';document.getElementById('state-empty').style.display='flex';toast('✅ Fila concluída!','ok');}}
function reCall(){callState='idle';setUI('idle');selResult='';document.querySelectorAll('.result-btn').forEach(b=>b.className='result-btn');}
function skipLead(){if(callState==='calling'){toast('Encerre primeiro','err');return;}leads[curIdx].called=true;LS.set('leads',JSON.stringify(leads));updateProgress();nextLead();toast('Lead pulado','ok');}
function markNoPhone(){if(curIdx<0)return;leads[curIdx].notes='Sem telefone';leads[curIdx].called=true;LS.set('leads',JSON.stringify(leads));updateProgress();nextLead();toast('Marcado sem telefone','ok');}
function startAutoQueue(){const fi=leads.findIndex(l=>!l.called);if(fi<0){toast('Todos os leads foram contatados!','ok');return;}selectLead(fi);}
function togglePD(){powerDialer=!powerDialer;const pill=document.getElementById('auto-pill'),lbl=document.getElementById('auto-lbl');if(powerDialer){pill.className='pill pon';lbl.textContent='⚡ AUTO';lbl.style.color='var(--green)';toast('⚡ Auto-avanço ativado','ok');}else{pill.className='pill';lbl.textContent='⏸ MANUAL';lbl.style.color='var(--text3)';toast('Modo manual','ok');}}

// ══ TIMER ══
function startTimer(){timerInt=setInterval(()=>{document.getElementById('timer-display').textContent=fmtTime(Math.floor((Date.now()-callStart)/1000));},1000);}
function stopTimer(){clearInterval(timerInt);}
function fmtTime(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');}
function startSessTimer(){sessInt=setInterval(()=>{document.getElementById('ss-time').textContent=fmtTime(Math.floor((Date.now()-sessStart)/1000));},1000);}

// ══ SETTINGS ══
function openSettings(){document.getElementById('cfg-name').value=cfg.name;document.getElementById('cfg-rd').value=cfg.rdToken;document.getElementById('cfg-pipe').value=cfg.pipeId;document.getElementById('cfg-delay').value=cfg.delay;document.getElementById('cfg-ramal').value=cfg.ramal;document.getElementById('cfg-proxy').value=cfg.proxy;document.getElementById('cfg-stages').value=cfg.stages;document.getElementById('cfg-modal').classList.add('on');}
function closeCfg(){document.getElementById('cfg-modal').classList.remove('on');}
function saveCfg(){cfg.name=document.getElementById('cfg-name').value;cfg.rdToken=document.getElementById('cfg-rd').value;cfg.pipeId=document.getElementById('cfg-pipe').value;cfg.delay=parseInt(document.getElementById('cfg-delay').value)||3;cfg.ramal=parseInt(document.getElementById('cfg-ramal').value)||201;cfg.proxy=document.getElementById('cfg-proxy').value.trim();cfg.stages=document.getElementById('cfg-stages').value.trim();LS.set('sdr_name',cfg.name);LS.set('rd_token',cfg.rdToken);LS.set('pipe_id',cfg.pipeId);LS.set('delay',cfg.delay);LS.set('ramal',cfg.ramal);LS.set('proxy',cfg.proxy);LS.set('stages',cfg.stages);updateSDR();closeCfg();toast('✅ Salvo!','ok');}
function updateSDR(){const n=cfg.name||'Configurar';document.getElementById('sdr-nm').textContent=n;document.getElementById('sdr-av').textContent=n?n[0].toUpperCase():'?';}

// ADD LEAD
function openAddLead(){document.getElementById('add-modal').classList.add('on');}
function closeAdd(){document.getElementById('add-modal').classList.remove('on');}
function addLead(){const name=document.getElementById('al-name').value.trim(),phone=document.getElementById('al-phone').value.trim();if(!name){toast('Informe o nome','err');return;}leads.push({id:'m'+Date.now(),name,phone,company:document.getElementById('al-co').value.trim(),stage:document.getElementById('al-stg').value,attempts:0,called:false,dealId:null,notes:''});LS.set('leads',JSON.stringify(leads));updateProgress();closeAdd();toast('Lead adicionado!','ok');['al-name','al-phone','al-co'].forEach(i=>document.getElementById(i).value='');}

// TOAST
function toast(msg,type='ok'){const t=document.getElementById('toast');t.textContent=msg;t.className='toast '+type+' on';setTimeout(()=>t.classList.remove('on'),4000);}

// ══ INIT ══
window.onload=()=>{
  updateSDR();startSessTimer();
  // Testa PABX silenciosamente
  const proxy=getProxy();
  if(proxy)testPabx();else setPabxSt('err');
  // Auto-sync RD Station se token configurado
  if(cfg.rdToken&&cfg.pipeId){
    syncRD();
  }else{
    // Carrega leads do localStorage se tiver
    const saved=JSON.parse(LS.get('leads','[]'));
    if(saved.length){leads=saved;updateProgress();}
    document.getElementById('state-empty').style.display='flex';
    if(!cfg.name)setTimeout(openSettings,500);
  }
};
</script>
</body>
</html>
