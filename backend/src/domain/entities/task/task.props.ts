import { EntityProps } from "../entity/entity.props";

export type TaskProps = EntityProps & {
  description: string;
  done: boolean;
  doneAt?: Date;
  contextId?: string;
  projectId?: string;
};
