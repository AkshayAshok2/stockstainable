# Import the ProgressBar class and get_data function from the data module
from data import ProgressBar, get_data

# Define a function that updates the real progress bar display
def update_display(percentage):
    print(f"{percentage}%") # the console is our progress bar for now

if __name__ == "__main__": # <-- ignore this for now
    bar = ProgressBar(update_display) # initialize a ProgressBar instance with the display function

    while (symbol := input("Enter a stock symbol: ")) != "":
        # Pass the ProgressBar instance and capitalized stock symbol to the get_data function,
        # which will return a dictionary of relevant data
        data = get_data(bar, symbol)

        for k, v in data.items():
            if not k.endswith("_plot"):
                print(f"{k}: {v}")

        if data["has_esg"]: # this flags whether we have ESG data for a stock or not
            for metric in ("esg", "environment", "social", "governance", "controversy"):
                data[f"{metric}_plot"].show()
