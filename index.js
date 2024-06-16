const express = require('express');
const cors = require('cors'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
const port = 3000;


app.use(express.json());
app.use(cors()); 

// Clave secreta para JWT
const SECRET_KEY = 'mi_secreta_clave_para_jwt';

// Datos de prueba
let libros = [
    { id: 1, titulo: "Cien Años de Soledad", autor: 1, año: 1967, genero: "Novela", estado: "disponible" },
    { id: 2, titulo: "Don Quijote de la Mancha", autor: 2, año: 1605, genero: "Novela", estado: "prestado" },
    { id: 3, titulo: "1984", autor: 3, año: 1949, genero: "Distopía", estado: "disponible" },
    { id: 4, titulo: "Matar a un ruiseñor", autor: 4, año: 1960, genero: "Novela", estado: "disponible" },
    { id: 5, titulo: "El Gran Gatsby", autor: 5, año: 1925, genero: "Novela", estado: "prestado" },
    { id: 6, titulo: "Orgullo y prejuicio", autor: 6, año: 1813, genero: "Novela", estado: "disponible" },
    { id: 7, titulo: "Crimen y castigo", autor: 7, año: 1866, genero: "Novela", estado: "disponible" },
    { id: 8, titulo: "La Odisea", autor: 8, año: -800, genero: "Épica", estado: "disponible" },
    { id: 9, titulo: "Ulises", autor: 9, año: 1922, genero: "Novela", estado: "disponible" },
    { id: 10, titulo: "En busca del tiempo perdido", autor: 10, año: 1913, genero: "Novela", estado: "disponible" }
];

let autores = [
    { id: 1, nombre: "Gabriel García Márquez", nacionalidad: "Colombiana", fecha_nacimiento: "1927-03-06" },
    { id: 2, nombre: "Miguel de Cervantes", nacionalidad: "Española", fecha_nacimiento: "1547-09-29" },
    { id: 3, nombre: "George Orwell", nacionalidad: "Británica", fecha_nacimiento: "1903-06-25" },
    { id: 4, nombre: "Harper Lee", nacionalidad: "Estadounidense", fecha_nacimiento: "1926-04-28" },
    { id: 5, nombre: "F. Scott Fitzgerald", nacionalidad: "Estadounidense", fecha_nacimiento: "1896-09-24" },
    { id: 6, nombre: "Jane Austen", nacionalidad: "Británica", fecha_nacimiento: "1775-12-16" },
    { id: 7, nombre: "Fiódor Dostoyevski", nacionalidad: "Rusa", fecha_nacimiento: "1821-11-11" },
    { id: 8, nombre: "Homero", nacionalidad: "Griega", fecha_nacimiento: "-800-01-01" },
    { id: 9, nombre: "James Joyce", nacionalidad: "Irlandesa", fecha_nacimiento: "1882-02-02" },
    { id: 10, nombre: "Marcel Proust", nacionalidad: "Francesa", fecha_nacimiento: "1871-07-10" }
];

let lectores = [
    { id: 1, nombre: "Juan Pérez", email: "juan@example.com", direccion: "Calle Falsa 123", telefono: "123456789" },
    { id: 2, nombre: "María García", email: "maria@example.com", direccion: "Avenida Siempre Viva 456", telefono: "987654321" },
    { id: 3, nombre: "Pedro Martínez", email: "pedro@example.com", direccion: "Calle Real 789", telefono: "123123123" },
    { id: 4, nombre: "Ana López", email: "ana@example.com", direccion: "Plaza Mayor 321", telefono: "321321321" },
    { id: 5, nombre: "Luis Sánchez", email: "luis@example.com", direccion: "Calle Mayor 654", telefono: "456456456" },
    { id: 6, nombre: "Carmen Fernández", email: "carmen@example.com", direccion: "Avenida Central 987", telefono: "789789789" },
    { id: 7, nombre: "José Rodríguez", email: "jose@example.com", direccion: "Calle Luna 159", telefono: "159159159" },
    { id: 8, nombre: "Lucía Martínez", email: "lucia@example.com", direccion: "Calle Sol 753", telefono: "753753753" },
    { id: 9, nombre: "Miguel Gómez", email: "miguel@example.com", direccion: "Calle Estrella 951", telefono: "951951951" },
    { id: 10, nombre: "Laura Ruiz", email: "laura@example.com", direccion: "Calle Mar 357", telefono: "357357357" }
];

let prestamos = [
    { id: 1, libroId: 2, usuarioId: 1, fecha_inicio: "2024-06-01", fecha_fin: "2024-06-23" , estado: 'prestado'},
    { id: 2, libroId: 5, usuarioId: 2, fecha_inicio: "2024-05-10", fecha_fin: "2024-06-24" , estado: 'prestado'},
    { id: 3, libroId: 8, usuarioId: 3, fecha_inicio: "2024-04-20", fecha_fin: "2024-05-04", estado: 'devuelto' },
    { id: 4, libroId: 10, usuarioId: 4, fecha_inicio: "2024-03-15", fecha_fin: "2024-03-29", estado: 'devuelto' },
    { id: 5, libroId: 2, usuarioId: 5, fecha_inicio: "2024-02-25", fecha_fin: "2024-03-11" , estado: 'devuelto'},
    { id: 6, libroId: 5, usuarioId: 6, fecha_inicio: "2024-01-30", fecha_fin: "2024-02-13", estado: 'devuelto' },
    { id: 7, libroId: 8, usuarioId: 7, fecha_inicio: "2023-12-15", fecha_fin: "2023-12-29", estado: 'devuelto' },
    { id: 8, libroId: 10, usuarioId: 8, fecha_inicio: "2023-11-20", fecha_fin: "2023-12-04", estado: 'devuelto' },
    { id: 9, libroId: 2, usuarioId: 9, fecha_inicio: "2023-10-25", fecha_fin: "2023-11-08", estado: 'devuelto' },
    { id: 10, libroId: 5, usuarioId: 10, fecha_inicio: "2023-09-30", fecha_fin: "2023-10-14", estado: 'devuelto' }
];


// Datos de prueba de usuarios para autenticación
const users = [
    { id: 1, username: 'admin', password: bcrypt.hashSync('admin123', 8), rol: 'ADMIN' },
    { id: 2, username: 'user', password: bcrypt.hashSync('user123', 8), rol: 'USER' }
];

// Middleware de autenticación
function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).send('Acceso denegado');

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send('Token no válido');
        req.user = user;
        next();
    });
}

// Middleware verificación de roles
function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.rol)) {
            return res.status(403).send('Acceso denegado');
        }
        next();
    };
}


// Endpoint de autenticación
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) return res.status(400).send('Usuario o contraseña incorrectos');

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(400).send('Usuario o contraseña incorrectos');

    const token = jwt.sign({ id: user.id, username: user.username, rol: user.rol }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Endpoint para renovar el token
app.get('/api/renew', authenticateToken, (req, res) => {
    const token = jwt.sign({ id: req.user.id, username: req.user.username, rol: req.user.rol }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Endpoints de Libros
app.get('/api/libros', (req, res) => {
    res.json(libros);
});

app.get('/api/libros/:id', (req, res) => {
    const libro = libros.find(l => l.id === parseInt(req.params.id));
    if (libro) {
        res.json(libro);
    } else {
        res.status(404).send('Libro no encontrado');
    }
});

app.post('/api/libros', authenticateToken, (req, res) => {
    const nuevoId = libros.length ? Math.max(...libros.map(l => l.id)) + 1 : 1;
    const nuevoLibro = { id: nuevoId, ...req.body };
    libros.push(nuevoLibro);
    res.status(201).json(nuevoLibro);
});


app.put('/api/libros/:id', authenticateToken, (req, res) => {
    const index = libros.findIndex(l => l.id === parseInt(req.params.id));
    if (index !== -1) {
        libros[index] = { ...libros[index], ...req.body };
        res.json(libros[index]);
    } else {
        res.status(404).send('Libro no encontrado');
    }
});

app.delete('/api/libros/:id', authenticateToken, (req, res) => {
    const index = libros.findIndex(l => l.id === parseInt(req.params.id));
    if (index !== -1) {
        const libroEliminado = libros.splice(index, 1);
        res.json(libroEliminado);
    } else {
        res.status(404).send('Libro no encontrado');
    }
});

// Endpoints de Autores (similares a los de Libros)
app.get('/api/autores', (req, res) => {
    res.json(autores);
});

app.get('/api/autores/:id', (req, res) => {
    const autor = autores.find(a => a.id === parseInt(req.params.id));
    if (autor) {
        res.json(autor);
    } else {
        res.status(404).send('Autor no encontrado');
    }
});

app.post('/api/autores', authenticateToken, (req, res) => {
    const nuevoId = autores.length ? Math.max(...autores.map(a => a.id)) + 1 : 1;
    const nuevoAutor = { id: nuevoId, ...req.body };
    autores.push(nuevoAutor);
    res.status(201).json(nuevoAutor);
});


app.put('/api/autores/:id', authenticateToken, (req, res) => {
    const index = autores.findIndex(a => a.id === parseInt(req.params.id));
    if (index !== -1) {
        autores[index] = { ...autores[index], ...req.body };
        res.json(autores[index]);
    } else {
        res.status(404).send('Autor no encontrado');
    }
});

app.delete('/api/autores/:id', authenticateToken, (req, res) => {
    const index = autores.findIndex(a => a.id === parseInt(req.params.id));
    if (index !== -1) {
        const autorEliminado = autores.splice(index, 1);
        res.json(autorEliminado);
    } else {
        res.status(404).send('Autor no encontrado');
    }
});

// Endpoints de Usuarios (similares a los de Libros)
app.get('/api/lectores', authenticateToken, (req, res) => {
    res.json(lectores);
});

app.get('/api/lectores/:id', authenticateToken, (req, res) => {
    const lector = lectores.find(u => u.id === parseInt(req.params.id));
    if (lector) {
        res.json(lector);
    } else {
        res.status(404).send('Lector no encontrado');
    }
});

app.post('/api/lectores', authenticateToken, authorizeRoles('ADMIN'), (req, res) => {
    const nuevoId = lectores.length ? Math.max(...lectores.map(u => u.id)) + 1 : 1;
    const nuevoLector = { id: nuevoId, ...req.body };
    lectores.push(nuevoLector);
    res.status(201).json(nuevoLector);
});


app.put('/api/lectores/:id', authenticateToken, authorizeRoles('ADMIN'), (req, res) => {
    const index = lectores.findIndex(u => u.id === parseInt(req.params.id));
    if (index !== -1) {
        lectores[index] = { ...lectores[index], ...req.body };
        res.json(lectores[index]);
    } else {
        res.status(404).send('Lector no encontrado');
    }
});

app.delete('/api/lectores/:id', authenticateToken, authorizeRoles('ADMIN'), (req, res) => {
    const index = lectores.findIndex(u => u.id === parseInt(req.params.id));
    if (index !== -1) {
        const lectorEliminado = lectores.splice(index, 1);
        res.json(lectorEliminado);
    } else {
        res.status(404).send('Lector no encontrado');
    }
});

// Endpoints de Préstamos (similares a los de Libros)
app.get('/api/prestamos', authenticateToken, (req, res) => {
    res.json(prestamos);
});

app.get('/api/prestamos/:id', authenticateToken, (req, res) => {
    const prestamo = prestamos.find(p => p.id === parseInt(req.params.id));
    if (prestamo) {
        res.json(prestamo);
    } else {
        res.status(404).send('Préstamo no encontrado');
    }
});

app.post('/api/prestamos', authenticateToken, (req, res) => {
    const nuevoId = prestamos.length ? Math.max(...prestamos.map(p => p.id)) + 1 : 1;
    const nuevoPrestamo = { id: nuevoId, ...req.body };
    prestamos.push(nuevoPrestamo);
    res.status(201).json(nuevoPrestamo);
});


app.put('/api/prestamos/:id', authenticateToken, (req, res) => {
    const index = prestamos.findIndex(p => p.id === parseInt(req.params.id));
    if (index !== -1) {
        prestamos[index] = { ...prestamos[index], ...req.body };
        res.json(prestamos[index]);
    } else {
        res.status(404).send('Préstamo no encontrado');
    }
});

app.delete('/api/prestamos/:id', authenticateToken, (req, res) => {
    const index = prestamos.findIndex(p => p.id === parseInt(req.params.id));
    if (index !== -1) {
        const prestamoEliminado = prestamos.splice(index, 1);
        res.json(prestamoEliminado);
    } else {
        res.status(404).send('Préstamo no encontrado');
    }
});

app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
});
