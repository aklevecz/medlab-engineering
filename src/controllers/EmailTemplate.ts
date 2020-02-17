export const EmailTemplate = (qrCode, name) => `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>MEIOSIS</title>
    <style>
      /* -------------------------------------
          GLOBAL RESETS
      ------------------------------------- */

      /*All the styling goes here*/

      img {
        border: none;
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
      }
      body {
        background-color: black;
        font-family: Arial, Helvetica, sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 14px;
        line-height: 1.4;
        margin: 0;
        padding: 0;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }
      table {
        border-collapse: separate;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        width: 100%;
      }
      table td {
        font-family: sans-serif;
        font-size: 14px;
        vertical-align: top;
      }
      /* -------------------------------------
          BODY & CONTAINER
      ------------------------------------- */
      .body {
        background-color: black;
        width: 100%;
      }
      /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
      .container {
        display: block;
        margin: 0 auto !important;
        margin-top: 10px;
        /* makes it centered */
        max-width: 580px;
        padding: 10px;
        width: 580px;
        border: 57px #e5f560 solid;
        background: #ffffaa;
      }
      /* This should also be a block element, so that it will fill 100% of the .container */
      .content {
        box-sizing: border-box;
        display: block;
        margin: 0 auto;
        max-width: 580px;
        padding: 10px;
      }
      /* -------------------------------------
          HEADER, FOOTER, MAIN
      ------------------------------------- */
      .main {
        background: rgb(60, 235, 227);
        border-radius: 3px;
        width: 100%;
      }
      .wrapper {
        box-sizing: border-box;
        padding: 20px;
      }
      .content-block {
        padding-bottom: 10px;
        padding-top: 10px;
      }
      .footer {
        clear: both;
        margin-top: 10px;
        text-align: center;
        width: 100%;
      }
      .footer td,
      .footer p,
      .footer span,
      .footer a {
        color: white;
        font-size: 10px;
        text-align: center;
      }
      /* -------------------------------------
          TYPOGRAPHY
      ------------------------------------- */
      h1,
      h2,
      h3,
      h4 {
        color: #000000;
        line-height: 1.4;
        margin: 0;
        margin-bottom: 30px;
      }
      h1 {
        font-family: Arial, Helvetica, sans-serif;
        font-weight: bolder !important;
        font-size: 35px;
        font-weight: 300;
        text-align: center;
        text-transform: uppercase;
      }
      h1.circly {
        font-family: Arial, Helvetica, sans-serif;
        font-weight: bolder !important;
        font-size: 165px;
        font-weight: 300;
        text-align: center;
        text-transform: uppercase;
        border: 50px white solid;
        border-radius: 200px;
        width: 230px;
        margin: auto;
        margin-bottom: 50px;
      }
      h1.raptorname {
        font-size: 4rem;
        color: white;
        text-align: center;
        margin: 0 auto 3rem;
        width: 22rem;
        border-bottom: 1rem white solid;
      }
      h1.raptorname > a {
        color: white !important;
        text-decoration: none !important;
        overflow-wrap: break-word;
      }
      p,
      ul,
      ol {
        font-family: sans-serif;
        font-size: 14px;
        font-weight: 700;
        margin: 0;
        margin-bottom: 15px;
      }
      p li,
      ul li,
      ol li {
        list-style-position: inside;
        margin-left: 5px;
      }
      a {
        color: #3498db;
        text-decoration: underline;
      }
      /* -------------------------------------
          BUTTONS
      ------------------------------------- */
      .btn {
        box-sizing: border-box;
        width: 100%;
      }
      .btn > tbody > tr > td {
        padding-bottom: 15px;
      }
      .btn table {
        width: auto;
      }
      .btn table td {
        background-color: #ffffff;
        border-radius: 5px;
        text-align: center;
      }
      .btn a {
        background-color: #ffffff;
        border: solid 1px #3498db;
        border-radius: 5px;
        box-sizing: border-box;
        color: #3498db;
        cursor: pointer;
        display: inline-block;
        font-size: 14px;
        font-weight: bold;
        margin: 0;
        padding: 12px 25px;
        text-decoration: none;
        text-transform: capitalize;
      }
      .btn-primary table td {
        background-color: #3498db;
      }
      .btn-primary a {
        background-color: #3498db;
        border-color: #3498db;
        color: #ffffff;
      }
      /* -------------------------------------
          OTHER STYLES THAT MIGHT BE USEFUL
      ------------------------------------- */
      .last {
        margin-bottom: 0;
      }
      .first {
        margin-top: 0;
      }
      .align-center {
        text-align: center;
      }
      .align-right {
        text-align: right;
      }
      .align-left {
        text-align: left;
      }
      .clear {
        clear: both;
      }
      .mt0 {
        margin-top: 0;
      }
      .mb0 {
        margin-bottom: 0;
      }
      .paragraph {
        margin-top: 15px;
        margin-left: 23px;
      }
      .paragraph > p {
        font-size: 50px;
        margin-bottom: 2px;
        text-align: right;
        margin-right: 22px;
        border-bottom: 17px #ffffaa dashed;
        color: white;
      }
      .preheader {
        color: transparent;
        display: none;
        height: 0;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
        mso-hide: all;
        visibility: hidden;
        width: 0;
      }
      .powered-by a {
        text-decoration: none;
      }
      hr {
        border: 0;
        border-bottom: 1px solid #f6f6f6;
        margin: 20px 0;
      }
      /* -------------------------------------
          RESPONSIVE AND MOBILE FRIENDLY STYLES
      ------------------------------------- */
      @media only screen and (max-width: 620px) {
        table[class="body"] h1 {
          font-size: 28px !important;
          margin-bottom: 10px !important;
        }
        table[class="body"] p,
        table[class="body"] ul,
        table[class="body"] ol,
        table[class="body"] td,
        table[class="body"] span,
        table[class="body"] a {
          font-size: 16px !important;
        }
        table[class="body"] .wrapper,
        table[class="body"] .article {
          padding: 10px !important;
        }
        table[class="body"] .content {
          padding: 0 !important;
        }
        table[class="body"] .container {
          padding: 0 !important;
          width: 100% !important;
        }
        table[class="body"] .main {
          border-left-width: 0 !important;
          border-radius: 0 !important;
          border-right-width: 0 !important;
        }
        table[class="body"] .btn table {
          width: 100% !important;
        }
        table[class="body"] .btn a {
          width: 100% !important;
        }
        table[class="body"] .img-responsive {
          height: auto !important;
          max-width: 100% !important;
          width: auto !important;
        }
      }
      /* -------------------------------------
          PRESERVE THESE STYLES IN THE HEAD
      ------------------------------------- */
      @media all {
        .ExternalClass {
          width: 100%;
        }
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
          line-height: 100%;
        }
        .apple-link a {
          color: inherit !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          text-decoration: none !important;
        }
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
        .btn-primary table td:hover {
          background-color: #34495e !important;
        }
        .btn-primary a:hover {
          background-color: #34495e !important;
          border-color: #34495e !important;
        }
      }
    </style>
  </head>
  <body class="">
    <span class="preheader">you are sooo good looking!</span>
    <table
      role="presentation"
      border="0"
      cellpadding="0"
      cellspacing="0"
      class="body"
      style="background:white;"
    >
      <tr>
        <td>&nbsp;</td>
        <td class="container">
          <div class="content">
            <!-- START CENTERED WHITE CONTAINER -->
            <table role="presentation" class="main">
              <!-- START MAIN CONTENT AREA -->
              <tr>
                <td class="wrapper">
                  <table
                    role="presentation"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                  >
                    <tr>
                      <td>
                        <table
                          role="presentation"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                        >
                          <tbody>
                            <tr>
                              <td align="left">
                                <table
                                  role="presentation"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td>
                                        <img
                                          style="display: block; margin: auto;border:35px white solid;background:white;max-width:500px"
                                          src="${qrCode}"
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div class="paragraph">
                          <p>MONARCH</p>
                          <p>MAY 8</p>
                        </div>
                        <img
                          style=" margin-top: 22px; margin-left: 14px;"
                          src="data:image/png;base64,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"
                        />
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- END MAIN CONTENT AREA -->
            </table>

            <!-- END CENTERED WHITE CONTAINER -->

            <!-- START FOOTER -->
            <div class="footer">
              <table
                role="presentation"
                border="0"
                cellpadding="0"
                cellspacing="0"
              >
                <tr>
                  <td class="content-block">
                    <span
                      >MEDLAB ORG, 188 New N Rd, Hoxton, London N1 5EP, UK</span
                    >
                  </td>
                </tr>
                <tr></tr>
              </table>
            </div>
            <!-- END FOOTER -->
          </div>
        </td>
        <td>&nbsp;</td>
      </tr>
    </table>
  </body>
</html>
`;
