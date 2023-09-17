from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf

# App instance
app = Flask(__name__)
CORS(app)

sp500_symbols = []

with open("sandp.txt") as f:
        sp500_symbols = f.read().split("\n")


@app.route('/api/check', methods=['GET'])
def check_stock():
    search = request.args.get('q').strip().upper()
    if search in sp500_symbols:
        response = True
        tkr = yf.Ticker(search)
        name = tkr.info['longName']
    else:
        response = False
    return { "inSP500": response, "stock": search, "companyName": name }


@app.route('/api/search', methods=['GET', 'POST'])
def search():
    searchTerm = request


if __name__ == '__main__':
    app.run(debug=True, port=8080)