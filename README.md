# StockStainable

A tool for analyzing the sustainability of S&P 500 companies.

## Setup

1. Install [Anaconda](https://www.anaconda.com/products/individual).

2. Clone the repository and create and activate the Python virtual environment:

	```
	git clone https://github.com/AkshayAshok2/shellhacks-23
	cd shellhacks-23
	conda env create -f environment.yml
	conda activate sh23
	```

3. Download the sentiment analysis model:

	```
	python download.py
	```

4. Install the required packages:

	```
	cd client
	npm install
	```

5. Start the backend server:

	```
	cd ../server
	python server.py
	```

6. In another terminal, start the frontend server:

	```
	cd shellhacks-23/client
	npm run dev
	```

Now the application can be used at `http://localhost:3000` in a Web browser.

## Maintenance

To update the environment from `environment.yml`:

	conda env update -f environment.yml --prune
