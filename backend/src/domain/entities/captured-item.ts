import { CapturedItemStatus } from '../enums';
import { ItemAlreadyResolvedError } from '../errors';

export interface CapturedItemProps {
  id: string;
  title: string;
  notes?: string;
  status: CapturedItemStatus;
  createdAt: Date;
}

export class CapturedItem {
  readonly id: string;
  title: string;
  notes?: string;
  status: CapturedItemStatus;
  readonly createdAt: Date;

  constructor(props: CapturedItemProps) {
    this.id = props.id;
    this.title = props.title;
    this.notes = props.notes;
    this.status = props.status;
    this.createdAt = props.createdAt;
  }

  private assertInbox(): void {
    if (this.status !== CapturedItemStatus.INBOX) {
      throw new ItemAlreadyResolvedError(this.id);
    }
  }

  clarifyAsAction(): void {
    this.assertInbox();
    this.status = CapturedItemStatus.CLARIFIED_AS_ACTION;
  }

  clarifyAsProject(): void {
    this.assertInbox();
    this.status = CapturedItemStatus.CLARIFIED_AS_PROJECT;
  }

  clarifyAsReference(): void {
    this.assertInbox();
    this.status = CapturedItemStatus.REFERENCE;
  }

  clarifyAsSomeday(): void {
    this.assertInbox();
    this.status = CapturedItemStatus.SOMEDAY;
  }

  moveToTrash(): void {
    this.assertInbox();
    this.status = CapturedItemStatus.TRASH;
  }
}
