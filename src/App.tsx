import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import PWABadge from "./PWABadge.tsx";
import "./App.css";
import { AppShell, Container, MantineProvider } from "@mantine/core";
import { notifications, Notifications } from "@mantine/notifications";
import {
  MutationCache,
  onlineManager,
  QueryClient,
} from "@tanstack/react-query";
import { lazy, useEffect } from "react";
import Posts from "./components/posts.tsx";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { TypedContext } from "./utils/mutations.ts";
import {
  deletePostMutationKey,
  deletePostMutationDefaults,
} from "./mutations/use-delete-post.ts";
import NetworkManager from "./components/network-manager.tsx";

const ReactQueryDevtoolsProduction = lazy(() =>
  import("@tanstack/react-query-devtools/build/modern/production.js").then(
    (d) => ({
      default: d.ReactQueryDevtools,
    })
  )
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
  mutationCache: new MutationCache({
    onSuccess: (_d, _v, context) => {
      queryClient.invalidateQueries();

      const tContext = context as TypedContext;
      if (tContext?.metadata) {
        notifications.show({
          title: tContext.metadata.title,
          message: "Your changes have been saved",
          color: "green",
          withCloseButton: true,
        });
      }
    },
    onError: (_e, _v, context) => {
      const tContext = context as TypedContext;
      if (tContext?.metadata) {
        notifications.show({
          title: tContext.metadata.title,
          message: "We could not save your changes",
          color: "red",
          withCloseButton: true,
        });
      }
    },
  }),
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

// we need a default mutation function so that paused mutations can resume after a page reload
queryClient.setMutationDefaults(
  deletePostMutationKey,
  deletePostMutationDefaults
);

function App() {
  useEffect(() => {
    // Set online on app load to be sure that we are offline by default when the app is loaded in offline mode
    // Getting a falsely offline state here is not a problem since we are going for an offline first approach.
    onlineManager.setOnline(navigator.onLine);
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
      }}
      onSuccess={() => {
        queryClient.resumePausedMutations().then(() => {
          queryClient.invalidateQueries();
        });
      }}
    >
      <MantineProvider>
        <Notifications />
        <AppShell
          header={{
            height: 50,
          }}
        >
          <AppShell.Header>
            <NetworkManager />
          </AppShell.Header>
          <AppShell.Main>
            <Container size="sm">
              <Posts />
            </Container>
            <PWABadge />
          </AppShell.Main>
        </AppShell>
      </MantineProvider>
      <ReactQueryDevtoolsProduction />
    </PersistQueryClientProvider>
  );
}

export default App;
