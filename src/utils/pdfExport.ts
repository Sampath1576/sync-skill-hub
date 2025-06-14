
interface ExportData {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
  };
  settings?: {
    email: boolean;
    push: boolean;
    tasks: boolean;
    reminders: boolean;
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
  exportDate: string;
}

export const exportToPDF = async (data: ExportData) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>SkillSync Data Export</title>
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
        .favorite { 
          border-left: 4px solid #F59E0B; 
          background: #FEF3C7;
        }
        .priority-high { border-left: 4px solid #EF4444; }
        .priority-medium { border-left: 4px solid #F59E0B; }
        .priority-low { border-left: 4px solid #10B981; }
        .completed { opacity: 0.7; text-decoration: line-through; }
        .profile-section {
          background: #EFF6FF;
          border: 1px solid #BFDBFE;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
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
        <h1>SkillSync Data Export</h1>
        <p><strong>Export Date:</strong> ${new Date(data.exportDate).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
      </div>
      
      <div class="section">
        <h2>👤 Profile Information</h2>
        <div class="profile-section">
          <p><strong>Name:</strong> ${data.profile.firstName} ${data.profile.lastName}</p>
          <p><strong>Email:</strong> ${data.profile.email}</p>
          <p><strong>Username:</strong> ${data.profile.username}</p>
        </div>
      </div>

      ${data.notes && data.notes.length > 0 ? `
      <div class="section">
        <h2>📝 Notes (${data.notes.length})</h2>
        <p><strong>Favorite Notes:</strong> ${data.notes.filter(n => n.favorite).length}</p>
        ${data.notes.map(note => `
          <div class="data-item ${note.favorite ? 'favorite' : ''}">
            <h4>${note.title} ${note.favorite ? '⭐' : ''}</h4>
            <p>${note.content}</p>
            <p><strong>Created:</strong> ${new Date(note.created_at).toLocaleDateString()}</p>
            <p><strong>Last Modified:</strong> ${new Date(note.updated_at).toLocaleDateString()}</p>
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${data.tasks && data.tasks.length > 0 ? `
      <div class="section">
        <h2>✅ Tasks (${data.tasks.length})</h2>
        <p><strong>Completed:</strong> ${data.tasks.filter(t => t.completed).length} | <strong>Pending:</strong> ${data.tasks.filter(t => !t.completed).length}</p>
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
        <h2>📅 Events (${data.events.length})</h2>
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

      ${data.settings ? `
      <div class="section">
        <h2>⚙️ Settings</h2>
        <div class="profile-section">
          <p><strong>Email Notifications:</strong> ${data.settings.email ? 'Enabled' : 'Disabled'}</p>
          <p><strong>Push Notifications:</strong> ${data.settings.push ? 'Enabled' : 'Disabled'}</p>
          <p><strong>Task Reminders:</strong> ${data.settings.tasks ? 'Enabled' : 'Disabled'}</p>
          <p><strong>Event Reminders:</strong> ${data.settings.reminders ? 'Enabled' : 'Disabled'}</p>
        </div>
      </div>
      ` : ''}

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
  link.download = `skillsync-${data.notes ? 'notes' : data.tasks ? 'tasks' : data.events ? 'events' : 'data'}-export-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
};
