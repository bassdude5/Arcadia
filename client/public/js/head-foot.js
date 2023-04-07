class myHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="header">
                <!--Javascript to access API-->
                <script>
                    var settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": "https://api",
                        "method": "GET"
                    }
                </script>

                <a href="/"><h1 style="color: #a81000">Arcadia</h1></a>
                <h3>
                <ul class="navigation_bar">
                    <li><a href="newest_games.html">NEWEST GAMES</a></li>
                    <li><a href="recommender.html">RECOMMENDER</a></li>
                    <li><a href="about.html">ABOUT</a></li>

                    <li style="float: right; padding-right: 10px;">
                        <button class="login" type="button" onclick="redirectToProfileOrLogin();">
                            <ion-icon class="head-icon" name="person-circle"></ion-icon>
                        </button>
                    </li>
                    <li style="float: right; padding-right: 10px;">
                    <button class ="search" type="button" onclick="window.location.href = 'search.html';">
                        <ion-icon class="head-icon" name="search-circle-outline"></ion-icon>
                    </button> </li>
                </ul> 
                </h3>
            </div>
        `
    }
}

customElements.define('my-header', myHeader)

class myFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <aside>
                <div class="content"></div>
                <h3>CREATED BY:</h3>
                <ul>
                    <li>KATHERINE ALEXANDER</li>
                    <li>TYLER BROWNING</li>
                    <li>KALEB WHITE</li>
                </ul>
                </aside>
                <aside>
                <div id="contact" class="content"></div>
                <h3>Powered by RAWG Api</h3>
                </aside>
            </footer>
        `
    }
}

customElements.define('my-footer', myFooter)