
class Waterline<T> extends AbstractModel<T> {
    private model: any;
  
    constructor(modelname: string, model: any) {
        super(modelname);
        if (!model) {
            throw new Error('Model instance must be provided.');
        }
        this.model = model;
    }
  
    async create(data: T): Promise<T> {
      return await this.model.create(data).fetch();
    }
  
    async findOne(id: string | number): Promise<T | null> {
      return await this.model.findOne({ id });
    }
  
    async find(criteria: Partial<T> = {}): Promise<T[]> {
      return await this.model.find(criteria);
    }
  
    async updateOne(id: string | number, data: Partial<T>): Promise<T | null> {
      return await this.model.updateOne({ id }).set(data);
    }
  
    async update(criteria: Partial<T>, data: Partial<T>): Promise<T[]> {
      return await this.model.update(criteria).set(data).fetch();
    }
  
    async destroyOne(id: string | number): Promise<T | null> {
      return await this.model.destroyOne({ id });
    }
  
    async destroy(criteria: Partial<T>): Promise<boolean> {
      const deletedRecords = await this.model.destroy(criteria).fetch();
      return deletedRecords.length > 0;
    }

    async count(criteria: Partial<T> = {}): Promise<number> {
        return await this.model.count(criteria);
    }
  }