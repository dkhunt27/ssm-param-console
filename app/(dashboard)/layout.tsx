import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { PageHeader } from '../components/pageHeader/page-header';
import './dashboard.css';

export default function Layout(props: { children: React.ReactNode }) {
  // const status = 'Active';

  return (
    <DashboardLayout defaultSidebarCollapsed={true}>
      <PageContainer slots={{ header: PageHeader }}>{props.children}</PageContainer>
    </DashboardLayout>
  );
}
