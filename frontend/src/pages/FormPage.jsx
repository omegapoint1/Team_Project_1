import './FormPage.css';

// updates the google maps embed based on the address input
function AddressUpdater() {
    const address = document.getElementById("address");
    let map = document.getElementById("map");
    map.src = "https://maps.google.com/maps?q=" + address.value + "&output=embed";
}

// function to remove the tag
function RemoveTag(event) {
    const button = event.target;
    button.parentNode.parentNode.remove();
}

// adds a new tag underneath the text input when the user presses the space bar
function TagsAdder(event) {
    if (event.key === " ") {
        let tag = event.target.value;
        event.target.value = "";
        // checks the tag is within the valid length
        if (tag.length > 20) {
            alert("Tag is too long");
            return;
        }
        // if valid creates a new tag object that can then be seen by the user and can also be deleted by pressing the button
        if (tag !== " ") {
            let tagsection = document.getElementById("tags");
            let pill = document.createElement("div");
            let tagdiv = document.createElement("div");
            let tagp = document.createElement("p");

            let remove = document.createElement("button");
            remove.value = "hello";
            remove.addEventListener("click", RemoveTag);


            pill.className = "formnopadding formpill";
            tagdiv.className = "formflexrow";
            tagp.textContent = tag;
            tagdiv.appendChild(tagp);
            tagdiv.appendChild(remove);
            pill.appendChild(tagdiv);
            tagsection.appendChild(pill);
        }
    }
}

// gets all the tags
function GetAllTags() {
    const tagscontainers = document.getElementById("tags").childNodes;
    let tags = [];
    for (let i = 0; i < tagscontainers.length; i++) {
        tags.push(tagscontainers[i].childNodes[0].childNodes[0].innerHTML);
    }
    return tags;
}

// checks the validity of all the values that need validating
function CheckValidity(noisetype, datetime, severity, description, address, zone, tags) {
    if (noisetype === "" || datetime === "" || description === "" || address === "") {
        alert("Make sure you have filled out all values");
        return false
    }
    if (noisetype.match("[^a-zA-Z]")) {
        alert("Noise type must only contain letters");
        return false;
    }
    console.log(datetime);
    if (!datetime.match(".*-.*-.*T.*:.*")) {
        alert("Date time does not match the correct format");
        return false;
    }
    if (severity < 1 || severity > 10) {
        alert("Severity must be between 1-10 inclusive");
        return false;
    }
    for (let i = 0; i < tags.length; i++) {
        if (tags[i].match("[^a-zA-Z]")) {
            alert("Tags must only contain letters");
            return false;
        }
    }
    return true;
}
// converts address to coordinates
async function ConvertToCoords(address) {
    address = address.replace(" ", "+")
    const response = await fetch("https://nominatim.openstreetmap.org/search?q=" + address + "&format=json", {
            method: "GET",
    });
    const data = await response.json();
    const { lat, lon } = data[0];
    // a default coord on failure
    if (lat == null || lon == null) {
        return { "lat" : "50.7392988", "long" : "-3.5456976" }
    }
    return { "lat" : lat, "long" : lon };
}

// performs the submission of the form in a json format while also doing some basid validity checking
async function Submit(event) {
    event.preventDefault();
    const noisetype = document.getElementById("noisetype").value;
    const datetime = document.getElementById("datetime").value;
    const severity = document.getElementById("severity").value;
    const description = document.getElementById("description").value;
    const address = document.getElementById("address").value;
    const zone = document.getElementById("zone").value;
    const tags = GetAllTags();
    if (!CheckValidity(noisetype, datetime, severity, description, address, zone, tags)) {
        return;
    }
    const { lat, long } = await ConvertToCoords(address);
    const request = {
        "noisetype": noisetype,
        "datetime": datetime,
        "severity": severity,
        "description": description,
        "address": address,
        "zone": zone,
        "tags": tags,
        "lat" : lat,
        "long" : long,
    };
    const response = await fetch("/api/report/store", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    })
    if (!response.ok) {
        alert("An error occured");
    } else {
        alert("Your report has been successfully logged");
    }
}

function FormPage() {
    return (
        <div class="formflexcolumn formcenter formalittlegap formmargin">
            <form onSubmit={Submit} class="formflexcolumn formcenter">
                <div class="formflexcolumn formabiggergap formcenter formmaindiv">
                    <div class="formflexcolumn formverticalcenter formwhitebox formlightboxshadow">
                        <h1>Report a noise incident</h1>
                        <p>Help improve your neighbourhood by logging noise
                            events</p>
                    </div>
                    <div class="formflexrow formalittlegap formspacebetween formlightgreybox formlightboxshadow formhundred">
                        <div class="formflexcolumn formcenter formwhitebox formboxes lightboxshadow">
                            <div>
                                <h1>Details</h1>
                            </div>
                            <div class="formflexcolumn formalittlegap">
                                <div class="formflexrow formspacebetween formalittlegap">
                                    <label>Noise Type</label>
                                    <input id="noisetype" type="text" class="explaintextinput"></input>
                                </div>
                                <div class="formflexrow formspacebetween formalittlegap">
                                    <label>Date & Time</label>
                                    <input id="datetime" type="datetime-local" class="explaintextinput"></input>
                                </div>
                                <div class="formflexrow formspacebetween formalittlegap">
                                    <label>Severity</label>
                                    <input id="severity" type="range" min="1" max="10" defaultValue="1" list="notches"></input>
                                    <datalist id="notches">
                                        <option value="1"></option>
                                        <option value="2"></option>
                                        <option value="3"></option>
                                        <option value="4"></option>
                                        <option value="5"></option>
                                        <option value="6"></option>
                                        <option value="7"></option>
                                        <option value="8"></option>
                                        <option value="9"></option>
                                        <option value="10"></option>
                                    </datalist>
                                </div>
                                <div class="formflexrow formspacebetween formalittlegap">
                                    <label>Description</label>
                                    <textarea id="description" rows="5" cols="25" class="explaintextinput"></textarea>
                                </div>
                                <div class="formflexrow formspacebetween formalittlegap">
                                    <label>tags</label>
                                    <div class="formflexcolumn">
                                        <input type="text" class="explaintextinput" onKeyPress={TagsAdder}></input>
                                        <div id="tags"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="formflexcolumn formcenter formwhitebox formboxes formlightboxshadow">
                            <div>
                                <h1>Location</h1>
                            </div>
                            <div class="formflexcolumn formalittlegap">
                                <iframe
                                    id="map"
                                    src="https://maps.google.com/maps?q=University+of+exeter&output=embed"
                                    allowfullscreen loading="lazy"
                                    referrerpolicy="no-referrer-when-downgrade"></iframe>
                                <div>
                                    <div class="formflexcolumn formspacebetween">
                                        <div class="formflexrow formspacebetween">
                                            <label>Address</label>
                                            <div>
                                                <input type="text" id="address" onInput={AddressUpdater} class="textinput"></input>
                                            </div>
                                        </div>
                                        <div class="formflexrow formspacebetween">
                                            <label>Zone</label>
                                            <select id="zone">
                                                <option value="A">Zone A</option>
                                                <option value="B">Zone B</option>
                                                <option value="C">Zone C</option>
                                                <option value="D">Zone D</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <input type="submit" value="Send Report" class="formsubmit"></input>
                </div>
            </form>
        </div>
    );
}

export default FormPage;