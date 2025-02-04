import { configureStore, combineReducers } from "@reduxjs/toolkit";
import studentSlice from "./feature/studentsSlice";
import attendanceSlice from "./feature/attendanceSlice";
import schoolSlice from "./feature/schoolSlice";
import classroomSlice from "./feature/classroomSlice";
import notificationSlice from "./feature/notificationSlice";
import userSlice from "./feature/userSlice";
import pageSlice from "./feature/pageSlice";
import teacherSlice from "./feature/teacherSlice";
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  studentSlice: studentSlice,
  classroomSlice: classroomSlice,
  notificationSlice: notificationSlice,
  attendanceSlice: attendanceSlice,
  schoolSlice: schoolSlice,
  userSlice: userSlice,
  pageSlice: pageSlice,
  teacherSlice: teacherSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const persister = persistStore(makeStore());
