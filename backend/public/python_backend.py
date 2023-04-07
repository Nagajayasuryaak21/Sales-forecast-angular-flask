from flask import Flask, request, jsonify
from flask_cors import CORS
import asyncio
import pandas as pd
import matplotlib.pyplot as plt
from prophet import Prophet
import os

app = Flask(__name__)
CORS(app)
async def simulate_work():
    await asyncio.sleep(1)

    return "Work completed"

def func(p, f,file,path):
    # Load data from a CSV file
    '''
    # Create a new directory if it doesn't exist
    if not os.path.exists(path):
        os.makedirs(path)

    # Create a new file in the directory
    filepath = os.path.join(path, 'data.csv')
    '''
    filepath=path+'/output_data.csv'
    filepath2=path+'/data.csv'
    data = pd.read_csv(file)

    # Check if 'date' and 'sales' columns exist in the data
    if 'date' not in data.columns or 'sales' not in data.columns:
        return {'error': 'CSV file does not contain required columns'}

    # Convert the date column to a datetime format
    data['date'] = pd.to_datetime(data['date'])

    # Rename the columns to 'ds' and 'y' as required by Prophet
    data = data.rename(columns={'date': 'ds', 'sales': 'y'})

    # Split the data into train and test sets
    train_data = data[:-2]
    test_data = data[-2:]

    # Fit the model using the train data
    model = Prophet()
    model.fit(train_data)
    

    # Make predictions for the next two months
    future = model.make_future_dataframe(periods=p, freq=f)
    forecast = model.predict(future)
    forecast.to_csv(filepath, index=False)

    future2 = model.make_future_dataframe(periods=0, freq=f)
    forecast2 = model.predict(future2)
    forecast2.to_csv(filepath2, index=False)
    

    return {'success': 'Forecast generated successfully','path1':filepath,'path2:':filepath2}

@app.route('/api/mydata', methods=['POST'])
async def post_mydata():
    print(request.args)
    type_ = request.args.get('type')
    period = int(request.args.get('period'))
    file = request.args.get('file')
    path = request.args.get('path')
    
    #id = request.args.get('id')
    data = {'type': type_, 'period': period, 'path': path ,'file':file }
    print(data)
    #return data

    # Simulate some asynchronous work
    # result = await simulate_work()
    
    result = func(period, type_,file,path)

    if 'error' in result:
        # Handle error
        print('Error:', result['error'])
    else:
        # Handle success
        print('Success:', result['success'])

    return result 

if __name__ == '__main__':
    app.run()
