import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import './Dashboard.css';

const Dashboard = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Fetch data
    fetch('/eve.json')
      .then(response => response.json())
      .then(data => setAlerts(data))
      .catch(error => console.error('Error loading JSON data:', error));
  }, []);

  const processData = () => {
    // Extract and process data
    const timeSeries = {};
    const categories = {};
    const sourceIPs = {};
    const destPorts = {};

    alerts.forEach(alert => {
      if (!alert || !alert.alert || !alert.alert.category) return;
      const timestamp = new Date(alert.timestamp).toLocaleString();
      const category = alert.alert.category;
      const srcIP = alert.src_ip;
      const destPort = alert.dest_port;

      // Time series data
      timeSeries[timestamp] = (timeSeries[timestamp] || 0) + 1;

      // Categories distribution
      categories[category] = (categories[category] || 0) + 1;

      // Top source IPs
      sourceIPs[srcIP] = (sourceIPs[srcIP] || 0) + 1;

      // Top destination ports
      destPorts[destPort] = (destPorts[destPort] || 0) + 1;
    });

    return { timeSeries, categories, sourceIPs, destPorts };
  };

  const { timeSeries, categories, sourceIPs, destPorts } = processData();

  return (
    <div className="dashboard">
      <Plot
        data={[
          {
            x: Object.keys(timeSeries),
            y: Object.values(timeSeries),
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'red' },
          },
        ]}
        layout={{ title: 'Number of Alerts Over Time', plot_bgcolor: '#2b2b2b', paper_bgcolor: '#2b2b2b', font: { color: 'white' } }}
      />
      <Plot
        data={[
          {
            values: Object.values(categories),
            labels: Object.keys(categories),
            type: 'pie',
          },
        ]}
        layout={{ title: 'Alert Categories Distribution', plot_bgcolor: '#2b2b2b', paper_bgcolor: '#2b2b2b', font: { color: 'white' } }}
      />
      <Plot
        data={[
          {
            x: Object.keys(sourceIPs),
            y: Object.values(sourceIPs),
            type: 'bar',
            marker: { color: 'orange' },
          },
        ]}
        layout={{ title: 'Top Source IPs', plot_bgcolor: '#2b2b2b', paper_bgcolor: '#2b2b2b', font: { color: 'white' } }}
      />
      <Plot
        data={[
          {
            x: Object.keys(destPorts),
            y: Object.values(destPorts),
            type: 'bar',
            marker: { color: 'lightblue' },
          },
        ]}
        layout={{ title: 'Top Destination Ports', plot_bgcolor: '#2b2b2b', paper_bgcolor: '#2b2b2b', font: { color: 'white' } }}
      />
    </div>
  );
};

export default Dashboard;
