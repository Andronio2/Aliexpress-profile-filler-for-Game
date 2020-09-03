// ==UserScript==
// @name         Aliexpress profile filler for Game
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Изменяет в профиле страну на заданную и заполняет поля
// @author       Andronio
// @homepage     https://github.com/Andronio2/Aliexpress-profile-filler-for-Game
// @supportURL   https://github.com/Andronio2/Aliexpress-profile-filler-for-Game/issues
// @updateURL    https://github.com/Andronio2/Aliexpress-profile-filler-for-Game/raw/master/Aliexpress%20profile%20filler%20for%20Game.user.js
// @downloadURL  https://github.com/Andronio2/Aliexpress-profile-filler-for-Game/raw/master/Aliexpress%20profile%20filler%20for%20Game.user.js
// @match        https://accounts.aliexpress.com/user/organization/manage_person_profile.htm?isEdit=true
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
let settings = [
/*
 * здесь начинаются настройки
 */

    "US", "ES", "DE", "RU", "KZ", 500

/*
 * Конец настроек, дальше не трогать
 */
];
    let div = document.createElement('div');
    div.className = 'mybox-profile-changer';

    for (let i = 0; i < settings.length - 1; i++) {
        div.innerHTML += `<button type="button" class="dpl-btn" data-country="${settings[i]}">Fill ${settings[i]}</button>`;
    }

// Стили
    let styles = `
    .mybox-profile-changer {
    position: fixed;
    top: 0;
    right: 0;
    background: white;
    box-shadow: 1px -1px 4px 1px;
    max-width: 40%;
    padding: 10px 20px;
    overflow-y: hidden;
    overflow-x: auto;
    z-index:9999;
    }`

    let styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = styles
    document.head.append(styleSheet)
    document.body.append(div);
    div.addEventListener('click', btnHandler);

    async function btnHandler(event) {
        let elem = event.target;
        if (elem.tagName != 'BUTTON') return;
        let country = elem.dataset.country;
        let genderMale = document.getElementById("mr");
        let genderFemale = document.getElementById("ms");
        let countrySel = document.getElementById("countrySelect");
        let allInput = document.querySelectorAll("input");
        let submitButton = document.getElementById("formSubmit");
        let countryInput = document.querySelector('input[name="_fmu.e._0.co"]');

// Выбор страны
        if (countryInput) {
            countryInput.value = country;
        } else {
            let isCountryPresent = false;
            let availableCountry = document.querySelectorAll('#countrySelect option');
            availableCountry.forEach(cntr => {
                if (cntr.value == country) isCountryPresent = true;
            });
            if (!isCountryPresent) return alert('Такой страны нет в списке');
            countrySel.value = country;
            countrySel.onchange();
            await sleep(settings[settings.length - 1]);
            let province = document.querySelectorAll('#provinceWrap td select');
            let isSelect = false;
            let i;
            for (i = 0; i < province.length; i++) {
                if (province[i].style.display != "none") {
                    isSelect = true;
                    break;
                }
            }
            if (isSelect) {
                province[i].selectedIndex = Math.floor(Math.random() * (province[i].length - 2) + 1);
            } else {
                allInput[12].value = randomString(9);
            }
        }
// Пол
        if (genderMale.checked == false && genderFemale.checked == false) {
            if (Math.random() > 0.5) {
                genderMale.checked = true;
            } else {
                genderFemale.checked = true;
            }
        }
        document.querySelector('input[name="_fmu.e._0.f"]').value = country;
        if (document.querySelector('input[name="_fmu.e._0.l"]').value == "") document.querySelector('input[name="_fmu.e._0.l"]').value = randomString(9); // Имя
        if (document.querySelector('input[name="_fmu.e._0.ad"]').value == "") document.querySelector('input[name="_fmu.e._0.ad"]').value = randomString(9); // Адрес
        if (document.querySelector('input[name="_fmu.e._0.c"]').value == "") document.querySelector('input[name="_fmu.e._0.c"]').value = randomString(9); // Город
        if (document.querySelector('input[name="_fmu.e._0.z"]').value == "") document.querySelector('input[name="_fmu.e._0.z"]').value = randomIntString(5); // Индекс

        document.querySelector('input[name="_fmu.e._0.ph"]').value = document.querySelector('input[name="_fmu.e._0.fa"]').value = '1';
        document.querySelector('input[name="_fmu.e._0.pho"]').value = document.querySelector('input[name="_fmu.e._0.fax"]').value = randomIntString(3); // Тел код
        document.querySelector('input[name="_fmu.e._0.phon"]').value = document.querySelector('input[name="_fmu.e._0.faxn"]').value = randomIntString(8); // Тел код
        submitButton.click();
    }

    function randomString(i) {
        let text = "";
        let possible = "abcdefghijklmnopqrstuvwxyz";

        while (text.length < i)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    function randomIntString(i) {
        let text = "";
        let possible = "0123456789";

        while (text.length < i)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
})();
