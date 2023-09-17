from data import ProgressBar, get_data
from flask import Flask

app = Flask(__name__)

def update_display(percentage):
    print(f"{percentage}%")

@app.route("/")
def example():
    bar = ProgressBar(update_display)
    while (symbol := input("Enter a stock symbol: ")) != "":
        return get_data(bar, symbol)
