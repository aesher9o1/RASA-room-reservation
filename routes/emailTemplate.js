export default (message) => {
    return `
    <!doctype html>
<html amp4email>
<head>
  <meta charset="utf-8">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-template="amp-mustache" src="https://cdn.ampproject.org/v0/amp-mustache-0.2.js"></script>
  <script async custom-element="amp-accordion" src="https://cdn.ampproject.org/v0/amp-accordion-0.1.js"></script>
  <script async custom-element="amp-form" src="https://cdn.ampproject.org/v0/amp-form-0.1.js"></script>

  <style amp4email-boilerplate>
    body {
 		visibility: hidden
 	}
 	</style>

  <style amp-custom>
 body {
 background-color: #ffffff;
 font-size: 18px;
 color: #333333;
 font-family: 'Segoe UI', Segoe, 'Open Sans', sans-serif;
 width: 100%;
 height: 100%;
 Margin: 0;
 padding: 0
 }
.main-body {
 max-width: 600px;
 margin: 0 auto;
 }
.main {
 padding: 0 30px;
 }
.header {
 padding: 30px 0 25px 0;
 border-bottom: solid 1px #D6E3E3;
 margin-bottom: 40px;
 }
.header .logo {
 display: block;
 margin: 0;
 padding: 0;
 border: 0 none;
 }
.logo, .headers {
 font-size: 22px;
 line-height: 40px;
 margin: 0 0 10px;
 color: #666a6c;
 font-family: "Segoe UI", Segoe, "Open Sans", sans-serif;
 text-transform: uppercase;
 display: block;
 padding: 30px 0;
 font-weight: lighter;
 }
p {
 font-family: 'Segoe UI', Segoe, 'Open Sans', sans-serif;
 font-weight: normal;
 font-size: 16px;
 line-height: 24px;
 color: #333333;
 padding: 0;
 margin: 0 0 10px 0;
 }
.text-strong {
 font-weight: bold;
 }

a {
 color: #009fc1;
 text-decoration: underline;
 }
.accordion-header {
 padding: 20px;
 color: #333;
 font-size: 18px;
 font-weight: normal;
 background-color: #fafafa;
 border: 1px solid #ddd;
 }
.accordion-info {
 padding: 20px;
 border: 1px solid #ccc;
 text-align: left;
 color: #666;
 line-height: 1.4em;
 font-size: 15px;
 }
.center {
 text-align: center;
 padding-bottom: 20px
 }
.footer {
 padding: 30px 0 25px 0;
 border-top: solid 1px #D6E3E3;
 margin-top: 40px;
 }
.location {
 border: 1px solid #ddd;
 }
.space {
 margin-bottom: 30px;
 }
    .query{
      margin-top:1em;
      padding:0.7em 0.5em 0.7em 0.5em;
      border:none;
      background: #009fc1;
      color:white
    }
 </style>
</head>
<body>
  <div class="main-body">
    <div class="main">
      <header class="center header">
        <div class="logo"><span>RASA ROOM MAILER</span></div>
      </header>
      <section>
        <p class="text-strong"> Hello</p>
        <p>${message}</p>


        <p> Find the answers to frequently asked questions below.</p>
        <h2 class="headers center">FAQ </h2>
        <amp-accordion class="sample" expand-single-section animate>
          <section>
            <h4 class="accordion-header">Projector Problem</h4>
            <p class="accordion-info">Please disconnect and connect again. Or maybe there is no electricity. If none of them work try contacting us to get the equippment changed.
            </p>
          </section>
          <section>
            <h4 class="accordion-header">Door Jammed</h4>
            <p class="accordion-info">Please disconnect and connect again. Or maybe there is no electricity. If none of them work try contacting us to get the equippment changed.
            </p>
          </section>
          <section>
            <h4 class="accordion-header">AC problem</h4>
            <p class="accordion-info">Please disconnect and connect again. Or maybe there is no electricity. If none of them work try contacting us to get the equippment changed.</p>
          </section>
          <section>
            <h4 class="accordion-header">Contact details</h4>
            <p class="accordion-info">ADDRESS:<br>
              365 Westminster Bridge Road<br>
              London SE1 7UT, United Kingdom<br>
              RESERVATIONS:<br>
              +11 (0) 000 000 0000 (RASA Room Direct)<br></p>
          </section>
        </amp-accordion>


        <section class="emergency">
         

          <form method="post" action-xhr="https://example.com/subscribe">
             <h2 class="headers center">Other Help</h2>
            <fieldset>
              <br>
              <label>
                <span>Category</span>
                <select name="dropDown" style="padding:0.7em 0.5em 0.7em 0.5em; background: #009fc1;color:white">
                  <option value="it">IT and Technical</option>
                  <option value="infra">Infrastructure</option>
                  <option value="hospitality">Hospitality</option>

                </select>
              </label>
              <br>
              <br>
              <label>
                <span>Describe:</span>
                <textarea required cols="58" style="padding:1em"></textarea>
              </label>
              <br>
              <input type="submit" class="query" value="Submit Query">
            </fieldset>
            <div submit-success>
              <template type="amp-mustache">
                Query sent sucessfully!
              </template>
            </div>
            <div submit-error>
              <template type="amp-mustache">
                Query sending failed!
              </template>
            </div>
          </form>
        </section>
        <div class="bg-gray"></div>
      </section>

      <br><br>
      <button class= "query"> Call for IT Emergency</button>
      <button class= "query"> Call for Hospitality Emergency</button>
      <button class= "query"> Call for Logistic Emergency</button>
      <footer class="footer">
        <p>Best regards, <br><b><a href="mailto:aashiskumar986@gmail.com">aesher9o1</a></b></p>
      </footer>
    </div>
  </div>
</body>
</html>
`
}

