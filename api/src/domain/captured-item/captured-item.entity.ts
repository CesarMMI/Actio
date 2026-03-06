import { BusinessRuleViolationError } from '../errors/business-rule-violation.error';
import { Title } from '../value-objects/title.value-object';
import { CapturedItemStatus } from './captured-item-status';

export class CapturedItem {
  private status: CapturedItemStatus = 'INBOX';

  private constructor(
    readonly id: string,
    readonly title: Title,
    readonly notes?: string,
  ) { }

  static create(params: { id: string; title: Title; notes?: string }): CapturedItem {
    return new CapturedItem(params.id, params.title, params.notes);
  }

  getStatus(): CapturedItemStatus {
    return this.status;
  }

  clarifyAsAction(): void {
    this.ensureInbox();
    this.status = 'CLARIFIED_AS_ACTION';
  }

  clarifyAsProject(): void {
    this.ensureInbox();
    this.status = 'CLARIFIED_AS_PROJECT';
  }

  clarifyAsReference(): void {
    this.ensureInbox();
    this.status = 'REFERENCE';
  }

  clarifyAsSomeday(): void {
    this.ensureInbox();
    this.status = 'SOMEDAY';
  }

  moveToTrash(): void {
    this.ensureInbox();
    this.status = 'TRASH';
  }

  private ensureInbox(): void {
    if (this.status !== 'INBOX') {
      throw new BusinessRuleViolationError('Captured item has already been clarified.', {
        status: this.status,
      });
    }
  }
}

