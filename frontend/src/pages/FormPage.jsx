import './FormPage.css';

function AddressUpdater() {
    const address = document.getElementById("address");
    let map = document.getElementById("map");
    map.src = "https://maps.google.com/maps?q=" + address.value + "&output=embed";
}

function FormPage() {
    return (
        <div class="flexcolumn center alittlegap">
            <form>
                <div class="flexcolumn abiggergap center">
                    <div class="flexcolumn verticalcenter whitebox lightboxshadow">
                        <h1>Report a noise incident</h1>
                        <p>Help improve your neighbourhood by logging noise
                            events</p>
                    </div>
                    <div class="flexrow alittlegap spacebetween lightgreybox lightboxshadow">
                        <div class="flexcolumn center whitebox lightboxshadow">
                            <div>
                                <h1>Details</h1>
                            </div>
                            <div class="flexcolumn alittlegap">
                                <div class="flexrow spacebetween alittlegap">
                                    <label>Noise Type</label>
                                    <input type="text"></input>
                                </div>
                                <div class="flexrow spacebetween alittlegap">
                                    <label>Date & Time</label>
                                    <input type="datetime"></input>
                                </div>
                                <div class="flexrow spacebetween alittlegap">
                                    <label>Severity</label>
                                    <input type="range" min="1" max="10" value="1" list="notches"></input>
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
                                    <textarea rows="5" cols="25"></textarea>
                                </div>
                                <div class="flexrow spacebetween alittlegap">
                                    <label>tags</label>
                                    <input type="text"></input>
                                </div>
                            </div>
                        </div>
                        <div class="flexcolumn center whitebox lightboxshadow">
                            <div>
                                <h1>Location</h1>
                            </div>
                            <div class="flexcolumn alittlegap">
                                <iframe
                                    id="map"
                                    src="https://maps.google.com/maps?q=gu3+3qe&output=embed"
                                    width="600" height="450"
                                    allowfullscreen loading="lazy"
                                    referrerpolicy="no-referrer-when-downgrade"></iframe>
                                <div>
                                    <div class="flexrow spacebetween">
                                        <label>Address</label>
                                        <div>
                                            <input type="text" id="address" onInput={AddressUpdater}></input>
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
                    <input type="submit" value="Send Report" class="hundred"></input>
                </div>
            </form>
        </div>
    );
}

export default FormPage;