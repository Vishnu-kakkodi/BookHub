import { Client } from '@elastic/elasticsearch';

const elasticClient = new Client({
  node: 'http://192.168.56.171:9200', // Ensure the URL is correct
});

export default elasticClient;
