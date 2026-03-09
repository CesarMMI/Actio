import { CapturedItemStatus } from '../../src/domain/enums';
import { ItemAlreadyResolvedError } from '../../src/domain/errors';
import { makeCapturedItem } from '../helpers';

describe('CapturedItem', () => {
  describe('clarifyAsAction', () => {
    it('sets status to CLARIFIED_AS_ACTION when INBOX', () => {
      const item = makeCapturedItem();
      item.clarifyAsAction();
      expect(item.status).toBe(CapturedItemStatus.CLARIFIED_AS_ACTION);
    });

    it('throws ItemAlreadyResolvedError when not INBOX', () => {
      const item = makeCapturedItem({ status: CapturedItemStatus.CLARIFIED_AS_ACTION });
      expect(() => item.clarifyAsAction()).toThrow(ItemAlreadyResolvedError);
    });
  });

  describe('clarifyAsProject', () => {
    it('sets status to CLARIFIED_AS_PROJECT when INBOX', () => {
      const item = makeCapturedItem();
      item.clarifyAsProject();
      expect(item.status).toBe(CapturedItemStatus.CLARIFIED_AS_PROJECT);
    });

    it('throws ItemAlreadyResolvedError when not INBOX', () => {
      const item = makeCapturedItem({ status: CapturedItemStatus.SOMEDAY });
      expect(() => item.clarifyAsProject()).toThrow(ItemAlreadyResolvedError);
    });
  });

  describe('clarifyAsReference', () => {
    it('sets status to REFERENCE when INBOX', () => {
      const item = makeCapturedItem();
      item.clarifyAsReference();
      expect(item.status).toBe(CapturedItemStatus.REFERENCE);
    });

    it('throws ItemAlreadyResolvedError when not INBOX', () => {
      const item = makeCapturedItem({ status: CapturedItemStatus.TRASH });
      expect(() => item.clarifyAsReference()).toThrow(ItemAlreadyResolvedError);
    });
  });

  describe('clarifyAsSomeday', () => {
    it('sets status to SOMEDAY when INBOX', () => {
      const item = makeCapturedItem();
      item.clarifyAsSomeday();
      expect(item.status).toBe(CapturedItemStatus.SOMEDAY);
    });

    it('throws ItemAlreadyResolvedError when not INBOX', () => {
      const item = makeCapturedItem({ status: CapturedItemStatus.REFERENCE });
      expect(() => item.clarifyAsSomeday()).toThrow(ItemAlreadyResolvedError);
    });
  });

  describe('moveToTrash', () => {
    it('sets status to TRASH when INBOX', () => {
      const item = makeCapturedItem();
      item.moveToTrash();
      expect(item.status).toBe(CapturedItemStatus.TRASH);
    });

    it('throws ItemAlreadyResolvedError when not INBOX', () => {
      const item = makeCapturedItem({ status: CapturedItemStatus.CLARIFIED_AS_PROJECT });
      expect(() => item.moveToTrash()).toThrow(ItemAlreadyResolvedError);
    });
  });

  it('all resolved statuses reject further transitions', () => {
    const resolved = [
      CapturedItemStatus.CLARIFIED_AS_ACTION,
      CapturedItemStatus.CLARIFIED_AS_PROJECT,
      CapturedItemStatus.REFERENCE,
      CapturedItemStatus.SOMEDAY,
      CapturedItemStatus.TRASH,
    ];
    for (const status of resolved) {
      expect(() => makeCapturedItem({ status }).clarifyAsAction()).toThrow(ItemAlreadyResolvedError);
    }
  });
});
