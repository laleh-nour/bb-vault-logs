import fs from 'fs';
import fetch from 'node-fetch';
import QuickChart from 'quickchart-js';

// بارگذاری JSON
const vaultData = JSON.parse(fs.readFileSync('./data/vaultLogs_raw.json', 'utf-8'));
const blocks = vaultData.blocks;

// آماده‌سازی داده‌ها
const labels = blocks.map(b => b.summary.blockNumber);
const totalLogsData = blocks.map(b => b.summary.totalLogs);
const swapLogsData = blocks.map(b => b.summary.swapLogs);

// ایجاد نمودار
const qc = new QuickChart();
qc.setConfig({
  type: 'line',
  data: {
    labels: labels,
    datasets: [
      { label: 'Total Vault Logs', data: totalLogsData, fill: false, borderColor: 'blue', tension: 0.2 },
      { label: 'Swap Logs', data: swapLogsData, fill: false, borderColor: 'red', tension: 0.2 },
    ],
  },
  options: {
    scales: {
      x: { title: { display: true, text: 'Block Number' } },
      y: { title: { display: true, text: 'Log Count' }, beginAtZero: true },
    },
    plugins: { title: { display: true, text: 'Vault Logs Trend (Last 100 Blocks)' } },
  },
});

// گرفتن URL نمودار
const chartUrl = qc.getUrl();
console.log('Chart URL:', chartUrl);

// ذخیره نمودار به صورت PNG
const saveChart = async () => {
  const res = await fetch(chartUrl);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync('vaultLogsChart.png', Buffer.from(buffer));
  console.log('✅ نمودار ذخیره شد با نام vaultLogsChart.png');
};

saveChart();
