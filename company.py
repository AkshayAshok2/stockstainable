from ast import literal_eval
import pandas as pd
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from gnews import GNews

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36"
DF = pd.read_csv("sandp.csv", index_col=0)
SIA = SentimentIntensityAnalyzer()

def sentiment(shared, news, resp, index):
    article = news.get_full_article(resp[index]["url"])
    if article is None:
        return None, None
    title = article.title
    shared.buf[0] = index
    return (SIA.polarity_scores(title)["compound"] + 1) / 2, title

def get_sustainability_data(symbol):
    return res.json()["quoteSummary"]["result"][0]

class SandPCompany:
    mean_resp = None
    titles = None
    
    def __init__(self, symbol):
        row = DF.loc[symbol]
        self.news = GNews(language="en", country="US", max_results=10)
        self.resp = self.news.get_news(f"{row.security} sustainability")
        self.n_resps = len(self.resp)
        esg_scores = row.esgScores
        self.sustainability_data = literal_eval(esg_scores) if not pd.isna(esg_scores) else {}
