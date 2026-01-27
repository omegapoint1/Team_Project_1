function FormPage() {
  return (
     <div class="flexcolumn center alittlegap">
        <div class="flexrow spacebetween verticalcenter navbar" style="width:100%;">
            <div>
                <h1>Neighbourhood Noise</h1>
            </div>
            <div class="flexrow spacebetween alittlegap verticalcenter">
                <a href="#">Dashboard</a>
                <a href="#">Quests</a>
                <a href="#">Report</a>
                <a href="#">Profile</a>
            </div>
        </div>
        <form style="width:60%;">
            <div class="flexcolumn abiggergap center">
                <div class="flexcolumn verticalcenter whitebox lightboxshadow">
                    <h1>Report a noise incident</h1>
                    <p>Help improve your neighbourhood by logging noise
                        events</p>
                </div>
                <div class="flexrow alittlegap spacebetween lightgreybox lightboxshadow" style="width:100%;">
                    <div class="flexcolumn center whitebox lightboxshadow">
                        <div>
                            <h1>Details</h1>
                        </div>
                        <div class="flexcolumn alittlegap">
                            <div class="flexrow spacebetween alittlegap">
                                <label>Noise Type</label>
                                <input type="text">
                            </div>
                            <div class="flexrow spacebetween alittlegap">
                                <label>Date & Time</label>
                                <input type="datetime">
                            </div>
                            <div class="flexrow spacebetween alittlegap">
                                <label>Severity</label>
                                <input type="range" min="1" max="10" value="1" list="notches">
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
                                <input type="text">
                            </div>
                        </div>
                    </div>
                    <div class="flexcolumn center whitebox lightboxshadow">
                        <div>
                            <h1>Location</h1>
                        </div>
                        <div class="flexcolumn alittlegap">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d38952.06011810312!2d-3.53830575!3d50.7400822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x486da4113c8130b1%3A0x7f3efd04b3287246!2sUniversity%20of%20Exeter!5e1!3m2!1sen!2suk!4v1769360134256!5m2!1sen!2suk"
                                width="600" height="450" style="border:0;"
                                allowfullscreen loading="lazy"
                                referrerpolicy="no-referrer-when-downgrade"></iframe>
                            <div>
                                <div class="flexrow spacebetween">
                                    <label>Address</label>
                                    <div>
                                        <input type="text">
                                    </div>
                                </div>
                                <div class="flexrow spacebetween">
                                    <label>Anonymous</label>
                                    <div>
                                        <input type="checkbox" value="Send Report">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <input type="submit" value="Send Report" style="max-width: 100px;">
            </div>
        </form>
    </div>
  );
}

export default FormPage;