import { Module } from "@nestjs/common";
import { RbacGuard } from "./rbac.guard";

@Module({
  providers: [
    RbacGuard,
  ],
})
export class RbacModule {}