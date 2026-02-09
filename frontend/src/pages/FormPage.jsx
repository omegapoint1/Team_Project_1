import './FormPage.css';

function AddressUpdater() {
    const address = document.getElementById("address");
    let map = document.getElementById("map");
    map.src = "https://maps.google.com/maps?q=" + address.value + "&output=embed";
}

function TagsAdder(event) {
    if (event.key === " ") {
        let tag = event.target.value;
        event.target.value = "";
        let tagsection = document.getElementById("tags");
        tagsection.innerHTML += "<div class=\"smallwhiteborderbox\">" + tag + "</div>";
        console.log("added tag");
    }
}

function FormPage() {
    return (
        <div class="flexcolumn center alittlegap margin">
            <form class="flexcolumn center ">
                <div class="flexcolumn abiggergap center test">
                    <div class="flexcolumn verticalcenter whitebox lightboxshadow">
                        <h1>Report a noise incident</h1>
                        <p>Help improve your neighbourhood by logging noise
                            events</p>
                    </div>
                    <div class="flexrow alittlegap spacebetween lightgreybox lightboxshadow hundy">
                        <div class="flexcolumn center whitebox boxes lightboxshadow">
                            <div>
                                <h1>Details</h1>
                            </div>
                            <div class="flexcolumn alittlegap">
                                <div class="flexrow spacebetween alittlegap">
                                    <label>Noise Type</label>
                                    <input type="text"  class="textinput"></input>
                                </div>
                                <div class="flexrow spacebetween alittlegap">
                                    <label>Date & Time</label>
                                    <input type="datetime" class="textinput"></input>
                                </div>
                                <div class="flexrow spacebetween alittlegap">
                                    <label>Severity</label>
                                    <input type="range" min="1" max="10" defaultValue="1" list="notches"></input>
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
                                <div class="flexrow spacebetween alittlegap">
                                    <label>Description</label>
                                    <textarea rows="5" cols="25" class="textinput"></textarea>
                                </div>
                                <div class="flexrow spacebetween alittlegap">
                                    <label>tags</label>
                                    <div id="tags">
                                        <input type="text" class="textinput" onKeyPress={TagsAdder}></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flexcolumn center whitebox boxes lightboxshadow">
                            <div>
                                <h1>Location</h1>
                            </div>
                            <div class="flexcolumn alittlegap">
                                <iframe
                                    id="map"
                                    src="https://maps.google.com/maps?q=University+of+exeter&output=embed"
                                    allowfullscreen loading="lazy"
                                    referrerpolicy="no-referrer-when-downgrade"></iframe>
                                <div>
                                    <div class="flexrow spacebetween">
                                        <label>Address</label>
                                        <div>
                                            <input type="text" id="address" onInput={AddressUpdater} class="textinput"></input>
                                        </div>
                                    </div>
                                    <div class="flexrow spacebetween">
                                        <label>Anonymous</label>
                                        <div>
                                            <input type="checkbox" value="Send Report"></input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <input type="submit" value="Send Report" class="submit"></input>
                </div>
            </form>
        </div>
    );
}

export default FormPage;