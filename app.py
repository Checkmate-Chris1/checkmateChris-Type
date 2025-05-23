import json

import flask
import random
from flask import render_template, request, Flask, jsonify
import flask_socketio

global word_list
global quotes_list

app = Flask(__name__)

with open("./static/top1000words.txt", "r", encoding='utf-8') as file:
    word_list = []
    for line in file:
        word_list.append(line.strip())
    file.close()

with open('static/quotes.json', 'r', encoding='utf-8') as file:
    quotes_list = []
    data = json.load(file)
    for quote in data['quotes']:
        quotes_list.append(quote)
    file.close()


@app.route("/")
def init():
    return render_template("site.html")

@app.post("/words")
def get_words():
    words = []
    numWords = int(request.get_data(as_text=True))

    for i in range(numWords):
        words.append(word_list[random.randint(0, len(word_list))-1])

    return jsonify(words)

@app.post("/quotes")
def get_quotes():
    requested_length = int(request.get_data(as_text=True))   # 0: short, 1: medium, 2: long, 3: thicc
    id = 0

    while True:
        id = random.randrange(0, len(quotes_list))
        quote_length = quotes_list[id]['length']
        if requested_length == 0 and quote_length <= 100:
            break
        if requested_length == 1 and 101 <= quote_length <= 300:
            break
        if requested_length == 2 and 301 <= quote_length <= 600:
            break
        if requested_length == 3 and quote_length >= 601:
            break

    text = quotes_list[id]['text']

    return jsonify(text.split())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)