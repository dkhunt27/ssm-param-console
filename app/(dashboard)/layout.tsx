import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { PageHeader } from '../components/pageHeader/page-header';
import './dashboard.css';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(en);

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <DashboardLayout defaultSidebarCollapsed={true}>
      <PageContainer slots={{ header: PageHeader }}>{props.children}</PageContainer>
    </DashboardLayout>
  );
}
