// Helper / Utility functions
let url_to_head = (url) => {
    return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.src = url;
        script.onload = function () {
            resolve();
        };
        script.onerror = function () {
            reject('Error loading script.');
        };
        document.head.appendChild(script);
    });
}
let handle_close = (event) => {
    event.target.closest(".ms-alert").remove();
}
let handle_click = (event) => {
    //     if (event.target.classList.contains("ms-close")) {
    //         handle_close(event);
    //     }
}
document.addEventListener("click", handle_click);
const paypal_sdk_url = "https://www.paypal.com/sdk/js";
const client_id = "AUsNh98N43XD0TBapr51wuB-HL19P7emZoSaxtON8_UoEphu0CmwaG4PIVxRvCJBGAWYitGQnHKU55iD";
const currency = "USD";
const intent = "capture";
let alerts = document.getElementById("alerts");

// &enable-funding=paypal,card&disable-funding=venmo,credit&currency=

url_to_head(paypal_sdk_url + "?client-id=" + client_id + "&enable-funding=paypal,card&disable-funding=venmo,credit&currency=" + currency + "&intent=" + intent)
    .then(() => {
        //Handle loading spinner
        document.getElementById("loading").classList.add("hide");
        document.getElementById("content").classList.remove("hide");
        let alerts = document.getElementById("alerts");
        let paypal_buttons = paypal.Buttons({
            onClick: (data) => {
                //Custom JS here
            },
            style: { //https://developer.paypal.com/sdk/js/reference/#link-style
                // shape: 'rect',
                // color: 'gold',
                // layout: 'vertical',
                // label: 'paypal'
            },

            // createOrder: function (data, actions) { //https://developer.paypal.com/docs/api/orders/v2/#orders_create
            //     return fetch("http://localhost:3000/create_order", {
            //         method: "post", headers: { "Content-Type": "application/json; charset=utf-8" },
            //         body: JSON.stringify({ "intent": intent })
            //     })
            //         .then((response) => response.json())
            //         .then((order) => { return order.id; });
            // },

            // onApprove: function (data, actions) {
            //     let order_id = data.orderID;
            //     return fetch("http://localhost:3000/complete_order", {
            //         method: "post", headers: { "Content-Type": "application/json; charset=utf-8" },
            //         body: JSON.stringify({
            //             "intent": intent,
            //             "order_id": order_id
            //         })
            //     })
            //         .then((response) => response.json())
            //         .then((order_details) => {
            //             console.log(order_details); //https://developer.paypal.com/docs/api/orders/v2/#orders_capture!c=201&path=create_time&t=response
            //             let intent_object = intent === "authorize" ? "authorizations" : "captures";
            //             //Custom Successful Message
            //             alerts.innerHTML = `<div class=\'ms-alert ms-action\'>Thank you ` + order_details.payer.name.given_name + ` ` + order_details.payer.name.surname + ` for your payment of ` + order_details.purchase_units[0].payments[intent_object][0].amount.value + ` ` + order_details.purchase_units[0].payments[intent_object][0].amount.currency_code + `!</div>`;

            //             //Close out the PayPal buttons that were rendered
            //             paypal_buttons.close();
            //         })
            //         .catch((error) => {
            //             console.log(error);
            //             alerts.innerHTML = `<div class="ms-alert ms-action2 ms-small"><span class="ms-close"></span><p>An Error Ocurred!</p>  </div>`;
            //         });
            // },

            // onCancel: function (data) {
            //     alerts.innerHTML = `<div class="ms-alert ms-action2 ms-small"><span class="ms-close"></span><p>Order cancelled!</p>  </div>`;
            // },

            // onError: function (err) {
            //     console.log(err);
            // }
            createOrder: function (data, actions) {
                return fetch("http://wait4me-api.thesuitchstaging2.com:6002/api/v1/payment/order-create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        'Authorization': "Bearer eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIn0.To4IcyHtzCGiFCX9xAxqFKm-POhAE5iKMxM_c1IW8ioWZJvDpz0sUWbTNrW_OYKF2ft-8xuCoYUlW926rr8nyXxvnL1h5P1R9bekTUszVtnciOG5fJgAGHxjL_OKqQ1vKhpmiEA0a4X3o3MEFTo88sAZceDlSMOu06GR2ixmTt9ZyQ33tfLncaBAApLxRFq9adP-TeEwghC_3XdB7DnyI2s_N8F3cvu65Ywpdz3bEc36teSYkRcpLOyJKw0Ni5PIOevTBhNUSdZvgr_EH34zkE9XfgDM_bz4phic5qHPN4_R_bavCNCwp_pofXPcSJ4DWmITYQTNDBv54EhedOG2og.5KAh8t6XqTQAZsqX.BHGwyTByyQpvdCbkc9zbaLPJmxYqUXRET5KoAyxtqO7azhcKQrohXRcOfsGgCMJuRLCi6U8zp3CDwLkJ0X8zxmq1CLxUVh7sbPOYXW9GcDmWEKD0CVom9_Uv85TXqZ7kkJC4-SAGXI-YOjHuOhlucb73ief8zbE.B8Ao0TJ7t64xKXVCSbW8QA",
                    },
                    body: JSON.stringify({
                        intent: intent,  // e.g., "CAPTURE" or "AUTHORIZE"
                        value: "10.00"   // The amount for the transaction (should match frontend value)
                    })
                })
                    .then((response) => response.json())
                    .then((order) => {
                        // Return the PayPal order ID
                        return order.id;
                    })
                    .catch((error) => {
                        console.error("Error creating order:", error);
                        throw error; // Propagate error to PayPal button
                    });
            },


            onApprove: function (data, actions) {
                let order_id = data.orderID;
                return fetch("http://wait4me-api.thesuitchstaging2.com:6002/api/v1/payment/order_complete", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        'Authorization': "Bearer eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIn0.To4IcyHtzCGiFCX9xAxqFKm-POhAE5iKMxM_c1IW8ioWZJvDpz0sUWbTNrW_OYKF2ft-8xuCoYUlW926rr8nyXxvnL1h5P1R9bekTUszVtnciOG5fJgAGHxjL_OKqQ1vKhpmiEA0a4X3o3MEFTo88sAZceDlSMOu06GR2ixmTt9ZyQ33tfLncaBAApLxRFq9adP-TeEwghC_3XdB7DnyI2s_N8F3cvu65Ywpdz3bEc36teSYkRcpLOyJKw0Ni5PIOevTBhNUSdZvgr_EH34zkE9XfgDM_bz4phic5qHPN4_R_bavCNCwp_pofXPcSJ4DWmITYQTNDBv54EhedOG2og.5KAh8t6XqTQAZsqX.BHGwyTByyQpvdCbkc9zbaLPJmxYqUXRET5KoAyxtqO7azhcKQrohXRcOfsGgCMJuRLCi6U8zp3CDwLkJ0X8zxmq1CLxUVh7sbPOYXW9GcDmWEKD0CVom9_Uv85TXqZ7kkJC4-SAGXI-YOjHuOhlucb73ief8zbE.B8Ao0TJ7t64xKXVCSbW8QA",

                    },
                    body: JSON.stringify({
                        intent: intent,    // Should be the same as the one used in createOrder (CAPTURE/Authorize)
                        order_id: order_id // The PayPal order ID returned after approval
                    })
                })
                    .then((response) => response.json())
                    .then((order_details) => {
                        console.log(order_details); // Capture or authorize response from PayPal API

                        let intent_object = intent === "authorize" ? "authorizations" : "captures";
                        alerts.innerHTML = `<div class='ms-alert ms-action'>Thank you ${order_details.payer.name.given_name} ${order_details.payer.name.surname} for your payment of ${order_details.purchase_units[0].payments[intent_object][0].amount.value} ${order_details.purchase_units[0].payments[intent_object][0].amount.currency_code}!</div>`;

                        paypal_buttons.close(); // Close PayPal button after success
                    })
                    .catch((error) => {
                        console.error(error);
                        alerts.innerHTML = `<div class="ms-alert ms-action2 ms-small"><span class="ms-close"></span><p>An Error Occurred!</p>  </div>`;
                    });
            },
            onCancel: function (data) {
                alerts.innerHTML = `<div class="ms-alert ms-action2 ms-small"><span class="ms-close"></span><p>Order cancelled!</p>  </div>`;
            },

            onError: function (err) {
                console.log(err);
            }
        });
        paypal_buttons.render('#payment_options');
    })
    .catch((error) => {
        console.error(error);
    });