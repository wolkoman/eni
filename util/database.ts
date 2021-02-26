import { Collection, MongoClient, ObjectId as MongoObjectId } from "mongodb";

export class Entity {
  _collectionName: string = "";
  _id: string = "";
}
export class ConfigEntity extends Entity {
  _collectionName: string = "config";
  type: string = "";
  data: any;
}
export class DatabaseService {
  static client?: MongoClient;
  static collections: Record<string, Collection> = {};

  private static async getClient(): Promise<MongoClient> {
    if (!DatabaseService.client) {
      console.log("Connecting");
      const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
      const mongoClient = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      DatabaseService.client = await mongoClient.connect().catch(x => {console.log("client connect",x);return x});
    }
    return DatabaseService.client!;
  }

  static async getCollection<E extends Entity>(entity: {
    new (): E;
  }): Promise<Collection<E>> {
    const collectionName = new entity()._collectionName;
    if (!DatabaseService.collections[collectionName] || true) {
      const client = await DatabaseService.getClient();
      const collection = client
        .db(process.env.MONGO_DB)
        .collection<E>(collectionName);
      DatabaseService.collections[collectionName] = collection;
    }
    return DatabaseService.collections[collectionName];
  }

  static async close() {
    if (DatabaseService.client && DatabaseService.client.isConnected) {
      await DatabaseService.client.close().catch(() => console.log("error closing"));
      DatabaseService.client = undefined;
    }else{
      console.error("Database not closing");
    }
  }
}

export function ObjectId(id: string) {
  let moi = MongoObjectId as any;
  return moi(id);
}
