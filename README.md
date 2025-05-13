# Adopting-Animals-Website
## Your Pet Shop Family 
#### Description:
# Pet Adoption Website – Project Description

The **Pet Adoption Website** is a full-stack web application designed to connect individuals who are looking to adopt pets with those who need to give them away. Built using **Node.js**, **Express**, and **EJS** as the templating engine, the project offers a simple, intuitive interface for browsing, searching, and submitting pet listings. It also features a basic user authentication system, allowing only registered users to submit adoption listings, thereby ensuring a more secure and moderated environment.

---

## Objectives

The primary goal of the project was to simulate a real-world web application with user interaction, data handling, and dynamic content. I wanted to build a tool that could serve a meaningful purpose—helping people find loving homes for pets and giving users a smooth experience across different functionalities, such as:

- Registration and login  
- Form submissions  
- Pet search  
- Session handling

Another important goal was to **learn and demonstrate proficiency** in:

- Express routing  
- Session handling  
- Server-side rendering  
- File-based data persistence (no database)

The project reflects core web development principles while maintaining a **clean, maintainable code structure**.

---

## Technologies Used

- **Node.js** – Backend JavaScript runtime for handling server logic  
- **Express** – Web framework used for routing and middleware  
- **EJS** – Templating engine used to generate dynamic HTML  
- **HTML/CSS/JavaScript** – For frontend interactivity and structure  
- **express-session** – Session middleware for login management  
- **fs module** – File system module for reading/writing `.txt` files  

---

## Project Structure

The project follows a simplified MVC-like structure:

- **Views**: `/views` directory contains `.ejs` files (e.g., `home.ejs`, `login.ejs`, `giveAway.ejs`)  
- **Static Files**: Stored in `/public`, including CSS and optional JavaScript  
- **Data**: Two `.txt` files:  
  - `users.txt` (user credentials)  
  - `pets.txt` (adoption listings)  
- **Server**: `app.js` contains routes, middleware, and main server logic  

---

## Core Features

### Home Page Navigation
The home page acts as a hub for key actions: finding pets, submitting a pet, login, and registration.

### User Registration & Login
Users can register with a username and password. These credentials are stored in `users.txt` (in plain text for simplicity). After login, sessions are managed with `express-session`.

### Submit a Pet for Adoption
Only logged-in users can access the `/giveAway` route. The form collects:

- Pet type & breed  
- Age and gender  
- Compatibility with children or other pets  
- Description  

Each listing is saved to `pets.txt` with a unique pet ID.

### Search Pets
Anyone can use the `/find` route to search for pets using filters like breed, age, gender, and behavior. Results are dynamically rendered using EJS.

### Logout
A `/logout` route clears the session and redirects the user to a confirmation page.

### Static Pages
Additional static pages include:

- `contact.ejs`  
- `dogs.ejs` and `cats.ejs` for category-specific views  
- `availablePets.ejs` for viewing all listings  

---

## Data Storage

Instead of a traditional database, the project uses **flat file storage**:

- `users.txt`: stores credentials in `username:password` format  
- `pets.txt`: stores listings in a colon-separated format, e.g. `petID:username:type:breed:...`

This approach is **not scalable** but keeps the project simple and focused on web fundamentals.

---

## Challenges

- **Route protection**: Ensured only logged-in users could access submission forms via session checks.  
- **Form validation**: Needed to validate input before writing to files, and provide user feedback on errors.

---

## Lessons Learned

This project improved my understanding of:

- Express routing and middleware  
- Session management and route protection  
- Server-side rendering with EJS  
- Handling user input and file-based storage  
- Structuring a clean, user-focused application  

---

## Future Improvements

- Use a database like MongoDB or SQLite for data persistence  
- Hash passwords for better security  
- Allow users to **edit or delete** their own pet listings  
- Add **profile pages** for users  
- Improve UI/UX and add client-side validation  
- Support **image uploads** for pets  

---

Thanks for checking out my project!   
