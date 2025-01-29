// import { Client } from '@elastic/elasticsearch';

// class ElasticsearchClient {
//   private static instance: Client;

//   private constructor() {}

//   public static getInstance(): Client {
//     if (!ElasticsearchClient.instance) {
//       ElasticsearchClient.instance = new Client({
//         node: 'https://localhost:9200',
//         maxRetries: 5, // Increase retry attempts
//         requestTimeout: 60000 // Increased timeout (60 seconds)
//       });
//     }
//     return ElasticsearchClient.instance;
//   }
// }

// export default ElasticsearchClient;


import fs from 'fs';
import { Client } from '@elastic/elasticsearch';

class ElasticsearchClient {
  private static instance: Client;

  private constructor() {}

  public static getInstance(): Client {
    if (!ElasticsearchClient.instance) {
      ElasticsearchClient.instance = new Client({
        node: 'https://localhost:9200',
        auth: {
          username: 'elastic',
          password: '5FYnQp82uuifl6UcpEa1',
        },
        tls: {
          ca: fs.readFileSync("C:/Users/kakkodi/Desktop/BookHub/Backend/src/http_ca.crt"), // Load the certificate
        },
      });
    }
    return ElasticsearchClient.instance;
  }
}

export default ElasticsearchClient;
