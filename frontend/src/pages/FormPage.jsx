function FormPage() {
  return (
    <div class="flexcolumn center">
        <div>
            <!-- navbar -->
        </div>
        <form>
            <div class="flexcolumn">
                <div class="flexcolumn">
                    <h1>Report a noise incident</h1>
                    <p>Help improve your neighbourhood by loggin noise
                        events</p>
                </div>
                <div class="flexrow alittlegap">
                    <div class="flexcolumn center">
                        <div>
                            <h1>Details</h1>
                        </div>
                        <div class="flexcolumn">
                            <div class="flexrow spacebetween">
                                <label>Noise Type</label>
                                <input type="text">
                            </div>
                            <div class="flexrow spacebetween">
                                <label>Date & Time</label>
                                <input type="datetime">
                            </div>
                            <div class="flexrow spacebetween">
                                <label>Severity</label>
                                <input type="range" min="1" max="10" value="1">
                            </div>
                            <div class="flexrow spacebetween">
                                <label>Noise Type</label>
                                <input type="text">
                            </div>
                            <div class="flexrow spacebetween">
                                <label>tags</label>
                                <input type="text">
                            </div>
                        </div>
                    </div>
                    <div class="flexcolumn center">
                        <div>
                            <h1>Location</h1>
                        </div>
                        <div class="flexcolumn">
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
                <input type="submit" value="Send Report">
            </div>
        </form>
    </div>
  );
}

export default FormPage;