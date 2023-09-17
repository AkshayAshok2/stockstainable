import base64
import threading
from multiprocessing import Process, Queue
from multiprocessing.managers import SharedMemoryManager
from concurrent.futures import ThreadPoolExecutor
from matplotlib.figure import Figure
from company import SandPCompany, sentiment
from io import BytesIO

BAD_THINGS = {"animalTesting": "Animal Testing", "controversialWeapons": "Controversial Weapons",
        "smallArms": "Small Arms and Light Weapons", "furLeather": "Fur/Leather", "gmo": "GMOs",
        "pesticides": "Pesticides", "palmOil": "Palm Oil", "coal": "Coal",
        "militaryContract": "Military Contracting"}
PERF_MAP = {"LEAD_PERF": "Extremely High", "OUT_PERF": "High", "AVG_PERF": "Medium",
        "UNDER_PERF": "Low", "LAG_PERF": "Negligible"}

# TODO: figure out how to do multiprocessing properly!

class ProgressBar:
    def __init__(self, function):
        self.function = function
    def set_total(self, total):
        self.progress = 0
        self.total = total
        self.update_display()
    def increment(self):
        self.progress += 1
        self.update_display()
    def update_display(self):
        self.function((self.progress / self.total) * 100)

def compute_mean_resp(q, comp, shared):
    with ThreadPoolExecutor() as executor:
        results = executor.map(lambda index: sentiment(shared, comp.news, comp.resp, index), range(comp.n_resps))
    shared.buf[0] = 255
    filtered = [polarity for polarity in results if polarity[0] is not None]
    distances = [abs(polarity[0] - 0.5) for polarity in filtered]
    max_distance = max(distances)
    contributors = [filtered[i] for i, d in enumerate(distances) if d == max_distance]
    max_polarities, titles = zip(*contributors)
    comp.mean_resp = sum(max_polarities) / len(max_polarities)
    comp.titles = titles
    q.put(comp)

def plot(sustainability, metric, value, maximum):
    fig = Figure()
    ax = fig.subplots()
    ax.set_axis_off()
    fig.patch.set_alpha(0)
    fig.set_figheight(1)
    ax.plot([0, maximum], [0, 0], "w")
    ax.plot([0, maximum], [0, 0], "wo")
    summary = sustainability[f"peer{metric}Performance"]
    ax.plot([summary["min"], summary["max"]], [0, 0], marker="o", color="lime", linestyle="")
    ax.plot([summary["avg"]], [0], marker="o", color="yellow", linestyle="")
    ax.plot([value], [0], marker="o", color="red", linestyle="")
    buf = BytesIO()
    fig.savefig(buf, format="png")
    image = f"data:image/png;base64,{base64.b64encode(buf.getbuffer()).decode('ascii')}"
    return image, {"min": 0, "peer_min": summary["min"], "peer_avg": summary["avg"],
            "peer_max": summary["max"], "max": maximum, "value": value}

def progress(progress_bar, smem):
    headlines = set()
    while True:
        buf = smem.buf[0]
        if buf == 255:
            break
        if buf not in headlines:
            headlines.add(buf)
            progress_bar.increment()
        
def get_data(progress_bar, symbol):
    result = {}
    company = SandPCompany(symbol)
    progress_bar.set_total(company.n_resps)
    with SharedMemoryManager() as smm:
        smem = smm.SharedMemory(1)
        q = Queue()
        proc = Process(target=compute_mean_resp, args=(q, company, smem))
        proc.start()
        thread = threading.Thread(target=progress, args=(progress_bar, smem))
        thread.daemon = True
        thread.start()
        proc.join()
    company = q.get()
    sus = company.sustainability_data
    result["has_esg"] = sus != {}
    result["sentimental_headlines"] = company.titles
    result["sentiment"] = company.mean_resp
    if not result["has_esg"]:
        result["score"] = round(result["sentiment"] * 10)
        return result
    result["esg_percentile"] = sus["percentile"]["raw"]
    result["bad_things"] = [display for thing, display in BAD_THINGS.items() if sus[thing]]
    result["badness"] = -len(result["bad_things"]) / len(BAD_THINGS)
    raw_score = (result["sentiment"] + result["esg_percentile"] / 100 + result["badness"]) * 5
    result["score"] = max(round(raw_score), 0)
    result["esg"] = sus["totalEsg"]["raw"]
    result["esg_plot"], result["esg_plot_points"] = plot(sus, "EsgScore", sus["totalEsg"]["raw"], 70)
    for factor in ("Environment", "Social", "Governance"):
        lower = factor.lower()
        score = sus[f"{lower}Score"]["raw"]
        result[lower] = score
        result[f"{lower}_plot"], result[f"{lower}_plot_points"] = plot(sus, factor, score, 35)
    result["controversy"] = sus["highestControversy"]
    result["controversy_plot"], result["controversy_plot_points"] = plot(sus, "HighestControversy", sus["highestControversy"], 5)
    result["controversies"] = sus["relatedControversy"]
    result["category"] = sus["peerGroup"]
    result["category_size"] = sus["peerCount"]
    result["performance"] = PERF_MAP[sus["esgPerformance"]]
    return result
