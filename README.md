# 📈 StockFlow - Simulador de Bolsa de Valores

**StockFlow** es una plataforma web avanzada para simular inversiones en bolsa de valores con datos en tiempo real. Practica con acciones reales de NASDAQ y MBV sin riesgo.

## 🚀 Características

- ✅ **Simulador de Bolsa** - Precios en tiempo real con variaciones ±2%
- ✅ **Múltiples Mercados** - NASDAQ (acciones USD) y MBV (acciones MXN)
- ✅ **Tipo de Cambio** - Actualización automática USD/MXN cada 5 minutos
- ✅ **Autenticación Segura** - Sistema de registro y login
- ✅ **Dashboard Profesional** - Interfaz moderna y responsive
- ✅ **Operaciones** - Compra/venta con validación de fondos
- ✅ **Portfolio Personal** - Seguimiento de inversiones

## 🛠️ Tecnologías Utilizadas

### Backend:
- **Python 3.8+** - Lenguaje principal
- **Flask** - Framework web
- **Flask-SQLAlchemy** - ORM para base de datos
- **Flask-Login** - Manejo de autenticación
- **Flask-WTF** - Formularios web
- **PostgreSQL** - Base de datos (compatible con SQLite)

### Frontend:
- **HTML5** - Estructura web
- **CSS3** - Estilos y diseño responsive
- **JavaScript** - Interactividad en tiempo real
- **Bootstrap Icons** - Iconografía profesional

### APIs Externas:
- **ExchangeRate-API** - Tipo de cambio USD/MXN en tiempo real

## 📋 Requisitos Previos

- **Python 3.8** o superior
- **PostgreSQL** (recomendado) o SQLite
- **pip** (gestor de paquetes de Python)
- **Git** (para clonar el repositorio)

## 🚀 Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
# Clonar el proyecto
git clone <url-del-repositorio>
cd stockflow-simulator

# O si no tienes Git, descarga el ZIP y extrae en una carpeta
```

### 2. Configurar Entorno Virtual (Recomendado)

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate
```

### 3. Instalar Dependencias

```bash
# Instalar todas las dependencias
pip install -r requirements.txt

# Si no tienes requirements.txt, instalar manualmente:
pip install flask flask-sqlalchemy flask-login flask-wtf requests python-dotenv wtforms
```

### 4. Configurar Base de Datos

#### Opción A: PostgreSQL (Recomendado)

1. **Instalar PostgreSQL:**
   - **Windows:** Descargar desde [postgresql.org](https://www.postgresql.org/download/windows/)
   - **macOS:** `brew install postgresql`
   - **Linux:** `sudo apt-get install postgresql postgresql-contrib`

2. **Crear base de datos:**
```sql
CREATE DATABASE bolsa_valores_db;
CREATE USER stockflow_user WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE bolsa_valores_db TO stockflow_user;
```

#### Opción B: SQLite (Para desarrollo)

No requiere configuración adicional, se crea automáticamente.

### 5. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Clave secreta para Flask (cambiar por una clave segura)
SECRET_KEY=tu_clave_secreta_muy_segura_aqui

# Configuración de base de datos
# Para PostgreSQL:
DATABASE_URL=postgresql://postgres:eduardo1@localhost:5432/bolsa_valores_db

# Para SQLite (alternativa):
# DATABASE_URL=sqlite:///stockflow.db
```

### 6. Inicializar la Base de Datos

```bash
# Ejecutar el siguiente comando en Python para crear las tablas
python -c "
from app import db, app
with app.app_context():
    db.create_all()
    print('✅ Base de datos inicializada correctamente')
"
```

### 7. Ejecutar la Aplicación

```bash
# Ejecutar la aplicación
python app.py
```

### 8. Acceder a la Aplicación

Abrir navegador y visitar: **http://127.0.0.1:5000**

## 👤 Primer Uso

### Registro de Usuario:
1. Ir a **http://127.0.0.1:5000/register**
2. Crear una cuenta con:
   - Nombre de usuario
   - Email
   - Contraseña
3. **Saldo inicial:** $10,000 MXN automáticamente

### Acciones Disponibles:
- **NASDAQ:** AAPL, TSLA, MSFT, GOOGL, AMZN, META, NVDA, AMD
- **MBV:** AMX, WALMEX, FEMSA, GFNORTE, CEMEX

## 🎯 Funcionalidades Principales

### Dashboard:
- 📊 Resumen de portfolio
- 💰 Saldo disponible en MXN
- 📈 Valor del portfolio en USD
- 💱 Tipo de cambio en tiempo real
- 🏢 Tabla de mercado NASDAQ 500 Live

### Operaciones:
- **Compra:** Seleccionar acción y cantidad
- **Venta:** Vender acciones desde tu portfolio
- **Validación:** Verificación automática de fondos
- **Historial:** Registro de todas las transacciones

### Características en Tiempo Real:
- 🔄 **Precios de acciones** - Actualización cada 30 segundos
- 💹 **Tipo de cambio** - Actualización cada 5 minutos
- 📱 **Interfaz responsive** - Funciona en desktop y móvil

## 🐛 Solución de Problemas Comunes

### Error: "ModuleNotFoundError"
```bash
# Asegurar que todas las dependencias estén instaladas
pip install -r requirements.txt
```

### Error: Conexión a Base de Datos
- Verificar que PostgreSQL esté ejecutándose
- Confirmar credenciales en `.env`
- Probar conexión manualmente

### Error: Puerto Ocupado
```bash
# Cambiar puerto de ejecución
python app.py --port 5001
```

### Las Acciones MBV No Aparecen
```bash
# Reinicializar base de datos
python -c "
from app import db, app
with app.app_context():
    db.drop_all()
    db.create_all()
    print('✅ Base de datos reinicializada')
"
```

## 📁 Estructura del Proyecto

```
stockflow-simulator/
├── app.py                 # Aplicación principal Flask
├── requirements.txt       # Dependencias de Python
├── .env                  # Variables de entorno (crear)
├── static/
│   ├── css/
│   │   └── style.css     # Estilos principales
│   └── js/
│       ├── dashboard.js  # JavaScript del dashboard
│       └── exchange.js   # Manejo de tipo de cambio
└── templates/
    ├── layout.html       # Layout base
    ├── index.html        # Página principal
    ├── login.html        # Inicio de sesión
    ├── register.html     # Registro de usuario
    └── dashboard.html    # Dashboard principal
```

## 🔧 Comandos Útiles

```bash
# Ejecutar en modo desarrollo
python app.py

# Ejecutar en puerto específico
python app.py --port 8080

# Verificar dependencias
pip list

# Desactivar entorno virtual
deactivate
```

## 📞 Soporte

Si encuentras problemas durante la instalación:

1. Verifica que Python 3.8+ esté instalado
2. Confirma que todas las dependencias estén instaladas
3. Revisa la configuración de la base de datos
4. Asegúrate de que el archivo `.env` esté correctamente configurado

## 🎓 Uso Educativo

Este proyecto es ideal para:
- Aprender sobre mercados bursátiles
- Practicar estrategias de inversión
- Entender el funcionamiento de APIs en tiempo real
- Desarrollar habilidades en Flask y bases de datos

---

**¡Listo para invertir! 🚀📈**

*StockFlow - Tu simulador profesional de bolsa de valores*