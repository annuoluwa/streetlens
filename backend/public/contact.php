<?php

// Set response headers
header('Content-Type: text/plain; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Accept POST only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Method Not Allowed';
    exit;
}

// Read form input
$name    = isset($_POST['name']) ? trim($_POST['name']) : '';
$email   = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validate required fields
if ($name === '' || $email === '' || $message === '') {
    http_response_code(400);
    echo 'Name, email and message are required.';
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo 'Invalid email address.';
    exit;
}

// Recipient address
$to = 'anuoluwapo@elizabethosunsanwo.co.uk';

// Compose email
$subject = 'StreetLens contact form: ' . $name;

$body  = "New contact message from StreetLens.\n\n";
$body .= "From: {$name} <{$email}>\n\n";
$body .= "Message:\n{$message}\n";

$headers   = [];
$headers[] = 'From: noreply@streetlens.kagex.co.uk';
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'X-Mailer: PHP/' . phpversion();

// Send email
$success = @mail($to, $subject, $body, implode("\r\n", $headers));

if ($success) {
    http_response_code(200);
    echo 'OK';
} else {
    http_response_code(500);
    echo 'Failed to send message.';
}
