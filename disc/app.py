import yfinance as yf
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

with open("sandp.txt") as f:
    tickers = f.read().split("\n")

# Bool to check if stock is in S&P
def is_SandP(stock):
    if stock in tickers:
        return True

# Dummy function to simulate stock symbol lookup
def lookup_stock(symbol):
    # You can replace this with your actual backend logic
    if is_SandP(symbol):
        tkr = yf.Ticker(symbol)
        name = tkr.info['longName']
        return f"{name} ({symbol}) is part of the S&P 500. It has an ESG rating of.."
    else:
        return f"{symbol} is not held in the S&P 500."

def about_biz(symbol):
    # About business
    if is_SandP(symbol):
        tkr = yf.Ticker(symbol)
        name = tkr.info['longName']
        sector = tkr.info['sector']
        summary = tkr.info['longBusinessSummary']
        return f"{name} operates within the {sector} sector. {summary}."
    else:
        return "No information. This stock is not relevant."
        

@app.route('/')
def index():
    return render_template('webpage_template.html')

@app.route('/lookup', methods=['POST'])
def stock_lookup():
    symbol = request.form['symbol'].strip().upper()
    print(f"Symbol received: {symbol}")  # Add this line for debugging
    stock_summary = about_biz(symbol)
    stock_info = lookup_stock(symbol)
    print(f"Stock Summary: {stock_info}")  # Add this line for debugging
    print(f"Stock Info: {stock_info}")  # Add this line for debugging
    return render_template('lookup_result.html', stock_info=stock_info, stock_summary = stock_summary)

@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True)

    
