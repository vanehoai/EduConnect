import fs from 'fs';
import path from 'path';

const appDir = 'h:/EduConnect/apps/web/app/(dashboard)/dashboard';

const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const templates = {
  announcements: `import React from 'react';
import { getAnnouncements } from '../../../../lib/services/announcement.service';

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Announcements</h1>
      <p>Manage announcements here.</p>
    </div>
  );
}`,
  serviceRequests: `import React from 'react';
import { getServiceRequests } from '../../../../lib/services/service-request.service';

export default async function ServiceRequestsPage() {
  const requests = await getServiceRequests();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Service Requests</h1>
      <p>Manage service requests here.</p>
    </div>
  );
}`,
  serviceRequestCategories: `import React from 'react';
import { getServiceRequestCategories } from '../../../../lib/services/service-request.service';

export default async function ServiceRequestCategoriesPage() {
  const categories = await getServiceRequestCategories();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Service Request Categories</h1>
      <p>Manage categories here.</p>
    </div>
  );
}`,
  notifications: `import React from 'react';
import { getNotifications } from '../../../../lib/services/notification.service';

export default async function NotificationsPage() {
  const notifications = await getNotifications();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <p>View your notifications here.</p>
    </div>
  );
}`,
  settingsNotifications: `import React from 'react';
import { getNotificationPreferences } from '../../../../../lib/services/notification-preference.service';

export default async function NotificationSettingsPage() {
  const preferences = await getNotificationPreferences();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notification Settings</h1>
      <p>Manage your notification preferences here.</p>
    </div>
  );
}`,
};

// Create dirs and files
const routes = [
  { path: 'announcements', content: templates.announcements },
  { path: 'service-requests', content: templates.serviceRequests },
  { path: 'service-request-categories', content: templates.serviceRequestCategories },
  { path: 'notifications', content: templates.notifications },
  { path: 'settings/notifications', content: templates.settingsNotifications },
];

routes.forEach((route) => {
  const dirPath = path.join(appDir, route.path);
  ensureDir(dirPath);
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), route.content);
});

console.log('Pages generated successfully');
