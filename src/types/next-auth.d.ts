import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Extended user interface to include business-related information
   */
  interface User extends DefaultUser {
    id: string;
    role: string | undefined;
  }

  /**
   * Extended session interface to include business-related information
   */
  interface Session extends DefaultSession {
    user: User;
  }

  /**
   * Extended token interface to include business-related information
   */
  interface JWT {
    sub: string;
    role: string | undefined;
  }
}
