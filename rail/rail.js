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
    try {
        const data = await getRowsSmall(4484682184871812, token);


        if (data !== null) {
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
        }

        if (!found) alert("No Matching Data Found");
        return;
    } catch (e) {
        console.error(e);
    }

    alert("Populate Failed. Please Try again.")
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
        const data = await postRows(output, 4571336026312580, token);
        console.log(data);

        if (data !== null) {
            startConstruction();
            return;
        }
    } catch (e) {
        console.error(e);
    }

    submitBtn.disabled = false;
    alert("Submit Failed. Please Try again.")
}