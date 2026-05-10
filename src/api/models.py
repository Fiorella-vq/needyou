from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# -----------------------------
# USUARIOS
# -----------------------------
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    is_active = db.Column(db.Boolean(), default=True)
    es_trabajador = db.Column(db.Boolean(), default=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email,
            "es_trabajador": self.es_trabajador
        }


# -----------------------------
# PERFIL DE TRABAJADOR
# -----------------------------
class WorkerProfile(db.Model):
    __tablename__ = "worker_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    descripcion = db.Column(db.Text)
    disponible = db.Column(db.Boolean(), default=True)
    rating = db.Column(db.Float, default=0)

    # ubicación
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    radio_servicio_km = db.Column(db.Integer, default=10)

    user = db.relationship('User', backref='worker_profile')

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "descripcion": self.descripcion,
            "disponible": self.disponible,
            "rating": self.rating,
            "lat": self.lat,
            "lng": self.lng
        }


# -----------------------------
# OFICIOS
# -----------------------------
class Profession(db.Model):
    __tablename__ = "professions"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), unique=True)
    categoria = db.Column(db.String(100))

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "categoria": self.categoria
        }


# -----------------------------
# RELACIÓN trabajador ↔ oficio
# -----------------------------
class WorkerProfession(db.Model):
    __tablename__ = "worker_professions"

    id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, db.ForeignKey('worker_profiles.id'))
    profession_id = db.Column(db.Integer, db.ForeignKey('professions.id'))

    def serialize(self):
        return {
            "id": self.id,
            "worker_id": self.worker_id,
            "profession_id": self.profession_id
        }


# -----------------------------
# REVIEWS (rating obligatorio)
# -----------------------------
class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)

    from_user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    to_user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    rating = db.Column(db.Integer, nullable=False)
    comentario = db.Column(db.Text)

    def serialize(self):
        return {
            "id": self.id,
            "from_user_id": self.from_user_id,
            "to_user_id": self.to_user_id,
            "rating": self.rating,
            "comentario": self.comentario
        }