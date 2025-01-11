from flask import Flask, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Load data
import os

data_path = './Electric_Vehicle_Population_Data.csv'

# Verify file existence
if not os.path.exists(data_path):
    raise FileNotFoundError(f"File not found: {data_path}. Please ensure the file is in the correct directory.")

# Load data
df = pd.read_csv(data_path)

@app.route('/api/metrics', methods=['GET'])
def metrics():
    total_evs = len(df)
    avg_range = df['Electric Range'].mean()
    avg_msrp = df['Base MSRP'].mean()
    return jsonify({
        'totalEVs': total_evs,
        'avgRange': round(avg_range, 2),
        'avgMSRP': round(avg_msrp, 2)
    })

@app.route('/api/locations', methods=['GET'])
def locations():
    yearly_data = df.groupby('Model Year').size().to_dict()
    type_distribution = df['Electric Vehicle Type'].value_counts().to_dict()
    price_vs_range = df[['Base MSRP', 'Electric Range']].dropna().values.tolist()

    return jsonify({
        'yearlyData': {
            'labels': list(yearly_data.keys()),
            'data': list(yearly_data.values())
        },
        'typeDistribution': {
            'labels': list(type_distribution.keys()),
            'data': list(type_distribution.values())
        },
        'priceVsRange': {
            'labels': [x[1] for x in price_vs_range],
            'data': [x[0] for x in price_vs_range]
        }
    })

if __name__ == '__main__':
    app.run( port=8501, debug=True)
