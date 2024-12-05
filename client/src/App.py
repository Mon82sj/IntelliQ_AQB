from flask import Flask, jsonify, request
from pymongo import MongoClient
import requests

app = Flask(__name__)

# MongoDB connection setup
client = MongoClient("mongodb+srv://monica_g:MOWNICA%402021%23dk@cluster0.ttftc.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0")
db = client['test']
feedback_collection = db['feedbacks']

# Together API setup
TOGETHER_API_URL = "https://api.together.xyz/v1/completions"
TOGETHER_API_KEY = "421985f93e7f97f537bf7b2c2706fc1e7f7f7f978910c9e1c837c7a3f326f784"
TOGETHER_MODEL = "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo"

# Route to fetch feedbacks from MongoDB
@app.route('/feedbacks', methods=['GET'])
def get_feedbacks():
    feedbacks = list(feedback_collection.find({}, {"_id": 0}))
    return jsonify(feedbacks)

# Route to analyze feedback using Together API
@app.route('/analyze', methods=['POST'])
def analyze_feedback():
    data = request.json
    comments = [item['comment'] for item in data]  # Extract comments for analysis
    ratings = [item['rating'] for item in data]    # Extract ratings for analysis

    # Concatenate comments and ratings into the prompt
    prompt = f"Analyze the following feedback comments and ratings: {comments}. Provide a detailed sentiment analysis and suggestions for improvement."

    # Together API request payload
    payload = {
        "model": TOGETHER_MODEL,
        "prompt": prompt,
        "temperature": 0.7,
        "max_tokens": 500
    }

    # Send request to Together API for sentiment analysis
    headers = {
        "Authorization": f"Bearer {TOGETHER_API_KEY}",
        "Content-Type": "application/json"
    }
    response = requests.post(TOGETHER_API_URL, json=payload, headers=headers)

    # Return analysis result
    if response.status_code == 200:
        result = response.json()['choices'][0]['text']
        return jsonify({"analysis": result})
    else:
        return jsonify({"error": "Failed to analyze feedback"}), 500

if __name__ == '__main__':
    app.run(debug=True)
