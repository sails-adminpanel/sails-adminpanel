abstract class AbstractModel<T> {
  public readonly modelname: string;

  constructor(modelname: string) {
    this.modelname = modelname;
  }

  abstract create(data: T): Promise<T>;
  abstract findOne(id: string | number): Promise<T | null>;
  abstract find(criteria?: Partial<T>): Promise<T[]>;
  abstract updateOne(id: string | number, data: Partial<T>): Promise<T | null>;
  abstract update(criteria: Partial<T>, data: Partial<T>): Promise<T[]>;
  abstract destroyOne(id: string | number): Promise<T | null>;
  abstract destroy(criteria: Partial<T>): Promise<boolean>;
  abstract count(criteria?: Partial<T>): Promise<number>;

}