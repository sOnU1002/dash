import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css';

function App() {
    const [metrics, setMetrics] = useState({});
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        // Fetch metrics and data
        axios.get('https://vercel.com/sonu1002s-projects/back/api/metrics').then(response => {
            setMetrics(response.data);
        });

        axios.get('https://vercel.com/sonu1002s-projects/back/api/locations').then(response => {
            const { yearlyData, typeDistribution, priceVsRange } = response.data;
            setChartData({ yearlyData, typeDistribution, priceVsRange });
        });
    }, []);

    return (
        <div className="App">
            <header>
                <h1>EV Analytics Dashboard</h1>
            </header>
            <main>
                <div className="metrics">
                    <div className="metric">Total EVs: {metrics.totalEVs}</div>
                    <div className="metric">Average Range: {metrics.avgRange} miles</div>
                    <div className="metric">Average MSRP: ${metrics.avgMSRP}</div>
                </div>
                <div className="charts">
                    {chartData && (
                        <>
                            <div className="chart">
                                <h2>Yearly Trend of EV Registrations</h2>
                                <Bar
                                    data={{
                                        labels: chartData.yearlyData.labels,
                                        datasets: [
                                            {
                                                label: 'Registrations',
                                                data: chartData.yearlyData.data,
                                                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                            },
                                        ],
                                    }}
                                />
                            </div>
                            <div className="chart" >
    <h2>EV Type Distribution</h2>
    <Pie
        data={{
            labels: chartData.typeDistribution.labels,
            datasets: [
                {
                    data: chartData.typeDistribution.data,
                    backgroundColor: ['#FF6384', '#36A2EB'],
                },
            ],
        }}
    />
</div>
<div className="chart" style={{ display: 'inline-block', width: '100%' }}>
    <h2>MSRP vs Electric Range</h2>
    <Line
        data={{
            labels: chartData.priceVsRange.labels,
            datasets: [
                {
                    label: 'MSRP',
                    data: chartData.priceVsRange.data,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    fill: false,
                },
            ],
        }}
    />
</div>

                        </>
                    )}
                </div>
            </main>
            <footer>
  <p>Created by Saket Nigam | Contact: <a href="mailto:sjningam10@gmail.com">sjningam10@gmail.com</a></p>
</footer>
        </div>
    );
}



export default App;
