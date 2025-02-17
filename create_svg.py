import requests
from bs4 import BeautifulSoup

BASE_URL = "https://karenbarbe.github.io/color_clusters/"
HEADERS = {"User-Agent": "Mozilla/5.0"}


def get_soup_data():
    response = requests.get(BASE_URL, headers=HEADERS)
    soup = BeautifulSoup(response.content, "lxml")
    print(f"Status: {response.status_code}")

    return soup.select("#color-clusters div")


print(get_soup_data())
