export class Forbidden extends Error {
  constructor() {
    super("Cannot update unowned post");
  }
}
