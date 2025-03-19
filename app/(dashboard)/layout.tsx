'use client';

import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { PageHeader } from '../components/pageHeader/page-header';
import './dashboard.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'jotai';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(en);

export default function Layout(props: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <DashboardLayout defaultSidebarCollapsed={true}>
          <PageContainer slots={{ header: PageHeader }}>{props.children}</PageContainer>
        </DashboardLayout>
      </QueryClientProvider>
    </Provider>
  );
}
