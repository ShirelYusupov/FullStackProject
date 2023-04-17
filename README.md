# Refael David Hotel

## Introduction
This is a Node.js application built with Express framework and MongoDB as database, it also integrates with Google OAuth and Mailchimp API. The purpose of this application is to showcase the functionality of Passport.js and the Mongoose ORM.

## Requirements
In order to run this application, you must have the following software installed:
* Node.js
* MongoDB

## Installation
* Clone this repository to your local machine.
* Install the required packages using the command npm install.
* Create a .env file and add the following variables:
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
API_KEY=your-mailchimp-api-key

* Start the MongoDB server using the command mongod.
* Start the application using the command node app.js.
* Open your web browser and go to http://localhost:3000.

## Features
* User authentication with Passport.js and Mongoose.
* Google OAuth integration for authentication.
* Mailchimp API integration for email subscription.
* User registration and login.
* User can submit a contact form.
* User can view secrets if authenticated.

## Usage
* The home page (http://localhost:3000/) shows a brief introduction to the Refael David Hotel.
* The login page (http://localhost:3000/login) allows users to log in using their username and password or with their Google account.
* The registration page (http://localhost:3000/register) allows users to register a new account.
* The contact page (http://localhost:3000/contact) allows users to submit a contact form. If the submission is successful, the user is redirected to the success page (http://localhost:3000/success). If the submission fails, the user is redirected to the failure page (http://localhost:3000/failure).
* The secrets page (http://localhost:3000/secrets) shows a list of secrets that have been submitted by authenticated users. If the user is not authenticated, they are redirected to the login page.
* The logout page (http://localhost:3000/logout) logs the user out of the application.

## License
This project is licensed under the MIT License. See the LICENSE file for more information.
