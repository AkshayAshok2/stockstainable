from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd
from data import ProgressBar, get_data

# App instance
app = Flask(__name__)
CORS(app)

sp500_symbols = pd.read_csv('sandp.csv', index_col=0)

def update_display(percentage):
    print(f"{percentage}%") # the console is our progress bar for now

@app.route('/api/check', methods=['GET'])
def check_stock():
    search = request.args.get('q').strip().upper()
    if search in sp500_symbols.index:
        # More information pulled from yfinance as preferred
        response = True
        tkr = yf.Ticker(search)
        name = tkr.info['longName']
    else:
        response = False
    return { "inSP500": response, "stock": search, "companyName": name }


@app.route('/api/search', methods=['GET', 'POST'])
def search():
    bar = ProgressBar(update_display) # initialize a ProgressBar instance with the display function
    search = request.args.get('q')
    # Pass the ProgressBar instance and capitalized stock symbol to the get_data function,
    # which will return a dictionary of relevant data
    return get_data(bar, search)


if __name__ == '__main__':
    app.run(debug=True, port=8080)