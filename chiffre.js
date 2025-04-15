
function mod(n, m) {
  return ((n % m) + m) % m;
}

function toUpper(text) {
  return text.toUpperCase().replace(/[^A-Z]/g, "");
}

// Cesar
function cesar(text, key, decrypt) {
  key = parseInt(key);
  return text.split('').map(c => {
    if (/[a-zA-Z]/.test(c)) {
      let base = c === c.toUpperCase() ? 65 : 97;
      let code = c.charCodeAt(0) - base;
      code = mod(code + (decrypt ? -key : key), 26);
      return String.fromCharCode(code + base);
    }
    return c;
  }).join('');
}

// Substitution simple
function substitution(text, decrypt) {
  const plain = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const cipher = "QWERTYUIOPASDFGHJKLZXCVBNM";
  return text.split('').map(c => {
    let isUpper = c === c.toUpperCase();
    let i = (decrypt ? cipher : plain).indexOf(c.toUpperCase());
    return i >= 0 ? (isUpper ? (decrypt ? plain[i] : cipher[i]) : (decrypt ? plain[i] : cipher[i]).toLowerCase()) : c;
  }).join('');
}

// Atbash
function atbash(text) {
  return text.split('').map(c => {
    if (/[a-zA-Z]/.test(c)) {
      let base = c === c.toUpperCase() ? 65 : 97;
      return String.fromCharCode(base + (25 - (c.charCodeAt(0) - base)));
    }
    return c;
  }).join('');
}

// ROT13
function rot13(text) {
  return cesar(text, 13, false);
}

// Albam (similaire à Atbash)
function albam(text) {
  return atbash(text);
}

// Carré de Polybe
const polybe = [
  ['A','B','C','D','E'],
  ['F','G','H','I','K'],
  ['L','M','N','O','P'],
  ['Q','R','S','T','U'],
  ['V','W','X','Y','Z']
];

function polybeEncrypt(text) {
  text = toUpper(text.replace(/J/g, "I"));
  let res = "";
  for (let c of text) {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (polybe[i][j] === c) res += (i+1).toString() + (j+1).toString();
      }
    }
  }
  return res;
}

function polybeDecrypt(code) {
  let res = "";
  for (let i = 0; i < code.length; i += 2) {
    let row = parseInt(code[i]) - 1;
    let col = parseInt(code[i+1]) - 1;
    res += polybe[row][col];
  }
  return res;
}

// Trithemius
function trithemius(text, decrypt) {
  return text.split('').map((c, i) => {
    if (/[a-zA-Z]/.test(c)) {
      let base = c === c.toUpperCase() ? 65 : 97;
      let code = c.charCodeAt(0) - base;
      code = mod(code + (decrypt ? -i : i), 26);
      return String.fromCharCode(code + base);
    }
    return c;
  }).join('');
}

// Vigenère
function vigenere(text, key, decrypt) {
  key = toUpper(key);
  let j = 0;
  return text.split('').map(c => {
    if (/[a-zA-Z]/.test(c)) {
      let base = c === c.toUpperCase() ? 65 : 97;
      let shift = key[j++ % key.length].charCodeAt(0) - 65;
      let code = c.charCodeAt(0) - base;
      code = mod(code + (decrypt ? -shift : shift), 26);
      return String.fromCharCode(code + base);
    }
    return c;
  }).join('');
}

// Autokey
function autokey(text, key, decrypt) {
  text = toUpper(text);
  key = toUpper(key);
  let fullKey = key;
  if (!decrypt) fullKey += text.slice(0, text.length - key.length);
  let res = "";
  for (let i = 0; i < text.length; i++) {
    if (/[A-Z]/.test(text[i])) {
      let k = fullKey[i % fullKey.length].charCodeAt(0) - 65;
      let t = text[i].charCodeAt(0) - 65;
      let code = mod(t + (decrypt ? -k : k), 26);
      res += String.fromCharCode(65 + code);
    } else {
      res += text[i];
    }
  }
  return res;
}

// Porta (simplifiée)
function porta(text) {
  return atbash(text); // version simplifiée
}

// Beaufort
function beaufort(text, key) {
  text = toUpper(text);
  key = toUpper(key);
  let res = "";
  for (let i = 0; i < text.length; i++) {
    let k = key[i % key.length].charCodeAt(0) - 65;
    let t = text[i].charCodeAt(0) - 65;
    let code = mod(k - t, 26);
    res += String.fromCharCode(65 + code);
  }
  return res;
}

// Vernam
function vernam(text, key) {
  text = toUpper(text);
  key = toUpper(key);
  let res = "";
  for (let i = 0; i < text.length; i++) {
    let c = text[i].charCodeAt(0) - 65;
    let k = key[i % key.length].charCodeAt(0) - 65;
    res += String.fromCharCode(65 + (c ^ k));
  }
  return res;
}


// Fonction principale
function run() {
  const text = document.getElementById("text").value;
  const key = document.getElementById("key").value;
  const method = document.getElementById("method").value;
  const action = document.getElementById("action").value;
  const decrypt = (action === "decrypt");
  let result = "";

  switch(method) {
    case "cesar": result = cesar(text, key || "3", decrypt); break;
    case "substitution": result = substitution(text, decrypt); break;
    case "atbash": result = atbash(text); break;
    case "rot13": result = rot13(text); break;
    case "albam": result = albam(text); break;
    case "polybe": result = decrypt ? polybeDecrypt(text) : polybeEncrypt(text); break;
    case "trithemius": result = trithemius(text, decrypt); break;
    case "vigenere": result = vigenere(text, key || "KEY", decrypt); break;
    case "autokey": result = autokey(text, key || "KEY", decrypt); break;
    case "porta": result = porta(text); break;
    case "beaufort": result = beaufort(text, key || "KEY"); break;
    case "vernam": result = vernam(text, key || "KEY"); break;
    default: result = "Méthode inconnue";
  }

  document.getElementById("result").innerText = result;
}

