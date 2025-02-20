from flask import Flask, render_template

# Создаем экземпляр Flask приложения
app = Flask(__name__, static_url_path='/static')

# Главная страница
@app.route('/')
def index():
    return render_template('index.html')

# Запускаем приложение
if __name__ == '__main__':
    app.run(debug=True)
