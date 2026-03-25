import { EntityProps } from "../entity/entity.props";

export type RefreshTokenProps = EntityProps & {
  userId: string;
  hash: string;
  expiresAt: Date;
  deviceId: string;
};
