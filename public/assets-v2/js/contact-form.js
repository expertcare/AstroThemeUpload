var contactForms = document.querySelectorAll(".contact-form");
contactForms.forEach(form => {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        fetch(event.target.action, {
            method: 'POST',
            body: new FormData(event.target)
        }).then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        }).then((body) => {
            if (body.message === "Success") {
                $('#toast').toast('show');
                $('#toast').removeClass("bg-danger").addClass('bg-primary');
                $('#msg-text').text('Thank you for your interest. We will be in touch shortly.');
                document.getElementById(event.target.id).reset();
            }
            else {
                $('#toast').toast('show');
                $('#toast').removeClass("bg-primary").addClass('bg-danger');
                $('#msg-text').text(body.message);
            }
        }).catch((error) => {
            $('#toast').toast('show');
            $('#toast').addClass('bg-danger');
            $('#msg-text').text(error);
        });

    });
});