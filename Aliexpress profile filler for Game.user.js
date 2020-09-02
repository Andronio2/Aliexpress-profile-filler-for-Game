// ==UserScript==
// @name         Aliexpress profile filler for Game
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Изменяет в профиле страну на заданную и заполняет поля
// @author       Andronio
// @homepage     https://github.com/Andronio2/Aliexpress-profile-filler-for-Game
// @supportURL   https://github.com/Andronio2/Aliexpress-profile-filler-for-Game/issues
// @updateURL    https://github.com/Andronio2/Aliexpress-profile-filler-for-Game/raw/master/Aliexpress%20profile%20filler%20for%20Game.user.js
// @downloadURL  https://github.com/Andronio2/Aliexpress-profile-filler-for-Game/raw/master/Aliexpress%20profile%20filler%20for%20Game.user.js
// @match        https://accounts.aliexpress.com/user/organization/manage_person_profile.htm?isEdit=true
// @grant        none
// ==/UserScript==
let profileLoadPageCounter = 50;
(function repeat() {
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
    let countrySelect = document.getElementById('countrySelect');
    let countryInput = document.querySelector('input[name="_fmu.e._0.co"]');
    if (--profileLoadPageCounter) {
        if (!countrySelect && !countryInput) return setTimeout(repeat, 200);
    } else return;
    if (countryInput) {
        location.reload();
        return;
    }
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

        if (genderMale.checked == false && genderFemale.checked == false) {
            if (Math.random() > 0.5) {
                genderMale.checked = true;
            } else {
                genderFemale.checked = true;
            }
        }

        if (allInput[10].value == "") allInput[10].value = randomString(9);
        if (allInput[11].value == "") allInput[11].value = randomString(9);
        if (allInput[13].value == "") allInput[13].value = getRandomInt(999999);

        allInput[14].value = "1";
        allInput[15].value = getRandomInt(999);
        allInput[16].value = getRandomInt(99999999);
        allInput[17].value = "1";
        allInput[5].value = country;
        submitButton.click();
    }

    function randomString(i)
    {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz";

        while (text.length < i)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max)).toString();
    }

})();
