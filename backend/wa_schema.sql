-- Esquema inicial para WA App

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT,
    categoria VARCHAR(50),
    otros_datos JSONB
);

CREATE TABLE contactos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    cliente_id INTEGER REFERENCES clientes(id),
    otros_datos JSONB
);

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(50),
    precio NUMERIC(10,2)
);

CREATE TABLE cronogramas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    cliente_id INTEGER REFERENCES clientes(id),
    fecha_inicio DATE NOT NULL,
    recurrencia VARCHAR(20), -- diaria, semanal, mensual
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE entregas (
    id SERIAL PRIMARY KEY,
    cronograma_id INTEGER REFERENCES cronogramas(id),
    fecha_entrega DATE NOT NULL,
    producto_id INTEGER REFERENCES productos(id),
    estado VARCHAR(20) DEFAULT 'pendiente'
);

CREATE TABLE modelos_mensaje (
    id SERIAL PRIMARY KEY,
    categoria VARCHAR(50),
    texto_base TEXT
);
