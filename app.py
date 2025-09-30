from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired, Email, EqualTo, Length
from datetime import datetime
import random
import threading
import time
import os
import requests
from dotenv import load_dotenv

# Cargar variables del archivo .env
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL',
    'postgresql://postgres:eduardo1@localhost:5432/bolsa_valores_db'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CACHE_TYPE'] = 'SimpleCache'
app.config['CACHE_DEFAULT_TIMEOUT'] = 60

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'index' 

# === VARIABLE GLOBAL PARA TIPO DE CAMBIO ===
current_exchange_rate = 18.35

# === FORMULARIOS FLASK-WTF ===
class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Contraseña', validators=[DataRequired()])
    remember = BooleanField('Recordar sesión')
    submit = SubmitField('Iniciar Sesión')

class RegisterForm(FlaskForm):
    username = StringField('Usuario', validators=[DataRequired(), Length(min=4, max=20)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Contraseña', validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField('Confirmar Contraseña', 
                                   validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Registrarse')

# === MODELOS ===
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    cash_balance = db.Column(db.Float, default=10000.0)  # 10000 MXN iniciales

class Stock(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(10), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    current_price = db.Column(db.Float, nullable=False)
    previous_close = db.Column(db.Float, nullable=False)
    market = db.Column(db.String(10), nullable=False)
    currency = db.Column(db.String(3), default='USD')

class Portfolio(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    stock_id = db.Column(db.Integer, db.ForeignKey('stock.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    purchase_price = db.Column(db.Float, nullable=False)
    stock = db.relationship('Stock')

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    stock_id = db.Column(db.Integer, db.ForeignKey('stock.id'), nullable=False)
    type = db.Column(db.String(4), nullable=False)  # BUY, SELL
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    stock = db.relationship('Stock')

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# === ACTUALIZADOR DE TIPO DE CAMBIO EN TIEMPO REAL ===
def update_exchange_rate():
    """Actualizar el tipo de cambio MXN/USD en tiempo real"""
    global current_exchange_rate
    
    while True:
        try:
            # API gratuita para tipo de cambio (USD a MXN)
            response = requests.get('https://api.exchangerate-api.com/v4/latest/USD', timeout=10)
            if response.status_code == 200:
                data = response.json()
                usd_to_mxn = data['rates']['MXN']
                
                # Actualizar la variable global
                current_exchange_rate = round(usd_to_mxn, 2)
                
                print(f"💰 Tipo de cambio actualizado: 1 USD = {current_exchange_rate} MXN")
            else:
                # Fallback si la API falla - simular pequeña variación
                variation = random.uniform(-0.02, 0.02)
                current_exchange_rate = round(current_exchange_rate * (1 + variation), 2)
                print(f"⚠️  API no disponible, usando valor simulado: {current_exchange_rate} MXN")
                
        except Exception as e:
            # En caso de error, simular pequeña variación
            variation = random.uniform(-0.02, 0.02)
            current_exchange_rate = round(current_exchange_rate * (1 + variation), 2)
            print(f"❌ Error actualizando tipo de cambio: {e}. Usando: {current_exchange_rate} MXN")
        
        time.sleep(300)  # Actualizar cada 5 minutos

# === DATOS INICIALES ===
def create_initial_data():
    """Crear stocks iniciales si no existen"""
    if Stock.query.count() == 0:
        stocks_data = [
            {"symbol": "AAPL", "name": "Apple Inc.", "price": 150.25, "market": "NASDAQ"},
            {"symbol": "TSLA", "name": "Tesla Inc.", "price": 245.80, "market": "NASDAQ"},
            {"symbol": "MSFT", "name": "Microsoft Corp.", "price": 330.45, "market": "NASDAQ"},
            {"symbol": "GOOGL", "name": "Alphabet Inc.", "price": 135.10, "market": "NASDAQ"},
            {"symbol": "AMZN", "name": "Amazon.com Inc.", "price": 145.75, "market": "NASDAQ"},
            {"symbol": "META", "name": "Meta Platforms Inc.", "price": 315.60, "market": "NASDAQ"},
            {"symbol": "NVDA", "name": "NVIDIA Corp.", "price": 485.20, "market": "NASDAQ"},
            {"symbol": "AMD", "name": "Advanced Micro Devices", "price": 112.35, "market": "NASDAQ"},
            {"symbol": "AMX", "name": "América Móvil", "price": 15.80, "market": "MBV"},
            {"symbol": "WALMEX", "name": "Walmart México", "price": 65.30, "market": "MBV"},
            {"symbol": "FEMSA", "name": "FEMSA", "price": 185.45, "market": "MBV"},
            {"symbol": "GFNORTE", "name": "Grupo Financiero Banorte", "price": 142.20, "market": "MBV"},
            {"symbol": "CEMEX", "name": "CEMEX", "price": 9.85, "market": "MBV"},
        ]
        
        for stock_info in stocks_data:
            stock = Stock(
                symbol=stock_info["symbol"],
                name=stock_info["name"],
                current_price=stock_info["price"],
                previous_close=stock_info["price"] * random.uniform(0.98, 1.02),
                market=stock_info["market"],
                currency="USD"
            )
            db.session.add(stock)
        
        db.session.commit()
        print("✅ Stocks iniciales creados")

# === SIMULADOR DE PRECIOS ===
def simulate_price_changes():
    """Simular cambios de precios en tiempo real"""
    while True:
        try:
            with app.app_context():
                stocks = Stock.query.all()
                for stock in stocks:
                    # Variación de ±2%
                    change_percent = random.uniform(-0.02, 0.02)
                    new_price = stock.current_price * (1 + change_percent)
                    stock.current_price = round(max(new_price, 0.01), 2)  # Precio mínimo 0.01
                db.session.commit()
                print(f"🔄 Precios actualizados a las {datetime.now()}")
            time.sleep(30)  # Actualizar cada 30 segundos
        except Exception as e:
            print(f"Error en simulador: {e}")
            time.sleep(10)

# === RUTAS PRINCIPALES ===
@app.route('/')
def index():
    """Página principal - Landing page para usuarios no autenticados"""
    if current_user.is_authenticated:
        # Si ya está autenticado, redirigir al dashboard
        return redirect(url_for('dashboard'))
    
    # Renderizar página de inicio para usuarios no autenticados
    return render_template('index.html')

@app.route('/dashboard')
@login_required
def dashboard():
    """Dashboard principal - Solo para usuarios autenticados"""
    # Obtener portafolio del usuario
    portfolio_items = Portfolio.query.filter_by(user_id=current_user.id).all()
    
    # Calcular valores del portafolio
    total_value = 0
    portfolio_data = []
    
    for item in portfolio_items:
        current_value = item.quantity * item.stock.current_price
        total_value += current_value
        change_today = ((item.stock.current_price - item.stock.previous_close) / item.stock.previous_close) * 100
        
        portfolio_data.append({
            'symbol': item.stock.symbol,
            'name': item.stock.name,
            'current_price': item.stock.current_price,
            'change_today': round(change_today, 2),
            'quantity': item.quantity,
            'total_value': round(current_value, 2),
            'purchase_price': item.purchase_price
        })
    
    # Usar el tipo de cambio en tiempo real
    exchange_rate = current_exchange_rate
    
    # Todas las acciones disponibles
    all_stocks = Stock.query.all()
    
    # Fecha y hora actual para el timestamp
    now = datetime.now()
    
    return render_template('dashboard.html', 
                         portfolio=portfolio_data,
                         total_value=round(total_value, 2),
                         exchange_rate=exchange_rate,
                         all_stocks=all_stocks,
                         cash_balance=current_user.cash_balance,
                         now=now)

@app.route('/home')
def home():
    """Página de inicio - redirige al index"""
    return redirect(url_for('index'))

# === RUTAS DE AUTENTICACIÓN ===
@app.route('/login', methods=['GET', 'POST'])
def login():
    """Iniciar sesión"""
    # Si ya está autenticado, redirigir al dashboard
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    form = LoginForm()
    
    if form.validate_on_submit():
        # Buscar usuario por email (como lo tienes en tu template)
        user = User.query.filter_by(email=form.email.data).first()
        
        if user and user.password == form.password.data:
            login_user(user, remember=form.remember.data)
            flash('¡Inicio de sesión exitoso!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Email o contraseña incorrectos', 'error')
    
    return render_template('login.html', form=form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    """Registrar nuevo usuario"""
    # Si ya está autenticado, redirigir al dashboard
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    form = RegisterForm()
    
    if form.validate_on_submit():
        # Validaciones adicionales
        if User.query.filter_by(username=form.username.data).first():
            flash('El usuario ya existe', 'error')
            return render_template('register.html', form=form)
        
        if User.query.filter_by(email=form.email.data).first():
            flash('El email ya está registrado', 'error')
            return render_template('register.html', form=form)
        
        # Crear nuevo usuario
        new_user = User(
            username=form.username.data,
            email=form.email.data,
            password=form.password.data,
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        flash('¡Registro exitoso! Por favor inicia sesión.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html', form=form)

@app.route('/registro')
def registro():
    """Alias para register - compatibilidad con templates en español"""
    return redirect(url_for('register'))

@app.route('/logout')
@login_required
def logout():
    """Cerrar sesión"""
    logout_user()
    flash('¡Sesión cerrada!', 'success')
    return redirect(url_for('index'))  

@app.route('/buy', methods=['POST'])
@login_required
def buy_stock():
    """Comprar acciones"""
    symbol = request.form.get('symbol')
    quantity = int(request.form.get('quantity'))
    
    stock = Stock.query.filter_by(symbol=symbol).first()
    if not stock:
        flash('Acción no encontrada', 'error')
        return redirect(url_for('dashboard'))
    
    # Usar tipo de cambio en tiempo real
    exchange_rate = current_exchange_rate
    total_cost_usd = stock.current_price * quantity
    total_cost_mxn = total_cost_usd * exchange_rate
    
    # Verificar fondos
    if current_user.cash_balance < total_cost_mxn:
        flash('Fondos insuficientes', 'error')
        return redirect(url_for('dashboard'))
    
    # Actualizar saldo
    current_user.cash_balance -= total_cost_mxn
    
    # Verificar si ya tiene esta acción
    portfolio_item = Portfolio.query.filter_by(
        user_id=current_user.id, 
        stock_id=stock.id
    ).first()
    
    if portfolio_item:
        # Actualizar cantidad existente (promedio de precio)
        total_shares = portfolio_item.quantity + quantity
        total_cost = (portfolio_item.quantity * portfolio_item.purchase_price) + (quantity * stock.current_price)
        portfolio_item.purchase_price = total_cost / total_shares
        portfolio_item.quantity = total_shares
    else:
        # Nueva entrada en portafolio
        portfolio_item = Portfolio(
            user_id=current_user.id,
            stock_id=stock.id,
            quantity=quantity,
            purchase_price=stock.current_price
        )
        db.session.add(portfolio_item)
    
    # Registrar transacción
    transaction = Transaction(
        user_id=current_user.id,
        stock_id=stock.id,
        type='BUY',
        quantity=quantity,
        price=stock.current_price
    )
    db.session.add(transaction)
    
    db.session.commit()
    flash(f'Compra exitosa: {quantity} acciones de {symbol}', 'success')
    return redirect(url_for('dashboard'))

@app.route('/sell', methods=['POST'])
@login_required
def sell_stock():
    """Vender acciones"""
    symbol = request.form.get('symbol')
    quantity = int(request.form.get('quantity'))
    
    stock = Stock.query.filter_by(symbol=symbol).first()
    portfolio_item = Portfolio.query.filter_by(
        user_id=current_user.id, 
        stock_id=stock.id
    ).first()
    
    if not portfolio_item or portfolio_item.quantity < quantity:
        flash('No tienes suficientes acciones para vender', 'error')
        return redirect(url_for('dashboard'))
    
    # Usar tipo de cambio en tiempo real
    exchange_rate = current_exchange_rate
    total_income_usd = stock.current_price * quantity
    total_income_mxn = total_income_usd * exchange_rate
    
    # Actualizar saldo y portafolio
    current_user.cash_balance += total_income_mxn
    
    if portfolio_item.quantity == quantity:
        # Vender todas las acciones
        db.session.delete(portfolio_item)
    else:
        # Vender parcialmente
        portfolio_item.quantity -= quantity
    
    # Registrar transacción
    transaction = Transaction(
        user_id=current_user.id,
        stock_id=stock.id,
        type='SELL',
        quantity=quantity,
        price=stock.current_price
    )
    db.session.add(transaction)
    
    db.session.commit()
    flash(f'Venta exitosa: {quantity} acciones de {symbol}', 'success')
    return redirect(url_for('dashboard'))

# === API PARA TIPO DE CAMBIO ===
@app.route('/api/exchange-rate')
@login_required
def get_exchange_rate():
    """API para obtener el tipo de cambio actual"""
    return jsonify({
        'success': True,
        'rate': current_exchange_rate,
        'timestamp': datetime.utcnow().isoformat()
    })

# === INICIALIZACIÓN ===
with app.app_context():
    # Para desarrollo: recrear tablas si es necesario
    db.create_all()
    create_initial_data()
    
    # Iniciar simulador de precios
    price_thread = threading.Thread(target=simulate_price_changes)
    price_thread.daemon = True
    price_thread.start()
    
    # Iniciar actualizador de tipo de cambio
    exchange_thread = threading.Thread(target=update_exchange_rate)
    exchange_thread.daemon = True
    exchange_thread.start()
    
    print("✅ Aplicación iniciada correctamente")
    print("💰 Tipo de cambio en tiempo real activado")
    print("🌐 Servidor ejecutándose en http://127.0.0.1:5000")
    print("📄 Página principal: http://127.0.0.1:5000/")

if __name__ == '__main__':
    app.run(debug=True)