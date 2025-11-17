import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";

import registerRoute from "./routes/auth/register/route";
import loginRoute from "./routes/auth/login/route";
import meRoute from "./routes/auth/me/route";
import logoutRoute from "./routes/auth/logout/route";

import robotListRoute from "./routes/robot/list/route";
import robotStatusRoute from "./routes/robot/status/route";
import robotCommandRoute from "./routes/robot/command/route";
import robotTelemetryRoute from "./routes/robot/telemetry/route";

import alertsListRoute from "./routes/alerts/list/route";
import alertsAcknowledgeRoute from "./routes/alerts/acknowledge/route";

import sessionsListRoute from "./routes/sessions/list/route";
import sessionsDetailsRoute from "./routes/sessions/details/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  
  auth: createTRPCRouter({
    register: registerRoute,
    login: loginRoute,
    me: meRoute,
    logout: logoutRoute,
  }),
  
  robot: createTRPCRouter({
    list: robotListRoute,
    status: robotStatusRoute,
    command: robotCommandRoute,
    telemetry: robotTelemetryRoute,
  }),
  
  alerts: createTRPCRouter({
    list: alertsListRoute,
    acknowledge: alertsAcknowledgeRoute,
  }),
  
  sessions: createTRPCRouter({
    list: sessionsListRoute,
    details: sessionsDetailsRoute,
  }),
});

export type AppRouter = typeof appRouter;
