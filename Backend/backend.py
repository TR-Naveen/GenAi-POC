from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import httpx

app = Flask(__name__)

# Allow CORS for the React frontend
CORS(app, origins=["http://localhost:3000"])

def process(data):
    try:
        client = Groq(api_key="")
        client._client = httpx.Client(verify=False)
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "user",
                    "content": data
                }
            ],
            temperature=1,
            max_tokens=1024,
            top_p=1,
            stream=True,
            stop=None,
        )
        result = ""
        for chunk in completion:
            result += str(chunk.choices[0].delta.content)
        return result
    except Exception as e:
        print("Error in process function:", e)
        return "Error processing data"

@app.route('/data', methods=["POST"])
def receive_data():
    data = request.json.get('prompt', '')  # Extract 'prompt' from request data
    processed_data = process(data)
    return jsonify({'data_from_model': processed_data})  # Ensure 'data_from_model' is always included

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
