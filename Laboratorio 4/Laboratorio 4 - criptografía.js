// ==UserScript==
// @name         Laboratorio 4 - criptografía
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://cripto.tiiny.site/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiiny.site
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  // Agrega un elemento <script> para cargar crypto-js
  const scriptElement = document.createElement("script");
  scriptElement.src =
    "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js";
  scriptElement.integrity =
    "sha512-a+SUDuwNzXDvz4XrIcXHuCf089/iJAoN4lmrXJg18XnduKK6YlDHNRalv4yd1N40OKI80tFidF+rqTFKGPoWFQ==";
  scriptElement.crossOrigin = "anonymous";

  scriptElement.onload = function () {
    const paragraph = document.querySelector("p");

    const key = Get_Key(paragraph);

    console.log(`La llave es : ${key}`);

    const encrypted_messages = Get_Encrypted_Messages();

    const decrypted_messages = Get_Decrypted_Messages(encrypted_messages, key);

    console.log(`Los mensajes cifrados son : ${encrypted_messages.length}`);

    for (let i = 0; i < encrypted_messages.length; i++) {
      console.log(
        `Mensaje ${i + 1} : ${encrypted_messages[i]} -> ${
          decrypted_messages[i]
        }`
      );
    }

    Put_Decrypted_Messages_On_Screen(encrypted_messages, decrypted_messages);
  };

  document.head.appendChild(scriptElement);
})();

function Get_Key(paragraph) {
  const paragraph_content = paragraph.textContent;

  const content_between_dots = paragraph_content.trim().split(".");

  let first_letters = [];

  for (let i = 0; i < content_between_dots.length; i++) {
    const letter = content_between_dots[i].trim().charAt(0);
    if (letter == "") continue;

    first_letters.push(letter);
  }

  const key = first_letters.join("");

  return key;
}

function Get_Encrypted_Messages() {
  const encrypted_messages = [];
  let iterator = 1;

  while (true) {
    const message = document.querySelector(`.M${iterator}`);
    if (message == null) break;

    encrypted_messages.push(message.id);

    iterator++;
  }

  return encrypted_messages;
}

function Get_Decrypted_Messages(encrypted_messages, key) {
  // Definir la clave para 3DES
  var triple_DES_Key = CryptoJS.enc.Utf8.parse(key); // Reemplaza con tu clave

  // Configurar los parámetros para la desencriptación
  var options = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };

  const decrypted_messages = [];

  for (let i = 0; i < encrypted_messages.length; i++) {
    // Decodificar el texto encriptado de base64
    var encryptedText = CryptoJS.enc.Base64.parse(encrypted_messages[i]);

    // Desencriptar el texto
    var decrypted = CryptoJS.TripleDES.decrypt(
      { ciphertext: encryptedText },
      triple_DES_Key,
      options
    );

    // Convertir el resultado a texto legible
    var plaintext = decrypted.toString(CryptoJS.enc.Utf8);

    decrypted_messages.push(plaintext);
  }

  return decrypted_messages;
}

function Put_Decrypted_Messages_On_Screen(encrypted_messages,decrypted_messages) {
  const message_container = document.createElement("div");
  message_container.style.display = "flex";
  message_container.style.flexDirection = "column";
  message_container.style.gap = "21px";
  message_container.style.position = "fixed";

  message_container.style.padding = "30px";

  message_container.style.background = "black";
  message_container.style.color = "ghostwhite";
  message_container.style.top = "50%";
  message_container.style.left = "50%";
  message_container.style.transform = "translate(-50%, -50%)";
  message_container.style.boxShadow = "rgba(0, 0, 0, 0.5) 0px 0px 20px 6px";
  message_container.style.borderRadius = "10px";

  for (let i = 0; i < encrypted_messages.length; i++) {

    const text_row = document.createElement("div")
    const message_number_label = document.createElement("label")
    const encrypted_message_label = document.createElement("label")
    const decrypted_message_label = document.createElement("label")

    message_number_label.textContent = `Mensaje ${i + 1} : `
    encrypted_message_label.textContent = encrypted_messages[i]
    decrypted_message_label.textContent = decrypted_messages[i]

    encrypted_message_label.style.color = "red"
    decrypted_message_label.style.color = "lawngreen"
    

    text_row.append(message_number_label)
    text_row.append(encrypted_message_label)
    text_row.append(" - ")
    text_row.append(decrypted_message_label)


    message_container.append(text_row)
  }

  document.body.append(message_container);
}
