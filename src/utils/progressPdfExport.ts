
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
  notes?: Array<{
    id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    favorite?: boolean;
  }>;
  tasks?: Array<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: string;
    due_date?: string;
  }>;
  events?: Array<{
    id: string;
    title: string;
    description: string;
    event_date: string;
    event_time: string;
    attendees: number;
  }>;
}

export const exportProgressToPDF = async (data: ProgressData) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>SkillSync Complete Data Export</title>
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
        .data-item {
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 15px;
          background: #FAFAFA;
        }
        .data-item h4 {
          margin: 0 0 10px 0;
          color: #1F2937;
          font-size: 1.1em;
        }
        .data-item p {
          margin: 0 0 8px 0;
          color: #6B7280;
          font-size: 0.9em;
        }
        .priority-high { border-left: 4px solid #EF4444; }
        .priority-medium { border-left: 4px solid #F59E0B; }
        .priority-low { border-left: 4px solid #10B981; }
        .completed { opacity: 0.7; text-decoration: line-through; }
        .favorite { border-left: 4px solid #F59E0B; }
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
        <h1>SkillSync Complete Data Export</h1>
        <p><strong>Generated for:</strong> ${data.userInfo.name} (${data.userInfo.email})</p>
        <p><strong>Export Date:</strong> ${new Date(data.exportDate).toLocaleDateString('en-US', { 
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

      ${data.notes && data.notes.length > 0 ? `
      <div class="section">
        <h2>📝 All Notes (${data.notes.length})</h2>
        ${data.notes.map(note => `
          <div class="data-item ${note.favorite ? 'favorite' : ''}">
            <h4>${note.title} ${note.favorite ? '⭐' : ''}</h4>
            <p>${note.content.substring(0, 200)}${note.content.length > 200 ? '...' : ''}</p>
            <p><strong>Created:</strong> ${new Date(note.created_at).toLocaleDateString()}</p>
            <p><strong>Last Modified:</strong> ${new Date(note.updated_at).toLocaleDateString()}</p>
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${data.tasks && data.tasks.length > 0 ? `
      <div class="section">
        <h2>✅ All Tasks (${data.tasks.length})</h2>
        ${data.tasks.map(task => `
          <div class="data-item priority-${task.priority} ${task.completed ? 'completed' : ''}">
            <h4>${task.title}</h4>
            <p>${task.description}</p>
            <p><strong>Priority:</strong> ${task.priority.toUpperCase()}</p>
            <p><strong>Status:</strong> ${task.completed ? 'Completed' : 'Pending'}</p>
            ${task.due_date ? `<p><strong>Due Date:</strong> ${new Date(task.due_date).toLocaleDateString()}</p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${data.events && data.events.length > 0 ? `
      <div class="section">
        <h2>📅 All Events (${data.events.length})</h2>
        ${data.events.map(event => `
          <div class="data-item">
            <h4>${event.title}</h4>
            <p>${event.description}</p>
            <p><strong>Date:</strong> ${new Date(event.event_date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${event.event_time}</p>
            <p><strong>Attendees:</strong> ${event.attendees}</p>
          </div>
        `).join('')}
      </div>
      ` : ''}
      
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
        <h2>🎯 Summary & Insights</h2>
        <div class="summary">
          <h3>Overall Statistics</h3>
          <p><strong>Total Notes:</strong> ${data.notes?.length || 0}</p>
          <p><strong>Total Tasks:</strong> ${data.tasks?.length || 0}</p>
          <p><strong>Completed Tasks:</strong> ${data.tasks?.filter(t => t.completed).length || 0}</p>
          <p><strong>Total Events:</strong> ${data.events?.length || 0}</p>
          <p><strong>Favorite Notes:</strong> ${data.notes?.filter(n => n.favorite).length || 0}</p>
          
          <h3>Achievements Unlocked</h3>
          ${data.stats.find(s => s.percentage >= 90) ? '<span class="achievement-badge">🏆 High Performer</span>' : ''}
          ${data.tasks && data.tasks.filter(t => t.completed).length > 5 ? '<span class="achievement-badge">✅ Task Master</span>' : ''}
          ${data.notes && data.notes.length > 3 ? '<span class="achievement-badge">📚 Knowledge Builder</span>' : ''}
          ${data.events && data.events.length > 2 ? '<span class="achievement-badge">📅 Event Planner</span>' : ''}
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
  link.download = `skillsync-complete-export-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
};
