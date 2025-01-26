import { Client } from '@elastic/elasticsearch';

class ElasticsearchClient {
  private static instance: Client;

  private constructor() {}

  public static getInstance(): Client {
    if (!ElasticsearchClient.instance) {
      ElasticsearchClient.instance = new Client({
        node: 'http://192.168.56.171:9200',
        maxRetries: 5, // Increase retry attempts
        requestTimeout: 60000 // Increased timeout (60 seconds)
      });
    }
    return ElasticsearchClient.instance;
  }
}

export default ElasticsearchClient;
