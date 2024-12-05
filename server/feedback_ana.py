from flask import Flask, request, jsonify
from pymongo import MongoClient
import requests
from datetime import datetime

app = Flask(__name__)

# MongoDB setup
MONGO_URI = "mongodb+srv://monica_g:MOWNICA%402021%23dk@cluster0.ttftc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client['feedbackDB']
feedback_collection = db['feedback']

# Together API setup
TOGETHER_API_KEY = '421985f93e7f97f537bf7b2c2706fc1e7f7f7f978910c9e1c837c7a3f326f784'
TOGETHER_API_URL = "https://api.together.xyz/v1/completions"
MODEL_NAME = 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo'

# Helper function to analyze sentiment via Together API
def analyze_feedback(feedback_text):
    prompt = f"Classify the sentiment of this feedback: '{feedback_text}' as positive, neutral, or negative."
    
    headers = {
        'Authorization': f'Bearer {TOGETHER_API_KEY}',
        'Content-Type': 'application/json'
    }
    
    data = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "max_tokens": 100,
        "temperature": 0.7
    }
    
    response = requests.post(TOGETHER_API_URL, headers=headers, json=data)
    sentiment = response.json()['choices'][0]['text'].strip() if response.status_code == 200 else 'Error'
    return sentiment

# Helper function to generate suggestions
def generate_suggestions(feedback_text):
    prompt = f"Suggest improvements based on this feedback: '{feedback_text}'."
    
    headers = {
        'Authorization': f'Bearer {TOGETHER_API_KEY}',
        'Content-Type': 'application/json'
    }
    
    data = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "max_tokens": 200,
        "temperature": 0.7
    }
    
    response = requests.post(TOGETHER_API_URL, headers=headers, json=data)
    suggestion = response.json()['choices'][0]['text'].strip() if response.status_code == 200 else 'Error generating suggestion'
    return suggestion

# API endpoint to get feedback between selected dates
@app.route('/analyze-feedback', methods=['POST'])
def analyze_feedback_by_date():
    # Get the 'from' and 'to' dates from the request
    data = request.json
    date_from = data['date_from']
    date_to = data['date_to']
    
    # Convert date strings to datetime objects
    date_from = datetime.strptime(date_from, '%Y-%m-%d')
    date_to = datetime.strptime(date_to, '%Y-%m-%d')
    
    # Fetch feedback from MongoDB between the selected dates
    feedbacks = list(feedback_collection.find({
        'timestamp': {
            '$gte': date_from,
            '$lte': date_to
        }
    }))
    
    # Process feedback for sentiment analysis and suggestions
    analyzed_feedbacks = []
    for feedback in feedbacks:
        feedback_text = feedback.get('comment', '')
        sentiment = analyze_feedback(feedback_text)
        suggestion = generate_suggestions(feedback_text) if sentiment == 'negative' else ''
        
        analyzed_feedbacks.append({
            'feedback': feedback_text,
            'rating': feedback.get('rating', ''),
            'sentiment': sentiment,
            'suggestion': suggestion,
            'timestamp': feedback.get('timestamp', '')
        })
    
    return jsonify(analyzed_feedbacks)

if __name__ == '__main__':
    app.run(port=5000,debug=True)
