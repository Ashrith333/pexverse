function sendMail() {
    // console.log(" In send Email Functon");
    var params = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phoneno: document.getElementById("phoneno").value,
        lcoation: document.getElementById("location").value,
        message: document.getElementById("message").value,
    };

    const serviceID = "service_rl7xy7d";
    const templateID = "template_zvsh7ri";

    emailjs.send(serviceID, templateID, params)
        .then(res => {
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("phoneno").value = "";
            document.getElementById("location").value = "";
            document.getElementById("message").value = "";
            console.log(res);
            alert("Your message sent successfully!!")

        })
        .catch(err => console.log(err));

}