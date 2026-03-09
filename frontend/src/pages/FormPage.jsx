import './FormPage.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useState } from 'react';

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
function CheckValidity(noisetype, datetime, severity, description, zone, tags) {
    if (noisetype === "" || datetime === "" || description === "") {
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

// performs the submission of the form in a json format while also doing some basid validity checking
async function Submit(event) {
    event.preventDefault();
    const noisetype = document.getElementById("noisetype").value;
    const datetime = document.getElementById("datetime").value;
    const severity = document.getElementById("severity").value;
    const description = document.getElementById("description").value;
    const position = document.getElementById("position").value;
    const zone = document.getElementById("zone").value;
    const tags = GetAllTags();
    if (!CheckValidity(noisetype, datetime, severity, description, zone, tags)) {
        return;
    }
    const [lat, long] = position.split(",");
    const request = {
        "noisetype": noisetype,
        "datetime": datetime,
        "severity": severity,
        "description": description,
        "location_of_noise": "nil",
        "zone": zone,
        "tags": tags,
        "lat": lat,
        "long": long,
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

function MapClick() {
    const [position, setPosition] = useState(null);
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            console.log('Clicked at: ', lat, lng);
            setPosition(e.latlng);
            document.getElementById("position").value = `${lat},${lng}`;
        }
    });
    return position === null ? null : (
        <Marker position={position}>
            <Popup>
                Lat: {position.lat.toFixed(5)}<br />
                Lng: {position.lng.toFixed(5)}
            </Popup>
        </Marker>
    );

}

function FormPage() {
    let position = [50.737277, -3.537556];
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
                                    <div class="formflexcolumn">
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
                                        <div class="slidernumbers">
                                            <span>1</span>
                                            <span>2</span>
                                            <span>3</span>
                                            <span>4</span>
                                            <span>5</span>
                                            <span>6</span>
                                            <span>7</span>
                                            <span>8</span>
                                            <span>9</span>
                                            <span>10</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="formflexrow formspacebetween formalittlegap">
                                    <label>Description</label>
                                    <textarea
                                        id="description"
                                        rows="5"
                                        cols="25"
                                        class="explaintextinput"
                                        placeholder="Please do not include any personal or sensitive information."
                                    ></textarea>
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
                                <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '400px', width: '100%' }}>
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <MapClick />
                                </MapContainer>
                                <input type="hidden" id="position" value={position}></input>
                                <div>
                                    <div class="formflexcolumn formspacebetween">
                                        <div class="formflexrow formspacebetween">
                                            <label>Zone</label>
                                            <select id="zone">
                                                <option value="North-West">North West</option>
                                                <option value="North-Central-West">North Central West</option>
                                                <option value="North-Central-East">North Central East</option>
                                                <option value="North-East">North East</option>
                                                <option value="Central-North-West">Central North West</option>
                                                <option value="Central-North-Central-West">Central North Central West</option>
                                                <option value="Central-North-Central-East">Central North Central East</option>
                                                <option value="Central-North-East">Central North East</option>
                                                <option value="Central-South-West">Central South West</option>
                                                <option value="Central-South-Central-West">Central South Central-West</option>
                                                <option value="Central-South-Central-East">Central South Central-East</option>
                                                <option value="Central-South-East">Central South East</option>
                                                <option value="South-West">South West</option>
                                                <option value="South-Central-West">South Central West</option>
                                                <option value="South-Central-East">South Central East</option>
                                                <option value="South-East">South East</option>
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