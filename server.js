const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Session setup
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

//app.use(express.static("public"));
//app.use(bodyParser.urlencoded({ extended: true }));

// Basic setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// File paths
const dataDir = path.join(__dirname, 'data');
const usersFilePath = path.join(dataDir, 'users.txt');
const petsFilePath = path.join(dataDir, 'pets.txt');

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {fs.mkdirSync(dataDir);}


// Middleware to inject current user into all views
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Helper functions
function verifyUser(username) {
    if (!fs.existsSync(usersFilePath)) return false;

    const usersData = fs.readFileSync(usersFilePath, 'utf8');
    const users = usersData.trim().split('\n');
    return users.some(user => {
        const [storedUsername] = user.split(':');
        return storedUsername === username;
    });
}

function registerUser(username, password) {
    const newUser = `${username}:${password}\n`;
    fs.appendFileSync(usersFilePath, newUser, 'utf8');
}

function getNextPetId() {
    if (!fs.existsSync(petsFilePath)) return 1;

    const petsData = fs.readFileSync(petsFilePath, 'utf8');
    const lines = petsData.trim().split('\n');
    return lines.reduce((maxId, line) => {
        const id = parseInt(line.split(':')[0]) || 0;
        return id > maxId ? id : maxId;
    }, 0) + 1;
}

function searchPets(criteria) {
    const { type, breed, age, gender, otherdogs, othercats, smallchildren } = criteria;
    const petsData = fs.readFileSync(petsFilePath, 'utf8');
    const pets = petsData.trim().split('\n').map(line => {
        const parts = line.split(':');
        return {
            id: parts[0],
            username: parts[1],
            type: parts[2],
            breed: parts[3],
            age: parts[4],
            gender: parts[5],
            getsAlongWithOtherDogs: parts[6] === "yes",
            getsAlongWithCats: parts[7] === "yes",
            getsAlongWithChildren: parts[8] === "yes",
            description: parts[9],
            ownerName: parts[10],
            ownerEmail: parts[11]
        };
    });

    return pets.filter(pet => {
        const breedMatch = breed === "Doesn't matter" || pet.breed.toLowerCase().includes(breed.toLowerCase());
        const ageMatch = age === "Doesn't matter" || pet.age === age;
        const genderMatch = gender === "Doesn't matter" || pet.gender.toLowerCase() === gender.toLowerCase();
        const dogsMatch = !otherdogs || pet.getsAlongWithOtherDogs;
        const catsMatch = !othercats || pet.getsAlongWithCats;
        const childrenMatch = !smallchildren || pet.getsAlongWithChildren;

        return pet.type.toLowerCase() === type.toLowerCase() && breedMatch && ageMatch && genderMatch && dogsMatch && catsMatch && childrenMatch;
    });
}

// Define your routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/available', (req, res) => {
    res.render('available'); 
});

app.get('/find', (req, res) => {
    res.render('find'); 
});

app.get('/dog', (req, res) => {
    res.render('dog'); 
});

app.get('/cat', (req, res) => {
    res.render('cat'); 
});

app.get('/contact', (req, res) => {
    res.render('contact'); 
});

// Find routes
app.get('/find', (req, res) => {
    res.render('find', { title: 'Find a Pet', pets: undefined });
});

app.post('/find', (req, res) => {
    try {
        const results = searchPets(req.body);
        res.render('find', { title: 'Find a Pet', pets: results });
    } catch (error) {
        console.error('Error searching pets:', error);
        res.status(500).send('Error searching for pets');
    }
});

// Give away routes
app.get('/giveAway', (req, res) => {
    if (!req.session.username) {
        return res.redirect('/login');
    }
    res.render('giveAway', { title: 'Give Away Pet' });
});

app.post('/giveAway', (req, res) => {
    if (req.session.username) {
        const { 
            type, 
            breed, 
            age, 
            gender, 
            otherdogs, 
            othercats, 
            smallchildren, 
            description, 
            ownerName,
            ownerEmail 
        } = req.body;

        const petId = getNextPetId();
        const petRecord = `${petId}:${req.session.username}:${type}:${breed}:${age}:${gender}:${otherdogs ? 'yes' : 'no'}:${othercats ? 'yes' : 'no'}:${smallchildren ? 'yes' : 'no'}:${description}:${ownerName}:$${ownerEmail}\n`;

        try {
            fs.appendFileSync(petsFilePath, petRecord, 'utf8');
            res.redirect('/submitPet');

        } catch (error) {
            console.error('Error writing to pets file:', error);
            res.status(500).send('Error registering pet.');
        }
    } else {
        res.status(401).redirect('/login');
    }
});

//Submit pet route
app.get('/submitPet', (req, res) => {
    // Get data from query parameters
    const petData = req.query;
    res.render('submitPet', { petData }); // Pass petData to submitPet.ejs
});

//Register route
app.get('/register', (req, res) => res.render('register', { title: 'Create Account' }));

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (verifyUser(username)) {
        // User already exists
        return res.status(409).render('Registered', { message: "Username already exists, sorry." });
    }

    // Proceed with registration
    registerUser(username, password);

    // Send success response or redirect to a success page
    return res.status(201).render('Registered', { message: "Account created successfully!" });
});


// Login routes
app.get('/login', (req, res) => res.render('login', { title: 'Login' }));

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!fs.existsSync(usersFilePath)) {
        return res.status(401).json({ 
            success: false,
            message: "No account was found" 
        });
    }

    const usersData = fs.readFileSync(usersFilePath, 'utf8');
    const users = usersData.trim().split('\n');
    
    const userFound = users.find(user => {
        const [storedUsername, storedPassword] = user.split(':');
        return storedUsername === username && storedPassword === password;
    });

    if (userFound) {
        req.session.username = username;
        return res.json({ 
            success: true,
            redirect: '/giveAway'  
        });
    } else {
        return res.status(401).json({ 
            success: false,
            message: "Invalid username or password" 
        });
    }
});

//Log out
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.send("Error logging out");
            return;
        }
        res.render('logout');
    });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
