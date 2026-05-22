let stamps = {};

function stampsInit(data) {
    stamps = data.stamps;

    let stamp12Labels = document.getElementsByClassName("id_stamp_12");

    for (let stamp of stamp12Labels) {
        if (stamp.classList.contains("input_radio_label")) {
            stamp.innerHTML = stamp12Date(stamp.innerHTML);
        }
    }
}

function stampInputChanged(event) {
    const name = event.target.name;

    if (name === "part" || name === "machine") {
        let parts = document.getElementsByName("part");
        for (let part of parts) {
            if (part.checked) {
                let p1 = part.value.split(".")[0];
                let p2 = part.value.split(".")[1];
                let data = stamps[p1];

                let machines = document.getElementsByName("machine");
                for (let machine of machines) {
                    if (machine.checked) {
                        let stamp12 = data["12"];
                        stamp12 = stamp12Date(stamp12);
                        if (p2 === "F1") stamp12 = stamp12.replace("<CODE>", "USA");
                        if (p2 === "MX") stamp12 = stamp12.replace("<CODE>", "MEX");
                        if (p2 === "CH") stamp12 = stamp12.replace("<CODE>", "CHINA");
                        if (p2 === "IN") stamp12 = stamp12.replace("<CODE>", "INDIA");
                        stamp12 = stamp12.replace("<LINE>", machine.value.substring(machine.value.length - 2));

                        document.getElementById("stamps_label_label_sub").innerHTML =
                            part.value + " - " + machine.value + " - " + stamp12Date("(MM-YY)").replace(" -", "-") + "<br><br><table>" +
                            "<tr><td>9:00</td><td>: " + data["9"] + "</td></tr>" +
                            "<tr><td>12:00</td><td>: " + stamp12 + "</td></tr>" +
                            "<tr><td>3:00</td><td>: " + data["3"] + "</td></tr>" +
                            "<tr><td>6:00</td><td>: " + data["6"] + "</td></tr>" +
                            "</table>";
                        break;
                    }
                }
                break;
            }
        }
    }
}

function stamp12Date(input) {
    const date = new Date();
    return input.replace("MM-YY", (date.getMonth() + 1).toString().padStart(2, "0") + " -" + date.getFullYear().toString().substring(2));
}