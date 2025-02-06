/* eslint-disable react-hooks/exhaustive-deps */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { fetchUsers, resetUserState } from "../lib/feature/userSlice";
import { UserType } from "@prisma/client";
import { setCurrentPage } from "../lib/feature/pageSlice";
import { resetAttendanceState } from "../lib/feature/attendanceSlice";
import { reInitializeState } from "../lib/feature/studentsSlice";
import { resetNotificationList } from "../lib/feature/notificationSlice";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  setLoading: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user: userFromDB, queryStatus } = useAppSelector(
    (state) => state.userSlice
  );
  const currentPage = useAppSelector((state) => state.pageSlice.currentPage);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthPage = window?.location.href.includes("authentication");
  const isDashboard = window?.location.href.includes("dashboard");

  console.log(currentPage);

  useEffect(() => {
    dispatch(resetAttendanceState());
    dispatch(reInitializeState());
    dispatch(resetUserState());
    dispatch(resetNotificationList())
    if (isDashboard) {
      dispatch(setCurrentPage(window?.location.pathname));
    }
    if (user) return;
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const isAuthPage = window?.location.href.includes("authentication");
    if (loading) return;
    if (user) {
      dispatch(resetUserState());
      dispatch(fetchUsers({ email: user.email }));
    } else {
      if (isAuthPage) return;
      router.push("/authentication/sign-in");
    }
  }, [user, loading]);

  useEffect(() => {
    if (queryStatus == "error") {
      router.push("/authentication/sign-in");
    }
    if (queryStatus != "success") return;
    if (userFromDB.userType != UserType.TEACHER) {
      router.push("/");
    } else {
      router.push(currentPage || "/dashboard");
    }
  }, [queryStatus]);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
