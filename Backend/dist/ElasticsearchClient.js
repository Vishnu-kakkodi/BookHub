"use strict";
// import { Client } from '@elastic/elasticsearch';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const fs_1 = __importDefault(require("fs"));
const elasticsearch_1 = require("@elastic/elasticsearch");
class ElasticsearchClient {
    constructor() { }
    static getInstance() {
        if (!ElasticsearchClient.instance) {
            ElasticsearchClient.instance = new elasticsearch_1.Client({
                node: 'https://localhost:9200',
                auth: {
                    username: 'elastic',
                    password: '5FYnQp82uuifl6UcpEa1',
                },
                tls: {
                    ca: fs_1.default.readFileSync("C:/Users/kakkodi/Desktop/BookHub/Backend/src/http_ca.crt"), // Load the certificate
                },
            });
        }
        return ElasticsearchClient.instance;
    }
}
exports.default = ElasticsearchClient;
//# sourceMappingURL=ElasticsearchClient.js.map