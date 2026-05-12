let part = "";
let token = "";

let mappings = {};

document.onload = onLoad();

function onLoad() {
    token = getTokenCookie();
    const urlParams = new URLSearchParams(window.location.search);
    part = urlParams.get('part');
    startConstruction();
}

function constructionFinished() {
    addPopulateBtn()
}

function addPopulateBtn() {
    const btn = document.createElement("button");
    btn.onclick = populate;
    btn.innerHTML = "Populate";
    btn.type = "button";

    let node = document.getElementById("cmm_label_label");

    node.appendChild(btn);
    node.appendChild(document.createElement("br"));
}

async function populate() {
    const query = new URLSearchParams({
        pageSize: '5',
        page: '1'
    }).toString();

    const sheetId = '4484682184871812';
    const resp = await fetch(
        `https://corsproxy.io/?url=https://api.smartsheet.com/2.0/sheets/${sheetId}?${query}`,
        {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + token, Accept: 'string'
            }
        }
    );

    const data = JSON.parse(await resp.text());

    let found = false;
    for (let row of data.rows) {
        if (row.cells[0].columnId === 3770961391996804 && row.cells[0].value.startsWith("1207"))
            if (row.cells[1].columnId === 8274561019367300 && row.cells[1].displayValue === document.getElementById("counter_input").value) {
                document.getElementById("pierce_avg_input").value = row.cells[3].displayValue;
                document.getElementById("od_avg_input").value = row.cells[5].displayValue;
                document.getElementById("od_round_input").value = row.cells[6].displayValue;
                document.getElementById("id_avg_input").value = row.cells[8].displayValue;
                document.getElementById("id_round_input").value = row.cells[9].displayValue;
                document.getElementById("oal_min_input").value = row.cells[10].displayValue;
                document.getElementById("oal_max_input").value = row.cells[11].displayValue;
                document.getElementById("oal_avg_input").value = row.cells[12].displayValue;
                document.getElementById("step_min_input").value = row.cells[13].displayValue;
                document.getElementById("step_max_input").value = row.cells[14].displayValue;
                document.getElementById("step_avg_input").value = row.cells[15].displayValue;
                found = true;
                break;
            }

    }

    if (!found) alert("No Matching Data Found");
}

async function trySubmit(event) {
    const formData = Object.fromEntries(new FormData(event.target));
    console.log(formData["insp_type"]);

    const output = [];

    for (let id in formData) {
        output.push({
            "columnId": mappings[id],
            "value": formData[id]
        })
    }

    console.log(output);

    const query = new URLSearchParams({
        accessApiLevel: '0',
        allowPartialSuccess: 'false',
        overrideValidation: 'false'
    }).toString();

    const sheetId = '4571336026312580';
    const request = new Request(
        `https://corsproxy.io/?url=https://api.smartsheet.com/2.0/sheets/${sheetId}/rows?${query}`,
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'
                },
                body: JSON.stringify([
                    {
                        "toTop": true,
                        "cells": output
                    }
                ])
            }
    );

    const data = await sendData(request)

    console.log(data);
    startConstruction();
}

async function sendData(request) {
    const resp = await fetch(request.clone());
    console.log(resp);
    return await resp.json;
}