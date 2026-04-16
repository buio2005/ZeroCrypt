let encryptedBlob = null;
let currentFileMeta = null;
let selectedFile = null;
let currentLang = "it";
const MAX_FILE_SIZE_BYTES = 150 * 1024 * 1024;
let fileTooLarge = false;

const I18N = {
  it: {
    meta: {
      title: "ZeroCrypt – Cripta file, testo e link in modo sicuro",
      description:
        "Cripta file, testo e link direttamente nel tuo browser con ZeroCrypt. Crittografia client-side, zero-knowledge, nessun upload."
    },
    header: { tagline: "Privacy First — Zero Knowledge Encryption" },
    drop: {
      title: "Carica un file",
      hint: "Trascina qui o clicca per sfogliare",
      support: "Supporta file, testo e link",
      fileReady: "File pronto per la crittografia",
      maxSize: "Consigliato ≤ 150MB"
    },
    input: { placeholder: "Incolla testo o link..." },
    password: {
      placeholder: "Inserisci password",
      show: "Mostra",
      hide: "Nascondi"
    },
    output: { placeholder: "Output..." },
    actions: {
      encrypt: "Cripta",
      decrypt: "Decripta",
      copy: "Copia",
      download: "Download"
    },
    badge: { local: "LOCAL ENCRYPTION" },
    about: {
      title: "Cos’è ZeroCrypt?",
      text:
        "ZeroCrypt è uno strumento di crittografia che funziona direttamente nel tuo browser. I dati vengono criptati localmente prima di essere condivisi, garantendo il massimo livello di privacy."
    },
    how: {
      title: "Come funziona",
      step1: "Inserisci testo o carica un file",
      step2: "Inserisci una password",
      step3: "Clicca su Cripta",
      step4: "Scarica o copia il risultato",
      step5: "Condividi in sicurezza"
    },
    features: {
      encryption: {
        title: "CRITTOGRAFIA E2EE",
        desc: "AES client-side. Nessun dato lascia il dispositivo."
      },
      zk: { title: "ZERO-KNOWLEDGE", desc: "Nessun accesso lato server." },
      file: { title: "SUPPORTO FILE", desc: "Compatibile con tutti i file." },
      link: { title: "PROTEZIONE LINK", desc: "Proteggi URL sensibili." }
    },
    faq: {
      title: "FAQ",
      q1: { q: "È sicuro?", a: "Sì, utilizza crittografia moderna lato browser." },
      q2: { q: "I dati vengono salvati?", a: "No, tutto avviene localmente." },
      q3: { q: "Posso recuperare la password?", a: "No, per motivi di sicurezza." }
    },
    glossary: {
      title: "Glossario",
      aes: "algoritmo di crittografia avanzato.",
      zk: "il server non conosce i dati.",
      client: "elaborazione nel browser."
    },
    cta: { text: "Per mantenere lo stesso livello di sicurezza, condividi il file o testo appena crittografato con <a href='https://tivustream.com/zerodrop/' target='_blank'>ZeroDrop.</a>" },
    footer: { home: "HOME", privacy: "PRIVACY", tos: "TOS", contacts: "CONTACTS" },
    status: {
      encryptedSuccess: "✔ Criptato con successo",
      decryptedSuccess: "✔ Decriptazione riuscita",
      decryptError: "❌ Password errata o file corrotto"
    },
    alerts: {
      missingPassword: "Inserisci password",
      missingData: "Dati mancanti",
      noFile: "Nessun file",
      fileTooLarge: "File troppo grande: consigliato ≤ 150MB per evitare problemi di memoria nel browser."
    }
  },
  en: {
    meta: {
      title: "ZeroCrypt – Encrypt files, text and links securely",
      description:
        "Encrypt files, text and links directly in your browser with ZeroCrypt. Client-side encryption, zero-knowledge, no upload."
    },
    header: { tagline: "Privacy First — Zero Knowledge Encryption" },
    drop: {
      title: "Upload a file",
      hint: "Drop here or click to browse",
      support: "Supports files, text and links",
      fileReady: "File ready for encryption",
      maxSize: "Recommended ≤ 150MB"
    },
    input: { placeholder: "Paste text or link..." },
    password: {
      placeholder: "Enter password",
      show: "Show",
      hide: "Hide"
    },
    output: { placeholder: "Output..." },
    actions: {
      encrypt: "Encrypt",
      decrypt: "Decrypt",
      copy: "Copy",
      download: "Download"
    },
    badge: { local: "LOCAL ENCRYPTION" },
    about: {
      title: "What is ZeroCrypt?",
      text:
        "ZeroCrypt is an encryption tool that runs directly in your browser. Data is encrypted locally before sharing, ensuring maximum privacy."
    },
    how: {
      title: "How it works",
      step1: "Paste text or choose a file",
      step2: "Enter a password",
      step3: "Click Encrypt",
      step4: "Download or copy the result",
      step5: "Share safely"
    },
    features: {
      encryption: {
        title: "E2EE ENCRYPTION",
        desc: "Client-side AES. No data leaves your device."
      },
      zk: { title: "ZERO-KNOWLEDGE", desc: "No server-side access." },
      file: { title: "FILE SUPPORT", desc: "Works with any file type." },
      link: { title: "LINK PROTECTION", desc: "Protect sensitive URLs." }
    },
    faq: {
      title: "FAQ",
      q1: { q: "Is it safe?", a: "Yes, it uses modern browser-based encryption." },
      q2: { q: "Is data stored?", a: "No, everything happens locally." },
      q3: { q: "Can I recover the password?", a: "No, for security reasons." }
    },
    glossary: {
      title: "Glossary",
      aes: "advanced encryption algorithm.",
      zk: "the server does not know the data.",
      client: "processing inside the browser."
    },
    cta: { text: "To maintain the same level of security, share the newly encrypted file or text with <a href='https://tivustream.com/zerodrop/' target='_blank'>ZeroDrop.</a>" },
    footer: { home: "HOME", privacy: "PRIVACY", tos: "TOS", contacts: "CONTACTS" },
    status: {
      encryptedSuccess: "✔ Encrypted successfully",
      decryptedSuccess: "✔ Decryption successful",
      decryptError: "❌ Wrong password or corrupted data"
    },
    alerts: {
      missingPassword: "Enter a password",
      missingData: "Missing data",
      noFile: "No file",
      fileTooLarge: "File is too large: recommended ≤ 150MB to avoid browser memory issues."
    }
  }
};

const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const langButtons = document.querySelectorAll(".lang-switch [data-lang]");

function t(key) {
  const langTable = I18N[currentLang] || I18N.it;
  const parts = key.split(".");
  let value = langTable;
  for (const part of parts) value = value && Object.prototype.hasOwnProperty.call(value, part) ? value[part] : undefined;
  if (typeof value === "string") return value;
  return key;
}

function applyI18n() {
  document.documentElement.setAttribute("lang", currentLang);

  const title = t("meta.title");
  if (title) document.title = title;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", t("meta.description"));

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    el.innerHTML = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (!key) return;
    el.setAttribute("placeholder", t(key));
  });

  syncPasswordToggleLabel();
  updateDropUI();
}

function setLang(lang) {
  currentLang = lang === "en" ? "en" : "it";
  try {
    localStorage.setItem("zerocrypt.lang", currentLang);
  } catch {}
  applyI18n();
  syncLangButtons();
}

function syncLangButtons() {
  if (!langButtons || langButtons.length === 0) return;
  langButtons.forEach(btn => {
    const lang = btn.getAttribute("data-lang");
    const isActive = lang === currentLang;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function syncPasswordToggleLabel() {
  const p = document.getElementById("password");
  const btn = document.getElementById("btnTogglePassword");
  if (!p || !btn) return;
  btn.textContent = p.type === "password" ? t("password.show") : t("password.hide");
}

dropArea.addEventListener("click", () => fileInput.click());

dropArea.addEventListener("dragover", e => {
  e.preventDefault();
  dropArea.classList.add("active");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
});

dropArea.addEventListener("drop", e => {
  e.preventDefault();
  selectedFile = e.dataTransfer.files && e.dataTransfer.files[0] ? e.dataTransfer.files[0] : null;
  if (selectedFile) {
    const dt = new DataTransfer();
    dt.items.add(selectedFile);
    fileInput.files = dt.files;
  }
  updateDropUI();
  dropArea.classList.remove("active");
});

fileInput.addEventListener("change", () => {
  selectedFile = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
  updateDropUI();
});

function togglePassword() {
  const p = document.getElementById("password");
  const next = p.type === "password" ? "text" : "password";
  p.type = next;
  syncPasswordToggleLabel();
}

async function getKey(password, salt) {
  const enc = new TextEncoder();

  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptData() {
  const text = document.getElementById("inputText").value;
  const file = selectedFile || (fileInput.files && fileInput.files[0] ? fileInput.files[0] : null);
  const password = document.getElementById("password").value;

  if (!password) return alert(t("alerts.missingPassword"));
  if (file && fileTooLarge) return alert(t("alerts.fileTooLarge"));
  setStatus("");

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey(password, salt);

  let payload;

  if (file) {
    const buffer = await file.arrayBuffer();

    payload = {
      name: file.name,
      type: file.type,
      data: Array.from(new Uint8Array(buffer))
    };

    currentFileMeta = file.name;
  } else {
    payload = {
      type: "text",
      data: text
    };
  }

  const encoded = new TextEncoder().encode(JSON.stringify(payload));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  const combined = new Uint8Array([
    ...salt,
    ...iv,
    ...new Uint8Array(encrypted)
  ]);

  encryptedBlob = new Blob([combined]);

  document.getElementById("outputText").value =
    btoa(String.fromCharCode(...combined));

  setStatus(t("status.encryptedSuccess"));
}

async function decryptData() {
  const password = document.getElementById("password").value;
  const input = document.getElementById("outputText").value;

  if (!password || !input) return alert(t("alerts.missingData"));
  setStatus("");

  const data = Uint8Array.from(atob(input), c => c.charCodeAt(0));

  const salt = data.slice(0, 16);
  const iv = data.slice(16, 28);
  const encrypted = data.slice(28);

  const key = await getKey(password, salt);

  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encrypted
    );

    const decoded = JSON.parse(new TextDecoder().decode(decrypted));

    if (decoded.type === "text") {
      document.getElementById("outputText").value = decoded.data;
    } else {
      const blob = new Blob([new Uint8Array(decoded.data)], { type: decoded.type });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = decoded.name || "file";
      a.click();
    }

    setStatus(t("status.decryptedSuccess"));
  } catch {
    setStatus(t("status.decryptError"));
  }
}

function copyOutput() {
  const out = document.getElementById("outputText");
  out.select();
  document.execCommand("copy");
}

function downloadFile() {
  if (!encryptedBlob) return alert(t("alerts.noFile"));

  const a = document.createElement("a");
  a.href = URL.createObjectURL(encryptedBlob);
  a.download = "encrypted.tiv";
  a.click();
}

function updateDropUI() {
  const dropText = document.getElementById("dropText");
  const dropSub = document.getElementById("dropSub");
  const encryptBtn = document.getElementById("btnEncrypt");

  if (!dropText || !dropSub) return;

  if (selectedFile) {
    fileTooLarge = selectedFile.size > MAX_FILE_SIZE_BYTES;
    if (encryptBtn) encryptBtn.disabled = fileTooLarge;

    dropText.innerText = selectedFile.name;
    dropSub.innerText = fileTooLarge ? t("alerts.fileTooLarge") : t("drop.fileReady");
    return;
  }

  fileTooLarge = false;
  if (encryptBtn) encryptBtn.disabled = false;

  dropText.innerText = t("drop.title");
  dropSub.innerText = t("drop.hint");
}

function setStatus(message) {
  const el = document.getElementById("status");
  if (!el) return;
  el.innerText = message;
}

if (langButtons && langButtons.length > 0) {
  langButtons.forEach(btn => {
    btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang")));
  });
}

let savedLang = null;
try {
  savedLang = localStorage.getItem("zerocrypt.lang");
} catch {}
setLang(savedLang === "en" ? "en" : "it");
