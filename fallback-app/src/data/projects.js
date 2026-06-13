export const projects = [
  {
    title: 'Flight Ticket Predictor',
    role: 'Machine Learning & Backend',
    summary: 'Trained a Random Forest model on historical flight data to predict price movements with 85% accuracy, exported to ONNX for optimized runtime performance.',
    impact: [
      'Built a .NET 8 REST API backend serving predictions with ≥100ms inference latency.',
      'Integrated automated weekly data pipeline to refresh and retrain the model.',
      'Containerized in Docker for reliable deployment.'
    ],
    tags: ['Python', 'C#', 'ONNX', 'Docker', 'REST API'],
    github: 'https://github.com/shuxianho07/Flight-Ticket-Predictor',
    demo: ''
  },
  {
    title: 'Futures Market Analysis Model',
    role: 'Data Engineering & Analysis',
    summary: 'Processed 50K+ high-frequency futures records per day using Python and PostgreSQL for accurate short-term price movement analysis.',
    impact: [
      'Detected ~200 daily volume spikes using rolling statistics and Z-score-based anomaly detection.',
      'Visualized historical and real-time liquidity shifts with Seaborn dashboards.',
      'Reduced manual monitoring time by 75%.'
    ],
    tags: ['Python', 'SQL', 'Pandas', 'Plotly', 'Seaborn'],
    github: 'https://github.com/shuxianho07/Futures-Market-Analysis-Model',
    demo: ''
  },
  {
    title: 'Automated Financial Reporting System',
    role: 'Automation & BI',
    summary: 'Automated end-to-end financial reporting for 10K+ daily transactions across multiple business units.',
    impact: [
      'Reduced report generation time from 6 hours to under 30 minutes.',
      'Implemented data validation and anomaly detection routines ensuring ≥99% accuracy.',
      'Developed dynamic Power BI dashboards and automated reports deployed in Docker containers.'
    ],
    tags: ['VBA', 'SQL', 'Excel', 'Power BI', 'Docker'],
    github: 'https://github.com/shuxianho07/Automated-Financial-Reporting',
    demo: ''
  }
];
