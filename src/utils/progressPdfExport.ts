
interface ProgressData {
  stats: Array<{
    title: string;
    value: string;
    total: string;
    percentage: number;
  }>;
  weeklyData: Array<{
    day: string;
    tasks: number;
    hours: number;
  }>;
  exportDate: string;
  userInfo: {
    name: string;
    email: string;
  };
}

export const exportProgressToPDF = async (data: ProgressData) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>SkillSync Progress Report</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px; 
          line-height: 1.6;
          color: #333;
        }
        .header { 
          text-align: center; 
          margin-bottom: 40px; 
          border-bottom: 3px solid #3B82F6;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #3B82F6;
          margin-bottom: 10px;
        }
        .section { 
          margin-bottom: 30px; 
          page-break-inside: avoid;
        }
        .section h2 { 
          color: #3B82F6; 
          border-bottom: 2px solid #3B82F6; 
          padding-bottom: 5px; 
          margin-bottom: 20px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 20px;
          background: #F9FAFB;
        }
        .stat-title {
          font-weight: bold;
          color: #374151;
          margin-bottom: 10px;
        }
        .stat-value {
          font-size: 2em;
          font-weight: bold;
          color: #3B82F6;
          margin-bottom: 5px;
        }
        .stat-progress {
          background: #E5E7EB;
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 10px;
        }
        .stat-progress-bar {
          height: 100%;
          background: #3B82F6;
          transition: width 0.3s ease;
        }
        .weekly-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .weekly-table th,
        .weekly-table td {
          border: 1px solid #E5E7EB;
          padding: 12px;
          text-align: left;
        }
        .weekly-table th {
          background: #F3F4F6;
          font-weight: bold;
          color: #374151;
        }
        .weekly-table tr:nth-child(even) {
          background: #F9FAFB;
        }
        .summary {
          background: #EFF6FF;
          border: 1px solid #BFDBFE;
          border-radius: 8px;
          padding: 20px;
          margin-top: 30px;
        }
        .summary h3 {
          color: #1D4ED8;
          margin-bottom: 15px;
        }
        .achievement-badge {
          display: inline-block;
          background: #10B981;
          color: white;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 0.9em;
          margin: 5px;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          color: #6B7280;
          border-top: 1px solid #E5E7EB;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>SkillSync Progress Report</h1>
        <p><strong>Generated for:</strong> ${data.userInfo.name} (${data.userInfo.email})</p>
        <p><strong>Report Date:</strong> ${new Date(data.exportDate).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
      </div>
      
      <div class="section">
        <h2>📊 Performance Overview</h2>
        <div class="stats-grid">
          ${data.stats.map(stat => `
            <div class="stat-card">
              <div class="stat-title">${stat.title}</div>
              <div class="stat-value">${stat.value}</div>
              <div style="color: #6B7280; font-size: 0.9em;">out of ${stat.total}</div>
              <div class="stat-progress">
                <div class="stat-progress-bar" style="width: ${stat.percentage}%"></div>
              </div>
              <div style="margin-top: 5px; font-size: 0.9em; color: #059669;">
                ${stat.percentage}% Complete
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="section">
        <h2>📅 Weekly Activity Breakdown</h2>
        <table class="weekly-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Tasks Completed</th>
              <th>Study Hours</th>
              <th>Productivity Score</th>
            </tr>
          </thead>
          <tbody>
            ${data.weeklyData.map(day => {
              const productivityScore = Math.round((day.tasks * 5 + day.hours * 8) / 2);
              return `
                <tr>
                  <td><strong>${day.day}</strong></td>
                  <td>${day.tasks} tasks</td>
                  <td>${day.hours} hours</td>
                  <td>${productivityScore}%</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>🎯 Key Insights</h2>
        <div class="summary">
          <h3>Productivity Summary</h3>
          <p><strong>Total Tasks Completed:</strong> ${data.stats.find(s => s.title === 'Tasks Completed')?.value || 'N/A'}</p>
          <p><strong>Total Study Hours:</strong> ${data.stats.find(s => s.title === 'Study Hours')?.value || 'N/A'}</p>
          <p><strong>Goals Achievement Rate:</strong> ${data.stats.find(s => s.title === 'Goals Achieved')?.percentage || 0}%</p>
          <p><strong>Overall Productivity Score:</strong> ${data.stats.find(s => s.title === 'Productivity Score')?.value || 'N/A'}%</p>
          
          <h3>Achievements Unlocked</h3>
          ${data.stats.find(s => s.percentage >= 90) ? '<span class="achievement-badge">🏆 High Performer</span>' : ''}
          ${data.stats.find(s => s.title === 'Tasks Completed' && parseInt(s.value) > 150) ? '<span class="achievement-badge">✅ Task Master</span>' : ''}
          ${data.stats.find(s => s.title === 'Study Hours' && parseInt(s.value) > 40) ? '<span class="achievement-badge">📚 Study Champion</span>' : ''}
          ${data.stats.find(s => s.title === 'Goals Achieved' && s.percentage >= 80) ? '<span class="achievement-badge">🎯 Goal Crusher</span>' : ''}
          
          <h3>Recommendations</h3>
          <ul>
            <li>Continue maintaining your excellent task completion rate</li>
            <li>Consider setting slightly more challenging goals to push your limits</li>
            <li>Your study hours show great consistency - keep it up!</li>
            <li>Focus on maintaining this momentum in the coming weeks</li>
          </ul>
        </div>
      </div>

      <div class="footer">
        <p>Generated by SkillSync - Your AI-Powered Productivity Companion</p>
        <p>© 2024 SkillSync. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  // Create a blob with the HTML content
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link to download
  const link = document.createElement('a');
  link.href = url;
  link.download = `skillsync-progress-report-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
};
