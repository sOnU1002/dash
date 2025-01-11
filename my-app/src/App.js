import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Bar, Pie, Line } from 'react-chartjs-2';
import './App.css';

function App() {
    const [data, setData] = useState([]);
    const [metrics, setMetrics] = useState({});
    const [chartsData, setChartsData] = useState(null);

    useEffect(() => {
        // Load and parse CSV data
        const fetchData = async () => {
            const response = await fetch('/Electric_Vehicle_Population_Data.csv');
            const text = await response.text();
            Papa.parse(text, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const parsedData = results.data;
                    setData(parsedData);
                    calculateMetrics(parsedData);
                    generateChartsData(parsedData);
                },
            });
        };

        fetchData();
    }, []);

    // Calculate metrics
    const calculateMetrics = (data) => {
        const totalEVs = data.length;
        const avgRange = (
            data.reduce((sum, ev) => sum + parseFloat(ev['Electric Range'] || 0), 0) / totalEVs
        ).toFixed(2);
        const avgMSRP = (
            data.reduce((sum, ev) => sum + parseFloat(ev['MSRP'] || 0), 0) / totalEVs
        ).toFixed(2);

        setMetrics({
            totalEVs,
            avgRange,
            avgMSRP,
        });
    };

    // Generate chart data
    const generateChartsData = (data) => {
        const yearlyRegistrations = {};
        const typeDistribution = {};

        data.forEach((ev) => {
            const year = ev['Model Year'];
            const type = ev['Electric Vehicle Type'];

            yearlyRegistrations[year] = (yearlyRegistrations[year] || 0) + 1;
            typeDistribution[type] = (typeDistribution[type] || 0) + 1;
        });

        setChartsData({
            yearlyData: {
                labels: Object.keys(yearlyRegistrations),
                data: Object.values(yearlyRegistrations),
            },
            typeDistribution: {
                labels: Object.keys(typeDistribution),
                data: Object.values(typeDistribution),
            },
        });
    };

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
                    {chartsData && (
                        <>
                            <div className="chart">
                                <h2>Yearly Trend of EV Registrations</h2>
                                <Bar
                                    data={{
                                        labels: chartsData.yearlyData.labels,
                                        datasets: [
                                            {
                                                label: 'Registrations',
                                                data: chartsData.yearlyData.data,
                                                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                            },
                                        ],
                                    }}
                                />
                            </div>
                            <div className="chart">
                                <h2>EV Type Distribution</h2>
                                <Pie
                                    data={{
                                        labels: chartsData.typeDistribution.labels,
                                        datasets: [
                                            {
                                                data: chartsData.typeDistribution.data,
                                                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
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
                <p>Created by Saket Nigam | Contact: <a href="mailto:sjnigam10@gmail.com">sjnigam10@gmail.com</a></p>
            </footer>
        </div>
    );
}

export default App;
