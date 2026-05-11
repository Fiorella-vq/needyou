from flask import Blueprint, request, jsonify
from api.models import db, User, WorkerProfile, Profession, WorkerProfession, Review

from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import func
import math

api = Blueprint('api', __name__)

# -----------------------------
# REGISTER
# -----------------------------
@api.route('/register', methods=['POST'])
def register():
    data = request.json

    email = data.get("email")
    password = data.get("password")
    nombre = data.get("nombre")

    if not email or not password:
        return jsonify({"msg": "Faltan datos"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Usuario ya existe"}), 400

    user = User(
        email=email,
        password=generate_password_hash(password),
        nombre=nombre
    )

    db.session.add(user)
    db.session.commit()

    return jsonify(user.serialize()), 201


# -----------------------------
# LOGIN
# -----------------------------
@api.route('/login', methods=['POST'])
def login():
    data = request.json

    user = User.query.filter_by(email=data.get("email")).first()

    if not user or not check_password_hash(user.password, data.get("password")):
        return jsonify({"msg": "Credenciales incorrectas"}), 401

    token = create_access_token(identity=user.id)

    return jsonify({
        "token": token,
        "user": user.serialize()
    }), 200


# -----------------------------
# BECOME WORKER
# -----------------------------
@api.route('/become-worker', methods=['POST'])
@jwt_required()
def become_worker():
    user_id = get_jwt_identity()
    data = request.json

    user = User.query.get(user_id)

    if user.es_trabajador:
        return jsonify({"msg": "Ya es trabajador"}), 400

    user.es_trabajador = True

    worker = WorkerProfile(
        user_id=user.id,
        descripcion=data.get("descripcion"),
        lat=data.get("lat"),
        lng=data.get("lng"),
        radio_servicio_km=data.get("radio", 10)
    )

    db.session.add(worker)
    db.session.commit()

    return jsonify({"msg": "Ahora sos trabajador"}), 200


# -----------------------------
# AGREGAR OFICIO
# -----------------------------
@api.route('/add-profession', methods=['POST'])
def add_profession():
    data = request.json

    prof = Profession(
        nombre=data.get("nombre"),
        categoria=data.get("categoria")
    )

    db.session.add(prof)
    db.session.commit()

    return jsonify(prof.serialize()), 201


# -----------------------------
# ASIGNAR OFICIO A TRABAJADOR
# -----------------------------
@api.route('/assign-profession', methods=['POST'])
@jwt_required()
def assign_profession():
    user_id = get_jwt_identity()
    data = request.json

    worker = WorkerProfile.query.filter_by(user_id=user_id).first()

    if not worker:
        return jsonify({"msg": "No sos trabajador"}), 400

    rel = WorkerProfession(
        worker_id=worker.id,
        profession_id=data.get("profession_id")
    )

    db.session.add(rel)
    db.session.commit()

    return jsonify({"msg": "Oficio asignado"}), 201


# -----------------------------
# DISTANCIA (Haversine)
# -----------------------------
def calcular_distancia(lat1, lon1, lat2, lon2):
    R = 6371  # km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

    return R * c


# -----------------------------
# BUSCAR TRABAJADORES (PRO 🔥)
# -----------------------------
@api.route('/workers', methods=['GET'])
def get_workers():
    lat = request.args.get("lat", type=float)
    lng = request.args.get("lng", type=float)
    profession_id = request.args.get("profession_id", type=int)

    workers = WorkerProfile.query.all()
    result = []

    for w in workers:

        # filtro por oficio
        if profession_id:
            rel = WorkerProfession.query.filter_by(
                worker_id=w.id,
                profession_id=profession_id
            ).first()

            if not rel:
                continue

        # distancia
        distancia = None
        if lat and lng and w.lat and w.lng:
            distancia = calcular_distancia(lat, lng, w.lat, w.lng)

            if distancia > w.radio_servicio_km:
                continue

        # promedio rating
        avg_rating = db.session.query(func.avg(Review.rating))\
            .filter(Review.to_user_id == w.user_id)\
            .scalar()

        data = w.serialize()
        data["user"] = w.user.serialize()
        data["distancia_km"] = distancia
        data["rating"] = round(avg_rating, 1) if avg_rating else 0

        result.append(data)

    return jsonify(result), 200


# -----------------------------
# REVIEW
# -----------------------------
@api.route('/review', methods=['POST'])
@jwt_required()
def create_review():
    from_user = get_jwt_identity()
    data = request.json

    if data.get("rating") is None:
        return jsonify({"msg": "Rating obligatorio"}), 400

    review = Review(
        from_user_id=from_user,
        to_user_id=data.get("to_user_id"),
        rating=data.get("rating"),
        comentario=data.get("comentario")
    )

    db.session.add(review)
    db.session.commit()

    return jsonify({"msg": "Review creada"}), 201