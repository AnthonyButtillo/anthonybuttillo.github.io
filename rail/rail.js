let part = "";
let token = "";
let outputSheet = "";

let mappings = {};

document.onload = onLoad();

function onLoad() {
    token = getTokenCookie();
    const urlParams = new URLSearchParams(window.location.search);
    part = urlParams.get('part');
    startConstruction("parts/" + part + ".json");
}

function constructionFinished(data) {
    addPopulateBtn()
    stampsInit(data);
}

function formInputChanged(event) {
    stampInputChanged(event);
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
    try {
        const data = await getRowsSmall(4484682184871812, token);

        let found = false;
        if (data !== null) {
            for (let row of data.rows) {
                if (row.cells[0].columnId === 3770961391996804 && row.cells[0].value.startsWith(part))
                    if (row.cells[1].columnId === 8274561019367300 && row.cells[1].displayValue === document.getElementById("counter_input").value) {
                        populateField("pierce_avg_input", row.cells[3]);
                        populateField("od_avg_input", row.cells[5]);
                        populateField("od_round_input", row.cells[6]);
                        populateField("od_conc_input", row.cells[7]);
                        populateField("id_avg_input", row.cells[8]);
                        populateField("id_round_input", row.cells[9]);
                        populateField("oal_min_input", row.cells[10]);
                        populateField("oal_max_input", row.cells[11]);
                        populateField("oal_avg_input", row.cells[12]);
                        populateField("step_min_input", row.cells[13]);
                        populateField("step_max_input", row.cells[14]);
                        populateField("step_avg_input", row.cells[15]);
                        found = true;
                        break;
                    }
            }
        }

        if (!found) alert("No Matching Data Found");
        return;
    } catch (e) {
        console.error(e);
    }

    alert("Populate Failed. Please Try again.")
}

function populateField(id, input) {
    if (document.getElementById(id) === null || input.value === undefined) return;
    document.getElementById(id).value = input.displayValue;
}

async function trySubmit(event) {
    const submitBtn = document.getElementById("submitbtn");
    submitBtn.disabled = true;

    const formData = Object.fromEntries(new FormData(event.target));
    const output = [];

    for (let id in formData) {
        output.push({
            "columnId": mappings[id],
            "value": formData[id]
        })
    }

    console.log(output);
    try {
        const data = await postRows(output, outputSheet, token);
        console.log(data);

        if (data !== null) {
            window.location.reload();
            return;
        }
    } catch (e) {
        console.error(e);
    }

    submitBtn.disabled = false;
    alert("Submit Failed. Please Try again.")
}