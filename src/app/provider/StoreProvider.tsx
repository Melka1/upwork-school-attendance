"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore, persister } from "../lib/store";
import { PersistGate } from "redux-persist/integration/react";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={false} persistor={persister}>
        {children}
      </PersistGate>
    </Provider>
  );
}
