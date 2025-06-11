
interface ExportData {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
  };
  settings: any;
  exportDate: string;
}

export const exportToPDF = async (data: ExportData) => {
  // Create HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>SkillSync Profile Export</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .section h2 { color: #3B82F6; border-bottom: 2px solid #3B82F6; padding-bottom: 5px; }
        .data-row { margin: 10px 0; }
        .label { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>SkillSync Profile Export</h1>
        <p>Generated on: ${new Date(data.exportDate).toLocaleDateString()}</p>
      </div>
      
      <div class="section">
        <h2>Profile Information</h2>
        <div class="data-row"><span class="label">Username:</span> ${data.profile.username}</div>
        <div class="data-row"><span class="label">Name:</span> ${data.profile.firstName} ${data.profile.lastName}</div>
        <div class="data-row"><span class="label">Email:</span> ${data.profile.email}</div>
      </div>
      
      <div class="section">
        <h2>Settings</h2>
        <div class="data-row"><span class="label">Email Notifications:</span> ${data.settings.email ? 'Enabled' : 'Disabled'}</div>
        <div class="data-row"><span class="label">Push Notifications:</span> ${data.settings.push ? 'Enabled' : 'Disabled'}</div>
        <div class="data-row"><span class="label">Task Reminders:</span> ${data.settings.tasks ? 'Enabled' : 'Disabled'}</div>
        <div class="data-row"><span class="label">Calendar Reminders:</span> ${data.settings.reminders ? 'Enabled' : 'Disabled'}</div>
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
  link.download = `skillsync-profile-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
};
