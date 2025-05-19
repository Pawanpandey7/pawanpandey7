<?php
header('Content-Type: application/json'); // Important for sending JSON response to JS

$response = ['success' => false, 'message' => 'An unexpected error occurred.'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data and sanitize it
    $name = filter_var(trim($_POST["name"]), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $subject = filter_var(trim($_POST["subject"]), FILTER_SANITIZE_STRING);
    $message = filter_var(trim($_POST["message"]), FILTER_SANITIZE_STRING);

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Invalid email format.';
        echo json_encode($response);
        exit;
    }

    // Check if required fields are empty
    if (empty($name) || empty($email) || empty($message)) {
        $response['message'] = 'Please fill in all required fields (Name, Email, Message).';
        echo json_encode($response);
        exit;
    }

    // Email details
    $to = "pawanpandey2058@gmail.com"; // REPLACE WITH YOUR ACTUAL EMAIL ADDRESS
    $email_subject = "New Contact Form Submission: " . ($subject ? $subject : "No Subject");

    $email_body = "You have received a new message from your portfolio contact form.\n\n";
    $email_body .= "Name: $name\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Subject: $subject\n";
    $email_body .= "Message:\n$message\n";

    $headers = "From: noreply@yourdomain.com\n"; // Optional: use a no-reply address for your domain
    $headers .= "Reply-To: $email\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Attempt to send the email
    // For XAMPP, you need to configure sendmail.
    // Open C:\xampp\php\php.ini and C:\xampp\sendmail\sendmail.ini
    // In php.ini, find [mail function] and configure:
    // SMTP = smtp.gmail.com (if using Gmail)
    // smtp_port = 587
    // sendmail_from = your_gmail_address@gmail.com
    // sendmail_path = "\"C:\xampp\sendmail\sendmail.exe\" -t"
    //
    // In sendmail.ini, configure:
    // smtp_server=smtp.gmail.com
    // smtp_port=587
    // smtp_ssl=tls
    // error_logfile=error.log
    // auth_username=your_gmail_address@gmail.com
    // auth_password=your_gmail_app_password (if using Gmail, use an App Password)
    //
    // **IMPORTANT**: For Gmail, you'll likely need to enable "Less secure app access"
    // or better, generate an "App Password" if you have 2-Step Verification enabled.
    // Using an App Password is more secure.

    if (mail($to, $email_subject, $email_body, $headers)) {
        $response['success'] = true;
        $response['message'] = 'Thank you! Your message has been sent successfully.';
    } else {
        // This error message is often generic. Check XAMPP's PHP error logs and sendmail logs.
        // Common issues: sendmail not configured, firewall blocking, incorrect SMTP settings.
        $response['message'] = 'Sorry, there was an error sending your message. Please try again later or contact me directly.';
        // For debugging: error_log("Mail send failed: " . error_get_last()['message']);
    }
} else {
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
exit;
?>