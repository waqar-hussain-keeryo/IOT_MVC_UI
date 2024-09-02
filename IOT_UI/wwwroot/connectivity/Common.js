// Base API URL
var apiBaseUrl = "https://localhost:7290/api/";

// Define a common AJAX function for CRUD operations
function ajaxRequest(type, endpoint, data) {
    return $.ajax({
        type: type,
        url: apiBaseUrl + endpoint,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    });
}

function successAlert(message) {
    // Create the alert element
    var alert = document.createElement('div');
    alert.className = 'alert alert-success bg-success text-light border-0 alert-dismissible fade show alert-position';
    alert.role = 'alert';

    // Add the message to the alert
    alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

    // Add the alert to the body
    document.body.appendChild(alert);

    // Set a timeout to remove the alert after 5 seconds
    setTimeout(function () {
        alert.classList.remove('show');
        alert.classList.add('fade');
        setTimeout(function () {
            document.body.removeChild(alert);
        }, 150);
    }, 3000);
}

function warningAlert(message) {
    // Create the alert element
    var alert = document.createElement('div');
    alert.className = 'alert alert-warning bg-warning text-light border-0 alert-dismissible fade show alert-position';
    alert.role = 'alert';

    // Add the message to the alert
    alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

    // Add the alert to the body
    document.body.appendChild(alert);

    // Set a timeout to remove the alert after 5 seconds
    setTimeout(function () {
        alert.classList.remove('show');
        alert.classList.add('fade');
        setTimeout(function () {
            document.body.removeChild(alert);
        }, 150);
    }, 3000);
}