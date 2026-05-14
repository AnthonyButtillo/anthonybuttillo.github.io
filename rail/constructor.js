let logic = {};

async function startConstruction() {
    const resp = await fetch("parts/" + part + ".json");
    const raw = await resp.text();
    const data = JSON.parse(raw);

    document.getElementById("h1").innerHTML = data.header;
    document.getElementById("h2").innerHTML = data.sub_header;
    document.getElementById("logo").src = data.logo;
    document.title = data.header;

    const form = document.getElementById("form_inputs");
    form.innerHTML = "";
    for (let field of data["fields"]) {
        if (field.type !== "divider") {
            const label = document.createElement("label");
            label.innerHTML = field.label + (field.required ? "<strong style='color: #e03e36'> *</strong>" : "") + "<br>"
            label.id = field.id + "_label";
            label.setAttribute("class", "input_label" + " " + expandAllTags(field.id, field.tag));
            label.setAttribute("for", field.id);
            form.appendChild(label);

            if (field.sub_label) {
                const text = document.createElement("p");
                text.innerText = field.sub_label;
                text.setAttribute("class", "input_label_sub" + " " + expandAllTags(field.id, field.tag));
                text.id = field.id + "_label_sub";
                form.appendChild(text);
            }
            if (field.type === "label") {
                label.setAttribute("class", "input_label_label" + " " + expandAllTags(field.id, field.tag));
            } else {
                const errorSpan = document.createElement("span");
                errorSpan.setAttribute("class", "input_error" + " " + expandAllTags(field.id, field.tag));
                errorSpan.id = field.id + "_error";
                errorSpan.style.display = 'none';
                //form.appendChild(errorSpan)
            }
        }

        if (field.type === "radio") {
            for (let j in field.options) {
                let option = field.options[j];
                const item = document.createElement("input");
                item.setAttribute("class", "input_radio" + " " + expandAllTags(field.id, field.tag));
                item.setAttribute("onChange", "formInputChanged(event);");
                item.type = field.type;
                item.name = field.id;
                if (typeof (option) === "string") option = {id: option, display: option};
                item.id = field.id + "_input_option_" + option.id;
                item.value = option.id;
                item.required = field.required;

                if (option.id === field.default) item.checked = true;
                form.appendChild(item);

                const label = document.createElement("label");
                label.setAttribute("for", option.id);
                label.setAttribute("class", "input_radio_label" + " " + expandAllTags(field.id, field.tag));
                label.id = item.id + "_label";
                label.innerHTML = option.display + "<br>"
                form.appendChild(label);
            }
        } else if (field.type === "divider") {
            const item = document.createElement("hr");
            item.setAttribute("class", "input_" + field.type + " " + expandAllTags(field.id, field.tag));
            item.id = field.id + "_divider";
            form.appendChild(item);
        } else if (field.type === "label") {
            continue;
        } else {
            const item = document.createElement("input");
            item.setAttribute("class", "input_" + field.type + " " + expandAllTags(field.id, field.tag));
            item.setAttribute("onChange", "formInputChanged(event);");
            item.type = field.type;
            item.name = field.id;
            item.id = field.id + "_input";
            item.required = field.required;
            if (field.type === "number") {
                item.min = field.min;
                item.max = field.max;
                if (field.decimals) {
                    item.setAttribute("step", "0." + "0".repeat(field.decimals - 1) + "1");
                    item.setAttribute("inputmode", "decimal");
                }
            } else if (field.type === "date") {
                if (field.auto_date === "today_respect_nights") {
                    const date = new Date();
                    if (date.getHours() < 6) date.setDate(date.getDate() - 1);
                    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                    item.valueAsDate = date;
                }
            } else if (field.type === "text") {
                if (field.pattern) item.setAttribute("pattern", field.pattern);
            }
            form.appendChild(item);
        }

        if (field.type !== "divider" && field.type !== "label") {
            mappings[field.id] = field.output;
        }

        const br = document.createElement("br");
        br.setAttribute("class", "br" + " " + expandAllTags(field.id, field.tag));
        br.id = field.id + "_br";
        form.appendChild(br);
    }

    const subBtn = document.createElement("input");
    subBtn.type = "submit";
    subBtn.value = "Submit";
    subBtn.id = "submitbtn";
    form.appendChild(subBtn);

    parseLogic(data["logic"]);
    checkLogic();
    constructionFinished();
}

function formInputChanged(event) {
    const id = event.target.name;

    console.log(id);
    // for (let node of document.getElementsByName(id)) {
    // console.log(node);
    // document.getElementById(id + "_error").innerHTML = "Test Error";
    //document.getElementById(id + "_error") .style.display = '';
    //}

    checkLogic();
}

function checkLogic() {
    const form = document.getElementById("form_inputs");
    const formData = Object.fromEntries(new FormData(form));

    for (let node of form.children) {
        if (!logic[node.id]) continue;

        let conditionMet = false;

        for (let condition of logic[node.id]) {
            if (condition.value_special === "any") {
                if (formData[condition.target] !== undefined) {
                    conditionMet = true;
                    break;
                }
            } else if (formData[condition.target] === condition.value) {
                conditionMet = true;
                break;
            }
        }

        if (conditionMet) {
            node.style.display = '';
            node.disabled = false;
        } else {
            node.style.display = 'none';
            node.disabled = true;
        }
    }
}

function parseLogic(data) {
    logic = {};
    for (let entry of data) {
        //let condition = {};
        //condition.target = entry.conditions[0].target;
        //condition.value = entry.conditions[0].value;

        for (let target of entry.target.split(",")) {
            if (target.startsWith("#")) {
                let elements = form.getElementsByClassName("tag_" + target.substring(1));
                for (let element of elements) {
                    if (!logic[element.id]) logic[element.id] = [];
                    logic[element.id].push(entry.conditions[0]);
                }
            } else {
                let elements = form.getElementsByClassName("id_" + target);
                for (let element of elements) {
                    if (!logic[element.id]) logic[element.id] = [];
                    logic[element.id].push(entry.conditions[0]);
                }
            }
        }
    }
}

function expandAllTags(id, tag) {
    let tags = "id_" + id + " ";
    if (tag === undefined) return tags;
    for (let item of tag.split(",")) {
        tags += "tag_" + item + " ";
    }
    return tags;
}
