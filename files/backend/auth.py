"""
Authentication and OTP logic.
"""

from flask import Blueprint, request, jsonify
from backend.models import db, User, OTP
from flask_jwt_extended import create_access_token
from datetime import datetime, timedelta
import random

auth_bp = Blueprint("auth", __name__)

def generate_otp():
    return f"{random.randint(100000, 999999)}"

@auth_bp.route('/auth/request_otp', methods=["POST"])
def request_otp():
    data = request.get_json()
    email = data.get("email")
    phone = data.get("phone")

    if not (email or phone):
        return jsonify({"error": "Email or phone required"}), 400

    user = User.query.filter(
        (User.email == email) | (User.phone == phone)
    ).first()
    if not user:
        user = User(email=email, phone=phone)
        db.session.add(user)
        db.session.commit()

    otp_code = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    otp = OTP(user_id=user.id, otp_code=otp_code, expires_at=expires_at)
    db.session.add(otp)
    db.session.commit()

    # In production, send OTP via email/SMS
    print(f"OTP for {user.email or user.phone}: {otp_code}")

    return jsonify({"message": "OTP sent"}), 200

@auth_bp.route('/auth/verify_otp', methods=["POST"])
def verify_otp():
    data = request.get_json()
    email = data.get("email")
    phone = data.get("phone")
    otp_code = data.get("otp")

    user = User.query.filter(
        (User.email == email) | (User.phone == phone)
    ).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    otp = OTP.query.filter_by(user_id=user.id, otp_code=otp_code, verified=False).first()
    if not otp or otp.expires_at < datetime.utcnow():
        return jsonify({"error": "Invalid or expired OTP"}), 400

    otp.verified = True
    db.session.commit()
    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token}), 200